/**
 * PANEL DE ADMINISTRACIÓN DEL HOTEL
 * 
 * Este archivo gestiona todas las funcionalidades del panel de administración,
 * incluyendo la gestión de habitaciones, reservas y configuración del sistema.
 * Solo los usuarios con rol 'admin' pueden acceder a estas funcionalidades.
 */

/**
 * Inicialización del panel de administración
 * Verifica permisos del usuario y carga los datos iniciales
 */
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el usuario actual desde localStorage
    var currentUser = JSON.parse(localStorage.getItem('current_user'));
    
    // Verificar que el usuario esté autenticado y tenga rol de administrador
    if (!currentUser || currentUser.role !== 'admin') {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = '../index.html';
        return;
    }

    // Cargar la lista de habitaciones al iniciar
    loadRooms();

    // Configurar el formulario de agregar habitación
    var roomForm = document.getElementById('roomForm');
    if (roomForm) {
        roomForm.onsubmit = handleRoomSubmit;
    }
});

/**
 * Función para cambiar entre las diferentes pestañas del panel de administración
 * @param {string} tabName - Nombre de la pestaña a mostrar (rooms, reservations, etc.)
 */
function showTab(tabName) {
    // Ocultar todos los contenidos de las pestañas
    var tabs = document.querySelectorAll('.tab-content');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    // Desactivar todas las pestañas de navegación
    var adminTabs = document.querySelectorAll('.admin-tab');
    for (var i = 0; i < adminTabs.length; i++) {
        adminTabs[i].classList.remove('active');
    }
    
    // Activar la pestaña seleccionada
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
    
    // Cargar datos específicos según la pestaña seleccionada
    if (tabName === 'rooms') {
        loadRooms();
    } else if (tabName === 'reservations') {
        loadReservations();
    } else if (tabName === 'complaints') {
        loadComplaints();
    }
}

/**
 * Manejador del envío del formulario para agregar una nueva habitación
 * Valida los datos y crea la habitación en el sistema
 * @param {Event} e - Evento de submit del formulario
 */
function handleRoomSubmit(e) {
    // Prevenir el comportamiento por defecto del formulario
    e.preventDefault();
    
    // Recopilar todos los datos del formulario
    var roomData = {
        name: document.getElementById('roomName').value,
        type: document.getElementById('roomType').value,
        price: parseInt(document.getElementById('roomPrice').value),
        capacity: parseInt(document.getElementById('roomCapacity').value),
        beds: parseInt(document.getElementById('roomBeds').value),
        available: document.getElementById('roomAvailable').value === 'true',
        description: document.getElementById('roomDescription').value,
        services: getSelectedServices()
    };
    
    // Obtener habitaciones existentes
    var rooms = storageManager.getData('rooms') || [];
    
    // Crear objeto de la nueva habitación con formato estandarizado
    var newRoom = {
        id: storageManager.generateId(rooms),
        name: roomData.name,
        type: roomData.type,
        pricePerNight: roomData.price,
        capacity: roomData.capacity,
        maxGuests: roomData.capacity,
        beds: roomData.beds,
        available: roomData.available,
        description: roomData.description,
        services: roomData.services,
        images: [] // Inicializar array de imágenes vacío
    };
    
    // Agregar la nueva habitación al array
    rooms.push(newRoom);
    
    // Guardar los datos actualizados en localStorage
    storageManager.setData('rooms', rooms);
    
    // Limpiar el formulario
    e.target.reset();
    
    // Recargar la lista de habitaciones en la interfaz
    loadRooms();
    
    // Mostrar mensaje de éxito
    showNotification('Habitación agregada exitosamente', 'success');
}

/**
 * Función para obtener los servicios seleccionados en los checkboxes
 * @returns {Array} - Array con los valores de los servicios seleccionados
 */
function getSelectedServices() {
    var services = [];
    var checkboxes = document.querySelectorAll('.services-checkboxes input[type="checkbox"]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        services.push(checkboxes[i].value);
    }
    return services;
}

/**
 * Función para cargar y mostrar todas las habitaciones en la tabla
 * Genera el HTML dinámicamente y lo inserta en el DOM
 */
