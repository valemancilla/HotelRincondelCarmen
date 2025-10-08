// Sistema de almacenamiento local

var roomsData = [
    {
        id: 1,
        name: 'Suite Icónica',
        type: 'suite',
        number: '101',
        pricePerNight: 4786092,
        maxGuests: 2,
        capacity: 2,
        beds: 1,
        description: 'Tarifa totalmente flexible. Bebida de bienvenida a la llegada y champagne con frutas en la habitación. Incluye desayuno a la carta, WiFi gratuito, IVA e impuestos locales',
        available: true,
        services: ['wifi', 'tv', 'ac', 'balcony', 'minibar'],
        benefits: [
            'Bebida de bienvenida a la llegada',
            'Botella de champagne y plato de frutas en la habitación',
            'Desayuno a la carta incluido',
            'WiFi gratuito',
            'Cancelación gratuita'
        ],
        flexibleRate: true,
        freeBreakfast: true,
        freeCancellation: true,
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-35-600x400.jpg',
        images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-35-600x400.jpg']
    },
    {
        id: 2,
        name: 'Suite Mítica',
        type: 'suite',
        number: '102',
        pricePerNight: 5612572,
        maxGuests: 2,
        capacity: 2,
        beds: 1,
        description: 'Tarifa totalmente flexible. Bebida de bienvenida a la llegada y champagne con frutas en la habitación. Incluye desayuno a la carta, WiFi gratuito, IVA e impuestos locales',
        available: true,
        services: ['wifi', 'tv', 'ac', 'balcony', 'minibar'],
        benefits: [
            'Bebida de bienvenida a la llegada',
            'Botella de champagne y plato de frutas en la habitación',
            'Desayuno a la carta incluido',
            'WiFi gratuito',
            'Cancelación gratuita'
        ],
        flexibleRate: true,
        freeBreakfast: true,
        freeCancellation: true,
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-40-600x500.jpg',
        images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-40-600x500.jpg']
    },
    {
        id: 3,
        name: 'Suite Épica',
        type: 'suite',
        number: '103',
        pricePerNight: 6276414,
        maxGuests: 2,
        capacity: 2,
        beds: 1,
        description: 'Tarifa totalmente flexible. Bebida de bienvenida a la llegada y champagne con frutas en la habitación. Incluye desayuno a la carta, WiFi gratuito, IVA e impuestos locales',
        available: true,
        services: ['wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi'],
        benefits: [
            'Bebida de bienvenida a la llegada',
            'Botella de champagne y plato de frutas en la habitación',
            'Desayuno a la carta incluido',
            'WiFi gratuito',
            'Cancelación gratuita'
        ],
        flexibleRate: true,
        freeBreakfast: true,
        freeCancellation: true,
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2020/02/Homepage-2-600x500.jpg',
        images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/02/Homepage-2-600x500.jpg']
    },
    {
        id: 4,
        name: 'Suite Majestic',
        type: 'suite',
        number: '104',
        pricePerNight: 7002894,
        maxGuests: 2,
        capacity: 2,
        beds: 1,
        description: 'Tarifa totalmente flexible con servicios de lujo incluidos. Servicio de transporte de lujo ida y vuelta, desayuno flotante una vez por estadía, bebida de bienvenida y champagne con frutas a la llegada. Incluye desayuno a la carta, WiFi gratuito, IVA e impuestos locales',
        available: true,
        services: ['wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi', 'roomservice'],
        benefits: [
            'Servicio de transporte de lujo ida y vuelta',
            'Desayuno flotante una vez por estadía',
            'Bebida de bienvenida a la llegada',
            'Botella de champagne y plato de frutas en la habitación',
            'Desayuno a la carta incluido',
            'WiFi gratuito',
            'Cancelación gratuita'
        ],
        flexibleRate: true,
        freeBreakfast: true,
        freeCancellation: true,
        transferIncluded: true,
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-24-600x500.jpg',
        images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-24-600x500.jpg']
    },
    {
        id: 5,
        name: 'Suite Element',
        type: 'suite',
        number: '105',
        pricePerNight: 8103339,
        maxGuests: 4,
        capacity: 4,
        beds: 2,
        description: 'Tarifa totalmente flexible con servicios de lujo incluidos. Servicio de transporte de lujo incluido, desayuno flotante una vez por estadía, bebida de bienvenida y champagne con frutas a la llegada. Incluye desayuno a la carta, WiFi gratuito, IVA e impuestos locales',
        available: true,
        services: ['wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi', 'roomservice'],
        benefits: [
            'Servicio de transporte de lujo ida y vuelta',
            'Desayuno flotante una vez por estadía',
            'Bebida de bienvenida a la llegada',
            'Botella de champagne y plato de frutas en la habitación',
            'Desayuno a la carta incluido',
            'WiFi gratuito',
            'Cancelación gratuita'
        ],
        flexibleRate: true,
        freeBreakfast: true,
        freeCancellation: true,
        transferIncluded: true,
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-26-600x500.jpg',
        images: ['https://www.saintsuitesoia.com/wp-content/uploads/2020/02/HighRes-26-600x500.jpg']
    },
    {
        id: 6,
        name: 'La Suite Santa',
        type: 'suite',
        number: '106',
        pricePerNight: 8861911,
        maxGuests: 4,
        capacity: 4,
        beds: 2,
        description: 'Tarifa totalmente flexible con servicios de lujo incluidos. Servicio de transporte de lujo incluido, desayuno flotante una vez por estadía, bebida de bienvenida y champagne con frutas a la llegada. Incluye desayuno a la carta, WiFi gratuito, IVA e impuestos locales',
        available: true,
        services: ['wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi', 'roomservice'],
        benefits: [
            'Servicio de transporte de lujo ida y vuelta',
            'Desayuno flotante una vez por estadía',
            'Bebida de bienvenida a la llegada',
            'Botella de champagne y plato de frutas en la habitación',
            'Desayuno a la carta incluido',
            'WiFi gratuito',
            'Cancelación gratuita'
        ],
        flexibleRate: true,
        freeBreakfast: true,
        freeCancellation: true,
        transferIncluded: true,
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2019/12/HighRes-6-min-1-scaled-e1575923182587-600x500.jpg',
        images: ['https://www.saintsuitesoia.com/wp-content/uploads/2019/12/HighRes-6-min-1-scaled-e1575923182587-600x500.jpg']
    },
    {
        id: 7,
        name: 'Villa One Saint',
        type: 'villa',
        number: '201',
        pricePerNight: 12967440,
        maxGuests: 2,
        capacity: 2,
        beds: 1,
        description: 'Tarifa totalmente flexible con servicios de lujo incluidos. Servicio de transporte de lujo ida y vuelta, desayuno flotante una vez por estadía, bebida de bienvenida y champagne con frutas a la llegada. Villa exclusiva con piscina privada y vistas panorámicas. Incluye desayuno a la carta, WiFi gratuito, IVA e impuestos locales',
        available: true,
        services: ['wifi', 'tv', 'ac', 'balcony', 'minibar', 'jacuzzi', 'roomservice', 'safe'],
        benefits: [
            'Servicio de transporte de lujo ida y vuelta',
            'Desayuno flotante una vez por estadía',
            'Bebida de bienvenida a la llegada',
            'Botella de champagne y plato de frutas en la habitación',
            'Piscina privada exclusiva',
            'Vistas panorámicas a la Caldera',
            'Desayuno a la carta incluido',
            'WiFi gratuito',
            'Cancelación gratuita'
        ],
        flexibleRate: true,
        freeBreakfast: true,
        freeCancellation: true,
        transferIncluded: true,
        image: 'https://www.saintsuitesoia.com/wp-content/uploads/2022/06/The-One-Private-Villa-Exterior-Pool-scaled-600x500.jpg',
        images: ['https://www.saintsuitesoia.com/wp-content/uploads/2022/06/The-One-Private-Villa-Exterior-Pool-scaled-600x500.jpg']
    }
];

