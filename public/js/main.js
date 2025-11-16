// Основной JavaScript файл для сайта школы
// Минималистичная интерактивность

// Функция инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт школы загружен');
    
    // Инициализация компонентов
    initHeader();
    initScrollIndicator();
    initLanguageSwitcher();
    initMobileNav();
    initMobileAccordion();
});

// Инициализация хедера
function initHeader() {
    const header = document.querySelector('.header');
    
    // Изменение прозрачности хедера при прокрутке
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(51, 51, 51, 0.98)';
        } else {
            header.style.background = 'rgba(51, 51, 51, 0.95)';
        }
    });
}

// Инициализация индикатора прокрутки
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Плавная прокрутка к следующей секции
            const mainSection = document.querySelector('.main');
            if (mainSection) {
                mainSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Инициализация переключателя языков
function initLanguageSwitcher() {
    const langItems = document.querySelectorAll('.lang-item');
    
    langItems.forEach(item => {
        item.addEventListener('click', function() {
            // Убираем активный класс у всех элементов
            langItems.forEach(lang => lang.classList.remove('active'));
            // Добавляем активный класс к выбранному элементу
            this.classList.add('active');
        });
    });
}

// Плавная прокрутка для всех внутренних ссылок
document.addEventListener('DOMContentLoaded', function() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Анимация появления элементов при прокрутке
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами, которые должны анимироваться
    const animatedElements = document.querySelectorAll('.card, .section__title, .section__subtitle');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Инициализация анимаций при загрузке
window.addEventListener('load', function() {
    initScrollAnimations();
});

// Мобильное меню
function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.header__nav[data-mobile-collapsible]');
    if (!toggle || !nav) return;
    // Start collapsed on small screens
    if (window.matchMedia('(max-width: 768px)').matches) {
        nav.setAttribute('data-collapsed', 'true');
    }
    toggle.addEventListener('click', () => {
        const collapsed = nav.getAttribute('data-collapsed') === 'true';
        nav.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
        toggle.classList.toggle('is-active', collapsed);
        toggle.setAttribute('aria-expanded', collapsed ? 'true' : 'false');
    });
    // Close menu when clicking a link (mobile only)
    // Do NOT collapse when the click occurs inside a dropdown (trigger or its submenu)
    nav.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor) return;
        if (!window.matchMedia('(max-width: 768px)').matches) return;

        // If click is inside a dropdown item or on the dropdown trigger, keep menu open
        const dropdownAncestor = anchor.closest('.nav-item--dropdown');
        if (dropdownAncestor) {
            return; // do not collapse
        }

        // If href is a placeholder, don't collapse
        const href = anchor.getAttribute('href');
        if (!href || href === '#' || href.startsWith('javascript:')) return;

        // Otherwise collapse the mobile nav
        nav.setAttribute('data-collapsed', 'true');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
    });
    // Handle resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            nav.removeAttribute('data-collapsed');
            toggle.classList.remove('is-active');
            toggle.setAttribute('aria-expanded', 'false');
        } else {
            if (!nav.hasAttribute('data-collapsed')) {
                nav.setAttribute('data-collapsed', 'true');
            }
        }
    });

    // Close menu when clicking outside the navigation (mobile only)
    document.addEventListener('click', (e) => {
        if (!window.matchMedia('(max-width: 768px)').matches) return;
        // if already collapsed, nothing to do
        const isCollapsed = nav.getAttribute('data-collapsed') === 'true';
        if (isCollapsed) return;
        // ignore clicks inside the nav or on the toggle button
        if (e.target.closest('.header__nav') || e.target.closest('.nav-toggle')) return;
        // otherwise collapse
        nav.setAttribute('data-collapsed', 'true');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
    });
}

// Аккордеон для мобильных подменю
function initMobileAccordion() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const dropdownItems = document.querySelectorAll('.nav-item--dropdown');
    if (!dropdownItems.length) return;

    function bind() {
        dropdownItems.forEach(item => {
            const trigger = item.querySelector('.nav-link--dropdown');
            if (!trigger) return;
            trigger.addEventListener('click', (e) => {
                if (!mediaQuery.matches) return; // desktop ignore
                e.preventDefault();
                const isOpen = item.classList.contains('is-open');
                // close others
                dropdownItems.forEach(i => i.classList.remove('is-open'));
                if (!isOpen) item.classList.add('is-open');
            });
        });
    }

    bind();

    // Reset state on resize to desktop
    window.addEventListener('resize', () => {
        if (!mediaQuery.matches) {
            dropdownItems.forEach(i => i.classList.remove('is-open'));
        }
    });
}
