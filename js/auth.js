// Sistema de autenticacion

var currentUser = null;

function initAuth() {
    var savedUser = localStorage.getItem('current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
    bindAuthEvents();
    cleanupDuplicateIcons();
}

function cleanupDuplicateIcons() {
    // Limpiar iconos duplicados de contraseña
    var passwordWrappers = document.querySelectorAll('.password-input-wrapper');
    for (var i = 0; i < passwordWrappers.length; i++) {
        var wrapper = passwordWrappers[i];
        var icons = wrapper.querySelectorAll('.toggle-password');
        
        // Si hay más de un icono, eliminar los duplicados
        if (icons.length > 1) {
            for (var j = 1; j < icons.length; j++) {
                icons[j].remove();
            }
        }
    }
}

function bindAuthEvents() {
    // Use event delegation for better reliability with dynamic elements
    document.body.addEventListener('click', function(e) {
        var target = e.target;
        
        // Login button
        if (target.id === 'loginBtn' || target.closest('#loginBtn')) {
            e.preventDefault();
            showLoginModal();
            return;
        }
        
        // Logout button
        if (target.id === 'logoutBtn' || target.closest('#logoutBtn')) {
            e.preventDefault();
            logout();
            return;
        }
        
        // Admin button
        if (target.id === 'adminBtn' || target.closest('#adminBtn')) {
            e.preventDefault();
            var currentPath = window.location.pathname;
            if (currentPath.includes('html/')) {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'html/admin.html';
            }
            return;
        }
        
        // Show register link
        if (target.id === 'showRegister' || target.closest('#showRegister')) {
            e.preventDefault();
            showRegisterModal();
            return;
        }
        
        // Show login link
        if (target.id === 'showLogin' || target.closest('#showLogin')) {
            e.preventDefault();
            showLoginModal();
            return;
        }
    });

    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

    var registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }

    bindModalEvents();
}

// Variable global para evitar duplicar event listeners
var modalEventsBound = false;

function bindModalEvents() {
    // Si ya se ejecutó, no hacer nada
    if (modalEventsBound) return;
    modalEventsBound = true;
    
    // Usar event delegation para evitar duplicar listeners
    document.body.addEventListener('click', function(e) {
        var target = e.target;
        
        // Cerrar modal al hacer clic fuera
        if (target.classList.contains('modal')) {
            target.style.display = 'none';
        }
        
        // Cerrar modal con botón X
        if (target.classList.contains('close')) {
            var modal = target.closest('.modal');
            if (modal) modal.style.display = 'none';
        }
        
        // Toggle password visibility
        if (target.classList.contains('toggle-password')) {
            var targetId = target.getAttribute('data-target');
            var input = document.getElementById(targetId);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    target.classList.remove('fa-eye');
                    target.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    target.classList.remove('fa-eye-slash');
                    target.classList.add('fa-eye');
                }
            }
        }
    });
}

function showLoginModal() {
    var modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        var registerModal = document.getElementById('registerModal');
        if (registerModal) registerModal.style.display = 'none';
        cleanupDuplicateIcons();
    }
}

function showRegisterModal() {
    var modal = document.getElementById('registerModal');
    if (modal) {
        modal.style.display = 'block';
        var loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'none';
        cleanupDuplicateIcons();
    }
}

function handleLogin() {
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }

    var user = storageManager.getUserByEmail(email);
    
    if (!user || user.password !== password) {
        showNotification('Email o contraseña incorrectos', 'error');
        return;
    }

    currentUser = user;
    localStorage.setItem('current_user', JSON.stringify(user));
    
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginForm').reset();
    
    updateAuthUI();
    showNotification('¡Bienvenido ' + user.name + '!', 'success');
}