function loadRooms() {
    var rooms = storageManager.getData('rooms') || [];
    var tbody = document.getElementById('roomsTableBody');
    
    // Si no existe el elemento tbody, salir
    if (!tbody) return;
    
    var html = '';
    
    // Generar una fila de tabla para cada habitación
    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        var price = room.pricePerNight || room.price;
        var available = room.available ? 'Sí' : 'No';
        
        html += '<tr>';
        html += '<td>' + room.id + '</td>';
        html += '<td>' + room.name + '</td>';
        html += '<td>' + room.type + '</td>';
        html += '<td>' + formatCurrency(price) + '</td>';
        html += '<td>' + room.capacity + '</td>';
        html += '<td>' + room.beds + '</td>';
        html += '<td>' + available + '</td>';
        html += '<td class="actions-cell"><div class="action-buttons">';
        html += '<button class="btn-secondary btn-sm" onclick="editRoom(' + room.id + ')"><i class="fas fa-edit"></i> Editar</button>';
        html += '<button class="btn-danger btn-sm" onclick="deleteRoom(' + room.id + ')"><i class="fas fa-trash"></i> Eliminar</button>';
        html += '</div></td>';
        html += '</tr>';
    }
    
    // Insertar el HTML generado en la tabla
    tbody.innerHTML = html;
}

/**
 * Función para eliminar una habitación del sistema
 * Solicita confirmación antes de proceder con la eliminación
 * @param {number} roomId - ID de la habitación a eliminar
 */
function deleteRoom(roomId) {
    // Solicitar confirmación al usuario
    if (confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
        var rooms = storageManager.getData('rooms') || [];
        var updatedRooms = [];
        
        // Filtrar todas las habitaciones excepto la que se va a eliminar
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i].id !== roomId) {
                updatedRooms.push(rooms[i]);
            }
        }
        
        // Guardar la lista actualizada
        storageManager.setData('rooms', updatedRooms);
        
        // Recargar la lista de habitaciones
        loadRooms();
        
        // Mostrar mensaje de éxito
        showNotification('Habitación eliminada exitosamente', 'success');
    }
}

/**
 * Función para editar una habitación existente
 * Crea un modal dinámico con el formulario de edición precargado con los datos actuales
 * @param {number} roomId - ID de la habitación a editar
 */