function setData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
        return false;
    }
}

function getData(key) {
    try {
        var data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error leyendo de localStorage:', error);
        return null;
    }
}

function generateId(array) {
    if (array.length === 0) return 1;
    var max = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i].id && array[i].id > max) {
            max = array[i].id;
        }
    }
    return max + 1;
}

function initializeData() {
    // Solo inicializar habitaciones si no existen, o si es la primera vez
    var existingRooms = getData('rooms');
    if (!existingRooms || existingRooms.length === 0) {
        // Solo establecer las habitaciones predefinidas si no hay habitaciones
        setData('rooms', roomsData);
    } else {
        // Si ya existen habitaciones, verificar que las predefinidas tengan todas las propiedades
        var needsUpdate = false;
        var updatedRooms = [];
        
        // Agregar habitaciones existentes que no están en roomsData
        for (var i = 0; i < existingRooms.length; i++) {
            var existingRoom = existingRooms[i];
            var isPredefined = false;
            
            // Verificar si es una habitación predefinida
            for (var j = 0; j < roomsData.length; j++) {
                if (roomsData[j].id === existingRoom.id && roomsData[j].name === existingRoom.name) {
                    isPredefined = true;
                    // Actualizar con datos más recientes pero preservar cambios del admin
                    var updatedRoom = Object.assign({}, roomsData[j], {
                        // Preservar campos que el admin puede haber modificado
                        available: existingRoom.available,
                        services: existingRoom.services || roomsData[j].services,
                        description: existingRoom.description || roomsData[j].description
                    });
                    updatedRooms.push(updatedRoom);
                    break;
                }
            }
            
            // Si no es predefinida, es una habitación agregada por el admin
            if (!isPredefined) {
                updatedRooms.push(existingRoom);
            }
        }
        
        // Agregar habitaciones predefinidas que no existen
        for (var k = 0; k < roomsData.length; k++) {
            var predefinedRoom = roomsData[k];
            var exists = false;
            
            for (var l = 0; l < updatedRooms.length; l++) {
                if (updatedRooms[l].id === predefinedRoom.id) {
                    exists = true;
                    break;
                }
            }
            
            if (!exists) {
                updatedRooms.push(predefinedRoom);
            }
        }
        
        setData('rooms', updatedRooms);
    }
    
    if (!getData('users')) {
        setData('users', [
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
            },
            {
                id: 2,
                identification: '1234567890',
                name: 'Juan Manuel',
                nationality: 'Colombiana',
                email: 'juanman42@gmail.com',
                phone: '+57 300 987 6543',
                password: 'vale2007',
                role: 'user',
                createdAt: new Date().toISOString()
            }
        ]);
    }

    if (!getData('reservations')) {
        setData('reservations', []);
    }

    if (!getData('contactMessages')) {
        setData('contactMessages', []);
    }

    if (!getData('services')) {
        setData('services', [
            { id: 1, name: 'Trinity Restaurant', type: 'restaurant', description: 'Restaurante gourmet con cocina mediterránea', price: 0, available: true },
            { id: 2, name: 'Sky Bar', type: 'bar', description: 'Bar en la azotea con vista panorámica', price: 0, available: true },
            { id: 3, name: 'The Sacred Spa', type: 'spa', description: 'Spa de lujo con tratamientos relajantes', price: 150, available: true },
            { id: 4, name: 'Saint Gym', type: 'gym', description: 'Gimnasio equipado con tecnología de vanguardia', price: 0, available: true }
        ]);
    }
}

