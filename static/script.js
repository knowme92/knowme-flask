/* =========================================================
   CLOUDFLARE TURNSTILE — EXPLICIT WIDGET LIFECYCLE
   The API script calls knowmeTurnstileOnload after it loads.
   Start Project is rendered lazily when its final step is visible.
========================================================= */
(function initKnowmeTurnstileBridge() {
    "use strict";

    window.renderKnowmeTurnstile = function (container) {
        if (!container || container.dataset.turnstileWidgetId) return;

        if (!window.turnstile || typeof window.turnstile.render !== "function") {
            container.dataset.turnstilePending = "true";
            return;
        }

        const sitekey = container.dataset.turnstileSitekey;
        const action = container.dataset.turnstileAction;
        if (!sitekey || !action || !container.id) return;

        try {
            const widgetId = window.turnstile.render(`#${container.id}`, {
                sitekey,
                action,
                theme: container.dataset.turnstileTheme || "auto",
                size: container.dataset.turnstileSize || "normal",
                "refresh-expired": "auto"
            });

            container.dataset.turnstileWidgetId = widgetId;
            delete container.dataset.turnstilePending;
        } catch (error) {
            console.error("[KNOWME] Turnstile widget could not be rendered.", error);
        }
    };

    window.getKnowmeTurnstileToken = function (container) {
        if (!container) return "";
        const widgetId = container.dataset.turnstileWidgetId;
        if (widgetId && window.turnstile && typeof window.turnstile.getResponse === "function") {
            return window.turnstile.getResponse(widgetId) || "";
        }
        return container.querySelector('input[name="cf-turnstile-response"]')?.value || "";
    };

    window.resetKnowmeTurnstile = function (container) {
        if (!container) return;
        const widgetId = container.dataset.turnstileWidgetId;
        if (widgetId && window.turnstile && typeof window.turnstile.reset === "function") {
            window.turnstile.reset(widgetId);
        }
    };

    window.knowmeTurnstileOnload = function () {
        document.querySelectorAll("[data-turnstile-container]").forEach((container) => {
            const isLazy = container.dataset.turnstileLazy === "true";
            const shouldRenderNow = !isLazy || container.dataset.turnstilePending === "true";
            if (shouldRenderNow) window.renderKnowmeTurnstile(container);
        });
    };
})();

