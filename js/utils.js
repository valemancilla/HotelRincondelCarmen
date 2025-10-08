// Funciones utiles

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatCurrency(amount) {
    return 'COP $' + amount.toLocaleString('es-CO');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateNights(checkIn, checkOut) {
    var diff = new Date(checkOut) - new Date(checkIn);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getTomorrow() {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

function showNotification(message, type) {
    if (!type) type = 'success';
    
    var notification = document.createElement('div');
    notification.className = 'alert alert-' + type;
    notification.style.cssText = 'position:fixed;top:100px;right:20px;z-index:3000;max-width:300px;animation:slideInRight 0.3s ease';
    
    var icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    notification.innerHTML = '<i class="fas fa-' + icon + '"></i> ' + message;
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function setMinDate(input, days) {
    if (!input) return;
    if (!days) days = 1;
    
    var date = new Date();
    date.setDate(date.getDate() + days);
    input.min = date.toISOString().split('T')[0];
}

function datesOverlap(start1, end1, start2, end2) {
    return new Date(start1) < new Date(end2) && new Date(end1) > new Date(start2);
}

