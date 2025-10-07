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
            const user = storageManager.getUserByEmail(email);
            
            if (!user) {
                this.showError('loginForm', 'Este usuario no está registrado');
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
            const existingUser = storageManager.getUserByEmail(formData.email);
            if (existingUser) {
                this.showError('registerForm', 'Este email ya está registrado');
                return;
            }

            // Verificar si la identificación ya existe
            const users = storageManager.getUsers();
            const existingId = users.find(user => user.identification === formData.identification);
            if (existingId) {
                this.showError('registerForm', 'Este número de identificación ya está registrado');
                return;
            }

            // Crear nuevo usuario
            const newUser = storageManager.addUser(formData);
            
            this.closeModal(document.getElementById('registerModal'));
            this.showSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
            
            // Mostrar modal de login
            setTimeout(() => {
                this.showLoginModal();
            }, 1500);

        } catch (error) {
            console.error('Error en registro:', error);
            this.showError('registerForm', 'Error al registrarse: ' + error.message);
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
     * Actualiza la interfaz de usuario según el estado de autenticación
     */
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtnItem = document.getElementById('logoutBtnItem');
        const adminBtn = document.getElementById('adminBtn');
        const myReservations = document.getElementById('myReservations');

        if (this.currentUser) {
            // Usuario logueado
            if (loginBtn) {
                loginBtn.textContent = `Hola, ${this.currentUser.name.split(' ')[0]}`;
                // Remover cualquier evento de click y hacer que el botón solo muestre el nombre
                loginBtn.onclick = null;
                loginBtn.style.cursor = 'default';
                loginBtn.removeAttribute('href');
            }

            // Mostrar botón de cerrar sesión
            if (logoutBtnItem) {
                logoutBtnItem.style.display = 'block';
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
                loginBtn.style.cursor = 'pointer';
                loginBtn.setAttribute('href', '#');
                loginBtn.onclick = (e) => {
                    e.preventDefault();
                    this.showLoginModal();
                };
            }

            // Ocultar botón de cerrar sesión
            if (logoutBtnItem) {
                logoutBtnItem.style.display = 'none';
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

        const allReservations = storageManager.getReservationsByUser(this.currentUser.id);
        const reservationsList = document.getElementById('reservationsList');
        
        if (!reservationsList) return;

        // Filtrar solo reservas activas (no canceladas)
        const reservations = allReservations.filter(r => r.status !== 'cancelled');
        const cancelledCount = allReservations.length - reservations.length;

        if (reservations.length === 0 && cancelledCount === 0) {
            reservationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No tienes reservas</h3>
                    <p>¡Haz tu primera reserva ahora!</p>
                    <a href="${this.getReservasUrl()}" class="btn-suites">VER HABITACIONES</a>
                </div>
            `;
            return;
        }

        if (reservations.length === 0 && cancelledCount > 0) {
            reservationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No tienes reservas activas</h3>
                    <p>Tienes ${cancelledCount} reserva(s) cancelada(s).</p>
                    <button onclick="authManager.deleteAllCancelledReservations()" 
                            style="background: #e74c3c; color: white; border: none; padding: 6px 12px; 
                                   font-size: 12px; border-radius: 4px; cursor: pointer; 
                                   display: inline-flex; align-items: center; gap: 5px;">
                        <i class="fas fa-trash" style="font-size: 11px;"></i> 
                        <span>Eliminar canceladas</span>
                    </button>
                    <br><br>
                    <a href="${this.getReservasUrl()}" class="btn-suites">VER HABITACIONES</a>
                </div>
            `;
            return;
        }

        reservationsList.innerHTML = reservations.map(reservation => {
            const room = storageManager.getRoomById(reservation.roomId);
            const checkIn = new Date(reservation.checkIn).toLocaleDateString('es-CO');
            const checkOut = new Date(reservation.checkOut).toLocaleDateString('es-CO');
            const totalNights = Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24));
            const totalPrice = totalNights * room.pricePerNight;
            const roomImage = room.images && room.images[0] ? room.images[0] : 'https://via.placeholder.com/400x300?text=Sin+Imagen';

            return `
                <div class="reservation-card-vertical">
                    <div class="reservation-image-top">
                        <img src="${roomImage}" alt="${room.name}">
                        <div class="status-overlay status-${reservation.status}">
                            <i class="fas fa-${reservation.status === 'pending' ? 'clock' : reservation.status === 'confirmed' ? 'check-circle' : 'circle'}"></i>
                            ${this.getStatusText(reservation.status)}
                        </div>
                    </div>
                    
                    <div class="reservation-content-vertical">
                        <h3 class="room-name-vertical">${room.name}</h3>
                        <span class="room-type-badge">${this.getRoomTypeName(room.type)}</span>
                        
                        <div class="dates-section">
                            <div class="date-box">
                                <i class="fas fa-sign-in-alt"></i>
                                <div>
                                    <small>Check-in</small>
                                    <strong>${checkIn}</strong>
                                </div>
                            </div>
                            <div class="nights-indicator">
                                <i class="fas fa-moon"></i>
                                ${totalNights} ${totalNights === 1 ? 'noche' : 'noches'}
                            </div>
                            <div class="date-box">
                                <i class="fas fa-sign-out-alt"></i>
                                <div>
                                    <small>Check-out</small>
                                    <strong>${checkOut}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div class="guests-info">
                            <i class="fas fa-users"></i>
                            <span>${reservation.guests} huéspedes</span>
                        </div>
                        
                        <div class="price-box">
                            <div class="price-detail">COP $${room.pricePerNight.toLocaleString('es-CO')} × ${totalNights}</div>
                            <div class="price-total">COP $${totalPrice.toLocaleString('es-CO')}</div>
                        </div>
                        
                        <div class="action-buttons">
                            ${(reservation.status === 'pending' || reservation.status === 'confirmed') ? `
                                <button class="btn-modify" onclick="authManager.modifyReservation(${reservation.id})">
                                    <i class="fas fa-edit"></i> Modificar
                                </button>
                                <button class="btn-delete" onclick="authManager.cancelReservation(${reservation.id})">
                                    <i class="fas fa-trash-alt"></i> Cancelar
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Modifica una reserva
     */
    modifyReservation(reservationId) {
        const reservations = storageManager.getReservationsByUser(this.currentUser.id);
        const reservation = reservations.find(r => r.id === reservationId);
        
        if (!reservation) {
            this.showError('Reserva no encontrada');
            return;
        }

        const room = storageManager.getRoomById(reservation.roomId);
        
        // Crear modal de edición
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.id = 'editReservationModal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Modificar Reserva</h2>
                <h3>${room.name}</h3>
                <form id="editReservationForm">
                    <div class="form-group">
                        <label for="editCheckIn">Fecha de entrada:</label>
                        <input type="date" id="editCheckIn" value="${reservation.checkIn}" required>
                    </div>
                    <div class="form-group">
                        <label for="editCheckOut">Fecha de salida:</label>
                        <input type="date" id="editCheckOut" value="${reservation.checkOut}" required>
                    </div>
                    <div class="form-group">
                        <label for="editGuests">Número de Huéspedes:</label>
                        <select id="editGuests" required>
                            ${[1,2,3,4].map(n => 
                                `<option value="${n}" ${reservation.guests === n ? 'selected' : ''}>${n} ${n === 1 ? 'huésped' : 'huéspedes'}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn-primary">Guardar Cambios</button>
                    <button type="button" class="btn-outline" onclick="document.getElementById('editReservationModal').remove()">Cancelar</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar modal
        modal.querySelector('.close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        
        // Configurar fechas mínimas
        const today = new Date().toISOString().split('T')[0];
        const editCheckIn = document.getElementById('editCheckIn');
        const editCheckOut = document.getElementById('editCheckOut');
        
        editCheckIn.min = today;
        editCheckOut.min = today;
        
        // Actualizar fecha mínima de salida cuando cambie la entrada
        editCheckIn.addEventListener('change', () => {
            const checkInDate = new Date(editCheckIn.value);
            const nextDay = new Date(checkInDate);
            nextDay.setDate(nextDay.getDate() + 1);
            editCheckOut.min = nextDay.toISOString().split('T')[0];
            
            if (editCheckOut.value && new Date(editCheckOut.value) <= checkInDate) {
                editCheckOut.value = '';
            }
        });
        
        // Manejar envío del formulario
        document.getElementById('editReservationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newCheckIn = document.getElementById('editCheckIn').value;
            const newCheckOut = document.getElementById('editCheckOut').value;
            const newGuests = parseInt(document.getElementById('editGuests').value);
            
            // Validar fechas
            if (new Date(newCheckOut) <= new Date(newCheckIn)) {
                alert('La fecha de salida debe ser posterior a la fecha de entrada');
                return;
            }
            
            // Calcular noches automáticamente
            const newNights = Math.ceil((new Date(newCheckOut) - new Date(newCheckIn)) / (1000 * 60 * 60 * 24));
            
            // Actualizar reserva
            const updatedData = {
                checkIn: newCheckIn,
                checkOut: newCheckOut,
                nights: newNights,
                guests: newGuests
            };
            
            try {
                storageManager.updateReservation(reservationId, updatedData);
                modal.remove();
                this.loadUserReservations();
                this.showSuccess('Reserva modificada exitosamente');
            } catch (error) {
                console.error('Error al modificar reserva:', error);
                this.showError('Error al modificar la reserva: ' + error.message);
            }
        });
    }

    /**
     * Cancela una reserva
     */
    cancelReservation(reservationId) {
        try {
            storageManager.updateReservationStatus(reservationId, 'cancelled');
            this.loadUserReservations();
            this.showSuccess('Reserva cancelada exitosamente');
        } catch (error) {
            console.error('Error al cancelar reserva:', error);
            this.showError('Error al cancelar la reserva');
        }
    }

    /**
     * Elimina todas las reservas canceladas del usuario actual
     */
    deleteAllCancelledReservations() {
        if (!this.currentUser) return;

        try {
            const allReservations = storageManager.getAllReservations();
            const userCancelledReservations = allReservations.filter(r => 
                r.userId === this.currentUser.id && r.status === 'cancelled'
            );
            
            userCancelledReservations.forEach(r => {
                storageManager.deleteReservation(r.id);
            });
            
            this.loadUserReservations();
            this.showSuccess(`${userCancelledReservations.length} reserva(s) cancelada(s) eliminada(s) exitosamente`);
        } catch (error) {
            console.error('Error al eliminar reservas:', error);
            this.showError('Error al eliminar las reservas');
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
            'pending': 'Pendiente',
            'confirmed': 'Confirmada',
            'cancelled': 'Cancelada'
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
