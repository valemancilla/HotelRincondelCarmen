/**
 * Archivo principal de JavaScript para el Hotel el Rincón del Carmen
 * Maneja la funcionalidad general del sitio web
 */

class MainApp {
    constructor() {
        this.init();
    }

    /**
     * Inicializa la aplicación principal
     */
    init() {
        this.bindEvents();
        this.initializeApp();
    }

    /**
     * Vincula eventos generales de la aplicación
     */
    bindEvents() {
        // Eventos de navegación móvil
        this.bindMobileNavigation();
        
        // Eventos de scroll
        this.bindScrollEvents();
        
        // Eventos de formularios
        this.bindFormEvents();
        
        // Eventos de modales
        this.bindModalEvents();
        
        // Eventos de habitaciones
        this.bindRoomEvents();
    }

    /**
     * Vincula eventos de navegación móvil
     */
    bindMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Cerrar menú al hacer clic en un enlace
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    /**
     * Vincula eventos de scroll
     */
    bindScrollEvents() {
        // Efecto de navbar al hacer scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(28, 28, 28, 0.95)';
                    navbar.style.backdropFilter = 'blur(10px)';
                } else {
                    navbar.style.background = 'rgba(28, 28, 28)';
                    navbar.style.backdropFilter = 'none';
                }
            }
        });

        // Animaciones al hacer scroll
        this.observeElements();
    }

    /**
     * Observa elementos para animaciones
     */
    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observar elementos que deben animarse
        document.querySelectorAll('.room-card, .area-card, .service-item, .contact-card').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Vincula eventos de formularios
     */
    bindFormEvents() {
        // Validación en tiempo real de formularios
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    /**
     * Vincula eventos de modales
     */
    bindModalEvents() {
        // Cerrar modales con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal[style*="block"]');
                if (openModal) {
                    openModal.style.display = 'none';
                }
            }
        });
    }

    /**
     * Vincula eventos de habitaciones
     */
    bindRoomEvents() {
        // Eventos delegados para habitaciones
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-room-details')) {
                e.preventDefault();
                const roomId = e.target.dataset.roomId;
                if (roomManager && roomManager.showRoomDetails) {
                    roomManager.showRoomDetails(roomId);
                }
            }

            if (e.target.classList.contains('reserve-room')) {
                e.preventDefault();
                const roomId = e.target.dataset.roomId;
                if (roomManager && roomManager.showReservationModal) {
                    roomManager.showReservationModal(roomId);
                }
            }
        });
    }

    /**
     * Inicializa la aplicación
     */
    initializeApp() {
        // Configurar fechas mínimas
        this.setupDateInputs();
        
        // Cargar datos iniciales
        this.loadInitialData();
        
        // Configurar notificaciones
        this.setupNotifications();
    }

    /**
     * Configura los inputs de fecha
     */
    setupDateInputs() {
        const checkInInput = document.getElementById('checkIn');
        const checkOutInput = document.getElementById('checkOut');

        if (checkInInput) {
            const today = new Date().toISOString().split('T')[0];
            checkInInput.min = today;
            checkInInput.value = today;

            checkInInput.addEventListener('change', () => {
                if (checkOutInput) {
                    const checkInDate = new Date(checkInInput.value);
                    const nextDay = new Date(checkInDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    checkOutInput.min = nextDay.toISOString().split('T')[0];
                    
                    if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
                        checkOutInput.value = nextDay.toISOString().split('T')[0];
                    }
                }
            });
        }

        if (checkOutInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            checkOutInput.min = tomorrow.toISOString().split('T')[0];
            checkOutInput.value = tomorrow.toISOString().split('T')[0];
        }
    }

    /**
     * Carga datos iniciales
     */
    loadInitialData() {
        // Cargar estadísticas si estamos en el panel de admin
        if (window.location.pathname.includes('admin.html')) {
            this.loadAdminStats();
        }

        // Cargar mensajes de contacto si estamos en admin
        if (window.location.pathname.includes('admin.html')) {
            this.loadContactMessages();
        }
    }

    /**
     * Carga estadísticas del admin
     */
    loadAdminStats() {
        const stats = storageManager.exportData();
        
        // Crear panel de estadísticas si no existe
        let statsPanel = document.querySelector('.admin-stats');
        if (!statsPanel) {
            statsPanel = document.createElement('div');
            statsPanel.className = 'admin-stats';
            statsPanel.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>${stats.totalUsers}</h3>
                        <p>Usuarios Registrados</p>
                    </div>
                    <div class="stat-card">
                        <h3>${stats.totalRooms}</h3>
                        <p>Habitaciones</p>
                    </div>
                    <div class="stat-card">
                        <h3>${stats.activeReservations}</h3>
                        <p>Reservas Activas</p>
                    </div>
                    <div class="stat-card">
                        <h3>${stats.unreadContacts}</h3>
                        <p>Mensajes Sin Leer</p>
                    </div>
                </div>
            `;
            
            const adminDashboard = document.querySelector('.admin-dashboard .container');
            if (adminDashboard) {
                adminDashboard.insertBefore(statsPanel, adminDashboard.firstChild);
            }
        }
    }

    /**
     * Carga mensajes de contacto
     */
    loadContactMessages() {
        // Esta funcionalidad se puede expandir para mostrar mensajes en el admin
        const contacts = storageManager.getData('contactMessages') || [];
        console.log('Mensajes de contacto:', contacts);
    }

    /**
     * Configura el sistema de notificaciones
     */
    setupNotifications() {
        // Agregar estilos para animaciones de notificaciones
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Valida un campo de formulario
     */
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');

        // Limpiar errores anteriores
        this.clearFieldError(field);

        // Validaciones básicas
        if (required && !value) {
            this.showFieldError(field, 'Este campo es requerido');
            return false;
        }

        if (value) {
            switch (type) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        this.showFieldError(field, 'Ingresa un email válido');
                        return false;
                    }
                    break;
                case 'tel':
                    if (value.length < 10) {
                        this.showFieldError(field, 'El teléfono debe tener al menos 10 caracteres');
                        return false;
                    }
                    break;
                case 'url':
                    if (!this.isValidUrl(value)) {
                        this.showFieldError(field, 'Ingresa una URL válida');
                        return false;
                    }
                    break;
            }
        }

        return true;
    }

    /**
     * Muestra error en un campo
     */
    showFieldError(field, message) {
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;';
        
        field.parentNode.appendChild(errorDiv);
    }

    /**
     * Limpia errores de un campo
     */
    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    /**
     * Valida email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida URL
     */
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Muestra una notificación
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 3000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i> ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    /**
     * Formatea números como moneda colombiana
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Formatea fechas en español
     */
    formatDate(date) {
        return new Date(date).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Calcula días entre dos fechas
     */
    calculateDaysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(date1);
        const secondDate = new Date(date2);
        return Math.ceil((secondDate - firstDate) / oneDay);
    }

    /**
     * Genera un ID único
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Debounce function para optimizar eventos
     */
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
    }

    /**
     * Throttle function para optimizar eventos
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.mainApp = new MainApp();
});

// Manejar errores globales (deshabilitado para evitar notificaciones molestas)
// window.addEventListener('error', (e) => {
//     console.error('Error global:', e.error);
// });

// Manejar promesas rechazadas (deshabilitado para evitar notificaciones molestas)
// window.addEventListener('unhandledrejection', (e) => {
//     console.error('Promesa rechazada:', e.reason);
// });
