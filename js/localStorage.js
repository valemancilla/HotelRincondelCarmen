// LocalStorage Utilities - Sistema de simulación completo
class LocalStorageManager {
    constructor() {
        console.log('LocalStorageManager inicializando...');
        this.initializeData();
        console.log('LocalStorageManager inicializado');
    }

    // Forzar actualización de datos de habitaciones
    updateRoomsData() {
        // Siempre actualizar las habitaciones con los datos correctos
        this.setData('rooms', [
            {
                id: 1,
                name: 'Suite Icónica',
                type: 'suite',
                pricePerNight: 4786092,
                capacity: 2,
                beds: 1,
                description: 'Tarifa totalmente flexible con servicios de lujo incluidos. Desayuno, WiFi gratuito y amenidades premium',
                available: true,
                services: ['wifi', 'tv', 'ac', 'balcony', 'minibar'],
                benefits: [
                    'Bebida de bienvenida al llegar',
                    'Botella de champagne y plato de frutas en la habitación',
                    'Desayuno a la carta',
                    'Wi-Fi gratuito',
                    'Cancelación gratuita',
                    'Impuestos incluidos'
                ],
                flexibleRate: true,
                freeBreakfast: true,
                freeCancellation: true,
                images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-35-600x400.jpg']
            },
            {
                id: 2,
                name: 'Suite Mítica',
                type: 'suite',
                pricePerNight: 5612572,
                capacity: 2,
                beds: 1,
                description: 'Tarifa totalmente flexible con servicios de lujo incluidos. Desayuno, WiFi gratuito y amenidades premium',
                available: true,
                services: ['wifi', 'tv', 'ac', 'balcony', 'minibar'],
                benefits: [
                    'Bebida de bienvenida al llegar',
                    'Botella de champagne y plato de frutas en la habitación',
                    'Desayuno a la carta',
                    'Wi-Fi gratuito',
                    'Cancelación gratuita',
                    'Impuestos incluidos'
                ],
                flexibleRate: true,
                freeBreakfast: true,
                freeCancellation: true,
                images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-40-600x500.jpg']
            },
            {
                id: 3,
                name: 'Suite Épica',
                type: 'suite',
                pricePerNight: 6276414,
                capacity: 2,
                beds: 1,
                description: 'Tarifa totalmente flexible con servicios de lujo incluidos. Desayuno, WiFi gratuito y amenidades premium',
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
                benefits: [
                    'Bebida de bienvenida al llegar',
                    'Botella de champagne y plato de frutas en la habitación',
                    'Desayuno a la carta',
                    'Wi-Fi gratuito',
                    'Cancelación gratuita',
                    'Impuestos incluidos'
                ],
                flexibleRate: true,
                freeBreakfast: true,
                freeCancellation: true,
                images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/02/Homepage-2-600x500.jpg']
            },
            {
                id: 4,
                name: 'Suite Majestic',
                type: 'suite',
                pricePerNight: 6931717,
                capacity: 2,
                beds: 1,
                description: 'Tarifa totalmente flexible con servicios de lujo incluidos. Desayuno flotante, transporte VIP y amenidades premium',
                available: true,
                services: ['wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi'],
                benefits: [
                    'Servicio de auto de lujo ida y vuelta',
                    'Desayuno flotante una vez por estadía',
                    'Bebida de bienvenida al llegar',
                    'Botella de champagne y plato de frutas en la habitación',
                    'Desayuno a la carta',
                    'Wi-Fi gratuito',
                    'Cancelación gratuita',
                    'Transporte incluido'
                ],
                flexibleRate: true,
                freeBreakfast: true,
                transferIncluded: true,
                freeCancellation: true,
                images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-24-600x500.jpg']
            },
            {
                id: 5,
                name: 'Suite Elementos',
                type: 'suite',
                pricePerNight: 7256618,
                capacity: 4,
                beds: 2,
                description: 'Tarifa totalmente flexible con servicios de lujo incluidos. Desayuno flotante, transfer VIP y amenidades premium',
                available: true,
                services: ['wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi', 'roomservice'],
                benefits: [
                    'Servicio de auto de lujo ida y vuelta',
                    'Desayuno flotante una vez por estadía',
                    'Bebida de bienvenida al llegar',
                    'Botella de champagne y plato de frutas en la habitación',
                    'Desayuno a la carta',
                    'Wi-Fi gratuito',
                    'Cancelación gratuita',
                    'Transporte incluido'
                ],
                flexibleRate: true,
                freeBreakfast: true,
                transferIncluded: true,
                freeCancellation: true,
                images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-26-600x500.jpg']
            },
            {
                id: 6,
                name: 'The Saint Suite',
                type: 'suite',
                pricePerNight: 8579778,
                capacity: 4,
                beds: 2,
                description: 'Tarifa totalmente flexible con servicios de lujo incluidos. Desayuno flotante, transfer VIP y amenidades premium',
                available: true,
                services: ['wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi', 'roomservice', 'safe'],
                benefits: [
                    'Servicio de auto de lujo ida y vuelta',
                    'Desayuno flotante una vez por estadía',
                    'Bebida de bienvenida al llegar',
                    'Botella de champagne y plato de frutas en la habitación',
                    'Desayuno a la carta',
                    'Wi-Fi gratuito',
                    'Cancelación gratuita',
                    'Transporte incluido'
                ],
                flexibleRate: true,
                freeBreakfast: true,
                transferIncluded: true,
                freeCancellation: true,
                images: ['https://www.saintsuitesoia.com/wp-content/uploads/2019/12/HighRes-6-min-1-scaled-e1575923182587-600x500.jpg']
            },
            {
                id: 7,
                name: 'The One Suite',
                type: 'villa',
                pricePerNight: 13192353,
                capacity: 2,
                beds: 1,
                description: 'Tarifa totalmente flexible con servicios de lujo incluidos. Desayuno flotante, transporte VIP y amenidades premium',
                available: true,
                services: ['wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi', 'roomservice', 'safe'],
                benefits: [
                    'Servicio de auto de lujo ida y vuelta',
                    'Desayuno flotante una vez por estadía',
                    'Bebida de bienvenida al llegar',
                    'Botella de champagne y plato de frutas en la habitación',
                    'Desayuno a la carta',
                    'Wi-Fi gratuito',
                    'Cancelación gratuita',
                    'Transporte incluido'
                ],
                flexibleRate: true,
                freeBreakfast: true,
                transferIncluded: true,
                freeCancellation: true,
                images: ['https://www.saintsuitesoia.com/wp-content/uploads/2022/06/The-One-Private-Villa-Exterior-Pool-scaled-600x500.jpg']
            }
        ]);
    }

