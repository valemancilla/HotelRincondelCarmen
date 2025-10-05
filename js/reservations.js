/**
 * Gestión de reservas para el Hotel el Rincón del Carmen
 * Maneja la lógica de reservas y disponibilidad
 */

class ReservationManager {
    constructor() {
        this.init();
    }

    /**
     * Inicializa el gestor de reservas
     */
    init() {
        this.bindEvents();
        this.setupDateInputs();
    }

    /**
     * Vincula eventos relacionados con reservas
     */
    bindEvents() {
        // Eventos de búsqueda
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            console.log('Botón de búsqueda encontrado, agregando evento...');
            searchBtn.addEventListener('click', () => {
                console.log('Botón de búsqueda clickeado');
                this.searchAvailableRooms();
            });
        } else {
            console.error('Botón de búsqueda no encontrado');
        }

        // Eventos de formulario de contacto
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }

        // Eventos de reserva (usando delegación de eventos)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('reserve-room')) {
                const roomId = parseInt(e.target.getAttribute('data-room-id'));
                this.handleReservation(roomId);
            }
            
            if (e.target.classList.contains('view-room-details')) {
                const roomId = parseInt(e.target.getAttribute('data-room-id'));
                this.showRoomDetails(roomId);
            }
            
            // Cerrar modal de detalles
            if (e.target.classList.contains('close') || e.target.id === 'roomDetailsModal') {
                const modal = document.getElementById('roomDetailsModal');
                if (modal) {
                    modal.style.display = 'none';
                }
            }
        });
    }

    /**
     * Configura los inputs de fecha
     */
    setupDateInputs() {
        const checkInInput = document.getElementById('checkIn');
        const checkOutInput = document.getElementById('checkOut');

        if (checkInInput) {
            // Establecer fecha mínima como hoy
            const today = new Date().toISOString().split('T')[0];
            checkInInput.min = today;

            // Actualizar fecha mínima de salida cuando cambie la fecha de entrada
            checkInInput.addEventListener('change', () => {
                if (checkOutInput) {
                    const checkInDate = new Date(checkInInput.value);
                    const nextDay = new Date(checkInDate);
                    nextDay.setDate(nextDay.getDate() + 1);
                    checkOutInput.min = nextDay.toISOString().split('T')[0];
                    
                    // Si la fecha de salida es anterior a la nueva fecha mínima, limpiarla
                    if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
                        checkOutInput.value = '';
                    }
                }
            });
        }

        if (checkOutInput) {
            // Establecer fecha mínima como mañana
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            checkOutInput.min = tomorrow.toISOString().split('T')[0];
        }
    }

    /**
     * Busca habitaciones disponibles
     */
    searchAvailableRooms() {
        console.log('Iniciando búsqueda...');
        
        const checkIn = document.getElementById('checkIn').value;
        const nights = parseInt(document.getElementById('nights').value);
        const adults = parseInt(document.getElementById('adults').value);
        const children = parseInt(document.getElementById('children').value);
        const totalGuests = adults + children;

        console.log('Datos:', { checkIn, nights, adults, children, totalGuests });

        // Validaciones
        if (!checkIn) {
            this.showError('Por favor selecciona la fecha de entrada');
            return;
        }

        if (new Date(checkIn) < new Date().setHours(0, 0, 0, 0)) {
            this.showError('La fecha de entrada no puede ser anterior a hoy');
            return;
        }

        // Calcular fecha de salida basada en las noches
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + nights);
        const checkOut = checkOutDate.toISOString().split('T')[0];

        console.log('Fechas calculadas:', { checkIn, checkOut });

        // Verificar que storageManager existe
        if (typeof storageManager === 'undefined') {
            console.error('storageManager no está definido');
            this.showError('Error: Sistema de almacenamiento no disponible');
            return;
        }

        // Buscar habitaciones disponibles
        const availableRooms = storageManager.getAvailableRooms(checkIn, checkOut, totalGuests);
        console.log('Habitaciones encontradas:', availableRooms);
        
        this.displayAvailableRooms(availableRooms, checkIn, checkOut, totalGuests);
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
                const amenities = room.amenities ? this.formatAmenities(room.amenities) : '';
                
                return `
                    <div class="room-card card-hover">
                        <img src="${room.images[0]}" alt="${room.name}" class="room-image">
                        <div class="room-content">
                            <h3 class="room-title">${room.name}</h3>
                            <div class="room-price">$${room.pricePerNight.toLocaleString('es-CO')}/noche</div>
                            <div class="room-total-price">
                                <strong>Total ${totalNights} ${totalNights === 1 ? 'noche' : 'noches'}: $${totalPrice.toLocaleString('es-CO')}</strong>
                            </div>
                            <ul class="room-features">
                                <li>Máximo ${room.capacity} huéspedes</li>
                                <li>${room.beds} ${room.beds === 1 ? 'cama' : 'camas'}</li>
                                <li>${this.getRoomTypeName(room.type)}</li>
                            </ul>
                            <div class="room-services">
                                ${services}
                            </div>
                            ${amenities ? `
                            <div class="room-amenities">
                                <h4>Servicios y Amenidades:</h4>
                                ${amenities}
                            </div>
                            ` : ''}
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
     * Maneja el formulario de contacto
     */
    handleContactForm() {
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        // Validaciones
        if (!this.validateContactForm(formData)) {
            return;
        }

        try {
            hotelStorage.addContactMessage(formData);
            this.showSuccess('Mensaje enviado exitosamente. Te contactaremos pronto.');
            document.getElementById('contactForm').reset();
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            this.showError('Error al enviar el mensaje. Por favor intenta nuevamente.');
        }
    }

    /**
     * Valida el formulario de contacto
     */
    validateContactForm(data) {
        const errors = [];

        if (!data.name || data.name.length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Ingresa un email válido');
        }

        if (!data.subject) {
            errors.push('Por favor selecciona un asunto');
        }

        if (!data.message || data.message.length < 10) {
            errors.push('El mensaje debe tener al menos 10 caracteres');
        }

        if (errors.length > 0) {
            this.showError(errors.join('<br>'));
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
     * Obtiene el nombre del tipo de habitación
     */
    getRoomTypeName(type) {
        const types = {
            'standard': 'Estándar',
            'deluxe': 'Deluxe',
            'suite': 'Suite',
            'villa': 'Villa',
            'presidential': 'Presidencial'
        };
        return types[type] || type;
    }

    /**
     * Formatea las amenidades para mostrar
     */
    formatAmenities(amenities) {
        if (!amenities || amenities.length === 0) return '';
        
        return `
            <ul class="amenities-list">
                ${amenities.map(amenity => `<li>• ${amenity}</li>`).join('')}
            </ul>
        `;
    }

    /**
     * Maneja el proceso de reserva
     */
    handleReservation(roomId) {
        // Verificar si el usuario está logueado
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        if (!currentUser) {
            alert('Debes iniciar sesión para hacer una reserva');
            return;
        }

        const checkIn = document.getElementById('checkIn').value;
        const nights = parseInt(document.getElementById('nights').value);
        const adults = parseInt(document.getElementById('adults').value);
        const children = parseInt(document.getElementById('children').value);
        const totalGuests = adults + children;

        if (!checkIn) {
            this.showError('Por favor selecciona la fecha de entrada');
            return;
        }

        // Calcular fecha de salida basada en las noches
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkInDate.getDate() + nights);
        const checkOut = checkOutDate.toISOString().split('T')[0];

        // Crear la reserva
        const reservationData = {
            userId: currentUser.id,
            roomId: roomId,
            checkIn: checkIn,
            checkOut: checkOut,
            guests: totalGuests,
            adults: adults,
            children: children,
            nights: nights,
            status: 'pending'
        };

        try {
            const newReservation = storageManager.addReservation(reservationData);
            alert('Reserva creada exitosamente. Te contactaremos pronto para confirmar.');
            
            // Limpiar el formulario de búsqueda
            document.getElementById('checkIn').value = '';
            document.getElementById('nights').value = '1';
            document.getElementById('adults').value = '2';
            document.getElementById('children').value = '0';
            
            // Ocultar resultados
            document.getElementById('resultsSection').style.display = 'none';
        } catch (error) {
            console.error('Error al crear reserva:', error);
            this.showError('Error al crear la reserva. Inténtalo de nuevo.');
        }
    }

    /**
     * Muestra los detalles de una habitación
     */
    showRoomDetails(roomId) {
        const rooms = storageManager.getData('rooms') || [];
        const room = rooms.find(r => r.id === roomId);
        
        if (!room) {
            this.showError('Habitación no encontrada');
            return;
        }

        const modal = document.getElementById('roomDetailsModal');
        const content = document.getElementById('roomDetailsContent');
        
        if (!modal || !content) return;

        const services = this.getServiceIcons(room.services);
        const checkIn = document.getElementById('checkIn').value;
        const nights = parseInt(document.getElementById('nights').value);
        const adults = parseInt(document.getElementById('adults').value);
        const children = parseInt(document.getElementById('children').value);
        const totalGuests = adults + children;
        
        let totalNights = nights || 1;
        let totalPrice = totalNights * room.pricePerNight;
        
        // Calcular fecha de salida si hay fecha de entrada
        let checkOut = '';
        if (checkIn) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkInDate.getDate() + totalNights);
            checkOut = checkOutDate.toISOString().split('T')[0];
        }

        content.innerHTML = `
            <div class="room-details-header">
                <h2>${room.name}</h2>
                <div class="room-price">$${room.pricePerNight.toLocaleString('es-CO')}/noche</div>
            </div>
            
            <div class="room-details-images">
                <img src="${room.images[0]}" alt="${room.name}" class="room-main-image">
            </div>
            
            <div class="room-details-info">
                <div class="room-specs">
                    <h3>Especificaciones</h3>
                    <ul>
                        <li><strong>Capacidad:</strong> ${room.capacity} huéspedes</li>
                        <li><strong>Camas:</strong> ${room.beds} ${room.beds === 1 ? 'cama' : 'camas'}</li>
                        <li><strong>Tipo:</strong> ${this.getRoomTypeName(room.type)}</li>
                    </ul>
                </div>
                
                <div class="room-services-detail">
                    <h3>Servicios Incluidos</h3>
                    <div class="services-list">
                        ${services}
                    </div>
                </div>
                
                <div class="room-description-detail">
                    <h3>Descripción</h3>
                    <p>${room.description}</p>
                </div>
                
                ${checkIn ? `
                <div class="reservation-summary">
                    <h3>Resumen de Reserva</h3>
                    <ul>
                        <li><strong>Check-in:</strong> ${new Date(checkIn).toLocaleDateString('es-CO')}</li>
                        <li><strong>Check-out:</strong> ${checkOut ? new Date(checkOut).toLocaleDateString('es-CO') : 'Por calcular'}</li>
                        <li><strong>Noches:</strong> ${totalNights}</li>
                        <li><strong>Adultos:</strong> ${adults}</li>
                        <li><strong>Niños:</strong> ${children}</li>
                        <li><strong>Total:</strong> $${totalPrice.toLocaleString('es-CO')}</li>
                    </ul>
                </div>
                ` : ''}
            </div>
        `;

        modal.style.display = 'block';
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

// Crear instancia global del gestor de reservas
window.reservationManager = new ReservationManager();