function handleRegister() {
    var formData = {
        identification: document.getElementById('regId').value,
        name: document.getElementById('regName').value,
        nationality: document.getElementById('regNationality').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        password: document.getElementById('regPassword').value
    };

    if (!validateRegistration(formData)) {
        return;
    }

    var existingUser = storageManager.getUserByEmail(formData.email);
    if (existingUser) {
        showNotification('Este email ya está registrado', 'error');
        return;
    }

    var users = storageManager.getUsers();
    for (var i = 0; i < users.length; i++) {
        if (users[i].identification === formData.identification) {
            showNotification('Este número de identificación ya está registrado', 'error');
            return;
        }
    }

    storageManager.addUser(formData);
    
    document.getElementById('registerModal').style.display = 'none';
    showNotification('Registro exitoso. Ahora puedes iniciar sesión', 'success');
    
    setTimeout(function() {
        showLoginModal();
    }, 1500);
}

function validateRegistration(data) {
    if (!data.identification || data.identification.length < 6) {
        showNotification('El número de identificación debe tener al menos 6 caracteres', 'error');
        return false;
    }

    if (!data.name || data.name.length < 2) {
        showNotification('El nombre debe tener al menos 2 caracteres', 'error');
        return false;
    }

    if (!data.nationality || data.nationality.length < 2) {
        showNotification('La nacionalidad es requerida', 'error');
        return false;
    }

    if (!data.email || !isValidEmail(data.email)) {
        showNotification('Ingresa un email válido', 'error');
        return false;
    }

    if (!data.phone || data.phone.length < 10) {
        showNotification('El teléfono debe tener al menos 10 caracteres', 'error');
        return false;
    }

    if (!data.password || data.password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }

    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('current_user');
    updateAuthUI();
    showNotification('Has cerrado sesión exitosamente', 'success');
    
    setTimeout(function() {
        window.location.href = window.location.pathname.includes('html/') ? '../index.html' : 'index.html';
    }, 1000);
}

function updateAuthUI() {
    var loginBtn = document.getElementById('loginBtn');
    var logoutBtnItem = document.getElementById('logoutBtnItem');
    var adminBtn = document.getElementById('adminBtn');
    var userGreeting = document.getElementById('userGreeting');
    var userName = document.getElementById('userName');

    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtnItem) logoutBtnItem.style.display = 'block';
        if (adminBtn && currentUser.role === 'admin') adminBtn.style.display = 'block';
        
        // Show user greeting
        if (userGreeting && userName) {
            userGreeting.style.display = 'block';
            if (currentUser.role === 'admin') {
                userName.textContent = 'Admin';
            } else {
                userName.textContent = 'Hola, ' + currentUser.name;
            }
        }
        
        loadUserReservations();
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtnItem) logoutBtnItem.style.display = 'none';
        if (adminBtn) adminBtn.style.display = 'none';
        
        // Hide user greeting
        if (userGreeting) {
            userGreeting.style.display = 'none';
        }
    }
}

function isAuthenticated() {
    return currentUser !== null;
}

function getCurrentUser() {
    return currentUser;
}