function editRoom(roomId) {
    var rooms = storageManager.getData('rooms') || [];
    var room = null;
    
    // Buscar la habitación por ID
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id === roomId) {
            room = rooms[i];
            break;
        }
    }
    
    // Si no se encuentra la habitación, mostrar error
    if (!room) {
        showNotification('Habitación no encontrada', 'error');
        return;
    }
    
    // Crear modal de edición dinámicamente
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editRoomModal';
    modal.style.display = 'block';
    
    // Generar checkboxes de servicios con los valores actuales
    var servicesHtml = '';
    var availableServices = ['wifi', 'minibar', 'jacuzzi', 'tv', 'ac', 'balcony', 'room-service', 'safe', 'pool', 'terrace'];
    var roomServices = room.services || [];
    
    // Crear un checkbox para cada servicio disponible
    for (var i = 0; i < availableServices.length; i++) {
        var service = availableServices[i];
        var checked = roomServices.includes(service) ? 'checked' : '';
        var label = service.charAt(0).toUpperCase() + service.slice(1);
        
        // Traducir etiquetas de servicios al español
        if (service === 'wifi') label = 'WiFi Gratuito';
        if (service === 'tv') label = 'TV';
        if (service === 'ac') label = 'Aire Acondicionado';
        if (service === 'balcony') label = 'Balcón';
        if (service === 'room-service') label = 'Room Service';
        if (service === 'safe') label = 'Caja Fuerte';
        if (service === 'pool') label = 'Piscina Privada';
        if (service === 'terrace') label = 'Terraza Privada';
        
        servicesHtml += `
            <div class="checkbox-group">
                <input type="checkbox" id="edit-service-${service}" value="${service}" ${checked}>
                <label for="edit-service-${service}">${label}</label>
            </div>
        `;
    }
    
    // Crear el contenido HTML del modal con el formulario de edición
    modal.innerHTML = `
        <div class="modal-content large">
            <span class="close">&times;</span>
            <h2>Editar Habitación: ${room.name}</h2>
            
            <form id="editRoomForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="editRoomName">Nombre de la Habitación:</label>
                        <input type="text" id="editRoomName" value="${room.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editRoomType">Tipo:</label>
                        <select id="editRoomType" required>
                            <option value="suite" ${room.type === 'suite' ? 'selected' : ''}>Suite</option>
                            <option value="habitacion" ${room.type === 'habitacion' ? 'selected' : ''}>Habitación</option>
                            <option value="villa" ${room.type === 'villa' ? 'selected' : ''}>Villa</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editRoomPrice">Precio por Noche:</label>
                        <input type="number" id="editRoomPrice" value="${room.pricePerNight || room.price}" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="editRoomCapacity">Capacidad Máxima:</label>
                        <input type="number" id="editRoomCapacity" value="${room.capacity}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="editRoomBeds">Número de Camas:</label>
                        <input type="number" id="editRoomBeds" value="${room.beds}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="editRoomAvailable">Disponible:</label>
                        <select id="editRoomAvailable" required>
                            <option value="true" ${room.available ? 'selected' : ''}>Sí</option>
                            <option value="false" ${!room.available ? 'selected' : ''}>No</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="editRoomDescription">Descripción:</label>
                    <textarea id="editRoomDescription" required>${room.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label>Servicios Incluidos:</label>
                    <div class="services-checkboxes">
                        ${servicesHtml}
                    </div>
                </div>
                
                <div class="form-buttons">
                    <button type="submit" class="btn-primary">Guardar Cambios</button>
                    <button type="button" class="btn-outline" onclick="closeEditRoomModal()">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    
    // Agregar el modal al DOM
    document.body.appendChild(modal);
    
    // Configurar evento para cerrar el modal con el botón X
    var closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.remove();
    };
    
    // Configurar evento para cerrar el modal al hacer clic fuera del contenido
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    /**
     * Manejador del envío del formulario de edición de habitación
     * Actualiza los datos de la habitación en el sistema
     */
    document.getElementById('editRoomForm').onsubmit = function(e) {
        e.preventDefault();
        
        // Recopilar los datos actualizados del formulario
        var updatedRoom = {
            id: roomId,
            name: document.getElementById('editRoomName').value,
            type: document.getElementById('editRoomType').value,
            pricePerNight: parseInt(document.getElementById('editRoomPrice').value),
            capacity: parseInt(document.getElementById('editRoomCapacity').value),
            maxGuests: parseInt(document.getElementById('editRoomCapacity').value),
            beds: parseInt(document.getElementById('editRoomBeds').value),
            available: document.getElementById('editRoomAvailable').value === 'true',
            description: document.getElementById('editRoomDescription').value,
            services: getSelectedEditServices(),
            images: room.images || [],
            image: room.image || (room.images && room.images[0]) || ''
        };
        
        // Actualizar la habitación en el array
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i].id === roomId) {
                rooms[i] = updatedRoom;
                break;
            }
        }
        
        // Guardar los datos actualizados
        storageManager.setData('rooms', rooms);
        
        // Mostrar mensaje de éxito y cerrar modal
        showNotification('Habitación actualizada exitosamente', 'success');
        modal.remove();
        
        // Recargar la lista de habitaciones
        loadRooms();
    };
}

/**
 * Función para obtener los servicios seleccionados en el formulario de edición
 * @returns {Array} - Array con los valores de los servicios seleccionados
 */
function getSelectedEditServices() {
    var services = [];
    var checkboxes = document.querySelectorAll('#editRoomModal .services-checkboxes input[type="checkbox"]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        services.push(checkboxes[i].value);
    }
    return services;
}

/**
 * Función para cerrar el modal de edición de habitación
 */
function closeEditRoomModal() {
    var modal = document.getElementById('editRoomModal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Función para cargar y mostrar todas las reservas en la tabla
 * Genera el HTML dinámicamente con información completa de usuarios y habitaciones
 */
function loadReservations() {
    var reservations = storageManager.getData('reservations') || [];
    var users = storageManager.getData('users') || [];
    var rooms = storageManager.getData('rooms') || [];
    var tbody = document.getElementById('reservationsTableBody');
    
    // Si no existe el elemento tbody, salir
    if (!tbody) return;
    
    var html = '';
    
    // Generar una fila de tabla para cada reserva
    for (var i = 0; i < reservations.length; i++) {
        var reservation = reservations[i];
        var user = null;
        var room = null;
        
        // Buscar el usuario asociado a la reserva
        for (var j = 0; j < users.length; j++) {
            if (users[j].id === reservation.userId) {
                user = users[j];
                break;
            }
        }
        
        // Buscar la habitación asociada a la reserva
        for (var j = 0; j < rooms.length; j++) {
            if (rooms[j].id === reservation.roomId) {
                room = rooms[j];
                break;
            }
        }
        
        // Obtener nombres o mensajes por defecto si no se encuentran
        var userName = user ? user.name : 'Usuario no encontrado';
        var roomName = room ? room.name : 'Habitación no encontrada';
        
        // Generar HTML de la fila de reserva
        html += '<tr>';
        html += '<td>' + reservation.id + '</td>';
        html += '<td>' + userName + '</td>';
        html += '<td>' + roomName + '</td>';
        html += '<td>' + formatDate(reservation.checkIn) + '</td>';
        html += '<td>' + formatDate(reservation.checkOut) + '</td>';
        html += '<td>' + reservation.guests + '</td>';
        html += '<td><span class="status-badge status-' + reservation.status + '">' + reservation.status + '</span></td>';
        html += '<td class="actions-cell"><div class="action-buttons">';
        html += '<button class="btn-secondary btn-sm" onclick="modifyReservationAdmin(' + reservation.id + ')"><i class="fas fa-edit"></i> Modificar</button>';
        html += '<button class="btn-danger btn-sm" onclick="deleteReservationAdmin(' + reservation.id + ')"><i class="fas fa-trash"></i> Eliminar</button>';
        html += '</div></td>';
        html += '</tr>';
    }
    
    // Insertar el HTML generado en la tabla
    tbody.innerHTML = html;
}

/**
 * Función para actualizar el estado de una reserva
 * Solicita confirmación antes de proceder con el cambio
 * @param {number} reservationId - ID de la reserva a actualizar
 * @param {string} newStatus - Nuevo estado de la reserva (confirmed, cancelled, etc.)
 */
function updateReservationStatus(reservationId, newStatus) {
    var action = newStatus === 'confirmed' ? 'confirmar' : 'cancelar';
    
    // Solicitar confirmación al usuario
    if (confirm('¿Estás seguro de que quieres ' + action + ' esta reserva?')) {
        storageManager.updateReservationStatus(reservationId, newStatus);
        
        // Recargar la lista de reservas
        loadReservations();
        
        // Mostrar mensaje de éxito
        showNotification('Reserva ' + action + 'da exitosamente', 'success');
    }
}

/**
 * Función para modificar una reserva existente
 * Crea un modal dinámico con el formulario de edición precargado con los datos actuales
 * @param {number} reservationId - ID de la reserva a modificar
 */
function modifyReservationAdmin(reservationId) {
    // Obtener la reserva actual
    var reservations = storageManager.getData('reservations') || [];
    var reservation = null;
    var room = null;
    var user = null;
    
    // Buscar la reserva por ID
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].id === reservationId) {
            reservation = reservations[i];
            break;
        }
    }
    
    // Si no se encuentra la reserva, mostrar error
    if (!reservation) {
        showNotification('Reserva no encontrada', 'error');
        return;
    }
    
    // Obtener información de la habitación y usuario
    var rooms = storageManager.getData('rooms') || [];
    var users = storageManager.getData('users') || [];
    
    // Buscar la habitación asociada
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id === reservation.roomId) {
            room = rooms[i];
            break;
        }
    }
    
    // Buscar el usuario asociado
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === reservation.userId) {
            user = users[i];
            break;
        }
    }
    
    var roomName = room ? room.name : 'Habitación no encontrada';
    var userName = user ? user.name : 'Usuario no encontrado';
    
    // Crear modal de modificación dinámicamente
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'modifyReservationModal';
    modal.style.display = 'block';
    
    // Generar opciones de habitaciones
    var roomOptions = '';
    for (var i = 0; i < rooms.length; i++) {
        var selected = rooms[i].id === reservation.roomId ? 'selected' : '';
        roomOptions += '<option value="' + rooms[i].id + '" ' + selected + '>' + rooms[i].name + ' - COP $' + rooms[i].pricePerNight.toLocaleString('es-CO') + '/noche</option>';
    }
    
    // Generar opciones de huéspedes
    var guestOptions = '';
    for (var i = 1; i <= 6; i++) {
        var selected = reservation.guests === i ? 'selected' : '';
        var text = i === 1 ? 'huésped' : 'huéspedes';
        guestOptions += '<option value="' + i + '" ' + selected + '>' + i + ' ' + text + '</option>';
    }
    
    // Crear el contenido HTML del modal con el formulario de modificación
    modal.innerHTML = `
        <div class="modal-content large">
            <span class="close">&times;</span>
            <h2>Modificar Reserva #${reservation.id}</h2>
            <div class="reservation-info">
                <p><strong>Cliente:</strong> ${userName}</p>
                <p><strong>Reserva actual:</strong> ${roomName}</p>
                <p><strong>Estado:</strong> ${reservation.status}</p>
            </div>
            
            <form id="modifyReservationForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="modifyRoomId">Habitación:</label>
                        <select id="modifyRoomId" required>
                            ${roomOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="modifyCheckIn">Fecha de entrada:</label>
                        <input type="date" id="modifyCheckIn" value="${reservation.checkIn}" required>
                    </div>
                    <div class="form-group">
                        <label for="modifyCheckOut">Fecha de salida:</label>
                        <input type="date" id="modifyCheckOut" value="${reservation.checkOut}" required>
                    </div>
                    <div class="form-group">
                        <label for="modifyGuests">Número de Huéspedes:</label>
                        <select id="modifyGuests" required>
                            ${guestOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="modifyStatus">Estado de la Reserva:</label>
                        <select id="modifyStatus" required>
                            <option value="pending" ${reservation.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                            <option value="confirmed" ${reservation.status === 'confirmed' ? 'selected' : ''}>Confirmada</option>
                            <option value="cancelled" ${reservation.status === 'cancelled' ? 'selected' : ''}>Cancelada</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="modifyNotes">Notas adicionales:</label>
                    <textarea id="modifyNotes" rows="3">${reservation.notes || ''}</textarea>
                </div>
                
                <div class="form-buttons">
                    <button type="submit" class="btn-primary">Guardar Cambios</button>
                    <button type="button" class="btn-outline" onclick="closeModifyModal()">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    
    // Agregar el modal al DOM
    document.body.appendChild(modal);
    
    // Configurar evento para cerrar el modal con el botón X
    var closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.remove();
    };
    
    // Configurar evento para cerrar el modal al hacer clic fuera del contenido
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    // Configurar fechas mínimas para los campos de fecha
    var checkInInput = document.getElementById('modifyCheckIn');
    var checkOutInput = document.getElementById('modifyCheckOut');
    
    // Fecha mínima para check-in es hoy
    var today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    
    // Fecha mínima para check-out es mañana
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    checkOutInput.min = tomorrow.toISOString().split('T')[0];
    
    // Validar fechas cuando cambia el check-in
    checkInInput.onchange = function() {
        var checkInDate = new Date(checkInInput.value);
        var nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.min = nextDay.toISOString().split('T')[0];
        
        // Si la fecha de check-out actual es inválida, limpiarla
        if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
            checkOutInput.value = '';
        }
    };
    
    /**
     * Manejador del envío del formulario de modificación de reserva
     * Valida los datos y actualiza la reserva en el sistema
     */
    document.getElementById('modifyReservationForm').onsubmit = function(e) {
        e.preventDefault();
        
        // Recopilar los nuevos datos del formulario
        var newRoomId = parseInt(document.getElementById('modifyRoomId').value);
        var newCheckIn = document.getElementById('modifyCheckIn').value;
        var newCheckOut = document.getElementById('modifyCheckOut').value;
        var newGuests = parseInt(document.getElementById('modifyGuests').value);
        var newStatus = document.getElementById('modifyStatus').value;
        var newNotes = document.getElementById('modifyNotes').value;
        
        // Validar que la fecha de salida sea posterior a la de entrada
        if (new Date(newCheckOut) <= new Date(newCheckIn)) {
            showNotification('La fecha de salida debe ser posterior a la fecha de entrada', 'error');
            return;
        }
        
        // Validar que la fecha de entrada no sea en el pasado
        if (new Date(newCheckIn) < new Date().setHours(0, 0, 0, 0)) {
            showNotification('La fecha de entrada no puede ser anterior a hoy', 'error');
            return;
        }
        
        // Verificar que la nueva habitación tenga capacidad suficiente
        var selectedRoom = null;
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i].id === newRoomId) {
                selectedRoom = rooms[i];
                break;
            }
        }
        
        if (selectedRoom && selectedRoom.capacity < newGuests) {
            showNotification('La habitación seleccionada no tiene capacidad para ' + newGuests + ' huéspedes', 'error');
            return;
        }
        
        // Verificar disponibilidad de la nueva habitación en las nuevas fechas
        if (newRoomId !== reservation.roomId || newCheckIn !== reservation.checkIn || newCheckOut !== reservation.checkOut) {
            // Verificar solapamiento manualmente excluyendo la reserva actual
            var allReservations = storageManager.getData('reservations') || [];
            var conflictingReservations = allReservations.filter(function(res) {
                return res.id !== reservationId && // Excluir la reserva actual
                       res.roomId === newRoomId &&
                       (res.status === 'confirmed' || res.status === 'pending') &&
                       storageManager.datesOverlap(newCheckIn, newCheckOut, res.checkIn, res.checkOut);
            });
            
            if (conflictingReservations.length > 0) {
                var conflictRes = conflictingReservations[0];
                var conflictCheckIn = new Date(conflictRes.checkIn).toLocaleDateString();
                var conflictCheckOut = new Date(conflictRes.checkOut).toLocaleDateString();
                showNotification('La habitación ya está reservada del ' + conflictCheckIn + ' al ' + conflictCheckOut, 'error');
                return;
            }
        }
        
        // Calcular nuevas noches y precio
        var newNights = Math.ceil((new Date(newCheckOut) - new Date(newCheckIn)) / (1000 * 60 * 60 * 24));
        var newTotalPrice = newNights * selectedRoom.pricePerNight;
        
        // Crear objeto con los datos actualizados
        var updatedData = {
            roomId: newRoomId,
            checkIn: newCheckIn,
            checkOut: newCheckOut,
            guests: newGuests,
            nights: newNights,
            totalPrice: newTotalPrice,
            status: newStatus,
            notes: newNotes,
            updatedAt: new Date().toISOString()
        };
        
        // Actualizar la reserva en el sistema
        var success = storageManager.updateReservation(reservationId, updatedData);
        
        if (success) {
            var message = 'Reserva modificada exitosamente';
            
            // Si se canceló la reserva, informar sobre la disponibilidad
            if (newStatus === 'cancelled' && reservation.status !== 'cancelled') {
                message += '. La ' + selectedRoom.name + ' vuelve a estar disponible.';
            }
            
            showNotification(message, 'success');
            modal.remove();
            loadReservations();
        } else {
            showNotification('Error al modificar la reserva', 'error');
        }
    };
}

