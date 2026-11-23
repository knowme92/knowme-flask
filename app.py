import os
import re
import ipaddress
import uuid
import math
import time

from datetime import timedelta
from functools import wraps
from urllib.parse import urlsplit, urlencode

from dotenv import load_dotenv

from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    session,
    abort,
    Response,
)

from flask_wtf.csrf import CSRFProtect

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from werkzeug.security import check_password_hash
from werkzeug.exceptions import RequestEntityTooLarge
from werkzeug.middleware.proxy_fix import ProxyFix

from database import SessionLocal
from models import ContactMessage, ProjectRequest
from system_prompt import KNOWME_SYSTEM_PROMPT
from ai_quota import (
    AIQuotaLimits,
    AIQuotaManager,
    ContextTooLarge,
    QuotaRejected,
    QuotaStorageUnavailable,
    MAX_CHAT_MESSAGE_CHARS,
    MAX_CHAT_MESSAGES,
    MAX_CHAT_TOTAL_CHARS,
    build_chat_context,
)
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

from flask import jsonify



# =========================================================
# ENV
# =========================================================

load_dotenv()
# =========================================================
# OPENROUTER CONFIGURATION
# =========================================================

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

OPENROUTER_API_URL = (
    "https://openrouter.ai/api/v1/chat/completions"
)

OPENROUTER_MODEL = os.getenv(
    "OPENROUTER_MODEL",
    "openrouter/free"
)


# =========================================================
# APP
# =========================================================

app = Flask(__name__)


app.secret_key = os.getenv("SECRET_KEY")

IS_PRODUCTION = (
    os.getenv("RENDER", "").strip().lower() == "true"
    or os.getenv("APP_ENV", "").strip().lower() == "production"
)

RATE_LIMIT_STORAGE_URI = os.getenv("RATELIMIT_STORAGE_URI", "").strip()
if IS_PRODUCTION and not RATE_LIMIT_STORAGE_URI:
    raise RuntimeError(
        "RATELIMIT_STORAGE_URI must point to a shared rate-limit store in production"
    )
if not RATE_LIMIT_STORAGE_URI:
    RATE_LIMIT_STORAGE_URI = "memory://"

trusted_proxy_setting = os.getenv("AI_TRUSTED_PROXY_COUNT")
if IS_PRODUCTION and trusted_proxy_setting is None:
    raise RuntimeError(
        "AI_TRUSTED_PROXY_COUNT must be set to the verified trusted proxy count in production"
    )
try:
    TRUSTED_PROXY_COUNT = int(trusted_proxy_setting or "0")
except ValueError as error:
    raise RuntimeError("AI_TRUSTED_PROXY_COUNT must be a non-negative integer") from error
if TRUSTED_PROXY_COUNT < 0:
    raise RuntimeError("AI_TRUSTED_PROXY_COUNT must be a non-negative integer")

# Trust forwarded address/protocol values only when the deployment has an
# explicitly configured proxy count. Local development trusts no request headers.
app.wsgi_app = ProxyFix(
    app.wsgi_app,
    x_for=TRUSTED_PROXY_COUNT,
    x_proto=TRUSTED_PROXY_COUNT,
    x_host=0,
    x_port=0,
    x_prefix=0,
)

# =========================================================
# RATE LIMITING
# =========================================================

limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    storage_uri=RATE_LIMIT_STORAGE_URI,
    headers_enabled=True
)


if not app.secret_key:
    raise RuntimeError(
        "SECRET_KEY is not configured"
    )


ADMIN_USERNAME = os.getenv(
    "ADMIN_USERNAME"
)

ADMIN_PASSWORD_HASH = os.getenv(
    "ADMIN_PASSWORD_HASH"
)


if not ADMIN_USERNAME:
    raise RuntimeError(
        "ADMIN_USERNAME is not configured"
    )


if not ADMIN_PASSWORD_HASH:
    raise RuntimeError(
        "ADMIN_PASSWORD_HASH is not configured"
    )


AI_QUOTA_LIMITS = AIQuotaLimits.from_env()
AI_QUOTA_HMAC_SECRET = os.getenv("AI_QUOTA_HMAC_SECRET") or app.secret_key
ai_quota_manager = AIQuotaManager(
    SessionLocal,
    hmac_secret=AI_QUOTA_HMAC_SECRET,
    limits=AI_QUOTA_LIMITS,
)


# =========================================================
# CLOUDFLARE TURNSTILE
# =========================================================

TURNSTILE_SITE_KEY = os.getenv("TURNSTILE_SITE_KEY", "").strip()
TURNSTILE_SECRET_KEY = os.getenv("TURNSTILE_SECRET_KEY", "").strip()
TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

if bool(TURNSTILE_SITE_KEY) != bool(TURNSTILE_SECRET_KEY):
    raise RuntimeError(
        "TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY must both be configured"
    )

TURNSTILE_ENABLED = bool(TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY)

if IS_PRODUCTION and not TURNSTILE_ENABLED:
    raise RuntimeError(
        "Cloudflare Turnstile keys are required in production"
    )

TURNSTILE_ALLOWED_HOSTNAMES = {
    hostname.strip().lower()
    for hostname in os.getenv(
        "TURNSTILE_ALLOWED_HOSTNAMES",
        "knowme-studio.onrender.com"
    ).split(",")
    if hostname.strip()
}

if not IS_PRODUCTION:
    TURNSTILE_ALLOWED_HOSTNAMES.update({"localhost", "127.0.0.1", "::1"})


def verify_turnstile(token, expected_action):
    """Validate a single-use Turnstile token with Cloudflare Siteverify."""

    # Local development can run without production credentials. Render is
    # fail-closed because startup rejects a missing key pair above.
    if not TURNSTILE_ENABLED:
        return True

    if not isinstance(token, str):
        return False

    token = token.strip()
    if not token or len(token) > 2048:
        return False

    payload = urlencode({
        "secret": TURNSTILE_SECRET_KEY,
        "response": token,
    }).encode("utf-8")

    siteverify_request = Request(
        TURNSTILE_VERIFY_URL,
        data=payload,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(siteverify_request, timeout=8) as response:
            result = json.loads(response.read(16384).decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, ValueError) as error:
        app.logger.warning(
            "Cloudflare Turnstile Siteverify request failed: %s",
            type(error).__name__,
        )
        return False

    if not isinstance(result, dict) or result.get("success") is not True:
        error_codes = result.get("error-codes", []) if isinstance(result, dict) else []
        app.logger.info(
            "Cloudflare Turnstile rejected action %s: %s",
            expected_action,
            error_codes,
        )
        return False

    hostname = str(result.get("hostname", "")).strip().lower()
    if hostname not in TURNSTILE_ALLOWED_HOSTNAMES:
        app.logger.warning(
            "Cloudflare Turnstile hostname mismatch for action %s",
            expected_action,
        )
        return False

    if result.get("action") != expected_action:
        app.logger.warning(
            "Cloudflare Turnstile action mismatch; expected %s",
            expected_action,
        )
        return False

    return True


@app.context_processor
def inject_turnstile_context():
    return {
        "turnstile_site_key": TURNSTILE_SITE_KEY if TURNSTILE_ENABLED else None
    }


# =========================================================
# SESSION SECURITY
# =========================================================

app.config["SESSION_COOKIE_HTTPONLY"] = True

app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

# LOCAL DEVELOPMENT
app.config["SESSION_COOKIE_SECURE"] = (
    os.getenv("SESSION_COOKIE_SECURE", "false").strip().lower()
    in {"1", "true", "yes", "on"}
)

app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(
    minutes=30
)


# =========================================================
# CSRF
# =========================================================

csrf = CSRFProtect(app)


# =========================================================
# ADMIN DECORATOR
# =========================================================

def admin_required(view_function):

    @wraps(view_function)
    def wrapper(*args, **kwargs):

        if not session.get(
            "admin_logged_in"
        ):

            return redirect(
                url_for(
                    "admin_login"
                )
            )

        return view_function(
            *args,
            **kwargs
        )

    return wrapper


# =========================================================
# HOME
# =========================================================
SITE_URL = "https://knowme-studio.onrender.com"


@app.route("/robots.txt")
def robots_txt():

    robots = f"""User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/login
Sitemap: {SITE_URL}/sitemap.xml
"""

    return Response(
        robots,
        mimetype="text/plain"
    )


@app.route("/sitemap.xml")
def sitemap():
    pages = [
        "/why-knowme",
        "/home",
        "/prices",
        "/projects",
        "/contact",
    ]

    urls = ""

    for page in pages:

        urls += f"""
        <url>
            <loc>{SITE_URL}{page}</loc>
        </url>
        """

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
        {urls}
    </urlset>
    """

    return Response(
        xml,
        mimetype="application/xml"
    )



@app.route("/")
def landing():
    return redirect(
        url_for("why_knowme"),
        code=301
    )


@app.route("/home")
def home():
    return render_template("home.html")



# =========================================================
# PRICES
# =========================================================

@app.route("/prices")
def prices():

    return render_template(
        "prices.html"
    )


# =========================================================
# PROJECTS
# =========================================================

@app.route("/projects")
def projects():

    return render_template(
        "projects.html"
    )


# =========================================================
# CONTACT
# =========================================================

@app.route(
    "/contact",
    methods=["GET", "POST"]
)
@limiter.limit(
    "5 per minute; 30 per hour",
    methods=["POST"]
)
def contact():

    if request.method == "POST":

        if not verify_turnstile(
                request.form.get("cf-turnstile-response") or "",
            "contact",
        ):
            flash(
                "Verification failed or expired. Please complete the security check and try again.",
                "error",
            )
            return redirect(url_for("contact"))

        name = request.form.get(
            "name",
            ""
        ).strip()

        email = request.form.get(
            "email",
            ""
        ).strip()

        message = request.form.get(
            "message",
            ""
        ).strip()


        # =================================================
        # VALIDATION
        # =================================================

        if not name:

            flash(
                "Please enter your name.",
                "error"
            )

            return redirect(
                url_for("contact")
            )


        if len(name) > 80:

            flash(
                "Name is too long.",
                "error"
            )

            return redirect(
                url_for("contact")
            )


        if not email:

            flash(
                "Please enter your email.",
                "error"
            )

            return redirect(
                url_for("contact")
            )


        if len(email) > 120:

            flash(
                "Email is too long.",
                "error"
            )

            return redirect(
                url_for("contact")
            )


        if (
            "@" not in email
            or "." not in email
        ):

            flash(
                "Please enter a valid email.",
                "error"
            )

            return redirect(
                url_for("contact")
            )


        if not message:

            flash(
                "Please enter your message.",
                "error"
            )

            return redirect(
                url_for("contact")
            )


        if len(message) > 3000:

            flash(
                "Message is too long.",
                "error"
            )

            return redirect(
                url_for("contact")
            )


        # =================================================
        # DATABASE INSERT
        # =================================================

        try:

            with SessionLocal() as db:

                new_message = ContactMessage(
                    name=name,
                    email=email,
                    message=message
                )

                db.add(
                    new_message
                )

                db.commit()


        except SQLAlchemyError:

            app.logger.exception(
                "Failed to save contact message"
            )

            flash(
                "Something went wrong. Please try again.",
                "error"
            )

            return redirect(
                url_for("contact")
            )


        flash(
            "Your message was sent successfully.",
            "success"
        )

        return redirect(
            url_for("contact")
        )


    return render_template(
        "contact.html"
    )



# =========================================================
# START PROJECT — WEBSITE BRIEF
# GET renders the wizard; POST validates and stores the request.
# =========================================================

PROJECT_WEBSITE_TYPES = {
    "business", "portfolio", "ecommerce", "landing", "webapp", "other"
}
PROJECT_GOALS = {
    "leads", "sales", "booking", "personal-brand", "information", "other"
}
PROJECT_STYLES = {
    "modern", "minimal", "corporate", "luxury", "creative", "futuristic", "reference"
}
PROJECT_LAYOUT_STYLES = {"balanced", "editorial", "grid", "immersive"}
PROJECT_FONT_STYLES = {"modern", "geometric", "editorial", "technical"}
PROJECT_ANIMATION_LEVELS = {"subtle", "expressive", "none"}
PROJECT_SECURITY_REQUIREMENTS = {
    "mfa", "role-based-access", "audit-logs", "backups", "privacy-controls", "payment-protection"
}
PROJECT_PAGE_SCOPES = {"one", "3-5", "6-10", "10-plus", "unsure"}
PROJECT_REQUIRED_PAGES = {
    "home", "about", "services", "projects", "pricing", "blog", "contact", "faq", "shop", "other"
}
PROJECT_FEATURES = {
    "contact-form", "accounts", "admin-panel", "payments", "booking",
    "multilingual", "blog", "search", "newsletter", "api", "seo",
    "animations", "chat"
}
PROJECT_BUDGETS = {"under-100k", "100-250k", "250-500k", "500-plus", "discuss"}
PROJECT_DEADLINES = {"asap", "2-weeks", "1-month", "flexible"}

# Free 3D assets offered INSIDE the Start Project configurator.
# Add only assets whose redistribution license has been verified.
# Each item: id, title, description, category, preview_image, file, format, license.
# The catalog remains empty until the owner supplies the actual model files.
START_PROJECT_3D_MODELS = []


def _project_form_error(message, form_data):
    flash(message, "error")
    return render_template(
        "start-project.html",
        form_data=form_data,
        project_3d_models=START_PROJECT_3D_MODELS
    ), 400


@app.route(
    "/start-project",
    methods=["GET", "POST"]
)
@limiter.limit(
    "5 per minute; 20 per hour",
    methods=["POST"]
)
def start_project():

    if request.method == "GET":
        return render_template(
            "start-project.html",
            form_data=request.form,
            project_3d_models=START_PROJECT_3D_MODELS
        )

    form_data = request.form

    # Quiet honeypot: automated bots often fill every field.
    # Do not store the submission or disclose the trap.
    if form_data.get("website_check", "").strip():
        flash(
            "Your project request has been received. We will review it and contact you.",
            "success"
        )
        return redirect(url_for("start_project"), code=303)

    if not verify_turnstile(
        form_data.get("cf-turnstile-response") or "",
        "start_project",
    ):
        return _project_form_error(
            "Verification failed or expired. Please complete the security check and submit again.",
            form_data,
        )

    full_name = form_data.get("full_name", "").strip()
    email = form_data.get("email", "").strip()
    phone = form_data.get("phone", "").strip()
    company = form_data.get("company", "").strip()

    website_type = form_data.get("website_type", "").strip()
    website_goal = form_data.get("website_goal", "").strip()
    design_style = form_data.get("design_style", "").strip()
    pages_scope = form_data.get("pages_scope", "").strip()
    layout_style = form_data.get("layout_style", "balanced").strip()
    font_style = form_data.get("font_style", "modern").strip()
    animation_level = form_data.get("animation_level", "subtle").strip()
    preferred_domain = form_data.get("preferred_domain", "").strip()
    security_requirements = form_data.getlist("security_requirements")
    budget = form_data.get("budget", "").strip()
    deadline = form_data.get("deadline", "").strip()

    required_pages = form_data.getlist("required_pages")
    features = form_data.getlist("features")
    selected_3d_model_ids = form_data.getlist("selected_3d_models")

    primary_color = form_data.get("primary_color", "#ef4444").strip().lower()
    secondary_color = form_data.get("secondary_color", "#006eff").strip().lower()
    reference_url = form_data.get("reference_url", "").strip()
    target_audience = form_data.get("target_audience", "").strip()
    description = form_data.get("description", "").strip()

    # Validate contact fields.
    if not full_name or len(full_name) > 80:
        return _project_form_error("Enter your name (maximum 80 characters).", form_data)

    if (
        not email
        or len(email) > 120
        or not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email)
    ):
        return _project_form_error("Enter a valid email address (maximum 120 characters).", form_data)

    if len(phone) > 40:
        return _project_form_error("Phone number is too long.", form_data)

    if len(company) > 120:
        return _project_form_error("Company name is too long.", form_data)

    # Validate all single-choice values against server-side allow-lists.
    if website_type not in PROJECT_WEBSITE_TYPES:
        return _project_form_error("Choose a valid website type.", form_data)

    if website_goal not in PROJECT_GOALS:
        return _project_form_error("Choose the main goal of the website.", form_data)

    if design_style not in PROJECT_STYLES:
        return _project_form_error("Choose a design style.", form_data)

    if pages_scope not in PROJECT_PAGE_SCOPES:
        return _project_form_error("Choose the expected website size.", form_data)

    if layout_style not in PROJECT_LAYOUT_STYLES:
        return _project_form_error("Choose a valid page composition.", form_data)

    if font_style not in PROJECT_FONT_STYLES:
        return _project_form_error("Choose a valid typography direction.", form_data)

    if animation_level not in PROJECT_ANIMATION_LEVELS:
        return _project_form_error("Choose a valid motion preference.", form_data)

    if (
        len(security_requirements) > len(PROJECT_SECURITY_REQUIREMENTS)
        or len(security_requirements) != len(set(security_requirements))
        or any(value not in PROJECT_SECURITY_REQUIREMENTS for value in security_requirements)
    ):
        return _project_form_error("One or more security requirements are invalid.", form_data)

    if preferred_domain:
        if len(preferred_domain) > 253 or any(char.isspace() for char in preferred_domain) or "://" in preferred_domain or "/" in preferred_domain:
            return _project_form_error("Enter a domain name only, without a protocol or path.", form_data)
        try:
            ascii_domain = preferred_domain.rstrip(".").encode("idna").decode("ascii").lower()
            labels = ascii_domain.split(".")
            valid_domain = (
                len(ascii_domain) <= 253
                and len(labels) >= 2
                and all(
                    1 <= len(label) <= 63
                    and re.fullmatch(r"[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", label)
                    for label in labels
                )
                and (
                    re.fullmatch(r"[a-z]{2,63}", labels[-1]) is not None
                    or (labels[-1].startswith("xn--") and len(labels[-1]) <= 63)
                )
            )
        except UnicodeError:
            valid_domain = False
            ascii_domain = ""
        if not valid_domain:
            return _project_form_error("Enter a valid domain, for example yourbrand.com.", form_data)
        preferred_domain = ascii_domain

    if budget not in PROJECT_BUDGETS:
        return _project_form_error("Choose a budget range or select that you want to discuss it.", form_data)

    if deadline not in PROJECT_DEADLINES:
        return _project_form_error("Choose an expected timeline.", form_data)

    # Reject unknown values instead of silently storing unexpected form data.
    if (
        not required_pages
        or len(required_pages) > 10
        or any(value not in PROJECT_REQUIRED_PAGES for value in required_pages)
    ):
        return _project_form_error("Choose at least one required page or section.", form_data)

    if (
        len(features) > len(PROJECT_FEATURES)
        or any(value not in PROJECT_FEATURES for value in features)
    ):
        return _project_form_error("One or more selected features are invalid.", form_data)

    # A user can submit only IDs that exist in the server-side free model catalogue.
    available_3d_models = {
        str(model.get("id")): model
        for model in START_PROJECT_3D_MODELS
        if model.get("id") and model.get("title")
    }
    if (
        len(selected_3d_model_ids) > 12
        or len(selected_3d_model_ids) != len(set(selected_3d_model_ids))
        or any(model_id not in available_3d_models for model_id in selected_3d_model_ids)
    ):
        return _project_form_error("One or more selected 3D models are not available.", form_data)

    selected_3d_models = [
        {
            "id": model_id,
            "title": str(available_3d_models[model_id].get("title", ""))[:120],
            "category": str(available_3d_models[model_id].get("category", ""))[:60],
            "license": str(available_3d_models[model_id].get("license", ""))[:180],
        }
        for model_id in selected_3d_model_ids
    ]

    if not re.fullmatch(r"#[0-9a-f]{6}", primary_color):
        return _project_form_error("Choose a valid primary color.", form_data)

    if not re.fullmatch(r"#[0-9a-f]{6}", secondary_color):
        return _project_form_error("Choose a valid secondary color.", form_data)

    if len(target_audience) > 500:
        return _project_form_error("Audience description is too long (maximum 500 characters).", form_data)

    if len(description) < 20 or len(description) > 3000:
        return _project_form_error("Describe the project in at least 20 and no more than 3,000 characters.", form_data)

    if reference_url:
        if len(reference_url) > 500:
            return _project_form_error("Reference link is too long.", form_data)
        try:
            parsed_reference = urlsplit(reference_url)
            valid_reference = (
                parsed_reference.scheme in {"http", "https"}
                and bool(parsed_reference.netloc)
                and not any(char.isspace() for char in reference_url)
            )
        except ValueError:
            valid_reference = False

        if not valid_reference:
            return _project_form_error("Reference link must be a valid http:// or https:// URL.", form_data)

    if form_data.get("consent") != "yes":
        return _project_form_error("Please confirm that KNOWME Studio may contact you about this request.", form_data)

    # Store only explicitly accepted values. Jinja auto-escaping protects later admin rendering.
    new_request = ProjectRequest(
        full_name=full_name,
        email=email,
        phone=phone,
        company=company,
        website_type=website_type,
        website_goal=website_goal,
        design_style=design_style,
        pages_scope=pages_scope,
        layout_style=layout_style,
        font_style=font_style,
        animation_level=animation_level,
        preferred_domain=preferred_domain,
        security_requirements=security_requirements,
        required_pages=required_pages,
        features=features,
        selected_3d_models=selected_3d_models,
        primary_color=primary_color,
        secondary_color=secondary_color,
        reference_url=reference_url,
        target_audience=target_audience,
        budget=budget,
        deadline=deadline,
        description=description
    )

    try:
        with SessionLocal() as db:
            db.add(new_request)
            db.commit()

    except SQLAlchemyError:
        app.logger.exception("Failed to save project request")
        return _project_form_error(
            "We could not save your request right now. Please try again later.",
            form_data
        )

    flash(
        "Your project brief has been sent successfully. KNOWME Studio will review it and contact you.",
        "success"
    )

    return redirect(
        url_for("start_project"),
        code=303
    )


# =========================================================
# ADMIN LOGIN
# =========================================================

@app.route(
    "/admin/login",
    methods=["GET", "POST"]
)
@limiter.limit(
    "5 per minute; 20 per hour",
    methods=["POST"]
)
def admin_login():

    if session.get(
        "admin_logged_in"
    ):

        return redirect(
            url_for("admin")
        )


    if request.method == "POST":

        username = request.form.get(
            "username",
            ""
        ).strip()

        password = request.form.get(
            "password",
            ""
        )


        username_is_valid = (
            username
            == ADMIN_USERNAME
        )


        password_is_valid = (
            check_password_hash(
                ADMIN_PASSWORD_HASH,
                password
            )
        )


        if (
            username_is_valid
            and password_is_valid
        ):

            # old session data clear
            session.clear()

            session[
                "admin_logged_in"
            ] = True

            session.permanent = True


            return redirect(
                url_for("admin")
            )


        flash(
            "Invalid username or password.",
            "error"
        )


    return render_template(
        "admin_login.html"
    )


# =========================================================
# ADMIN DASHBOARD
# =========================================================

@app.route("/admin")
@admin_required
def admin():

    try:

        with SessionLocal() as db:

            statement = (
                select(
                    ContactMessage
                )
                .order_by(
                    ContactMessage
                    .created_at
                    .desc()
                )
            )


            messages = (
                db
                .scalars(statement)
                .all()
            )


            project_requests_statement = (
                select(ProjectRequest)
                .order_by(ProjectRequest.created_at.desc())
                .limit(100)
            )

            project_requests = (
                db
                .scalars(project_requests_statement)
                .all()
            )

            return render_template(
                "admin.html",
                messages=messages,
                project_requests=project_requests
            )


    except SQLAlchemyError:

        app.logger.exception(
            "Failed to load admin messages"
        )

        return (
            "Database error",
            500
        )


# =========================================================
# ADMIN LOGOUT
# =========================================================

@app.post("/admin/logout")
@admin_required
def admin_logout():

    session.clear()

    return redirect(
        url_for(
            "admin_login"
        )
    )
# =========================================================
# ADMIN - TOGGLE READ STATUS
# =========================================================

@app.post(
    "/admin/messages/<int:message_id>/toggle-read"
)
@limiter.limit("30 per minute")
@admin_required
def toggle_message_read(message_id):

    try:

        with SessionLocal() as db:

            message = db.get(
                ContactMessage,
                message_id
            )

            if message is None:
                abort(404)

            message.is_read = (
                not message.is_read
            )

            db.commit()

    except SQLAlchemyError:

        app.logger.exception(
            "Failed to update message"
        )

        flash(
            "Could not update the message.",
            "error"
        )

    return redirect(
        url_for("admin")
    )

# =========================================================
# ADMIN - DELETE MESSAGE
# =========================================================

@app.post(
    "/admin/messages/<int:message_id>/delete"
)
@limiter.limit("20 per minute")
@admin_required
def delete_message(message_id):

    try:

        with SessionLocal() as db:

            message = db.get(
                ContactMessage,
                message_id
            )

            if message is None:
                abort(404)

            db.delete(message)

            db.commit()

        flash(
            "Message deleted successfully.",
            "success"
        )

    except SQLAlchemyError:

        app.logger.exception(
            "Failed to delete message"
        )

        flash(
            "Could not delete the message.",
            "error"
        )

    return redirect(
        url_for("admin")
    )
@app.errorhandler(429)
def rate_limit_exceeded(error):

    message = "Too many requests. Please try again later."

    if request.path == "/api/chat":
        retry_after = 60
        try:
            current_limit = limiter.current_limit
            if current_limit is not None:
                retry_after = max(1, math.ceil(current_limit.reset_at - time.time()))
        except Exception:
            response = error.get_response()
            try:
                retry_after = max(1, int(response.headers.get("Retry-After", 60)))
            except (TypeError, ValueError):
                retry_after = 60
        return jsonify({
            "error": message,
            "error_code": "AI_RATE_LIMITED",
            "retry_after": retry_after,
        }), 429

    return message, 429
# =========================================================
# SECURITY HEADERS
# =========================================================

@app.after_request
def add_security_headers(response):

    # =====================================================
    # CONTENT SECURITY POLICY
    # =====================================================

    response.headers[
        "Content-Security-Policy"
    ] = (
        "default-src 'self'; "
        "script-src 'self' https://challenges.cloudflare.com; "
        "frame-src 'self' https://challenges.cloudflare.com; "
        "style-src 'self'; "
        "font-src 'self'; "
        "media-src 'self'; "
        "object-src 'none'; "
        "base-uri 'self'; "
        "frame-ancestors 'none'; "
        "form-action 'self';"
        "img-src 'self' data: blob:;"
        "connect-src 'self' blob: https://challenges.cloudflare.com;"
    )


    # =====================================================
    # MIME SNIFFING
    # =====================================================

    response.headers[
        "X-Content-Type-Options"
    ] = "nosniff"


    # =====================================================
    # CLICKJACKING
    # =====================================================

    response.headers[
        "X-Frame-Options"
    ] = "DENY"


    # =====================================================
    # REFERRER POLICY
    # =====================================================

    response.headers[
        "Referrer-Policy"
    ] = "strict-origin-when-cross-origin"


    # =====================================================
    # BROWSER FEATURES
    # =====================================================

    response.headers[
        "Permissions-Policy"
    ] = (
        "camera=(), "
        "microphone=(), "
        "geolocation=()"
    )


    # =====================================================
    # ADMIN SHOULD NOT BE CACHED
    # =====================================================

    if request.path.startswith("/admin"):

        response.headers[
            "Cache-Control"
        ] = (
            "no-store, "
            "no-cache, "
            "must-revalidate, "
            "max-age=0"
        )


    # =====================================================
    # HSTS - HTTPS ONLY
    # =====================================================

    forwarded_https = (
        request.headers
        .get("X-Forwarded-Proto", "")
        .split(",")[0]
        .strip()
        == "https"
    )


    if (
        request.is_secure
        or forwarded_https
    ):

        response.headers[
            "Strict-Transport-Security"
        ] = (
            "max-age=31536000; "
            "includeSubDomains"
        )


    return response
# =========================================================
# OPENROUTER AI CHAT API
# =========================================================

def _client_ip_for_quota():
    """Use only the socket address after explicitly configured ProxyFix handling."""
    value = request.remote_addr

    if not isinstance(value, str) or not value:
        return "unknown"
    try:
        return ipaddress.ip_address(value).compressed
    except (TypeError, ValueError):
        # A stable fail-closed bucket is safer than reading a client-supplied header.
        return "unknown"


def _valid_openrouter_usage(result):
    usage = result.get("usage") if isinstance(result, dict) else None
    if not isinstance(usage, dict):
        return None
    values = [usage.get("prompt_tokens"), usage.get("completion_tokens"), usage.get("total_tokens")]
    if any(isinstance(value, bool) or not isinstance(value, int) or value < 0 for value in values):
        return None
    prompt_tokens = usage.get("prompt_tokens")
    completion_tokens = usage.get("completion_tokens")
    total_tokens = usage.get("total_tokens")

    if (
            isinstance(prompt_tokens, bool)
            or not isinstance(prompt_tokens, int)
            or prompt_tokens < 0
    ):
        return None

    if (
            isinstance(completion_tokens, bool)
            or not isinstance(completion_tokens, int)
            or completion_tokens < 0
    ):
        return None

    if (
            isinstance(total_tokens, bool)
            or not isinstance(total_tokens, int)
            or total_tokens < 0
    ):
        return None
    return {
        "prompt_tokens": prompt_tokens,
        "completion_tokens": completion_tokens,
        "total_tokens": total_tokens,
    }


def _ai_quota_response(error_code, retry_after, status=None):
    if error_code == "AI_CONTEXT_TOO_LARGE":
        message = "This request is too large for the available AI context. Shorten the latest message and try again."
        status = status or 413
    elif error_code == "AI_QUOTA_TEMPORARY_FAILURE":
        message = "KNOWME AI is temporarily unavailable. Please try again shortly."
        status = status or 503
    else:
        message = "KNOWME AI daily usage limit reached."
        status = status or 429
    return jsonify({
        "error": message,
        "error_code": error_code,
        "retry_after": max(0, int(retry_after)),
    }), status


@app.post("/api/chat")
@limiter.limit("10 per minute")
def openrouter_chat():

    if not OPENROUTER_API_KEY:
        app.logger.error(
            "OPENROUTER_API_KEY is not configured"
        )

        return jsonify({
            "error": "AI service is not configured."
        }), 503

    request.max_content_length = AI_QUOTA_LIMITS.max_input_bytes
    if request.content_length is not None and request.content_length > AI_QUOTA_LIMITS.max_input_bytes:
        return jsonify({"error": "AI request is too large.", "error_code": "AI_REQUEST_TOO_LARGE"}), 413
    try:
        request.get_data(cache=True)
    except RequestEntityTooLarge:
        return jsonify({"error": "AI request is too large.", "error_code": "AI_REQUEST_TOO_LARGE"}), 413

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Invalid JSON request."
        }), 400

    messages = data.get("messages")

    if not isinstance(messages, list) or not messages:
        return jsonify({
            "error": "Messages are required."
        }), 400

    if len(messages) > MAX_CHAT_MESSAGES:
        return jsonify({
            "error": "Too many messages.",
            "error_code": "AI_TOO_MANY_MESSAGES",
        }), 413

    validated_messages = []
    total_content_length = 0

    for message in messages:

        if not isinstance(message, dict):
            return jsonify({
                "error": "Invalid message format."
            }), 400

        role = message.get("role")
        content = message.get("content")

        if role not in ("user", "assistant"):
            return jsonify({
                "error": "Invalid message role."
            }), 400

        if not isinstance(content, str) or not content.strip():
            return jsonify({
                "error": "Message content is required."
            }), 400

        content = content.strip()

        if len(content) > MAX_CHAT_MESSAGE_CHARS:
            return jsonify({
                "error": "Message is too long.",
                "error_code": "AI_MESSAGE_TOO_LARGE",
            }), 413

        total_content_length += len(content)

        if total_content_length > MAX_CHAT_TOTAL_CHARS:
            return jsonify({
                "error": "Conversation is too long.",
                "error_code": "AI_CONVERSATION_TOO_LARGE",
            }), 413

        validated_messages.append({
            "role": role,
            "content": content
        })

    if validated_messages[-1]["role"] != "user":
        return jsonify({
            "error": "The latest message must be from the visitor.",
            "error_code": "AI_CURRENT_USER_REQUIRED",
        }), 400

    if not verify_turnstile(data.get("turnstile_token"), "chat"):
        return jsonify({
            "error": "Security verification failed or expired. Complete the Turnstile check and try again."
        }), 403

    try:
        context = build_chat_context(
            validated_messages,
            KNOWME_SYSTEM_PROMPT,
            AI_QUOTA_LIMITS,
            model=OPENROUTER_MODEL,
        )
    except ContextTooLarge:
        return _ai_quota_response("AI_CONTEXT_TOO_LARGE", 0)
    prompt_messages = context.messages
    expected_tokens = context.estimate.tokens + AI_QUOTA_LIMITS.max_output_tokens

    payload = {
        "model": OPENROUTER_MODEL,

        "messages": prompt_messages,

        "stream": False,
        "temperature": 0.7,
        "max_tokens": AI_QUOTA_LIMITS.max_output_tokens
    }

    visitor_id = session.get("ai_visitor_id")
    try:
        uuid.UUID(visitor_id)
    except (TypeError, ValueError, AttributeError):
        visitor_id = str(uuid.uuid4())
        session["ai_visitor_id"] = visitor_id

    try:
        reservation = ai_quota_manager.reserve(
            visitor_id=visitor_id,
            client_ip=_client_ip_for_quota(),
            expected_tokens=expected_tokens,
        )
    except QuotaRejected as error:
        if error.error_code == "AI_QUOTA_TEMPORARY_FAILURE":
            return _ai_quota_response(error.error_code, ai_quota_manager.retry_after_for_concurrency(), 503)
        return _ai_quota_response(error.error_code, error.retry_after, 429)
    except QuotaStorageUnavailable as error:
        app.logger.warning("AI quota reservation unavailable: %s", type(error).__name__)
        return _ai_quota_response("AI_QUOTA_TEMPORARY_FAILURE", 5, 503)

    api_request = Request(
        OPENROUTER_API_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        method="POST"
    )

    try:

        with urlopen(api_request, timeout=60) as response:

            result = json.loads(
                response.read().decode("utf-8")
            )

        if not isinstance(result, dict):
            raise ValueError("Invalid response structure")

        choices = result.get("choices")

        if not isinstance(choices, list) or not choices:
            raise ValueError("Missing choices")

        answer = (
            choices[0]
            .get("message", {})
            .get("content")
        )

        if not isinstance(answer, str) or not answer.strip():
            raise ValueError("Missing assistant response")

        try:
            ai_quota_manager.reconcile(
                reservation.request_id,
                status="success",
                usage=_valid_openrouter_usage(result),
            )
        except QuotaStorageUnavailable as error:
            app.logger.warning("AI quota reconciliation unavailable: %s", type(error).__name__)
            return _ai_quota_response("AI_QUOTA_TEMPORARY_FAILURE", 5, 503)

        return jsonify({
            "success": True,
            "model": result.get("model", OPENROUTER_MODEL),
            "reply": answer.strip()
        })

    except HTTPError as error:
        app.logger.warning("OpenRouter returned HTTP status %s", error.code)
        try:
            ai_quota_manager.reconcile(reservation.request_id, status="failure")
        except QuotaStorageUnavailable as reconcile_error:
            app.logger.warning("AI quota reconciliation unavailable: %s", type(reconcile_error).__name__)
            return _ai_quota_response("AI_QUOTA_TEMPORARY_FAILURE", 5, 503)

        if error.code == 429:
            return jsonify({
                "error": "KNOWME AI is temporarily unavailable. Please try again later.",
                "error_code": "AI_PROVIDER_RATE_LIMITED",
                "provider_status": 429,
            }), 503

        if error.code == 402:
            return jsonify({
                "error": "OpenRouter account has insufficient credits."
            }), 402

        return jsonify({
            "error": "OpenRouter rejected the request.",
            "provider_status": error.code
        }), 502

    except URLError as error:
        app.logger.warning("OpenRouter connection failed: %s", type(error.reason).__name__)
        try:
            ai_quota_manager.reconcile(reservation.request_id, status="failure")
        except QuotaStorageUnavailable as reconcile_error:
            app.logger.warning("AI quota reconciliation unavailable: %s", type(reconcile_error).__name__)
            return _ai_quota_response("AI_QUOTA_TEMPORARY_FAILURE", 5, 503)

        return jsonify({
            "error": "Could not connect to OpenRouter."
        }), 502

    except TimeoutError:
        app.logger.warning("OpenRouter request timed out")
        try:
            ai_quota_manager.reconcile(reservation.request_id, status="failure")
        except QuotaStorageUnavailable as reconcile_error:
            app.logger.warning("AI quota reconciliation unavailable: %s", type(reconcile_error).__name__)
            return _ai_quota_response("AI_QUOTA_TEMPORARY_FAILURE", 5, 503)

        return jsonify({
            "error": "AI request timed out."
        }), 504

    except (ValueError, KeyError, IndexError, TypeError):
        app.logger.warning("OpenRouter returned an invalid response structure")
        try:
            ai_quota_manager.reconcile(reservation.request_id, status="failure")
        except QuotaStorageUnavailable as reconcile_error:
            app.logger.warning("AI quota reconciliation unavailable: %s", type(reconcile_error).__name__)
            return _ai_quota_response("AI_QUOTA_TEMPORARY_FAILURE", 5, 503)

        return jsonify({
            "error": "Invalid response from OpenRouter."
        }), 502

    except Exception as error:
        app.logger.warning("OpenRouter request failed: %s", type(error).__name__)
        try:
            ai_quota_manager.reconcile(reservation.request_id, status="failure")
        except QuotaStorageUnavailable as reconcile_error:
            app.logger.warning("AI quota reconciliation unavailable: %s", type(reconcile_error).__name__)
            return _ai_quota_response("AI_QUOTA_TEMPORARY_FAILURE", 5, 503)

        return jsonify({
            "error": "Could not complete the AI request."
        }), 502

# =========================================================
# KNOWME AI — WEBSITE KNOWLEDGE
# =========================================================
# =========================================================
# KNOWME AI — COMPLETE WEBSITE KNOWLEDGE BASE
# =========================================================


# =========================================================
# WHY KNOWME
# =========================================================

@app.route("/why-knowme")
def why_knowme():

    return render_template(
        "why-knowme.html"
    )

# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )

