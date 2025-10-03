/**
 * Sistema de autenticación para el Hotel el Rincón del Carmen
 * Maneja el login, registro y gestión de sesiones de usuarios
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    /**
     * Inicializa el sistema de autenticación
     */
    init() {
        // Verificar si hay una sesión activa
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
        
        this.bindEvents();
    }

    /**
     * Vincula los eventos de autenticación
     */
    bindEvents() {
        // Eventos de login
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }

        // Eventos de registro
        const showRegister = document.getElementById('showRegister');
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterModal();
            });
        }

        const showLogin = document.getElementById('showLogin');
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }

        // Eventos de formularios
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Eventos de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Eventos de admin
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn) {
            adminBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToAdmin();
            });
        }

        // Cerrar modales
        this.bindModalEvents();
    }

    /**
     * Vincula eventos para cerrar modales
     */
    bindModalEvents() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeModal(modal);
                });
            }

            // Cerrar al hacer clic fuera del modal
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    /**
     * Muestra el modal de login
     */
    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.display = 'block';
            document.getElementById('loginEmail').focus();
        }
    }

    /**
     * Muestra el modal de registro
     */
    showRegisterModal() {
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
        
        if (loginModal) loginModal.style.display = 'none';
        if (registerModal) registerModal.style.display = 'block';
        
        document.getElementById('regName').focus();
    }

    /**
     * Cierra un modal
     */
    closeModal(modal) {
        modal.style.display = 'none';
        this.clearForms();
    }

    /**
     * Limpia los formularios
     */
    clearForms() {
        const forms = document.querySelectorAll('#loginForm, #registerForm');
        forms.forEach(form => {
            form.reset();
            // Limpiar mensajes de error
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());
        });
    }

    /**
     * Maneja el proceso de login
     */
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            this.showError('loginForm', 'Por favor completa todos los campos');
            return;
        }

        try {
            const user = hotelStorage.getUserByEmail(email);
            
            if (!user) {
                this.showError('loginForm', 'Usuario no encontrado');
                return;
            }

            if (user.password !== password) {
                this.showError('loginForm', 'Contraseña incorrecta');
                return;
            }

            // Login exitoso
            this.currentUser = user;
            localStorage.setItem('current_user', JSON.stringify(user));
            
            this.closeModal(document.getElementById('loginModal'));
            this.updateUI();
            this.showSuccess('Inicio de sesión exitoso');
            
            // Recargar la página para actualizar la interfaz
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('Error en login:', error);
            this.showError('loginForm', 'Error al iniciar sesión');
        }
    }

    /**
     * Maneja el proceso de registro
     */
    async handleRegister() {
        const formData = {
            identification: document.getElementById('regId').value,
            name: document.getElementById('regName').value,
            nationality: document.getElementById('regNationality').value,
            email: document.getElementById('regEmail').value,
            phone: document.getElementById('regPhone').value,
            password: document.getElementById('regPassword').value
        };

        // Validaciones
        if (!this.validateRegistration(formData)) {
            return;
        }

        try {
            // Verificar si el email ya existe
            const existingUser = hotelStorage.getUserByEmail(formData.email);
            if (existingUser) {
                this.showError('registerForm', 'Este email ya está registrado');
                return;
            }

            // Verificar si la identificación ya existe
            const users = hotelStorage.getUsers();
            const existingId = users.find(user => user.identification === formData.identification);
            if (existingId) {
                this.showError('registerForm', 'Este número de identificación ya está registrado');
                return;
            }

            // Crear nuevo usuario
            const newUser = hotelStorage.addUser(formData);
            
            this.closeModal(document.getElementById('registerModal'));
            this.showSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
            
            // Mostrar modal de login
            setTimeout(() => {
                this.showLoginModal();
            }, 1500);

        } catch (error) {
            console.error('Error en registro:', error);
            this.showError('registerForm', 'Error al registrarse');
        }
    }

    /**
     * Valida los datos de registro
     */
    validateRegistration(data) {
        const errors = [];

        if (!data.identification || data.identification.length < 6) {
            errors.push('El número de identificación debe tener al menos 6 caracteres');
        }

        if (!data.name || data.name.length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (!data.nationality || data.nationality.length < 2) {
            errors.push('La nacionalidad es requerida');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Ingresa un email válido');
        }

        if (!data.phone || data.phone.length < 10) {
            errors.push('El teléfono debe tener al menos 10 caracteres');
        }

        if (!data.password || data.password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }

        if (errors.length > 0) {
            this.showError('registerForm', errors.join('<br>'));
            return false;
        }

        return true;
    }

    /**
     * Valida formato de email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Cierra la sesión del usuario
     */
    logout() {
        this.currentUser = null;
        localStorage.removeItem('current_user');
        this.updateUI();
        this.showSuccess('Sesión cerrada exitosamente');
        
        // Redirigir a la página principal
        setTimeout(() => {
            const currentPath = window.location.pathname;
            if (currentPath.includes('html/')) {
                window.location.href = '../index.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    }

    /**
     * Redirige al panel de administración
     */
    goToAdmin() {
        if (this.isAdmin()) {
            window.location.href = 'html/admin.html';
        } else {
            this.showError('', 'No tienes permisos de administrador');
        }
    }

    /**
     * Actualiza la interfaz de usuario según el estado de autenticación
     */
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const adminBtn = document.getElementById('adminBtn');
        const myReservations = document.getElementById('myReservations');

        if (this.currentUser) {
            // Usuario logueado
            if (loginBtn) {
                loginBtn.textContent = `Hola, ${this.currentUser.name.split(' ')[0]}`;
                loginBtn.onclick = (e) => {
                    e.preventDefault();
                    this.logout();
                };
            }

            if (adminBtn && this.isAdmin()) {
                adminBtn.style.display = 'block';
            }

            if (myReservations) {
                myReservations.style.display = 'block';
                this.loadUserReservations();
            }
        } else {
            // Usuario no logueado
            if (loginBtn) {
                loginBtn.textContent = 'Iniciar Sesión';
                loginBtn.onclick = (e) => {
                    e.preventDefault();
                    this.showLoginModal();
                };
            }

            if (adminBtn) {
                adminBtn.style.display = 'none';
            }

            if (myReservations) {
                myReservations.style.display = 'none';
            }
        }
    }

    /**
     * Verifica si el usuario actual es administrador
     */
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    /**
     * Verifica si el usuario está autenticado
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Obtiene el usuario actual
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Carga las reservas del usuario actual
     */
    loadUserReservations() {
        if (!this.currentUser) return;

        const reservations = hotelStorage.getReservationsByUser(this.currentUser.id);
        const reservationsList = document.getElementById('reservationsList');
        
        if (!reservationsList) return;

        if (reservations.length === 0) {
            reservationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No tienes reservas</h3>
                    <p>¡Haz tu primera reserva ahora!</p>
                    <a href="${this.getReservasUrl()}" class="btn-primary">Ver Habitaciones</a>
                </div>
            `;
            return;
        }

        reservationsList.innerHTML = reservations.map(reservation => {
            const room = hotelStorage.getRoomById(reservation.roomId);
            const checkIn = new Date(reservation.checkIn).toLocaleDateString('es-CO');
            const checkOut = new Date(reservation.checkOut).toLocaleDateString('es-CO');
            const totalNights = Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24));
            const totalPrice = totalNights * room.pricePerNight;

            return `
                <div class="reservation-item">
                    <h4>Habitación ${room.number} - ${this.getRoomTypeName(room.type)}</h4>
                    <div class="reservation-details">
                        <div class="reservation-detail">
                            <strong>Check-in:</strong>
                            <span>${checkIn}</span>
                        </div>
                        <div class="reservation-detail">
                            <strong>Check-out:</strong>
                            <span>${checkOut}</span>
                        </div>
                        <div class="reservation-detail">
                            <strong>Huéspedes:</strong>
                            <span>${reservation.guests}</span>
                        </div>
                        <div class="reservation-detail">
                            <strong>Total:</strong>
                            <span>$${totalPrice.toLocaleString('es-CO')}</span>
                        </div>
                        <div class="reservation-detail">
                            <strong>Estado:</strong>
                            <span class="status-badge status-${reservation.status}">${this.getStatusText(reservation.status)}</span>
                        </div>
                    </div>
                    ${reservation.notes ? `<p><strong>Notas:</strong> ${reservation.notes}</p>` : ''}
                    <div class="reservation-actions">
                        ${reservation.status === 'active' ? `
                            <button class="btn-danger" onclick="authManager.cancelReservation('${reservation.id}')">
                                Cancelar Reserva
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Cancela una reserva
     */
    cancelReservation(reservationId) {
        if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
            return;
        }

        try {
            hotelStorage.cancelReservation(reservationId);
            this.loadUserReservations();
            this.showSuccess('Reserva cancelada exitosamente');
        } catch (error) {
            console.error('Error al cancelar reserva:', error);
            this.showError('', 'Error al cancelar la reserva');
        }
    }

    /**
     * Obtiene el nombre del tipo de habitación
     */
    getRoomTypeName(type) {
        const types = {
            'standard': 'Estándar',
            'deluxe': 'Deluxe',
            'suite': 'Suite',
            'presidential': 'Presidencial'
        };
        return types[type] || type;
    }

    /**
     * Obtiene el texto del estado
     */
    getStatusText(status) {
        const statuses = {
            'active': 'Activa',
            'cancelled': 'Cancelada',
            'pending': 'Pendiente'
        };
        return statuses[status] || status;
    }

    /**
     * Obtiene la URL correcta para reservas dependiendo de la ubicación actual
     */
    getReservasUrl() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('html/')) {
            return 'reservas.html';
        } else {
            return 'html/reservas.html';
        }
    }

    /**
     * Muestra un mensaje de error
     */
    showError(formId, message) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Remover mensajes de error anteriores
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Crear nuevo mensaje de error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error error-message';
        errorDiv.innerHTML = message;
        
        form.insertBefore(errorDiv, form.firstChild);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    /**
     * Muestra un mensaje de éxito
     */
    showSuccess(message) {
        // Crear notificación de éxito
        const notification = document.createElement('div');
        notification.className = 'alert alert-success';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 3000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i> ${message}
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Crear instancia global del gestor de autenticación
window.authManager = new AuthManager();