/**
 * Función para cerrar el modal de modificación de reserva
 */
function closeModifyModal() {
    var modal = document.getElementById('modifyReservationModal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Función para eliminar permanentemente una reserva del sistema
 * Esta acción no solicita confirmación y elimina la reserva inmediatamente
 * @param {number} reservationId - ID de la reserva a eliminar
 */
function deleteReservationAdmin(reservationId) {
    // Obtener información de la reserva antes de eliminarla
    var reservations = storageManager.getData('reservations') || [];
    var rooms = storageManager.getData('rooms') || [];
    var users = storageManager.getData('users') || [];
    
    var reservation = null;
    var room = null;
    var user = null;
    
    // Buscar la reserva por ID
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].id === reservationId) {
            reservation = reservations[i];
            break;
        }
    }
    
    // Si no se encuentra la reserva, mostrar error
    if (!reservation) {
        showNotification('Reserva no encontrada', 'error');
        return;
    }
    
    // Obtener información de la habitación
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id === reservation.roomId) {
            room = rooms[i];
            break;
        }
    }
    
    // Obtener información del usuario
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === reservation.userId) {
            user = users[i];
            break;
        }
    }
    
    var roomName = room ? room.name : 'Habitación no encontrada';
    var userName = user ? user.name : 'Usuario no encontrado';
    
    // Eliminar la reserva del array
    var updatedReservations = reservations.filter(function(res) {
        return res.id !== reservationId;
    });
    
    // Guardar la lista actualizada
    storageManager.setData('reservations', updatedReservations);
    
    // Mostrar mensaje de éxito
    showNotification('Reserva eliminada permanentemente', 'success');
    
    // Recargar la lista de reservas
    loadReservations();
}


