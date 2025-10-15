/**
 * WEB COMPONENTS PARA EL HOTEL EL RINCÓN DEL CARMEN
 * 
 * Este archivo contiene componentes web reutilizables que se integran
 * perfectamente con la funcionalidad existente del sistema.
 * Utiliza Web Components nativos (Vanilla JS) para máxima compatibilidad.
 */

/**
 * COMPONENTE: HotelCard
 * Muestra información de una habitación del hotel con acciones de reserva
 */
class HotelCard extends HTMLElement {
    constructor() {
        super();
        this.room = null;
        this.checkIn = null;
        this.checkOut = null;
        this.guests = 1;
    }

    // Definir qué atributos observará el componente
    static get observedAttributes() {
        return ['room-id', 'check-in', 'check-out', 'guests', 'show-actions'];
    }

    // Se ejecuta cuando se agrega el componente al DOM
    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    // Se ejecuta cuando cambian los atributos observados
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.updateData();
            this.render();
        }
    }

    // Actualizar datos internos basados en atributos
    updateData() {
        const roomId = this.getAttribute('room-id');
        if (roomId && window.storageManager) {
            this.room = window.storageManager.getRoomById(parseInt(roomId));
        }
        
        this.checkIn = this.getAttribute('check-in');
        this.checkOut = this.getAttribute('check-out');
        this.guests = parseInt(this.getAttribute('guests') || '1');
        this.showActions = this.getAttribute('show-actions') !== 'false';
    }

    // Renderizar el componente
    render() {
        if (!this.room) {
            this.innerHTML = '<div class="loading">Cargando habitación...</div>';
            return;
        }

        const priceCalculation = window.storageManager ? 
            window.storageManager.calculateTotalPrice(this.room, this.checkIn, this.checkOut, this.guests) : 
            { totalPrice: this.room.pricePerNight, nights: 1 };

        const totalNights = priceCalculation.nights || 1;
        const services = this.getServiceIcons(this.room.services || []);

        this.innerHTML = `
            <div class="room-card card-hover">
                <img src="${this.room.image}" alt="Habitación ${this.room.number}" class="room-image">
                <div class="room-content">
                    <h3 class="room-title">${this.room.name}</h3>
                    <div class="room-price">COP $${this.room.pricePerNight.toLocaleString('es-CO')}/noche</div>
                    ${this.checkIn && this.checkOut ? `
                        <div class="room-total-price">
                            <strong>Total ${totalNights} ${totalNights === 1 ? 'noche' : 'noches'}: COP $${priceCalculation.totalPrice.toLocaleString('es-CO')}</strong>
                        </div>
                    ` : ''}
                    <ul class="room-features">
                        <li>Máximo ${this.room.maxGuests} huéspedes</li>
                        <li>${this.room.beds} ${this.room.beds === 1 ? 'cama' : 'camas'}</li>
                        <li>${this.getRoomTypeName(this.room.type)}</li>
                    </ul>
                    <div class="room-services">
                        ${services}
                    </div>
                    <p class="room-description">${this.room.description}</p>
                    ${this.showActions ? `
                        <div class="room-actions">
                            <button class="btn-outline view-room-details" data-room-id="${this.room.id}">
                                Ver Detalles
                            </button>
                            <button class="btn-primary reserve-room" data-room-id="${this.room.id}">
                                Reservar Ahora
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Vincular eventos del componente
    bindEvents() {
        // Los eventos se manejan por event delegation en el documento principal
        // para mantener la compatibilidad con el sistema existente
    }

    // Obtener iconos de servicios
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

    // Obtener nombre del tipo de habitación
    getRoomTypeName(type) {
        const types = {
            'standard': 'Estándar',
            'deluxe': 'Deluxe',
            'suite': 'Suite',
            'presidential': 'Presidencial',
            'villa': 'Villa'
        };
        return types[type] || type;
    }
}

/**
 * COMPONENTE: ReservationCard
 * Muestra información de una reserva del usuario
 */
class ReservationCard extends HTMLElement {
    constructor() {
        super();
        this.reservation = null;
        this.room = null;
    }

    static get observedAttributes() {
        return ['reservation-id'];
    }

    connectedCallback() {
        this.updateData();
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.updateData();
            this.render();
        }
    }

    updateData() {
        const reservationId = this.getAttribute('reservation-id');
        if (reservationId && window.storageManager) {
            const reservations = window.storageManager.getAllReservations();
            this.reservation = reservations.find(r => r.id === parseInt(reservationId));
            if (this.reservation) {
                this.room = window.storageManager.getRoomById(this.reservation.roomId);
            }
        }
    }

    render() {
        if (!this.reservation || !this.room) {
            this.innerHTML = '<div class="loading">Cargando reserva...</div>';
            return;
        }

        const checkIn = new Date(this.reservation.checkIn).toLocaleDateString('es-CO');
        const checkOut = new Date(this.reservation.checkOut).toLocaleDateString('es-CO');
        const totalNights = Math.ceil((new Date(this.reservation.checkOut) - new Date(this.reservation.checkIn)) / (1000 * 60 * 60 * 24));
        const totalPrice = this.reservation.totalPrice || (totalNights * this.room.pricePerNight);
        
        const statusIcon = this.reservation.status === 'pending' ? 'clock' : 
                          this.reservation.status === 'confirmed' ? 'check-circle' : 
                          this.reservation.status === 'cancelled' ? 'times-circle' : 'circle';
        const statusText = this.getStatusText(this.reservation.status);
        const statusClass = this.reservation.status === 'cancelled' ? 'cancelled-reservation' : '';
        const cancelledOverlay = this.reservation.status === 'cancelled' ? '<div class="cancelled-overlay">CANCELADA</div>' : '';
        
        const nightsText = totalNights === 1 ? 'noche' : 'noches';
        const guestsText = this.reservation.guests === 1 ? 'huésped' : 'huéspedes';
        const priceClass = this.reservation.status === 'cancelled' ? 'cancelled-price' : '';

        this.innerHTML = `
            <div class="reservation-card-vertical ${statusClass}">
                <div class="reservation-image-top">
                    <img src="${this.room.image}" alt="${this.room.name}">
                    <div class="status-overlay status-${this.reservation.status}">
                        <i class="fas fa-${statusIcon}"></i> ${statusText}
                    </div>
                    ${cancelledOverlay}
                </div>
                <div class="reservation-content-vertical">
                    <h3 class="room-name-vertical">${this.room.name}</h3>
                    <div class="dates-section">
                        <div class="date-box">
                            <i class="fas fa-sign-in-alt"></i>
                            <div>
                                <small>Check-in</small>
                                <strong>${checkIn}</strong>
                            </div>
                        </div>
                        <div class="nights-indicator">
                            <i class="fas fa-moon"></i> ${totalNights} ${nightsText}
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
                        <span>${this.reservation.guests} ${guestsText}</span>
                    </div>
                    <div class="price-box ${priceClass}">
                        <div class="price-total">Total: COP $${totalPrice.toLocaleString('es-CO')}</div>
                    </div>
                    ${this.reservation.status !== 'cancelled' ? `
                        <div class="reservation-info-message">
                            <i class="fas fa-info-circle"></i>
                            <p>Para modificar o cancelar su reserva, por favor contacte con el hotel:</p>
                            <p class="contact-details">
                                <i class="fas fa-phone"></i> +57 3137713137 | 
                                <i class="fas fa-envelope"></i> reservations@saintsuitesoia.com
                            </p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statuses = {
            'pending': 'Pendiente',
            'confirmed': 'Confirmada',
            'cancelled': 'Cancelada',
            'completed': 'Completada'
        };
        return statuses[status] || status;
    }
}

/**
 * COMPONENTE: NotificationSystem
 * Sistema de notificaciones reutilizable
 */
