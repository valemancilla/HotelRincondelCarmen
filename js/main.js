// Funciones principales

function initMobileNav() {
    var hamburger = document.querySelector('.hamburger');
    var navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
        hamburger.onclick = function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
        };

        var links = document.querySelectorAll('.nav-link');
        for (var i = 0; i < links.length; i++) {
            links[i].onclick = function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
            };
        }
    }
}

function initScrollEffects() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.onscroll = function() {
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(28, 28, 28, 0.95)';
                    navbar.style.backdropFilter = 'blur(10px)';
                } else {
                    navbar.style.background = 'rgba(28, 28, 28)';
                    navbar.style.backdropFilter = 'none';
                }
    };

    var observer = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                entries[i].target.classList.add('fade-in');
            }
        }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    var elements = document.querySelectorAll('.room-card, .area-card, .service-item, .contact-card');
    for (var i = 0; i < elements.length; i++) {
        observer.observe(elements[i]);
    }
}

function initModalEscape() {
    document.onkeydown = function(e) {
        if (e.key === 'Escape') {
            var modal = document.querySelector('.modal[style*="block"]');
            if (modal) modal.style.display = 'none';
        }
    };
}

function addAnimationStyles() {
    if (document.getElementById('notification-styles')) return;
    
    var style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = '@keyframes slideInRight {from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOutRight{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}';
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    initScrollEffects();
    initModalEscape();
    addAnimationStyles();
});
