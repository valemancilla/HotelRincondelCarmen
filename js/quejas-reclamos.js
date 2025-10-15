/**
 * FUNCIONALIDAD PARA LA PÁGINA DE QUEJAS Y RECLAMOS
 * 
 * Este archivo maneja la funcionalidad completa del sistema de quejas y reclamos
 * para huéspedes del Hotel el Rincón del Carmen.
 */

class ComplaintsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormHandlers();
        this.updateInterfaceBasedOnAuth();
        this.loadUserReservations();
        this.loadUserComplaints();
        this.setupAuthListeners();
    }

    /**
     * Configura los manejadores del formulario
     */
    setupFormHandlers() {
        const form = document.getElementById('complaintForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleComplaintSubmission();
            });
        }

        // Configurar modal de detalle
        this.setupDetailModal();
    }

    /**
     * Configura el modal de detalle de quejas
     */
    setupDetailModal() {
        const modal = document.getElementById('complaintDetailModal');
        const closeBtn = modal.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            };
        }

        // Cerrar modal al hacer clic fuera
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };
    }

    /**
     * Actualiza la interfaz según el estado de autenticación
     */
    updateInterfaceBasedOnAuth() {
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        const loginMessage = document.querySelector('.login-required-message');
        const formContainer = document.querySelector('.complaint-form-container');
        const complaintsContainer = document.querySelector('.complaints-list-container');
        const submitButton = document.querySelector('.submit-complaint-btn');
        
        if (currentUser) {
            // Usuario logueado
            if (loginMessage) {
                loginMessage.className = 'login-required-message authenticated';
                loginMessage.innerHTML = `
                    <i class="fas fa-user-check"></i>
                    <span>¡Hola ${currentUser.name}! Puedes gestionar tus quejas y reclamos.</span>
                `;
            }
            
            // Mostrar formulario y listado
            if (formContainer) formContainer.style.display = 'block';
            if (complaintsContainer) complaintsContainer.style.display = 'block';
            
            // Habilitar botón de envío
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.style.cursor = 'pointer';
            }
            
            // Cargar reservas del usuario
            this.loadUserReservations();
        } else {
            // Usuario no logueado
            if (loginMessage) {
                loginMessage.className = 'login-required-message';
                loginMessage.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Debes iniciar sesión para gestionar tus quejas y reclamos.</span>
                    <a href="#" onclick="document.getElementById('loginModal').style.display='block'; return false;">Iniciar Sesión</a>
                `;
            }
            
            // Ocultar formulario y listado
            if (formContainer) formContainer.style.display = 'none';
            if (complaintsContainer) complaintsContainer.style.display = 'none';
            
            // Deshabilitar botón de envío
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.style.opacity = '0.6';
                submitButton.style.cursor = 'not-allowed';
            }
        }
    }

    /**
     * Configura los listeners para cambios de autenticación
     */
    setupAuthListeners() {
        // Escuchar cambios en localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'current_user') {
                this.updateInterfaceBasedOnAuth();
                this.loadUserReservations();
                this.loadUserComplaints();
            }
        });
        
        // También escuchar cambios en el mismo tab
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            originalSetItem.apply(this, arguments);
            if (key === 'current_user') {
                setTimeout(() => {
                    this.updateInterfaceBasedOnAuth();
                    this.loadUserReservations();
                    this.loadUserComplaints();
                }, 100);
            }
        }.bind(this);
    }

    /**
     * Carga las reservas del usuario para el selector
     */
    loadUserReservations() {
        console.log('Cargando reservas del usuario...');
        
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        const reservationSelect = document.getElementById('reservationSelect');
        
        console.log('Usuario actual:', currentUser);
        console.log('Elemento select:', reservationSelect);
        
        if (!currentUser) {
            console.log('No hay usuario logueado');
            return;
        }
        
        if (!reservationSelect) {
            console.log('No se encontró el elemento reservationSelect');
            return;
        }
        
        // Obtener todas las reservas
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        console.log('Todas las reservas:', reservations);
        
        // Filtrar reservas del usuario actual
        const userReservations = reservations.filter(reservation => 
            reservation.userEmail === currentUser.email
        );
        
        console.log('Reservas del usuario:', userReservations);
        
        // Limpiar opciones existentes (excepto la primera)
        reservationSelect.innerHTML = '<option value="">Selecciona una reserva</option>';
        
        // Eliminar botón de ayuda si existe
        const existingHelpButton = document.getElementById('helpButton');
        if (existingHelpButton) {
            existingHelpButton.remove();
        }
        
        if (userReservations.length === 0) {
            // Agregar opción informativa si no hay reservas
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No tienes reservas disponibles - Haz una reserva primero';
            option.disabled = true;
            reservationSelect.appendChild(option);
            console.log('No hay reservas para mostrar');
            
            // Agregar botón de ayuda temporal
            this.addHelpButton();
            return;
        }
        
        // Agregar reservas del usuario
        userReservations.forEach(reservation => {
            const option = document.createElement('option');
            option.value = reservation.id;
            
            // Obtener información de la habitación
            const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
            const room = rooms.find(r => r.id === reservation.roomId);
            const roomName = room ? room.name : 'Habitación';
            
            // Formatear fechas
            const checkIn = new Date(reservation.checkIn).toLocaleDateString('es-ES');
            const checkOut = new Date(reservation.checkOut).toLocaleDateString('es-ES');
            
            option.textContent = `${roomName} - ${checkIn} a ${checkOut}`;
            reservationSelect.appendChild(option);
            
            console.log('Agregada reserva al selector:', option.textContent);
        });
        
        console.log('Reservas cargadas exitosamente');
    }

    /**
     * Agrega un botón de ayuda cuando no hay reservas
     */
    addHelpButton() {
        const formContainer = document.querySelector('.complaint-form-container');
        if (!formContainer) return;
        
        // Verificar si ya existe el botón de ayuda
        if (document.getElementById('helpButton')) return;
        
        const helpButton = document.createElement('div');
        helpButton.id = 'helpButton';
        helpButton.style.cssText = `
            margin-top: 20px;
            padding: 15px;
            background: #e3f2fd;
            border: 1px solid #2196f3;
            border-radius: 8px;
            text-align: center;
        `;
        
        helpButton.innerHTML = `
            <p style="margin: 0 0 10px 0; color: #1976d2; font-weight: 600;">
                <i class="fas fa-info-circle"></i> Para enviar una queja o reclamo necesitas tener una reserva
            </p>
            <a href="reservas.html" style="
                display: inline-block;
                background: #2196f3;
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                text-decoration: none;
                font-weight: 600;
                font-size: 0.9rem;
            " onmouseover="this.style.background='#1976d2'" onmouseout="this.style.background='#2196f3'">
                <i class="fas fa-calendar-plus"></i> Hacer una Reserva
            </a>
        `;
        
        formContainer.appendChild(helpButton);
    }

    /**
     * Maneja el envío del formulario de quejas/reclamos
     */
    handleComplaintSubmission() {
        console.log('Formulario de queja/reclamo enviado');
        
        // Verificar autenticación
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        if (!currentUser) {
            this.showNotification('Debes iniciar sesión para enviar una queja o reclamo', 'error');
            return;
        }

        const formData = new FormData(document.getElementById('complaintForm'));
        const reservationId = formData.get('reservationId');
        const type = formData.get('type');
        const subject = formData.get('subject');
        const description = formData.get('description');

        console.log('Datos del formulario:', { reservationId, type, subject, description });

        // Validaciones
        if (!reservationId) {
            this.showNotification('Por favor selecciona una reserva', 'error');
            return;
        }

        if (!type) {
            this.showNotification('Por favor selecciona el tipo (Queja o Reclamo)', 'error');
            return;
        }

        if (!subject.trim()) {
            this.showNotification('Por favor ingresa un asunto', 'error');
            return;
        }

        if (!description.trim()) {
            this.showNotification('Por favor escribe una descripción', 'error');
            return;
        }

        // Crear objeto de queja/reclamo
        const complaint = {
            id: Date.now(), // ID único basado en timestamp
            userId: currentUser.id,
            userEmail: currentUser.email,
            userName: currentUser.name,
            reservationId: parseInt(reservationId),
            type: type,
            subject: subject.trim(),
            description: description.trim(),
            date: new Date().toISOString(),
            status: 'pending', // Estado inicial: pendiente
            adminResponse: null // Respuesta del administrador (inicialmente null)
        };

        console.log('Queja/reclamo creado:', complaint);

        // Guardar en localStorage
        this.saveComplaint(complaint);

        // Mostrar mensaje de éxito
        this.showNotification('¡Tu ' + (type === 'queja' ? 'queja' : 'reclamo') + ' ha sido enviado exitosamente!', 'success');
        
        // Limpiar formulario
        document.getElementById('complaintForm').reset();
        
        // Recargar listado
        this.loadUserComplaints();
    }

    /**
     * Guarda la queja/reclamo en localStorage
     */
    saveComplaint(complaint) {
        console.log('Guardando queja/reclamo...');
        
        // Obtener quejas existentes
        let complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        console.log('Quejas existentes:', complaints);
        
        // Agregar nueva queja
        complaints.push(complaint);
        console.log('Quejas actualizadas:', complaints);
        
        // Guardar en localStorage
        localStorage.setItem('complaints', JSON.stringify(complaints));
        
        // Verificar que se guardó correctamente
        const savedComplaints = JSON.parse(localStorage.getItem('complaints'));
        console.log('Quejas guardadas en localStorage:', savedComplaints);
        
        console.log('Queja/reclamo guardado exitosamente:', complaint);
    }

    /**
     * Carga y muestra las quejas/reclamos del usuario
     */
    loadUserComplaints() {
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        const complaintsList = document.getElementById('complaintsList');
        
        if (!currentUser || !complaintsList) return;
        
        // Obtener todas las quejas
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        
        // Filtrar quejas del usuario actual
        const userComplaints = complaints.filter(complaint => 
            complaint.userEmail === currentUser.email
        );
        
        console.log('Quejas del usuario:', userComplaints);
        
        // Mostrar quejas o mensaje vacío
        if (userComplaints.length === 0) {
            complaintsList.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-inbox"></i>
                    <h4>No tienes quejas o reclamos</h4>
                    <p>Cuando envíes una queja o reclamo, aparecerá aquí.</p>
                </div>
            `;
        } else {
            // Ordenar por fecha (más recientes primero)
            userComplaints.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            let html = '';
            userComplaints.forEach(complaint => {
                html += this.createComplaintCard(complaint);
            });
            
            complaintsList.innerHTML = html;
        }
    }

    /**
     * Crea el HTML para una tarjeta de queja/reclamo
     */
    createComplaintCard(complaint) {
        // Formatear fecha
        const date = new Date(complaint.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Obtener información de la reserva
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const reservation = reservations.find(r => r.id === complaint.reservationId);
        
        // Obtener información de la habitación
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
        const room = reservation ? rooms.find(r => r.id === reservation.roomId) : null;
        const roomName = room ? room.name : 'Habitación';

        // Determinar si se puede eliminar (solo si está pendiente)
        const canDelete = complaint.status === 'pending';
        
        // Determinar el color del borde según el estado
        let borderColor = '#b89a7e'; // Por defecto
        if (complaint.status === 'resolved') borderColor = '#28a745';
        else if (complaint.status === 'rejected') borderColor = '#dc3545';

        return `
            <div class="complaint-card" style="border-left-color: ${borderColor}">
                <div class="complaint-header">
                    <h4 class="complaint-title">${complaint.subject}</h4>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <span class="complaint-type ${complaint.type}">${complaint.type}</span>
                        <span class="complaint-status ${complaint.status}">${this.getStatusText(complaint.status)}</span>
                    </div>
                </div>
                
                <div class="complaint-info">
                    <div class="complaint-info-item">
                        <span class="complaint-info-label">Fecha</span>
                        <span class="complaint-info-value">${date}</span>
                    </div>
                    <div class="complaint-info-item">
                        <span class="complaint-info-label">Habitación</span>
                        <span class="complaint-info-value">${roomName}</span>
                    </div>
                    <div class="complaint-info-item">
                        <span class="complaint-info-label">Estado</span>
                        <span class="complaint-info-value">${this.getStatusText(complaint.status)}</span>
                    </div>
                </div>
                
                <div class="complaint-description">
                    ${complaint.description}
                </div>
                
                ${complaint.adminResponse ? `
                    <div class="complaint-response">
                        <h5><i class="fas fa-reply"></i> Respuesta del Administrador</h5>
                        <p>${complaint.adminResponse}</p>
                    </div>
                ` : ''}
                
                <div class="complaint-actions">
                    <button class="btn-view" onclick="complaintsManager.viewComplaintDetail(${complaint.id})">
                        <i class="fas fa-eye"></i> Ver Detalle
                    </button>
                    ${canDelete ? `
                        <button class="btn-delete" onclick="complaintsManager.deleteComplaint(${complaint.id})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    ` : `
                        <button class="btn-delete" disabled title="Solo se pueden eliminar quejas/reclamos pendientes">
                            <i class="fas fa-lock"></i> Bloqueado
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * Obtiene el texto del estado
     */
    getStatusText(status) {
        switch(status) {
            case 'pending': return 'Pendiente';
            case 'resolved': return 'Resuelto';
            case 'rejected': return 'Rechazado';
            default: return 'Desconocido';
        }
    }

    /**
     * Muestra el detalle completo de una queja/reclamo
     */
    viewComplaintDetail(complaintId) {
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const complaint = complaints.find(c => c.id === complaintId);
        
        if (!complaint) {
            this.showNotification('No se encontró la queja/reclamo', 'error');
            return;
        }

        // Obtener información adicional
        const reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        const reservation = reservations.find(r => r.id === complaint.reservationId);
        
        const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
        const room = reservation ? rooms.find(r => r.id === reservation.roomId) : null;
        const roomName = room ? room.name : 'Habitación';

        // Formatear fecha
        const date = new Date(complaint.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const modalContent = `
            <div class="complaint-detail-content">
                <h3>Detalle de ${complaint.type === 'queja' ? 'Queja' : 'Reclamo'}</h3>
                
                <div class="detail-section">
                    <h4>Información General</h4>
                    <p><strong>ID:</strong> ${complaint.id}</p>
                    <p><strong>Tipo:</strong> ${complaint.type}</p>
                    <p><strong>Estado:</strong> ${this.getStatusText(complaint.status)}</p>
                    <p><strong>Fecha:</strong> ${date}</p>
                </div>
                
                <div class="detail-section">
                    <h4>Información de Reserva</h4>
                    <p><strong>Habitación:</strong> ${roomName}</p>
                    ${reservation ? `
                        <p><strong>Check-in:</strong> ${new Date(reservation.checkIn).toLocaleDateString('es-ES')}</p>
                        <p><strong>Check-out:</strong> ${new Date(reservation.checkOut).toLocaleDateString('es-ES')}</p>
                        <p><strong>Huéspedes:</strong> ${reservation.guests}</p>
                    ` : '<p>Información de reserva no disponible</p>'}
                </div>
                
                <div class="detail-section">
                    <h4>Asunto</h4>
                    <p>${complaint.subject}</p>
                </div>
                
                <div class="detail-section">
                    <h4>Descripción</h4>
                    <p>${complaint.description}</p>
                </div>
                
                ${complaint.adminResponse ? `
                    <div class="detail-section">
                        <h4>Respuesta del Administrador</h4>
                        <p>${complaint.adminResponse}</p>
                    </div>
                ` : `
                    <div class="detail-section">
                        <h4>Respuesta del Administrador</h4>
                        <p><em>Sin respuesta aún. El administrador revisará tu ${complaint.type === 'queja' ? 'queja' : 'reclamo'} pronto.</em></p>
                    </div>
                `}
            </div>
        `;

        // Mostrar modal
        const modal = document.getElementById('complaintDetailModal');
        const modalContentElement = document.getElementById('complaintDetailContent');
        
        modalContentElement.innerHTML = modalContent;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Elimina una queja/reclamo (solo si está pendiente)
     */
    deleteComplaint(complaintId) {
        if (!confirm('¿Estás seguro de que quieres eliminar esta queja/reclamo? Esta acción no se puede deshacer.')) {
            return;
        }

        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const complaintIndex = complaints.findIndex(c => c.id === complaintId);
        
        if (complaintIndex === -1) {
            this.showNotification('No se encontró la queja/reclamo', 'error');
            return;
        }

        const complaint = complaints[complaintIndex];
        
        // Verificar que esté pendiente
        if (complaint.status !== 'pending') {
            this.showNotification('Solo se pueden eliminar quejas/reclamos pendientes', 'error');
            return;
        }

        // Eliminar de la lista
        complaints.splice(complaintIndex, 1);
        
        // Guardar lista actualizada
        localStorage.setItem('complaints', JSON.stringify(complaints));
        
        // Mostrar mensaje de éxito
        this.showNotification('Queja/reclamo eliminado exitosamente', 'success');
        
        // Recargar listado
        this.loadUserComplaints();
    }

    /**
     * Muestra una notificación
     */
    showNotification(message, type = 'info') {
        // Usar la función global showNotification de utils.js
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else if (typeof WebComponentsUtils !== 'undefined' && WebComponentsUtils.showNotification) {
            WebComponentsUtils.showNotification(message, type);
        } else {
            console.warn('Función showNotification no disponible. Mensaje:', message, 'Tipo:', type);
            alert(message);
        }
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    window.complaintsManager = new ComplaintsManager();
});