    // Inicializar datos por defecto si no existen
    initializeData() {
        // Forzar actualización de habitaciones para reflejar cambios
        this.updateRoomsData();
        
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

        // Datos de habitaciones/suites por defecto (se actualizan automáticamente con updateRoomsData)
        // Ya no se necesita, updateRoomsData() ya los crea

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
        try {
            console.log('addReservation llamado con:', reservationData);
            
            const reservations = this.getData('reservations') || [];
            console.log('Reservas actuales:', reservations.length);
            
            const newReservation = {
                id: this.generateId(reservations),
                ...reservationData,
                status: reservationData.status || 'confirmed',
                createdAt: new Date().toISOString()
            };
            
            console.log('Nueva reserva a guardar:', newReservation);
            
            reservations.push(newReservation);
            const saved = this.setData('reservations', reservations);
            
            console.log('¿Guardado exitoso?:', saved);
            console.log('Total de reservas después de guardar:', reservations.length);
            
            // Verificar que se guardó correctamente
            const verificacion = this.getData('reservations');
            console.log('Verificación - Total reservas en localStorage:', verificacion ? verificacion.length : 0);
            
            if (!saved) {
                throw new Error('No se pudo guardar la reserva en localStorage');
            }
            
            return newReservation;
        } catch (error) {
            console.error('Error en addReservation:', error);
            throw error;
        }
    }

    getAllReservations() {
        return this.getData('reservations') || [];
    }

    getReservationsByUser(userId) {
        console.log('getReservationsByUser llamado para userId:', userId);
        const reservations = this.getData('reservations') || [];
        console.log('Total de reservas en sistema:', reservations.length);
        console.log('Todas las reservas:', reservations);
        const userReservations = reservations.filter(reservation => reservation.userId === userId);
        console.log('Reservas del usuario:', userReservations.length);
        return userReservations;
    }

