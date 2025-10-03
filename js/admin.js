/**
 * Panel de administración para el Hotel el Rincón del Carmen
 * Maneja la gestión de habitaciones, reservas y usuarios
 */

class AdminManager {
    constructor() {
        this.currentTab = 'rooms';
        this.init();
    }

    /**
     * Inicializa el panel de administración
     */
    init() {
        // Verificar autenticación y permisos
        if (!authManager.isAuthenticated() || !authManager.isAdmin()) {
            window.location.href = '../index.html';
            return;
        }

        this.bindEvents();
        this.loadTab('rooms');
    }

    /**
     * Vincula eventos del panel de administración
     */
    bindEvents() {
        // Eventos de pestañas
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Eventos de habitaciones
        const addRoomBtn = document.getElementById('addRoomBtn');
        if (addRoomBtn) {
            addRoomBtn.addEventListener('click', () => {
                this.showRoomForm();
            });
        }

        // Eventos de formulario de habitación
        const roomForm = document.getElementById('roomForm');
        if (roomForm) {
            roomForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRoomForm();
            });
        }

        // Eventos de filtros
        const reservationFilter = document.getElementById('reservationFilter');
        if (reservationFilter) {
            reservationFilter.addEventListener('change', () => {
                this.loadReservations();
            });
        }

        // Eventos de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                authManager.logout();
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

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    /**
     * Cambia de pestaña
     */
    switchTab(tab) {
        // Actualizar botones de pestaña
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Actualizar contenido de pestañas
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}Tab`).classList.add('active');

        this.currentTab = tab;
        this.loadTab(tab);
    }

    /**
     * Carga el contenido de una pestaña
     */
    loadTab(tab) {
        switch (tab) {
            case 'rooms':
                this.loadRooms();
                break;
            case 'reservations':
                this.loadReservations();
                break;
            case 'users':
                this.loadUsers();
                break;
        }
    }

    /**
     * Carga las habitaciones
     */
    loadRooms() {
        const roomsGrid = document.getElementById('roomsAdminGrid');
        if (!roomsGrid) return;

        const rooms = hotelStorage.getRooms();
        
        if (rooms.length === 0) {
            roomsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bed"></i>
                    <h3>No hay habitaciones registradas</h3>
                    <p>Agrega la primera habitación del hotel</p>
                </div>
            `;
            return;
        }

        roomsGrid.innerHTML = rooms.map(room => `
            <div class="room-admin-card">
                <h4>Habitación ${room.number}</h4>
                <p><strong>Tipo:</strong> ${this.getRoomTypeName(room.type)}</p>
                <p><strong>Huéspedes:</strong> ${room.maxGuests}</p>
                <p><strong>Camas:</strong> ${room.beds}</p>
                <p><strong>Precio:</strong> $${room.pricePerNight.toLocaleString('es-CO')}/noche</p>
                <p><strong>Estado:</strong> ${room.isActive ? 'Activa' : 'Inactiva'}</p>
                <div class="room-admin-actions">
                    <button class="btn-primary btn-small" onclick="adminManager.editRoom('${room.id}')">
                        Editar
                    </button>
                    <button class="btn-danger btn-small" onclick="adminManager.deleteRoom('${room.id}')">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Carga las reservas
     */
    loadReservations() {
        const reservationsList = document.getElementById('reservationsAdminList');
        if (!reservationsList) return;

        const filter = document.getElementById('reservationFilter')?.value || 'all';
        let reservations = hotelStorage.getReservations();

        // Aplicar filtro
        if (filter !== 'all') {
            reservations = reservations.filter(reservation => reservation.status === filter);
        }

        if (reservations.length === 0) {
            reservationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No hay reservas</h3>
                    <p>No se encontraron reservas con el filtro seleccionado</p>
                </div>
            `;
            return;
        }

        reservationsList.innerHTML = reservations.map(reservation => {
            const room = hotelStorage.getRoomById(reservation.roomId);
            const user = hotelStorage.getUserById(reservation.userId);
            const checkIn = new Date(reservation.checkIn).toLocaleDateString('es-CO');
            const checkOut = new Date(reservation.checkOut).toLocaleDateString('es-CO');
            const totalNights = Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24));

            return `
                <div class="reservation-admin-item">
                    <h4>Reserva ${reservation.id}</h4>
                    <div class="reservation-details">
                        <div class="reservation-detail">
                            <strong>Cliente:</strong>
                            <span>${user ? user.name : 'Usuario no encontrado'}</span>
                        </div>
                        <div class="reservation-detail">
                            <strong>Habitación:</strong>
                            <span>${room ? room.number : 'Habitación no encontrada'}</span>
                        </div>
                        <div class="reservation-detail">
                            <strong>Fechas:</strong>
                            <span>${checkIn} - ${checkOut}</span>
                        </div>
                        <div class="reservation-detail">
                            <strong>Huéspedes:</strong>
                            <span>${reservation.guests}</span>
                        </div>
                        <div class="reservation-detail">
                            <strong>Total:</strong>
                            <span>$${reservation.totalPrice.toLocaleString('es-CO')}</span>
                        </div>
                        <div class="reservation-detail">
                            <strong>Estado:</strong>
                            <span class="status-badge status-${reservation.status}">${this.getStatusText(reservation.status)}</span>
                        </div>
                    </div>
                    ${reservation.notes ? `<p><strong>Notas:</strong> ${reservation.notes}</p>` : ''}
                    <div class="reservation-admin-actions">
                        <button class="btn-outline btn-small" onclick="adminManager.viewReservationDetails('${reservation.id}')">
                            Ver Detalles
                        </button>
                        ${reservation.status === 'active' ? `
                            <button class="btn-danger btn-small" onclick="adminManager.cancelReservation('${reservation.id}')">
                                Cancelar
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Carga los usuarios
     */
    loadUsers() {
        const usersList = document.getElementById('usersAdminList');
        if (!usersList) return;

        const users = hotelStorage.getUsers();
        
        if (users.length === 0) {
            usersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>No hay usuarios registrados</h3>
                    <p>No se encontraron usuarios en el sistema</p>
                </div>
            `;
            return;
        }

        usersList.innerHTML = users.map(user => `
            <div class="user-admin-item">
                <h4>${user.name}</h4>
                <div class="reservation-details">
                    <div class="reservation-detail">
                        <strong>Email:</strong>
                        <span>${user.email}</span>
                    </div>
                    <div class="reservation-detail">
                        <strong>Teléfono:</strong>
                        <span>${user.phone}</span>
                    </div>
                    <div class="reservation-detail">
                        <strong>Identificación:</strong>
                        <span>${user.identification}</span>
                    </div>
                    <div class="reservation-detail">
                        <strong>Nacionalidad:</strong>
                        <span>${user.nationality}</span>
                    </div>
                    <div class="reservation-detail">
                        <strong>Rol:</strong>
                        <span class="status-badge ${user.role === 'admin' ? 'status-active' : 'status-pending'}">${user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
                    </div>
                    <div class="reservation-detail">
                        <strong>Registrado:</strong>
                        <span>${new Date(user.createdAt).toLocaleDateString('es-CO')}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Muestra el formulario de habitación
     */
    showRoomForm(roomId = null) {
        const modal = document.getElementById('roomFormModal');
        const title = document.getElementById('roomFormTitle');
        const form = document.getElementById('roomForm');
        
        if (!modal || !title || !form) return;

        if (roomId) {
            // Editar habitación existente
            const room = hotelStorage.getRoomById(roomId);
            if (!room) return;

            title.textContent = 'Editar Habitación';
            this.populateRoomForm(room);
        } else {
            // Nueva habitación
            title.textContent = 'Agregar Habitación';
            form.reset();
            document.getElementById('roomId').value = '';
        }

        modal.style.display = 'block';
    }

    /**
     * Llena el formulario con datos de una habitación
     */
    populateRoomForm(room) {
        document.getElementById('roomId').value = room.id;
        document.getElementById('roomNumber').value = room.number;
        document.getElementById('roomType').value = room.type;
        document.getElementById('maxGuests').value = room.maxGuests;
        document.getElementById('beds').value = room.beds;
        document.getElementById('pricePerNight').value = room.pricePerNight;
        document.getElementById('roomImage').value = room.image;
        document.getElementById('roomDescription').value = room.description;

        // Marcar servicios
        const serviceCheckboxes = document.querySelectorAll('.services-checkboxes input[type="checkbox"]');
        serviceCheckboxes.forEach(checkbox => {
            checkbox.checked = room.services.includes(checkbox.value);
        });
    }

    /**
     * Maneja el formulario de habitación
     */
    handleRoomForm() {
        const formData = {
            number: document.getElementById('roomNumber').value,
            type: document.getElementById('roomType').value,
            maxGuests: parseInt(document.getElementById('maxGuests').value),
            beds: parseInt(document.getElementById('beds').value),
            pricePerNight: parseFloat(document.getElementById('pricePerNight').value),
            image: document.getElementById('roomImage').value,
            description: document.getElementById('roomDescription').value,
            services: Array.from(document.querySelectorAll('.services-checkboxes input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value)
        };

        const roomId = document.getElementById('roomId').value;

        // Validaciones
        if (!this.validateRoomForm(formData)) {
            return;
        }

        try {
            if (roomId) {
                // Actualizar habitación existente
                hotelStorage.updateRoom(roomId, formData);
                this.showSuccess('Habitación actualizada exitosamente');
            } else {
                // Crear nueva habitación
                hotelStorage.addRoom(formData);
                this.showSuccess('Habitación agregada exitosamente');
            }

            this.closeModal(document.getElementById('roomFormModal'));
            this.loadRooms();
        } catch (error) {
            console.error('Error al guardar habitación:', error);
            this.showError('Error al guardar la habitación');
        }
    }

    /**
     * Valida el formulario de habitación
     */
    validateRoomForm(data) {
        const errors = [];

        if (!data.number || data.number.length < 1) {
            errors.push('El número de habitación es requerido');
        }

        if (!data.type) {
            errors.push('El tipo de habitación es requerido');
        }

        if (!data.maxGuests || data.maxGuests < 1 || data.maxGuests > 6) {
            errors.push('El número máximo de huéspedes debe estar entre 1 y 6');
        }

        if (!data.beds || data.beds < 1 || data.beds > 4) {
            errors.push('El número de camas debe estar entre 1 y 4');
        }

        if (!data.pricePerNight || data.pricePerNight < 0) {
            errors.push('El precio por noche debe ser mayor a 0');
        }

        if (!data.image || !this.isValidUrl(data.image)) {
            errors.push('Ingresa una URL de imagen válida');
        }

        if (!data.description || data.description.length < 10) {
            errors.push('La descripción debe tener al menos 10 caracteres');
        }

        if (errors.length > 0) {
            this.showError(errors.join('<br>'));
            return false;
        }

        return true;
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
     * Edita una habitación
     */
    editRoom(roomId) {
        this.showRoomForm(roomId);
    }

    /**
     * Elimina una habitación
     */
    deleteRoom(roomId) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
            return;
        }

        try {
            hotelStorage.deleteRoom(roomId);
            this.showSuccess('Habitación eliminada exitosamente');
            this.loadRooms();
        } catch (error) {
            console.error('Error al eliminar habitación:', error);
            this.showError('Error al eliminar la habitación');
        }
    }

    /**
     * Ve los detalles de una reserva
     */
    viewReservationDetails(reservationId) {
        const reservation = hotelStorage.getReservations().find(r => r.id === reservationId);
        if (!reservation) return;

        const room = hotelStorage.getRoomById(reservation.roomId);
        const user = hotelStorage.getUserById(reservation.userId);
        const modal = document.getElementById('reservationDetailsModal');
        const content = document.getElementById('reservationDetailsContent');

        if (!modal || !content) return;

        const checkIn = new Date(reservation.checkIn).toLocaleDateString('es-CO');
        const checkOut = new Date(reservation.checkOut).toLocaleDateString('es-CO');
        const totalNights = Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24));

        content.innerHTML = `
            <div class="reservation-details">
                <h3>Detalles de la Reserva</h3>
                <div class="reservation-detail">
                    <strong>ID de Reserva:</strong>
                    <span>${reservation.id}</span>
                </div>
                <div class="reservation-detail">
                    <strong>Cliente:</strong>
                    <span>${user ? user.name : 'Usuario no encontrado'}</span>
                </div>
                <div class="reservation-detail">
                    <strong>Email:</strong>
                    <span>${user ? user.email : 'N/A'}</span>
                </div>
                <div class="reservation-detail">
                    <strong>Teléfono:</strong>
                    <span>${user ? user.phone : 'N/A'}</span>
                </div>
                <div class="reservation-detail">
                    <strong>Habitación:</strong>
                    <span>${room ? `${room.number} - ${this.getRoomTypeName(room.type)}` : 'Habitación no encontrada'}</span>
                </div>
                <div class="reservation-detail">
                    <strong>Check-in:</strong>
                    <span>${checkIn}</span>
                </div>
                <div class="reservation-detail">
                    <strong>Check-out:</strong>
                    <span>${checkOut}</span>
                </div>
                <div class="reservation-detail">
                    <strong>Noches:</strong>
                    <span>${totalNights}</span>
                </div>
                <div class="reservation-detail">
                    <strong>Huéspedes:</strong>
                    <span>${reservation.guests}</span>
                </div>
                <div class="reservation-detail">
                    <strong>Total:</strong>
                    <span>$${reservation.totalPrice.toLocaleString('es-CO')}</span>
                </div>
                <div class="reservation-detail">
                    <strong>Estado:</strong>
                    <span class="status-badge status-${reservation.status}">${this.getStatusText(reservation.status)}</span>
                </div>
                <div class="reservation-detail">
                    <strong>Fecha de Creación:</strong>
                    <span>${new Date(reservation.createdAt).toLocaleDateString('es-CO')}</span>
                </div>
                ${reservation.notes ? `
                    <div class="reservation-detail">
                        <strong>Notas:</strong>
                        <span>${reservation.notes}</span>
                    </div>
                ` : ''}
                ${reservation.cancelledAt ? `
                    <div class="reservation-detail">
                        <strong>Fecha de Cancelación:</strong>
                        <span>${new Date(reservation.cancelledAt).toLocaleDateString('es-CO')}</span>
                    </div>
                ` : ''}
            </div>
        `;

        modal.style.display = 'block';
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
            this.showSuccess('Reserva cancelada exitosamente');
            this.loadReservations();
        } catch (error) {
            console.error('Error al cancelar reserva:', error);
            this.showError('Error al cancelar la reserva');
        }
    }

    /**
     * Cierra un modal
     */
    closeModal(modal) {
        modal.style.display = 'none';
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
     * Muestra un mensaje de error
     */
    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-error';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 3000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    /**
     * Muestra un mensaje de éxito
     */
    showSuccess(message) {
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

// Crear instancia global del gestor de administración
window.adminManager = new AdminManager();
