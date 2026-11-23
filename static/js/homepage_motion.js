/* KNOWME Studio homepage motion + Security Lab.
 * Isolated to #kmHome. The shared AI chat code and its DOM are not touched.
 */
(() => {
  "use strict";

  const root = document.getElementById("kmHome");
  if (!root) return;

  const UI = {
    en: {
      "hero.eyebrow":"INDEPENDENT DIGITAL STUDIO · ARMENIA",
      "hero.line1":"Digital experiences", "hero.line2":"engineered to perform.",
      "hero.description":"We design and build thoughtful websites and web applications — from the first interface to the systems that make them work.",
      "hero.projects":"Explore projects", "hero.start":"Start a project",
      "hero.proof":"DESIGN · ENGINEERING · SECURITY-MINDED BUILD", "hero.footerLeft":"DIGITAL PRODUCTS · BUILT WITH INTENT", "hero.scroll":"SCROLL TO EXPLORE",
      "work.kicker":"SELECTED WORK / 01—03", "work.title":"Built to be <em>experienced.</em>", "work.description":"A selection of KNOWME products and interactive systems. Explore the work, then open the project that interests you.", "work.drag":"DRAG OR SCROLL TO EXPLORE",
      "work.studioType":"DIGITAL PLATFORM · LIVE", "work.studioText":"A multilingual studio website with project workflows, service information and an integrated AI assistant.",
      "work.aiType":"WINDOWS APPLICATION · RELEASES", "work.aiText":"A desktop AI product with connected model providers, online services and a dedicated release channel.",
      "work.builderType":"INTERACTIVE EXPERIENCE · LIVE", "work.builderText":"A guided website brief with visual choices, project requirements and an interactive 3D environment.",
      "services.kicker":"WHAT WE ENGINEER", "services.title":"More than a page.<br><em>A working system.</em>", "services.description":"From polished interfaces to the logic behind them, each part is designed to serve a real user need.",
      "services.uiTitle":"Websites & digital experiences", "services.uiText":"Responsive, accessible interfaces with clear information architecture, deliberate visual hierarchy and interaction that supports the task.",
      "services.appTitle":"Web applications", "services.appText":"Interactive products with user flows, forms, accounts, dashboards and business logic.",
      "services.dataTitle":"Backend & data systems", "services.dataText":"Structured data, server-side workflows, integrations and maintainable application architecture.",
      "services.aiTitle":"AI integrations & custom tools", "services.aiText":"Practical AI features connected to real workflows, with controlled permissions, clear boundaries and attention to data handling.",
      "process.kicker":"A CLEAR PATH FROM IDEA TO LAUNCH", "process.title":"Think clearly.<br><em>Build deliberately.</em>", "process.description":"A focused process keeps the project understandable, testable and aligned with its purpose.",
      "process.step1Title":"Discover", "process.step1Text":"Define the audience, goals, constraints and the outcome the product must deliver.",
      "process.step2Title":"Design", "process.step2Text":"Shape the structure, interface, responsive behavior and interaction model.",
      "process.step3Title":"Engineer", "process.step3Text":"Connect frontend, backend, data and integrations into one coherent application.",
      "process.step4Title":"Verify & launch", "process.step4Text":"Test important flows, review security controls, fix defects and prepare deployment.",
      "security.kicker":"KNOWME / SECURITY LAB", "security.title":"Understand the threat.<br><em>Engineer the defence.</em>", "security.intro":"A practical guide to common web and AI application threats. Select a module to explore how the risk works, which controls reduce it and how those controls should be verified.",
      "security.modules":"SECURITY MODULES", "security.scrollHint":"SCROLL DOWN TO MOVE THROUGH THE BOOK", "security.reading":"READING THE SECURITY ARCHIVE", "security.chapter":"CHAPTER", "security.page":"PAGE", "security.how":"HOW THE RISK APPEARS", "security.verify":"HOW TO VERIFY", "security.controls":"DEFENCE CONTROLS", "security.reference":"REFERENCE", "security.disclaimer":"Educational overview only. These topics are not a claim that every control is deployed on every KNOWME project. Security must be designed, implemented and tested for each system.",
      "engineering.kicker":"THE SYSTEM BEHIND THE INTERFACE", "engineering.title":"One experience.<br><em>Many connected layers.</em>", "engineering.description":"A useful digital product needs more than a polished front end. Its interface, application logic, data layer, deployment and security controls have to work together.", "engineering.link":"Explore the work",
      "final.kicker":"HAVE A PROJECT IN MIND?", "final.title":"Let's make something<br><em>worth remembering.</em>", "final.description":"Bring the idea. We will shape the experience, define the system and build a solution around the people who will use it.", "final.start":"Start a project", "final.contact":"Talk to KNOWME", "final.bottom":"DESIGNED WITH INTENT · ENGINEERED WITH CARE", "final.top":"BACK TO TOP ↑",
      "previous":"Previous", "next":"Next", "source":"Open OWASP reference"
    },
    hy: {
      "hero.eyebrow":"ԱՆԿԱԽ ԹՎԱՅԻՆ ՍՏՈՒԴԻԱ · ՀԱՅԱՍՏԱՆ", "hero.line1":"Թվային փորձառություններ", "hero.line2":"ստեղծված իրական արդյունքի համար։",
      "hero.description":"Նախագծում և մշակում ենք մտածված կայքեր ու վեբ հավելվածներ՝ առաջին ինտերֆեյսից մինչև դրանք աշխատեցնող համակարգերը։",
      "hero.projects":"Դիտել նախագծերը", "hero.start":"Սկսել նախագիծ", "hero.proof":"ԴԻԶԱՅՆ · ԻՆԺԵՆԵՐԻԱ · ԱՆՎՏԱՆԳՈՒԹՅԱՆ ՄՏԱԾՈՂՈՒԹՅՈՒՆ",
      "hero.footerLeft":"ԹՎԱՅԻՆ ԱՐՏԱԴՐԱՆՔՆԵՐ · ՆՊԱՏԱԿԱՅԻՆ ՄՇԱԿՈՒՄ", "hero.scroll":"ՈՒՍՈՒՄՆԱՍԻՐԵԼ ԷՋԸ",
      "work.kicker":"ԸՆՏՐՎԱԾ ԱՇԽԱՏԱՆՔՆԵՐ / 01—03", "work.title":"Ստեղծված՝ <em>փորձառություն դառնալու համար։</em>", "work.description":"KNOWME-ի արտադրանքների և ինտերակտիվ համակարգերի ընտրանի։ Ուսումնասիրեք աշխատանքները և բացեք ձեզ հետաքրքրող նախագիծը։", "work.drag":"ՔԱՇԵՔ ԿԱՄ ՈԼՈՐԵՔ՝ ԴԻՏԵԼՈՒ ՀԱՄԱՐ",
      "work.studioType":"ԹՎԱՅԻՆ ՀԱՐԹԱԿ · ԳՈՐԾՈՂ", "work.studioText":"Բազմալեզու ստուդիայի կայք՝ նախագծերի աշխատանքային հոսքերով, ծառայությունների տեղեկատվությամբ և ինտեգրված AI օգնականով։",
      "work.aiType":"WINDOWS ՀԱՎԵԼՎԱԾ · ԹՈՂԱՐԿՈՒՄՆԵՐ", "work.aiText":"Սեղանադիր AI արտադրանք՝ միացված մոդելների մատակարարներով, առցանց ծառայություններով և առանձին թողարկումների ալիքով։",
      "work.builderType":"ԻՆՏԵՐԱԿՏԻՎ ՓՈՐՁԱՌՈՒԹՅՈՒՆ · ԳՈՐԾՈՂ", "work.builderText":"Կայքի պատվերի ուղղորդվող brief՝ տեսողական ընտրություններով, պահանջներով և ինտերակտիվ 3D միջավայրով։",
      "services.kicker":"ԻՆՉ ԵՆՔ ՄՇԱԿՈՒՄ", "services.title":"Ոչ միայն էջ։<br><em>Ամբողջական համակարգ։</em>", "services.description":"Մշակված ինտերֆեյսից մինչև դրա հիմքում գործող տրամաբանություն՝ յուրաքանչյուր բաղադրիչ ծառայում է իրական օգտատիրոջ պահանջին։",
      "services.uiTitle":"Կայքեր և թվային փորձառություններ", "services.uiText":"Հարմարվող և հասանելի ինտերֆեյսներ՝ հստակ տեղեկատվական կառուցվածքով, տեսողական հիերարխիայով և օգտատիրոջ խնդրին ծառայող փոխազդեցություններով։",
      "services.appTitle":"Վեբ հավելվածներ", "services.appText":"Ինտերակտիվ արտադրանքներ՝ օգտատիրոջ հոսքերով, ձևերով, հաշիվներով, կառավարման վահանակներով և բիզնես տրամաբանությամբ։",
      "services.dataTitle":"Backend և տվյալների համակարգեր", "services.dataText":"Կառուցվածքային տվյալներ, սերվերային աշխատանքային հոսքեր, ինտեգրումներ և սպասարկելի հավելվածային ճարտարապետություն։",
      "services.aiTitle":"AI ինտեգրումներ և անհատական գործիքներ", "services.aiText":"Գործնական AI հնարավորություններ՝ իրական աշխատանքային հոսքերում, վերահսկվող թույլտվություններով, հստակ սահմաններով և տվյալների մշակման վերահսկմամբ։",
      "process.kicker":"ԳԱՂԱՓԱՐԻՑ ՄԻՆՉԵՎ ԳՈՐԾԱՐԿՈՒՄ", "process.title":"Հստակ մտածել։<br><em>Նպատակային կառուցել։</em>", "process.description":"Հստակ գործընթացը նախագիծը պահում է հասկանալի, ստուգելի և իր նպատակին համապատասխան։",
      "process.step1Title":"Ուսումնասիրում", "process.step1Text":"Սահմանում ենք լսարանը, նպատակները, սահմանափակումներն ու սպասվող արդյունքը։",
      "process.step2Title":"Նախագծում", "process.step2Text":"Կառուցում ենք կառուցվածքը, ինտերֆեյսը, հարմարվող վարքագիծն ու փոխազդեցության մոդելը։",
      "process.step3Title":"Մշակում", "process.step3Text":"Frontend-ը, backend-ը, տվյալներն ու ինտեգրումները միավորում ենք մեկ ամբողջական հավելվածում։",
      "process.step4Title":"Ստուգում և գործարկում", "process.step4Text":"Ստուգում ենք հիմնական հոսքերը, վերանայում անվտանգության վերահսկիչները, ուղղում թերությունները և պատրաստում տեղակայումը։",
      "security.kicker":"KNOWME / ԱՆՎՏԱՆԳՈՒԹՅԱՆ ԼԱԲՈՐԱՏՈՐԻԱ", "security.title":"Հասկանալ սպառնալիքը։<br><em>Կառուցել պաշտպանությունը։</em>", "security.intro":"Վեբ և AI հավելվածների տարածված սպառնալիքների գործնական ուղեցույց։ Ընտրեք թեման՝ հասկանալու ռիսկը, այն նվազեցնող վերահսկիչներն ու դրանց ստուգման եղանակները։",
      "security.modules":"ԱՆՎՏԱՆԳՈՒԹՅԱՆ ՄՈԴՈՒԼՆԵՐ", "security.scrollHint":"ՆԵՐՔԵՎ ՈԼՈՐԵՔ՝ ԳՐՔՈՎ ԱՆՑՆԵԼՈՒ ՀԱՄԱՐ", "security.reading":"ԱՆՎՏԱՆԳՈՒԹՅԱՆ ԳՐՔԻ ԸՆԹԵՐՑՈՒՄ", "security.chapter":"ԳԼՈՒԽ", "security.page":"ԷՋ", "security.how":"ԻՆՉՊԵՍ Է ԱՌԱՋԱՆՈՒՄ ՌԻՍԿԸ", "security.verify":"ԻՆՉՊԵՍ ՍՏՈՒԳԵԼ", "security.controls":"ՊԱՇՏՊԱՆԱԿԱՆ ՄԻՋՈՑՆԵՐ", "security.reference":"ԱՂԲՅՈՒՐ", "security.disclaimer":"Միայն կրթական ակնարկ։ Այս թեմաների առկայությունը չի նշանակում, որ բոլոր վերահսկիչները ներդրված են KNOWME-ի յուրաքանչյուր նախագծում։ Անվտանգությունը պետք է նախագծվի, իրականացվի և փորձարկվի յուրաքանչյուր համակարգի համար առանձին։",
      "engineering.kicker":"ԻՆՏԵՐՖԵՅՍԻ ՀԵՏԵՎՈՒՄ ԳՈՐԾՈՂ ՀԱՄԱԿԱՐԳԸ", "engineering.title":"Մեկ փորձառություն։<br><em>Փոխկապակցված շերտեր։</em>", "engineering.description":"Օգտակար թվային արտադրանքին միայն գեղեցիկ frontend-ը բավարար չէ։ Ինտերֆեյսը, հավելվածի տրամաբանությունը, տվյալները, տեղակայումը և անվտանգության վերահսկիչները պետք է աշխատեն միասին։", "engineering.link":"Դիտել աշխատանքները",
      "final.kicker":"ՈՒՆԵ՞Ք ՆԱԽԱԳԻԾ", "final.title":"Ստեղծենք մի բան,<br><em>որն արժե հիշել։</em>", "final.description":"Ներկայացրեք գաղափարը։ Մենք կձևավորենք փորձառությունը, կսահմանենք համակարգը և կկառուցենք լուծում այն օգտագործող մարդկանց համար։", "final.start":"Սկսել նախագիծ", "final.contact":"Կապվել KNOWME-ի հետ", "final.bottom":"ՆՊԱՏԱԿԱՅԻՆ ԴԻԶԱՅՆ · ԽՆԱՄՔՈՎ ԻՆԺԵՆԵՐԻԱ", "final.top":"ՎԵՐԵՎ ↑",
      "previous":"Նախորդը", "next":"Հաջորդը", "source":"Բացել OWASP աղբյուրը"
    },
    ru: {
      "hero.eyebrow":"НЕЗАВИСИМАЯ DIGITAL-СТУДИЯ · АРМЕНИЯ", "hero.line1":"Цифровые решения", "hero.line2":"созданные для результата.",
      "hero.description":"Мы проектируем и разрабатываем продуманные сайты и веб-приложения — от интерфейса до систем, которые обеспечивают их работу.",
      "hero.projects":"Смотреть проекты", "hero.start":"Начать проект", "hero.proof":"ДИЗАЙН · ИНЖЕНЕРИЯ · ВНИМАНИЕ К БЕЗОПАСНОСТИ",
      "hero.footerLeft":"ЦИФРОВЫЕ ПРОДУКТЫ · ОСМЫСЛЕННАЯ РАЗРАБОТКА", "hero.scroll":"ПРОКРУТИТЕ ДЛЯ ОБЗОРА",
      "work.kicker":"ИЗБРАННЫЕ РАБОТЫ / 01—03", "work.title":"Создано, чтобы <em>впечатлять.</em>", "work.description":"Подборка продуктов и интерактивных систем KNOWME. Изучите работы и откройте заинтересовавший вас проект.", "work.drag":"ПЕРЕТАЩИТЕ ИЛИ ПРОКРУТИТЕ",
      "work.studioType":"ЦИФРОВАЯ ПЛАТФОРМА · LIVE", "work.studioText":"Многоязычный сайт студии с рабочими процессами проектов, информацией об услугах и интегрированным ИИ-помощником.",
      "work.aiType":"ПРИЛОЖЕНИЕ WINDOWS · РЕЛИЗЫ", "work.aiText":"Настольный ИИ-продукт с подключёнными провайдерами моделей, онлайн-сервисами и отдельным каналом релизов.",
      "work.builderType":"ИНТЕРАКТИВНЫЙ ПРОДУКТ · LIVE", "work.builderText":"Пошаговое описание веб-проекта с визуальными настройками, требованиями и интерактивной 3D-средой.",
      "services.kicker":"ЧТО МЫ СОЗДАЁМ", "services.title":"Больше, чем страница.<br><em>Полноценная система.</em>", "services.description":"От продуманного интерфейса до серверной логики — каждый компонент решает реальную задачу пользователя.",
      "services.uiTitle":"Сайты и цифровые интерфейсы", "services.uiText":"Адаптивные и доступные интерфейсы с понятной структурой информации, визуальной иерархией и полезными взаимодействиями.",
      "services.appTitle":"Веб-приложения", "services.appText":"Интерактивные продукты с пользовательскими сценариями, формами, аккаунтами, панелями управления и бизнес-логикой.",
      "services.dataTitle":"Backend и системы данных", "services.dataText":"Структурированные данные, серверные процессы, интеграции и архитектура, удобная для сопровождения.",
      "services.aiTitle":"ИИ-интеграции и специальные инструменты", "services.aiText":"Практические функции ИИ в реальных процессах с контролируемыми разрешениями, чёткими границами и вниманием к обработке данных.",
      "process.kicker":"ПОНЯТНЫЙ ПУТЬ ОТ ИДЕИ ДО ЗАПУСКА", "process.title":"Думать ясно.<br><em>Создавать осознанно.</em>", "process.description":"Чёткий процесс помогает сохранять проект понятным, проверяемым и соответствующим его цели.",
      "process.step1Title":"Исследование", "process.step1Text":"Определяем аудиторию, цели, ограничения и результат, который должен обеспечить продукт.",
      "process.step2Title":"Проектирование", "process.step2Text":"Формируем структуру, интерфейс, адаптивное поведение и модель взаимодействия.",
      "process.step3Title":"Разработка", "process.step3Text":"Объединяем frontend, backend, данные и интеграции в единое приложение.",
      "process.step4Title":"Проверка и запуск", "process.step4Text":"Тестируем ключевые сценарии, проверяем меры безопасности, исправляем дефекты и готовим развёртывание.",
      "security.kicker":"KNOWME / ЛАБОРАТОРИЯ БЕЗОПАСНОСТИ", "security.title":"Понять угрозу.<br><em>Спроектировать защиту.</em>", "security.intro":"Практический обзор распространённых угроз веб- и ИИ-приложений. Выберите модуль, чтобы изучить риск, защитные меры и способы их проверки.",
      "security.modules":"МОДУЛИ БЕЗОПАСНОСТИ", "security.scrollHint":"ПРОКРУЧИВАЙТЕ ВНИЗ, ЧТОБЫ ЛИСТАТЬ КНИГУ", "security.reading":"ЧТЕНИЕ АРХИВА БЕЗОПАСНОСТИ", "security.chapter":"ГЛАВА", "security.page":"СТРАНИЦА", "security.how":"КАК ВОЗНИКАЕТ РИСК", "security.verify":"КАК ПРОВЕРИТЬ", "security.controls":"МЕРЫ ЗАЩИТЫ", "security.reference":"ИСТОЧНИК", "security.disclaimer":"Только образовательный обзор. Наличие этих тем не означает, что все меры внедрены в каждом проекте KNOWME. Безопасность необходимо проектировать, реализовывать и проверять отдельно для каждой системы.",
      "engineering.kicker":"СИСТЕМА ЗА ИНТЕРФЕЙСОМ", "engineering.title":"Единый опыт.<br><em>Связанные уровни.</em>", "engineering.description":"Для полезного цифрового продукта недостаточно качественного frontend. Интерфейс, логика приложения, данные, развёртывание и меры безопасности должны работать вместе.", "engineering.link":"Посмотреть работы",
      "final.kicker":"ЕСТЬ ИДЕЯ ПРОЕКТА?", "final.title":"Создадим нечто,<br><em>что запомнится.</em>", "final.description":"Расскажите об идее. Мы сформируем пользовательский опыт, определим систему и создадим решение для его будущих пользователей.", "final.start":"Начать проект", "final.contact":"Связаться с KNOWME", "final.bottom":"ОСМЫСЛЕННЫЙ ДИЗАЙН · ТЩАТЕЛЬНАЯ ИНЖЕНЕРИЯ", "final.top":"НАВЕРХ ↑",
      "previous":"Назад", "next":"Далее", "source":"Открыть рекомендации OWASP"
    }
  };

  const SOURCES = {
    xss: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html",
    csrf: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html",
    ssrf: "https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html",
    sqli: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
    dos: "https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html",
    ddos: "https://www.cloudflare.com/learning/ddos/what-is-a-ddos-attack/",
    bots: "https://owasp.org/www-project-automated-threats-to-web-applications/",
    aidefense: "https://www.nist.gov/itl/ai-risk-management-framework",
    aisecurity: "https://genai.owasp.org/glossary/prompt-injection/",
    testing: "https://owasp.org/www-project-web-security-testing-guide/",
    pentest: "https://csrc.nist.gov/pubs/sp/800/115/final"
  };

  const SLIDES = {
    en: [
      {tag:"BROWSER-SIDE INJECTION",acronym:"XSS",name:"Cross-Site Scripting",lead:"XSS happens when untrusted content is interpreted by a browser as executable script instead of ordinary data.",body:["An attacker may place crafted content into a form, URL parameter, comment, profile field or other input. If the application later inserts that value into a page without the correct context-aware handling, a browser can execute it in the context of the affected site. This can expose page data, change what a user sees or perform actions available to that user.","The common categories are stored XSS (the payload is saved and shown to other users), reflected XSS (the payload is returned immediately in a response) and DOM-based XSS (client-side code creates an unsafe execution path). The correct fix depends on where the data is inserted: HTML text, an attribute, a URL, CSS and JavaScript are different output contexts."],scenario:"A comment is saved as text, then a template or client script inserts it with an unsafe HTML operation. A visitor opens the page and the browser interprets the comment as markup or script.",verify:"Test stored, reflected and DOM rendering paths with harmless markers. Confirm that text remains text, rich text is sanitized with a strict allowlist and no input can escape its intended output context.",controls:["Apply context-aware output encoding at the point of rendering.","Prefer safe DOM APIs such as textContent; avoid unsafe HTML sinks for untrusted data.","If rich HTML is required, use a maintained sanitizer with a narrow allowlist.","Use Content Security Policy as an additional layer, not as a substitute for safe output handling."],sourceLabel:"OWASP XSS Prevention Cheat Sheet"},
      {tag:"REQUEST / SESSION INTEGRITY",acronym:"CSRF",name:"Cross-Site Request Forgery",lead:"CSRF tricks a browser that is already authenticated into sending an unwanted state-changing request.",body:["Browsers automatically attach eligible cookies to requests. A malicious site may try to cause a victim's browser to submit a request to another site where the victim is signed in. If the application relies only on the session cookie and does not verify that the action was intentionally initiated by the application, the request may be accepted.","CSRF is most relevant to cookie-based authentication and actions that change server state, such as updating account details, changing an email address or creating an order. It is not the same as stealing a password: the attack abuses the browser's existing authenticated context."],scenario:"A signed-in administrator visits an unrelated page. That page attempts to submit a hidden request to the admin application. Without a verified anti-CSRF control, the browser may attach the administrator's session cookie.",verify:"For every state-changing route, test requests with a missing, incorrect or expired token. Confirm that GET requests do not change state and that origin checks and cookie settings behave as intended.",controls:["Use unpredictable, session-bound CSRF tokens and validate them server-side.","Set session cookies with appropriate SameSite, Secure and HttpOnly attributes.","Check Origin or Referer where appropriate; consider Fetch Metadata as an additional signal.","Use POST/PUT/PATCH/DELETE for state changes and never rely on CORS as the CSRF control."],sourceLabel:"OWASP CSRF Prevention Cheat Sheet"},
      {tag:"SERVER-SIDE REQUEST VALIDATION",acronym:"SSRF",name:"Server-Side Request Forgery",lead:"SSRF occurs when an application can be induced to make network requests to destinations chosen by an untrusted user.",body:["Features such as URL previews, webhook testers, image importers, document converters and remote file fetchers may make outbound requests on behalf of a user. If the destination is not constrained, an attacker may attempt to reach internal services, loopback addresses, private networks or cloud metadata endpoints that are not exposed directly to the Internet.","Filtering only the visible URL string is not enough. DNS resolution, redirects, IPv4 and IPv6 representations, ports and changes between validation and connection can affect the final destination. The safest design is to avoid arbitrary URL fetching where possible and to combine strict destination policy with network-level egress limits."],scenario:"A URL import endpoint accepts a user-provided address and the server fetches it. The address resolves to an internal service, or a permitted public URL redirects to a restricted destination.",verify:"Test allowed and denied destinations in an authorized staging environment. Include private and loopback IP ranges, IPv6, redirects, unusual encodings and DNS changes; confirm the actual connected IP is checked.",controls:["Prefer destination allowlists and narrowly define required schemes, hosts and ports.","Resolve DNS and reject loopback, link-local, private and reserved addresses; re-check the resolved destination.","Disable redirects or validate every redirect target before following it.","Restrict outbound network access and block access to metadata and internal management networks."],sourceLabel:"OWASP SSRF Prevention Cheat Sheet"},
      {tag:"DATABASE QUERY SAFETY",acronym:"SQLi",name:"SQL Injection",lead:"SQL injection happens when untrusted input changes the structure or meaning of a database query.",body:["The risk appears when an application builds SQL by concatenating user-controlled values into query text. A crafted value can escape the intended data position and alter filtering, sorting or other query logic. Depending on database permissions and query capabilities, this may expose, modify or delete information.","Input validation is useful for business rules but is not the primary SQL injection defence. The central control is to separate SQL instructions from values so the database driver transmits values as data. Dynamic identifiers such as table names or sort directions need a strict allowlist because they generally cannot be bound like ordinary values."],scenario:"A search endpoint constructs a query by joining a search string into SQL. A specially formed value changes the predicate instead of being treated as the search term.",verify:"Review query construction and test parameterized paths with representative special characters. Check dynamic sorting, filters and reporting queries, and run security tests with a low-privilege test account.",controls:["Use parameterized queries or ORM APIs that bind values rather than concatenate SQL strings.","Allowlist dynamic column names, sort directions and other SQL fragments.","Give the application database account only the permissions it needs.","Log database errors safely and regression-test every query path that handles untrusted input."],sourceLabel:"OWASP SQL Injection Prevention Cheat Sheet"},
      {tag:"RESOURCE EXHAUSTION",acronym:"DoS",name:"Denial of Service",lead:"DoS makes a service unavailable by exhausting a resource or forcing the application to perform excessive work.",body:["A denial-of-service condition can come from request floods, very large payloads, expensive searches, unbounded file processing, slow dependencies, excessive concurrency or algorithmic work that grows sharply with input size. A single source may be enough when a request is disproportionately expensive or when resource limits are absent.","Availability is a system property. Application code, reverse proxy, database, queues, external APIs and infrastructure all need sensible limits. Rate limiting alone is not sufficient if a small number of permitted requests can consume excessive CPU, memory, database connections or worker time."],scenario:"An endpoint accepts a large file or a costly search request with no size, time or concurrency limit. A small number of requests occupies workers and database connections long enough to affect legitimate users.",verify:"Load-test in a controlled environment with agreed limits. Measure latency, queue depth, memory, CPU, database connections and recovery time; confirm that oversized and slow requests are rejected predictably.",controls:["Set body-size limits, request timeouts, concurrency caps and per-operation budgets.","Rate-limit costly endpoints and apply quotas by account, token and network signal.","Use caching, pagination, bounded queues and back-pressure for expensive work.","Design graceful degradation, health checks, alerting and tested recovery procedures."],sourceLabel:"OWASP Denial of Service Cheat Sheet"},
      {tag:"DISTRIBUTED AVAILABILITY ATTACK",acronym:"DDoS",name:"Distributed Denial of Service",lead:"A distributed denial-of-service attack uses many separate sources to exhaust the capacity that keeps a website, API or network available to legitimate users.",body:["Unlike a single-source DoS event, a DDoS event can arrive from many devices, networks and geographic locations at the same time. The apparent source is therefore spread across a large population of clients, which makes simple one-IP blocking ineffective and can make malicious traffic look like a sudden surge in genuine demand.","DDoS activity is commonly grouped into three broad families. Volumetric events try to consume available bandwidth; protocol or state-exhaustion events consume resources in network devices, connection tables or handshake handling; application-layer events create many HTTP or API requests that consume web workers, database connections, caches or other expensive application resources. These categories can overlap during one incident.","The impact is not limited to a page becoming slow. Visitors may see timeouts, intermittent 5xx responses or failed logins; background jobs can fall behind; payment, search and account services may become unavailable; and origin infrastructure can become saturated even when a CDN is serving cached pages. A distributed event can also increase provider costs and obscure other operational problems.","Detection requires comparing several signals with the site's normal baseline. Useful indicators include bandwidth and packets-per-second, new and concurrent connections, request rates by route, latency, 4xx/5xx rates, cache-hit ratio, origin CPU and database connection use. A legitimate campaign or product launch can create a traffic spike too, so traffic volume alone is not proof of an attack.","Mitigation is layered and often starts upstream of the application. A hosting provider, network provider or DDoS protection service can filter or absorb unwanted traffic before it reaches the origin. A CDN and WAF add edge controls; origin firewall rules prevent direct bypass; application limits protect expensive endpoints; and caching, queues and back-pressure help the system degrade gracefully. Simply adding more application workers or servers is not a complete DDoS strategy."],scenario:"A small online shop announces a limited product release. At the same time, a distributed request surge targets its home page, search and sign-in routes. The CDN continues serving cached static assets, but uncached requests begin timing out and the origin's connection pool approaches its limit. The team compares the event with its normal traffic baseline, contacts its mitigation provider, tightens edge rules for the affected routes and keeps the origin accessible only through the protected edge. Legitimate visitors gradually regain access while the team monitors error rates and queue depth.",verify:"Prepare and review a written availability exercise with the hosting/CDN provider. Use only provider-approved simulations, test environments or tabletop exercises; never generate an uncontrolled flood against a public service. Verify that alerts fire, the origin cannot be reached around the edge, emergency provider contacts respond, rate limits do not lock out normal users, cached content remains available, failover works and the incident runbook clearly assigns decision-making and communication roles.",controls:["Use an upstream DDoS mitigation service, protected CDN or anycast network that matches the hosting architecture and expected traffic profile.","Restrict direct origin access so visitors cannot bypass the CDN or protection provider; keep origin addresses and management interfaces private where possible.","Apply layered edge controls: WAF rules, bot management, request normalization and carefully tuned challenges for suspicious patterns.","Set route-specific rate limits, concurrency caps, request budgets and quotas. Combine account, session, token and network signals instead of relying on a single source IP.","Cache public and repeatable responses; bound queues, database pools and background workers; use timeouts and back-pressure for expensive operations.","Monitor bandwidth, packets-per-second, connection counts, route-level request rates, latency, 4xx/5xx errors, cache hit rate and origin saturation against a known baseline.","Maintain an incident runbook with provider escalation contacts, roles, status communication, failover steps, evidence retention and post-incident review."],sourceLabel:"Cloudflare: What is a DDoS attack?"},
      {tag:"AUTOMATED ABUSE",acronym:"BOTS",name:"Automated Attacks & Bot Protection",lead:"Automated abuse uses scripts or bot networks to perform actions at scale, often against public forms, login flows and APIs.",body:["Bots can submit spam, scrape content, enumerate accounts, test reused credentials, attempt password guessing, reserve scarce inventory or consume an expensive API. The behavior is not always malicious: search crawlers, monitoring services and accessibility tools can also be automated, so defensive systems should distinguish expected automation from harmful patterns.","A good defence is layered and risk-based. IP-only blocking is easy to evade and can harm users behind shared networks. Signals may include account behavior, request velocity, device/session consistency, failed authentication patterns and whether the action is sensitive. Apply stronger verification when risk increases rather than adding friction to every visit."],scenario:"A login or contact endpoint is repeatedly submitted by scripts. The traffic creates account lockouts, spam records or excessive verification requests and may target reused passwords.",verify:"Test rate limits by account and route, challenge escalation, account enumeration behavior, logging and legitimate crawler access. Confirm that retries and duplicate submissions do not create repeated side effects.",controls:["Apply layered rate limits by account, session, route and network signals.","Use MFA and breached-password checks for sensitive account access.","Introduce progressive bot challenges or proof-of-work only when risk warrants it.","Use idempotency, abuse monitoring and allow rules for known legitimate automation."],sourceLabel:"OWASP Automated Threats to Web Applications"},
      {tag:"AI-ASSISTED SECURITY OPERATIONS",acronym:"AI DEFENCE",name:"AI-Powered Security Defence",lead:"AI can help analysts detect patterns and prioritize signals, but it should support—not replace—security engineering and human judgment.",body:["Security systems generate large volumes of logs and alerts. Machine-learning and language-model tools can help group related events, summarize suspicious sequences, identify deviations from a baseline and draft investigation steps. This can reduce triage time when the model has sufficient context and the output is checked against source evidence.","AI outputs can be wrong, incomplete or manipulated by the data they process. A model may overstate a weak signal, miss a new pattern or produce unsafe recommendations. Security decisions with significant impact should use deterministic policy checks, auditable evidence and human approval. Avoid sending secrets or unnecessary personal data to external AI services."],scenario:"An AI assistant reviews authentication and application logs, highlights an unusual sequence and proposes an investigation. An analyst checks the raw events and confirms whether the alert reflects a real threat.",verify:"Evaluate with known test incidents and false-positive cases. Measure detection quality, explanation traceability, data handling, access permissions and whether human operators can reject the recommendation.",controls:["Use AI for correlation and triage while keeping enforcement in explicit policy controls.","Minimize or redact sensitive data before sending it to a model.","Require human review for blocking users, changing permissions or taking destructive actions.","Record evidence, model/version context, analyst decisions and outcomes for audit."],sourceLabel:"NIST AI Risk Management Framework"},
      {tag:"LLM / AGENT APPLICATION SECURITY",acronym:"AI APPSEC",name:"AI Application Security",lead:"AI applications add risks such as prompt injection, data leakage, unsafe tool calls and untrusted retrieval content.",body:["Prompt injection occurs when instructions embedded in user input or retrieved content attempt to override the application's intended behavior. The risk grows when an AI system can access private documents, call tools, browse URLs, execute code or perform actions with the user's authority. Retrieved pages and uploaded files must be treated as untrusted data, not as trusted policy instructions.","A prompt is not an access-control boundary. The application must enforce permissions outside the model, expose only the tools needed for the task and validate all arguments before execution. Sensitive or irreversible actions should require explicit user confirmation, and model output must be treated as untrusted when it is rendered or passed to another system."],scenario:"An assistant retrieves a document containing adversarial instructions and is asked to summarize it. If the application treats the retrieved text as trusted control instructions, the model may attempt to reveal data or invoke an unintended tool.",verify:"Run prompt-injection and data-boundary tests with untrusted documents, web content and tool arguments. Confirm that access checks are server-side, secrets are not in model context and dangerous actions require approval.",controls:["Separate system policy from retrieved content and clearly mark external content as untrusted.","Enforce authorization in application code; never rely on the model to decide access rights.","Use least-privilege tool allowlists, validated schemas and strict network boundaries.","Require user confirmation for high-impact actions and safely validate model outputs."],sourceLabel:"OWASP GenAI: Prompt Injection"},
      {tag:"SECURITY TESTING PIPELINE",acronym:"AUTOMATION",name:"Automated Security Testing",lead:"Automated testing repeatedly checks code, dependencies, configuration and running applications for known classes of defects.",body:["Security checks are most useful when integrated into the development lifecycle. Static Application Security Testing (SAST) examines source code; Software Composition Analysis (SCA) identifies vulnerable or risky dependencies; secret scanning detects accidentally committed credentials; Dynamic Application Security Testing (DAST) examines a running application from the outside; and configuration or infrastructure scanners review deployment settings.","No scanner proves that an application is secure. Tools can miss business-logic flaws and generate false positives. Results must be triaged, prioritized by exploitability and impact, assigned to an owner and verified after remediation. DAST and load-related testing must use environments and targets for which testing is authorized."],scenario:"A pull request triggers code, dependency and secret scans. A deployment pipeline also runs safe dynamic checks against a staging environment. Findings block release only according to a documented severity policy.",verify:"Confirm scans run on the expected branches and artifacts, inspect sample findings, test that an intentionally vulnerable fixture is detected and ensure fixes close the original finding.",controls:["Integrate SAST, SCA, secret scanning and configuration checks into CI/CD.","Run DAST against authorized staging targets with safe test accounts and rate limits.","Triage findings by severity, exploitability and business impact; track remediation owners.","Retest fixes and maintain dependency updates, scan policies and documented exceptions."],sourceLabel:"OWASP Web Security Testing Guide"},
      {tag:"AUTHORIZED SECURITY ASSESSMENT",acronym:"PENTEST",name:"Penetration Testing",lead:"A penetration test is a scoped, authorized assessment that validates whether weaknesses can be exploited in a defined environment.",body:["A professional test begins with written permission, target scope, rules of engagement, test windows, contact points and safety constraints. The tester maps the attack surface, reviews likely weaknesses, validates selected findings and documents the evidence and business impact. The goal is not to cause damage or obtain data beyond what is necessary to prove a finding.","A useful report describes the affected asset, conditions, reproducible evidence, impact, severity rationale and practical remediation. After the fixes, retesting confirms whether the vulnerability is closed and whether the change introduced regressions. A scan alone is not a penetration test, and a test result applies only to the scope and time that were assessed."],scenario:"A client authorizes testing of a staging web application. The tester follows the agreed scope, validates a suspected access-control issue using test accounts and documents the evidence without accessing unrelated data.",verify:"Check signed authorization, scope and exclusions before testing. During assessment, preserve logs and evidence safely; afterward, confirm every finding has an owner, a fix and a retest result.",controls:["Obtain written authorization, define scope, exclusions, timing and escalation contacts.","Use a recognized methodology and safe test accounts; avoid destructive or out-of-scope actions.","Report evidence, impact, severity, limitations and actionable remediation clearly.","Retest fixes and state exactly what was tested; never imply certification beyond the evidence."],sourceLabel:"NIST SP 800-115: Technical Guide to Information Security Testing"}
    ],
    hy: [
      {tag:"ԲՐԱՈՒԶԵՐԱՅԻՆ ՆԵՐԱՐԿՈՒՄ",acronym:"XSS",name:"Cross-Site Scripting",lead:"XSS-ը առաջանում է, երբ չվստահված բովանդակությունը բրաուզերը մեկնաբանում է որպես աշխատող script, այլ ոչ թե սովորական տվյալ։",body:["Հարձակվողը կարող է պատրաստված բովանդակություն տեղադրել ձևի, URL պարամետրի, մեկնաբանության, օգտատիրոջ էջի կամ այլ մուտքային դաշտի միջոցով։ Եթե հավելվածը հետագայում այդ արժեքը տեղադրում է էջում առանց համատեքստին համապատասխան մշակման, բրաուզերը կարող է այն կատարել կայքի տիրույթում։ Հետևանքը կախված է էջից, օգտատիրոջ իրավունքներից և տվյալ session-ի հասանելիությունից։","Տարածված տեսակներն են Stored XSS-ը (բովանդակությունը պահվում և ցուցադրվում է այլ օգտատերերին), Reflected XSS-ը (բովանդակությունն անմիջապես վերադարձվում է պատասխանում) և DOM-based XSS-ը (վտանգավոր ուղին ստեղծվում է client-side կոդով)։ Ճիշտ պաշտպանությունը կախված է տվյալների տեղադրման համատեքստից․ HTML տեքստը, attribute-ը, URL-ը, CSS-ը և JavaScript-ը տարբեր համատեքստեր են։"],scenario:"Մեկնաբանությունը պահվում է որպես տեքստ, ապա template-ը կամ client script-ը այն տեղադրում է անապահով HTML գործողությամբ։ Այցելուն բացում է էջը, և բրաուզերը մեկնաբանում է մեկնաբանությունը որպես markup կամ script։",verify:"Անվտանգ փորձնական նշիչներով ստուգեք stored, reflected և DOM rendering ուղիները։ Հաստատեք, որ տեքստը մնում է տեքստ, rich text-ը մաքրվում է խիստ allowlist-ով, և մուտքային տվյալը չի կարող դուրս գալ իր նախատեսված համատեքստից։",controls:["Rendering-ի պահին կիրառեք համատեքստին համապատասխան output encoding։","Նախընտրեք անվտանգ DOM API-ներ, օրինակ՝ textContent․ չվստահված տվյալների համար խուսափեք անապահով HTML sink-երից։","Եթե rich HTML-ն անհրաժեշտ է, օգտագործեք պահպանվող sanitizer՝ սահմանափակ allowlist-ով։","CSP-ն կիրառեք որպես լրացուցիչ շերտ, ոչ թե անվտանգ output handling-ի փոխարինում։"],sourceLabel:"OWASP XSS Prevention Cheat Sheet"},
      {tag:"ՀԱՐՑՄԱՆ ԵՎ SESSION-Ի ԱՄԲՈՂՋԱԿԱՆՈՒԹՅՈՒՆ",acronym:"CSRF",name:"Cross-Site Request Forgery",lead:"CSRF-ը փորձում է արդեն նույնականացված բրաուզերից ուղարկել օգտատիրոջ կողմից չնախաձեռնված փոփոխող հարցում։",body:["Բրաուզերը համապատասխան հարցումներին ավտոմատ կցում է cookie-ները։ Վնասակար կայքը կարող է փորձել ստիպել այցելուի բրաուզերին հարցում ուղարկել մեկ այլ կայք, որտեղ օգտատերն արդեն մուտք է գործել։ Եթե հավելվածը հենվում է միայն session cookie-ի վրա և չի ստուգում՝ արդյոք գործողությունը դիտավորյալ է նախաձեռնվել հավելվածից, հարցումը կարող է ընդունվել։","CSRF-ն առավել կարևոր է cookie-ով նույնականացման և սերվերի վիճակը փոփոխող գործողությունների համար, օրինակ՝ հաշվի տվյալների, email-ի կամ պատվերի փոփոխության։ Սա գաղտնաբառ գողանալը չէ․ հարձակումը չարաշահում է բրաուզերի արդեն իսկ հաստատված authenticated համատեքստը։"],scenario:"Մուտք գործած ադմինիստրատորը այցելում է կապ չունեցող էջ։ Այդ էջը փորձում է թաքնված հարցում ուղարկել ադմինիստրատորի հավելվածին։ Հակա-CSRF ստուգման բացակայության դեպքում բրաուզերը կարող է կցել session cookie-ն։",verify:"Յուրաքանչյուր վիճակ փոխող route-ի համար փորձարկեք բացակայող, սխալ կամ ժամկետանց token։ Հաստատեք, որ GET հարցումները վիճակ չեն փոխում, իսկ Origin ստուգումն ու cookie կարգավորումները գործում են նախատեսվածի պես։",controls:["Կիրառեք անկանխատեսելի, session-ին կապված CSRF token և ստուգեք այն սերվերում։","Session cookie-ների համար սահմանեք համապատասխան SameSite, Secure և HttpOnly հատկությունները։","Համապատասխան դեպքերում ստուգեք Origin կամ Referer-ը, իսկ որպես լրացուցիչ ազդանշան դիտարկեք Fetch Metadata-ն։","Վիճակ փոխելու համար օգտագործեք POST/PUT/PATCH/DELETE և CORS-ը մի համարեք CSRF պաշտպանության միջոց։"],sourceLabel:"OWASP CSRF Prevention Cheat Sheet"},
      {tag:"ՍԵՐՎԵՐԱՅԻՆ ՀԱՐՑՈՒՄՆԵՐԻ ՎԱՎԵՐԱՑՈՒՄ",acronym:"SSRF",name:"Server-Side Request Forgery",lead:"SSRF-ը առաջանում է, երբ օգտատերը կարող է ստիպել հավելվածին ցանցային հարցում կատարել իր ընտրած հասցեով։",body:["URL preview, webhook tester, image importer, document converter կամ remote file fetcher գործառույթները կարող են սերվերին ստիպել արտաքին հարցում կատարել։ Եթե նպատակակետը սահմանափակված չէ, հարձակվողը կարող է փորձել հասնել ներքին ծառայություններին, loopback հասցեներին, private ցանցերին կամ cloud metadata endpoint-ներին, որոնք անմիջապես ինտերնետից հասանելի չեն։","Միայն URL-ի տեսանելի տողի ֆիլտրումը բավարար չէ։ DNS լուծումը, redirect-ները, IPv4 և IPv6 հասցեները, port-երը և validation-ի ու միացման պահերի միջև փոփոխությունները կարող են փոխել վերջնական նպատակակետը։ Ամենաանվտանգ լուծումը կամայական URL fetch-ից հրաժարվելն է, երբ դա հնարավոր է, և խիստ allowlist-ը համադրել ցանցային ելքային սահմանափակումների հետ։"],scenario:"URL import endpoint-ը ընդունում է օգտատիրոջ հասցեն և սերվերը fetch է անում այն։ Հասցեն լուծվում է ներքին ծառայության վրա, կամ թույլատրված public URL-ը redirect է անում դեպի սահմանափակված հասցե։",verify:"Թույլատրված staging միջավայրում ստուգեք թույլատրելի և արգելված նպատակակետերը։ Ներառեք private և loopback IP-ներ, IPv6, redirect-ներ, տարբեր encoding-ներ և DNS փոփոխություններ․ հաստատեք, որ ստուգվում է իրական միացման IP-ն։",controls:["Նախընտրեք destination allowlist և հստակ սահմանեք անհրաժեշտ scheme-երը, host-երն ու port-երը։","Լուծեք DNS-ը և մերժեք loopback, link-local, private ու reserved հասցեները․ կրկին ստուգեք լուծված նպատակակետը։","Անջատեք redirect-ները կամ նախքան յուրաքանչյուր redirect-ը ստուգեք նոր նպատակակետը։","Սահմանափակեք outbound ցանցային հասանելիությունը և արգելափակեք metadata ու ներքին կառավարման ցանցերը։"],sourceLabel:"OWASP SSRF Prevention Cheat Sheet"},
      {tag:"ՏՎՅԱԼՆԵՐԻ ԲԱԶԱՅԻ ՀԱՐՑՄԱՆ ԱՆՎՏԱՆԳՈՒԹՅՈՒՆ",acronym:"SQLi",name:"SQL Injection",lead:"SQL injection-ը առաջանում է, երբ չվստահված մուտքը փոխում է տվյալների բազայի հարցման կառուցվածքը կամ իմաստը։",body:["Ռիսկն առաջանում է, երբ հավելվածը SQL-ը կառուցում է՝ օգտատիրոջ արժեքները միացնելով հարցման տեքստին։ Պատրաստված արժեքը կարող է դուրս գալ նախատեսված տվյալային դիրքից և փոխել filter-ի, sort-ի կամ հարցման այլ տրամաբանությունը։ Կախված տվյալների բազայի թույլտվություններից՝ սա կարող է բացահայտել, փոփոխել կամ ջնջել տեղեկությունը։","Մուտքային տվյալների վավերացումը օգտակար է բիզնես կանոնների համար, բայց SQL injection-ի հիմնական պաշտպանությունը չէ։ Կենտրոնական պաշտպանությունն այն է, որ SQL հրահանգներն ու արժեքները տարանջատվեն, որպեսզի driver-ը արժեքներն ուղարկի որպես տվյալ։ Դինամիկ identifier-ները, օրինակ՝ աղյուսակի անունը կամ sort ուղղությունը, պահանջում են խիստ allowlist, քանի որ դրանք սովորաբար չեն bind արվում սովորական արժեքների նման։"],scenario:"Search endpoint-ը հարցումը կառուցում է՝ որոնման տողը միացնելով SQL-ին։ Հատուկ ձևավորված արժեքը փոխում է predicate-ը՝ սովորական որոնման բառ լինելու փոխարեն։",verify:"Վերանայեք query-ի կառուցումը և parameterized ուղիները փորձարկեք հատուկ նիշերով։ Ստուգեք dynamic sorting-ը, filter-ները, reporting հարցումները և անվտանգությունը փորձարկեք նվազագույն իրավունքներով օգտատիրոջ միջոցով։",controls:["Օգտագործեք parameterized query կամ ORM API, որոնք արժեքները bind են անում, այլ ոչ թե միացնում SQL տողին։","Dynamic column name-երը, sort ուղղություններն ու SQL fragment-ները սահմանափակեք allowlist-ով։","Հավելվածի DB օգտատիրոջը տվեք միայն անհրաժեշտ թույլտվությունները։","DB սխալները անվտանգ գրանցեք և regression test արեք չվստահված մուտք ընդունող query-ների համար։"],sourceLabel:"OWASP SQL Injection Prevention Cheat Sheet"},
      {tag:"ՌԵՍՈՒՐՍՆԵՐԻ ՍՊԱՌՈՒՄ",acronym:"DoS",name:"Denial of Service",lead:"DoS-ը ծառայությունն անհասանելի է դարձնում՝ սպառելով ռեսուրսը կամ ստիպելով հավելվածին կատարել չափազանց մեծ աշխատանք։",body:["Մերժման կամ անհասանելիության վիճակ կարող է առաջանալ հարցումների հոսքից, մեծ payload-ներից, թանկ որոնումներից, ֆայլերի անվերջ մշակումից, դանդաղ կախվածություններից, չափազանց մեծ concurrency-ից կամ մուտքային չափին համեմատ անհամաչափ աճող ալգորիթմական աշխատանքից։ Մի աղբյուրը կարող է բավարար լինել, եթե մեկ հարցումը չափազանց թանկ է կամ սահմանափակումներ չկան։","Հասանելիությունը ամբողջ համակարգի հատկություն է։ Հավելվածի կոդը, reverse proxy-ն, տվյալների բազան, queue-ները, արտաքին API-ները և ենթակառուցվածքը պետք է ունենան ողջամիտ սահմաններ։ Միայն rate limiting-ը բավարար չէ, եթե թույլատրված մի քանի հարցումը կարող է սպառել CPU, հիշողություն, DB connection կամ worker-ի ժամանակ։"],scenario:"Endpoint-ը ընդունում է մեծ ֆայլ կամ թանկ որոնման հարցում՝ առանց չափի, ժամանակի կամ concurrency սահմանափակման։ Մի քանի հարցում զբաղեցնում է worker-ներն ու DB կապերը և խանգարում օրինական օգտատերերին։",verify:"Վերահսկվող միջավայրում կատարեք load test՝ նախապես համաձայնեցված սահմաններով։ Չափեք latency-ն, queue depth-ը, հիշողությունը, CPU-ն, DB կապերն ու վերականգնման ժամանակը․ ստուգեք oversized և դանդաղ հարցումների կանխատեսելի մերժումը։",controls:["Սահմանեք body-size, request timeout, concurrency և յուրաքանչյուր գործողության resource budget սահմաններ։","Թանկ endpoint-ների համար կիրառեք rate limit և quota՝ account-ի, token-ի և ցանցային ազդանշանների հիման վրա։","Թանկ գործողությունների համար օգտագործեք caching, pagination, սահմանափակ queue և back-pressure։","Նախագծեք graceful degradation, health check, alerting և փորձարկված վերականգնման ընթացակարգեր։"],sourceLabel:"OWASP Denial of Service Cheat Sheet"},
      {tag:"ԲԱՇԽՎԱԾ ՀԱՍԱՆԵԼԻՈՒԹՅԱՆ ՀԱՐՁԱԿՈՒՄ",acronym:"DDoS",name:"Distributed Denial of Service",lead:"Բաշխված ծառայության մերժման հարձակումը բազմաթիվ առանձին աղբյուրներից սպառում է այն ռեսուրսները, որոնք անհրաժեշտ են կայքի, API-ի կամ ցանցի բնականոն հասանելիությունը պահպանելու համար։",body:["Մեկ աղբյուրից DoS դեպքից տարբեր՝ DDoS-ի ժամանակ երթևեկը կարող է միաժամանակ գալ բազմաթիվ սարքերից, ցանցերից և աշխարհագրական վայրերից։ Աղբյուրները բաշխված են, ուստի մեկ IP հասցեի արգելափակումը բավարար չէ, իսկ վնասակար հարցումները երբեմն կարող են նմանվել սովորական այցելուների հանկարծակի աճին։","DDoS դեպքերը սովորաբար բաժանվում են երեք լայն խմբի։ Ծավալային հարձակումները փորձում են սպառել հասանելի bandwidth-ը։ Protocol կամ state-exhaustion հարձակումները ծանրաբեռնում են ցանցային սարքերը, connection table-ները կամ միացման հաստատման ռեսուրսները։ Application-layer հարձակումները ստեղծում են մեծ թվով HTTP կամ API հարցումներ, որոնք սպառում են վեբ worker-ները, տվյալների բազայի միացումները, cache-ը կամ հավելվածի այլ թանկ ռեսուրսներ։ Մեկ միջադեպում այս տեսակները կարող են համակցվել։","Ազդեցությունը միայն դանդաղ բացվող էջը չէ։ Այցելուները կարող են տեսնել timeout, անկայուն 5xx սխալներ կամ մուտքի անհաջող փորձեր։ Ֆոնային աշխատանքները կարող են կուտակվել, վճարման, որոնման և հաշվի ծառայությունները՝ դառնալ անհասանելի, իսկ origin ենթակառուցվածքը՝ ծանրաբեռնվել նույնիսկ այն դեպքում, երբ CDN-ը շարունակում է սպասարկել cache-ում պահված ֆայլերը։ Դեպքը կարող է նաև մեծացնել մատակարարների ծախսերը և քողարկել այլ տեխնիկական խնդիրներ։","Հայտնաբերելու համար մի քանի չափանիշ պետք է համեմատել կայքի սովորական բազային մակարդակի հետ։ Օգտակար ցուցանիշներ են bandwidth-ը և packets-per-second-ը, նոր ու միաժամանակյա connection-ները, route-ների հարցումների հաճախականությունը, latency-ն, 4xx/5xx սխալները, cache hit ratio-ն, origin-ի CPU-ն և տվյալների բազայի միացումները։ Գովազդային արշավը կամ ապրանքի թողարկումն էլ կարող է մեծացնել այցելությունները, հետևաբար միայն երթևեկի ծավալը հարձակման ապացույց չէ։","Պաշտպանությունը պետք է լինի բազմաշերտ և հաճախ սկսվի հավելվածից առաջ՝ upstream մակարդակում։ Hosting կամ network provider-ը կամ DDoS պաշտպանության ծառայությունը կարող է զտել անցանկալի երթևեկը՝ մինչև այն հասնի origin-ին։ CDN-ը և WAF-ը լրացնում են edge պաշտպանությունը, origin firewall-ը կանխում է ուղիղ շրջանցումը, իսկ հավելվածի սահմանափակումները պաշտպանում են թանկ endpoint-ները։ Cache-ը, հերթերը և back-pressure-ը օգնում են համակարգին վերահսկվող ձևով նվազեցնել բեռնվածությունը։ Միայն worker-ների կամ սերվերների քանակը մեծացնելը DDoS-ի ամբողջական լուծում չէ։"],scenario:"Փոքր առցանց խանութը հայտարարում է սահմանափակ քանակով ապրանքի թողարկման մասին։ Նույն ժամանակ բաշխված հարցումների կտրուկ աճ է ուղղվում գլխավոր էջին, որոնմանը և մուտքի route-ներին։ CDN-ը շարունակում է տրամադրել cache-ում պահված ստատիկ ֆայլերը, սակայն cache-ից դուրս հարցումները սկսում են timeout տալ, իսկ origin-ի connection pool-ը մոտենում է սահմանին։ Թիմը համեմատում է ցուցանիշները սովորական բազային մակարդակի հետ, կապվում է պաշտպանության մատակարարի հետ, ուժեղացնում է համապատասխան edge կանոնները և սահմանափակում origin-ի հասանելիությունը միայն պաշտպանված edge-ից։ Թիմը հետևում է սխալների տոկոսին և հերթերի երկարությանը, մինչև սովորական այցելուների հասանելիությունը վերականգնվի։",verify:"Նախապես պատրաստեք և hosting/CDN մատակարարի հետ վերանայեք հասանելիության վարժության գրավոր պլանը։ Օգտագործեք միայն մատակարարի կողմից թույլատրված սիմուլյացիա, թեստային միջավայր կամ tabletop վարժություն․ երբեք մի ստեղծեք անվերահսկելի flood հանրային ծառայության դեմ։ Ստուգեք՝ alert-ները գործարկվո՞ւմ են, origin-ը հնարավո՞ր չէ շրջանցել edge-ը, արտակարգ կապի անձինք հասանելի՞ են, rate limit-ները չեն արգելափակո՞ւմ սովորական օգտատերերին, cache-ը շարունակում է աշխատե՞լ, failover-ը գործո՞ւմ է, և միջադեպերի runbook-ը հստակ սահմանո՞ւմ է որոշումների ու հաղորդակցության պատասխանատուներին։",controls:["Օգտագործեք hosting ճարտարապետությանը և սպասվող երթևեկին համապատասխան upstream DDoS պաշտպանության ծառայություն, պաշտպանված CDN կամ anycast ցանց։","Սահմանափակեք origin-ին ուղիղ հասանելիությունը, որպեսզի այցելուները չշրջանցեն CDN-ը կամ պաշտպանության մատակարարին։ Հնարավորության դեպքում origin-ի հասցեներն ու կառավարման միջերեսները պահեք փակ։","Կիրառեք edge-ի բազմաշերտ վերահսկիչներ՝ WAF կանոններ, bot management, հարցումների նորմալացում և կասկածելի վարքագծի համար ճիշտ կարգավորված challenge-ներ։","Սահմանեք route-ին համապատասխան rate limit, միաժամանակյա հարցումների սահմաններ, հարցման բյուջեներ և քվոտաներ։ Մի հիմնվեք միայն մեկ IP հասցեի վրա․ համադրեք հաշվի, session-ի, token-ի և ցանցային ազդանշանները։","Cache արեք հանրային ու կրկնվող պատասխանները, սահմանափակեք հերթերը, տվյալների բազայի connection pool-երը և ֆոնային worker-ները, իսկ թանկ գործողությունների համար կիրառեք timeout և back-pressure։","Հետևեք bandwidth-ին, packets-per-second-ին, connection-ների քանակին, route-ների հարցումների հաճախականությանը, latency-ին, 4xx/5xx սխալներին, cache hit rate-ին և origin-ի ծանրաբեռնվածությանը՝ համեմատելով բազային մակարդակի հետ։","Պահեք միջադեպերի runbook՝ մատակարարին դիմելու կոնտակտներով, պատասխանատուներով, կարգավիճակի հաղորդմամբ, failover քայլերով, ապացույցների պահպանմամբ և հետմիջադեպային վերլուծությամբ։"],sourceLabel:"Cloudflare: What is a DDoS attack?"},
      {tag:"ԱՎՏՈՄԱՏԱՑՎԱԾ ՉԱՐԱՇԱՀՈՒՄ",acronym:"BOTS",name:"Automated Attacks & Bot Protection",lead:"Ավտոմատացված չարաշահումը օգտագործում է script-եր կամ bot ցանցեր՝ public ձևերի, մուտքի գործընթացների և API-ների դեմ մեծ ծավալով գործողություններ կատարելու համար։",body:["Bot-երը կարող են ուղարկել spam, քերել բովանդակությունը, հայտնաբերել account-ներ, փորձարկել արտահոսած credentials, կատարել password guessing, ամրագրել սահմանափակ քանակի ապրանք կամ սպառել թանկ API։ Սակայն ամեն ավտոմատ գործունեություն վնասակար չէ․ որոնման crawler-ները, monitoring ծառայությունները և accessibility գործիքները նույնպես ավտոմատ են, ուստի պաշտպանությունը պետք է տարբերակի օրինական ավտոմատացումը վնասակար վարքից։","Լավ պաշտպանությունը շերտավորված է և հիմնված է ռիսկի վրա։ Միայն IP արգելափակելը հեշտ է շրջանցել և կարող է վնասել նույն ցանցից օգտվող մարդկանց։ Ազդանշանները կարող են ներառել account-ի վարքը, հարցումների հաճախականությունը, device/session հետևողականությունը, ձախողված authentication-ը և գործողության զգայունությունը։"],scenario:"Login կամ contact endpoint-ը բազմիցս ուղարկվում է script-երով։ Երթևեկը ստեղծում է account lockout, spam գրառումներ կամ ավելորդ verification հարցումներ։",verify:"Ստուգեք rate limit-ները account-ի ու route-ի համար, challenge-ի աստիճանականացումը, account enumeration-ի վարքը, logging-ը և օրինական crawler-ների հասանելիությունը։ Հաստատեք, որ կրկնված submit-ը նույն side effect-ը չի կրկնում։",controls:["Կիրառեք շերտավորված rate limit՝ account-ի, session-ի, route-ի և ցանցային ազդանշանների հիման վրա։","Զգայուն հաշիվների համար օգտագործեք MFA և արտահոսած գաղտնաբառերի ստուգում։","Bot challenge կամ proof-of-work ավելացրեք աստիճանաբար՝ միայն համապատասխան ռիսկի դեպքում։","Կիրառեք idempotency, abuse monitoring և թույլատրող կանոններ օրինական ավտոմատացման համար։"],sourceLabel:"OWASP Automated Threats to Web Applications"},
      {tag:"AI-ՈՎ ԱՆՎՏԱՆԳՈՒԹՅԱՆ ԳՈՐԾԱՌՆՈՒԹՅՈՒՆՆԵՐ",acronym:"AI DEFENCE",name:"AI-Powered Security Defence",lead:"AI-ն կարող է օգնել հայտնաբերել օրինաչափություններն ու առաջնահերթ դարձնել ազդանշանները, բայց պետք է աջակցի, ոչ թե փոխարինի անվտանգության ինժեներիային և մարդկային դատողությանը։",body:["Անվտանգության համակարգերը ստեղծում են մեծ ծավալի log և alert։ Machine learning և language model գործիքները կարող են խմբավորել հարակից իրադարձությունները, ամփոփել կասկածելի հաջորդականությունները, նկատել բազային վարքից շեղումները և առաջարկել հետաքննության քայլեր։ Սա կարող է արագացնել triage-ը, եթե մոդելն ունի բավարար համատեքստ և ելքը ստուգվում է սկզբնական ապացույցներով։","AI-ի արդյունքը կարող է սխալ կամ թերի լինել կամ մանիպուլացվել մշակվող տվյալների միջոցով։ Մոդելը կարող է չափազանցնել թույլ ազդանշանը, բաց թողնել նոր pattern կամ առաջարկել անապահով քայլ։ Կարևոր անվտանգության որոշումները պետք է հիմնվեն հստակ policy check-երի, audit-able ապացույցների և մարդու հաստատման վրա։"],scenario:"AI օգնականը ուսումնասիրում է authentication և application log-երը, նկատում անսովոր հաջորդականություն և առաջարկում հետաքննություն։ Վերլուծաբանը ստուգում է սկզբնական իրադարձությունները և հաստատում՝ արդյոք սպառնալիքն իրական է։",verify:"Գնահատեք հայտնի test incident-ներով և false-positive դեպքերով։ Չափեք հայտնաբերման որակը, բացատրելիությունը, տվյալների մշակումը, թույլտվություններն ու առաջարկը մերժելու օպերատորի հնարավորությունը։",controls:["AI-ն օգտագործեք correlation-ի ու triage-ի համար՝ enforcement-ը պահելով հստակ policy control-ներում։","Մոդել ուղարկելուց առաջ նվազեցրեք կամ ծածկագրեք զգայուն տվյալները։","Օգտատեր արգելափակելու, թույլտվություն փոխելու կամ կործանարար գործողություն կատարելու համար պահանջեք մարդու վերանայում։","Audit-ի համար գրանցեք ապացույցը, մոդելի/տարբերակի համատեքստը, մարդու որոշումն ու արդյունքը։"],sourceLabel:"NIST AI Risk Management Framework"},
      {tag:"LLM / AGENT ՀԱՎԵԼՎԱԾԻ ԱՆՎՏԱՆԳՈՒԹՅՈՒՆ",acronym:"AI APPSEC",name:"AI Application Security",lead:"AI հավելվածները ավելացնում են prompt injection-ի, տվյալների արտահոսքի, վտանգավոր tool call-երի և չվստահված retrieval բովանդակության ռիսկերը։",body:["Prompt injection-ը առաջանում է, երբ օգտատիրոջ մուտքում կամ ստացված բովանդակության մեջ ներդրված հրահանգները փորձում են շրջանցել հավելվածի նախատեսված վարքը։ Ռիսկը մեծանում է, երբ AI-ն կարող է մուտք ունենալ մասնավոր փաստաթղթերին, կանչել գործիքներ, զննել URL-ներ, գործարկել կոդ կամ գործողություն կատարել օգտատիրոջ իրավունքներով։ Արտաքին էջերն ու վերբեռնված ֆայլերը պետք է դիտարկվեն որպես չվստահված տվյալներ, ոչ թե վստահելի policy հրահանգներ։","Prompt-ը access-control սահման չէ։ Հավելվածը պետք է իրավունքները ստուգի մոդելից դուրս, տրամադրի միայն անհրաժեշտ գործիքները և ստուգի բոլոր արգումենտները նախքան կատարումը։ Զգայուն կամ անդառնալի գործողությունները պետք է պահանջեն օգտատիրոջ հստակ հաստատումը, իսկ մոդելի ելքը պետք է դիտարկվի որպես չվստահված՝ երբ ցուցադրվում կամ փոխանցվում է այլ համակարգի։"],scenario:"Օգնականը ստանում է փաստաթուղթ, որի մեջ կան հակառակորդի հրահանգներ, և խնդրում են ամփոփել այն։ Եթե հավելվածը փաստաթղթի տեքստը համարում է վստահելի կառավարման հրահանգ, մոդելը կարող է փորձել բացահայտել տվյալներ կամ կանչել չնախատեսված գործիք։",verify:"Կատարեք prompt-injection և տվյալների սահմանների փորձարկումներ՝ չվստահված փաստաթղթերով, web բովանդակությամբ և tool արգումենտներով։ Հաստատեք, որ access check-ը սերվերային է, գաղտնիքները model context-ում չեն և վտանգավոր գործողությունները պահանջում են հաստատում։",controls:["System policy-ն տարանջատեք retrieval բովանդակությունից և արտաքին բովանդակությունը հստակ նշեք որպես չվստահված։","Թույլտվությունները կիրառեք հավելվածի կոդում․ մոդելին մի վստահեք access իրավունքների որոշումը։","Օգտագործեք least-privilege tool allowlist, վավերացված schema և ցանցային խիստ սահմաններ։","Բարձր ազդեցություն ունեցող գործողությունների համար պահանջեք օգտատիրոջ հաստատում և անվտանգ վավերացրեք մոդելի ելքը։"],sourceLabel:"OWASP GenAI: Prompt Injection"},
      {tag:"ԱՆՎՏԱՆԳՈՒԹՅԱՆ ԹԵՍՏԱՎՈՐՄԱՆ ՀՈՍՔ",acronym:"AUTOMATION",name:"Automated Security Testing",lead:"Ավտոմատ թեստավորումը պարբերաբար ստուգում է կոդը, dependency-ները, կոնֆիգուրացիան և աշխատող հավելվածը՝ հայտնի խոցելիությունների դասերի համար։",body:["Անվտանգության ստուգումներն առավել օգտակար են, երբ ներառված են մշակման ցիկլում։ SAST-ը ուսումնասիրում է source code-ը, SCA-ն հայտնաբերում է ռիսկային dependency-ները, secret scanning-ը գտնում է պատահաբար commit արված credentials-ը, DAST-ը արտաքինից ուսումնասիրում է աշխատող հավելվածը, իսկ configuration scanner-ները ստուգում են deployment կարգավորումները։","Ոչ մի scanner չի ապացուցում, որ հավելվածն անվտանգ է։ Գործիքները կարող են բաց թողնել business logic թերությունները կամ տալ false positive։ Արդյունքները պետք է դասակարգել, առաջնահերթ դարձնել ըստ exploitability-ի և ազդեցության, նշանակել պատասխանատու և շտկումից հետո կրկին ստուգել։ DAST և load test-երը պետք է կատարվեն միայն թույլատրված միջավայրերում։"],scenario:"Pull request-ը գործարկում է code, dependency և secret scan։ Deployment pipeline-ը staging միջավայրում կատարում է նաև անվտանգ dynamic check-եր։ Գտածոները release-ը կանգնեցնում են միայն փաստագրված severity policy-ի համաձայն։",verify:"Հաստատեք, որ scan-երը գործարկվում են սպասվող branch-երի և artifact-ների համար, ուսումնասիրեք օրինակ արդյունքները և ստուգեք, որ ուղղումը փակում է սկզբնական finding-ը։",controls:["CI/CD-ում ներառեք SAST, SCA, secret scanning և configuration check-եր։","DAST-ը գործարկեք թույլատրված staging target-երի վրա՝ test account-ներով և rate limit-ով։","Գտածոները դասակարգեք ըստ severity-ի, exploitability-ի և բիզնես ազդեցության, նշանակեք պատասխանատուների։","Վերստուգեք շտկումները և պահեք dependency update, scan policy և բացառությունների փաստաթղթավորում։"],sourceLabel:"OWASP Web Security Testing Guide"},
      {tag:"ԹՈՒՅԼԱՏՐՎԱԾ ԱՆՎՏԱՆԳՈՒԹՅԱՆ ԳՆԱՀԱՏՈՒՄ",acronym:"PENTEST",name:"Penetration Testing",lead:"Penetration test-ը սահմանված միջավայրում իրականացվող թույլատրված գնահատում է, որը ստուգում է՝ արդյոք թուլությունը գործնականորեն շահագործելի է։",body:["Մասնագիտական ստուգումը սկսվում է գրավոր թույլտվությունից, scope-ից, rules of engagement-ից, թեստավորման ժամերից, կապի անձանցից և անվտանգության սահմանափակումներից։ Թեստավորողը քարտեզագրում է attack surface-ը, ուսումնասիրում հնարավոր թուլությունները, վավերացնում ընտրված գտածոները և փաստագրում ապացույցն ու բիզնես ազդեցությունը։ Նպատակը վնաս պատճառելը կամ ապացույցի համար անհրաժեշտից ավելի տվյալ ստանալը չէ։","Օգտակար հաշվետվությունը նկարագրում է ազդված ակտիվը, պայմանները, վերարտադրվող ապացույցը, ազդեցությունը, severity-ի հիմնավորումն ու գործնական շտկումը։ Ուղղումից հետո retest-ը հաստատում է՝ արդյոք խոցելիությունը փակվել է և փոփոխությունը նոր խնդիր չի ստեղծել։ Scanner-ը ինքնին penetration test չէ, իսկ արդյունքը վերաբերում է միայն ստուգված scope-ին և ժամանակին։"],scenario:"Հաճախորդը թույլատրում է staging web հավելվածի թեստավորում։ Թեստավորողը հետևում է համաձայնեցված scope-ին, test account-ներով վավերացնում է access-control խնդիրը և փաստագրում ապացույցը՝ առանց կապ չունեցող տվյալներին հասնելու։",verify:"Թեստից առաջ ստուգեք գրավոր թույլտվությունը, scope-ն ու բացառությունները։ Գնահատման ընթացքում անվտանգ պահեք log-երն ու ապացույցը, իսկ վերջում յուրաքանչյուր finding-ի համար հաստատեք պատասխանատու, շտկում և retest արդյունք։",controls:["Ստացեք գրավոր թույլտվություն և սահմանեք scope, բացառություններ, ժամկետներ ու escalation կապեր։","Օգտագործեք ճանաչված մեթոդաբանություն ու անվտանգ test account-ներ․ խուսափեք կործանարար կամ scope-ից դուրս գործողություններից։","Հաշվետվությունում հստակ ներկայացրեք ապացույցը, ազդեցությունը, severity-ն, սահմանափակումներն ու շտկումը։","Կրկին ստուգեք շտկումները և հստակ նշեք՝ ինչն է թեստավորվել․ ապացույցից ավել certification մի ենթադրեք։"],sourceLabel:"NIST SP 800-115: Technical Guide to Information Security Testing"}
    ],
    ru: [
      {tag:"ВНЕДРЕНИЕ В БРАУЗЕР",acronym:"XSS",name:"Cross-Site Scripting",lead:"XSS возникает, когда браузер воспринимает недоверенный контент как исполняемый скрипт, а не как обычные данные.",body:["Злоумышленник может поместить специально подготовленный контент в форму, параметр URL, комментарий, профиль или другое поле ввода. Если приложение затем вставляет это значение на страницу без обработки, соответствующей контексту вывода, браузер может выполнить его в контексте сайта. Последствия зависят от страницы, прав пользователя и данных, доступных его сессии.","Основные виды: Stored XSS (payload сохраняется и показывается другим пользователям), Reflected XSS (payload сразу возвращается в ответе) и DOM-based XSS (небезопасный путь создаётся клиентским кодом). Защита зависит от места вставки: HTML-текст, атрибут, URL, CSS и JavaScript — разные контексты вывода."],scenario:"Комментарий сохраняется как текст, но шаблон или клиентский скрипт вставляет его небезопасной HTML-операцией. Посетитель открывает страницу, и браузер интерпретирует комментарий как разметку или скрипт.",verify:"Проверьте Stored, Reflected и DOM-пути с безвредными маркерами. Убедитесь, что текст остаётся текстом, rich text очищается строгим allowlist, а ввод не выходит из предназначенного контекста.",controls:["Применяйте контекстно-зависимое кодирование вывода в момент отображения.","Предпочитайте безопасные DOM API, например textContent; избегайте небезопасных HTML sink для недоверенных данных.","Если нужен rich HTML, используйте поддерживаемый sanitizer с узким allowlist.","Используйте CSP как дополнительный уровень, а не вместо безопасной обработки вывода."],sourceLabel:"OWASP XSS Prevention Cheat Sheet"},
      {tag:"ЦЕЛОСТНОСТЬ ЗАПРОСА И СЕССИИ",acronym:"CSRF",name:"Cross-Site Request Forgery",lead:"CSRF пытается заставить уже аутентифицированный браузер отправить нежелательный запрос, изменяющий состояние.",body:["Браузеры автоматически прикрепляют подходящие cookie к запросам. Вредоносный сайт может попытаться заставить браузер жертвы отправить запрос другому сайту, где пользователь уже вошёл в систему. Если приложение полагается только на session cookie и не проверяет намеренное инициирование действия со стороны приложения, запрос может быть принят.","CSRF особенно актуален для cookie-аутентификации и действий, меняющих состояние сервера: изменения профиля, email или заказа. Это не кража пароля — атака злоупотребляет уже существующим аутентифицированным контекстом браузера."],scenario:"Авторизованный администратор открывает постороннюю страницу. Она пытается отправить скрытый запрос в админ-приложение. Без проверки anti-CSRF браузер может прикрепить session cookie администратора.",verify:"Для каждого изменяющего состояние маршрута проверьте отсутствующий, неверный и просроченный token. Убедитесь, что GET не меняет состояние, а проверки Origin и настройки cookie работают ожидаемо.",controls:["Используйте непредсказуемые CSRF-токены, связанные с сессией, и проверяйте их на сервере.","Настройте для session cookie подходящие атрибуты SameSite, Secure и HttpOnly.","При необходимости проверяйте Origin или Referer; Fetch Metadata используйте как дополнительный сигнал.","Для изменения состояния используйте POST/PUT/PATCH/DELETE и не считайте CORS защитой от CSRF."],sourceLabel:"OWASP CSRF Prevention Cheat Sheet"},
      {tag:"ПРОВЕРКА СЕРВЕРНЫХ ЗАПРОСОВ",acronym:"SSRF",name:"Server-Side Request Forgery",lead:"SSRF возникает, когда недоверенный пользователь может заставить приложение обращаться к выбранным им сетевым адресам.",body:["Функции URL preview, проверки webhook, импорта изображений, конвертации документов и загрузки удалённых файлов могут выполнять исходящие запросы от имени сервера. Если адрес назначения не ограничен, злоумышленник может попытаться обратиться к внутренним сервисам, loopback-адресам, private-сетям или cloud metadata endpoint, недоступным напрямую из Интернета.","Проверки только видимой строки URL недостаточно. DNS, redirect, IPv4/IPv6, порты и изменения между проверкой и соединением могут изменить фактический адрес назначения. По возможности откажитесь от произвольной загрузки URL; иначе сочетайте строгую политику адресов с сетевыми ограничениями исходящего трафика."],scenario:"Endpoint импорта URL принимает адрес пользователя, после чего сервер выполняет fetch. Адрес разрешается во внутренний сервис или публичный URL перенаправляет на запрещённый адрес.",verify:"В разрешённой staging-среде проверьте допустимые и запрещённые назначения. Включите private и loopback IP, IPv6, redirect, необычное кодирование и изменения DNS; убедитесь, что проверяется фактический IP соединения.",controls:["Предпочитайте allowlist адресатов и строго определяйте нужные схемы, хосты и порты.","Проверяйте DNS-ответ и отклоняйте loopback, link-local, private и reserved адреса; перепроверяйте конечный адрес.","Отключите redirect или валидируйте каждую цель перенаправления до перехода.","Ограничьте исходящий сетевой доступ и заблокируйте metadata и внутренние управляющие сети."],sourceLabel:"OWASP SSRF Prevention Cheat Sheet"},
      {tag:"БЕЗОПАСНОСТЬ ЗАПРОСОВ К БАЗЕ ДАННЫХ",acronym:"SQLi",name:"SQL Injection",lead:"SQL injection возникает, когда недоверенный ввод меняет структуру или смысл запроса к базе данных.",body:["Риск появляется, когда приложение формирует SQL конкатенацией пользовательских значений с текстом запроса. Подготовленное значение может выйти из предназначенной позиции данных и изменить фильтрацию, сортировку или другую логику. В зависимости от прав базы данных это может раскрыть, изменить или удалить сведения.","Проверка ввода полезна для бизнес-правил, но не является основной защитой от SQL injection. Ключевой контроль — отделять инструкции SQL от значений, передавая значения драйверу как данные. Динамические идентификаторы, например имена таблиц или направление сортировки, требуют строгого allowlist."],scenario:"Endpoint поиска объединяет поисковую строку с SQL. Специально сформированное значение изменяет условие запроса вместо того, чтобы оставаться поисковым термином.",verify:"Проверьте построение запросов и parameterized пути на специальных символах. Проверьте динамическую сортировку, фильтры и отчёты; используйте тестовую учётную запись с минимальными правами.",controls:["Используйте parameterized queries или ORM, которые связывают значения, а не конкатенируют SQL.","Ограничьте динамические имена столбцов, сортировку и SQL-фрагменты allowlist.","Выдавайте приложению только необходимые права базы данных.","Безопасно журналируйте DB-ошибки и регрессионно тестируйте каждый путь с недоверенным вводом."],sourceLabel:"OWASP SQL Injection Prevention Cheat Sheet"},
      {tag:"ИСЧЕРПАНИЕ РЕСУРСОВ",acronym:"DoS",name:"Denial of Service",lead:"DoS делает сервис недоступным за счёт исчерпания ресурса или чрезмерно затратной работы приложения.",body:["Отказ в обслуживании может возникнуть из-за потока запросов, больших payload, дорогого поиска, неограниченной обработки файлов, медленных зависимостей, чрезмерной конкуренции или алгоритмической работы, резко растущей с размером ввода. Одного источника может быть достаточно, если запрос непропорционально дорог или отсутствуют ограничения.","Доступность — свойство всей системы. Код приложения, reverse proxy, база данных, очереди, внешние API и инфраструктура должны иметь разумные лимиты. Одного rate limiting недостаточно, если несколько разрешённых запросов могут исчерпать CPU, память, соединения БД или время worker."],scenario:"Endpoint принимает большой файл или дорогой поисковый запрос без ограничений размера, времени и конкуренции. Несколько запросов занимают workers и DB-соединения и мешают легитимным пользователям.",verify:"Проведите контролируемый load test с согласованными лимитами. Измеряйте latency, очередь, память, CPU, DB-соединения и время восстановления; проверьте предсказуемый отказ больших и медленных запросов.",controls:["Установите лимиты размера тела, timeout, concurrency и бюджет ресурсов операции.","Ограничивайте дорогие endpoint и вводите квоты по аккаунту, token и сетевым сигналам.","Используйте кэширование, пагинацию, ограниченные очереди и back-pressure.","Предусмотрите graceful degradation, health checks, alerting и проверенные процедуры восстановления."],sourceLabel:"OWASP Denial of Service Cheat Sheet"},
      {tag:"РАСПРЕДЕЛЁННАЯ АТАКА НА ДОСТУПНОСТЬ",acronym:"DDoS",name:"Distributed Denial of Service",lead:"Распределённая атака на отказ в обслуживании использует множество отдельных источников, чтобы исчерпать ресурсы, необходимые для доступности сайта, API или сети.",body:["В отличие от DoS из одного источника, при DDoS трафик может одновременно поступать от множества устройств, сетей и географических точек. Источники распределены, поэтому блокировка одного IP-адреса не решает проблему, а вредоносные запросы иногда выглядят как внезапный рост обычной аудитории.","DDoS-события обычно относят к трём широким категориям. Объёмные атаки стремятся занять доступную пропускную способность. Протокольные атаки и истощение состояния соединений нагружают сетевые устройства, таблицы соединений или ресурсы обработки handshake. Атаки прикладного уровня создают множество HTTP- или API-запросов, расходующих web workers, соединения с базой данных, cache и другие дорогие ресурсы приложения. В одном инциденте эти типы могут сочетаться.","Последствия не ограничиваются медленной загрузкой страницы. Посетители могут видеть timeout, нестабильные ответы 5xx и ошибки входа; фоновые задачи накапливаются; оплата, поиск и учётные записи становятся недоступными; origin-инфраструктура перегружается даже тогда, когда CDN продолжает отдавать кешированные статические файлы. Инцидент также может увеличить расходы у провайдера и скрыть другие эксплуатационные проблемы.","Для обнаружения нужно сравнивать несколько показателей с обычным базовым уровнем сайта. Полезны bandwidth и packets-per-second, число новых и одновременных соединений, частота запросов по route, latency, доля ошибок 4xx/5xx, cache hit ratio, загрузка CPU origin-сервера и соединения с базой данных. Рекламная кампания или запуск продукта тоже могут вызвать всплеск посещений, поэтому один лишь объём трафика не доказывает наличие атаки.","Защита должна быть многоуровневой и часто начинается выше уровня приложения. Hosting- или network-провайдер либо специализированный DDoS-сервис может фильтровать нежелательный трафик до его попадания на origin. CDN и WAF добавляют edge-контроли; правила firewall для origin предотвращают прямой обход; лимиты приложения защищают дорогие endpoints; cache, очереди и back-pressure помогают системе деградировать контролируемо. Простое увеличение числа application workers или серверов не является полноценной защитой от DDoS."],scenario:"Небольшой интернет-магазин объявляет о выпуске ограниченной партии товара. Одновременно распределённый всплеск запросов направлен на главную страницу, поиск и вход. CDN продолжает отдавать кешированные статические ресурсы, но запросы к динамическим маршрутам начинают завершаться timeout, а connection pool origin-сервера приближается к пределу. Команда сравнивает показатели с обычным базовым уровнем, связывается с провайдером защиты, усиливает edge-правила для затронутых маршрутов и разрешает доступ к origin только через защищённый edge. Доступ обычных посетителей восстанавливается постепенно, пока команда наблюдает за ошибками и очередями.",verify:"Заранее подготовьте письменный план упражнения по доступности и согласуйте его с hosting/CDN-провайдером. Используйте только одобренные провайдером симуляции, тестовые среды или tabletop-упражнения; никогда не создавайте неконтролируемый flood против публичного сервиса. Проверьте срабатывание alert, невозможность обхода edge к origin, доступность экстренных контактов провайдера, отсутствие блокировки обычных пользователей rate limits, работу кешированного контента и failover, а также распределение ролей в incident runbook.",controls:["Используйте upstream DDoS mitigation, защищённый CDN или anycast-сеть, соответствующие архитектуре хостинга и ожидаемому профилю трафика.","Ограничьте прямой доступ к origin, чтобы посетители не могли обходить CDN или провайдера защиты. По возможности держите адреса origin и панели управления закрытыми.","Применяйте многоуровневые edge-контроли: правила WAF, bot management, нормализацию запросов и корректно настроенные challenge для подозрительных сценариев.","Настройте rate limits по маршрутам, ограничения параллелизма, бюджеты запросов и квоты. Комбинируйте сигналы учётной записи, session, token и сети вместо опоры только на IP-адрес.","Кешируйте публичные повторяемые ответы; ограничивайте очереди, connection pool базы данных и фоновые worker-ы; используйте timeout и back-pressure для дорогих операций.","Отслеживайте bandwidth, packets-per-second, количество соединений, частоту запросов по маршрутам, latency, ошибки 4xx/5xx, cache hit rate и нагрузку origin относительно базового уровня.","Поддерживайте incident runbook с контактами эскалации провайдера, ответственными, коммуникацией статуса, шагами failover, сохранением доказательств и разбором после инцидента."],sourceLabel:"Cloudflare: What is a DDoS attack?"},
      {tag:"АВТОМАТИЗИРОВАННОЕ ЗЛОУПОТРЕБЛЕНИЕ",acronym:"BOTS",name:"Automated Attacks & Bot Protection",lead:"Автоматизированные злоупотребления используют скрипты и сети ботов для массовых действий против публичных форм, входа и API.",body:["Боты могут отправлять spam, собирать содержимое, перечислять аккаунты, проверять украденные credentials, подбирать пароли, бронировать ограниченный товар или потреблять дорогой API. Однако не всякая автоматизация вредоносна: поисковые crawler, мониторинг и инструменты доступности также автоматизированы, поэтому защита должна отличать ожидаемую автоматизацию от вредоносного поведения.","Хорошая защита многоуровневая и учитывает риск. Блокировка только по IP легко обходится и может навредить людям за общим адресом. Сигналы могут включать поведение аккаунта, скорость запросов, согласованность device/session и чувствительность действия. Усиливайте проверку при росте риска, а не создавайте трение для каждого посетителя."],scenario:"Endpoint входа или контактов многократно вызывается скриптами. Трафик создаёт блокировки аккаунтов, spam-записи или чрезмерные запросы проверки.",verify:"Проверьте rate limits по аккаунту и маршруту, постепенное усиление challenge, защиту от account enumeration, журналы и доступ легитимных crawler. Убедитесь, что повторная отправка не повторяет side effect.",controls:["Применяйте многоуровневые rate limits по аккаунту, сессии, маршруту и сетевым сигналам.","Используйте MFA и проверку скомпрометированных паролей для чувствительных аккаунтов.","Добавляйте progressive bot challenge или proof-of-work только при соответствующем риске.","Используйте idempotency, мониторинг злоупотреблений и правила для легитимной автоматизации."],sourceLabel:"OWASP Automated Threats to Web Applications"},
      {tag:"ОПЕРАЦИИ БЕЗОПАСНОСТИ С ПОМОЩЬЮ AI",acronym:"AI DEFENCE",name:"AI-Powered Security Defence",lead:"AI может помогать находить закономерности и приоритизировать сигналы, но не должен заменять инженерию безопасности и человеческое решение.",body:["Системы безопасности создают большой объём логов и alert. Инструменты машинного обучения и языковые модели могут группировать связанные события, резюмировать подозрительные последовательности, находить отклонения от базового поведения и предлагать шаги расследования. Это помогает ускорить triage, если у модели достаточно контекста, а вывод проверяется по исходным свидетельствам.","Результаты AI могут быть неверными, неполными или манипулируемыми данными. Модель может преувеличить слабый сигнал, пропустить новый шаблон или предложить небезопасное действие. Важные решения должны опираться на детерминированные policy checks, проверяемые доказательства и человеческое одобрение."],scenario:"AI-помощник анализирует логи аутентификации и приложения, отмечает необычную последовательность и предлагает расследование. Аналитик проверяет исходные события и подтверждает реальность угрозы.",verify:"Оцените систему на известных тестовых инцидентах и false positive. Измеряйте качество обнаружения, прослеживаемость объяснения, обработку данных, права доступа и возможность оператора отклонить рекомендацию.",controls:["Используйте AI для корреляции и triage, а принудительные действия оставляйте явным policy controls.","Минимизируйте или маскируйте чувствительные данные перед отправкой модели.","Требуйте человеческой проверки для блокировки пользователей, изменения прав и разрушительных действий.","Для аудита сохраняйте доказательства, контекст модели и версии, решения аналитика и результат."],sourceLabel:"NIST AI Risk Management Framework"},
      {tag:"БЕЗОПАСНОСТЬ LLM / AGENT-ПРИЛОЖЕНИЙ",acronym:"AI APPSEC",name:"AI Application Security",lead:"AI-приложения добавляют риски prompt injection, утечки данных, небезопасных вызовов инструментов и недоверенного retrieval-контента.",body:["Prompt injection возникает, когда инструкции в пользовательском вводе или извлечённом контенте пытаются изменить предусмотренное поведение приложения. Риск растёт, если AI имеет доступ к частным документам, инструментам, URL, выполнению кода или действиям от имени пользователя. Внешние страницы и загруженные файлы нужно считать недоверенными данными, а не доверенными policy-инструкциями.","Prompt не является границей контроля доступа. Приложение должно проверять права вне модели, предоставлять только необходимые инструменты и валидировать аргументы перед выполнением. Чувствительные или необратимые действия должны требовать явного подтверждения пользователя; вывод модели нужно считать недоверенным при отображении или передаче другой системе."],scenario:"Ассистент получает документ с враждебными инструкциями и запрос на его краткое изложение. Если приложение считает текст документа доверенной управляющей инструкцией, модель может попытаться раскрыть данные или вызвать неожиданный инструмент.",verify:"Проводите тесты prompt injection и границ данных с недоверенными документами, web-контентом и аргументами инструментов. Убедитесь, что проверки доступа выполняются сервером, secrets отсутствуют в model context, а опасные действия требуют одобрения.",controls:["Отделяйте system policy от retrieval-контента и маркируйте внешний контент как недоверенный.","Обеспечивайте авторизацию в коде приложения; не поручайте модели решать права доступа.","Используйте allowlist инструментов с минимальными правами, проверенные схемы и строгие сетевые ограничения.","Требуйте подтверждение пользователя для важных действий и безопасно проверяйте вывод модели."],sourceLabel:"OWASP GenAI: Prompt Injection"},
      {tag:"КОНВЕЙЕР ТЕСТИРОВАНИЯ БЕЗОПАСНОСТИ",acronym:"AUTOMATION",name:"Automated Security Testing",lead:"Автоматизированное тестирование регулярно проверяет код, зависимости, конфигурацию и работающие приложения на известные классы дефектов.",body:["Проверки безопасности особенно полезны, когда включены в жизненный цикл разработки. SAST анализирует исходный код; SCA выявляет уязвимые зависимости; secret scanning обнаруживает случайно сохранённые credentials; DAST проверяет работающее приложение снаружи; сканеры конфигурации изучают параметры развёртывания.","Ни один scanner не доказывает безопасность приложения. Инструменты могут пропускать ошибки бизнес-логики и выдавать false positive. Результаты нужно анализировать, приоритизировать по exploitability и влиянию, назначать владельца и проверять после исправления. DAST и нагрузочные тесты должны проводиться только на разрешённых целях."],scenario:"Pull request запускает проверки кода, зависимостей и секретов. Pipeline развёртывания выполняет безопасные динамические проверки в staging-среде. Результаты блокируют релиз только по документированной политике severity.",verify:"Убедитесь, что сканирование выполняется для нужных branch и artifact, проверьте примеры находок и подтвердите, что исправление закрывает исходную проблему.",controls:["Интегрируйте SAST, SCA, secret scanning и проверки конфигурации в CI/CD.","Запускайте DAST только на разрешённой staging-среде с тестовыми аккаунтами и rate limits.","Приоритизируйте находки по severity, exploitability и бизнес-влиянию; назначайте ответственных.","Повторно проверяйте исправления и поддерживайте обновления зависимостей и правила сканирования."],sourceLabel:"OWASP Web Security Testing Guide"},
      {tag:"АВТОРИЗОВАННАЯ ОЦЕНКА БЕЗОПАСНОСТИ",acronym:"PENTEST",name:"Penetration Testing",lead:"Penetration test — это согласованная проверка в определённой среде, подтверждающая практическую возможность эксплуатации слабостей.",body:["Профессиональная проверка начинается с письменного разрешения, scope, правил проведения, окон тестирования, контактов и ограничений безопасности. Тестировщик картирует attack surface, изучает вероятные слабости, подтверждает отдельные находки и документирует доказательства и бизнес-влияние. Цель — не нанести ущерб и не получить больше данных, чем необходимо для доказательства.","Полезный отчёт описывает затронутый актив, условия, воспроизводимые доказательства, влияние, обоснование severity и практическое исправление. После фиксов retest подтверждает, закрыта ли уязвимость и не появились ли регрессии. Сканирование само по себе не является penetration test; результат относится только к проверенному scope и периоду."],scenario:"Клиент разрешает тестирование staging веб-приложения. Тестировщик действует в согласованном scope, проверяет проблему контроля доступа тестовыми аккаунтами и документирует доказательства без доступа к посторонним данным.",verify:"До теста проверьте письменное разрешение, scope и исключения. Во время оценки безопасно храните логи и доказательства; после неё назначьте владельца, исправление и результат retest для каждой находки.",controls:["Получите письменное разрешение и определите scope, исключения, сроки и контакты эскалации.","Используйте признанную методологию и безопасные тестовые аккаунты; избегайте разрушительных и выходящих за scope действий.","В отчёте ясно представьте доказательства, влияние, severity, ограничения и исправление.","Повторно проверьте исправления и точно укажите объём теста; не заявляйте сертификацию без доказательств."],sourceLabel:"NIST SP 800-115: Technical Guide to Information Security Testing"}
    ]
  };

  const $ = (selector, parent = root) => parent.querySelector(selector);
  const $$ = (selector, parent = root) => Array.from(parent.querySelectorAll(selector));
  const languageCodes = ["en", "hy", "ru"];
  const getLanguage = () => {
    const activeButton = document.querySelector(".lang-btn.active");
    const candidate = (activeButton?.dataset.lang || document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    return languageCodes.includes(candidate) ? candidate : "en";
  };
  let language = getLanguage();
  let activeChapter = 0;
  let securityFrame = 0;
  let securityChapters = [];
  const securityPointer = { x: 0, y: 0, inside: false };
  let securityScrollVelocity = 0;
  let securityScrollTimestamp = 0;
  let previousSecurityScrollY = window.scrollY;
  let securityVisualProgress = null;
  let securityLastFrameTime = 0;
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const touchLayoutQuery = window.matchMedia("(max-width: 900px)");

  function setTranslatedText(element, value) {
    if (!element || typeof value !== "string") return;
    // Only trusted homepage UI strings contain intentional <br> or <em> markup.
    if (/<(?:br|em)>/i.test(value)) element.innerHTML = value;
    else element.textContent = value;
  }

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
  }

  function makeBookPage(slide, index, dict) {
    const number = String(index + 1).padStart(2, "0");
    const sourceUrl = SOURCES[["xss","csrf","ssrf","sqli","dos","ddos","bots","aidefense","aisecurity","testing","pentest"][index]];
    const chapter = makeElement("article", "km-security-chapter");
    chapter.dataset.securityChapter = String(index);
    chapter.id = `km-security-chapter-${number}`;
    chapter.setAttribute("aria-labelledby", `km-security-title-${number}`);

    const chapterMeta = makeElement("div", "km-security-chapter-meta");
    const chapterCode = makeElement("span", "km-security-chapter-code", `KNOWME / SECURITY ARCHIVE · ${number} / 11`);
    const chapterTag = makeElement("span", "km-security-chapter-tag", slide.tag);
    chapterMeta.append(chapterCode, chapterTag);

    const spread = makeElement("div", "km-book-spread");
    spread.setAttribute("role", "group");
    spread.setAttribute("aria-label", `${number} / 11 — ${slide.name}`);

    // LEFT PAGE — chapter identity, title and concise explanation.
    const leftPage = makeElement("section", "km-book-page km-book-page--left");
    const leftHeader = makeElement("div", "km-book-page-head");
    leftHeader.append(
      makeElement("span", "", "KNOWME · SECURITY FIELD MANUAL"),
      makeElement("span", "km-book-folio", `${number} / 11`)
    );
    const leftContent = makeElement("div", "km-book-left-content");
    leftContent.append(
      makeElement("span", "km-book-chapter-word", `${dict["security.chapter"] || "CHAPTER"} ${number}`),
      makeElement("span", "km-security-acronym", slide.acronym)
    );
    const title = makeElement("h3", "km-book-topic-title", slide.name);
    title.id = `km-security-title-${number}`;
    leftContent.append(title, makeElement("p", "km-security-lead", slide.lead));
    const leftBottom = makeElement("div", "km-book-left-bottom");
    leftBottom.append(
      makeElement("span", "", "WEB · APPLICATION · AI SECURITY"),
      makeElement("strong", "", slide.acronym)
    );
    leftPage.append(leftHeader, leftContent, leftBottom);

    // RIGHT PAGE — full technical explanation and defensive controls.
    const rightPage = makeElement("section", "km-book-page km-book-page--right");
    const rightHeader = makeElement("div", "km-book-page-head");
    rightHeader.append(
      makeElement("span", "", "KNOWME / TECHNICAL NOTES"),
      makeElement("span", "km-book-folio", `${dict["security.page"] || "PAGE"} ${number}`)
    );

    const body = makeElement("div", "km-security-body");
    slide.body.forEach((paragraphText) => body.append(makeElement("p", "", paragraphText)));

    const details = makeElement("div", "km-security-columns");
    const risk = makeElement("section", "km-security-detail-block");
    risk.append(makeElement("span", "km-detail-label", dict["security.how"] || "HOW THE RISK APPEARS"));
    risk.append(makeElement("p", "", slide.scenario));
    const verify = makeElement("section", "km-security-detail-block");
    verify.append(makeElement("span", "km-detail-label", dict["security.verify"] || "HOW TO VERIFY"));
    verify.append(makeElement("p", "", slide.verify));
    details.append(risk, verify);

    const defence = makeElement("div", "km-defence-block");
    const defenceHeading = makeElement("div", "km-defence-heading");
    defenceHeading.append(
      makeElement("span", "km-detail-label", dict["security.controls"] || "DEFENCE CONTROLS"),
      makeElement("span", "km-defence-count", `${String(slide.controls.length).padStart(2, "0")} ${language === "hy" ? "ՄԻՋՈՑ" : language === "ru" ? "МЕРЫ" : "CONTROLS"}`)
    );
    const list = makeElement("ul", "km-book-controls");
    slide.controls.forEach((control) => list.append(makeElement("li", "", control)));
    defence.append(defenceHeading, list);

    const footer = makeElement("div", "km-book-page-footer");
    const reference = makeElement("div", "km-security-reference");
    reference.append(makeElement("span", "", dict["security.reference"] || "REFERENCE"));
    const source = makeElement("a", "", `${slide.sourceLabel} ↗`);
    source.href = sourceUrl;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    reference.append(source);
    const pageCount = makeElement("span", "km-book-page-count", `${number} / 11`);
    footer.append(reference, pageCount);

    // Keep the technical text in its own vertical reader. The page header and
    // reference footer stay fixed while the body, examples and controls scroll.
    const readerScroll = makeElement("div", "km-book-detail-scroll");
    readerScroll.tabIndex = 0;
    readerScroll.setAttribute("role", "region");
    readerScroll.setAttribute(
      "aria-label",
      language === "hy" ? `${slide.name} թեմայի ամբողջական բացատրությունը` :
        language === "ru" ? `Полное объяснение темы ${slide.name}` :
          `Full explanation of ${slide.name}`
    );

    const readCue = makeElement("div", "km-book-read-cue");
    const readCueText = language === "hy" ? "ՈԼՈՐԵՔ՝ ԱՄԲՈՂՋ ԲԱՑԱՏՐՈՒԹՅՈՒՆԸ ԿԱՐԴԱԼՈՒ ՀԱՄԱՐ" :
      language === "ru" ? "ПРОКРУТИТЕ, ЧТОБЫ ПРОЧИТАТЬ ПОЛНОЕ ОБЪЯСНЕНИЕ" :
        "SCROLL TO READ THE FULL EXPLANATION";
    readCue.append(makeElement("span", "", readCueText));
    const readMore = makeElement("button", "km-book-read-more", "↓");
    readMore.type = "button";
    readMore.setAttribute("aria-label", language === "hy" ? "Կարդալ հաջորդ հատվածը" : language === "ru" ? "Прокрутить дальше" : "Read next section");
    readMore.title = readMore.getAttribute("aria-label");
    readCue.append(readMore);

    const updateReadControl = () => {
      const canScroll = readerScroll.scrollHeight > readerScroll.clientHeight + 3;
      const atEnd = readerScroll.scrollTop + readerScroll.clientHeight >= readerScroll.scrollHeight - 6;
      readMore.disabled = !canScroll;
      readMore.textContent = atEnd ? "↑" : "↓";
      const label = atEnd
        ? (language === "hy" ? "Վերադառնալ սկզբին" : language === "ru" ? "Вернуться к началу" : "Back to top")
        : (language === "hy" ? "Կարդալ հաջորդ հատվածը" : language === "ru" ? "Прокрутить дальше" : "Read next section");
      readMore.setAttribute("aria-label", label);
      readMore.title = label;
    };

    readMore.addEventListener("click", () => {
      const atEnd = readerScroll.scrollTop + readerScroll.clientHeight >= readerScroll.scrollHeight - 8;
      const destination = atEnd ? 0 : Math.min(readerScroll.scrollHeight, readerScroll.scrollTop + readerScroll.clientHeight * 0.78);
      readerScroll.scrollTo({ top: destination, behavior: reduceMotion ? "auto" : "smooth" });
    });
    readerScroll.addEventListener("scroll", updateReadControl, { passive: true });
    if (typeof ResizeObserver !== "undefined") {
      const readerResizeObserver = new ResizeObserver(updateReadControl);
      readerResizeObserver.observe(readerScroll);
    }

    readerScroll.append(readCue, body, details, defence);
    rightPage.append(rightHeader, readerScroll, footer);
    requestAnimationFrame(updateReadControl);

    const spine = makeElement("div", "km-book-spine");
    spine.setAttribute("aria-hidden", "true");
    spread.append(leftPage, spine, rightPage);

    chapter.append(chapterMeta, spread);
    return chapter;
  }

  function updateSecurityProgress(position) {
    const total = Math.max(1, securityChapters.length - 1);
    const safePosition = Math.max(0, Math.min(total, position));
    activeChapter = Math.max(0, Math.min(total, Math.round(safePosition)));
    const current = $("#kmSecurityCurrent");
    const progress = $("#kmSecurityProgress");
    const previous = $("#kmSecurityPrev");
    const next = $("#kmSecurityNext");
    if (current) current.textContent = `${String(activeChapter + 1).padStart(2, "0")} / ${String(total + 1).padStart(2, "0")}`;
    if (progress) progress.style.width = `${(safePosition / total) * 100}%`;
    if (previous) previous.disabled = safePosition <= 0.015;
    if (next) next.disabled = safePosition >= total - 0.015;
  }

  function updateSecurityBook() {
    securityFrame = 0;
    const section = $("#kmSecurityScrollSpace");
    const sticky = $("#kmSecuritySticky");
    const viewport = $("#kmSecurityViewport");
    const track = $("#kmSecurityChapters");
    if (!section || !sticky || !viewport || !track || !securityChapters.length) return;

    // Desktop uses ONE native document scroll to move the complete book ribbon.
    // No individual page captures the wheel; the mobile layout keeps its touch swipe fallback.
    if (touchLayoutQuery.matches) {
      updateSecurityProgress(0);
      return;
    }

    const now = performance.now();
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = Math.max(1, section.offsetHeight - sticky.offsetHeight);
    const targetProgress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / scrollDistance));

    // A damped follow keeps the book moving with the wheel, but removes the
    // abrupt, step-like feeling of a raw scroll-to-transform mapping.
    if (securityVisualProgress === null) securityVisualProgress = targetProgress;
    const frameDelta = securityLastFrameTime ? Math.max(8, Math.min(34, now - securityLastFrameTime)) : 16;
    securityLastFrameTime = now;
    const follow = reduceMotion ? 1 : 1 - Math.exp(-frameDelta / 92);
    securityVisualProgress += (targetProgress - securityVisualProgress) * follow;
    if (Math.abs(targetProgress - securityVisualProgress) < 0.00018) {
      securityVisualProgress = targetProgress;
    }
    const progress = securityVisualProgress;

    const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const offset = maxOffset * progress;
    track.style.transform = `translate3d(${-offset.toFixed(2)}px, 0, 0)`;

    const lastIndex = securityChapters.length - 1;
    const pagePosition = progress * lastIndex;
    const pageIndex = Math.min(lastIndex, Math.floor(pagePosition));
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const viewportRect = viewport.getBoundingClientRect();
    const viewportWidth = Math.max(1, viewport.clientWidth);
    const viewportHeight = Math.max(1, viewport.clientHeight);
    const chapterWidth = securityChapters[0]?.offsetWidth || viewportWidth * .82;
    const trackStyle = getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || "0") || 0;
    const step = chapterWidth + gap;
    const scrollAge = now - securityScrollTimestamp;
    const scrollBend = securityScrollTimestamp ? securityScrollVelocity * Math.exp(-scrollAge / 250) : 0;

    // Each spread sits on a continuous S-shaped ribbon. Neighboring spreads
    // bank away from the viewer; the active spread faces the reading position.
    securityChapters.forEach((chapter, index) => {
      const relative = index - pagePosition;
      const distance = Math.min(2.5, Math.abs(relative));
      const centerX = viewportRect.left + viewportWidth / 2 + relative * step;
      const centerY = viewportRect.top + viewportHeight * .52;
      let pointerInfluence = 0;
      let pointerTiltY = 0;
      let pointerTiltX = 0;
      let pointerLift = 0;

      if (securityPointer.inside) {
        const dx = (securityPointer.x - centerX) / Math.max(1, chapterWidth * .72);
        const dy = (securityPointer.y - centerY) / Math.max(1, viewportHeight * .78);
        pointerInfluence = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy));
        pointerTiltY = clamp(-dx * 11 * pointerInfluence, -11, 11);
        pointerTiltX = clamp(dy * 7 * pointerInfluence, -7, 7);
        pointerLift = pointerInfluence * 27;
      }

      const side = Math.sign(relative);
      // The chapters follow a broad spatial arc instead of a flat carousel.
      // Near the reading point a spread faces the visitor; the next spreads
      // bend away, recede in Z and return smoothly along the same landscape.
      const angle = clamp(relative * 0.24, -1.28, 1.28);
      const curvature = Math.sin(angle);
      const ribbonY = curvature * 108 + Math.sin(angle * 2.1) * 15 + side * scrollBend * 38;
      const ribbonZ = -(1 - Math.cos(angle)) * 255 - Math.pow(distance, 1.5) * 24 + pointerLift;
      const rotateY = clamp(-angle * 37 + pointerTiltY - side * scrollBend * 11, -50, 50);
      const rotateX = clamp(curvature * 7 + pointerTiltX + scrollBend * relative * 3.1, -13, 13);
      const rotateZ = clamp(Math.sin(angle * 0.85) * 5 + scrollBend * side * 3.2, -9, 9);
      const scale = 1 - Math.min(0.14, distance * 0.055);

      chapter.style.transform = `translate3d(0, ${ribbonY.toFixed(2)}px, ${ribbonZ.toFixed(2)}px) rotateY(${rotateY.toFixed(2)}deg) rotateX(${rotateX.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      chapter.style.setProperty("--km-ribbon-distance", distance.toFixed(3));
      chapter.style.setProperty("--km-ribbon-angle", `${angle.toFixed(3)}rad`);
      chapter.classList.toggle("is-active", index === pageIndex);
      chapter.classList.toggle("is-next", index === pageIndex + 1);

    });

    updateSecurityProgress(pagePosition);

    // Keep easing until the visual ribbon catches the native scroll position.
    // The result is a smooth, deliberate chapter hand-off instead of a hard snap.
    if (Math.abs(targetProgress - securityVisualProgress) > 0.00018 ||
        (scrollAge < 900 && Math.abs(scrollBend) > .004)) {
      scheduleSecurityBook();
    }
  }

  function scheduleSecurityBook() {
    if (!securityFrame) securityFrame = requestAnimationFrame(updateSecurityBook);
  }


  // A lightweight WebGL terrain under the book. The HTML pages remain real,
  // selectable DOM content; only the atmospheric landscape is rendered here.
  function initSecurityLandscape() {
    const canvas = $("#kmSecurityLandscape");
    const sticky = $("#kmSecuritySticky");
    const section = $(".km-security-book-section");
    if (!canvas || !sticky || !section || reduceMotion) {
      section?.classList.add("is-landscape-fallback");
      return null;
    }

    let gl;
    try {
      gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
        premultipliedAlpha: false
      });
    } catch (error) {
      gl = null;
    }
    if (!gl) {
      section.classList.add("is-landscape-fallback");
      return null;
    }

    const vertexSource = `
      attribute vec2 aPosition;
      uniform float uTime;
      uniform float uAspect;
      uniform float uScrollBend;
      uniform float uPointerActive;
      uniform vec2 uPointer;
      uniform vec4 uDents[8];
      varying vec2 vUv;
      varying float vHeight;
      varying float vPit;
      varying vec3 vNormal;

      float terrainHeight(vec2 uv) {
        float floorMask = 1.0 - smoothstep(0.22, 0.88, uv.y);
        float waveA = sin(uv.x * 8.0 + uv.y * 3.4 + uTime * 0.13 + uScrollBend * 0.7);
        float waveB = cos(uv.x * 4.4 - uv.y * 7.1 - uTime * 0.09);
        float height = (waveA * 0.012 + waveB * 0.008) * floorMask;
        height += sin(uv.x * 3.2 + uScrollBend * 1.8) * floorMask * 0.012;

        for (int i = 0; i < 8; i++) {
          vec2 delta = (uv - uDents[i].xy) * vec2(uAspect, 1.0);
          float distanceToDent = length(delta);
          float age = clamp(uDents[i].z, 0.0, 1.0);
          float fade = (1.0 - age) * (1.0 - age);
          float strength = uDents[i].w * fade;
          float bowl = exp(-distanceToDent * distanceToDent * 155.0) * strength;
          float ripple = sin(distanceToDent * 48.0 - uTime * 3.0) * exp(-distanceToDent * 10.0) * strength;
          height -= bowl * 0.23;
          height += ripple * 0.012;
        }

        vec2 pointerDelta = (uv - uPointer) * vec2(uAspect, 1.0);
        float pointerDistance = length(pointerDelta);
        float pointerBowl = exp(-pointerDistance * pointerDistance * 175.0) * uPointerActive;
        float pointerRing = sin(pointerDistance * 44.0 - uTime * 3.8) * exp(-pointerDistance * 10.5) * uPointerActive;
        height -= pointerBowl * 0.19;
        height += pointerRing * 0.015;
        return height * floorMask;
      }

      void main() {
        vec2 uv = (aPosition + 1.0) * 0.5;
        vUv = uv;
        float h = terrainHeight(uv);
        float dx = 1.0 / 72.0;
        float dy = 1.0 / 38.0;
        float hL = terrainHeight(uv - vec2(dx, 0.0));
        float hR = terrainHeight(uv + vec2(dx, 0.0));
        float hD = terrainHeight(uv - vec2(0.0, dy));
        float hU = terrainHeight(uv + vec2(0.0, dy));
        vNormal = normalize(vec3(-(hR - hL) * 10.0, -(hU - hD) * 10.0, 0.85));
        vHeight = h;
        vPit = clamp(-h * 4.6, 0.0, 1.0);
        vec2 position = aPosition;
        position.y += h * 0.58;
        position.x += (uv.x - 0.5) * abs(h) * 0.035;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform float uTime;
      uniform float uAspect;
      uniform float uPointerActive;
      uniform vec2 uPointer;
      varying vec2 vUv;
      varying float vHeight;
      varying float vPit;
      varying vec3 vNormal;

      void main() {
        float floorMask = 1.0 - smoothstep(0.18, 0.86, vUv.y);
        float perspective = mix(22.0, 72.0, pow(1.0 - vUv.y, 1.35));
        float gx = abs(fract((vUv.x - 0.5) * perspective + 0.5) - 0.5);
        float gyCoord = pow(max(0.001, 1.0 - vUv.y), 1.62) * 23.0;
        float gy = abs(fract(gyCoord) - 0.5);
        float verticalLine = 1.0 - smoothstep(0.478, 0.495, gx);
        float horizontalLine = 1.0 - smoothstep(0.478, 0.495, gy);
        float grid = max(verticalLine * 0.62, horizontalLine);

        vec3 normal = normalize(vNormal);
        vec3 lightDirection = normalize(vec3(-0.36, 0.5, 0.84));
        float diffuse = max(dot(normal, lightDirection), 0.0);
        float shade = 0.35 + diffuse * 0.65;
        vec3 red = vec3(1.00, 0.19, 0.38);
        vec3 blue = vec3(0.20, 0.64, 1.00);
        vec3 accent = mix(red, blue, smoothstep(0.12, 0.9, vUv.x));
        float horizonFade = smoothstep(0.02, 0.27, floorMask);

        vec3 color = vec3(0.018, 0.035, 0.075);
        color += accent * grid * (0.19 + vPit * 0.34) * shade;
        color += accent * vPit * 0.26;
        color += vec3(0.06, 0.10, 0.19) * diffuse * floorMask;

        vec2 cursorDelta = (vUv - uPointer) * vec2(uAspect, 1.0);
        float cursorDistance = length(cursorDelta);
        float cursorRim = exp(-pow((cursorDistance - 0.075) * 34.0, 2.0)) * uPointerActive;
        color += mix(red, blue, smoothstep(0.0, 0.12, vUv.x)) * cursorRim * 0.38;

        float alpha = floorMask * (0.035 + grid * 0.18 + vPit * 0.28 + cursorRim * 0.15);
        alpha *= horizonFade;
        gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.46));
      }
    `;

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader) || "Unknown shader compile error";
        gl.deleteShader(shader);
        throw new Error(message);
      }
      return shader;
    }

    let program;
    try {
      const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
      program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Unknown shader link error");
      }
    } catch (error) {
      console.warn("[KNOWME Security] Spatial landscape shader unavailable:", error);
      section.classList.add("is-landscape-fallback");
      return null;
    }

    const columns = 72;
    const rows = 38;
    const vertices = [];
    const indices = [];
    for (let y = 0; y <= rows; y += 1) {
      for (let x = 0; x <= columns; x += 1) {
        vertices.push((x / columns) * 2 - 1, (y / rows) * 2 - 1);
      }
    }
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const a = y * (columns + 1) + x;
        const b = a + 1;
        const c = a + columns + 1;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      time: gl.getUniformLocation(program, "uTime"),
      aspect: gl.getUniformLocation(program, "uAspect"),
      scroll: gl.getUniformLocation(program, "uScrollBend"),
      pointerActive: gl.getUniformLocation(program, "uPointerActive"),
      pointer: gl.getUniformLocation(program, "uPointer"),
      dents: gl.getUniformLocation(program, "uDents[0]")
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    let width = 1;
    let height = 1;
    let aspect = 1;
    let visible = false;
    let pageVisible = !document.hidden;
    let frameId = 0;
    let lastDraw = 0;
    let pointer = { x: 0.5, y: 0.45, inside: false };
    let scrollBend = 0;
    let lastPointerPoint = null;
    let lastPointerTime = 0;
    const dents = [];
    const maxDents = 8;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.35);

    function resize() {
      const rect = sticky.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      aspect = width / height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      requestDraw();
    }

    function addDent(x, y, strength = 0.8) {
      const now = performance.now();
      if (lastPointerPoint) {
        const dx = (x - lastPointerPoint.x) * aspect;
        const dy = y - lastPointerPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 0.018) return;
        const elapsed = Math.max(12, now - lastPointerTime);
        strength = Math.min(1, Math.max(.42, distance * 18 / (elapsed / 45)));
      }
      dents.push({ x, y, born: now, strength });
      while (dents.length > maxDents) dents.shift();
      lastPointerPoint = { x, y };
      lastPointerTime = now;
    }

    function setPointer(event, inside = true) {
      const rect = canvas.getBoundingClientRect();
      pointer = {
        x: Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width))),
        y: 1 - Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height))),
        inside
      };
      if (inside) addDent(pointer.x, pointer.y, .88);
      requestDraw();
    }

    function draw(now) {
      frameId = 0;
      if (!visible || !pageVisible) return;
      if (now - lastDraw < 30) {
        requestDraw();
        return;
      }
      lastDraw = now;
      const time = now * .001;
      const dentData = new Float32Array(maxDents * 4);
      let activeDentCount = 0;
      for (let i = 0; i < dents.length; i += 1) {
        const dent = dents[i];
        const age = (now - dent.born) / 1050;
        if (age >= 1) continue;
        const offset = activeDentCount * 4;
        dentData[offset] = dent.x;
        dentData[offset + 1] = dent.y;
        dentData[offset + 2] = age;
        dentData[offset + 3] = dent.strength;
        activeDentCount += 1;
      }

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.aspect, aspect);
      gl.uniform1f(uniforms.scroll, scrollBend);
      gl.uniform1f(uniforms.pointerActive, pointer.inside ? 1 : 0);
      gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
      gl.uniform4fv(uniforms.dents, dentData);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      const hasFadingDents = dents.some((dent) => now - dent.born < 1050);
      if (hasFadingDents || pointer.inside || Math.abs(scrollBend) > .01) {
        scrollBend *= .91;
        requestDraw();
      }
    }

    function requestDraw() {
      if (!frameId && visible && pageVisible) frameId = requestAnimationFrame(draw);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(sticky);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestDraw();
      else if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    }, { threshold: 0.01 });
    intersectionObserver.observe(sticky);

    sticky.addEventListener("pointermove", (event) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen" || event.pointerType === "touch") {
        setPointer(event, true);
      }
    }, { passive: true });
    sticky.addEventListener("pointerleave", () => {
      pointer.inside = false;
      lastPointerPoint = null;
      requestDraw();
    }, { passive: true });
    sticky.addEventListener("pointerdown", (event) => {
      setPointer(event, true);
      addDent(pointer.x, pointer.y, 1);
    }, { passive: true });
    document.addEventListener("visibilitychange", () => {
      pageVisible = !document.hidden;
      if (pageVisible) requestDraw();
      else if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    });

    resize();
    requestDraw();
    return {
      setScrollBend(value) {
        scrollBend = Math.max(-1, Math.min(1, value));
        requestDraw();
      }
    };
  }

  function goToSecurityChapter(index) {
    const section = $("#kmSecurityScrollSpace");
    const sticky = $("#kmSecuritySticky");
    if (!section || !sticky) return;
    const maxIndex = Math.max(0, securityChapters.length - 1);
    const targetIndex = Math.max(0, Math.min(maxIndex, index));
    if (touchLayoutQuery.matches) {
      const viewport = $("#kmSecurityViewport");
      const slide = securityChapters[targetIndex];
      if (viewport && slide) viewport.scrollTo({ left: slide.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = Math.max(1, section.offsetHeight - sticky.offsetHeight);
    const target = sectionTop + scrollDistance * (targetIndex / Math.max(1, maxIndex));
    window.scrollTo({ top: target, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function renderSecurityBook() {
    const container = $("#kmSecurityChapters");
    if (!container) return;
    const slides = SLIDES[language] || SLIDES.en;
    const dict = UI[language] || UI.en;
    const fragment = document.createDocumentFragment();
    securityChapters = [];
    slides.forEach((slide, index) => {
      const chapter = makeBookPage(slide, index, dict);
      securityChapters.push(chapter);
      fragment.append(chapter);
    });
    container.replaceChildren(fragment);
    requestAnimationFrame(() => {
      scheduleSecurityBook();
    });
  }

  function translateUi() {
    const dict = UI[language] || UI.en;
    $$('[data-home-i18n]').forEach((element) => {
      const value = dict[element.dataset.homeI18n] ?? UI.en[element.dataset.homeI18n];
      setTranslatedText(element, value);
    });
  }

  function changeLanguage() {
    const nextLanguage = getLanguage();
    if (nextLanguage === language) return;
    language = nextLanguage;
    translateUi();
    renderSecurityBook();
  }

  renderSecurityBook();
  translateUi();
  const languageObserver = new MutationObserver(changeLanguage);
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.addEventListener("click", () => requestAnimationFrame(changeLanguage));
  });

  // Scroll-driven security book: the former Selected Work area is now the book's pinned stage.
  const securitySection = $("#kmSecurityScrollSpace");
  const securityViewport = $("#kmSecurityViewport");
  const securitySticky = $("#kmSecuritySticky");
  const securityLandscape = initSecurityLandscape();
  if (securitySection && securityViewport) {
    root.classList.add("km-global-book-scroll");
    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      const now = performance.now();
      const elapsed = Math.max(12, now - (securityScrollTimestamp || now - 16));
      const delta = currentScrollY - previousSecurityScrollY;
      securityScrollVelocity = Math.max(-1, Math.min(1, (delta / elapsed) * 0.022));
      previousSecurityScrollY = currentScrollY;
      securityScrollTimestamp = now;
      securityLandscape?.setScrollBend(securityScrollVelocity);
      scheduleSecurityBook();
    }, { passive: true });
    window.addEventListener("resize", scheduleSecurityBook, { passive: true });
    window.addEventListener("orientationchange", scheduleSecurityBook, { passive: true });
    securitySticky?.addEventListener("pointermove", (event) => {
      securityPointer.x = event.clientX;
      securityPointer.y = event.clientY;
      securityPointer.inside = true;
      scheduleSecurityBook();
    }, { passive: true });
    securitySticky?.addEventListener("pointerleave", () => {
      securityPointer.inside = false;
      scheduleSecurityBook();
    }, { passive: true });
    $("#kmSecurityPrev")?.addEventListener("click", () => goToSecurityChapter(activeChapter - 1));
    $("#kmSecurityNext")?.addEventListener("click", () => goToSecurityChapter(activeChapter + 1));
    securityViewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToSecurityChapter(activeChapter + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToSecurityChapter(activeChapter - 1);
      }
    });
    // A native horizontal swipe remains available on touch-sized layouts.
    securityViewport.addEventListener("scroll", () => {
      if (!touchLayoutQuery.matches) return;
      const slideWidth = securityChapters[0]?.getBoundingClientRect().width || securityViewport.clientWidth;
      const position = slideWidth > 0 ? securityViewport.scrollLeft / slideWidth : 0;
      updateSecurityProgress(position);
    }, { passive: true });
  }


  // Reversible capabilities ribbon: ordinary document scrolling drives the horizontal track.
  // No wheel handler or preventDefault is used, so scrolling down AND back up remains native.
  function initServicesRibbon() {
    const section = $("#kmServicesScrollSpace");
    const sticky = $("#kmServicesSticky");
    const viewport = $("#kmServicesViewport");
    const track = $("#kmServiceTrack");
    if (!section || !sticky || !viewport || !track) return;

    const cards = Array.from(track.querySelectorAll("[data-service-card]"));
    const currentLabel = $("#kmServicesCurrent");
    const progressBar = $("#kmServicesProgress");
    const previousButton = $("#kmServicesPrev");
    const nextButton = $("#kmServicesNext");
    const mobileQuery = touchLayoutQuery;
    let metrics = { start: 0, range: 1, maxOffset: 0, stickyTop: 0 };
    let frame = 0;
    let measureFrame = 0;
    let activeIndex = 0;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    function readMetrics() {
      if (mobileQuery.matches) {
        section.style.height = "auto";
        section.style.minHeight = "0";
        metrics = { start: 0, range: 1, maxOffset: 0, stickyTop: 0 };
        track.style.transform = "none";
        return;
      }

      const stickyStyle = getComputedStyle(sticky);
      const stickyTop = Math.max(0, parseFloat(stickyStyle.top) || 0);
      const stickyHeight = Math.ceil(sticky.getBoundingClientRect().height || sticky.offsetHeight);
      const trackStyle = getComputedStyle(track);
      const cardGap = parseFloat(trackStyle.columnGap || trackStyle.gap || "0") || 0;
      const paddingStart = parseFloat(trackStyle.paddingLeft || "0") || 0;
      const paddingEnd = parseFloat(trackStyle.paddingRight || "0") || 0;
      const naturalTrackWidth = cards.reduce((sum, card) => sum + card.offsetWidth, 0)
        + cardGap * Math.max(0, cards.length - 1) + paddingStart + paddingEnd;
      const maxOffset = Math.max(0, naturalTrackWidth - viewport.clientWidth);
      // The sticky stage needs exactly the same document-scroll distance as its horizontal travel.
      // This symmetry is what makes upward scrolling reliably reverse the ribbon.
      const scrollRange = Math.max(1, maxOffset);
      section.style.height = `${Math.ceil(stickyHeight + scrollRange)}px`;
      section.style.minHeight = "0";
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      metrics = {
        start: sectionTop - stickyTop,
        range: scrollRange,
        maxOffset,
        stickyTop
      };
    }

    function updateProgressLabel(position) {
      const total = Math.max(1, cards.length - 1);
      activeIndex = clamp(Math.round(position), 0, total);
      if (currentLabel) currentLabel.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
      if (progressBar) progressBar.style.width = `${(clamp(position / total, 0, 1) * 100).toFixed(2)}%`;
      if (previousButton) previousButton.disabled = position <= 0.015;
      if (nextButton) nextButton.disabled = position >= total - 0.015;
    }

    function update() {
      frame = 0;
      if (mobileQuery.matches) {
        const maxLeft = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
        const progress = clamp(viewport.scrollLeft / maxLeft, 0, 1);
        updateProgressLabel(progress * Math.max(1, cards.length - 1));
        return;
      }

      const rawProgress = clamp((window.scrollY - metrics.start) / metrics.range, 0, 1);
      const offset = metrics.maxOffset * rawProgress;
      track.style.transform = `translate3d(${-offset.toFixed(2)}px, 0, 0)`;

      const cardPosition = rawProgress * Math.max(1, cards.length - 1);
      cards.forEach((card, index) => {
        const relative = index - cardPosition;
        const distance = Math.abs(relative);
        const angle = clamp(relative * 7.5, -17, 17);
        const lift = Math.max(0, 1 - distance) * 5;
        card.style.transform = `translate3d(0, ${lift.toFixed(2)}px, ${(-Math.min(distance, 2) * 18).toFixed(2)}px) rotateY(${angle.toFixed(2)}deg) scale(${(1 - Math.min(distance, 2) * .018).toFixed(4)})`;
        card.classList.toggle("is-active", distance < .5);
        card.classList.toggle("is-near", distance >= .5 && distance < 1.65);
      });
      updateProgressLabel(cardPosition);
    }

    function requestUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function measureAndUpdate() {
      measureFrame = 0;
      readMetrics();
      requestUpdate();
    }

    function requestMeasure() {
      if (!measureFrame) measureFrame = requestAnimationFrame(measureAndUpdate);
    }

    function goToCard(index) {
      if (!cards.length) return;
      const targetIndex = clamp(index, 0, cards.length - 1);
      if (mobileQuery.matches) {
        viewport.scrollTo({ left: cards[targetIndex].offsetLeft - viewport.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
        return;
      }
      readMetrics();
      const targetY = metrics.start + metrics.range * (targetIndex / Math.max(1, cards.length - 1));
      window.scrollTo({ top: Math.max(0, targetY), behavior: reduceMotion ? "auto" : "smooth" });
    }

    previousButton?.addEventListener("click", () => goToCard(activeIndex - 1));
    nextButton?.addEventListener("click", () => goToCard(activeIndex + 1));
    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToCard(activeIndex + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToCard(activeIndex - 1);
      }
    });
    viewport.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestMeasure, { passive: true });
    window.addEventListener("orientationchange", requestMeasure, { passive: true });
    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(requestMeasure);
      resizeObserver.observe(sticky);
      resizeObserver.observe(viewport);
      resizeObserver.observe(track);
    }
    if (document.fonts?.ready) document.fonts.ready.then(requestMeasure).catch(() => {});
    mobileQuery.addEventListener?.("change", requestMeasure);
    requestAnimationFrame(measureAndUpdate);
  }

  initServicesRibbon();

  // Reveal on scroll and subtle pointer lighting. No external animation library required.
  const revealItems = $$('[data-reveal]');
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -45px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const hero = $(".km-hero");
  if (hero && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    let pointerFrame = 0;
    hero.addEventListener("pointermove", (event) => {
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const bounds = hero.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / Math.max(1, bounds.width);
        const y = (event.clientY - bounds.top) / Math.max(1, bounds.height);
        hero.style.setProperty("--km-pointer-x", `${(x * 100).toFixed(1)}%`);
        hero.style.setProperty("--km-pointer-y", `${(y * 100).toFixed(1)}%`);
      });
    }, { passive: true });
  }
})();
