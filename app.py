import os

from datetime import timedelta
from functools import wraps

from dotenv import load_dotenv

from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    session,
abort
)

from flask_wtf.csrf import CSRFProtect

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError

from werkzeug.security import check_password_hash

from database import SessionLocal
from models import ContactMessage
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address


# =========================================================
# ENV
# =========================================================

load_dotenv()


# =========================================================
# APP
# =========================================================

app = Flask(__name__)


app.secret_key = os.getenv("SECRET_KEY")
# =========================================================
# RATE LIMITING
# =========================================================

limiter = Limiter(
    key_func=get_remote_address,
    app=app,
    storage_uri=os.getenv(
        "RATELIMIT_STORAGE_URI",
        "memory://"
    ),
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


# =========================================================
# SESSION SECURITY
# =========================================================

app.config["SESSION_COOKIE_HTTPONLY"] = True

app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

# LOCAL DEVELOPMENT
app.config["SESSION_COOKIE_SECURE"] = False

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

@app.route("/")
def home():

    return render_template(
        "home.html"
    )


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


            return render_template(
                "admin.html",
                messages=messages
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

    return (
        "Too many requests. Please try again later.",
        429
    )
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
        "script-src 'self'; "
        "style-src 'self'; "
        "img-src 'self' data:; "
        "font-src 'self'; "
        "media-src 'self'; "
        "connect-src 'self'; "
        "object-src 'none'; "
        "base-uri 'self'; "
        "frame-ancestors 'none'; "
        "form-action 'self';"
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
# RUN
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )