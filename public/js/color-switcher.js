// Переключатель цветовых схем для сайта школы

(function() {
    class ColorSchemeSwitcher {
        constructor() {
            this.schemes = [
                'default',
                'warm',
                'professional', 
                'nature',
                'elegant',
                'minimal',
                'energetic',
                'ocean'
            ];
            
            this.currentScheme = 'default';
            this.init();
        }
        
        init() {
            // Загружаем сохраненную схему из localStorage
            const savedScheme = localStorage.getItem('colorScheme');
            if (savedScheme && this.schemes.includes(savedScheme)) {
                this.setScheme(savedScheme);
            }
            
            // Создаем переключатель в DOM
            this.createSwitcher();
        }
        
        createSwitcher() {
            // Создаем контейнер для переключателя
            const switcherContainer = document.createElement('div');
            switcherContainer.className = 'color-scheme-switcher';
            switcherContainer.innerHTML = `
                <div class="switcher-arrow">
                    <span class="arrow-icon">▶</span>
                </div>
                <div class="switcher-dropdown">
                    <div class="scheme-option" data-scheme="default">
                        <div class="scheme-preview default-preview"></div>
                        <span>По умолчанию</span>
                    </div>
                    <div class="scheme-option" data-scheme="warm">
                        <div class="scheme-preview warm-preview"></div>
                        <span>Теплая</span>
                    </div>
                    <div class="scheme-option" data-scheme="professional">
                        <div class="scheme-preview professional-preview"></div>
                        <span>Профессиональная</span>
                    </div>
                    <div class="scheme-option" data-scheme="nature">
                        <div class="scheme-preview nature-preview"></div>
                        <span>Природная</span>
                    </div>
                    <div class="scheme-option" data-scheme="elegant">
                        <div class="scheme-preview elegant-preview"></div>
                        <span>Элегантная</span>
                    </div>
                    <div class="scheme-option" data-scheme="minimal">
                        <div class="scheme-preview minimal-preview"></div>
                        <span>Минималистичная</span>
                    </div>
                    <div class="scheme-option" data-scheme="energetic">
                        <div class="scheme-preview energetic-preview"></div>
                        <span>Энергичная</span>
                    </div>
                    <div class="scheme-option" data-scheme="ocean">
                        <div class="scheme-preview ocean-preview"></div>
                        <span>Океанская</span>
                    </div>

                </div>
            `;
            
            // Добавляем стили
            this.addSwitcherStyles();
            
            // Добавляем в DOM (в левый верхний угол)
            document.body.appendChild(switcherContainer);
            
            // Добавляем обработчики событий
            this.addEventListeners(switcherContainer);
        }
        
        addSwitcherStyles() {
            const styles = `
                .color-scheme-switcher {
                    position: fixed;
                    top: 120px;
                    left: 15px;
                    z-index: 1001;
                    font-family: 'Inter', sans-serif;
                }
                
                .switcher-arrow {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(229, 231, 235, 0.6);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                    opacity: 0.7;
                }
                
                .switcher-arrow:hover {
                    background: rgba(255, 255, 255, 0.95);
                    border-color: rgba(229, 231, 235, 0.8);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    opacity: 1;
                    transform: scale(1.1);
                }
                
                .arrow-icon {
                    font-size: 12px;
                    color: #6b7280;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }
                
                .switcher-arrow:hover .arrow-icon {
                    color: #374151;
                    transform: translateX(2px);
                }
                
                .switcher-dropdown {
                    position: absolute;
                    top: 0;
                    left: 100%;
                    margin-left: 8px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateX(-10px);
                    transition: all 0.3s ease;
                    min-width: 200px;
                }
                
                .color-scheme-switcher .switcher-dropdown.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translateX(0);
                }
                
                .scheme-option {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                
                .scheme-option:hover {
                    background-color: #f9fafb;
                }
                
                .scheme-option.active {
                    background-color: #eff6ff;
                    color: #2563eb;
                }
                
                .scheme-preview {
                    width: 24px;
                    height: 24px;
                    border-radius: 4px;
                    border: 2px solid #e5e7eb;
                }
                
                .default-preview {
                    background: linear-gradient(135deg, #2563eb, #059669);
                }
                
                .warm-preview {
                    background: linear-gradient(135deg, #f97316, #a16207);
                }
                
                .professional-preview {
                    background: linear-gradient(135deg, #1e40af, #64748b);
                }
                
                .nature-preview {
                    background: linear-gradient(135deg, #059669, #65a30d);
                }
                
                .elegant-preview {
                    background: linear-gradient(135deg, #7c3aed, #ec4899);
                }
                
                .minimal-preview {
                    background: linear-gradient(135deg, #374151, #9ca3af);
                }
                
                .energetic-preview {
                    background: linear-gradient(135deg, #dc2626, #f97316);
                }
                
                .ocean-preview {
                    background: linear-gradient(135deg, #0891b2, #0ea5e9);
                }
                

                
                @media (max-width: 768px) {
                    .color-scheme-switcher {
                        top: 100px;
                        left: 10px;
                    }
                    
                    .switcher-arrow {
                        width: 28px;
                        height: 28px;
                    }
                    
                    .arrow-icon {
                        font-size: 10px;
                    }
                    
                    .switcher-dropdown {
                        left: 100%;
                        margin-left: 5px;
                    }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        addEventListeners(container) {
            const arrow = container.querySelector('.switcher-arrow');
            const dropdown = container.querySelector('.switcher-dropdown');
            const options = container.querySelectorAll('.scheme-option');
            
            // Обработчик для стрелки - открытие/закрытие меню
            arrow.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            
            // Обработчики для опций схем
            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const scheme = option.dataset.scheme;
                    this.setScheme(scheme);
                    
                    // Обновляем активный класс
                    options.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                    
                    // Закрываем dropdown после выбора
                    dropdown.classList.remove('show');
                });
            });
            
            // Закрываем dropdown при клике вне контейнера
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
            
            // Предотвращаем закрытие при клике внутри dropdown
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        setScheme(scheme) {
            // Удаляем все классы цветовых схем
            document.body.classList.remove(...this.schemes.map(s => `color-scheme-${s}`));
            
            if (scheme !== 'default') {
                // Добавляем новый класс схемы
                document.body.classList.add(`color-scheme-${scheme}`);
            }
            
            this.currentScheme = scheme;
            
            // Сохраняем в localStorage
            localStorage.setItem('colorScheme', scheme);
            
            // Показываем уведомление
            this.showNotification(`Применена ${this.getSchemeName(scheme)} схема`);
        }
        
        getSchemeName(scheme) {
            const names = {
                'default': 'стандартная',
                'warm': 'теплая',
                'professional': 'профессиональная',
                'nature': 'природная',
                'elegant': 'элегантная',
                'minimal': 'минималистичная',
                'energetic': 'энергичная',
                'ocean': 'океанская',

            };
            
            return names[scheme] || scheme;
        }
        
        showNotification(message) {
            // Создаем уведомление
            const notification = document.createElement('div');
            notification.className = 'color-scheme-notification';
            notification.textContent = message;
            
            // Добавляем стили для уведомления
            const notificationStyles = `
                .color-scheme-notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #10b981;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    z-index: 1002;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .color-scheme-notification.show {
                    transform: translateX(0);
                }
            `;
            
            // Добавляем стили, если их еще нет
            if (!document.querySelector('#notification-styles')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'notification-styles';
                styleSheet.textContent = notificationStyles;
                document.head.appendChild(styleSheet);
            }
            
            document.body.appendChild(notification);
            
            // Показываем уведомление
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);
            
            // Скрываем через 3 секунды
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
    }

    // Инициализируем переключатель при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
        new ColorSchemeSwitcher();
    });
})();