const translations = {

    /* =====================================================
       ENGLISH
    ===================================================== */

    en: {

        nav: {
            why: "Why KNOWME?",
            home: "Home",
            prices: "Prices",
            projects: "Projects",
            contact: "Contact",
            startProject: "Start Project"
        },



        whyKnowme: {

            brand: "KNOWME",
            tagline: "NOT JUST A WEBSITE.",
            label: "WHY KNOWME?",
            title: "More than a website. A complete digital system.",
            description: "I build websites as complete digital products: from interface and backend logic to data, security and deployment.",
            capabilitiesLabel: "CAPABILITIES",
            capabilitiesTitle: "What can KNOWME build?",
            card1Title: "Custom Websites",
            card1Text: "Modern responsive websites designed around the actual business.",
            card2Title: "Web Applications",
            card2Text: "Dynamic systems with routes, forms, authentication and business logic.",
            card3Title: "Backend Systems",
            card3Text: "Python and Flask applications connected to real databases and APIs.",
            card4Title: "Secure Architecture",
            card4Text: "Authentication, access control, validation and security configuration.",
            card5Title: "Database Solutions",
            card5Text: "Structured data with PostgreSQL and application-level integration.",
            card6Title: "Production Deployment",
            card6Text: "Real deployment workflows prepared for production environments.",
            mindsetLabel: "THE MINDSET",
            mindsetTitle: "Think. Design. Engineer. Secure. Launch.",
            mind1: "THINK",
            mind2: "DESIGN",
            mind3: "ENGINEER",
            mind4: "SECURE",
            mind5: "LAUNCH",
            finalLabel: "READY TO BUILD?",
            finalTitle: "Your idea can become a real product.",
            finalText: "Let's build something unique, useful and ready for real users.",
            finalButton: "Explore KNOWME"
        },

        /* =================================================
           HOME
        ================================================= */

        home: {

            title:
                "Modern Websites. Powerful Solutions.",

            description:
                "Fast, secure and modern websites built for businesses and professionals.",

            projects:
                "View Projects",

            contact:
                "Contact Me"
        },



        /* =================================================
           HOME PROCESS
        ================================================= */

        homeProcess: {
            badge: "HOW I BUILD",
            title: "From an idea to a real working product.",
            description: "A strong website is not only a beautiful screen. It is planning, clean interface design, reliable code, careful testing and a launch that is ready for real users.",
            strategy: "Strategy",
            design: "UI / UX",
            development: "Development",
            testing: "Testing",
            button: "Explore Service Options",
            step1Title: "Understand the Goal",
            step1Text: "I start with the business goal, audience and functionality the website actually needs.",
            step2Title: "Design the Experience",
            step2Text: "The structure is built around clear navigation, responsive layouts and a strong visual hierarchy.",
            step3Title: "Build the System",
            step3Text: "Frontend and backend code are connected into one maintainable application instead of isolated pieces.",
            step4Title: "Test & Launch",
            step4Text: "Mobile behavior, forms, routes and security basics are checked before the project goes live."
        },

        /* =================================================
           HOME TECHNOLOGY
        ================================================= */

        homeTech: {
            badge: "MODERN WEB DEVELOPMENT",
            title: "Frontend, backend and security working together.",
            description: "A professional web project is a system. The interface, server logic, data and security should support each other from the beginning.",
            frontendTitle: "Fast & Responsive UI",
            frontendText: "HTML, CSS and JavaScript create interfaces that adapt cleanly to desktop, tablet and mobile.",
            backendTitle: "Real Server Logic",
            backendText: "Flask and Python can power forms, authentication, APIs, business logic and dynamic pages.",
            databaseTitle: "Structured Data",
            databaseText: "Databases keep application data organized, searchable and ready for future growth.",
            securityTitle: "Security by Design",
            securityText: "Validation, authentication patterns, security headers and access control are considered as part of the application architecture.",
            appStatus: "● Flask application",
            codeFeature1: "Clean routes",
            codeFeature2: "Reusable templates",
            codeFeature3: "Secure backend",
            projectsButton: "See My Projects →"
        },

        /* =================================================
           HOME FINAL CTA
        ================================================= */

        homeFinal: {
            badge: "HAVE AN IDEA?",
            title: "Let's build something that works as good as it looks.",
            description: "Tell me what you need and we can choose the right structure, functionality and development approach.",
            prices: "View Prices",
            contact: "Start a Project"
        },
                 chat: {
            badge: "KNOWME INTELLIGENCE",
            title: "Meet KNOWME AI.",
            description: "Ask questions, explore ideas and discover what KNOWME Studio can build for you.",
            assistant: "AI Assistant",
            ready: "READY",
            welcome: "Hello! I am KNOWME AI. How can I help you today?",
            inputLabel: "Your message",
            placeholder: "Ask KNOWME AI anything...",
            send: "Send message",
            hint: "AI can make mistakes. Avoid sharing passwords or sensitive information.",
            you: "YOU",
            thinking: "KNOWME AI is thinking...",
            error: "I couldn't get a response. Please try again.",
            securityError: "Secure chat token is missing. Refresh the page and try again.",
            turnstileRequired: "Complete the security verification before sending your message.",
            contextTooLarge: "This request is too large for the available AI context. Shorten the latest message and try again.",
            requestTooLarge: "This chat request is too large. Shorten the message or conversation and try again.",
            temporarilyBusy: "KNOWME AI is temporarily unavailable. Please try again shortly.",
            dailyLimit: "KNOWME AI's daily usage limit has been reached.",
            retryAfter: " Please try again in about {minutes} minutes.",
            rateLimited: "Too many chat requests. Please try again shortly."
        },

        /* =================================================
           PRICES
        ================================================= */

        prices: {

            title:
                "Website Prices",

            description:
                "Choose the package that fits your project. Every website is responsive, modern and built with attention to security.",

            disclaimer: "Prices may vary depending on project requirements, agreed terms, and applicable discounts.",


            /* STARTER */

            starterType:
                "STARTER",

            starterTitle:
                "Landing Page",

            starterPrice:
                "$50 USD",

            starterInfo:
                "Perfect for a personal brand, service or small business.",

            starterFeature1:
                "✓ 1-page website",

            starterFeature2:
                "✓ Modern responsive design",

            starterFeature3:
                "✓ Mobile-friendly layout",

            starterFeature4:
                "✓ Contact section",

            starterFeature5:
                "✓ Telegram / WhatsApp links",

            starterFeature6:
                "✓ Basic SEO setup",

            starterFeature7:
                "✓ Basic security setup",

            starterTime:
                "Development: 3–5 days",


            /* BUSINESS */

            recommended:
                "RECOMMENDED",

            businessType:
                "BUSINESS",

            businessTitle:
                "Business Website",

            businessPrice:
                "$100 USD",

            businessInfo:
                "A complete website for businesses that need a professional online presence.",

            businessFeature1:
                "✓ Multiple pages",

            businessFeature2:
                "✓ Premium responsive design",

            businessFeature3:
                "✓ Mobile optimization",

            businessFeature4:
                "✓ Contact form",

            businessFeature5:
                "✓ SEO optimization",

            businessFeature6:
                "✓ Security configuration",

            businessFeature7:
                "✓ Social media integration",

            businessFeature8:
                "✓ Basic animations",

            businessTime:
                "Development: 7–14 days",


            /* CUSTOM */

            customType:
                "CUSTOM",

            customTitle:
                "Custom Web Project",

            customPrice:
                "Negotiable",

            customInfo:
                "For projects that require backend, database or custom functionality.",

            customFeature1:
                "✓ Custom frontend",

            customFeature2:
                "✓ Flask backend",

            customFeature3:
                "✓ Database integration",

            customFeature4:
                "✓ Authentication",

            customFeature5:
                "✓ Admin panel",

            customFeature6:
                "✓ Custom API functionality",

            customFeature7:
                "✓ Advanced security",

            customFeature8:
                "✓ Deployment setup",

            customTime:
                "Development time depends on the project",


            /* BUTTONS */

            order:
                "Order Website",

            discuss:
                "Discuss Project",


            /* BOTTOM */

            noteTitle:
                "Need something different?",

            noteText:
                "Every project is different. Contact me and I will prepare a solution based on your requirements and budget.",

            noteButton:
                "Contact KNOWME Studio"
        },


        /* =================================================
           PROJECTS
        ================================================= */

        projects: {

            title:
                "My Projects",

            description:
                "Explore my web development projects, technologies and digital solutions.",

            live:
                "LIVE",

            development:
                "IN DEVELOPMENT",

            coming:
                "COMING SOON",


            project1Text:
                "Modern multilingual commercial website with responsive design, animations, SEO and security configuration.",


            project2Title:
                "KNOWME Flask",

            project2Text:
                "Full-stack version of KNOWME Studio with Flask backend, database, admin panel and custom functionality.",


            project3Title:
                "Future Commercial Project",

            project3Text:
                "New commercial websites and web applications will appear here.",


            publishedAt:
                "Published website",

            view:
                "View Live Website",


            ctaTitle:
                "Have a project in mind?",

            ctaText:
                "Let's turn your idea into a modern, fast and professional website.",

            ctaButton:
                "Start a Project"
        }

    },


    /* =====================================================
       RUSSIAN
    ===================================================== */

    ru: {

        nav: {
            why: "Почему KNOWME?",
            home: "Главная",
            prices: "Цены",
            projects: "Проекты",
            contact: "Контакты",
            startProject: "Начать проект"
        },



        whyKnowme: {

            brand: "KNOWME",
            tagline: "НЕ ПРОСТО САЙТ.",
            label: "ПОЧЕМУ KNOWME?",
            title: "Больше, чем сайт. Полноценная цифровая система.",
            description: "Я создаю сайты как полноценные цифровые продукты: от интерфейса и backend-логики до данных, безопасности и публикации.",
            capabilitiesLabel: "ВОЗМОЖНОСТИ",
            capabilitiesTitle: "Что может создать KNOWME?",
            card1Title: "Индивидуальные сайты",
            card1Text: "Современные адаптивные сайты, созданные вокруг реальных задач бизнеса.",
            card2Title: "Веб-приложения",
            card2Text: "Динамические системы с маршрутами, формами, аутентификацией и бизнес-логикой.",
            card3Title: "Backend-системы",
            card3Text: "Приложения на Python и Flask, подключённые к базам данных и API.",
            card4Title: "Безопасная архитектура",
            card4Text: "Аутентификация, контроль доступа, валидация и настройки безопасности.",
            card5Title: "Работа с базами данных",
            card5Text: "Структурированные данные с PostgreSQL и интеграцией на уровне приложения.",
            card6Title: "Production deployment",
            card6Text: "Рабочие процессы развёртывания, подготовленные для реальной среды.",
            mindsetLabel: "ПОДХОД",
            mindsetTitle: "Думать. Проектировать. Разрабатывать. Защищать. Запускать.",
            mind1: "ДУМАТЬ",
            mind2: "ПРОЕКТИРОВАТЬ",
            mind3: "РАЗРАБАТЫВАТЬ",
            mind4: "ЗАЩИЩАТЬ",
            mind5: "ЗАПУСКАТЬ",
            finalLabel: "ГОТОВЫ СОЗДАТЬ?",
            finalTitle: "Ваша идея может стать реальным продуктом.",
            finalText: "Давайте создадим что-то уникальное, полезное и готовое для реальных пользователей.",
            finalButton: "Открыть KNOWME"
        },

        /* =================================================
           HOME
        ================================================= */

        home: {

            title:
                "Современные сайты. Мощные решения.",

            description:
                "Быстрые, безопасные и современные сайты для бизнеса и профессионалов.",

            projects:
                "Смотреть проекты",

            contact:
                "Связаться"
        },



        /* =================================================
           HOME PROCESS
        ================================================= */

        homeProcess: {
            badge: "КАК Я СОЗДАЮ САЙТЫ",
            title: "От идеи до реально работающего продукта.",
            description: "Сильный сайт — это не только красивый экран. Это планирование, понятный интерфейс, надёжный код, тщательное тестирование и запуск, готовый для реальных пользователей.",
            strategy: "Стратегия",
            design: "UI / UX",
            development: "Разработка",
            testing: "Тестирование",
            button: "Посмотреть варианты услуг",
            step1Title: "Понять цель",
            step1Text: "Сначала я определяю цель бизнеса, аудиторию и функциональность, которая действительно нужна сайту.",
            step2Title: "Спроектировать интерфейс",
            step2Text: "Структура строится вокруг понятной навигации, адаптивного дизайна и сильной визуальной иерархии.",
            step3Title: "Создать систему",
            step3Text: "Frontend и backend объединяются в единое поддерживаемое приложение, а не в набор отдельных частей.",
            step4Title: "Протестировать и запустить",
            step4Text: "Перед публикацией проверяются мобильная версия, формы, маршруты и базовые настройки безопасности."
        },

        /* =================================================
           HOME TECHNOLOGY
        ================================================= */

        homeTech: {
            badge: "СОВРЕМЕННАЯ ВЕБ-РАЗРАБОТКА",
            title: "Frontend, backend и безопасность работают вместе.",
            description: "Профессиональный веб-проект — это система. Интерфейс, серверная логика, данные и безопасность должны поддерживать друг друга с самого начала.",
            frontendTitle: "Быстрый и адаптивный интерфейс",
            frontendText: "HTML, CSS и JavaScript создают интерфейсы, которые корректно работают на компьютерах, планшетах и телефонах.",
            backendTitle: "Настоящая серверная логика",
            backendText: "Flask и Python могут обрабатывать формы, аутентификацию, API, бизнес-логику и динамические страницы.",
            databaseTitle: "Структурированные данные",
            databaseText: "Базы данных помогают хранить информацию организованно, выполнять поиск и масштабировать проект в будущем.",
            securityTitle: "Безопасность в архитектуре",
            securityText: "Валидация, безопасная аутентификация, security headers и контроль доступа учитываются при построении приложения.",
            appStatus: "● Flask-приложение",
            codeFeature1: "Чистые маршруты",
            codeFeature2: "Повторно используемые шаблоны",
            codeFeature3: "Безопасный backend",
            projectsButton: "Посмотреть мои проекты →"
        },

        /* =================================================
           HOME FINAL CTA
        ================================================= */

        homeFinal: {
            badge: "ЕСТЬ ИДЕЯ?",
            title: "Давайте создадим проект, который не только хорошо выглядит, но и отлично работает.",
            description: "Расскажите, что вам нужно, и мы выберем подходящую структуру, функциональность и способ разработки.",
            prices: "Посмотреть цены",
            contact: "Начать проект"
        },
                 chat: {
            badge: "ИНТЕЛЛЕКТ KNOWME",
            title: "Знакомьтесь: KNOWME AI.",
            description: "Задавайте вопросы, исследуйте идеи и узнайте, что может создать KNOWME Studio.",
            assistant: "ИИ-помощник",
            ready: "ГОТОВ",
            welcome: "Здравствуйте! Я KNOWME AI. Чем могу вам помочь?",
            inputLabel: "Ваше сообщение",
            placeholder: "Задайте вопрос KNOWME AI...",
            send: "Отправить сообщение",
            hint: "ИИ может ошибаться. Не отправляйте пароли и конфиденциальную информацию.",
            you: "ВЫ",
            thinking: "KNOWME AI обрабатывает запрос...",
            error: "Не удалось получить ответ. Попробуйте ещё раз.",
            securityError: "Отсутствует защищённый токен чата. Обновите страницу и попробуйте снова.",
            turnstileRequired: "Пройдите проверку безопасности перед отправкой сообщения.",
            contextTooLarge: "Этот запрос слишком велик для доступного контекста ИИ. Сократите последнее сообщение и попробуйте снова.",
            requestTooLarge: "Запрос чата слишком велик. Сократите сообщение или историю и попробуйте снова.",
            temporarilyBusy: "KNOWME AI временно недоступен. Попробуйте ещё раз позже.",
            dailyLimit: "Достигнут дневной лимит использования KNOWME AI.",
            retryAfter: " Попробуйте снова примерно через {minutes} мин.",
            rateLimited: "Слишком много запросов к чату. Попробуйте ещё раз позже."
        },
        /* =================================================
           PRICES
        ================================================= */

        prices: {

            title:
                "Цены на сайты",

            description:
                "Выберите пакет, который подходит вашему проекту. Каждый сайт создаётся современным, адаптивным и с учётом безопасности.",

            disclaimer: "Цены могут изменяться в зависимости от требований проекта, согласованных условий и предоставляемых скидок.",


            /* STARTER */

            starterType:
                "СТАРТ",

            starterTitle:
                "Лендинг",

            starterPrice:
                "18,310 RUB",

            starterInfo:
                "Подходит для личного бренда, услуг или небольшого бизнеса.",

            starterFeature1:
                "✓ Одностраничный сайт",

            starterFeature2:
                "✓ Современный адаптивный дизайн",

            starterFeature3:
                "✓ Оптимизация для мобильных устройств",

            starterFeature4:
                "✓ Раздел контактов",

            starterFeature5:
                "✓ Ссылки Telegram / WhatsApp",

            starterFeature6:
                "✓ Базовая SEO-настройка",

            starterFeature7:
                "✓ Базовая настройка безопасности",

            starterTime:
                "Разработка: 3–5 дней",


            /* BUSINESS */

            recommended:
                "РЕКОМЕНДУЕМ",

            businessType:
                "БИЗНЕС",

            businessTitle:
                "Бизнес-сайт",

            businessPrice:
                "34,330 RUB",

            businessInfo:
                "Полноценный сайт для бизнеса, которому необходимо профессиональное присутствие в интернете.",

            businessFeature1:
                "✓ Несколько страниц",

            businessFeature2:
                "✓ Премиальный адаптивный дизайн",

            businessFeature3:
                "✓ Оптимизация для мобильных устройств",

            businessFeature4:
                "✓ Контактная форма",

            businessFeature5:
                "✓ SEO-оптимизация",

            businessFeature6:
                "✓ Настройка безопасности",

            businessFeature7:
                "✓ Интеграция социальных сетей",

            businessFeature8:
                "✓ Базовые анимации",

            businessTime:
                "Разработка: 7–14 дней",


            /* CUSTOM */

            customType:
                "ИНДИВИДУАЛЬНЫЙ",

            customTitle:
                "Индивидуальный веб-проект",

            customPrice:
                "Договорная",

            customInfo:
                "Для проектов, которым необходим backend, база данных или специальный функционал.",

            customFeature1:
                "✓ Индивидуальный frontend",

            customFeature2:
                "✓ Flask backend",

            customFeature3:
                "✓ Интеграция базы данных",

            customFeature4:
                "✓ Аутентификация",

            customFeature5:
                "✓ Панель администратора",

            customFeature6:
                "✓ Индивидуальный API-функционал",

            customFeature7:
                "✓ Расширенная безопасность",

            customFeature8:
                "✓ Настройка публикации сайта",

            customTime:
                "Срок разработки зависит от проекта",


            order:
                "Заказать сайт",

            discuss:
                "Обсудить проект",


            noteTitle:
                "Нужно другое решение?",

            noteText:
                "Каждый проект индивидуален. Свяжитесь со мной, и я предложу решение с учётом ваших требований и бюджета.",

            noteButton:
                "Связаться с KNOWME Studio"
        },


        /* =================================================
           PROJECTS
        ================================================= */

        projects: {

            title:
                "Мои проекты",

            description:
                "Посмотрите мои проекты в области веб-разработки, используемые технологии и цифровые решения.",

            live:
                "ОПУБЛИКОВАН",

            development:
                "В РАЗРАБОТКЕ",

            coming:
                "СКОРО",


            project1Text:
                "Современный многоязычный коммерческий сайт с адаптивным дизайном, анимациями, SEO и настройками безопасности.",


            project2Title:
                "KNOWME Flask",

            project2Text:
                "Full-stack версия KNOWME Studio с Flask backend, базой данных, панелью администратора и индивидуальным функционалом.",


            project3Title:
                "Будущий коммерческий проект",

            project3Text:
                "Здесь будут появляться новые коммерческие сайты и веб-приложения.",


            publishedAt:
                "Опубликованный сайт",

            view:
                "Открыть сайт",


            ctaTitle:
                "Есть идея для проекта?",

            ctaText:
                "Давайте превратим вашу идею в современный, быстрый и профессиональный сайт.",

            ctaButton:
                "Начать проект"
        }

    },


    /* =====================================================
       ARMENIAN
    ===================================================== */

    hy: {

        nav: {
            why: "Ինչու KNOWME?",
            home: "Գլխավոր",
            prices: "Գներ",
            projects: "Նախագծեր",
            contact: "Կապ",
            startProject: "Սկսել նախագիծը"
        },



        whyKnowme: {

            brand: "KNOWME",
            tagline: "ՍԱ ՊԱՐԶԱՊԵՍ ԿԱՅՔ ՉԷ։",
            label: "ԻՆՉՈՒ KNOWME?",
            title: "Ավելին, քան կայք։ Ամբողջական թվային համակարգ։",
            description: "Ես կայքերը կառուցում եմ որպես ամբողջական թվային պրոդուկտներ՝ ինտերֆեյսից և backend logic-ից մինչև տվյալներ, անվտանգություն և հրապարակում։",
            capabilitiesLabel: "ՀՆԱՐԱՎՈՐՈՒԹՅՈՒՆՆԵՐ",
            capabilitiesTitle: "Ի՞նչ կարող է կառուցել KNOWME-ը։",
            card1Title: "Անհատական կայքեր",
            card1Text: "Ժամանակակից responsive կայքեր, որոնք կառուցվում են բիզնեսի իրական նպատակների շուրջ։",
            card2Title: "Web Applications",
            card2Text: "Դինամիկ համակարգեր՝ route-երով, form-երով, authentication-ով և business logic-ով։",
            card3Title: "Backend համակարգեր",
            card3Text: "Python և Flask հավելվածներ՝ միացված իրական տվյալների բազաների և API-ների հետ։",
            card4Title: "Անվտանգ ճարտարապետություն",
            card4Text: "Authentication, access control, validation և անվտանգության կարգավորումներ։",
            card5Title: "Տվյալների բազաներ",
            card5Text: "Կառուցվածքային տվյալներ PostgreSQL-ով և application-level ինտեգրմամբ։",
            card6Title: "Production deployment",
            card6Text: "Իրական deployment գործընթացներ՝ production միջավայրի համար։",
            mindsetLabel: "ՄՏԱԾԵԼԱԿԵՐՊ",
            mindsetTitle: "Մտածել։ Նախագծել։ Կառուցել։ Պաշտպանել։ Հրապարակել։",
            mind1: "ՄՏԱԾԵԼ",
            mind2: "ՆԱԽԱԳԾԵԼ",
            mind3: "ԿԱՌՈՒՑԵԼ",
            mind4: "ՊԱՇՏՊԱՆԵԼ",
            mind5: "ՀՐԱՊԱՐԱԿԵԼ",
            finalLabel: "ՊԱՏՐԱ՞ՍՏ ԵՔ ՍԿՍԵԼՈՒ",
            finalTitle: "Ձեր գաղափարը կարող է դառնալ իրական պրոդուկտ։",
            finalText: "Եկեք ստեղծենք ինչ-որ յուրահատուկ, օգտակար և իրական օգտատերերի համար պատրաստ բան։",
            finalButton: "Բացել KNOWME-ը"
        },

        /* =================================================
           HOME
        ================================================= */

        home: {

            title:
                "Ժամանակակից կայքեր։ Հզոր լուծումներ։",

            description:
                "Արագ, անվտանգ և ժամանակակից կայքեր բիզնեսների և մասնագետների համար։",

            projects:
                "Տեսնել նախագծերը",

            contact:
                "Կապվել ինձ հետ"
        },



        /* =================================================
           HOME PROCESS
        ================================================= */

        homeProcess: {
            badge: "ԻՆՉՊԵՍ ԵՄ ՍՏԵՂԾՈՒՄ",
            title: "Գաղափարից մինչև իրական աշխատող արդյունք։",
            description: "Ուժեղ կայքը միայն գեղեցիկ էկրան չէ։ Այն ներառում է պլանավորում, հստակ ինտերֆեյս, վստահելի կոդ, մանրակրկիտ թեստավորում և իրական օգտատերերի համար պատրաստ հրապարակում։",
            strategy: "Ռազմավարություն",
            design: "UI / UX",
            development: "Մշակում",
            testing: "Թեստավորում",
            button: "Դիտել ծառայությունների տարբերակները",
            step1Title: "Հասկանալ նպատակը",
            step1Text: "Սկզբում հասկանում եմ բիզնեսի նպատակը, լսարանը և այն ֆունկցիոնալությունը, որն իրականում անհրաժեշտ է կայքին։",
            step2Title: "Նախագծել փորձառությունը",
            step2Text: "Կառուցվածքը ձևավորվում է հստակ նավիգացիայի, responsive դիզայնի և ճիշտ տեսողական հիերարխիայի շուրջ։",
            step3Title: "Կառուցել համակարգը",
            step3Text: "Frontend-ը և backend-ը միացվում են մեկ ամբողջական ու պահպանելի հավելվածի մեջ՝ առանձին կտորների փոխարեն։",
            step4Title: "Թեստավորել և հրապարակել",
            step4Text: "Հրապարակումից առաջ ստուգվում են mobile տարբերակը, form-երը, route-երը և անվտանգության հիմնական կարգավորումները։"
        },

        /* =================================================
           HOME TECHNOLOGY
        ================================================= */

        homeTech: {
            badge: "ԺԱՄԱՆԱԿԱԿԻՑ ՎԵԲ ՄՇԱԿՈՒՄ",
            title: "Frontend-ը, backend-ը և անվտանգությունը աշխատում են միասին։",
            description: "Պրոֆեսիոնալ վեբ նախագիծը համակարգ է։ Ինտերֆեյսը, server logic-ը, տվյալները և անվտանգությունը պետք է սկզբից աշխատեն որպես մեկ ամբողջություն։",
            frontendTitle: "Արագ և responsive ինտերֆեյս",
            frontendText: "HTML-ը, CSS-ը և JavaScript-ը ստեղծում են ինտերֆեյսներ, որոնք ճիշտ հարմարվում են համակարգչին, պլանշետին և հեռախոսին։",
            backendTitle: "Իրական server logic",
            backendText: "Flask-ը և Python-ը կարող են կառավարել form-երը, authentication-ը, API-ները, business logic-ը և dynamic էջերը։",
            databaseTitle: "Կառուցվածքային տվյալներ",
            databaseText: "Տվյալների բազաները պահում են ինֆորմացիան կազմակերպված, որոնելի և պատրաստ հետագա ընդլայնման համար։",
            securityTitle: "Անվտանգություն հենց նախագծում",
            securityText: "Validation-ը, անվտանգ authentication-ը, security headers-ը և access control-ը հաշվի են առնվում հավելվածի կառուցվածքը նախագծելիս։",
            appStatus: "● Flask հավելված",
            codeFeature1: "Մաքուր route-եր",
            codeFeature2: "Վերօգտագործվող template-ներ",
            codeFeature3: "Անվտանգ backend",
            projectsButton: "Դիտել իմ նախագծերը →"
        },

        /* =================================================
           HOME FINAL CTA
        ================================================= */

        homeFinal: {
            badge: "ԳԱՂԱՓԱՐ ՈՒՆԵ՞Ք",
            title: "Եկեք ստեղծենք մի բան, որը նույնքան լավ կաշխատի, որքան գեղեցիկ կերևա։",
            description: "Ասեք՝ ինչ է ձեզ անհրաժեշտ, և միասին կընտրենք ճիշտ կառուցվածքը, ֆունկցիոնալությունը և մշակման մոտեցումը։",
            prices: "Դիտել գները",
            contact: "Սկսել նախագիծ"
        },
                chat: {
            badge: "KNOWME ԱՐՀԵՍՏԱԿԱՆ ԲԱՆԱԿԱՆՈՒԹՅՈՒՆ",
            title: "Ծանոթացեք KNOWME AI-ի հետ։",
            description: "Հարցեր տվեք, ուսումնասիրեք գաղափարներ և պարզեք, թե ինչ կարող է ստեղծել KNOWME Studio-ն։",
            assistant: "AI օգնական",
            ready: "ՊԱՏՐԱՍՏ Է",
            welcome: "Բարև։ Ես KNOWME AI-ն եմ։ Ինչո՞վ կարող եմ օգնել ձեզ։",
            inputLabel: "Ձեր հաղորդագրությունը",
            placeholder: "Հարցրեք KNOWME AI-ին...",
            send: "Ուղարկել հաղորդագրությունը",
            hint: "AI-ն կարող է սխալվել։ Մի ուղարկեք գաղտնաբառեր կամ գաղտնի տվյալներ։",
            you: "ԴՈՒՔ",
            thinking: "KNOWME AI-ն մշակում է հարցումը...",
            error: "Չհաջողվեց ստանալ պատասխան։ Փորձեք կրկին։",
            securityError: "Chat-ի անվտանգության token-ը բացակայում է։ Թարմացրեք էջը և փորձեք կրկին։",
            turnstileRequired: "Ուղարկելուց առաջ անցեք անվտանգության ստուգումը։",
            contextTooLarge: "Այս հարցումը չափազանց մեծ է հասանելի AI համատեքստի համար։ Կրճատեք վերջին հաղորդագրությունը և փորձեք կրկին։",
            requestTooLarge: "Chat-ի հարցումը չափազանց մեծ է։ Կրճատեք հաղորդագրությունը կամ պատմությունը և փորձեք կրկին։",
            temporarilyBusy: "KNOWME AI-ն ժամանակավորապես անհասանելի է։ Խնդրում ենք փորձել ավելի ուշ։",
            dailyLimit: "KNOWME AI-ի օրական օգտագործման սահմանաչափը սպառվել է։",
            retryAfter: " Փորձեք կրկին մոտ {minutes} րոպեից։",
            rateLimited: "Chat-ին չափազանց շատ հարցումներ են ուղարկվել։ Փորձեք կրկին ավելի ուշ։"
        },
        /* =================================================
           PRICES
        ================================================= */

        prices: {

            title:
                "Կայքերի գներ",

            description:
                "Ընտրեք ձեր նախագծին համապատասխան փաթեթը։ Յուրաքանչյուր կայք ստեղծվում է ժամանակակից, հարմարեցվող և անվտանգության նկատմամբ ուշադրությամբ։",

            disclaimer: "Գները կարող են փոփոխվել՝ կախված նախագծի պահանջներից, համաձայնեցված պայմաններից և կիրառվող զեղչերից։",


            /* STARTER */

            starterType:
                "ՍԿՍՆԱԿ",

            starterTitle:
                "Landing Page",

            starterPrice:
                "80,000 AMD",

            starterInfo:
                "Հարմար է անձնական բրենդի, ծառայության կամ փոքր բիզնեսի համար։",

            starterFeature1:
                "✓ Մեկ էջանոց կայք",

            starterFeature2:
                "✓ Ժամանակակից responsive դիզայն",

            starterFeature3:
                "✓ Հարմարեցում հեռախոսների համար",

            starterFeature4:
                "✓ Կապի բաժին",

            starterFeature5:
                "✓ Telegram / WhatsApp հղումներ",

            starterFeature6:
                "✓ Հիմնական SEO կարգավորում",

            starterFeature7:
                "✓ Հիմնական անվտանգության կարգավորում",

            starterTime:
                "Պատրաստման ժամկետ՝ 3–5 օր",


            /* BUSINESS */

            recommended:
                "ԱՌԱՋԱՐԿՎՈՒՄ Է",

            businessType:
                "ԲԻԶՆԵՍ",

            businessTitle:
                "Բիզնես կայք",

            businessPrice:
                "150,000 AMD",

            businessInfo:
                "Լիարժեք կայք բիզնեսի համար՝ պրոֆեսիոնալ առցանց ներկայությամբ։",

            businessFeature1:
                "✓ Մի քանի էջ",

            businessFeature2:
                "✓ Premium responsive դիզայն",

            businessFeature3:
                "✓ Հարմարեցում հեռախոսների համար",

            businessFeature4:
                "✓ Կապի ձև",

            businessFeature5:
                "✓ SEO օպտիմալացում",

            businessFeature6:
                "✓ Անվտանգության կարգավորում",

            businessFeature7:
                "✓ Սոցիալական ցանցերի ինտեգրում",

            businessFeature8:
                "✓ Հիմնական անիմացիաներ",

            businessTime:
                "Պատրաստման ժամկետ՝ 7–14 օր",


            /* CUSTOM */

            customType:
                "ԱՆՀԱՏԱԿԱՆ",

            customTitle:
                "Անհատական վեբ նախագիծ",

            customPrice:
                "Պայմանագրային",

            customInfo:
                "Նախագծերի համար, որոնց անհրաժեշտ է backend, տվյալների բազա կամ հատուկ ֆունկցիոնալություն։",

            customFeature1:
                "✓ Անհատական frontend",

            customFeature2:
                "✓ Flask backend",

            customFeature3:
                "✓ Տվյալների բազայի ինտեգրում",

            customFeature4:
                "✓ Authentication համակարգ",

            customFeature5:
                "✓ Admin panel",

            customFeature6:
                "✓ Անհատական API ֆունկցիոնալություն",

            customFeature7:
                "✓ Ընդլայնված անվտանգություն",

            customFeature8:
                "✓ Կայքի հրապարակման կարգավորում",

            customTime:
                "Պատրաստման ժամկետը կախված է նախագծից",


            order:
                "Պատվիրել կայք",

            discuss:
                "Քննարկել նախագիծը",


            noteTitle:
                "Այլ լուծո՞ւմ է անհրաժեշտ",

            noteText:
                "Յուրաքանչյուր նախագիծ տարբեր է։ Կապվեք ինձ հետ, և ես կառաջարկեմ ձեր պահանջներին և բյուջեին համապատասխան լուծում։",

            noteButton:
                "Կապվել KNOWME Studio-ի հետ"
        },


        /* =================================================
           PROJECTS
        ================================================= */

        projects: {

            title:
                "Իմ նախագծերը",

            description:
                "Դիտեք իմ վեբ նախագծերը, օգտագործված տեխնոլոգիաները և թվային լուծումները։",

            live:
                "ՀՐԱՊԱՐԱԿՎԱԾ",

            development:
                "ՄՇԱԿՄԱՆ ՓՈՒԼՈՒՄ",

            coming:
                "ՇՈՒՏՈՎ",


            project1Text:
                "Ժամանակակից բազմալեզու կոմերցիոն կայք՝ responsive դիզայնով, անիմացիաներով, SEO-ով և անվտանգության կարգավորումներով։",


            project2Title:
                "KNOWME Flask",

            project2Text:
                "KNOWME Studio-ի full-stack տարբերակը՝ Flask backend-ով, տվյալների բազայով, admin panel-ով և անհատական ֆունկցիոնալությամբ։",


            project3Title:
                "Ապագա կոմերցիոն նախագիծ",

            project3Text:
                "Այստեղ կհայտնվեն նոր կոմերցիոն կայքեր և վեբ հավելվածներ։",


            publishedAt:
                "Հրապարակված կայք",

            view:
                "Դիտել կայքը",


            ctaTitle:
                "Ունե՞ք նախագծի գաղափար",

            ctaText:
                "Եկեք ձեր գաղափարը վերածենք ժամանակակից, արագ և պրոֆեսիոնալ կայքի։",

            ctaButton:
                "Սկսել նախագիծ"
        }

    }

};


