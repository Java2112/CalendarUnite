# CalendarUnite - Bienestar Universitario (Sprint 1)

CalendarUnite es una aplicación híbrida (móvil y web) diseñada para centralizar, promover y gestionar la participación estudiantil en las actividades extracurriculares de Bienestar Universitario (salud mental, deportes, cultura, talleres artísticos y eventos nocturnos).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Angular 22+, TypeScript, RxJS, Angular Signals (`signal`, `computed`), Sintaxis Moderna de Control Flow (`@if`, `@for`).
- **Backend**: Node.js, Express, CORS API REST.
- **Estilos**: CSS3 con Variables Nativas y Diseño Adaptable (Responsive).
- **Colores Institucionales**:
  - 🔵 **Azul Institucional (`#0F228C`)**: Encabezados, navegación, estructura y acentos principales.
  - 🔴 **Rojo Institucional (`#D9043D`)**: Botones de acción principal (CTA), inscripciones e indicadores destacados.
  - ⚪ **Blanco (`#FFFFFF`)**: Fondo limpio para tarjetas, superficies y ventanas modales.

---

## 📁 Estructura del Proyecto y Explicación de Archivos

### 🖥️ Servidor Backend (`server/`)

- **`server/server.js`**: Servidor API REST en Node.js y Express (Puerto 3000). Proporciona los endpoints HTTP:
  - `GET /api/events`: Retorna el catálogo de eventos con soporte para filtrado por modalidad (*Presencial*, *Virtual*, *Nocturna*) y búsqueda por palabras clave.
  - `GET /api/events/:id`: Entrega los detalles y especificaciones completas de un evento.
  - `POST /api/events/:id/register`: Procesa la inscripción del estudiante (`nombre`, `correo`, `telefono`), descuenta 1 cupo disponible en el evento y almacena el registro del asistente.
  - `GET /api/stats`: Proporciona las estadísticas globales de actividades publicadas y modalidades.

- **`server/package.json`**: Define las dependencias del backend (`express`, `cors`).

---

### 🎨 Aplicación Frontend (`src/app/`)

- **`src/app/models/event.model.ts`**: Define las interfaces y tipos fuertemente tipados de TypeScript:
  - `EventItem`: Estructura de un evento (título, categoría, organizador, modalidad, fecha, horario, lugar, cupos totales y disponibles, descripción e imagen).
  - `RegisterRequest`: Campos requeridos para la inscripción estudiantil (`nombre`, `correo`, `telefono`).
  - `StatsSummary`: Totales y conteo por modalidad para las tarjetas de estadísticas.

- **`src/app/services/event.service.ts`**: Servicio inyectable de Angular encargado de la gestión de estado y peticiones HTTP:
  - Maneja las señales reactivas `events` e `isLoading`.
  - Calcula automáticamente mediante un Signal Computado (`computed()`) las estadísticas en tiempo real.
  - Incluye un mecanismo de datos *MOCK* de respaldo para que la aplicación funcione e inscriba estudiantes inmediatamente incluso si el servidor backend no estuviera encendido durante una demostración.

- **`src/app/components/navbar/navbar.ts`**: Componente de la barra de navegación superior institucional con el logotipo de CalendarUnite, título oficial de Bienestar Universitario e indicador del portal de consulta.

- **`src/app/components/calendar/calendar.ts`**: Componente principal del dashboard interactivo:
  - **Banner e Historial de Estadísticas**: Tarjetas que muestran los eventos publicados, modalidades presenciales, virtuales y jornada nocturna.
  - **Widget de Calendario Mensual**: Rejilla mensual interactiva con iniciales de la semana (`L`, `M`, `X`, `J`, `V`, `S`, `D`), navegación entre meses e indicadores con puntos de colores (`•`) según la categoría de la actividad.
  - **Filtro por Día del Calendario**: Al hacer clic en una fecha específica, resalta el día en Azul Institucional y filtra las actividades programadas para ese día.
  - **Filtros por Modalidad y Buscador**: Filtros rápidos (*Presencial*, *Virtual*, *Nocturna*) y caja de búsqueda en tiempo real.
  - **Alternador de Vista**: Permite cambiar la visualización entre cuadrícula de tarjetas (Grid) y lista.

- **`src/app/components/event-detail/event-detail.ts`**: Modal de detalles del evento:
  - Muestra la imagen promocional, organizador, horario, lugar, categoría, modalidad y especificaciones detalladas.
  - Contiene el **Formulario de Inscripción Estudiantil** (`Nombre Completo`, `Correo Institucional`, `Teléfono`).
  - Al confirmar, descuenta inmediatamente el cupo disponible y muestra el mensaje de confirmación exitosa.

- **`src/app/app.ts` & `src/app/app.html`**: Componente raíz standalone que orquesta la barra de navegación, el calendario interactivo y la apertura/cierre del modal de detalles.

- **`src/styles.css`**: Hoja de estilos global con la paleta de colores institucionales, estilos responsivos para móvil y web, y reglas del widget de calendario.

- **`package.json`**: Archivo de configuración del proyecto con los scripts de ejecución:
  - `npm start`: Inicia la aplicación Angular en `http://localhost:4200`.
  - `npm run server`: Inicia la API REST Node.js en `http://localhost:3000`.
  - `npm run build`: Compila la aplicación Angular para producción.

---

## ⚡ Instrucciones de Ejecución

1. **Paso 1 - Iniciar el Backend (Terminal 1)**:
   ```bash
   npm run server
   ```
   > Salida: `[CalendarUnite Backend] Servidor activo en http://localhost:3000`

2. **Paso 2 - Iniciar el Frontend (Terminal 2)**:
   ```bash
   npm start
   ```
   Abre en el navegador: `http://localhost:4200`.
