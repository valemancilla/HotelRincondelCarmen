// Carrusel del index
var heroIndex = 0;

function showSlide(index) {
    var slides = document.querySelectorAll('.carousel-slide');
    var dots = document.querySelectorAll('.dot');
    var content = document.querySelector('.hero-content');
    
    if (slides.length === 0) return;
    
    // Animacion texto
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }
    
    // Mostrar nueva imagen
    slides[index].classList.add('active');
    for (var i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    dots[index].classList.add('active');
    
    // Ocultar otras imagenes
    setTimeout(function() {
        for (var i = 0; i < slides.length; i++) {
            if (i !== index) {
                slides[i].classList.remove('active');
            }
        }
        
        if (content) {
            content.style.opacity = '1';
            content.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    }, 500);
}

function changeSlide(dir) {
    var slides = document.querySelectorAll('.carousel-slide');
    heroIndex = heroIndex + dir;
    
    if (heroIndex >= slides.length) {
        heroIndex = 0;
    } else if (heroIndex < 0) {
        heroIndex = slides.length - 1;
    }
    
    showSlide(heroIndex);
}

function currentSlide(num) {
    heroIndex = num - 1;
    showSlide(heroIndex);
}

function initHeroCarousel() {
    var slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        showSlide(0);
    }
}

function initViewAllSuitesButton() {
    var btn = document.getElementById('viewAllSuitesBtn');
    if (btn) {
        btn.onclick = function() {
            window.location.href = 'html/suites.html';
        };
    }
}

function initBookingWidget() {
    var count = document.querySelector('.guest-count');
    var up = document.querySelector('.guest-controls .fa-chevron-up');
    var down = document.querySelector('.guest-controls .fa-chevron-down');
    var btn = document.querySelector('.check-availability-btn');
    var guests = 1;

    if (up && down && count) {
        up.onclick = function() {
            if (guests < 10) {
                guests++;
                count.textContent = guests;
            }
        };

        down.onclick = function() {
            if (guests > 1) {
                guests--;
                count.textContent = guests;
            }
        };
    }

    if (btn) {
        btn.onclick = function() {
            window.location.href = 'html/reservas.html';
        };
    }
}

window.changeSlide = changeSlide;
window.currentSlide = currentSlide;

document.addEventListener('DOMContentLoaded', function() {
    initHeroCarousel();
    initViewAllSuitesButton();
    initBookingWidget();
});