/* =========================================================
   START PROJECT — MULTILINGUAL COPY
========================================================= */

Object.assign(translations.en, {
    startProject: {
        eyebrow: "PROJECT CONFIGURATOR",
        title: "Let's define your next website.",
        intro: "Choose the direction, visual style and functionality. Your brief will be sent to KNOWME Studio for review and confirmation.",
        live: "PROJECT BRIEF",
        asideTitle: "A clear brief creates a stronger result.",
        asideText: "Tell us what you want to build. We will review the scope, identify the right technical approach and contact you to confirm the next steps.",
        process1Title: "Your direction", process1Text: "Purpose and website type",
        process2Title: "Visual language", process2Text: "Style, layout and pages",
        process3Title: "Functionality", process3Text: "Features and project scope",
        process4Title: "Confirmation", process4Text: "Contact and project review",
        asideFoot: "THINK · DESIGN · ENGINEER · LAUNCH", formKicker: "BUILD YOUR BRIEF",
        step1Title: "What are we building?", step2Title: "How should it look?", step3Title: "What should it do?", step4Title: "Review and contact details",
        step1: "Type", step2: "Design", step3: "Features", step4: "Contact",
        typeLabel: "Choose the type of website", typeHint: "Select the option that best describes your idea.",
        typeBusiness: "Business website", typeBusinessText: "Company, service or organization",
        typePortfolio: "Portfolio", typePortfolioText: "Personal work and professional profile",
        typeStore: "Online store", typeStoreText: "Products, cart and online sales",
        typeLanding: "Landing page", typeLandingText: "One focused page and one main action",
        typeWebapp: "Web application", typeWebappText: "Custom logic, accounts or dashboards",
        typeOther: "Not sure yet", typeOtherText: "I want to discuss the idea first",
        goalLabel: "What is the main goal?", goalLeads: "Get more clients", goalSales: "Sell products", goalBooking: "Accept bookings", goalBrand: "Build a personal brand", goalInfo: "Present information", goalOther: "Other goal",
        designLabel: "Choose the visual direction", designHint: "This is a starting point. The final design will be refined during project planning.",
        styleModern: "Modern", styleModernText: "Bold layout and current UI patterns", styleMinimal: "Minimal", styleMinimalText: "Clean, calm and focused", styleCorporate: "Corporate", styleCorporateText: "Structured and professional", styleLuxury: "Luxury", styleLuxuryText: "Elegant details and contrast", styleCreative: "Creative", styleCreativeText: "Expressive and experimental", styleFuture: "Futuristic", styleFutureText: "Technology-led visual language", styleReference: "Based on a reference", styleReferenceText: "I will share an example website",
        pagesLabel: "How large should the website be?", pagesOne: "1 page", pagesSmall: "3–5 pages", pagesMedium: "6–10 pages", pagesLarge: "10+ pages", pagesUnsure: "Not sure",
        primaryColor: "Primary color", secondaryColor: "Secondary color", referenceLabel: "Reference website (optional)", referencePlaceholder: "https://example.com", referenceHint: "Share a link only if you have a visual example in mind.",
        featuresLabel: "Choose pages and functionality", featuresHint: "Select everything you think you may need. We can refine the scope together.", requiredPagesLabel: "Pages or sections", pageHome: "Home", pageAbout: "About", pageServices: "Services", pageProjects: "Projects / Portfolio", pagePricing: "Pricing", pageBlog: "Blog / News", pageContact: "Contact", pageFaq: "FAQ", pageShop: "Shop / Products", pageOther: "Other",
        functionalityLabel: "Additional functionality", featureContact: "Contact form", featureAccounts: "User accounts / login", featureAdmin: "Admin dashboard", featurePayments: "Online payments", featureBooking: "Booking system", featureMulti: "Multiple languages", featureBlog: "Blog / CMS", featureSearch: "Website search", featureNewsletter: "Newsletter", featureApi: "API integration", featureSeo: "SEO setup", featureAnimations: "Animations / interactions", featureChat: "Live chat / AI assistant",
        budgetLabel: "Estimated budget", budget1: "Under 100,000 AMD", budget2: "100,000–250,000 AMD", budget3: "250,000–500,000 AMD", budget4: "500,000+ AMD", budgetDiscuss: "Let's discuss",
        deadlineLabel: "When would you like to launch?", deadlineAsap: "As soon as possible", deadlineTwoWeeks: "Within 2 weeks", deadlineMonth: "Within a month", deadlineFlexible: "Flexible",
        contactLabel: "A few final details", contactHint: "Tell us how to reach you and add any details that will help us understand the project.", audienceLabel: "Who is the website for? (optional)", audiencePlaceholder: "e.g. local customers, companies, students...", descriptionLabel: "Describe your idea *", descriptionPlaceholder: "Tell us what the website should do, what problem it solves and anything else we should know...", descriptionHint: "20–3,000 characters. Do not include passwords or confidential information.", yourContact: "Your contact details", nameLabel: "Full name *", emailLabel: "Email address *", phoneLabel: "Phone / Telegram (optional)", companyLabel: "Company (optional)",
        summaryLabel: "YOUR PROJECT SUMMARY", summaryEmpty: "Your selections will appear here as you complete the form.", consent: "I agree that KNOWME Studio may use these details to review my project request and contact me about it.", privateNote: "Your brief is sent securely over HTTPS.", previous: "Back", continue: "Continue", submit: "Send project brief", footer: "A thoughtful process. A secure result.", needHelp: "Need help? Contact us",
        validationRequired: "Complete the required selections before continuing.", validationPages: "Choose at least one page or section.", validationContact: "Complete your name, email, project description and consent.", validationEmail: "Enter a valid email address.", validationReference: "Use a valid http or https reference link.",
        modelsKicker: "OPTIONAL · FREE 3D ASSETS",
        modelsTitle: "Add a 3D element to your website",
        modelsIntro: "Choose from the free 3D models offered by KNOWME Studio. Your selection will be included in the project brief.",
        modelsSelected: "selected",
        modelsFree: "FREE",
        modelsEmptyTitle: "The free 3D collection is being prepared.",
        modelsEmptyText: "Free models will appear here as selectable options once the collection is added.",
        modelsEmptyNote: "You can continue your project request without selecting a 3D model.",
        modelsLicense: "Each published model will include its license and usage conditions."
    }
});

