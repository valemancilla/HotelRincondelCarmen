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
            searchBtn.addEventListener('click', () => {
                this.searchAvailableRooms();
            });
        }

        // Eventos de formulario de contacto
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }
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

// Crear instancia global del gestor de reservas
window.reservationManager = new ReservationManager();