    deleteReservation(id) {
        console.log('deleteReservation llamado para id:', id);
        const reservations = this.getData('reservations') || [];
        const filteredReservations = reservations.filter(reservation => reservation.id !== id);
        
        if (filteredReservations.length < reservations.length) {
            this.setData('reservations', filteredReservations);
            console.log('Reserva eliminada. Total de reservas ahora:', filteredReservations.length);
            return true;
        }
        
        console.error('Reserva no encontrada con id:', id);
        return false;
    }

    updateReservation(id, updatedData) {
        console.log('updateReservation llamado:', { id, updatedData });
        const reservations = this.getData('reservations') || [];
        const index = reservations.findIndex(reservation => reservation.id === id);
        
        if (index !== -1) {
            reservations[index] = {
                ...reservations[index],
                ...updatedData,
                updatedAt: new Date().toISOString()
            };
            this.setData('reservations', reservations);
            console.log('Reserva actualizada:', reservations[index]);
            return reservations[index];
        }
        
        console.error('Reserva no encontrada con id:', id);
        return null;
    }

    updateReservationStatus(id, status) {
        console.log('updateReservationStatus llamado:', { id, status });
        const reservations = this.getData('reservations') || [];
        const index = reservations.findIndex(reservation => reservation.id === id);
        
        if (index !== -1) {
            reservations[index].status = status;
            reservations[index].updatedAt = new Date().toISOString();
            this.setData('reservations', reservations);
            console.log('Estado de reserva actualizado:', reservations[index]);
            return reservations[index];
        }
        
        console.error('Reserva no encontrada con id:', id);
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
    getRooms() {
        return this.getData('rooms') || [];
    }

    getRoomById(roomId) {
        const rooms = this.getRooms();
        return rooms.find(room => room.id === roomId);
    }

    getAvailableRooms(checkIn, checkOut, guests = 1) {
        console.log('getAvailableRooms llamado con:', { checkIn, checkOut, guests });
        
        const rooms = this.getData('rooms') || [];
        const reservations = this.getData('reservations') || [];
        
        console.log('Total de habitaciones:', rooms.length);
        console.log('Total de reservas:', reservations.length);
        console.log('Habitaciones:', rooms);
        
        const availableRooms = rooms.filter(room => {
            // Verificar que la habitación pueda acomodar al número de huéspedes
            // Cualquier habitación con capacidad >= número de huéspedes es válida
            if (room.capacity < guests) {
                console.log(`Habitación ${room.name} con capacidad ${room.capacity} es menor que ${guests} huéspedes solicitados`);
                return false;
            }
            
            // Filtrar habitaciones excesivamente grandes para evitar mostrar villas cuando buscan 1-2 personas
            // Si buscan 1-2 huéspedes, no mostrar habitaciones para más de 4
            // Si buscan 3-4 huéspedes, no mostrar habitaciones para más de 6
            const maxReasonableCapacity = guests <= 2 ? 4 : guests + 2;
            if (room.capacity > maxReasonableCapacity) {
                console.log(`Habitación ${room.name} con capacidad ${room.capacity} es demasiado grande para ${guests} huéspedes (máximo razonable: ${maxReasonableCapacity})`);
                return false;
            }
            
            // Verificar si la habitación está disponible en las fechas solicitadas
            // Considerar tanto reservas confirmadas como pendientes
            const conflictingReservations = reservations.filter(reservation => 
                reservation.roomId === room.id && 
                (reservation.status === 'confirmed' || reservation.status === 'pending') &&
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
    clearReservations() {
        console.log('Limpiando todas las reservas...');
        this.setData('reservations', []);
        console.log('Reservas limpiadas exitosamente');
        return true;
    }

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

    // Verificar precios de habitaciones para debugging
    verifyRoomPrices() {
        const rooms = this.getRooms();
        console.log('=== VERIFICACIÓN DE PRECIOS DE HABITACIONES ===');
        rooms.forEach(room => {
            console.log(`${room.name}:`);
            console.log(`  Precio por noche: $${room.pricePerNight.toLocaleString('es-CO')}`);
            console.log(`  10 noches: $${(room.pricePerNight * 10).toLocaleString('es-CO')}`);
            console.log(`  Capacidad: ${room.capacity} personas`);
            console.log('---');
        });
    }

    // Forzar reset completo de habitaciones
    forceResetRooms() {
        console.log('Forzando reset de habitaciones...');
        this.updateRoomsData();
        console.log('Habitaciones reseteadas. Recarga la página.');
    }
}

// Crear instancia global
const storageManager = new LocalStorageManager();

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalStorageManager;
}
