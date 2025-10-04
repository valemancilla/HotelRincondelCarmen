// Suites Page JavaScript
// Suite modal functionality and navigation

// Suite details data
const suiteDetails = {
    'iconica': {
        name: 'Suite Icónica con Terraza Privada y Vista a la Caldera',
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-35-600x400.jpg',
        description: 'Para los huéspedes que anhelan la icónica experiencia de Santorini, sin tener que comprometer el lujo y la comodidad.',
        price: '$450/noche',
        features: ['Cama King Size', 'Máximo 2 personas', 'WiFi Gratuito', 'Minibar', 'Jacuzzi Privado', 'Vista a la Caldera']
    },
    'mitica': {
        name: 'Suite Mítica con Terraza Privada y Vista de 180° a la Caldera',
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-40-600x500.jpg',
        description: 'Para los huéspedes que buscan una versión moderna de la experiencia clásica de Santorini, nuestras Mythic Suites cuentan con interiores modernos y espaciosos y vistas que pueden robarse cualquier espectáculo.',
        price: '$520/noche',
        features: ['Cama King Size', 'Máximo 2 personas', 'WiFi Gratuito', 'Minibar', 'Terraza Privada', 'Vista 180° a la Caldera']
    },
    'epica': {
        name: 'Suite Épica con Terraza Privada y Vista de 180° a la Caldera',
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2020/02/Homepage-2-600x500.jpg',
        description: 'Para los huéspedes que buscan un escape privado, nuestras Epic Suites actuarán como un refugio moderno y contemporáneo donde podrán recargar energías y reconectarse.',
        price: '$580/noche',
        features: ['Cama King Size', 'Máximo 2 personas', 'WiFi Gratuito', 'Minibar', 'Terraza Privada', 'Vista 180° a la Caldera']
    },
    'deluxe': {
        name: 'Suite Majestic con Terraza Privada y Vista de 180° a la Caldera',
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-24-600x500.jpg',
        description: 'Para los huéspedes que buscan un escape privado, nuestra Majestic Suite actuará como su refugio contemporáneo moderno donde podrán recargar energías y reconectarse.',
        price: '$650/noche',
        features: ['Cama King Size', 'Máximo 2 personas', 'WiFi Gratuito', 'Minibar', 'Terraza Privada', 'Vista 180° a la Caldera']
    },
    'premium': {
        name: 'Suite Element con Terraza Privada Estilo Cueva con Vista de 180° a la Caldera',
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-26-600x500.jpg',
        description: 'La Suite Element es nuestra suite más exclusiva, inspirada en las formaciones rocosas orgánicas que dan fama a Santorini. Originalmente una de las famosas cuevas de Oia, esta villa está diseñada para huéspedes que buscan un refugio de ensueño.',
        price: '$750/noche',
        features: ['Cama King Size', 'Máximo 2 personas', 'WiFi Gratuito', 'Minibar', 'Terraza Estilo Cueva', 'Vista 180° a la Caldera']
    },
    'master': {
        name: 'La Suite Santa con Terraza Privada y Vista de 180° a la Caldera',
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2019/12/HighRes-6-min-1-scaled-e1575923182587-600x500.jpg',
        description: 'Para los huéspedes que anhelan la icónica experiencia de Santorini, sin tener que comprometer el lujo y la comodidad.',
        price: '$820/noche',
        features: ['Cama King Size', 'Máximo 2 personas', 'WiFi Gratuito', 'Minibar', 'Terraza Privada', 'Vista 180° a la Caldera']
    },
    'royal': {
        name: 'Villa One Saint con Terraza Privada y Vistas a la Caldera',
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2022/06/The-One-Private-Villa-Exterior-Pool-scaled-600x500.jpg',
        description: 'La villa "ONE" de SAINT es nuestra villa más exclusiva y ofrece impresionantes vistas de la Caldera de Santorini desde dos de sus áreas de estar al aire libre.',
        price: '$1200/noche',
        features: ['Cama King Size', 'Máximo 4 personas', 'WiFi Gratuito', 'Minibar', 'Piscina Privada', 'Vista 360° a la Caldera', 'Servicio de Mayordomo']
    }
};

function viewSuite(suiteType) {
    const suite = suiteDetails[suiteType];
    if (suite) {
        // Redirect to specific suite pages
        const suitePages = {
            'iconica': 'suite-detail.html',
            'mitica': 'suite-mitica.html',
            'epica': 'suite-epica.html',
            'deluxe': 'suite-majestic.html',
            'premium': 'suite-elementos.html',
            'master': 'suite-santa.html',
            'royal': 'suite-villa-santo.html'
        };
        
        const targetPage = suitePages[suiteType];
        if (targetPage) {
            window.location.href = targetPage;
        } else {
            window.location.href = 'suite-detail.html';
        }
    }
}

function showSuiteModal(suite) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    `;

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 8px;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    `;

    modal.innerHTML = `
        <div style="position: relative;">
            <img src="${suite.image}" alt="${suite.name}" style="width: 100%; height: 400px; object-fit: cover; border-radius: 8px 8px 0 0;">
            <button onclick="closeModal()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 1.5rem;">×</button>
        </div>
        <div style="padding: 2rem;">
            <h2 style="font-family: 'Playfair Display', serif; font-size: 2rem; color: #2c3e50; margin-bottom: 1rem;">${suite.name}</h2>
            <p style="font-family: 'Open Sans', sans-serif; color: #666; margin-bottom: 2rem; line-height: 1.6;">${suite.description}</p>
            
            <div style="margin-bottom: 2rem;">
                <h3 style="font-family: 'Playfair Display', serif; color: #2c3e50; margin-bottom: 1rem;">Comodidades:</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    ${suite.features.map(feature => `
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span style="color: #b89a7e;">✓</span>
                            <span style="font-family: 'Open Sans', sans-serif; color: #2c3e50;">${feature}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div style="font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #b89a7e; font-weight: 700;">
                    ${suite.price}
                </div>
                <button onclick="reserveSuite('${suite.name}')" style="background: #b89a7e; color: white; border: none; padding: 1rem 2rem; font-family: 'Open Sans', sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; border-radius: 4px; transition: all 0.3s ease;">
                    RESERVAR AHORA
                </button>
            </div>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close modal when clicking on overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });
}

function closeModal() {
    const overlay = document.querySelector('div[style*="position: fixed"]');
    if (overlay) {
        overlay.remove();
    }
}

function reserveSuite(suiteName) {
    alert(`Redirigiendo a la página de reservas para: ${suiteName}`);
    // Here you can redirect to reservations page
    // window.location.href = '../html/reservas.html';
}

// Initialize functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Any initialization code can go here
});

// Make functions globally available for onclick handlers
window.viewSuite = viewSuite;
window.closeModal = closeModal;
window.reserveSuite = reserveSuite;
