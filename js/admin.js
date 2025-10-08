// Panel de administracion

document.addEventListener('DOMContentLoaded', function() {
    var currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (!currentUser || currentUser.role !== 'admin') {
        alert('No tienes permisos para acceder a esta página');
        window.location.href = '../index.html';
        return;
    }

    loadRooms();

    var roomForm = document.getElementById('roomForm');
    if (roomForm) {
        roomForm.onsubmit = handleRoomSubmit;
    }
});

function showTab(tabName) {
    var tabs = document.querySelectorAll('.tab-content');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    var adminTabs = document.querySelectorAll('.admin-tab');
    for (var i = 0; i < adminTabs.length; i++) {
        adminTabs[i].classList.remove('active');
    }
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
    
    if (tabName === 'rooms') {
        loadRooms();
    } else if (tabName === 'reservations') {
        loadReservations();
    }
}

function handleRoomSubmit(e) {
    e.preventDefault();
    
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
    
    var rooms = storageManager.getData('rooms') || [];
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
        images: []
    };
    rooms.push(newRoom);
    storageManager.setData('rooms', rooms);
    
    e.target.reset();
    loadRooms();
    showNotification('Habitación agregada exitosamente', 'success');
}

function getSelectedServices() {
    var services = [];
    var checkboxes = document.querySelectorAll('.services-checkboxes input[type="checkbox"]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        services.push(checkboxes[i].value);
    }
    return services;
}

function loadRooms() {
    var rooms = storageManager.getData('rooms') || [];
    var tbody = document.getElementById('roomsTableBody');
    
    if (!tbody) return;
    
    var html = '';
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
    
    tbody.innerHTML = html;
}

function deleteRoom(roomId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta habitación?')) {
        var rooms = storageManager.getData('rooms') || [];
        var updatedRooms = [];
        
        for (var i = 0; i < rooms.length; i++) {
            if (rooms[i].id !== roomId) {
                updatedRooms.push(rooms[i]);
            }
        }
        
        storageManager.setData('rooms', updatedRooms);
        loadRooms();
        showNotification('Habitación eliminada exitosamente', 'success');
    }
}

function editRoom(roomId) {
    var rooms = storageManager.getData('rooms') || [];
    var room = null;
    
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id === roomId) {
            room = rooms[i];
            break;
        }
    }
    
    if (!room) {
        showNotification('Habitación no encontrada', 'error');
        return;
    }
    
    // Crear modal de edición
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editRoomModal';
    modal.style.display = 'block';
    
    // Generar checkboxes de servicios
    var servicesHtml = '';
    var availableServices = ['wifi', 'minibar', 'jacuzzi', 'tv', 'ac', 'balcony', 'room-service', 'safe', 'pool', 'terrace'];
    var roomServices = room.services || [];
    
    for (var i = 0; i < availableServices.length; i++) {
        var service = availableServices[i];
        var checked = roomServices.includes(service) ? 'checked' : '';
        var label = service.charAt(0).toUpperCase() + service.slice(1);
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
    
    document.body.appendChild(modal);
    
    // Configurar eventos
    var closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.remove();
    };
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    // Manejar envío del formulario
    document.getElementById('editRoomForm').onsubmit = function(e) {
        e.preventDefault();
        
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
        
        storageManager.setData('rooms', rooms);
        
        showNotification('Habitación actualizada exitosamente', 'success');
        modal.remove();
        loadRooms();
    };
}

function getSelectedEditServices() {
    var services = [];
    var checkboxes = document.querySelectorAll('#editRoomModal .services-checkboxes input[type="checkbox"]:checked');
    for (var i = 0; i < checkboxes.length; i++) {
        services.push(checkboxes[i].value);
    }
    return services;
}

function closeEditRoomModal() {
    var modal = document.getElementById('editRoomModal');
    if (modal) {
        modal.remove();
    }
}

