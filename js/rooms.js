/**
 * Gestión de habitaciones para el Hotel el Rincón del Carmen
 * Maneja la visualización y gestión de habitaciones
 */

class RoomManager {
    constructor() {
        this.init();
    }

    /**
     * Inicializa el gestor de habitaciones
     */
    init() {
        this.loadRoomsCarousel();
        this.bindEvents();
    }

    /**
     * Vincula eventos relacionados con habitaciones
     */
    bindEvents() {
        // Eventos de búsqueda
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.searchAvailableRooms();
            });
        }

        // Eventos de detalles de habitación
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-room-details')) {
                e.preventDefault();
                const roomId = e.target.dataset.roomId;
                this.showRoomDetails(roomId);
            }
        });

        // Eventos de reserva
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('reserve-room')) {
                e.preventDefault();
                const roomId = e.target.dataset.roomId;
                this.showReservationModal(roomId);
            }
        });
    }

    /**
     * Carga el carrusel de habitaciones en la página principal
     */
    loadRoomsCarousel() {
        const carousel = document.getElementById('roomsCarousel');
        if (!carousel) return;

        const rooms = hotelStorage.getRooms().filter(room => room.isActive);
        
        if (rooms.length === 0) {
            carousel.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bed"></i>
                    <h3>No hay habitaciones disponibles</h3>
                    <p>Pronto tendremos nuevas habitaciones para ti</p>
                </div>
            `;
            return;
        }

        carousel.innerHTML = rooms.slice(0, 6).map(room => this.createRoomCard(room)).join('');
    }

    /**
     * Crea una tarjeta de habitación
     */
    createRoomCard(room) {
        const services = this.getServiceIcons(room.services);
        
        return `
            <div class="room-card card-hover">
                <img src="${room.image}" alt="Habitación ${room.number}" class="room-image">
                <div class="room-content">
                    <h3 class="room-title">Habitación ${room.number}</h3>
                    <div class="room-price">$${room.pricePerNight.toLocaleString('es-CO')}/noche</div>
                    <ul class="room-features">
                        <li>Máximo ${room.maxGuests} huéspedes</li>
                        <li>${room.beds} ${room.beds === 1 ? 'cama' : 'camas'}</li>
                        <li>${this.getRoomTypeName(room.type)}</li>
                    </ul>
                    <div class="room-services">
                        ${services}
                    </div>
                    <p class="room-description">${room.description}</p>
                    <div class="room-actions">
                        <button class="btn-outline view-room-details" data-room-id="${room.id}">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Busca habitaciones disponibles
     */
    searchAvailableRooms() {
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const guests = parseInt(document.getElementById('guests').value);

        // Validaciones
        if (!checkIn || !checkOut) {
            this.showError('Por favor selecciona las fechas de entrada y salida');
            return;
        }

        if (new Date(checkIn) >= new Date(checkOut)) {
            this.showError('La fecha de salida debe ser posterior a la fecha de entrada');
            return;
        }

        if (new Date(checkIn) < new Date().setHours(0, 0, 0, 0)) {
            this.showError('La fecha de entrada no puede ser anterior a hoy');
            return;
        }

        // Buscar habitaciones disponibles
        const availableRooms = hotelStorage.getAvailableRooms(checkIn, checkOut, guests);
        this.displayAvailableRooms(availableRooms, checkIn, checkOut, guests);
    }

    /**
     * Muestra las habitaciones disponibles
     */
    displayAvailableRooms(rooms, checkIn, checkOut, guests) {
        const resultsSection = document.getElementById('resultsSection');
        const availableRoomsContainer = document.getElementById('availableRooms');

        if (!resultsSection || !availableRoomsContainer) return;

        if (rooms.length === 0) {
            availableRoomsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bed"></i>
                    <h3>No hay habitaciones disponibles</h3>
                    <p>No encontramos habitaciones disponibles para las fechas y número de huéspedes seleccionados.</p>
                    <p>Intenta con otras fechas o un número menor de huéspedes.</p>
                </div>
            `;
        } else {
            const totalNights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
            
            availableRoomsContainer.innerHTML = rooms.map(room => {
                const totalPrice = totalNights * room.pricePerNight;
                const services = this.getServiceIcons(room.services);
                
                return `
                    <div class="room-card card-hover">
                        <img src="${room.image}" alt="Habitación ${room.number}" class="room-image">
                        <div class="room-content">
                            <h3 class="room-title">Habitación ${room.number}</h3>
                            <div class="room-price">$${room.pricePerNight.toLocaleString('es-CO')}/noche</div>
                            <div class="room-total-price">
                                <strong>Total ${totalNights} ${totalNights === 1 ? 'noche' : 'noches'}: $${totalPrice.toLocaleString('es-CO')}</strong>
                            </div>
                            <ul class="room-features">
                                <li>Máximo ${room.maxGuests} huéspedes</li>
                                <li>${room.beds} ${room.beds === 1 ? 'cama' : 'camas'}</li>
                                <li>${this.getRoomTypeName(room.type)}</li>
                            </ul>
                            <div class="room-services">
                                ${services}
                            </div>
                            <p class="room-description">${room.description}</p>
                            <div class="room-actions">
                                <button class="btn-outline view-room-details" data-room-id="${room.id}">
                                    Ver Detalles
                                </button>
                                <button class="btn-primary reserve-room" data-room-id="${room.id}">
                                    Reservar Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Muestra los detalles de una habitación
     */
    showRoomDetails(roomId) {
        const room = hotelStorage.getRoomById(roomId);
        if (!room) return;

        const modal = document.getElementById('roomDetailsModal');
        const content = document.getElementById('roomDetailsContent');
        
        if (!modal || !content) return;

        const services = this.getServiceList(room.services);
        
        content.innerHTML = `
            <div class="room-details-header">
                <img src="${room.image}" alt="Habitación ${room.number}" class="room-details-image">
                <div class="room-details-info">
                    <h3>Habitación ${room.number}</h3>
                    <div class="room-details-price">$${room.pricePerNight.toLocaleString('es-CO')}/noche</div>
                    <ul class="room-details-features">
                        <li><strong>Tipo:</strong> ${this.getRoomTypeName(room.type)}</li>
                        <li><strong>Máximo de huéspedes:</strong> ${room.maxGuests}</li>
                        <li><strong>Camas:</strong> ${room.beds} ${room.beds === 1 ? 'cama' : 'camas'}</li>
                    </ul>
                    <div class="room-details-description">
                        <strong>Descripción:</strong><br>
                        ${room.description}
                    </div>
                    <div class="room-details-services">
                        <strong>Servicios incluidos:</strong>
                        <ul class="room-details-features">
                            ${services.map(service => `<li>${service}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="room-details-actions">
                <button class="btn-outline" onclick="this.closest('.modal').style.display='none'">
                    Cerrar
                </button>
                <button class="btn-primary reserve-room" data-room-id="${room.id}">
                    Reservar Esta Habitación
                </button>
            </div>
        `;

        modal.style.display = 'block';
    }

    /**
     * Muestra el modal de reserva
     */
    showReservationModal(roomId) {
        if (!authManager.isAuthenticated()) {
            authManager.showLoginModal();
            return;
        }

        const room = hotelStorage.getRoomById(roomId);
        if (!room) return;

        const checkIn = document.getElementById('checkIn')?.value;
        const checkOut = document.getElementById('checkOut')?.value;
        const guests = parseInt(document.getElementById('guests')?.value || '1');

        if (!checkIn || !checkOut) {
            this.showError('Por favor selecciona las fechas de entrada y salida primero');
            return;
        }

        const modal = document.getElementById('reservationModal');
        const summary = document.getElementById('reservationSummary');
        
        if (!modal || !summary) return;

        const totalNights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        const totalPrice = totalNights * room.pricePerNight;

        summary.innerHTML = `
            <h3>Resumen de Reserva</h3>
            <div class="reservation-summary-item">
                <span>Habitación:</span>
                <span>${room.number} - ${this.getRoomTypeName(room.type)}</span>
            </div>
            <div class="reservation-summary-item">
                <span>Check-in:</span>
                <span>${new Date(checkIn).toLocaleDateString('es-CO')}</span>
            </div>
            <div class="reservation-summary-item">
                <span>Check-out:</span>
                <span>${new Date(checkOut).toLocaleDateString('es-CO')}</span>
            </div>
            <div class="reservation-summary-item">
                <span>Noches:</span>
                <span>${totalNights}</span>
            </div>
            <div class="reservation-summary-item">
                <span>Huéspedes:</span>
                <span>${guests}</span>
            </div>
            <div class="reservation-summary-item">
                <span>Precio por noche:</span>
                <span>$${room.pricePerNight.toLocaleString('es-CO')}</span>
            </div>
            <div class="reservation-summary-item">
                <span>Total:</span>
                <span>$${totalPrice.toLocaleString('es-CO')}</span>
            </div>
        `;

        modal.style.display = 'block';

        // Configurar el formulario de reserva
        const form = document.getElementById('reservationForm');
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                this.processReservation(roomId, checkIn, checkOut, guests);
            };
        }
    }

    /**
     * Procesa la reserva
     */
    processReservation(roomId, checkIn, checkOut, guests) {
        try {
            // Verificar disponibilidad nuevamente
            if (!hotelStorage.checkRoomAvailability(roomId, checkIn, checkOut)) {
                this.showError('Lo sentimos, esta habitación ya no está disponible para las fechas seleccionadas');
                return;
            }

            const notes = document.getElementById('reservationNotes').value;
            const user = authManager.getCurrentUser();

            const reservationData = {
                roomId: roomId,
                userId: user.id,
                checkIn: checkIn,
                checkOut: checkOut,
                guests: guests,
                notes: notes,
                totalPrice: Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) * hotelStorage.getRoomById(roomId).pricePerNight
            };

            const reservation = hotelStorage.addReservation(reservationData);
            
            this.closeModal(document.getElementById('reservationModal'));
            this.showSuccess('¡Reserva confirmada exitosamente!');
            
            // Actualizar la interfaz
            if (authManager.loadUserReservations) {
                authManager.loadUserReservations();
            }

        } catch (error) {
            console.error('Error al procesar reserva:', error);
            this.showError('Error al procesar la reserva. Por favor intenta nuevamente.');
        }
    }

    /**
     * Cierra un modal
     */
    closeModal(modal) {
        modal.style.display = 'none';
    }

    /**
     * Obtiene los iconos de servicios
     */
    getServiceIcons(services) {
        const serviceIcons = {
            'wifi': '<i class="fas fa-wifi" title="WiFi Gratuito"></i>',
            'tv': '<i class="fas fa-tv" title="TV por Cable"></i>',
            'ac': '<i class="fas fa-snowflake" title="Aire Acondicionado"></i>',
            'minibar': '<i class="fas fa-wine-bottle" title="Minibar"></i>',
            'jacuzzi': '<i class="fas fa-hot-tub" title="Jacuzzi"></i>',
            'balcony': '<i class="fas fa-door-open" title="Balcón"></i>',
            'roomservice': '<i class="fas fa-concierge-bell" title="Room Service"></i>',
            'safe': '<i class="fas fa-lock" title="Caja Fuerte"></i>'
        };

        return services.map(service => serviceIcons[service] || '').join(' ');
    }

    /**
     * Obtiene la lista de servicios
     */
    getServiceList(services) {
        const serviceNames = {
            'wifi': 'WiFi Gratuito',
            'tv': 'TV por Cable',
            'ac': 'Aire Acondicionado',
            'minibar': 'Minibar',
            'jacuzzi': 'Jacuzzi',
            'balcony': 'Balcón',
            'roomservice': 'Room Service',
            'safe': 'Caja Fuerte'
        };

        return services.map(service => serviceNames[service] || service);
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

// Crear instancia global del gestor de habitaciones
window.roomManager = new RoomManager();