Object.assign(translations.ru, {
    startProject: {
        eyebrow: "КОНФИГУРАТОР ПРОЕКТА",
        title: "Давайте определим ваш будущий сайт.",
        intro: "Выберите направление, визуальный стиль и функции. Заявка будет отправлена в KNOWME Studio для рассмотрения и подтверждения.",
        live: "БРИФ ПРОЕКТА", asideTitle: "Чёткое задание — основа сильного результата.",
        asideText: "Расскажите, что вы хотите создать. Мы оценим объём, подберём технический подход и свяжемся с вами для подтверждения следующих шагов.",
        process1Title: "Ваше направление", process1Text: "Цель и тип сайта", process2Title: "Визуальный стиль", process2Text: "Стиль, структура и страницы", process3Title: "Функциональность", process3Text: "Возможности и объём проекта", process4Title: "Подтверждение", process4Text: "Контакт и проверка проекта",
        asideFoot: "ИДЕЯ · ДИЗАЙН · РАЗРАБОТКА · ЗАПУСК", formKicker: "СОЗДАЙТЕ БРИФ",
        step1Title: "Что мы создаём?", step2Title: "Как это должно выглядеть?", step3Title: "Что сайт должен уметь?", step4Title: "Проверка и контакты",
        step1: "Тип", step2: "Дизайн", step3: "Функции", step4: "Контакты",
        typeLabel: "Выберите тип сайта", typeHint: "Выберите вариант, который лучше всего описывает вашу идею.",
        typeBusiness: "Бизнес-сайт", typeBusinessText: "Компания, услуги или организация", typePortfolio: "Портфолио", typePortfolioText: "Работы и профессиональный профиль", typeStore: "Интернет-магазин", typeStoreText: "Товары, корзина и онлайн-продажи", typeLanding: "Лендинг", typeLandingText: "Одна целевая страница и одно главное действие", typeWebapp: "Веб-приложение", typeWebappText: "Собственная логика, аккаунты или панели управления", typeOther: "Пока не знаю", typeOtherText: "Сначала хочу обсудить идею",
        goalLabel: "Какова главная цель?", goalLeads: "Привлекать клиентов", goalSales: "Продавать товары", goalBooking: "Принимать бронирования", goalBrand: "Развивать личный бренд", goalInfo: "Представлять информацию", goalOther: "Другая цель",
        designLabel: "Выберите визуальное направление", designHint: "Это отправная точка. Финальный дизайн уточняется во время планирования проекта.",
        styleModern: "Современный", styleModernText: "Выразительная структура и актуальный интерфейс", styleMinimal: "Минимализм", styleMinimalText: "Чистый, спокойный и лаконичный стиль", styleCorporate: "Корпоративный", styleCorporateText: "Структурированный и профессиональный", styleLuxury: "Премиальный", styleLuxuryText: "Элегантные детали и контраст", styleCreative: "Креативный", styleCreativeText: "Выразительный и экспериментальный", styleFuture: "Футуристичный", styleFutureText: "Технологичная визуальная подача", styleReference: "По примеру", styleReferenceText: "Я отправлю пример сайта",
        pagesLabel: "Какого размера должен быть сайт?", pagesOne: "1 страница", pagesSmall: "3–5 страниц", pagesMedium: "6–10 страниц", pagesLarge: "Более 10 страниц", pagesUnsure: "Не уверен",
        primaryColor: "Основной цвет", secondaryColor: "Дополнительный цвет", referenceLabel: "Пример сайта (необязательно)", referencePlaceholder: "https://example.com", referenceHint: "Добавьте ссылку, если у вас есть визуальный пример.",
        featuresLabel: "Выберите страницы и функции", featuresHint: "Отметьте всё, что может понадобиться. Объём можно уточнить вместе.", requiredPagesLabel: "Страницы или разделы", pageHome: "Главная", pageAbout: "О нас", pageServices: "Услуги", pageProjects: "Проекты / Портфолио", pagePricing: "Цены", pageBlog: "Блог / Новости", pageContact: "Контакты", pageFaq: "Вопросы и ответы", pageShop: "Магазин / Товары", pageOther: "Другое",
        functionalityLabel: "Дополнительные функции", featureContact: "Форма обратной связи", featureAccounts: "Аккаунты / вход пользователей", featureAdmin: "Панель администратора", featurePayments: "Онлайн-платежи", featureBooking: "Система бронирования", featureMulti: "Несколько языков", featureBlog: "Блог / CMS", featureSearch: "Поиск по сайту", featureNewsletter: "Рассылка", featureApi: "Интеграция API", featureSeo: "Настройка SEO", featureAnimations: "Анимации / интерактивность", featureChat: "Онлайн-чат / ИИ-помощник",
        budgetLabel: "Предполагаемый бюджет", budget1: "До 100 000 AMD", budget2: "100 000–250 000 AMD", budget3: "250 000–500 000 AMD", budget4: "От 500 000 AMD", budgetDiscuss: "Обсудим",
        deadlineLabel: "Когда хотите запустить сайт?", deadlineAsap: "Как можно скорее", deadlineTwoWeeks: "В течение 2 недель", deadlineMonth: "В течение месяца", deadlineFlexible: "Срок гибкий",
        contactLabel: "Осталось несколько деталей", contactHint: "Укажите, как с вами связаться, и добавьте сведения, которые помогут понять проект.", audienceLabel: "Для кого предназначен сайт? (необязательно)", audiencePlaceholder: "Например: местные клиенты, компании, студенты...", descriptionLabel: "Опишите вашу идею *", descriptionPlaceholder: "Расскажите, что должен делать сайт, какую задачу решать и что ещё важно знать...", descriptionHint: "От 20 до 3 000 символов. Не указывайте пароли и конфиденциальные данные.", yourContact: "Ваши контактные данные", nameLabel: "Имя и фамилия *", emailLabel: "Электронная почта *", phoneLabel: "Телефон / Telegram (необязательно)", companyLabel: "Компания (необязательно)",
        summaryLabel: "КРАТКО О ПРОЕКТЕ", summaryEmpty: "Ваш выбор появится здесь по мере заполнения формы.", consent: "Я разрешаю KNOWME Studio использовать эти данные для рассмотрения заявки и связи со мной.", privateNote: "Бриф отправляется по защищённому HTTPS-соединению.", previous: "Назад", continue: "Продолжить", submit: "Отправить бриф", footer: "Продуманный процесс. Надёжный результат.", needHelp: "Нужна помощь? Свяжитесь с нами",
        validationRequired: "Заполните обязательные поля перед продолжением.", validationPages: "Выберите хотя бы одну страницу или раздел.", validationContact: "Укажите имя, электронную почту, описание проекта и согласие.", validationEmail: "Введите корректный адрес электронной почты.", validationReference: "Укажите корректную ссылку с http или https.",
        modelsKicker: "ДОПОЛНИТЕЛЬНО · БЕСПЛАТНЫЕ 3D-МОДЕЛИ",
        modelsTitle: "Добавьте 3D-элемент на свой сайт",
        modelsIntro: "Выберите бесплатные 3D-модели, предлагаемые KNOWME Studio. Ваш выбор будет включён в описание проекта.",
        modelsSelected: "выбрано",
        modelsFree: "БЕСПЛАТНО",
        modelsEmptyTitle: "Коллекция бесплатных 3D-моделей готовится.",
        modelsEmptyText: "После добавления коллекции бесплатные модели появятся здесь как варианты для выбора.",
        modelsEmptyNote: "Вы можете отправить заявку, не выбирая 3D-модель.",
        modelsLicense: "Для каждой опубликованной модели будут указаны лицензия и условия использования."
    }
});

