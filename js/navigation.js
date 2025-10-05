// Navigation Manager - Centralized navigation for all pages
class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        // Map filenames to page identifiers
        const pageMap = {
            'index.html': 'home',
            'suites.html': 'suites',
            'suite-detail.html': 'suites',
            'suite-mitica.html': 'suites',
            'suite-santa.html': 'suites',
            'suite-majestic.html': 'suites',
            'suite-epica.html': 'suites',
            'suite-villa-santo.html': 'suites',
            'suite-elementos.html': 'suites',
            'trinity-restaurant.html': 'trinity',
            'sky-bar.html': 'skybar',
            'sacred-spa.html': 'spa',
            'contacto.html': 'contact',
            'reservas.html': 'reservations',
            'admin.html': 'admin'
        };

        return pageMap[filename] || 'home';
    }

    generateNavigation() {
        const isIndexPage = this.currentPage === 'home';
        const basePath = isIndexPage ? '' : '../';
        const htmlPath = isIndexPage ? 'html/' : '';

        return `
            <nav class="navbar ${this.currentPage === 'trinity' || this.currentPage === 'skybar' || this.currentPage === 'spa' ? 'trinity-nav' : ''}">
                <div class="nav-container">
                    <div class="nav-logo">
                        <h2>Hotel el Rincón del Carmen${this.currentPage === 'trinity' || this.currentPage === 'skybar' || this.currentPage === 'spa' ? '<br><span class="santorini"></span>' : ''}</h2>
                    </div>
                    <ul class="nav-menu">
                        <li class="nav-item">
                            <a href="${basePath}index.html" class="nav-link ${this.currentPage === 'home' ? 'active' : ''}">Hogar</a>
                        </li>
                        <li class="nav-item">
                            <a href="${htmlPath}suites.html" class="nav-link ${this.currentPage === 'suites' ? 'active' : ''}">Suites</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a href="${basePath}index.html#experience" class="nav-link ${this.currentPage === 'trinity' || this.currentPage === 'skybar' || this.currentPage === 'spa' ? 'active' : ''}">Experiencia</a>
                            <div class="dropdown-menu">
                                <a href="${htmlPath}trinity-restaurant.html" class="dropdown-item ${this.currentPage === 'trinity' ? 'active' : ''}">Trinity Restaurant</a>
                                <a href="${htmlPath}sky-bar.html" class="dropdown-item ${this.currentPage === 'skybar' ? 'active' : ''}">Sky Bar</a>
                                <a href="${htmlPath}sacred-spa.html" class="dropdown-item ${this.currentPage === 'spa' ? 'active' : ''}">The Sacred Spa</a>
                                <a href="#" class="dropdown-item">Saint Gym</a>
                                <a href="#" class="dropdown-item">Saint Yachting</a>
                                <a href="#" class="dropdown-item">VIP Transfers</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a href="${htmlPath}contacto.html" class="nav-link ${this.currentPage === 'contact' ? 'active' : ''}">Contacto</a>
                        </li>
                        <li class="nav-item">
                            <a href="${htmlPath}reservas.html" class="nav-link ${this.currentPage === 'reservations' ? 'active' : ''}">Reservar ahora</a>
                        </li>
                    </ul>
                    <div class="search-container">
                        <a href="#" class="search-icon">
                            <i class="fas fa-search"></i>
                        </a>
                    </div>
                    <div class="hamburger">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </div>
                </div>
            </nav>
        `;
    }

    generateFooter() {
        const isIndexPage = this.currentPage === 'home';
        const basePath = isIndexPage ? '' : '../';
        const htmlPath = isIndexPage ? 'html/' : '';

        return `
            <footer class="footer">
                <div class="footer-container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <h3>Hotel el Rincón del Carmen</h3>
                            <p>Tu hogar lejos de casa</p>
                        </div>
                        <div class="footer-section">
                            <h4>Enlaces Rápidos</h4>
                            <ul>
                                <li><a href="${basePath}index.html">Inicio</a></li>
                                <li><a href="${htmlPath}reservas.html">Reservas</a></li>
                                <li><a href="${htmlPath}contacto.html">Contacto</a></li>
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h4>Contacto</h4>
                            <p><i class="fas fa-phone"></i> +57 (1) 234-5678</p>
                            <p><i class="fas fa-envelope"></i> info@rincondelcarmen.com</p>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; 2024 Hotel el Rincón del Carmen. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        `;
    }

    init() {
        // Replace navigation placeholder or existing navigation
        const navPlaceholder = document.querySelector('.navbar-placeholder');
        const navContainer = document.querySelector('.navbar');
        
        if (navPlaceholder) {
            navPlaceholder.outerHTML = this.generateNavigation();
        } else if (navContainer) {
            navContainer.outerHTML = this.generateNavigation();
        }

        // Replace footer placeholder or existing footer
        const footerPlaceholder = document.querySelector('.footer-placeholder');
        const footerContainer = document.querySelector('.footer');
        
        if (footerPlaceholder) {
            footerPlaceholder.outerHTML = this.generateFooter();
        } else if (footerContainer) {
            footerContainer.outerHTML = this.generateFooter();
        }

        // Initialize mobile menu functionality
        this.initMobileMenu();
    }

    initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});