/**
 * ==========================================
 * FUNCIONES PARA GESTIÓN DE QUEJAS Y RECLAMOS
 * ==========================================
 */

/**
 * Carga y muestra todas las quejas y reclamos en la tabla del panel de administración
 */
function loadComplaints() {
    console.log('Cargando quejas y reclamos en admin...');
    
    // Usar localStorage directamente
    var complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    console.log('Quejas obtenidas del localStorage:', complaints);
    
    var tbody = document.getElementById('complaintsTableBody');
    
    if (!tbody) {
        console.error('No se encontró el elemento complaintsTableBody');
        return;
    }
    
    // Actualizar estadísticas
    updateComplaintStats(complaints);
    
    // Aplicar filtros
    var filteredComplaints = applyComplaintFilters(complaints);
    
    var html = '';
    
    if (filteredComplaints.length === 0) {
        html = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #666;">No hay quejas o reclamos disponibles</td></tr>';
        console.log('No hay quejas para mostrar');
    } else {
        for (var i = 0; i < filteredComplaints.length; i++) {
            var complaint = filteredComplaints[i];
            var statusClass = complaint.status || 'pending';
            var statusText = getComplaintStatusText(statusClass);
            var typeText = complaint.type === 'queja' ? 'Queja' : 'Reclamo';
            var date = formatDate(complaint.date);
            
            html += '<tr>';
            html += '<td>' + complaint.id + '</td>';
            html += '<td>' + (complaint.userName || 'Usuario desconocido') + '</td>';
            html += '<td><span class="complaint-type-badge ' + complaint.type + '">' + typeText + '</span></td>';
            html += '<td>' + (complaint.subject || 'Sin asunto') + '</td>';
            html += '<td>' + date + '</td>';
            html += '<td><span class="complaint-status ' + statusClass + '">' + statusText + '</span></td>';
            html += '<td class="actions-cell"><div class="action-buttons complaint-actions" style="display: flex; flex-direction: column; gap: 5px;">';
            html += '<button class="btn-sm btn-view" onclick="viewComplaintDetail(' + complaint.id + ')"><i class="fas fa-eye"></i> Ver</button>';
            if (statusClass === 'pending') {
                html += '<button class="btn-sm btn-primary" onclick="manageComplaint(' + complaint.id + ')"><i class="fas fa-edit"></i> Gestionar</button>';
            }
            html += '<button class="btn-sm btn-delete" onclick="deleteComplaintAdmin(' + complaint.id + ')"><i class="fas fa-trash"></i> Eliminar</button>';
            html += '</div></td>';
            html += '</tr>';
        }
    }
    
    tbody.innerHTML = html;
}

