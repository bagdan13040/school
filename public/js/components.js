// JavaScript компоненты для сайта школы
// Здесь будут интерактивные компоненты

// Компонент слайдера
class Slider {
    constructor(selector) {
        this.root = typeof selector === 'string' ? document.querySelector(selector) : selector;
        this.track = this.root ? this.root.querySelector('.carousel__track') : null;
        this.prevButton = this.root ? this.root.querySelector('.carousel__control--prev') : null;
        this.nextButton = this.root ? this.root.querySelector('.carousel__control--next') : null;
        this.slides = this.root ? Array.from(this.root.querySelectorAll('.carousel__slide')) : [];
        this.currentIndex = 0;
        this.slideCount = this.slides.length;
        this.isVertical = !!(this.root && (this.root.dataset.direction === 'vertical' || this.root.classList.contains('is-vertical')));

        if (this.root && this.track && this.slideCount > 0) {
            this.bindEvents();
            this.update();
        }
    }

    bindEvents() {
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prev());
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.next());
        }
        this.root.addEventListener('keydown', (e) => {
            if (this.isVertical) {
                if (e.key === 'ArrowUp') this.prev();
                if (e.key === 'ArrowDown') this.next();
            } else {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            }
        });
    }

    prev() {
        if (this.slideCount === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        this.update();
    }

    next() {
        if (this.slideCount === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.slideCount;
        this.update();
    }

    update() {
        const offsetPercent = -(this.currentIndex * 100);
        if (this.isVertical) {
            this.track.style.transform = 'translateY(' + offsetPercent + '%)';
        } else {
            this.track.style.transform = 'translateX(' + offsetPercent + '%)';
        }
    }
}

// Компонент модального окна
class Modal {
    constructor(selector) {
        // Заготовка под модальное окно
        this.selector = selector;
    }
}

// Компонент галереи
class Gallery {
    constructor(selector) {
        // Заготовка под галерею
        this.selector = selector;
    }
}

// Инициализация каруселей на страницах (если присутствуют)
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const carousels = Array.from(document.querySelectorAll('.carousel'));
        carousels.forEach(function(carousel) {
            carousel.setAttribute('tabindex', '0');
            new Slider(carousel);
        });
    });
})();

// Инициализация выпадающего меню
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        initDropdownMenu();
    });

    function initDropdownMenu() {
        const dropdownItems = document.querySelectorAll('.nav-item--dropdown');
        
        dropdownItems.forEach(function(dropdown) {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            const dropdownLink = dropdown.querySelector('.nav-link--dropdown');
            
            // // Показать меню при клике
            // dropdownLink.addEventListener('click', function(e) {
            //     e.preventDefault();
            //     toggleDropdown(dropdown);
            // });
            
            // Скрыть меню при клике вне его
            // document.addEventListener('click', function(e) {
            //     if (!dropdown.contains(e.target)) {
            //         hideDropdown(dropdown);
            //     }
            // });
            
            // Управление с клавиатуры
            dropdownLink.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleDropdown(dropdown);
                }
            });
        });
    }
    
    function toggleDropdown(dropdown) {
        const isVisible = dropdown.classList.contains('dropdown--visible');
        if (isVisible) {
            hideDropdown(dropdown);
        } else {
            showDropdown(dropdown);
        }
    }
    
    function showDropdown(dropdown) {
        // Скрыть все другие открытые меню
        document.querySelectorAll('.dropdown--visible').forEach(function(openDropdown) {
            if (openDropdown !== dropdown) {
                hideDropdown(openDropdown);
            }
        });
        
        dropdown.classList.add('dropdown--visible');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        dropdownMenu.style.opacity = '1';
        dropdownMenu.style.visibility = 'visible';
        dropdownMenu.style.transform = 'translateY(0)';
    }
    
    function hideDropdown(dropdown) {
        dropdown.classList.remove('dropdown--visible');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        dropdownMenu.style.opacity = '0';
        dropdownMenu.style.visibility = 'hidden';
        dropdownMenu.style.transform = 'translateY(-10px)';
    }
})();

// Здесь будут дополнительные компоненты


