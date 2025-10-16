/**
 * FUNCIONALIDAD PARA LA PÁGINA DE QUEJAS Y RECLAMOS
 * 
 * Este archivo maneja la funcionalidad completa del sistema de quejas y reclamos
 * para huéspedes del Hotel el Rincón del Carmen.
 */

// Verificar que las dependencias estén disponibles
console.log('=== INICIALIZANDO SISTEMA DE QUEJAS ===');
console.log('storageManager disponible:', typeof storageManager !== 'undefined');
console.log('localStorage disponible:', typeof localStorage !== 'undefined');

// Esperar a que storageManager esté disponible
function waitForStorageManager(callback, maxAttempts = 50) {
    let attempts = 0;
    const checkInterval = setInterval(() => {
        attempts++;
        if (typeof storageManager !== 'undefined') {
            console.log('storageManager disponible después de', attempts, 'intentos');
            clearInterval(checkInterval);
            callback();
        } else if (attempts >= maxAttempts) {
            console.error('storageManager no disponible después de', maxAttempts, 'intentos');
            clearInterval(checkInterval);
        }
    }, 100);
}

class ComplaintsManager {
    constructor() {
        this.init();
    }

    /**
     * Muestra un mensaje de confirmación debajo del botón
     */
    showComplaintMessage(message, type = 'success') {
        const messageElement = document.getElementById('complaintMessage');
        const messageText = document.getElementById('complaintMessageText');
        
        if (messageElement && messageText) {
            messageText.textContent = message;
            
            // Cambiar estilo según el tipo
            if (type === 'success') {
                messageElement.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
                messageElement.style.borderLeftColor = '#28a745';
                messageElement.style.color = '#155724';
                messageElement.querySelector('i').className = 'fas fa-check-circle';
                messageElement.querySelector('i').style.color = '#28a745';
            } else if (type === 'error') {
                messageElement.style.background = 'linear-gradient(135deg, #f8d7da, #f5c6cb)';
                messageElement.style.borderLeftColor = '#dc3545';
                messageElement.style.color = '#721c24';
                messageElement.querySelector('i').className = 'fas fa-exclamation-circle';
                messageElement.querySelector('i').style.color = '#dc3545';
            }
            
            // Mostrar mensaje
            messageElement.style.display = 'flex';
            
            // Ocultar después de 5 segundos
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Genera un ID único secuencial para quejas
     */
    generateComplaintId() {
        const complaints = storageManager.getData('complaints') || [];
        if (complaints.length === 0) {
            return 1;
        }
        
        // Si hay IDs largos, limpiar y reasignar desde 1
        const hasLongIds = complaints.some(c => parseInt(c.id) > 1000);
        if (hasLongIds) {
            this.cleanAndReassignIds();
            return complaints.length + 1;
        }
        
        // Encontrar el ID más alto y sumar 1
        const maxId = Math.max(...complaints.map(c => parseInt(c.id) || 0));
        return maxId + 1;
    }

    /**
     * Limpia y reasigna IDs secuenciales desde 1
     */
    cleanAndReassignIds() {
        const complaints = storageManager.getData('complaints') || [];
        const cleanedComplaints = complaints.map((complaint, index) => ({
            ...complaint,
            id: index + 1
        }));
        
        storageManager.setData('complaints', cleanedComplaints);
        console.log('IDs limpiados y reasignados desde 1');
    }

    init() {
        this.setupFormHandlers();
        this.updateInterfaceBasedOnAuth();
        this.loadUserReservations();
        this.loadUserComplaints();
        this.setupAuthListeners();
        
        // Test manual del botón después de un delay
        setTimeout(() => {
            const button = document.querySelector('.submit-complaint-btn');
            if (button) {
                console.log('Test manual del botón:', button);
                console.log('Botón disabled:', button.disabled);
                console.log('Botón onclick:', button.onclick);
                console.log('Botón type:', button.type);
                console.log('Botón form:', button.form);
            }
        }, 1000);
    }

    /**
     * Configura los manejadores del formulario
     */
    setupFormHandlers() {
        console.log('Configurando handlers del formulario...');
        
        // Verificar que el botón existe y está configurado
        const button = document.querySelector('.submit-complaint-btn');
        console.log('Botón encontrado:', button);
        
        if (button) {
            console.log('Botón configurado correctamente con onclick en HTML');
            console.log('onclick del botón:', button.onclick);
        } else {
            console.error('No se encontró el botón submit-complaint-btn');
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
        console.log('=== ACTUALIZANDO INTERFAZ SEGÚN AUTENTICACIÓN ===');
        
        // Pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
            const currentUser = JSON.parse(localStorage.getItem('current_user'));
            const loginMessage = document.querySelector('.login-required-message');
            const formContainer = document.querySelector('.complaint-form-container');
            const complaintsContainer = document.querySelector('.complaints-list-container');
            const submitButton = document.querySelector('.submit-complaint-btn');
            
            console.log('Usuario actual:', currentUser);
            console.log('Elementos encontrados:', { loginMessage, formContainer, complaintsContainer, submitButton });
        
            if (currentUser) {
                // Usuario logueado - no mostrar mensaje de login
                
                // Mostrar formulario y listado
                if (formContainer) formContainer.style.display = 'block';
                if (complaintsContainer) complaintsContainer.style.display = 'block';
                
                // Habilitar botón de envío y campos del formulario
                if (submitButton) {
                    console.log('Habilitando botón de envío...');
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    submitButton.style.cursor = 'pointer';
                    console.log('Botón habilitado:', { disabled: submitButton.disabled, opacity: submitButton.style.opacity });
                } else {
                    console.error('No se encontró el botón de envío');
                }
                
                // Habilitar todos los campos del formulario
                this.enableFormFields(true);
                
                // Cargar reservas del usuario
                this.loadUserReservations();
            } else {
                // Usuario no logueado - mostrar formulario deshabilitado
                
                // Mostrar formulario pero deshabilitado
                if (formContainer) formContainer.style.display = 'block';
                if (complaintsContainer) complaintsContainer.style.display = 'block';
                
                // Deshabilitar botón de envío
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.style.opacity = '0.6';
                    submitButton.style.cursor = 'not-allowed';
                }
                
                // Deshabilitar todos los campos del formulario
                this.enableFormFields(false);
            }
        }, 50); // Pequeño delay para asegurar que el DOM esté listo
    }