/**
 * Actualiza las estadísticas de quejas y reclamos
 */
function updateComplaintStats(complaints) {
    var totalComplaints = complaints.length;
    var pendingComplaints = complaints.filter(function(complaint) {
        return (complaint.status || 'pending') === 'pending';
    }).length;
    
    var resolvedComplaints = complaints.filter(function(complaint) {
        return complaint.status === 'resolved';
    }).length;
    
    var rejectedComplaints = complaints.filter(function(complaint) {
        return complaint.status === 'rejected';
    }).length;
    
    document.getElementById('totalComplaints').textContent = totalComplaints;
    document.getElementById('pendingComplaints').textContent = pendingComplaints;
    document.getElementById('resolvedComplaints').textContent = resolvedComplaints;
    document.getElementById('rejectedComplaints').textContent = rejectedComplaints;
}

/**
 * Obtiene el texto del estado de una queja/reclamo
 */
function getComplaintStatusText(status) {
    switch(status) {
        case 'pending': return 'Pendiente';
        case 'resolved': return 'Resuelto';
        case 'rejected': return 'Rechazado';
        default: return 'Desconocido';
    }
}

/**
 * Aplica filtros a las quejas y reclamos
 */
function applyComplaintFilters(complaints) {
    var statusFilter = document.getElementById('statusFilter').value;
    var typeFilter = document.getElementById('typeFilter').value;
    
    return complaints.filter(function(complaint) {
        var matchesStatus = !statusFilter || complaint.status === statusFilter;
        var matchesType = !typeFilter || complaint.type === typeFilter;
        return matchesStatus && matchesType;
    });
}

