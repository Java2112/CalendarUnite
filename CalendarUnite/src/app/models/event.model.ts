// Define el tipo personalizado 'ModalityType', limitando los valores permitidos a estas 4 opciones
export type ModalityType = 'Presencial' | 'Virtual' | 'Nocturna' | 'Todas';

// Interfaz que define la estructura completa que debe tener cada objeto de evento en la aplicación
export interface EventItem {
  id: string;              // Identificador único del evento (ej. "evt-100")
  title: string;           // Título principal de la actividad
  category: string;        // Categoría (ej. "Psicología", "Deportes")
  organizer: string;       // Persona o dependencia organizadora
  modality: 'Presencial' | 'Virtual' | 'Nocturna'; // Modalidad específica del evento
  date: string;            // Fecha del evento en formato texto ("YYYY-MM-DD")
  time: string;            // Rango de horas (ej. "08:00 - 09:30")
  location: string;        // Lugar físico o enlace virtual del evento
  totalSpots: number;      // Capacidad total de cupos del evento
  availableSpots: number;  // Cupos disponibles actualmente
  description: string;     // Descripción detallada del evento
  imageUrl?: string;       // (Opcional) URL de la imagen descriptiva
  createdAt?: string;      // (Opcional) Fecha de creación del registro
}

// Interfaz que estructura los datos requeridos para enviar el formulario de inscripción al backend
export interface RegisterRequest {
  nombre: string;   // Nombre completo del estudiante
  correo: string;   // Correo electrónico institucional
  telefono: string; // Número de teléfono de contacto
}

// Interfaz que define el formato de la respuesta estadística obtenida desde el servidor
export interface StatsSummary {
  totalEvents: number;  // Conteo global de eventos
  presenciales: number; // Cantidad de eventos presenciales
  virtuales: number;    // Cantidad de eventos virtuales
  nocturnas: number;     // Cantidad de eventos nocturnos
  [key: string]: any;   // Permite la entrada de propiedades adicionales dinámicas si el backend las envía
}