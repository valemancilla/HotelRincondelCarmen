// Suite Detail Page JavaScript
// Carousel functionality for suite images

let currentSlideIndex = 1;
const slides = document.querySelectorAll('.carousel-slide');
const thumbnails = document.querySelectorAll('.thumbnail');

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    // Show current slide
    if (index > slides.length) currentSlideIndex = 1;
    if (index < 1) currentSlideIndex = slides.length;
    
    slides[currentSlideIndex - 1].classList.add('active');
    thumbnails[currentSlideIndex - 1].classList.add('active');
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index;
    showSlide(currentSlideIndex);
}

// Fullscreen functionality for carousel images
function initFullscreen() {
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            const activeSlide = document.querySelector('.carousel-slide.active');
            const img = activeSlide.querySelector('img');
            
            // Create fullscreen overlay
            const fullscreenOverlay = document.createElement('div');
            fullscreenOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            `;
            
            const fullscreenImg = document.createElement('img');
            fullscreenImg.src = img.src;
            fullscreenImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
            `;
            
            fullscreenOverlay.appendChild(fullscreenImg);
            document.body.appendChild(fullscreenOverlay);
            
            // Close on click
            fullscreenOverlay.addEventListener('click', function() {
                document.body.removeChild(fullscreenOverlay);
            });
        });
    }
}

// Check availability button functionality
function initBookingButton() {
    const checkAvailabilityBtn = document.querySelector('.check-availability-btn');
    if (checkAvailabilityBtn) {
        checkAvailabilityBtn.addEventListener('click', function() {
            alert('Redirigiendo a la página de reservas...');
            // window.location.href = 'reservas.html';
        });
    }
}

// Similar rooms functionality - Los botones redirigen directamente desde el HTML

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initFullscreen();
    initBookingButton();
});

// Make functions globally available for onclick handlers
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;