Object.assign(translations.hy, {
    startProject: {
        eyebrow: "ՆԱԽԱԳԾԻ ԿՈՆՖԻԳՈՒՐԱՏՈՐ",
        title: "Եկեք որոշենք՝ ինչ կայք եք ցանկանում։",
        intro: "Ընտրեք կայքի ուղղությունը, արտաքին տեսքը և ֆունկցիոնալությունը։ Հայտը կուղարկվի KNOWME Studio՝ ուսումնասիրության և հաստատման համար։",
        live: "ՆԱԽԱԳԾԻ ՀԱՅՏ", asideTitle: "Հստակ առաջադրանքը լավ արդյունքի հիմքն է։",
        asideText: "Ներկայացրեք ձեր գաղափարը։ Մենք կուսումնասիրենք ծավալը, կընտրենք համապատասխան տեխնիկական մոտեցումը և կապ կհաստատենք հաջորդ քայլերը համաձայնեցնելու համար։",
        process1Title: "Ձեր ուղղությունը", process1Text: "Նպատակն ու կայքի տեսակը", process2Title: "Տեսողական ոճը", process2Text: "Ոճը, կառուցվածքն ու էջերը", process3Title: "Հնարավորությունները", process3Text: "Ֆունկցիաներն ու ծավալը", process4Title: "Հաստատում", process4Text: "Կապ և նախագծի ուսումնասիրություն",
        asideFoot: "ՄՏԱԾԵԼ · ՆԱԽԱԳԾԵԼ · ԿԱՌՈՒՑԵԼ · ԳՈՐԾԱՐԿԵԼ", formKicker: "ԿԱԶՄԵՔ ՁԵՐ ՀԱՅՏԸ",
        step1Title: "Ի՞նչ ենք կառուցելու։", step2Title: "Ինչպիսի՞ տեսք պետք է ունենա։", step3Title: "Ի՞նչ պետք է կարողանա անել։", step4Title: "Վերջնական տվյալներ և կապ",
        step1: "Տեսակ", step2: "Դիզայն", step3: "Ֆունկցիաներ", step4: "Կապ",
        typeLabel: "Ընտրեք կայքի տեսակը", typeHint: "Ընտրեք ձեր գաղափարը լավագույնս նկարագրող տարբերակը։",
        typeBusiness: "Բիզնես կայք", typeBusinessText: "Ընկերություն, ծառայություն կամ կազմակերպություն", typePortfolio: "Պորտֆոլիո", typePortfolioText: "Աշխատանքներ և մասնագիտական ներկայացում", typeStore: "Օնլայն խանութ", typeStoreText: "Ապրանքներ, զամբյուղ և առցանց վաճառք", typeLanding: "Landing page", typeLandingText: "Մեկ նպատակային էջ և հիմնական գործողություն", typeWebapp: "Վեբ հավելված", typeWebappText: "Անհատական տրամաբանություն, հաշիվներ կամ վահանակներ", typeOther: "Դեռ հստակ չէ", typeOtherText: "Նախ ցանկանում եմ քննարկել գաղափարը",
        goalLabel: "Ո՞րն է հիմնական նպատակը։", goalLeads: "Գրավել նոր հաճախորդներ", goalSales: "Վաճառել ապրանքներ", goalBooking: "Ընդունել ամրագրումներ", goalBrand: "Զարգացնել անձնական բրենդը", goalInfo: "Ներկայացնել տեղեկություն", goalOther: "Այլ նպատակ",
        designLabel: "Ընտրեք արտաքին տեսքի ուղղությունը", designHint: "Սա մեկնարկային ընտրություն է։ Վերջնական դիզայնը կհստակեցնենք նախագծման ընթացքում։",
        styleModern: "Ժամանակակից", styleModernText: "Արտահայտիչ կառուցվածք և արդի ինտերֆեյս", styleMinimal: "Մինիմալիստական", styleMinimalText: "Մաքուր, հանգիստ և կենտրոնացված", styleCorporate: "Կորպորատիվ", styleCorporateText: "Կազմակերպված և պրոֆեսիոնալ", styleLuxury: "Պրեմիում", styleLuxuryText: "Նրբագեղ դետալներ և հակադրություն", styleCreative: "Ստեղծագործական", styleCreativeText: "Արտահայտիչ և փորձարարական", styleFuture: "Ֆուտուրիստական", styleFutureText: "Տեխնոլոգիական տեսողական լեզու", styleReference: "Օրինակի հիման վրա", styleReferenceText: "Կուղարկեմ օրինակային կայքի հղում",
        pagesLabel: "Ի՞նչ ծավալի կայք է անհրաժեշտ։", pagesOne: "1 էջ", pagesSmall: "3–5 էջ", pagesMedium: "6–10 էջ", pagesLarge: "10-ից ավելի էջ", pagesUnsure: "Դեռ չգիտեմ",
        primaryColor: "Հիմնական գույն", secondaryColor: "Լրացուցիչ գույն", referenceLabel: "Օրինակային կայք (ըստ ցանկության)", referencePlaceholder: "https://example.com", referenceHint: "Տեղադրեք հղում, եթե ունեք տեսողական օրինակ։",
        featuresLabel: "Ընտրեք էջերն ու ֆունկցիաները", featuresHint: "Նշեք ձեզ անհրաժեշտ հնարավորությունները։ Ծավալը կարող ենք միասին հստակեցնել։", requiredPagesLabel: "Էջեր կամ բաժիններ", pageHome: "Գլխավոր", pageAbout: "Մեր մասին", pageServices: "Ծառայություններ", pageProjects: "Նախագծեր / Պորտֆոլիո", pagePricing: "Գներ", pageBlog: "Բլոգ / Նորություններ", pageContact: "Կապ", pageFaq: "Հաճախ տրվող հարցեր", pageShop: "Խանութ / Ապրանքներ", pageOther: "Այլ",
        functionalityLabel: "Լրացուցիչ հնարավորություններ", featureContact: "Կապի ձև", featureAccounts: "Օգտահաշիվներ / Մուտք", featureAdmin: "Ադմինիստրատորի վահանակ", featurePayments: "Առցանց վճարումներ", featureBooking: "Ամրագրման համակարգ", featureMulti: "Մի քանի լեզու", featureBlog: "Բլոգ / CMS", featureSearch: "Կայքի որոնում", featureNewsletter: "Նամակների բաժանորդագրություն", featureApi: "API ինտեգրում", featureSeo: "SEO կարգավորում", featureAnimations: "Անիմացիաներ / ինտերակտիվություն", featureChat: "Առցանց զրույց / AI օգնական",
        budgetLabel: "Նախատեսվող բյուջե", budget1: "Մինչև 100,000 AMD", budget2: "100,000–250,000 AMD", budget3: "250,000–500,000 AMD", budget4: "500,000+ AMD", budgetDiscuss: "Քննարկենք",
        deadlineLabel: "Ե՞րբ կցանկանաք գործարկել կայքը։", deadlineAsap: "Հնարավորինս շուտ", deadlineTwoWeeks: "2 շաբաթվա ընթացքում", deadlineMonth: "Մեկ ամսվա ընթացքում", deadlineFlexible: "Ժամկետը ճկուն է",
        contactLabel: "Եվս մի քանի մանրուք", contactHint: "Նշեք՝ ինչպես կապ հաստատել ձեզ հետ, և ավելացրեք նախագծին վերաբերող կարևոր տեղեկությունները։", audienceLabel: "Ո՞ւմ համար է նախատեսված կայքը։ (ըստ ցանկության)", audiencePlaceholder: "Օրինակ՝ տեղական հաճախորդներ, ընկերություններ, ուսանողներ...", descriptionLabel: "Նկարագրեք ձեր գաղափարը *", descriptionPlaceholder: "Նշեք՝ ինչ պետք է անի կայքը, ինչ խնդիր լուծի և ինչ այլ բան պետք է իմանանք...", descriptionHint: "20–3,000 նիշ։ Մի նշեք գաղտնաբառեր կամ գաղտնի տվյալներ։", yourContact: "Ձեր կապի տվյալները", nameLabel: "Անուն, ազգանուն *", emailLabel: "Էլեկտրոնային փոստ *", phoneLabel: "Հեռախոս / Telegram (ըստ ցանկության)", companyLabel: "Ընկերություն (ըստ ցանկության)",
        summaryLabel: "ՆԱԽԱԳԾԻ ԱՄՓՈՓՈՒՄ", summaryEmpty: "Ձեր ընտրությունները կհայտնվեն այստեղ՝ ձևը լրացնելուն զուգահեռ։", consent: "Համաձայն եմ, որ KNOWME Studio-ն օգտագործի այս տվյալները հայտը դիտարկելու և ինձ հետ կապ հաստատելու համար։", privateNote: "Հայտը փոխանցվում է HTTPS պաշտպանված կապով։", previous: "Հետ", continue: "Շարունակել", submit: "Ուղարկել նախագիծը", footer: "Մտածված գործընթաց։ Ապահով արդյունք։", needHelp: "Օգնությո՞ւն է պետք։ Կապ հաստատեք",
        validationRequired: "Շարունակելուց առաջ լրացրեք պարտադիր ընտրությունները։", validationPages: "Ընտրեք առնվազն մեկ էջ կամ բաժին։", validationContact: "Լրացրեք անունը, էլ. փոստը, նախագծի նկարագրությունը և համաձայնությունը։", validationEmail: "Մուտքագրեք վավեր էլեկտրոնային փոստի հասցե։",
        modelsKicker: "ԼՐԱՑՈՒՑԻՉ · ԱՆՎՃԱՐ 3D ՄՈԴԵԼՆԵՐ",
        modelsTitle: "Ավելացրու 3D տարր քո կայքին",
        modelsIntro: "Ընտրիր KNOWME Studio-ի առաջարկած անվճար 3D մոդելներից։ Ընտրությունդ կներառվի նախագծի հայտում։",
        modelsSelected: "ընտրված է",
        modelsFree: "ԱՆՎՃԱՐ",
        modelsEmptyTitle: "Անվճար 3D մոդելների հավաքածուն պատրաստվում է։",
        modelsEmptyText: "Հավաքածուն ավելացնելուց հետո անվճար մոդելները կհայտնվեն այստեղ՝ ընտրության համար։",
        modelsEmptyNote: "Կարող ես շարունակել հայտը՝ առանց 3D մոդել ընտրելու։",
        modelsLicense: "Յուրաքանչյուր հրապարակված մոդելի համար կնշվեն լիցենզիան և օգտագործման պայմանները։"
    }
});