/**
 * Función para filtrar quejas y reclamos
 */
function filterComplaints() {
    loadComplaints();
}

/**
 * Ver queja/reclamo completa en modal
 */
function viewComplaintDetail(complaintId) {
    var complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    var complaint = complaints.find(function(c) { return c.id == complaintId; });
    
    if (!complaint) {
        showNotification('No se encontró la queja/reclamo', 'error');
        return;
    }
    
    // Obtener información adicional
    var reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    var reservation = reservations.find(function(r) { return r.id === complaint.reservationId; });
    
    var rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    var room = reservation ? rooms.find(function(r) { return r.id === reservation.roomId; }) : null;
    var roomName = room ? room.name : 'Habitación';
    
    var date = formatDate(complaint.date);
    var typeText = complaint.type === 'queja' ? 'Queja' : 'Reclamo';
    
    var modalContent = `
        <div class="complaint-detail-content">
            <h3>Detalle de ${typeText}</h3>
            
            <div class="detail-section">
                <h4>Información General</h4>
                <p><strong>ID:</strong> ${complaint.id}</p>
                <p><strong>Tipo:</strong> ${typeText}</p>
                <p><strong>Estado:</strong> ${getComplaintStatusText(complaint.status)}</p>
                <p><strong>Fecha:</strong> ${date}</p>
                <p><strong>Usuario:</strong> ${complaint.userName}</p>
                <p><strong>Email:</strong> ${complaint.userEmail}</p>
            </div>
            
            <div class="detail-section">
                <h4>Información de Reserva</h4>
                <p><strong>Habitación:</strong> ${roomName}</p>
                ${reservation ? `
                    <p><strong>Check-in:</strong> ${formatDate(reservation.checkIn)}</p>
                    <p><strong>Check-out:</strong> ${formatDate(reservation.checkOut)}</p>
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
            ` : ''}
        </div>
    `;
    
    // Mostrar modal
    var modal = document.getElementById('complaintModal');
    var modalContentElement = document.getElementById('complaintModalContent');
    
    modalContentElement.innerHTML = modalContent;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Configurar botón de cerrar
    var closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }
    
    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
}

