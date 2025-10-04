/**
 * Sistema de almacenamiento local para el Hotel el Rincón del Carmen
 * Maneja el almacenamiento de usuarios, habitaciones y reservas en localStorage
 */

class HotelStorage {
    constructor() {
        this.initializeStorage();
    }

    /**
     * Inicializa el almacenamiento con datos de ejemplo si no existen
     */
    initializeStorage() {
        // Verificar si ya existen datos
        if (!localStorage.getItem('hotel_users')) {
            this.createDefaultUsers();
        }
        
        if (!localStorage.getItem('hotel_rooms')) {
            this.createDefaultRooms();
        }
        
        if (!localStorage.getItem('hotel_reservations')) {
            localStorage.setItem('hotel_reservations', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('hotel_contacts')) {
            localStorage.setItem('hotel_contacts', JSON.stringify([]));
        }
    }

    /**
     * Crea usuarios por defecto incluyendo un administrador
     */
    createDefaultUsers() {
        const defaultUsers = [
            {
                id: 'admin_001',
                identification: '12345678',
                name: 'Administrador del Hotel',
                nationality: 'Colombiana',
                email: 'admin@rincondelcarmen.com',
                phone: '+57 300 123 4567',
                password: 'admin123', // En producción esto debería estar hasheado
                role: 'admin',
                createdAt: new Date().toISOString()
            },
            {
                id: 'user_001',
                identification: '87654321',
                name: 'Juan Pérez',
                nationality: 'Colombiana',
                email: 'juan.perez@email.com',
                phone: '+57 300 987 6543',
                password: 'user123',
                role: 'user',
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('hotel_users', JSON.stringify(defaultUsers));
    }

    /**
     * Crea habitaciones por defecto
     */
    createDefaultRooms() {
        const defaultRooms = [
            {
                id: 'room_001',
                number: '101',
                type: 'standard',
                maxGuests: 2,
                beds: 1,
                pricePerNight: 150000,
                image: 'image/habitacion-101.jpg',
                services: ['wifi', 'tv', 'ac', 'safe'],
                description: 'Habitación estándar con vista al jardín, perfecta para parejas.',
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'room_002',
                number: '102',
                type: 'deluxe',
                maxGuests: 3,
                beds: 2,
                pricePerNight: 250000,
                image: 'image/habitacion-102.jpg',
                services: ['wifi', 'tv', 'ac', 'minibar', 'balcony', 'safe'],
                description: 'Habitación deluxe con balcón privado y minibar.',
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'room_003',
                number: '201',
                type: 'suite',
                maxGuests: 4,
                beds: 2,
                pricePerNight: 400000,
                image: 'image/habitacion-201.jpg',
                services: ['wifi', 'tv', 'ac', 'minibar', 'jacuzzi', 'balcony', 'roomservice', 'safe'],
                description: 'Suite de lujo con jacuzzi privado y servicio a la habitación.',
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'room_004',
                number: '301',
                type: 'presidential',
                maxGuests: 6,
                beds: 3,
                pricePerNight: 600000,
                image: 'image/habitacion-301.jpg',
                services: ['wifi', 'tv', 'ac', 'minibar', 'jacuzzi', 'balcony', 'roomservice', 'safe'],
                description: 'Suite presidencial con vista panorámica y todos los servicios premium.',
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'room_005',
                number: '103',
                type: 'standard',
                maxGuests: 2,
                beds: 1,
                pricePerNight: 150000,
                image: 'image/habitacion-103.jpg',
                services: ['wifi', 'tv', 'ac', 'safe'],
                description: 'Habitación estándar con vista al jardín, perfecta para parejas.',
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'room_006',
                number: '202',
                type: 'deluxe',
                maxGuests: 3,
                beds: 2,
                pricePerNight: 250000,
                image: 'image/habitacion-202.jpg',
                services: ['wifi', 'tv', 'ac', 'minibar', 'balcony', 'safe'],
                description: 'Habitación deluxe con balcón privado y minibar.',
                isActive: true,
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('hotel_rooms', JSON.stringify(defaultRooms));
    }

    /**
     * Obtiene todos los usuarios
     */
    getUsers() {
        return JSON.parse(localStorage.getItem('hotel_users') || '[]');
    }

    /**
     * Obtiene un usuario por email
     */
    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }

    /**
     * Obtiene un usuario por ID
     */
    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    /**
     * Agrega un nuevo usuario
     */
    addUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: 'user_' + Date.now(),
            ...userData,
            role: 'user',
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('hotel_users', JSON.stringify(users));
        return newUser;
    }

    /**
     * Obtiene todas las habitaciones
     */
    getRooms() {
        return JSON.parse(localStorage.getItem('hotel_rooms') || '[]');
    }

    /**
     * Obtiene una habitación por ID
     */
    getRoomById(id) {
        const rooms = this.getRooms();
        return rooms.find(room => room.id === id);
    }

    /**
     * Agrega una nueva habitación
     */
    addRoom(roomData) {
        const rooms = this.getRooms();
        const newRoom = {
            id: 'room_' + Date.now(),
            ...roomData,
            isActive: true,
            createdAt: new Date().toISOString()
        };
        
        rooms.push(newRoom);
        localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
        return newRoom;
    }

    /**
     * Actualiza una habitación
     */
    updateRoom(id, roomData) {
        const rooms = this.getRooms();
        const roomIndex = rooms.findIndex(room => room.id === id);
        
        if (roomIndex !== -1) {
            rooms[roomIndex] = { ...rooms[roomIndex], ...roomData };
            localStorage.setItem('hotel_rooms', JSON.stringify(rooms));
            return rooms[roomIndex];
        }
        
        return null;
    }

    /**
     * Elimina una habitación
     */
    deleteRoom(id) {
        const rooms = this.getRooms();
        const filteredRooms = rooms.filter(room => room.id !== id);
        localStorage.setItem('hotel_rooms', JSON.stringify(filteredRooms));
        return true;
    }

    /**
     * Obtiene todas las reservas
     */
    getReservations() {
        return JSON.parse(localStorage.getItem('hotel_reservations') || '[]');
    }

    /**
     * Obtiene reservas por usuario
     */
    getReservationsByUser(userId) {
        const reservations = this.getReservations();
        return reservations.filter(reservation => reservation.userId === userId);
    }

    /**
     * Agrega una nueva reserva
     */
    addReservation(reservationData) {
        const reservations = this.getReservations();
        const newReservation = {
            id: 'reservation_' + Date.now(),
            ...reservationData,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        reservations.push(newReservation);
        localStorage.setItem('hotel_reservations', JSON.stringify(reservations));
        return newReservation;
    }

    /**
     * Actualiza una reserva
     */
    updateReservation(id, reservationData) {
        const reservations = this.getReservations();
        const reservationIndex = reservations.findIndex(reservation => reservation.id === id);
        
        if (reservationIndex !== -1) {
            reservations[reservationIndex] = { ...reservations[reservationIndex], ...reservationData };
            localStorage.setItem('hotel_reservations', JSON.stringify(reservations));
            return reservations[reservationIndex];
        }
        
        return null;
    }

    /**
     * Cancela una reserva
     */
    cancelReservation(id) {
        return this.updateReservation(id, { 
            status: 'cancelled',
            cancelledAt: new Date().toISOString()
        });
    }

    /**
     * Verifica disponibilidad de una habitación en un rango de fechas
     */
    checkRoomAvailability(roomId, checkIn, checkOut) {
        const reservations = this.getReservations();
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        return !reservations.some(reservation => {
            if (reservation.roomId !== roomId || reservation.status !== 'active') {
                return false;
            }
            
            const resCheckIn = new Date(reservation.checkIn);
            const resCheckOut = new Date(reservation.checkOut);
            
            // Verificar solapamiento de fechas
            return (checkInDate < resCheckOut && checkOutDate > resCheckIn);
        });
    }

    /**
     * Obtiene habitaciones disponibles para un rango de fechas y número de huéspedes
     */
    getAvailableRooms(checkIn, checkOut, guests) {
        const rooms = this.getRooms().filter(room => room.isActive && room.maxGuests >= guests);
        
        return rooms.filter(room => this.checkRoomAvailability(room.id, checkIn, checkOut));
    }

    /**
     * Agrega un mensaje de contacto
     */
    addContactMessage(contactData) {
        const contacts = JSON.parse(localStorage.getItem('hotel_contacts') || '[]');
        const newContact = {
            id: 'contact_' + Date.now(),
            ...contactData,
            createdAt: new Date().toISOString(),
            status: 'unread'
        };
        
        contacts.push(newContact);
        localStorage.setItem('hotel_contacts', JSON.stringify(contacts));
        return newContact;
    }

    /**
     * Obtiene todos los mensajes de contacto
     */
    getContactMessages() {
        return JSON.parse(localStorage.getItem('hotel_contacts') || '[]');
    }

    /**
     * Marca un mensaje de contacto como leído
     */
    markContactAsRead(id) {
        const contacts = this.getContactMessages();
        const contactIndex = contacts.findIndex(contact => contact.id === id);
        
        if (contactIndex !== -1) {
            contacts[contactIndex].status = 'read';
            contacts[contactIndex].readAt = new Date().toISOString();
            localStorage.setItem('hotel_contacts', JSON.stringify(contacts));
            return contacts[contactIndex];
        }
        
        return null;
    }

    /**
     * Obtiene estadísticas del hotel
     */
    getHotelStats() {
        const users = this.getUsers();
        const rooms = this.getRooms();
        const reservations = this.getReservations();
        const contacts = this.getContactMessages();
        
        const activeReservations = reservations.filter(r => r.status === 'active');
        const cancelledReservations = reservations.filter(r => r.status === 'cancelled');
        const unreadContacts = contacts.filter(c => c.status === 'unread');
        
        return {
            totalUsers: users.length,
            totalRooms: rooms.length,
            activeRooms: rooms.filter(r => r.isActive).length,
            totalReservations: reservations.length,
            activeReservations: activeReservations.length,
            cancelledReservations: cancelledReservations.length,
            totalContacts: contacts.length,
            unreadContacts: unreadContacts.length
        };
    }

    /**
     * Limpia todos los datos (solo para desarrollo)
     */
    clearAllData() {
        localStorage.removeItem('hotel_users');
        localStorage.removeItem('hotel_rooms');
        localStorage.removeItem('hotel_reservations');
        localStorage.removeItem('hotel_contacts');
        this.initializeStorage();
    }
}

// Crear instancia global del sistema de almacenamiento
window.hotelStorage = new HotelStorage();