/* =========================================================
   ACTIVE SITE LANGUAGE
========================================================= */

let activeSiteLanguage = "en";

/* =========================================================
   GET TRANSLATION
========================================================= */

function getTranslation(language, key) {

    const parts =
        key.split(".");

    let value =
        translations[language];


    for (const part of parts) {

        if (!value) {
            return null;
        }

        value =
            value[part];
    }


    return value;
}


/* =========================================================
   CHANGE LANGUAGE
========================================================= */

function changeLanguage(language) {

    if (!translations[language]) {
        language = "en";
    }


    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;


            const translation =
                getTranslation(
                    language,
                    key
                );


            if (translation !== null) {

                element.textContent =
                    translation;
            }

        });


    /* HTML LANGUAGE */
        /* CHAT PLACEHOLDER TRANSLATION */

    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {

            const key = element.dataset.i18nPlaceholder;

            const translation = getTranslation(language, key);

            if (typeof translation === "string") {
                element.setAttribute("placeholder", translation);
            }
        });


    /* CHAT SEND BUTTON TRANSLATION */

    const chatSendButton = document.getElementById("knowmeChatSend");

    const chatSendLabel = getTranslation(language, "chat.send");

    if (chatSendButton && typeof chatSendLabel === "string") {
        chatSendButton.setAttribute("aria-label", chatSendLabel);
    }

    document.documentElement.lang =
        language;


    /* ACTIVE LANGUAGE BUTTON */

    document
        .querySelectorAll(".lang-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.lang === language
            );

        });


    /* SAVE LANGUAGE */

    localStorage.setItem(
        "knowme-language",
        language
    );

    activeSiteLanguage = language;
}


/* =========================================================
   LANGUAGE BUTTON EVENTS
========================================================= */

document
    .querySelectorAll(".lang-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                changeLanguage(
                    button.dataset.lang
                );

            }
        );

    });


/* =========================================================
   LOAD SAVED LANGUAGE
========================================================= */

const savedLanguage =
    localStorage.getItem("knowme-language")
    || "en";


changeLanguage(savedLanguage);
document.querySelectorAll(".admin-delete-form").forEach((form) => {

    form.addEventListener("submit", (event) => {

        const confirmed = confirm(
            "Delete this message permanently?"
        );

        if (!confirmed) {
            event.preventDefault();
        }

    });

});


/* =========================================================
   KNOWME STUDIO V2
   WHY KNOWME — CINEMATIC EXPERIENCE
   Clean single implementation
========================================================= */