/**
 * Gestionar queja/reclamo (responder y cambiar estado)
 */
function manageComplaint(complaintId) {
    var complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    var complaint = complaints.find(function(c) { return c.id == complaintId; });
    
    if (!complaint) {
        showNotification('No se encontró la queja/reclamo', 'error');
        return;
    }
    
    var typeText = complaint.type === 'queja' ? 'Queja' : 'Reclamo';
    
    var modalContent = `
        <div class="complaint-management-content">
            <h3>Gestionar ${typeText}</h3>
            
            <div class="complaint-info">
                <p><strong>Usuario:</strong> ${complaint.userName}</p>
                <p><strong>Asunto:</strong> ${complaint.subject}</p>
                <p><strong>Fecha:</strong> ${formatDate(complaint.date)}</p>
            </div>
            
            <div class="detail-section">
                <h4>Descripción</h4>
                <p>${complaint.description}</p>
            </div>
            
            <form id="complaintManagementForm">
                <div class="form-group">
                    <label for="complaintResponse">Respuesta del Administrador:</label>
                    <textarea id="complaintResponse" name="response" rows="4" placeholder="Escribe tu respuesta aquí..." required>${complaint.adminResponse || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="complaintStatus">Nuevo Estado:</label>
                    <select id="complaintStatus" name="status" required>
                        <option value="pending" ${complaint.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                        <option value="resolved" ${complaint.status === 'resolved' ? 'selected' : ''}>Resuelto</option>
                        <option value="rejected" ${complaint.status === 'rejected' ? 'selected' : ''}>Rechazado</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeComplaintModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                </div>
            </form>
        </div>
    `;
    
    // Mostrar modal
    var modal = document.getElementById('complaintModal');
    var modalContentElement = document.getElementById('complaintModalContent');
    
    modalContentElement.innerHTML = modalContent;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Configurar formulario
    var form = document.getElementById('complaintManagementForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveComplaintManagement(complaintId);
    });
    
    // Configurar botón de cerrar
    var closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };
    }
    
    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
}

/**
 * Guarda los cambios de gestión de queja/reclamo
 */
function saveComplaintManagement(complaintId) {
    var response = document.getElementById('complaintResponse').value.trim();
    var status = document.getElementById('complaintStatus').value;
    
    if (!response) {
        showNotification('Por favor escribe una respuesta', 'error');
        return;
    }
    
    var complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    var complaintIndex = complaints.findIndex(function(c) { return c.id == complaintId; });
    
    if (complaintIndex === -1) {
        showNotification('No se encontró la queja/reclamo', 'error');
        return;
    }
    
    // Actualizar queja
    complaints[complaintIndex].adminResponse = response;
    complaints[complaintIndex].status = status;
    complaints[complaintIndex].resolvedDate = new Date().toISOString();
    
    // Guardar en localStorage
    localStorage.setItem('complaints', JSON.stringify(complaints));
    
    // Mostrar mensaje de éxito
    var statusText = getComplaintStatusText(status);
    showNotification('Queja/reclamo actualizado exitosamente. Estado: ' + statusText, 'success');
    
    // Cerrar modal
    document.getElementById('complaintModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Recargar listado
    loadComplaints();
}

/**
 * Cierra el modal de gestión de quejas
 */
function closeComplaintModal() {
    document.getElementById('complaintModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

/**
 * Elimina una queja o reclamo desde el panel de administración
 */
function deleteComplaintAdmin(complaintId) {
    const complaints = storageManager.getData('complaints') || [];
    const complaintIndex = complaints.findIndex(c => c.id == complaintId);
    
    if (complaintIndex === -1) {
        showNotification('No se encontró la queja/reclamo', 'error');
        return;
    }

    const complaint = complaints[complaintIndex];
    
    // Eliminar de la lista
    complaints.splice(complaintIndex, 1);
    
    // Guardar lista actualizada usando storageManager
    storageManager.setData('complaints', complaints);
    
    // Mostrar mensaje de éxito
    showNotification('Queja/reclamo eliminado exitosamente', 'success');
    
    // Recargar la lista de quejas
    loadComplaints();
}

