/*
 * LinkedIn Portfolio - Professional JavaScript
 * Optimized for performance and user experience
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        resumeUrl: "https://docs.google.com/gview?url=https://raw.githubusercontent.com/m1010nish/About-Me/main/Data_Resume_Manish.pdf&embedded=false",
        socialLinks: {
            linkedin: "https://linkedin.com/in/m1010nish",
            github: "https://github.com/m1010nish",
            email: "mailto:manishsinghjnv11@gmail.com"
        },
        animations: {
            duration: 300,
            easing: 'ease-in-out'
        }
    };

    // Utility Functions
    const Utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle(func, limit) {
            let inThrottle;
            return function () {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        $(selector, context = document) {
            return context.querySelector(selector);
        },

        $$(selector, context = document) {
            return context.querySelectorAll(selector);
        },

        on(element, event, handler, options = {}) {
            if (element && typeof handler === 'function') {
                element.addEventListener(event, handler, options);
            }
        },

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // Navigation Management
    const Navigation = {
        init() {
            this.bindEvents();
            this.setActiveNav();
        },

        bindEvents() {
            Utils.$$('.nav-menu a').forEach(link => {
                Utils.on(link, 'click', (e) => {
                    e.preventDefault();
                    this.handleNavClick(link);
                });
            });
        },

        handleNavClick(clickedLink) {
            Utils.$$('.nav-menu a').forEach(link => link.classList.remove('active'));
            clickedLink.classList.add('active');

            const page = clickedLink.textContent.toLowerCase();
            if (page !== 'home') {
                this.navigateToPage(page);
            }
        },

        navigateToPage(page) {
            // In a real implementation, this would navigate to different pages
            window.location.href = `${page}.html`;
        },

        setActiveNav() {
            const currentPage = window.location.hash.substring(1) || 'home';
            const navLink = Utils.$(`[href="#${currentPage}"]`);
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    };

    // Tab Management
    const TabManager = {
        currentTab: 'projects',

        init() {
            this.bindEvents();
            this.showTab(this.currentTab);
        },

        bindEvents() {
            Utils.$$('.tab-btn').forEach(btn => {
                Utils.on(btn, 'click', (e) => {
                    e.preventDefault();
                    const tabName = btn.textContent.toLowerCase();
                    this.switchTab(tabName, btn);
                });
            });
        },

        switchTab(tabName, clickedBtn) {
            if (this.currentTab === tabName) return;

            // Update button states
            Utils.$$('.tab-btn').forEach(btn => btn.classList.remove('active'));
            clickedBtn.classList.add('active');

            // Switch content
            Utils.$$('.content-section').forEach(section => section.classList.remove('active'));
            const newContent = Utils.$(`#${tabName}-content`);
            if (newContent) {
                newContent.classList.add('active');
            }

            this.currentTab = tabName;
        },

        showTab(tabName) {
            const content = Utils.$(`#${tabName}-content`);
            if (content) {
                content.classList.add('active');
            }
        }
    };

    // Project Filtering Management
    const ProjectFilter = {
        filterButtons: [],
        projectCards: [],
        projectsCount: null,
        currentFilter: 'all',

        init() {
            this.filterButtons = Utils.$$('.filter-btn');
            this.projectCards = Utils.$$('.project-card-large, .project-card');
            this.projectsCount = Utils.$('#projects-count');
            
            if (this.filterButtons.length > 0) {
                this.bindFilterEvents();
                this.initializeCount();
            }
            
            this.initLoadMore();
            this.initSearch();
        },

        bindFilterEvents() {
            this.filterButtons.forEach(button => {
                Utils.on(button, 'click', (e) => {
                    e.preventDefault();
                    this.handleFilterClick(button);
                });
            });
        },

        handleFilterClick(clickedButton) {
            // Remove active class from all buttons
            this.filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            clickedButton.classList.add('active');

            const filter = clickedButton.dataset.filter;
            this.currentFilter = filter;
            let visibleCount = 0;

            this.projectCards.forEach(card => {
                const categories = card.dataset.category ? card.dataset.category.split(' ') : ['all'];
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    card.classList.add('show');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('show');
                }
            });

            this.updateProjectsCount(visibleCount);
        },

        updateProjectsCount(count) {
            if (this.projectsCount) {
                this.projectsCount.textContent = count;
            }
        },

        initializeCount() {
            const visibleCards = this.projectCards.length;
            this.updateProjectsCount(visibleCards);
        },

        initLoadMore() {
            const loadMoreBtn = Utils.$('#load-more');
            if (loadMoreBtn) {
                Utils.on(loadMoreBtn, 'click', () => {
                    this.handleLoadMore(loadMoreBtn);
                });
            }
        },

        handleLoadMore(button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i> All Projects Loaded';
                button.style.opacity = '0.6';
            }, 1000);
        },

        initSearch() {
            const searchInput = Utils.$('#project-search, .project-search');
            if (searchInput) {
                const debouncedSearch = Utils.debounce((query) => {
                    this.searchProjects(query);
                }, 300);

                Utils.on(searchInput, 'input', (e) => {
                    debouncedSearch(e.target.value);
                });
            }
        },

        searchProjects(query) {
            const searchTerm = query.toLowerCase().trim();
            let visibleCount = 0;

            this.projectCards.forEach(card => {
                const titleElement = card.querySelector('h3, h4, .project-title');
                const descElement = card.querySelector('p, .project-description');
                const techElements = card.querySelectorAll('.tech-tag, .tech-item');

                const title = titleElement ? titleElement.textContent.toLowerCase() : '';
                const description = descElement ? descElement.textContent.toLowerCase() : '';
                const technologies = Array.from(techElements)
                    .map(tag => tag.textContent.toLowerCase()).join(' ');

                const matchesSearch = !searchTerm || 
                    title.includes(searchTerm) || 
                    description.includes(searchTerm) || 
                    technologies.includes(searchTerm);

                const matchesFilter = this.currentFilter === 'all' || 
                    (card.dataset.category && card.dataset.category.split(' ').includes(this.currentFilter));

                if (matchesSearch && matchesFilter) {
                    card.classList.remove('hidden');
                    card.classList.add('show');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('show');
                }
            });

            this.updateProjectsCount(visibleCount);
        }
    };

    // Contact Modal Management
    const ContactModal = {
        modal: null,
        isOpen: false,

        init() {
            this.modal = Utils.$('#contactModal');
            this.bindEvents();
        },

        bindEvents() {
            // Message button
            const messageBtn = Utils.$('.btn-secondary');
            if (messageBtn && messageBtn.textContent.includes('Message')) {
                Utils.on(messageBtn, 'click', (e) => {
                    e.preventDefault();
                    this.show();
                });
            }

            // Close button
            const closeBtn = Utils.$('.close-btn');
            Utils.on(closeBtn, 'click', () => this.hide());

            // Close on backdrop click
            Utils.on(this.modal, 'click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });

            // Close on escape key
            Utils.on(document, 'keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.hide();
                }
            });

            this.bindSocialLinks();
        },

        bindSocialLinks() {
            const links = {
                linkedin: Utils.$('.social-link[href*="linkedin"]'),
                github: Utils.$('.social-link[href*="github"]'),
                email: Utils.$('.social-link[href*="mailto"]')
            };

            if (links.linkedin) {
                links.linkedin.href = CONFIG.socialLinks.linkedin;
                Utils.on(links.linkedin, 'click', (e) => {
                    e.preventDefault();
                    window.open(CONFIG.socialLinks.linkedin, '_blank', 'noopener,noreferrer');
                });
            }

            if (links.github) {
                links.github.href = CONFIG.socialLinks.github;
                Utils.on(links.github, 'click', (e) => {
                    e.preventDefault();
                    window.open(CONFIG.socialLinks.github, '_blank', 'noopener,noreferrer');
                });
            }

            if (links.email) {
                links.email.href = CONFIG.socialLinks.email;
            }
        },

        show() {
            if (this.isOpen) return;

            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            requestAnimationFrame(() => {
                this.modal.style.opacity = '1';
            });

            this.isOpen = true;
        },

        hide() {
            if (!this.isOpen) return;

            this.modal.style.opacity = '0';
            setTimeout(() => {
                this.modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                this.isOpen = false;
            }, 300);
        }
    };

    // Resume Management
    const ResumeManager = {
        init() {
            this.bindEvents();
        },

        bindEvents() {
            const resumeBtn = Utils.$('.btn-primary');
            if (resumeBtn && resumeBtn.textContent.includes('Resume')) {
                Utils.on(resumeBtn, 'click', (e) => {
                    e.preventDefault();
                    this.downloadResume();
                });
            }
        },

        downloadResume() {
            const btn = Utils.$('.btn-primary');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            btn.disabled = true;

            setTimeout(() => {
                try {
                    window.open(CONFIG.resumeUrl, '_blank', 'noopener,noreferrer');
                } catch (error) {
                    console.error('Resume download failed:', error);
                    Utils.showNotification('Failed to open resume. Please try again.', 'error');
                } finally {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            }, 1000);
        }
    };

    // Theme Management
    const ThemeManager = {
        currentTheme: 'light',
        userSetTheme: false,

        init() {
            this.detectSystemTheme();
            this.applyTheme();
            this.bindEvents();
        },

        detectSystemTheme() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = localStorage.getItem("Theme status");
            }

            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.userSetTheme) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            });
        },

        bindEvents() {
            const themeToggle = Utils.$('.theme-toggle');
            if (themeToggle) {
                Utils.on(themeToggle, 'click', () => this.toggle());
                Utils.on(themeToggle, 'keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggle();
                    }
                });
            }
        },

        toggle() {
            this.userSetTheme = true;
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme();
        },

        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.currentTheme);
        }
    };

    // Performance Optimization
    const PerformanceOptimizer = {
        init() {
            this.setupLazyLoading();
            this.setupIntersectionObserver();
            this.setupProjectCardAnimations();
        },

        setupLazyLoading() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                if (img.tagName === 'IMG') {
                                    img.src = img.dataset.src;
                                    img.removeAttribute('data-src');
                                } else {
                                    img.style.backgroundImage = `url(${img.dataset.src})`;
                                    img.classList.remove('lazy');
                                }
                                observer.unobserve(img);
                            }
                        }
                    });
                }, {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                });

                // Observe both img elements and background images
                Utils.$$('.project-image[data-src], img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        },

        setupIntersectionObserver() {
            const animateOnScroll = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            Utils.$$('.project-card, .sidebar-card, .skill-item, .timeline-item').forEach(el => {
                animateOnScroll.observe(el);
            });
        },

        setupProjectCardAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Setup initial animation styles and observe project cards
            const projectCards = Utils.$$('.project-card-large, .project-card');
            projectCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        }
    };

    // Skills Animation
    const SkillsAnimator = {
        init() {
            const skillLevels = Utils.$$('.skill-level');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = 'fillSkill 1.5s ease-in-out forwards';
                    }
                });
            });

            skillLevels.forEach(skill => observer.observe(skill));
        }
    };

    // Error Handling
    const ErrorHandler = {
        init() {
            window.addEventListener('error', this.handleError);
            window.addEventListener('unhandledrejection', this.handlePromiseRejection);
        },

        handleError(error) {
            console.error('JavaScript Error:', error);
        },

        handlePromiseRejection(event) {
            console.error('Unhandled Promise Rejection:', event.reason);
            event.preventDefault();
        }
    };

    // Main Application Initialization
    const App = {
        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.bootstrap());
            } else {
                this.bootstrap();
            }
        },

        bootstrap() {
            try {
                // Initialize all modules
                Navigation.init();
                TabManager.init();
                ProjectFilter.init(); // New project filtering functionality
                ContactModal.init();
                ResumeManager.init();
                ThemeManager.init();
                PerformanceOptimizer.init();
                SkillsAnimator.init();
                ErrorHandler.init();

                // Mark app as loaded
                document.body.classList.add('loaded', 'theme-transition');

                console.log('Portfolio application initialized successfully');
            } catch (error) {
                console.error('Failed to initialize application:', error);
            }
        }
    };

    // Global functions for backward compatibility
    window.showContactModal = () => ContactModal.show();
    window.hideContactModal = () => ContactModal.hide();
    window.downloadResume = () => ResumeManager.downloadResume();
    window.switchTab = (tabName) => {
        const btn = Utils.$('.tab-btn')[0];
        TabManager.switchTab(tabName, btn);
    };
    window.openPage = (pageName) => Navigation.navigateToPage(pageName);
    
    // Project filtering global functions
    window.filterProjects = (filter) => {
        const button = Utils.$(`[data-filter="${filter}"]`);
        if (button) {
            ProjectFilter.handleFilterClick(button);
        }
    };
    
    window.searchProjects = (query) => {
        ProjectFilter.searchProjects(query);
    };
    
    // Standalone toggleTheme function
    window.toggleTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Save theme preference in memory
        localStorage.setItem("Theme status", newTheme);
        window.currentTheme = newTheme; //localStorage.getItem("Theme status");

        // Add smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
        
        // Mark that user manually set theme
        window.userSetTheme = true;
    };

    // Initialize the application
    App.init();

})();

// Enhanced CSS Styles
const styles = `
<style>
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10000;
        max-width: 400px;
        font-size: 14px;
        line-height: 1.4;
    }

    .notification-info {
        background: #0a66c2;
        color: white;
    }

    .notification-error {
        background: #dc3545;
        color: white;
    }

    .notification.show {
        transform: translateX(0);
    }

    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }

    /* Project filtering styles */
    .project-card.hidden,
    .project-card-large.hidden {
        display: none;
    }

    .project-card.show,
    .project-card-large.show {
        display: block;
    }

    .filter-btn {
        transition: all 0.3s ease;
    }

    .filter-btn.active {
        background-color: #0a66c2;
        color: white;
    }

    .filter-btn:hover {
        background-color: #004182;
        color: white;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fillSkill {
        from {
            width: 0;
        }
        to {
            width: var(--skill-width, 80%);
        }
    }

    .theme-transition {
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    [data-theme="dark"] {
        --text-primary: #ffffff;
        --text-secondary: #b3b3b3;
        --background-primary: #1b1f23;
        --background-secondary: #262a2e;
        --border-color: #404040;
    }

    [data-theme="dark"] .filter-btn.active {
        background-color: #0a66c2;
        color: white;
    }

    [data-theme="dark"] .filter-btn:hover {
        background-color: #004182;
        color: white;
    }

    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', styles);