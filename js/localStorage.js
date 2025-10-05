// LocalStorage Utilities - Sistema de simulación completo
class LocalStorageManager {
    constructor() {
        console.log('LocalStorageManager inicializando...');
        this.initializeData();
        console.log('LocalStorageManager inicializado');
    }

    // Inicializar datos por defecto si no existen
    initializeData() {
        // Datos de usuarios por defecto
        if (!this.getData('users')) {
            this.setData('users', [
                {
                    id: 1,
                    identification: '12345678',
                    name: 'Administrador del Hotel',
                    nationality: 'Colombiana',
                    email: 'admin@hotel.com',
                    phone: '+57 300 123 4567',
                    password: 'admin123',
                    role: 'admin',
                    createdAt: new Date().toISOString()
                }
            ]);
        }

        // Datos de habitaciones/suites por defecto
        if (!this.getData('rooms')) {
            this.setData('rooms', [
                {
                    id: 1,
                    name: 'Suite Elementos',
                    type: 'suite',
                    pricePerNight: 500,
                    capacity: 2,
                    beds: 1,
                    description: 'Suite de lujo con vista al mar y terraza privada',
                    available: true,
                    services: ['wifi', 'tv', 'ac', 'balcony', 'minibar'],
                    images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/01/HighRes-5-min-scaled.jpg']
                },
                {
                    id: 2,
                    name: 'Suite Épica',
                    type: 'suite',
                    pricePerNight: 750,
                    capacity: 4,
                    beds: 2,
                    description: 'Suite premium con jacuzzi privado, vista panorámica y servicios de lujo completos',
                    available: true,
                    services: [
                        'wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi',
                        'welcome-gifts', 'room-service-24h', 'laptop-safe', 'wardrobe',
                        'walk-in-shower', 'king-bed-gold-mattress', 'smart-tv-netflix', 'hairdryer-bathrobe',
                        'e-butler-smartphone', 'custom-sunbeds', 'turndown-service', 'caldera-volcano-view',
                        'usb-bedside-plugs', 'central-ac-heating'
                    ],
                    amenities: [
                        'Welcome gifts',
                        '24-hour Room Service',
                        'Laptop safe',
                        'Wardrobe/Closet',
                        'Walk-in shower',
                        'King sized bed featuring Luxury Gold Mattress',
                        'High speed Wi-Fi',
                        'Flat Screen Smart TV - Netflix Accessible, Satellite Channels, Movie Library',
                        'Hairdryer, Bathrobe & Slippers, Molton Brown toiletries',
                        'Personal e-butler (smartphone)',
                        'Queen-sized custom sunbeds',
                        'Daily turndown service',
                        '180° Caldera & Volcano View',
                        'USB bed-side plugs',
                        'Central Air conditioning & Heating'
                    ],
                    images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/01/HighRes-38.jpg']
                },
                {
                    id: 3,
                    name: 'Suite Majestic',
                    type: 'suite',
                    pricePerNight: 1000,
                    capacity: 6,
                    beds: 3,
                    description: 'Suite presidencial con terraza privada y piscina',
                    available: true,
                    services: ['wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi'],
                    images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/01/HighRes-36.jpg']
                },
                {
                    id: 4,
                    name: 'Suite Mítica',
                    type: 'suite',
                    pricePerNight: 650,
                    capacity: 3,
                    beds: 2,
                    description: 'Suite con terraza privada y vista de 180° a la Caldera',
                    available: true,
                    services: ['wifi', 'tv', 'ac', 'balcony', 'minibar'],
                    images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-40-600x500.jpg']
                },
                {
                    id: 5,
                    name: 'Suite Santa',
                    type: 'suite',
                    pricePerNight: 550,
                    capacity: 2,
                    beds: 1,
                    description: 'Suite elegante con vista al mar y decoración tradicional',
                    available: true,
                    services: ['wifi', 'tv', 'ac', 'balcony', 'minibar'],
                    images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/01/HighRes-6-min-scaled.jpg']
                },
                {
                    id: 6,
                    name: 'Villa Santo',
                    type: 'villa',
                    pricePerNight: 1200,
                    capacity: 8,
                    beds: 4,
                    description: 'Villa privada con piscina, jacuzzi y múltiples terrazas',
                    available: true,
                    services: ['wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi'],
                    images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/01/HighRes-5-min-scaled.jpg']
                }
            ]);
        }

        // Datos de reservas por defecto
        if (!this.getData('reservations')) {
            this.setData('reservations', []);
        }

        // Datos de mensajes de contacto por defecto
        if (!this.getData('contactMessages')) {
            this.setData('contactMessages', []);
        }

        // Datos de servicios por defecto
        if (!this.getData('services')) {
            this.setData('services', [
                {
                    id: 1,
                    name: 'Trinity Restaurant',
                    type: 'restaurant',
                    description: 'Restaurante gourmet con cocina mediterránea',
                    price: 0,
                    available: true
                },
                {
                    id: 2,
                    name: 'Sky Bar',
                    type: 'bar',
                    description: 'Bar en la azotea con vista panorámica',
                    price: 0,
                    available: true
                },
                {
                    id: 3,
                    name: 'The Sacred Spa',
                    type: 'spa',
                    description: 'Spa de lujo con tratamientos relajantes',
                    price: 150,
                    available: true
                },
                {
                    id: 4,
                    name: 'Saint Gym',
                    type: 'gym',
                    description: 'Gimnasio equipado con tecnología de vanguardia',
                    price: 0,
                    available: true
                }
            ]);
        }
    }