(function () {
    "use strict";

    function initWhyKnowmeIntro() {
        const page = document.querySelector(".why-page");
        const intro = document.getElementById("whyIntro");
        const video = document.getElementById("whyIntroVideo");
        const content = document.getElementById("whyContent");

        if (!page || !intro || !video || !content) {
            return;
        }

        const brandLetters = page.querySelectorAll(".why-brand-letter");
        const brandStudio = page.querySelector(".why-brand-studio");
        const taglineWords = page.querySelectorAll(".why-tagline-word");

        document.body.classList.add("why-intro-active");
        page.classList.add("intro-running");

        video.muted = true;
        video.defaultMuted = true;
        video.autoplay = true;
        video.playsInline = true;
        video.loop = false;
        video.controls = false;

        let finished = false;
        let brandShown = false;
        let taglineShown = false;
        let finishTimer = null;

        function playVideo() {
            video.muted = true;
            const result = video.play();

            if (result && typeof result.catch === "function") {
                result.catch(() => {
                    // Muted autoplay can still be blocked by a browser.
                    // Retry when enough data is available or page becomes visible.
                });
            }
        }

        function revealBrand() {
            if (brandShown || finished) return;
            brandShown = true;

            page.classList.add("intro-brand-visible");

            brandLetters.forEach((letter, index) => {
                window.setTimeout(() => {
                    letter.classList.add("assembled");
                }, index * 105);
            });

            if (brandStudio) {
                window.setTimeout(() => {
                    brandStudio.classList.add("assembled");
                }, brandLetters.length * 105 + 180);
            }
        }

        function revealTagline() {
            if (taglineShown || finished) return;
            taglineShown = true;

            page.classList.add("intro-tagline-visible");

            taglineWords.forEach((word, index) => {
                window.setTimeout(() => {
                    word.classList.add("assembled");
                }, index * 160);
            });
        }

        function finishIntro() {
            if (finished) return;
            finished = true;

            window.clearTimeout(finishTimer);

            page.classList.remove("intro-running");
            page.classList.add("intro-finished");

            document.body.classList.remove("why-intro-active");

            // Never allow the page to remain visually empty.
            content.style.opacity = "1";
            content.style.visibility = "visible";
            content.style.transform = "translateY(0)";

            // Keep the same film gently alive in the background.
            video.loop = true;
            playVideo();
        }

        function getDuration() {
            return Number.isFinite(video.duration) && video.duration > 0
                ? video.duration
                : 30;
        }

        function setupTimeline() {
            const duration = getDuration();
            const ms = duration * 1000;

            // Cinematic timing: video starts immediately, then the red KNOWME letters assemble.
            // The tagline follows, and only then does the page reveal the full Why KNOWME content.
            const brandAt = Math.max(2_400, Math.min(ms * 0.18, ms - 8_500));
            const taglineAt = Math.max(4_600, Math.min(ms * 0.34, ms - 5_500));
            const finishAt = Math.max(8_500, Math.min(ms * 0.46, ms - 900));

            window.setTimeout(revealBrand, brandAt);
            window.setTimeout(revealTagline, taglineAt);

            finishTimer = window.setTimeout(finishIntro, finishAt);
        }

        function progressFallback() {
            if (finished || !video.duration) return;

            const progress = video.currentTime / video.duration;

            if (progress >= 0.42) revealBrand();
            if (progress >= 0.63) revealTagline();
            if (progress >= 0.88) finishIntro();
        }

        // Start the film immediately on first load.
        playVideo();

        video.addEventListener("loadeddata", playVideo, { once: true });
        video.addEventListener("canplay", playVideo);
        video.addEventListener("timeupdate", progressFallback);
        video.addEventListener("ended", finishIntro);

        if (video.readyState >= 1) {
            setupTimeline();
        } else {
            video.addEventListener("loadedmetadata", setupTimeline, { once: true });
        }

        // Hard fallback: even if metadata/timers fail, the page still transitions.
        window.setTimeout(() => {
            if (!finished) {
                revealBrand();
                window.setTimeout(revealTagline, 700);
                window.setTimeout(finishIntro, 1_600);
            }
        }, 15_000);

        window.addEventListener("pageshow", () => {
            if (!finished || video.paused) {
                playVideo();
            }
        });

        document.addEventListener("visibilitychange", () => {
            if (!document.hidden && video.paused) {
                playVideo();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", initWhyKnowmeIntro);
})();
/* =========================================================
   KNOWME AI CHAT
   Homepage only
========================================================= */

(function initKnowmeChat() {

    "use strict";

    const chatForm = document.getElementById("knowmeChatForm");
    const messagesContainer = document.getElementById("knowmeChatMessages");
    const chatInput = document.getElementById("knowmeChatInput");
    const sendButton = document.getElementById("knowmeChatSend");
    const chatStatus = document.getElementById("knowmeChatStatus");
    const chatDock = document.getElementById("knowmeChatDock");
const chatPanel = document.getElementById("knowmeChatPanel");
const chatToggle = document.getElementById("knowmeChatToggle");
const chatClose = document.getElementById("knowmeChatClose");
const chatTurnstile = document.getElementById("knowmeChatTurnstile");
    // This script runs only when the homepage chat exists.
    if (
    !chatForm ||
    !messagesContainer ||
    !chatInput ||
    !sendButton ||
    !chatStatus ||
    !chatDock ||
    !chatPanel ||
    !chatToggle ||
    !chatClose
) {
        return;
    }/* =====================================================
   CHAT STATE AND SECURITY
===================================================== */

const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content") || "";

const conversation = [];

let isSending = false;
    /* =====================================================
   FLOATING CHAT OPEN / CLOSE
===================================================== */

let isPinnedOpen = false;
let hoverCloseTimer = null;

const supportsHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;


// Keep the floating chat inside the actually visible mobile viewport.
// On phones, the virtual keyboard can reduce the Visual Viewport
// without changing the document's layout viewport.
function updateKnowmeChatViewport() {

    const visualViewport = window.visualViewport;
    const viewportHeight = visualViewport
        ? visualViewport.height
        : window.innerHeight;

    const visibleBottom = visualViewport
        ? visualViewport.height + visualViewport.offsetTop
        : window.innerHeight;

    const keyboardInset = Math.max(
        0,
        window.innerHeight - visibleBottom
    );

    document.documentElement.style.setProperty(
        "--knowme-chat-viewport-height",
        `${Math.round(viewportHeight)}px`
    );

    document.documentElement.style.setProperty(
        "--knowme-chat-keyboard-inset",
        `${Math.round(keyboardInset)}px`
    );
}

updateKnowmeChatViewport();
window.addEventListener("resize", updateKnowmeChatViewport, { passive: true });

if (window.visualViewport) {
    window.visualViewport.addEventListener(
        "resize",
        updateKnowmeChatViewport,
        { passive: true }
    );
    window.visualViewport.addEventListener(
        "scroll",
        updateKnowmeChatViewport,
        { passive: true }
    );
}


function setChatPanelOpen(isOpen) {

    chatDock.classList.toggle("is-open", isOpen);

    chatToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    chatPanel.setAttribute(
        "aria-hidden",
        String(!isOpen)
    );

}


function cancelHoverClose() {

    if (hoverCloseTimer !== null) {

        window.clearTimeout(hoverCloseTimer);
        hoverCloseTimer = null;

    }

}


function scheduleHoverClose() {

    if (!supportsHover || isPinnedOpen) {
        return;
    }

    cancelHoverClose();

    hoverCloseTimer = window.setTimeout(function () {

        const focusInside =
            chatDock.contains(document.activeElement);

        const pointerOverButton =
            chatToggle.matches(":hover");

        const pointerOverPanel =
            chatPanel.matches(":hover");

        if (
            !isPinnedOpen &&
            !focusInside &&
            !pointerOverButton &&
            !pointerOverPanel
        ) {
            setChatPanelOpen(false);
        }

    }, 350);

}


// Hover on launcher opens the chat.
if (supportsHover) {

    chatToggle.addEventListener("mouseenter", function () {

        cancelHoverClose();
        setChatPanelOpen(true);

    });

    chatToggle.addEventListener("mouseleave", scheduleHoverClose);


    // Keep it open while moving the mouse into the panel.
    chatPanel.addEventListener("mouseenter", function () {

        cancelHoverClose();
        setChatPanelOpen(true);

    });

    chatPanel.addEventListener("mouseleave", scheduleHoverClose);

}


// Click pins or unpins the chat.
chatToggle.addEventListener("click", function () {

    cancelHoverClose();

    if (isPinnedOpen) {

        isPinnedOpen = false;
        setChatPanelOpen(false);

    } else {

        isPinnedOpen = true;
        setChatPanelOpen(true);

        // Do not open the phone keyboard just because the chat panel opened.
        // On desktop, focus the input for immediate typing as before.
        if (supportsHover) {
            chatInput.focus({ preventScroll: true });
        }

    }

});


// Close button.
chatClose.addEventListener("click", function () {

    cancelHoverClose();

    isPinnedOpen = false;
    setChatPanelOpen(false);

    chatToggle.focus();

});


// Escape key.
document.addEventListener("keydown", function (event) {

    if (
        event.key === "Escape" &&
        chatDock.classList.contains("is-open")
    ) {

        cancelHoverClose();

        isPinnedOpen = false;
        setChatPanelOpen(false);

        chatToggle.focus();

    }

});


// Close when keyboard focus leaves the widget.
chatDock.addEventListener("focusout", function () {

    window.setTimeout(function () {

        if (
            !isPinnedOpen &&
            !chatDock.matches(":hover") &&
            !chatDock.contains(document.activeElement)
        ) {
            setChatPanelOpen(false);
        }

    }, 0);

});


    /* =====================================================
       TRANSLATIONS
    ===================================================== */

    function chatText(key) {

        const translation = getTranslation(
            activeSiteLanguage,
            key
        );

        if (typeof translation === "string") {
            return translation;
        }

        return getTranslation("en", key) || key;
    }


    /* =====================================================
       STATUS
    ===================================================== */

    function setChatStatus(message, type = "") {

        chatStatus.textContent = message;

        chatStatus.classList.remove(
            "is-error",
            "is-loading"
        );

        if (type) {
            chatStatus.classList.add(`is-${type}`);
        }
    }


    /* =====================================================
       SCROLL
    ===================================================== */

    function scrollChatToBottom() {

        messagesContainer.scrollTop =
            messagesContainer.scrollHeight;
    }


    /* =====================================================
       ADD MESSAGE
    ===================================================== */
/* =====================================================
   KNOWME AI — TYPEWRITER RESPONSE ANIMATION
===================================================== */

async function animateAssistantText(element, text) {

    const characters = Array.from(text);

    const textNode = document.createTextNode("");

    element.textContent = "";
    element.appendChild(textNode);

    element.classList.add("is-typing");

    // Adapt speed to response length.
    const speed = characters.length > 500
        ? 7
        : characters.length > 220
            ? 10
            : 15;

    for (let i = 0; i < characters.length; i++) {

        const character = characters[i];

        textNode.appendData(character);

        // Keep the latest answer visible.
        if (i % 4 === 0) {
            scrollChatToBottom();
        }

        let delay = speed;

        // Natural pauses after punctuation.
        if (".!?։".includes(character)) {
            delay += 100;
        } else if (",;:".includes(character)) {
            delay += 45;
        } else if (character === "\n") {
            delay += 70;
        }

        await new Promise(resolve => {
            window.setTimeout(resolve, delay);
        });

    }

    element.classList.remove("is-typing");

    scrollChatToBottom();
}
    function addChatMessage(role, content) {

        const message = document.createElement("div");

        message.className =
            "knowme-ai-message " +
            (role === "user"
                ? "user-message"
                : "assistant-message");


        const avatar = document.createElement("div");

        avatar.className = "knowme-ai-message-avatar";

        avatar.textContent =
            role === "user" ? "U" : "K";


        const messageContent = document.createElement("div");

        messageContent.className =
            "knowme-ai-message-content";


        const label = document.createElement("span");

        label.textContent =
            role === "user"
                ? chatText("chat.you")
                : chatText("chat.assistant");


        const paragraph = document.createElement("p");

        // Use textContent, never innerHTML, for user/provider text.
        // User messages appear immediately.
// Assistant messages use the typewriter animation.
if (role === "assistant") {

    animateAssistantText(paragraph, content);

} else {

    paragraph.textContent = content;

}


        messageContent.appendChild(label);
        messageContent.appendChild(paragraph);

        message.appendChild(avatar);
        message.appendChild(messageContent);

        messagesContainer.appendChild(message);

        scrollChatToBottom();

        return message;
    }


    /* =====================================================
       TYPING INDICATOR
    ===================================================== */

    function addTypingIndicator() {

        const message = document.createElement("div");

        message.className =
            "knowme-ai-message assistant-message";


        const avatar = document.createElement("div");

        avatar.className = "knowme-ai-message-avatar";
        avatar.textContent = "K";


        const content = document.createElement("div");

        content.className = "knowme-ai-message-content";


        const label = document.createElement("span");

        label.textContent = chatText("chat.assistant");


        const typing = document.createElement("div");

        typing.className = "knowme-ai-typing";

        typing.setAttribute("aria-label", chatText("chat.thinking"));


        for (let i = 0; i < 3; i++) {

            const dot = document.createElement("span");

            typing.appendChild(dot);
        }


        content.appendChild(label);
        content.appendChild(typing);

        message.appendChild(avatar);
        message.appendChild(content);

        messagesContainer.appendChild(message);

        scrollChatToBottom();

        return message;
    }


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    async function sendChatMessage(messageText) {

        if (isSending) {
            return;
        }

        const message = messageText.trim();

        if (!message) {
            return;
        }

        if (!csrfToken) {

            setChatStatus(
                chatText("chat.securityError"),
                "error"
            );

            return;
        }

        const turnstileToken = chatTurnstile
            ? (window.getKnowmeTurnstileToken?.(chatTurnstile) || "")
            : "";

        if (chatTurnstile && !turnstileToken) {
            setChatStatus(
                chatText("chat.turnstileRequired"),
                "error"
            );
            return;
        }

        const shouldRestoreInputFocus =
            chatInput === document.activeElement;

        isSending = true;

        sendButton.disabled = true;
        chatInput.disabled = true;

        addChatMessage("user", message);

        conversation.push({
            role: "user",
            content: message
        });

        setChatStatus(
            chatText("chat.thinking"),
            "loading"
        );

        const typingIndicator = addTypingIndicator();


        try {

            const response = await fetch("/api/chat", {

                method: "POST",

                credentials: "same-origin",

                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },

                body: JSON.stringify({
                    messages: conversation.slice(-31),
                    turnstile_token: turnstileToken
                })

            });


            const responseText = await response.text();

let result = null;

try {
    result = responseText
        ? JSON.parse(responseText)
        : null;
} catch (parseError) {

    console.error(
        "[KNOWME AI] Non-JSON response:",
        {
            status: response.status,
            contentType: response.headers.get("content-type")
        }
    );
}


            if (!response.ok) {

    console.error(
        "[KNOWME AI] API HTTP error:",
        response.status
    );

    const apiError = new Error(
        result?.error || `HTTP ${response.status}`
    );
    apiError.code = result?.error_code;
    apiError.retryAfter = Number.isInteger(result?.retry_after)
        ? result.retry_after
        : null;
    throw apiError;
}

if (
    !result ||
    typeof result.reply !== "string" ||
    !result.reply.trim()
) {
    console.error(
        "[KNOWME AI] Invalid API response"
    );

    throw new Error("Invalid AI response");
}


            const reply = result.reply.trim();

            conversation.push({
                role: "assistant",
                content: reply
            });


            // Bound API history while leaving every rendered message in the chat.
            if (conversation.length > 30) {

                conversation.splice(
                    0,
                    conversation.length - 30
                );
            }


            typingIndicator.remove();

            addChatMessage("assistant", reply);

            setChatStatus(
                chatText("chat.hint")
            );


        } catch (error) {

            typingIndicator.remove();

            // Remove the failed user message from API history.
            const lastMessage =
                conversation[conversation.length - 1];

            if (lastMessage && lastMessage.role === "user") {
                conversation.pop();
            }

            console.error(
                "[KNOWME AI] Chat request failed:",
                error
            );

            let statusMessage = chatText("chat.error");

            if (error?.code === "AI_CONTEXT_TOO_LARGE") {
                statusMessage = chatText("chat.contextTooLarge");
            } else if ([
                "AI_REQUEST_TOO_LARGE",
                "AI_MESSAGE_TOO_LARGE",
                "AI_CONVERSATION_TOO_LARGE",
                "AI_TOO_MANY_MESSAGES"
            ].includes(error?.code)) {
                statusMessage = chatText("chat.requestTooLarge");
            } else if (
                error?.code === "AI_QUOTA_TEMPORARY_FAILURE" ||
                error?.code === "AI_PROVIDER_RATE_LIMITED"
            ) {
                statusMessage = chatText("chat.temporarilyBusy");
            } else if (String(error?.code || "").includes("QUOTA_EXCEEDED")) {
                statusMessage = chatText("chat.dailyLimit");
                if (error.retryAfter > 0) {
                    statusMessage += chatText("chat.retryAfter")
                        .replace("{minutes}", String(Math.ceil(error.retryAfter / 60)));
                }
            } else if (error?.code === "AI_RATE_LIMITED") {
                statusMessage = chatText("chat.rateLimited");
            }

            setChatStatus(
                statusMessage,
                "error"
            );

        } finally {

            if (chatTurnstile) {
                window.resetKnowmeTurnstile?.(chatTurnstile);
            }

            isSending = false;

            sendButton.disabled = false;
            chatInput.disabled = false;

            if (shouldRestoreInputFocus) {
                chatInput.focus({ preventScroll: true });
            }

        }
    }


    /* =====================================================
       FORM SUBMISSION
    ===================================================== */

    chatForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const message = chatInput.value.trim();

        if (!message || isSending) {
            return;
        }

        chatInput.value = "";
        chatInput.style.height = "auto";

        sendChatMessage(message);

    });


    /* =====================================================
       TEXTAREA AUTO RESIZE
    ===================================================== */

    chatInput.addEventListener("input", function () {

        chatInput.style.height = "auto";

        chatInput.style.height =
            Math.min(chatInput.scrollHeight, 140) + "px";

    });


    /* =====================================================
       ENTER TO SEND
       SHIFT + ENTER = NEW LINE
    ===================================================== */

    chatInput.addEventListener("keydown", function (event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.isComposing
        ) {

            event.preventDefault();

            chatForm.requestSubmit();
        }

    });


    /* =====================================================
       INITIAL STATUS
    ===================================================== */

    setChatStatus(
        chatText("chat.hint")
    );

})();


