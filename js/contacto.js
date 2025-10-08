// Formulario de contacto

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('contactForm');
    var fields = ['contactName', 'contactEmail', 'contactSubject', 'contactMessage'];
    
    if (!form) return;

    form.onsubmit = function(e) {
        e.preventDefault();
        
        var data = {
            name: document.getElementById('contactName').value.trim(),
            email: document.getElementById('contactEmail').value.trim(),
            subject: document.getElementById('contactSubject').value.trim(),
            message: document.getElementById('contactMessage').value.trim() || 'Sin mensaje adicional'
        };
        
        document.getElementById('generalError').style.display = 'none';
        
        if (!data.name || !data.email || !data.subject) {
            document.getElementById('generalError').style.display = 'block';
            return;
        }
        
        storageManager.addContactMessage(data);
        
        document.getElementById('successMessage').style.display = 'block';
        form.reset();
        
        setTimeout(function() {
            document.getElementById('successMessage').style.display = 'none';
        }, 5000);
    };
    
    for (var i = 0; i < fields.length; i++) {
        var field = document.getElementById(fields[i]);
        if (field) {
            field.oninput = function() {
                document.getElementById('generalError').style.display = 'none';
                document.getElementById('successMessage').style.display = 'none';
            };
        }
    }
});

