// Script temporal para limpiar datos de reseñas del localStorage
// Este archivo se puede eliminar después de ejecutarlo

console.log('Limpiando datos de reseñas del localStorage...');

// Eliminar datos de reseñas
localStorage.removeItem('reviews');

// Verificar que se eliminaron
const reviews = localStorage.getItem('reviews');
console.log('Datos de reseñas después de limpiar:', reviews);

console.log('Limpieza completada. Puedes eliminar este archivo.');