function loadReservations() {
    var reservations = storageManager.getData('reservations') || [];
    var users = storageManager.getData('users') || [];
    var rooms = storageManager.getData('rooms') || [];
    var tbody = document.getElementById('reservationsTableBody');
    
    if (!tbody) return;
    
    var html = '';
    for (var i = 0; i < reservations.length; i++) {
        var reservation = reservations[i];
        var user = null;
        var room = null;
        
        for (var j = 0; j < users.length; j++) {
            if (users[j].id === reservation.userId) {
                user = users[j];
                break;
            }
        }
        
        for (var j = 0; j < rooms.length; j++) {
            if (rooms[j].id === reservation.roomId) {
                room = rooms[j];
                break;
            }
        }
        
        var userName = user ? user.name : 'Usuario no encontrado';
        var roomName = room ? room.name : 'Habitación no encontrada';
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
    
    tbody.innerHTML = html;
}

function updateReservationStatus(reservationId, newStatus) {
    var action = newStatus === 'confirmed' ? 'confirmar' : 'cancelar';
    if (confirm('¿Estás seguro de que quieres ' + action + ' esta reserva?')) {
        storageManager.updateReservationStatus(reservationId, newStatus);
        loadReservations();
        showNotification('Reserva ' + action + 'da exitosamente', 'success');
    }
}

function modifyReservationAdmin(reservationId) {
    // Obtener la reserva actual
    var reservations = storageManager.getData('reservations') || [];
    var reservation = null;
    var room = null;
    var user = null;
    
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].id === reservationId) {
            reservation = reservations[i];
            break;
        }
    }
    
    if (!reservation) {
        showNotification('Reserva no encontrada', 'error');
        return;
    }
    
    // Obtener información de la habitación y usuario
    var rooms = storageManager.getData('rooms') || [];
    var users = storageManager.getData('users') || [];
    
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id === reservation.roomId) {
            room = rooms[i];
            break;
        }
    }
    
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === reservation.userId) {
            user = users[i];
            break;
        }
    }
    
    var roomName = room ? room.name : 'Habitación no encontrada';
    var userName = user ? user.name : 'Usuario no encontrado';
    
    // Crear modal de modificación
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
    
    document.body.appendChild(modal);
    
    // Configurar eventos
    var closeBtn = modal.querySelector('.close');
    closeBtn.onclick = function() {
        modal.remove();
    };
    
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    };
    
    // Configurar fechas mínimas
    var checkInInput = document.getElementById('modifyCheckIn');
    var checkOutInput = document.getElementById('modifyCheckOut');
    
    // Fecha mínima para check-in es hoy
    var today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    
    // Fecha mínima para check-out es mañana
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    checkOutInput.min = tomorrow.toISOString().split('T')[0];
    
    // Validar fechas
    checkInInput.onchange = function() {
        var checkInDate = new Date(checkInInput.value);
        var nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.min = nextDay.toISOString().split('T')[0];
        
        if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
            checkOutInput.value = '';
        }
    };
    
    // Manejar envío del formulario
    document.getElementById('modifyReservationForm').onsubmit = function(e) {
        e.preventDefault();
        
        var newRoomId = parseInt(document.getElementById('modifyRoomId').value);
        var newCheckIn = document.getElementById('modifyCheckIn').value;
        var newCheckOut = document.getElementById('modifyCheckOut').value;
        var newGuests = parseInt(document.getElementById('modifyGuests').value);
        var newStatus = document.getElementById('modifyStatus').value;
        var newNotes = document.getElementById('modifyNotes').value;
        
        // Validaciones
        if (new Date(newCheckOut) <= new Date(newCheckIn)) {
            showNotification('La fecha de salida debe ser posterior a la fecha de entrada', 'error');
            return;
        }
        
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
        
        // Actualizar la reserva
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

function closeModifyModal() {
    var modal = document.getElementById('modifyReservationModal');
    if (modal) {
        modal.remove();
    }
}

function deleteReservationAdmin(reservationId) {
    // Obtener información de la reserva
    var reservations = storageManager.getData('reservations') || [];
    var rooms = storageManager.getData('rooms') || [];
    var users = storageManager.getData('users') || [];
    
    var reservation = null;
    var room = null;
    var user = null;
    
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].id === reservationId) {
            reservation = reservations[i];
            break;
        }
    }
    
    if (!reservation) {
        showNotification('Reserva no encontrada', 'error');
        return;
    }
    
    // Obtener información de la habitación y usuario
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id === reservation.roomId) {
            room = rooms[i];
            break;
        }
    }
    
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === reservation.userId) {
            user = users[i];
            break;
        }
    }
    
    var roomName = room ? room.name : 'Habitación no encontrada';
    var userName = user ? user.name : 'Usuario no encontrado';
    
    // Eliminar directamente sin confirmación
    
    // Eliminar la reserva
    var updatedReservations = reservations.filter(function(res) {
        return res.id !== reservationId;
    });
    
    storageManager.setData('reservations', updatedReservations);
    
    showNotification('Reserva eliminada permanentemente', 'success');
    loadReservations();
}