    /**
     * Habilita o deshabilita los campos del formulario
     * @param {boolean} enabled - true para habilitar, false para deshabilitar
     */
    enableFormFields(enabled) {
        const form = document.getElementById('complaintForm');
        if (!form) return;
        
        const fields = [
            'reservationSelect',
            'complaintType', 
            'complaintSubject',
            'complaintDescription'
        ];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.disabled = !enabled;
                if (!enabled) {
                    field.style.opacity = '0.6';
                    field.style.cursor = 'not-allowed';
                } else {
                    field.style.opacity = '1';
                    field.style.cursor = 'default';
                }
            }
        });
        
        console.log('Campos del formulario', enabled ? 'habilitados' : 'deshabilitados');
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
        
        // Los cambios de autenticación se detectarán automáticamente
        // cuando el usuario navegue o recargue la página
    }

    /**
     * Carga las reservas del usuario para el selector
     */
    loadUserReservations() {
        console.log('=== CARGANDO RESERVAS DEL USUARIO ===');
        
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        const reservationSelect = document.getElementById('reservationSelect');
        
        console.log('Usuario actual:', currentUser);
        console.log('Elemento select:', reservationSelect);
        
        if (!reservationSelect) {
            console.error('No se encontró el elemento reservationSelect');
            return;
        }
        
        if (!currentUser) {
            console.log('No hay usuario logueado - mostrando mensaje en selector');
            // Limpiar opciones existentes
            reservationSelect.innerHTML = '<option value="">Debes iniciar sesión para ver tus reservas</option>';
            // Deshabilitar el select
            reservationSelect.disabled = true;
            return;
        }
        
        console.log('ID del usuario:', currentUser.id);
        console.log('Email del usuario:', currentUser.email);
        
        // Verificar que storageManager esté disponible
        if (typeof storageManager === 'undefined') {
            console.error('storageManager no está disponible');
            reservationSelect.innerHTML = '<option value="">Error: Sistema de datos no disponible</option>';
            reservationSelect.disabled = true;
            return;
        }
        
        // Obtener todas las reservas usando storageManager
        const reservations = storageManager.getData('reservations') || [];
        console.log('Todas las reservas obtenidas:', reservations.length, reservations);
        
        // Filtrar reservas del usuario actual
        const userReservations = reservations.filter(reservation => {
            // Convertir ambos IDs a número para comparación segura
            const reservationUserId = parseInt(reservation.userId);
            const currentUserId = parseInt(currentUser.id);
            const matches = reservationUserId === currentUserId;
            console.log(`Reserva ${reservation.id}: userId=${reservationUserId} (${typeof reservationUserId}), currentUser.id=${currentUserId} (${typeof currentUserId}), matches=${matches}`);
            return matches;
        });
        
        console.log('Reservas del usuario filtradas:', userReservations.length, userReservations);
        
        // Limpiar opciones existentes (excepto la primera)
        reservationSelect.innerHTML = '<option value="">Selecciona una reserva</option>';
        // Habilitar el select
        reservationSelect.disabled = false;
        
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
            console.log('Procesando reserva:', reservation);
            
            // Verificar que el select aún existe
            if (!reservationSelect) {
                console.error('El elemento select ya no existe');
                return;
            }
            
            const option = document.createElement('option');
            option.value = reservation.id;
            
            // Obtener información de la habitación usando storageManager
            const rooms = storageManager.getData('rooms') || [];
            const room = rooms.find(r => r.id === reservation.roomId);
            const roomName = room ? room.name : 'Habitación';
            
            console.log('Habitación encontrada:', room);
            
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
        console.log('=== INICIANDO ENVÍO DE QUEJA/RECLAMO ===');
        console.log('Función handleComplaintSubmission llamada');
        console.log('this:', this);
        console.log('window.complaintsManager:', window.complaintsManager);
        
        // Verificar autenticación
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        if (!currentUser) {
            alert('Debes iniciar sesión para enviar una queja o reclamo');
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
            alert('Por favor selecciona una reserva');
            return;
        }

        if (!type) {
            alert('Por favor selecciona el tipo (Queja o Reclamo)');
            return;
        }

        if (!subject.trim()) {
            alert('Por favor ingresa un asunto');
            return;
        }

        if (!description.trim()) {
            alert('Por favor escribe una descripción');
            return;
        }

        // Crear objeto de queja/reclamo
        const complaint = {
            id: window.complaintsManager ? window.complaintsManager.generateComplaintId() : Date.now(), // ID único secuencial
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
        this.showComplaintMessage('¡Tu ' + (type === 'queja' ? 'queja' : 'reclamo') + ' ha sido enviado exitosamente!');
        
        // Limpiar formulario
        document.getElementById('complaintForm').reset();
        
        // Recargar listado con un pequeño delay para asegurar que se guardó
        setTimeout(() => {
            console.log('Recargando quejas del usuario después de guardar...');
            this.loadUserComplaints();
        }, 100);
    }

    /**
     * Guarda la queja/reclamo en localStorage
     */
    saveComplaint(complaint) {
        console.log('=== GUARDANDO QUEJA/RECLAMO ===');
        console.log('Queja a guardar:', complaint);
        
        // Obtener quejas existentes usando storageManager
        let complaints = storageManager.getData('complaints') || [];
        console.log('Quejas existentes antes de agregar:', complaints.length, complaints);
        
        // Agregar nueva queja
        complaints.push(complaint);
        console.log('Quejas después de agregar:', complaints.length, complaints);
        
        // Guardar usando storageManager
        const success = storageManager.setData('complaints', complaints);
        console.log('Resultado del guardado:', success);
        
        if (success) {
            // Verificar que se guardó correctamente
            const savedComplaints = storageManager.getData('complaints');
            console.log('Verificación: quejas guardadas en localStorage:', savedComplaints.length, savedComplaints);
            
            if (savedComplaints && savedComplaints.length > 0) {
                const lastComplaint = savedComplaints[savedComplaints.length - 1];
                console.log('Última queja guardada:', lastComplaint);
                
                if (lastComplaint.id === complaint.id) {
                    console.log('✅ Queja/reclamo guardado exitosamente');
                } else {
                    console.error('❌ Error: La queja no se guardó correctamente');
                }
            } else {
                console.error('❌ Error: No se encontraron quejas después del guardado');
            }
        } else {
            console.error('❌ Error al guardar la queja/reclamo');
        }
    }

    /**
     * Carga y muestra las quejas/reclamos del usuario
     */
    loadUserComplaints() {
        console.log('=== CARGANDO QUEJAS DEL USUARIO ===');
        
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        const complaintsList = document.getElementById('complaintsList');
        
        console.log('Usuario actual:', currentUser);
        console.log('Elemento complaintsList:', complaintsList);
        
        if (!complaintsList) {
            console.error('No se encontró el elemento complaintsList');
            return;
        }
        
        if (!currentUser) {
            console.log('No hay usuario logueado - mostrando mensaje en lista de quejas');
            complaintsList.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-user-lock"></i>
                    <h4>Inicia sesión para ver tus quejas</h4>
                    <p>Debes iniciar sesión para ver y gestionar tus quejas y reclamos.</p>
                </div>
            `;
            return;
        }
        
        // Obtener todas las quejas usando storageManager
        const complaints = storageManager.getData('complaints') || [];
        console.log('Todas las quejas en el sistema:', complaints.length, complaints);
        
        // Filtrar quejas del usuario actual
        const userComplaints = complaints.filter(complaint => 
            complaint.userId === currentUser.id
        );
        
        console.log('Quejas del usuario actual:', userComplaints.length, userComplaints);
        
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
        const reservations = storageManager.getData('reservations') || [];
        const reservation = reservations.find(r => r.id === complaint.reservationId);
        
        // Obtener información de la habitación
        const rooms = storageManager.getData('rooms') || [];
        const room = reservation ? rooms.find(r => r.id === reservation.roomId) : null;
        const roomName = room ? room.name : 'Habitación';

        // Determinar si se puede eliminar (solo administradores y solo si está pendiente)
        const currentUser = storageManager.getData('current_user');
        const isAdmin = currentUser && currentUser.role === 'admin';
        const canDelete = isAdmin && complaint.status === 'pending';
        
        // Determinar el color del borde según el estado
        let borderColor = '#b89a7e'; // Por defecto
        if (complaint.status === 'resolved') borderColor = '#b89a7e';
        else if (complaint.status === 'rejected') borderColor = '#2c3e50';

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
                    ` : ''}
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
        const complaints = storageManager.getData('complaints') || [];
        const complaint = complaints.find(c => c.id === complaintId);
        
        if (!complaint) {
            this.showNotification('No se encontró la queja/reclamo', 'error');
            return;
        }

        // Obtener información adicional
        const reservations = storageManager.getData('reservations') || [];
        const reservation = reservations.find(r => r.id === complaint.reservationId);
        
        const rooms = storageManager.getData('rooms') || [];
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
                    <p><strong>Estado:</strong> ${complaint.status === 'resolved' ? `<span class="status-resolved">${this.getStatusText(complaint.status)}</span>` : this.getStatusText(complaint.status)}</p>
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
        // Verificar que el usuario sea administrador
        const currentUser = storageManager.getData('current_user');
        if (!currentUser || currentUser.role !== 'admin') {
            this.showNotification('Solo los administradores pueden eliminar quejas y reclamos', 'error');
            return;
        }

        if (!confirm('¿Estás seguro de que quieres eliminar esta queja/reclamo? Esta acción no se puede deshacer.')) {
            return;
        }

        const complaints = storageManager.getData('complaints') || [];
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
        
        // Guardar lista actualizada usando storageManager
        storageManager.setData('complaints', complaints);
        
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

// Función global simple para el onclick del HTML - debe estar disponible inmediatamente
window.submitComplaint = () => {
    console.log('=== FUNCIÓN GLOBAL submitComplaint LLAMADA ===');
    
    try {
        // Verificar que el formulario existe
        const form = document.getElementById('complaintForm');
        if (!form) {
            alert('Error: Formulario no encontrado');
            console.error('Formulario complaintForm no encontrado');
            return;
        }

        // Verificar usuario logueado
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        if (!currentUser) {
            // Mostrar modal de login en lugar de alert
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                loginModal.style.display = 'block';
                alert('Debes iniciar sesión para enviar una queja o reclamo');
            } else {
                alert('Debes iniciar sesión para enviar una queja o reclamo');
            }
            console.error('No hay usuario logueado');
            return;
        }

        // Obtener datos del formulario
        const formData = new FormData(form);
        const reservationId = formData.get('reservationId');
        const type = formData.get('type');
        const subject = formData.get('subject');
        const description = formData.get('description');

        console.log('Datos del formulario:', { reservationId, type, subject, description });

        // Validaciones básicas
        if (!reservationId) {
            alert('Por favor selecciona una reserva');
            return;
        }
        if (!type) {
            alert('Por favor selecciona el tipo (Queja o Reclamo)');
            return;
        }
        if (!subject || !subject.trim()) {
            alert('Por favor ingresa un asunto');
            return;
        }
        if (!description || !description.trim()) {
            alert('Por favor escribe una descripción');
            return;
        }

        // Crear queja
        const complaint = {
            id: window.complaintsManager ? window.complaintsManager.generateComplaintId() : Date.now(),
            userId: currentUser.id,
            userEmail: currentUser.email,
            userName: currentUser.name,
            reservationId: parseInt(reservationId),
            type: type,
            subject: subject.trim(),
            description: description.trim(),
            date: new Date().toISOString(),
            status: 'pending',
            adminResponse: null
        };

        console.log('Queja creada:', complaint);

        // Guardar directamente usando storageManager
        if (typeof storageManager === 'undefined') {
            alert('Error: Sistema de almacenamiento no disponible');
            console.error('storageManager no disponible');
            return;
        }

        try {
            // Verificar que storageManager está funcionando
            console.log('=== VERIFICACIÓN DE STORAGEMANAGER ===');
            console.log('storageManager disponible:', typeof storageManager !== 'undefined');
            console.log('storageManager.getData función:', typeof storageManager.getData);
            console.log('storageManager.setData función:', typeof storageManager.setData);
            
            let complaints = storageManager.getData('complaints') || [];
            console.log('Quejas existentes antes de agregar:', complaints.length, complaints);
            
            complaints.push(complaint);
            console.log('Quejas después de agregar:', complaints.length);
            console.log('Última queja agregada:', complaints[complaints.length - 1]);
            
            const success = storageManager.setData('complaints', complaints);
            console.log('Resultado de setData:', success);

            if (success) {
                // Verificar que se guardó correctamente
                const savedComplaints = storageManager.getData('complaints');
                console.log('Quejas guardadas verificadas:', savedComplaints.length);
                
                if (savedComplaints && savedComplaints.length > 0) {
                    const lastComplaint = savedComplaints[savedComplaints.length - 1];
                    console.log('Última queja guardada:', lastComplaint);
                    
                    if (lastComplaint && lastComplaint.id === complaint.id) {
                        if (window.complaintsManager) {
                            window.complaintsManager.showComplaintMessage('¡Tu ' + (type === 'queja' ? 'queja' : 'reclamo') + ' ha sido enviado exitosamente!');
                        }
                        form.reset();
                        
                        // Recargar página para mostrar la queja
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                        return;
                    }
                }
            }
            
            // Si llegamos aquí, algo falló con storageManager
            console.error('Error en el proceso de guardado con storageManager');
            if (window.complaintsManager) {
                window.complaintsManager.showComplaintMessage('Error: No se pudo guardar la queja. Por favor intenta de nuevo.', 'error');
            }
            
        } catch (error) {
            console.error('Error en proceso de guardado:', error);
            if (window.complaintsManager) {
                window.complaintsManager.showComplaintMessage('Error: ' + error.message, 'error');
            }
        }

    } catch (error) {
        console.error('Error en submitComplaint:', error);
        if (window.complaintsManager) {
            window.complaintsManager.showComplaintMessage('Error: ' + error.message, 'error');
        }
    }
};

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando ComplaintsManager...');
    
    // Esperar a que storageManager esté disponible antes de continuar
    waitForStorageManager(() => {
        // Inicializar el array de quejas si no existe
        if (!localStorage.getItem('complaints')) {
            localStorage.setItem('complaints', JSON.stringify([]));
            console.log('Array de quejas inicializado en localStorage');
        }
        
        // Verificar que el array de quejas existe y es válido
        try {
            const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
            console.log('Array de quejas verificado:', complaints.length, 'quejas existentes');
        } catch (error) {
            console.error('Error verificando array de quejas:', error);
            localStorage.setItem('complaints', JSON.stringify([]));
        }
        
        // Esperar un poco más para asegurar que todos los elementos estén listos
        setTimeout(() => {
            // Inicializar el sistema de autenticación
            if (typeof initAuth === 'function') {
                initAuth();
                console.log('Sistema de autenticación inicializado');
            } else {
                console.warn('Función initAuth no disponible');
            }
            
            window.complaintsManager = new ComplaintsManager();
            console.log('ComplaintsManager inicializado:', window.complaintsManager);
        
            // Función global para testing manual
            window.testComplaintSubmission = () => {
                console.log('=== TEST MANUAL DE ENVÍO ===');
                if (window.complaintsManager) {
                    window.complaintsManager.handleComplaintSubmission();
                } else {
                    console.error('ComplaintsManager no está disponible');
                }
            };
            
            // Función global para debugging
            window.debugComplaintSystem = () => {
                console.log('=== DEBUG SISTEMA DE QUEJAS ===');
                console.log('storageManager disponible:', typeof storageManager !== 'undefined');
                console.log('localStorage disponible:', typeof localStorage !== 'undefined');
                
                try {
                    const complaints = localStorage.getItem('complaints');
                    console.log('Quejas en localStorage (raw):', complaints);
                    const parsedComplaints = JSON.parse(complaints || '[]');
                    console.log('Quejas parseadas:', parsedComplaints);
                    
                    if (storageManager) {
                        const storageComplaints = storageManager.getData('complaints');
                        console.log('Quejas via storageManager:', storageComplaints);
                    }
                } catch (error) {
                    console.error('Error en debug:', error);
                }
            };
            
            // Función global para refrescar la interfaz manualmente
            window.refreshComplaintsInterface = () => {
                console.log('Refrescando interfaz de quejas manualmente...');
                if (window.complaintsManager) {
                    window.complaintsManager.updateInterfaceBasedOnAuth();
                    window.complaintsManager.loadUserReservations();
                    window.complaintsManager.loadUserComplaints();
                } else {
                    console.error('ComplaintsManager no está disponible');
                }
            };
            
            // Función global para debug de reservas
            window.debugReservations = () => {
                console.log('=== DEBUG DE RESERVAS ===');
                const currentUser = JSON.parse(localStorage.getItem('current_user'));
                console.log('Usuario actual:', currentUser);
                
                if (!currentUser) {
                    console.log('❌ No hay usuario logueado');
                    alert('No hay usuario logueado. Por favor inicia sesión primero.');
                    return;
                }
                
                const reservations = storageManager.getData('reservations') || [];
                console.log('Todas las reservas en el sistema:', reservations);
                
                // Debug detallado del filtrado
                console.log('=== ANÁLISIS DETALLADO ===');
                console.log('ID del usuario actual:', currentUser.id, 'Tipo:', typeof currentUser.id);
                
                reservations.forEach((reservation, index) => {
                    console.log(`Reserva ${index + 1}:`, {
                        id: reservation.id,
                        userId: reservation.userId,
                        userIdType: typeof reservation.userId,
                        matches: reservation.userId === currentUser.id,
                        strictMatches: reservation.userId === currentUser.id,
                        looseMatches: reservation.userId == currentUser.id
                    });
                });
                
                const userReservations = reservations.filter(r => r.userId === currentUser.id);
                console.log('Reservas del usuario (filtro estricto):', userReservations);
                
                // Intentar con comparación flexible también
                const userReservationsLoose = reservations.filter(r => r.userId == currentUser.id);
                console.log('Reservas del usuario (filtro flexible):', userReservationsLoose);
                
                if (userReservations.length === 0 && userReservationsLoose.length === 0) {
                    console.log('❌ No hay reservas para este usuario');
                    alert(`No hay reservas para el usuario ${currentUser.name}. Debes crear una reserva primero.`);
                } else {
                    const count = userReservations.length > 0 ? userReservations.length : userReservationsLoose.length;
                    console.log('✅ Reservas encontradas:', count);
                    alert(`Se encontraron ${count} reservas para ${currentUser.name}`);
                }
                
                // Recargar el selector de reservas
                if (window.complaintsManager) {
                    window.complaintsManager.loadUserReservations();
                }
            };
            
            // Función global para limpiar IDs de quejas
            window.cleanComplaintIds = () => {
                if (window.complaintsManager) {
                    window.complaintsManager.cleanAndReassignIds();
                    window.complaintsManager.loadUserComplaints();
                    alert('IDs limpiados exitosamente');
                }
            };
            
            // Función para crear una reserva de prueba
            window.createTestReservation = () => {
                const currentUser = JSON.parse(localStorage.getItem('current_user'));
                if (!currentUser) {
                    alert('Debes estar logueado para crear una reserva de prueba');
                    return;
                }
                
                const testReservation = {
                    id: Math.floor(Math.random() * 1000) + 1, // ID simple para prueba
                    userId: currentUser.id,
                    roomId: 1,
                    checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    checkOut: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                    guests: 2,
                    totalPrice: 1000000,
                    status: 'confirmed',
                    createdAt: new Date().toISOString()
                };
                
                const reservations = storageManager.getData('reservations') || [];
                reservations.push(testReservation);
                storageManager.setData('reservations', reservations);
                
                console.log('Reserva de prueba creada:', testReservation);
                alert('Reserva de prueba creada exitosamente');
                
                // Recargar el selector
                if (window.complaintsManager) {
                    window.complaintsManager.loadUserReservations();
                }
            };
            
            // Función para forzar la recarga del selector
            window.forceReloadReservations = () => {
                console.log('=== FORZANDO RECARGA DE RESERVAS ===');
                
                const reservationSelect = document.getElementById('reservationSelect');
                if (!reservationSelect) {
                    console.error('No se encontró el elemento reservationSelect');
                    alert('Error: No se encontró el selector de reservas');
                    return;
                }
                
                console.log('Elemento select encontrado:', reservationSelect);
                
                // Limpiar completamente el select
                reservationSelect.innerHTML = '';
                
                // Agregar opción por defecto
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Selecciona una reserva';
                reservationSelect.appendChild(defaultOption);
                
                // Obtener usuario actual
                const currentUser = JSON.parse(localStorage.getItem('current_user'));
                if (!currentUser) {
                    console.log('No hay usuario logueado');
                    const noUserOption = document.createElement('option');
                    noUserOption.value = '';
                    noUserOption.textContent = 'Debes iniciar sesión para ver tus reservas';
                    noUserOption.disabled = true;
                    reservationSelect.appendChild(noUserOption);
                    reservationSelect.disabled = true;
                    return;
                }
                
                // Obtener reservas
                const reservations = storageManager.getData('reservations') || [];
                console.log('Reservas obtenidas:', reservations);
                
                // Filtrar reservas del usuario
                const userReservations = reservations.filter(reservation => {
                    const reservationUserId = parseInt(reservation.userId);
                    const currentUserId = parseInt(currentUser.id);
                    return reservationUserId === currentUserId;
                });
                
                console.log('Reservas del usuario:', userReservations);
                
                if (userReservations.length === 0) {
                    const noReservationsOption = document.createElement('option');
                    noReservationsOption.value = '';
                    noReservationsOption.textContent = 'No tienes reservas disponibles';
                    noReservationsOption.disabled = true;
                    reservationSelect.appendChild(noReservationsOption);
                } else {
                    // Agregar cada reserva
                    userReservations.forEach(reservation => {
                        const option = document.createElement('option');
                        option.value = reservation.id;
                        
                        // Obtener nombre de la habitación
                        const rooms = storageManager.getData('rooms') || [];
                        const room = rooms.find(r => r.id === reservation.roomId);
                        const roomName = room ? room.name : 'Habitación';
                        
                        // Formatear fechas
                        const checkIn = new Date(reservation.checkIn).toLocaleDateString('es-ES');
                        const checkOut = new Date(reservation.checkOut).toLocaleDateString('es-ES');
                        
                        option.textContent = `${roomName} - ${checkIn} a ${checkOut}`;
                        reservationSelect.appendChild(option);
                        
                        console.log('Reserva agregada:', option.textContent);
                    });
                }
                
                reservationSelect.disabled = false;
                console.log('Recarga forzada completada');
                alert(`Recarga completada. Se encontraron ${userReservations.length} reservas.`);
            };
            
            console.log('Función de test disponible: window.testComplaintSubmission()');
            console.log('Función global disponible: window.submitComplaint()');
            console.log('Función de debug disponible: window.debugComplaintSystem()');
            console.log('Función de refresh disponible: window.refreshComplaintsInterface()');
            console.log('Función de debug de reservas disponible: window.debugReservations()');
            console.log('Función para limpiar IDs: window.cleanComplaintIds()');
            console.log('Función para crear reserva de prueba: window.createTestReservation()');
            console.log('Función para forzar recarga: window.forceReloadReservations()');
            
            // Escuchar cambios en localStorage para actualizar la interfaz cuando el usuario inicie/cierre sesión
            window.addEventListener('storage', (e) => {
                if (e.key === 'current_user') {
                    console.log('Cambio detectado en current_user via storage event');
                    setTimeout(() => {
                        window.complaintsManager.updateInterfaceBasedOnAuth();
                        window.complaintsManager.loadUserReservations();
                        window.complaintsManager.loadUserComplaints();
                    }, 100);
                }
            });
            
            // Escuchar cambios en localStorage usando el evento storage
            // Esto funcionará para cambios entre pestañas del mismo dominio
            
            // Cerrar sesión directamente como en hogar
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Cerrando sesión desde quejas-reclamos.js');
                    
                    // Cerrar sesión directamente
                    currentUser = null;
                    localStorage.removeItem('current_user');
                    
                    // Actualizar la interfaz
                    if (typeof updateAuthUI === 'function') {
                        updateAuthUI();
                    }
                    
                    // Mostrar notificación exactamente como en hogar
                    showNotification('Has cerrado sesión exitosamente', 'success');
                    
                    // Recargar la página después de un pequeño delay para mostrar la notificación
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }, true); // Usar capture para interceptar antes que otros listeners
            }
            
            // Redirigir login a la página principal
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) {
                loginBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Redirigiendo a página principal para iniciar sesión');
                    window.location.href = '../index.html';
                }, true); // Usar capture para interceptar antes que otros listeners
            }
            
            // También redirigir cualquier intento de abrir modal de login
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                // Interceptar cualquier intento de mostrar el modal
                const originalShow = loginModal.style.display;
                Object.defineProperty(loginModal.style, 'display', {
                    set: function(value) {
                        if (value === 'block' || value === 'flex') {
                            console.log('Intentando abrir modal de login, redirigiendo a página principal');
                            window.location.href = '../index.html';
                            return;
                        }
                        return originalShow;
                    },
                    get: function() {
                        return originalShow;
                    }
                });
            }
        }, 500); // Esperar 500ms para que el DOM esté completamente listo
    });
});
