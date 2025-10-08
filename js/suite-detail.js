// Carrusel de imagenes de suites
var suiteIndex = 1;

function showSuiteSlide(num) {
    var slides = document.querySelectorAll('.main-carousel .carousel-slide');
    var thumbs = document.querySelectorAll('.carousel-thumbnails .thumbnail');
    
    if (slides.length === 0) return;
    
    // Ocultar todas
    for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    for (var i = 0; i < thumbs.length; i++) {
        thumbs[i].classList.remove('active');
    }
    
    // Ajustar indice
    if (num > slides.length) {
        suiteIndex = 1;
    } else if (num < 1) {
        suiteIndex = slides.length;
    } else {
        suiteIndex = num;
    }
    
    // Mostrar actual
    slides[suiteIndex - 1].classList.add('active');
    if (thumbs.length > 0) {
        thumbs[suiteIndex - 1].classList.add('active');
    }
}

function changeSuiteSlide(dir) {
    suiteIndex = suiteIndex + dir;
    showSuiteSlide(suiteIndex);
}

function currentSuiteSlide(num) {
    suiteIndex = num;
    showSuiteSlide(suiteIndex);
}

function initSuiteCarousel() {
    var thumbs = document.querySelectorAll('.carousel-thumbnails .thumbnail');
    for (var i = 0; i < thumbs.length; i++) {
        thumbs[i].onclick = function() {
            var index = Array.prototype.indexOf.call(this.parentNode.children, this);
            currentSuiteSlide(index + 1);
        };
    }
}

function initFullscreen() {
    var btn = document.querySelector('.fullscreen-btn');
    if (btn) {
        btn.onclick = function() {
            var active = document.querySelector('.carousel-slide.active');
            if (!active) return;
            
            var img = active.querySelector('img');
            if (!img) return;
            
            var overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer';
            
            var newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.style.cssText = 'max-width:90%;max-height:90%;object-fit:contain';
            
            overlay.appendChild(newImg);
            document.body.appendChild(overlay);
            
            overlay.onclick = function() {
                document.body.removeChild(overlay);
            };
        };
    }
}

function initBookingButton() {
    var btn = document.querySelector('.check-availability-btn');
    if (btn) {
        btn.onclick = function() {
            window.location.href = 'reservas.html';
        };
    }
}

window.changeSuiteSlide = changeSuiteSlide;
window.currentSuiteSlide = currentSuiteSlide;

document.addEventListener('DOMContentLoaded', function() {
    initSuiteCarousel();
    showSuiteSlide(1);
    initFullscreen();
    initBookingButton();
});
