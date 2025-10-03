# Hotel el Rincón del Carmen - Sitio Web

Un sitio web completo y funcional para la gestión de reservas del Hotel el Rincón del Carmen, desarrollado con tecnologías web modernas.

## 🏨 Características

### Para Clientes
- **Página de Inicio**: Landing page atractiva con carrusel de habitaciones y servicios
- **Búsqueda de Disponibilidad**: Sistema de búsqueda por fechas y número de huéspedes
- **Reservas Online**: Proceso completo de reserva con validación de disponibilidad
- **Gestión de Reservas**: Los usuarios pueden ver y cancelar sus reservas
- **Sistema de Registro**: Registro de usuarios con validación completa
- **Página de Contacto**: Formulario de contacto y información del hotel

### Para Administradores
- **Panel de Administración**: Gestión completa del hotel
- **Gestión de Habitaciones**: Agregar, editar y eliminar habitaciones
- **Gestión de Reservas**: Ver, modificar y cancelar reservas
- **Gestión de Usuarios**: Ver usuarios registrados
- **Estadísticas**: Dashboard con métricas del hotel

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño responsivo con Flexbox y Grid
- **JavaScript ES6+**: Lógica de aplicación moderna
- **Web Components**: Arquitectura modular y escalable
- **LocalStorage**: Almacenamiento local de datos
- **Font Awesome**: Iconografía profesional
- **Google Fonts**: Tipografías elegantes

## 📱 Diseño Responsivo

El sitio está completamente optimizado para dispositivos móviles:
- Navegación hamburguesa en móviles
- Grids adaptativos
- Imágenes responsivas
- Formularios optimizados para touch

## 🛠️ Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)

### Instalación
1. Descarga o clona el proyecto
2. Abre `index.html` en tu navegador
3. ¡Listo! El sitio está funcionando

### Para Desarrollo
```bash
# Si tienes Python instalado
python -m http.server 8000

# Si tienes Node.js instalado
npx serve .

# Luego visita http://localhost:8000
```

## 👥 Usuarios por Defecto

### Administrador
- **Email**: admin@rincondelcarmen.com
- **Contraseña**: admin123
- **Acceso**: Panel de administración completo

### Usuario de Prueba
- **Email**: juan.perez@email.com
- **Contraseña**: user123
- **Acceso**: Funcionalidades de cliente

## 🏠 Habitaciones Incluidas

El sistema incluye 6 habitaciones de ejemplo:
- **Habitación 101**: Estándar (2 huéspedes, $150,000/noche)
- **Habitación 102**: Deluxe (3 huéspedes, $250,000/noche)
- **Habitación 201**: Suite (4 huéspedes, $400,000/noche)
- **Habitación 301**: Presidencial (6 huéspedes, $600,000/noche)
- **Habitación 103**: Estándar (2 huéspedes, $150,000/noche)
- **Habitación 202**: Deluxe (3 huéspedes, $250,000/noche)

## 🔧 Funcionalidades Técnicas

### Sistema de Almacenamiento
- **LocalStorage**: Persistencia de datos en el navegador
- **Datos Iniciales**: Se crean automáticamente al primera carga
- **Validación**: Verificación de disponibilidad en tiempo real

### Seguridad
- **Validación de Formularios**: Cliente y servidor
- **Autenticación**: Sistema de login seguro
- **Autorización**: Control de acceso por roles

### Optimización
- **Lazy Loading**: Carga diferida de imágenes
- **Debounce/Throttle**: Optimización de eventos
- **CSS Grid/Flexbox**: Layouts eficientes

## 📋 Estructura del Proyecto

```
Hotel el Rincón del Carmen/
├── index.html              # Página principal
├── reservas.html           # Página de reservas
├── contacto.html           # Página de contacto
├── admin.html              # Panel de administración
├── styles/
│   ├── main.css            # Estilos principales
│   └── components.css      # Componentes y modales
├── js/
│   ├── storage.js          # Sistema de almacenamiento
│   ├── auth.js             # Autenticación
│   ├── rooms.js            # Gestión de habitaciones
│   ├── reservations.js     # Gestión de reservas
│   ├── admin.js            # Panel de administración
│   └── main.js             # Funcionalidad general
└── README.md               # Este archivo
```

## 🎨 Características de Diseño

### Paleta de Colores
- **Primario**: Gradiente azul-púrpura (#667eea → #764ba2)
- **Secundario**: Grises neutros (#2c3e50, #34495e)
- **Acentos**: Dorado (#ffd700), Verde (#27ae60), Rojo (#e74c3c)

### Tipografías
- **Títulos**: Playfair Display (serif elegante)
- **Texto**: Open Sans (sans-serif legible)

### Componentes
- **Modales**: Animaciones suaves y accesibles
- **Formularios**: Validación en tiempo real
- **Notificaciones**: Sistema de alertas no intrusivo
- **Cards**: Efectos hover y sombras

## 🔄 Flujo de Reservas

1. **Búsqueda**: Usuario selecciona fechas y huéspedes
2. **Disponibilidad**: Sistema muestra habitaciones disponibles
3. **Selección**: Usuario elige habitación y ve detalles
4. **Autenticación**: Login o registro si es necesario
5. **Confirmación**: Usuario confirma reserva con detalles
6. **Validación**: Sistema verifica disponibilidad final
7. **Reserva**: Se crea la reserva y se actualiza disponibilidad

## 🛡️ Validaciones Implementadas

### Fechas
- Fecha de entrada no puede ser anterior a hoy
- Fecha de salida debe ser posterior a entrada
- Verificación de solapamiento de reservas

### Usuarios
- Email único en el sistema
- Identificación única
- Contraseñas seguras (mínimo 6 caracteres)
- Validación de formato de email

### Habitaciones
- Número de habitación único
- Precios positivos
- Capacidad máxima entre 1-6 huéspedes
- URLs de imágenes válidas

## 📊 Estadísticas del Sistema

El panel de administración muestra:
- Total de usuarios registrados
- Número de habitaciones
- Reservas activas y canceladas
- Mensajes de contacto sin leer

## 🔧 Personalización

### Agregar Nuevas Habitaciones
1. Accede al panel de administración
2. Ve a "Gestión de Habitaciones"
3. Haz clic en "Agregar Nueva Habitación"
4. Completa el formulario con los datos

### Modificar Servicios
Edita el archivo `js/storage.js` en la función `getServiceIcons()` para agregar nuevos servicios.

### Cambiar Colores
Modifica las variables CSS en `styles/main.css` para personalizar la paleta de colores.

## 🐛 Solución de Problemas

### Los datos no se guardan
- Verifica que el navegador soporte LocalStorage
- Asegúrate de no estar en modo incógnito

### Las imágenes no cargan
- Verifica que las URLs de las imágenes sean válidas
- Asegúrate de tener conexión a internet

### Los formularios no funcionan
- Verifica que JavaScript esté habilitado
- Revisa la consola del navegador para errores

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto:
- Revisa la consola del navegador para errores
- Verifica que todos los archivos estén presentes
- Asegúrate de usar un navegador moderno

## 📄 Licencia

Este proyecto fue desarrollado para el Hotel el Rincón del Carmen como demostración de capacidades técnicas.

---

**Desarrollado con ❤️ para el Hotel el Rincón del Carmen**