function loadUserReservations() {
    if (!currentUser) {
        var myReservationsSection = document.getElementById('myReservations');
        if (myReservationsSection) {
            myReservationsSection.style.display = 'none';
        }
        return;
    }

    var allReservations = storageManager.getReservationsByUser(currentUser.id);
    var reservationsList = document.getElementById('reservationsList');
    var myReservationsSection = document.getElementById('myReservations');
    
    if (!reservationsList) return;

    if (myReservationsSection) {
        myReservationsSection.style.display = 'block';
    }

    if (allReservations.length === 0) {
        var url = window.location.pathname.includes('html/') ? 'reservas.html' : 'html/reservas.html';
        reservationsList.innerHTML = '<div class="empty-state"><i class="fas fa-calendar-times"></i><h3>No tienes reservas</h3><p>¡Haz tu primera reserva ahora!</p><a href="' + url + '" class="btn-suites">VER HABITACIONES</a></div>';
        return;
    }

    var html = '';
    for (var i = 0; i < allReservations.length; i++) {
        var reservation = allReservations[i];
        var room = storageManager.getRoomById(reservation.roomId);
        var checkIn = new Date(reservation.checkIn).toLocaleDateString('es-CO');
        var checkOut = new Date(reservation.checkOut).toLocaleDateString('es-CO');
        var totalNights = Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24));
        // Usar el precio total guardado en la reserva o calcular si no existe
        var totalPrice = reservation.totalPrice || (totalNights * room.pricePerNight);
        var roomImage = room.images && room.images[0] ? room.images[0] : 'https://via.placeholder.com/400x300?text=Sin+Imagen';
        var statusClass = reservation.status === 'cancelled' ? 'cancelled-reservation' : '';
        var statusIcon = reservation.status === 'pending' ? 'clock' : reservation.status === 'confirmed' ? 'check-circle' : reservation.status === 'cancelled' ? 'times-circle' : 'circle';
        var statusText = getStatusText(reservation.status);
        var cancelledOverlay = reservation.status === 'cancelled' ? '<div class="cancelled-overlay">CANCELADA</div>' : '';
        var nightsText = totalNights === 1 ? 'noche' : 'noches';
        var guestsText = reservation.guests === 1 ? 'huésped' : 'huéspedes';
        var priceClass = reservation.status === 'cancelled' ? 'cancelled-price' : '';
        
        html += '<div class="reservation-card-vertical ' + statusClass + '">';
        html += '<div class="reservation-image-top">';
        html += '<img src="' + roomImage + '" alt="' + room.name + '">';
        html += '<div class="status-overlay status-' + reservation.status + '"><i class="fas fa-' + statusIcon + '"></i> ' + statusText + '</div>';
        html += cancelledOverlay;
        html += '</div>';
        html += '<div class="reservation-content-vertical">';
        html += '<h3 class="room-name-vertical">' + room.name + '</h3>';
        html += '<div class="dates-section">';
        html += '<div class="date-box"><i class="fas fa-sign-in-alt"></i><div><small>Check-in</small><strong>' + checkIn + '</strong></div></div>';
        html += '<div class="nights-indicator"><i class="fas fa-moon"></i> ' + totalNights + ' ' + nightsText + '</div>';
        html += '<div class="date-box"><i class="fas fa-sign-out-alt"></i><div><small>Check-out</small><strong>' + checkOut + '</strong></div></div>';
        html += '</div>';
        html += '<div class="guests-info"><i class="fas fa-users"></i><span>' + reservation.guests + ' ' + guestsText + '</span></div>';
        html += '<div class="price-box ' + priceClass + '"><div class="price-total">Total: COP $' + totalPrice.toLocaleString('es-CO') + '</div></div>';
        
        if (reservation.status !== 'cancelled') {
            html += '<div class="reservation-actions-vertical">';
            html += '<button class="btn-outline" onclick="authManager.modifyReservation(' + reservation.id + ')"><i class="fas fa-edit"></i> Modificar</button>';
            html += '<button class="btn-danger" onclick="authManager.cancelReservation(' + reservation.id + ')"><i class="fas fa-times"></i> Cancelar</button>';
            html += '</div>';
        }
        
        html += '</div></div>';
    }
    
    reservationsList.innerHTML = html;
}

function getStatusText(status) {
    var statuses = {
        'pending': 'Pendiente',
        'confirmed': 'Confirmada',
        'cancelled': 'Cancelada',
        'completed': 'Completada'
    };
    return statuses[status] || status;
}

function getRoomTypeName(type) {
    var types = {
        'standard': 'Estándar',
        'deluxe': 'Deluxe',
        'suite': 'Suite',
        'presidential': 'Presidencial',
        'villa': 'Villa'
    };
    return types[type] || type;
}