/* =========================================================
   START PROJECT — MULTI-STEP WIZARD
========================================================= */

(function initStartProjectWizard() {
    "use strict";

    const form = document.getElementById("startProjectForm");
    if (!form) return;

    // Restore previously submitted choices after server-side validation errors.
    // Keeping Jinja expressions inside quoted data attributes also preserves valid HTML syntax in IDE inspections.
    form.querySelectorAll("[data-sp-initial-checked]").forEach((input) => {
        input.checked = input.dataset.spInitialChecked === "true";
        input.removeAttribute("data-sp-initial-checked");
    });

    const panels = Array.from(form.querySelectorAll("[data-step-panel]"));
    const indicators = Array.from(form.querySelectorAll("[data-step-indicator]"));
    const progressBar = document.getElementById("spProgressBar");
    const stepNumber = document.getElementById("spStepNumber");
    const currentTitle = document.getElementById("spCurrentTitle");
    const previousButton = document.getElementById("spPrevButton");
    const nextButton = document.getElementById("spNextButton");
    const submitButton = document.getElementById("spSubmitButton");
    const validationMessage = document.getElementById("spValidationMessage");
    const summaryContent = document.getElementById("spSummaryContent");
    const fallbackSubmit = form.querySelector(".sp-nojs-submit");

    if (!panels.length || !previousButton || !nextButton || !submitButton) return;

    const titleKeys = [
        "startProject.step1Title",
        "startProject.step2Title",
        "startProject.step3Title",
        "startProject.step4Title"
    ];
    const validationKeys = [
        "startProject.validationRequired",
        "startProject.validationRequired",
        "startProject.validationPages",
        "startProject.validationContact"
    ];

    let currentStep = 0;
    form.classList.add("sp-wizard-ready");
    if (fallbackSubmit) fallbackSubmit.hidden = true;

    function wizardText(key, fallback) {
        const language = document.documentElement.lang || "en";
        return getTranslation(language, key)
            || getTranslation("en", key)
            || fallback;
    }

    function setMessage(message) {
        validationMessage.textContent = message || "";
        validationMessage.classList.toggle("is-visible", Boolean(message));
    }

    function selectedValue(name) {
        const selected = form.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : "";
    }

    function validateStep(index) {
        setMessage("");

        if (index === 0) {
            if (!selectedValue("website_type") || !selectedValue("website_goal")) {
                setMessage(wizardText(validationKeys[index], "Complete the required selections."));
                return false;
            }
        }

        if (index === 1) {
            if (!selectedValue("design_style") || !selectedValue("pages_scope")) {
                setMessage(wizardText(validationKeys[index], "Complete the required selections."));
                return false;
            }
        }

        if (index === 2) {
            if (!form.querySelector('input[name="required_pages"]:checked')) {
                setMessage(wizardText("startProject.validationPages", "Choose at least one page or section."));
                return false;
            }
            if (!selectedValue("budget") || !selectedValue("deadline")) {
                setMessage(wizardText("startProject.validationRequired", "Complete the required selections."));
                return false;
            }
        }

        if (index === 3) {
            const name = form.elements.full_name;
            const email = form.elements.email;
            const description = form.elements.description;
            const consent = form.querySelector('input[name="consent"]');

            if (!name.value.trim() || !email.value.trim() || !description.value.trim() || !consent.checked) {
                setMessage(wizardText("startProject.validationContact", "Complete your contact details and project description."));
                return false;
            }

            if (!email.checkValidity()) {
                setMessage(wizardText("startProject.validationEmail", "Enter a valid email address."));
                email.focus({ preventScroll: true });
                return false;
            }

            const referenceInput = form.elements.reference_url;
            if (referenceInput && referenceInput.value.trim()) {
                try {
                    const reference = new URL(referenceInput.value.trim());
                    if (!['http:', 'https:'].includes(reference.protocol)) throw new Error('Invalid protocol');
                } catch (error) {
                    setMessage(wizardText("startProject.validationReference", "Use a valid http or https reference link."));
                    referenceInput.focus({ preventScroll: true });
                    return false;
                }
            }

            if (description.value.trim().length < 20 || description.value.length > 3000) {
                setMessage(wizardText("startProject.descriptionHint", "Description must contain 20 to 3,000 characters."));
                description.focus({ preventScroll: true });
                return false;
            }
        }

        return true;
    }

    function showStep(index, shouldScroll = true) {
        currentStep = Math.max(0, Math.min(index, panels.length - 1));

        panels.forEach((panel, panelIndex) => {
            const active = panelIndex === currentStep;
            panel.classList.toggle("is-active", active);
            panel.hidden = !active;
        });

        indicators.forEach((indicator, indicatorIndex) => {
            indicator.classList.toggle("is-active", indicatorIndex === currentStep);
            indicator.classList.toggle("is-complete", indicatorIndex < currentStep);
            if (indicatorIndex === currentStep) {
                indicator.setAttribute("aria-current", "step");
            } else {
                indicator.removeAttribute("aria-current");
            }
        });

        if (stepNumber) stepNumber.textContent = String(currentStep + 1).padStart(2, "0");
        if (progressBar) progressBar.style.width = `${((currentStep + 1) / panels.length) * 100}%`;
        if (currentTitle) currentTitle.textContent = wizardText(titleKeys[currentStep], "Project details");

        if (currentStep === 3) {
            const turnstileContainer = form.querySelector("[data-turnstile-container]");
            if (turnstileContainer) window.renderKnowmeTurnstile?.(turnstileContainer);
        }

        previousButton.hidden = currentStep === 0;
        nextButton.hidden = currentStep === panels.length - 1;
        submitButton.hidden = currentStep !== panels.length - 1;
        setMessage("");
        updateSummary();

        const card = form.closest(".sp-form-card");
        if (shouldScroll && card) {
            // Keep the wizard below the fixed navigation instead of hiding its heading behind it.
            const topbar = document.querySelector(".topbar");
            const topbarHeight = topbar ? topbar.getBoundingClientRect().height : 0;
            const targetTop = card.getBoundingClientRect().top + window.scrollY - topbarHeight - 22;
            window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        }
    }

    function labelsFor(name) {
        return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => {
            if (input.dataset.spModelTitle) return input.dataset.spModelTitle;
            const label = input.closest("label");
            if (!label) return input.value;
            const visibleText = label.querySelector("strong, span[data-i18n]");
            return (visibleText ? visibleText.textContent : label.innerText).replace(/\s+/g, " ").trim();
        });
    }

    function updateSummary() {
        const selectedModelCount = form.querySelectorAll('input[name="selected_3d_models"]:checked').length;
        const assetCount = form.querySelector("[data-sp-asset-count]");
        if (assetCount) {
            const countLabel = wizardText("startProject.modelsSelected", "selected");
            assetCount.textContent = `${selectedModelCount} ${countLabel}`;
        }
        if (!summaryContent) return;
        const values = [
            ...labelsFor("website_type"),
            ...labelsFor("website_goal"),
            ...labelsFor("design_style"),
            ...labelsFor("pages_scope"),
            ...labelsFor("required_pages"),
            ...labelsFor("features"),
            ...labelsFor("selected_3d_models"),
            ...labelsFor("budget"),
            ...labelsFor("deadline")
        ].filter(Boolean);

        const uniqueValues = Array.from(new Set(values));
        if (!uniqueValues.length) {
            summaryContent.textContent = wizardText("startProject.summaryEmpty", "Your selections will appear here.");
            return;
        }

        summaryContent.replaceChildren();
        uniqueValues.forEach((value) => {
            const chip = document.createElement("span");
            chip.className = "sp-summary-chip";
            chip.textContent = value;
            summaryContent.appendChild(chip);
        });
    }

    previousButton.addEventListener("click", () => showStep(currentStep - 1));

    nextButton.addEventListener("click", () => {
        if (validateStep(currentStep)) showStep(currentStep + 1);
    });

    form.addEventListener("change", updateSummary);
    form.addEventListener("input", updateSummary);
    document.addEventListener("knowme:languagechange", () => {
        if (currentTitle) currentTitle.textContent = wizardText(titleKeys[currentStep], "Project details");
        updateSummary();
    });

    form.addEventListener("submit", (event) => {
        if (currentStep !== panels.length - 1) {
            event.preventDefault();
            while (currentStep < panels.length - 1) {
                if (!validateStep(currentStep)) return;
                currentStep += 1;
            }
            showStep(currentStep);
            return;
        }

        if (!validateStep(currentStep)) {
            event.preventDefault();
        }
    });

    // Reveal effects only enhance presentation; the form remains usable if observers are unavailable.
    const revealItems = document.querySelectorAll(".sp-reveal");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-revealed"));
    }

    // Do not auto-scroll to the form on page load; let the complete hero heading remain visible.
    showStep(0, false);
    updateSummary();
})();


/* =========================================================
   START PROJECT — INTERACTIVE NEON POINTER LIGHT
   Decorative only; uses one animation frame at a time.
========================================================= */

(function initStartProjectPointerLight() {
    "use strict";

    const page = document.querySelector(".start-project-page");
    const atmosphere = page?.querySelector(".sp-neon-atmosphere");
    if (!page || !atmosphere) return;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false;
    if (reducedMotion || !finePointer) return;

    let frameId = 0;
    let currentX = window.innerWidth * 0.5;
    let currentY = window.innerHeight * 0.42;
    let targetX = currentX;
    let targetY = currentY;
    let currentOpacity = 0;
    let targetOpacity = 0;

    function animatePointerLight() {
        frameId = 0;
        currentX += (targetX - currentX) * 0.14;
        currentY += (targetY - currentY) * 0.14;
        currentOpacity += (targetOpacity - currentOpacity) * 0.12;

        const bounds = atmosphere.getBoundingClientRect();
        atmosphere.style.setProperty("--sp-pointer-x", `${currentX - bounds.left}px`);
        atmosphere.style.setProperty("--sp-pointer-y", `${currentY - bounds.top}px`);
        atmosphere.style.setProperty("--sp-pointer-opacity", currentOpacity.toFixed(3));

        const stillMoving = Math.abs(targetX - currentX) > 0.7
            || Math.abs(targetY - currentY) > 0.7
            || Math.abs(targetOpacity - currentOpacity) > 0.01;

        if (stillMoving) frameId = window.requestAnimationFrame(animatePointerLight);
    }

    page.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") return;
        targetX = event.clientX;
        targetY = event.clientY;
        targetOpacity = 1;
        if (!frameId) frameId = window.requestAnimationFrame(animatePointerLight);
    }, { passive: true });

    page.addEventListener("pointerleave", () => {
        targetOpacity = 0;
        if (!frameId) frameId = window.requestAnimationFrame(animatePointerLight);
    }, { passive: true });

    window.addEventListener("blur", () => {
        targetOpacity = 0;
        if (!frameId) frameId = window.requestAnimationFrame(animatePointerLight);
    });
})();

/* =========================================================
   START PROJECT — LIVE MOBILE HEADER OFFSET
   Measures the two-row fixed navigation on phones so the
   configurator never starts underneath the header.
========================================================= */

(function syncStartProjectHeaderOffset() {
    "use strict";

    const page = document.querySelector(".start-project-page");
    const topbar = document.querySelector(".topbar");
    if (!page || !topbar) return;

    const updateOffset = () => {
        const height = Math.ceil(topbar.getBoundingClientRect().height);
        page.style.setProperty("--sp-topbar-height", `${height}px`);
    };

    updateOffset();

    if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(updateOffset);
        observer.observe(topbar);
        window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
    }

    window.addEventListener("resize", updateOffset, { passive: true });

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", updateOffset, { passive: true });
    }
})();