function addUser(userData) {
    var users = getData('users') || [];
    var newUser = {
        id: generateId(users),
        identification: userData.identification,
        name: userData.name,
        nationality: userData.nationality,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role || 'user',
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    setData('users', users);
    return newUser;
}

function getUsers() {
    return getData('users') || [];
}

function getUserByEmail(email) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            return users[i];
        }
    }
    return null;
}

function updateUser(id, userData) {
    var users = getData('users') || [];
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            users[i] = {
                id: users[i].id,
                identification: userData.identification !== undefined ? userData.identification : users[i].identification,
                name: userData.name !== undefined ? userData.name : users[i].name,
                nationality: userData.nationality !== undefined ? userData.nationality : users[i].nationality,
                email: userData.email !== undefined ? userData.email : users[i].email,
                phone: userData.phone !== undefined ? userData.phone : users[i].phone,
                password: userData.password !== undefined ? userData.password : users[i].password,
                role: userData.role !== undefined ? userData.role : users[i].role,
                createdAt: users[i].createdAt
            };
            setData('users', users);
            return users[i];
        }
    }
    return null;
}

function addReservation(reservationData) {
    var reservations = getData('reservations') || [];
    var newReservation = {
        id: generateId(reservations),
        roomId: reservationData.roomId,
        userId: reservationData.userId,
        checkIn: reservationData.checkIn,
        checkOut: reservationData.checkOut,
        guests: reservationData.guests,
        notes: reservationData.notes || '',
        totalPrice: reservationData.totalPrice,
        status: reservationData.status || 'pending',
        createdAt: new Date().toISOString()
    };
    reservations.push(newReservation);
    setData('reservations', reservations);
    return newReservation;
}

function getAllReservations() {
    return getData('reservations') || [];
}