function modifyReservation(reservationId) {
    var reservations = storageManager.getAllReservations();
    var reservation = null;
    
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].id === reservationId) {
            reservation = reservations[i];
            break;
        }
    }
    
    if (!reservation) return;
    
    var room = storageManager.getRoomById(reservation.roomId);
    
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editReservationModal';
    modal.style.display = 'block';
    
    var guestOptions = '';
    for (var i = 1; i <= 4; i++) {
        var selected = reservation.guests === i ? 'selected' : '';
        var text = i === 1 ? 'huésped' : 'huéspedes';
        guestOptions += '<option value="' + i + '" ' + selected + '>' + i + ' ' + text + '</option>';
    }
    
    modal.innerHTML = '<div class="modal-content"><span class="close">&times;</span><h2>Modificar Reserva</h2><p><strong>Habitación:</strong> ' + room.name + '</p><form id="editReservationForm"><div class="form-group"><label for="editCheckIn">Fecha de entrada:</label><input type="date" id="editCheckIn" value="' + reservation.checkIn + '" required></div><div class="form-group"><label for="editCheckOut">Fecha de salida:</label><input type="date" id="editCheckOut" value="' + reservation.checkOut + '" required></div><div class="form-group"><label for="editGuests">Número de Huéspedes:</label><select id="editGuests" required>' + guestOptions + '</select></div><div class="form-buttons"><button type="submit" class="btn-primary">Guardar Cambios</button><button type="button" class="btn-outline" onclick="document.getElementById(\'editReservationModal\').remove()">Cancelar</button></div></form></div>';
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close').onclick = function() {
        modal.remove();
    };
    
    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
    
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    var dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    var dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];
    
    var editCheckIn = document.getElementById('editCheckIn');
    var editCheckOut = document.getElementById('editCheckOut');
    
    editCheckIn.min = tomorrowStr;
    editCheckOut.min = dayAfterTomorrowStr;
    
    editCheckIn.onchange = function() {
        var checkInDate = new Date(editCheckIn.value);
        var nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        editCheckOut.min = nextDay.toISOString().split('T')[0];
        
        if (editCheckOut.value && new Date(editCheckOut.value) <= checkInDate) {
            editCheckOut.value = '';
        }
    };
    
    document.getElementById('editReservationForm').onsubmit = function(e) {
        e.preventDefault();
        
        var newCheckIn = document.getElementById('editCheckIn').value;
        var newCheckOut = document.getElementById('editCheckOut').value;
        var newGuests = parseInt(document.getElementById('editGuests').value);
        
        if (new Date(newCheckOut) <= new Date(newCheckIn)) {
            alert('La fecha de salida debe ser posterior a la fecha de entrada');
            return;
        }
        
        var newNights = Math.ceil((new Date(newCheckOut) - new Date(newCheckIn)) / (1000 * 60 * 60 * 24));
        
        var updatedData = {
            checkIn: newCheckIn,
            checkOut: newCheckOut,
            nights: newNights,
            guests: newGuests
        };
        
        storageManager.updateReservation(reservationId, updatedData);
        modal.remove();
        loadUserReservations();
        showNotification('Reserva modificada exitosamente', 'success');
    };
}

function cancelReservation(reservationId) {
    // Obtener información de la reserva antes de cancelarla
    var reservations = storageManager.getData('reservations') || [];
    var reservation = null;
    var room = null;
    
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].id === reservationId) {
            reservation = reservations[i];
            room = storageManager.getRoomById(reservation.roomId);
            break;
        }
    }
    
    // Cancelar la reserva
    storageManager.updateReservationStatus(reservationId, 'cancelled');
    loadUserReservations();
    
    // Mostrar mensaje específico sobre la disponibilidad
    var roomName = room ? room.name : 'Habitación';
    showNotification('Reserva cancelada exitosamente. La ' + roomName + ' vuelve a estar disponible.', 'success');
    
    // Refrescar búsqueda si hay fechas seleccionadas
    var checkInInput = document.getElementById('checkIn');
    var checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput && checkOutInput && checkInInput.value && checkOutInput.value) {
        if (window.reservationManager && window.reservationManager.refreshSearch) {
            window.reservationManager.refreshSearch();
        }
    }
}

var authManager = {
    isAuthenticated: isAuthenticated,
    getCurrentUser: getCurrentUser,
    showLoginModal: showLoginModal,
    loadUserReservations: loadUserReservations,
    modifyReservation: modifyReservation,
    cancelReservation: cancelReservation
};

window.authManager = authManager;

document.addEventListener('DOMContentLoaded', function() {
    initAuth();
});