class NotificationSystem extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // El componente se inicializa cuando se agrega al DOM
        this.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 3000;
            pointer-events: none;
        `;
    }

    // Método para mostrar notificación
    showNotification(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
            animation: slideInRight 0.3s ease;
            pointer-events: auto;
        `;

        const icon = this.getNotificationIcon(type);
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i> ${message}
        `;

        this.appendChild(notification);

        // Auto-eliminar después del tiempo especificado
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);

        return notification;
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };
        return colors[type] || colors['info'];
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || icons['info'];
    }
}

/**
 * COMPONENTE: ModalComponent
 * Modal reutilizable para diferentes propósitos
 */
class ModalComponent extends HTMLElement {
    constructor() {
        super();
        this.isOpen = false;
    }

    static get observedAttributes() {
        return ['modal-id', 'title'];
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'title') {
            this.updateTitle();
        }
    }

    render() {
        const modalId = this.getAttribute('modal-id') || 'custom-modal';
        const title = this.getAttribute('title') || '';

        this.innerHTML = `
            <div class="modal" id="${modalId}" style="display: none;">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2 class="modal-title">${title}</h2>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const closeBtn = this.querySelector('.close');
        const modal = this.querySelector('.modal');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close();
                }
            });
        }

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        const modal = this.querySelector('.modal');
        if (modal) {
            modal.style.display = 'block';
            this.isOpen = true;
            this.dispatchEvent(new CustomEvent('modal-opened', { detail: { modal: this } }));
        }
    }

    close() {
        const modal = this.querySelector('.modal');
        if (modal) {
            modal.style.display = 'none';
            this.isOpen = false;
            this.dispatchEvent(new CustomEvent('modal-closed', { detail: { modal: this } }));
        }
    }

    updateTitle() {
        const titleElement = this.querySelector('.modal-title');
        if (titleElement) {
            titleElement.textContent = this.getAttribute('title') || '';
        }
    }

    // Método para establecer contenido dinámico
    setContent(content) {
        const modalBody = this.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = content;
        }
    }
}

// Registrar todos los componentes que se usan
customElements.define('hotel-card', HotelCard);
customElements.define('reservation-card', ReservationCard);
customElements.define('notification-system', NotificationSystem);
customElements.define('modal-component', ModalComponent);

/**
 * FUNCIONES UTILITARIAS PARA WEB COMPONENTS
 */

// Función para mostrar notificaciones usando el sistema de componentes
function showComponentNotification(message, type = 'success', duration = 3000) {
    let notificationSystem = document.querySelector('notification-system');
    
    if (!notificationSystem) {
        notificationSystem = document.createElement('notification-system');
        document.body.appendChild(notificationSystem);
    }
    
    return notificationSystem.showNotification(message, type, duration);
}


// Función para renderizar múltiples habitaciones usando componentes
function renderRoomsWithComponents(rooms, containerId, checkIn = null, checkOut = null, guests = 1) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (rooms.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bed"></i>
                <h3>No hay habitaciones disponibles</h3>
                <p>No encontramos habitaciones disponibles para los criterios seleccionados.</p>
            </div>
        `;
        return;
    }

    rooms.forEach(room => {
        const hotelCard = document.createElement('hotel-card');
        hotelCard.setAttribute('room-id', room.id);
        if (checkIn) hotelCard.setAttribute('check-in', checkIn);
        if (checkOut) hotelCard.setAttribute('check-out', checkOut);
        hotelCard.setAttribute('guests', guests);
        
        container.appendChild(hotelCard);
    });
}

// Función para renderizar reservas usando componentes
function renderReservationsWithComponents(reservations, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (reservations.length === 0) {
        const url = window.location.pathname.includes('html/') ? 'reservas.html' : 'html/reservas.html';
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <h3>No tienes reservas</h3>
                <p>¡Haz tu primera reserva ahora!</p>
                <a href="${url}" class="btn-suites">VER HABITACIONES</a>
            </div>
        `;
        return;
    }

    reservations.forEach(reservation => {
        const reservationCard = document.createElement('reservation-card');
        reservationCard.setAttribute('reservation-id', reservation.id);
        container.appendChild(reservationCard);
    });
}

// Función para crear un modal dinámico
function createDynamicModal(id, title, content) {
    let modal = document.getElementById(id);
    
    if (!modal) {
        modal = document.createElement('modal-component');
        modal.setAttribute('modal-id', id);
        modal.setAttribute('title', title);
        document.body.appendChild(modal);
    }
    
    modal.setContent(content);
    return modal;
}

// Exportar funciones para uso global
window.WebComponentsUtils = {
    showNotification: showComponentNotification,
    createModal: createDynamicModal,
    renderRooms: renderRoomsWithComponents,
    renderReservations: renderReservationsWithComponents
};

console.log('Web Components cargados exitosamente');