function getReservationsByUser(userId) {
    var reservations = getData('reservations') || [];
    var result = [];
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].userId === userId) {
            result.push(reservations[i]);
        }
    }
    return result;
}

function deleteReservation(id) {
    var reservations = getData('reservations') || [];
    var filtered = [];
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].id !== id) {
            filtered.push(reservations[i]);
        }
    }
    setData('reservations', filtered);
    return true;
}

function updateReservation(id, updatedData) {
    var reservations = getData('reservations') || [];
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].id === id) {
            for (var key in updatedData) {
                reservations[i][key] = updatedData[key];
            }
            reservations[i].updatedAt = new Date().toISOString();
            setData('reservations', reservations);
            return reservations[i];
        }
    }
    return null;
}

function updateReservationStatus(id, status) {
    var reservations = getData('reservations') || [];
    var previousStatus = null;
    var reservation = null;
    
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].id === id) {
            previousStatus = reservations[i].status;
            reservations[i].status = status;
            reservations[i].updatedAt = new Date().toISOString();
            reservation = reservations[i];
            break;
        }
    }
    
    if (reservation) {
        setData('reservations', reservations);
        
        // Si la reserva fue cancelada, la habitación automáticamente vuelve a estar disponible
        if (status === 'cancelled' && (previousStatus === 'confirmed' || previousStatus === 'pending')) {
            // La habitación ya está disponible automáticamente porque getAvailableRooms excluye reservas canceladas
            console.log('Reserva cancelada: Habitación ' + reservation.roomId + ' vuelve a estar disponible');
        }
        
        return reservation;
    }
    return null;
}

function addContactMessage(messageData) {
    var messages = getData('contactMessages') || [];
    var newMessage = {
        id: generateId(messages),
        name: messageData.name,
        email: messageData.email,
        subject: messageData.subject,
        message: messageData.message,
        read: false,
        createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    setData('contactMessages', messages);
    return newMessage;
}

function markMessageAsRead(id) {
    var messages = getData('contactMessages') || [];
    for (var i = 0; i < messages.length; i++) {
        if (messages[i].id === id) {
            messages[i].read = true;
            messages[i].readAt = new Date().toISOString();
            setData('contactMessages', messages);
            return messages[i];
        }
    }
    return null;
}

function getRooms() {
    return getData('rooms') || roomsData;
}

function getRoomById(roomId) {
    var rooms = getRooms();
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id === roomId) {
            return rooms[i];
        }
    }
    return null;
}

function datesOverlap(start1, end1, start2, end2) {
    return new Date(start1) < new Date(end2) && new Date(end1) > new Date(start2);
}

function getAvailableRooms(checkIn, checkOut, guests) {
    if (!guests) guests = 1;
    
    var rooms = getData('rooms') || roomsData;
    var reservations = getData('reservations') || [];
    
    var activeReservations = [];
    for (var i = 0; i < reservations.length; i++) {
        if (reservations[i].status === 'confirmed' || reservations[i].status === 'pending') {
            activeReservations.push(reservations[i]);
        }
    }
    
    var availableRooms = [];
    for (var i = 0; i < rooms.length; i++) {
        var room = rooms[i];
        
        if (room.capacity < guests) {
            continue;
        }
        
        // Solo mostrar habitaciones que coincidan exactamente con la capacidad o sean ligeramente mayores
        // Para 2 huéspedes mostrar todas las habitaciones disponibles
        // Para 3 y 4 huéspedes mostrar solo las habitaciones con capacidad 4
        var maxReasonableCapacity = guests <= 2 ? 4 : (guests <= 4 ? 4 : guests);
        if (room.capacity > maxReasonableCapacity) {
            continue;
        }
        
        var hasConflict = false;
        for (var j = 0; j < activeReservations.length; j++) {
            if (activeReservations[j].roomId === room.id && 
                datesOverlap(checkIn, checkOut, activeReservations[j].checkIn, activeReservations[j].checkOut)) {
                hasConflict = true;
                break;
            }
        }
        
        if (!hasConflict) {
            availableRooms.push(room);
        }
    }
    
    return availableRooms;
}

function testLocalStorage() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
}

function clearReservations() {
    setData('reservations', []);
    return true;
}

function clearAllData() {
    localStorage.removeItem('users');
    localStorage.removeItem('rooms');
    localStorage.removeItem('reservations');
    localStorage.removeItem('contactMessages');
    localStorage.removeItem('services');
    initializeData();
}