    // Métodos genéricos para manejar localStorage
    setData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    // Métodos específicos para usuarios
    addUser(userData) {
        try {
            // Verificar que localStorage funciona
            if (!this.testLocalStorage()) {
                throw new Error('El navegador no permite el almacenamiento local. Verifica la configuración de privacidad.');
            }
            
            let users = this.getData('users');
            if (!users) {
                users = [];
            }
            
            const newUser = {
                id: this.generateId(users),
                ...userData,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            const saved = this.setData('users', users);
            
            if (!saved) {
                throw new Error('No se pudo guardar el usuario. Inténtalo de nuevo.');
            }
            
            return newUser;
        } catch (error) {
            console.error('Error in addUser:', error);
            throw error;
        }
    }

    getUsers() {
        return this.getData('users') || [];
    }

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }

    updateUser(id, userData) {
        const users = this.getData('users') || [];
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            this.setData('users', users);
            return users[index];
        }
        return null;
    }

    // Métodos específicos para reservas
    addReservation(reservationData) {
        const reservations = this.getData('reservations') || [];
        const newReservation = {
            id: this.generateId(reservations),
            ...reservationData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        reservations.push(newReservation);
        this.setData('reservations', reservations);
        return newReservation;
    }

    getReservationsByUser(userId) {
        const reservations = this.getData('reservations') || [];
        return reservations.filter(reservation => reservation.userId === userId);
    }

    updateReservationStatus(id, status) {
        const reservations = this.getData('reservations') || [];
        const index = reservations.findIndex(reservation => reservation.id === id);
        if (index !== -1) {
            reservations[index].status = status;
            reservations[index].updatedAt = new Date().toISOString();
            this.setData('reservations', reservations);
            return reservations[index];
        }
        return null;
    }

    // Métodos específicos para mensajes de contacto
    addContactMessage(messageData) {
        const messages = this.getData('contactMessages') || [];
        const newMessage = {
            id: this.generateId(messages),
            ...messageData,
            read: false,
            createdAt: new Date().toISOString()
        };
        messages.push(newMessage);
        this.setData('contactMessages', messages);
        return newMessage;
    }

    markMessageAsRead(id) {
        const messages = this.getData('contactMessages') || [];
        const index = messages.findIndex(message => message.id === id);
        if (index !== -1) {
            messages[index].read = true;
            messages[index].readAt = new Date().toISOString();
            this.setData('contactMessages', messages);
            return messages[index];
        }
        return null;
    }

    // Métodos específicos para habitaciones
    getAvailableRooms(checkIn, checkOut, guests = 1) {
        console.log('getAvailableRooms llamado con:', { checkIn, checkOut, guests });
        
        const rooms = this.getData('rooms') || [];
        const reservations = this.getData('reservations') || [];
        
        console.log('Total de habitaciones:', rooms.length);
        console.log('Total de reservas:', reservations.length);
        console.log('Habitaciones:', rooms);
        
        const availableRooms = rooms.filter(room => {
            // Verificar capacidad de la habitación
            if (room.capacity < guests) {
                console.log(`Habitación ${room.name} no tiene capacidad suficiente (${room.capacity} < ${guests})`);
                return false;
            }
            
            // Verificar si la habitación está disponible en las fechas solicitadas
            const conflictingReservations = reservations.filter(reservation => 
                reservation.roomId === room.id && 
                reservation.status === 'confirmed' &&
                this.datesOverlap(checkIn, checkOut, reservation.checkIn, reservation.checkOut)
            );
            
            console.log(`Habitación ${room.name}: ${conflictingReservations.length} reservas conflictivas`);
            
            return conflictingReservations.length === 0;
        });
        
        console.log('Habitaciones disponibles:', availableRooms.length);
        return availableRooms;
    }

    // Métodos de utilidad
    generateId(array) {
        if (array.length === 0) return 1;
        const ids = array.map(item => item.id || 0).filter(id => typeof id === 'number');
        if (ids.length === 0) return 1;
        return Math.max(...ids) + 1;
    }

    datesOverlap(start1, end1, start2, end2) {
        const d1 = new Date(start1);
        const d2 = new Date(end1);
        const d3 = new Date(start2);
        const d4 = new Date(end2);
        
        return d1 < d4 && d2 > d3;
    }

    // Método de prueba para verificar localStorage
    testLocalStorage() {
        try {
            const testData = { test: 'data' };
            localStorage.setItem('test', JSON.stringify(testData));
            const retrieved = JSON.parse(localStorage.getItem('test'));
            localStorage.removeItem('test');
            return retrieved && retrieved.test === 'data';
        } catch (error) {
            console.error('localStorage test failed:', error);
            return false;
        }
    }

    // Métodos de limpieza y reset
    clearAllData() {
        const keys = ['users', 'rooms', 'reservations', 'contactMessages', 'services'];
        keys.forEach(key => localStorage.removeItem(key));
        this.initializeData();
    }

    exportData() {
        const data = {};
        const keys = ['users', 'rooms', 'reservations', 'contactMessages', 'services'];
        keys.forEach(key => {
            data[key] = this.getData(key);
        });
        return data;
    }

    importData(data) {
        Object.keys(data).forEach(key => {
            this.setData(key, data[key]);
        });
    }
}

// Crear instancia global
const storageManager = new LocalStorageManager();

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalStorageManager;
}
