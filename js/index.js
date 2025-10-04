// Index Page JavaScript
// Hero Carousel functionality

let currentSlideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function showSlide(index) {
    // Ocultar todas las slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Mostrar la slide actual
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Auto-play del carrusel desactivado
// setInterval(() => {
//     changeSlide(1);
// }, 5000);

// Initialize carousel
function initHeroCarousel() {
    if (slides.length > 0) {
        showSlide(0);
    }
}

// "VER TODAS LAS SUITES" button functionality
function initViewAllSuitesButton() {
    const viewAllSuitesBtn = document.getElementById('viewAllSuitesBtn');
    if (viewAllSuitesBtn) {
        viewAllSuitesBtn.addEventListener('click', function() {
            window.location.href = 'html/suites.html';
        });
    }
}

// Booking Widget Functionality
function initBookingWidget() {
    const guestCount = document.querySelector('.guest-count');
    const guestUp = document.querySelector('.guest-controls .fa-chevron-up');
    const guestDown = document.querySelector('.guest-controls .fa-chevron-down');
    const checkAvailabilityBtn = document.querySelector('.check-availability-btn');

    let currentGuests = 1;

    if (guestUp && guestDown && guestCount) {
        guestUp.addEventListener('click', function() {
            if (currentGuests < 10) {
                currentGuests++;
                guestCount.textContent = currentGuests;
            }
        });

        guestDown.addEventListener('click', function() {
            if (currentGuests > 1) {
                currentGuests--;
                guestCount.textContent = currentGuests;
            }
        });
    }

    if (checkAvailabilityBtn) {
        checkAvailabilityBtn.addEventListener('click', function() {
            window.location.href = 'html/reservas.html';
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHeroCarousel();
    initViewAllSuitesButton();
    initBookingWidget();
});

// Make functions globally available for onclick handlers
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;