function exportData() {
    return {
        users: getData('users'),
        rooms: getData('rooms'),
        reservations: getData('reservations'),
        contactMessages: getData('contactMessages'),
        services: getData('services')
    };
}

/**
 * Calcula el precio total de una reserva basado en noches y número de personas
 */
function calculateTotalPrice(room, checkIn, checkOut, guests) {
    try {
        // Calcular número de noches
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        
        // Precio base por noche
        let basePrice = room.pricePerNight;
        
        // Aplicar recargos por persona adicional (si aplica)
        let totalPrice = basePrice * nights;
        
        // Política de precios por persona:
        // - Hasta 2 personas: precio base
        // - 3-4 personas: +20% por persona adicional
        // - 5+ personas: +30% por persona adicional
        
        if (guests > 2) {
            const additionalGuests = guests - 2;
            let surchargePerGuest = 0;
            
            if (guests <= 4) {
                // 3-4 personas: +20% por persona adicional
                surchargePerGuest = basePrice * 0.20;
            } else {
                // 5+ personas: +30% por persona adicional
                surchargePerGuest = basePrice * 0.30;
            }
            
            totalPrice += (surchargePerGuest * additionalGuests * nights);
        }
        
        // Redondear al múltiplo de 1000 más cercano
        totalPrice = Math.round(totalPrice / 1000) * 1000;
        
        return {
            basePrice: basePrice,
            nights: nights,
            guests: guests,
            additionalGuests: Math.max(0, guests - 2),
            surchargePerGuest: guests > 2 ? (guests <= 4 ? basePrice * 0.20 : basePrice * 0.30) : 0,
            totalPrice: totalPrice,
            breakdown: generatePriceBreakdown(room, nights, guests, totalPrice)
        };
        
    } catch (error) {
        console.error('Error calculando precio total:', error);
        // Fallback al cálculo simple
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        return {
            basePrice: room.pricePerNight,
            nights: nights,
            guests: guests,
            additionalGuests: 0,
            surchargePerGuest: 0,
            totalPrice: room.pricePerNight * nights,
            breakdown: `Precio base: ${nights} noches × COP $${room.pricePerNight.toLocaleString('es-CO')} = COP $${(room.pricePerNight * nights).toLocaleString('es-CO')}`
        };
    }
}

/**
 * Genera un desglose detallado del precio
 */
function generatePriceBreakdown(room, nights, guests, totalPrice) {
    let breakdown = [];
    
    breakdown.push(`Precio base (${nights} noches × COP $${room.pricePerNight.toLocaleString('es-CO')}) = COP $${(room.pricePerNight * nights).toLocaleString('es-CO')}`);
    
    if (guests > 2) {
        const additionalGuests = guests - 2;
        const surchargeRate = guests <= 4 ? '20%' : '30%';
        const surchargePerGuest = guests <= 4 ? room.pricePerNight * 0.20 : room.pricePerNight * 0.30;
        const totalSurcharge = surchargePerGuest * additionalGuests * nights;
        
        breakdown.push(`Recargo por ${additionalGuests} ${additionalGuests === 1 ? 'persona adicional' : 'personas adicionales'} (${surchargeRate}) = COP $${totalSurcharge.toLocaleString('es-CO')}`);
    }
    
    breakdown.push(`Total: COP $${totalPrice.toLocaleString('es-CO')}`);
    
    return breakdown.join('\n');
}

var storageManager = {
    setData: setData,
    getData: getData,
    addUser: addUser,
    getUsers: getUsers,
    getUserByEmail: getUserByEmail,
    updateUser: updateUser,
    addReservation: addReservation,
    getAllReservations: getAllReservations,
    getReservationsByUser: getReservationsByUser,
    deleteReservation: deleteReservation,
    updateReservation: updateReservation,
    updateReservationStatus: updateReservationStatus,
    addContactMessage: addContactMessage,
    markMessageAsRead: markMessageAsRead,
    getRooms: getRooms,
    getRoomById: getRoomById,
    getAvailableRooms: getAvailableRooms,
    datesOverlap: datesOverlap,
    testLocalStorage: testLocalStorage,
    clearReservations: clearReservations,
    clearAllData: clearAllData,
    exportData: exportData,
    generateId: generateId,
    updateRoomsData: function() { setData('rooms', roomsData); },
    calculateTotalPrice: calculateTotalPrice,
    generatePriceBreakdown: generatePriceBreakdown
};

window.storageManager = storageManager;

// Inicializar datos después de definir storageManager
if (typeof window !== 'undefined') {
    initializeData();
}
