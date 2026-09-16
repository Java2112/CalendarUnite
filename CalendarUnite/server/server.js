// Importamos Express para crear el servidor web
const express = require('express');
// Importamos CORS para permitir peticiones desde otros dominios (ej. el frontend)
const cors = require('cors');

// Inicializamos la aplicación de Express
const app = express();
// Definimos el puerto del servidor (usa la variable de entorno o por defecto el 3000)
const PORT = process.env.PORT || 3000;

// Habilitamos CORS en toda la aplicación
app.use(cors());
// Middleware para que Express pueda leer y entender datos en formato JSON
app.use(express.json());

// Arreglo en memoria con los datos iniciales de los eventos
let events = [
  {
    id: 'evt-100',
    title: 'Hablemos: Manejo de Ansiedad en Parciales',
    category: 'Psicología y Salud Mental',
    organizer: 'Dra. María Elena Restrepo (Psicóloga Bienestar)',
    modality: 'Virtual',
    date: '2026-09-18',
    time: '08:00 - 09:30',
    location: 'Enlace Google Meet Institucional',
    totalSpots: 200,
    availableSpots: 145,
    description: 'Espacio de acompañamiento psicológico virtual y preguntas en línea sobre cómo afrontar la carga académica.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date('2026-09-01').toISOString()
  },
  {
    id: 'evt-100b',
    title: 'Inducción Coro y Ensamble Universitario',
    category: 'Cultura y Arte',
    organizer: 'Área Cultural Bienestar',
    modality: 'Presencial',
    date: '2026-09-18',
    time: '16:00 - 18:00',
    location: 'Casa U - Salón de Cultura',
    totalSpots: 30,
    availableSpots: 16,
    description: 'Encuentro e integración para estudiantes interesados en formar parte del coro institucional y agrupaciones musicales.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date('2026-09-01').toISOString()
  },
  {
    id: 'evt-101',
    title: 'Taller de Manejo del Estrés Académico y Ansiedad',
    category: 'Psicología y Salud Mental',
    organizer: 'Dra. María Elena Restrepo (Psicóloga Bienestar)',
    modality: 'Presencial',
    date: '2026-09-20',
    time: '14:00 - 16:00',
    location: 'Auditorio Principal - Edificio A',
    totalSpots: 30,
    availableSpots: 12,
    description: 'Espacio dinámico orientado a brindar herramientas prácticas de respiración, gestión de tiempo y afrontamiento emocional.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date('2026-09-01').toISOString()
  },
  {
    id: 'evt-102',
    title: 'Torneo Relámpago de Fútsal Mixto Nocturno',
    category: 'Deportes y Recreación',
    organizer: 'Área de Deportes y Recreación',
    modality: 'Nocturna',
    date: '2026-09-22',
    time: '18:30 - 21:30',
    location: 'Canchas Sintéticas Campus Norte',
    totalSpots: 40,
    availableSpots: 8,
    description: 'Gran torneo relámpago interfacultades para estudiantes de jornada nocturna. Habrá premiación e hidratación deportiva.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date('2026-09-02').toISOString()
  },
  {
    id: 'evt-103',
    title: 'Webinar: Orientación Vocacional y Hoja de Vida Impactante',
    category: 'Desarrollo Profesional',
    organizer: 'Coordinación de Desarrollo Estudiantil',
    modality: 'Virtual',
    date: '2026-09-25',
    time: '17:00 - 18:30',
    location: 'Enlace Teams / Google Meet (enviado al correo tras inscripción)',
    totalSpots: 100,
    availableSpots: 65,
    description: 'Aprende a estructurar tu perfil profesional, destacar tus habilidades blandas y prepararte para tu primera entrevista laboral.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date('2026-09-05').toISOString()
  },
  {
    id: 'evt-104',
    title: 'Taller de Pintura y Expresión Artística',
    category: 'Cultura y Arte',
    organizer: 'Prof. Andrés Gómez (Área Cultural)',
    modality: 'Presencial',
    date: '2026-09-28',
    time: '10:00 - 12:30',
    location: 'Taller de Artes B-204',
    totalSpots: 15,
    availableSpots: 3,
    description: 'Liberar el estrés mediante técnicas básicas de pintura con acrílico. Los materiales están incluidos para todos los participantes.',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date('2026-09-10').toISOString()
  },
  {
    id: 'evt-105',
    title: 'Campaña de Salud Mental y Asesoría Nutricional Virtual',
    category: 'Salud Integral',
    organizer: 'Equipo de Medicina y Nutrición Institucional',
    modality: 'Virtual',
    date: '2026-09-30',
    time: '15:00 - 17:00',
    location: 'Plataforma Zoom Institucional',
    totalSpots: 80,
    availableSpots: 42,
    description: 'Sesión interactiva sobre hábitos saludables en la universidad, nutrición adecuada en tiempos de estudio y tamizaje de salud mental.',
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date('2026-09-12').toISOString()
  }
];

// Arreglo en memoria para almacenar las personas inscritas a los eventos
let attendees = [];

// Ruta GET para obtener la lista de eventos (soporta filtros opcionales por modalidad y búsqueda)
app.get('/api/events', (req, res) => {
  // Extraemos parámetros de búsqueda desde la URL (?modality=...&search=...)
  const { modality, search } = req.query;
  // Copiamos la lista original de eventos para filtrar sobre ella
  let filtered = [...events];

  // Si se envió modalidad y no es "Todas", filtramos ignorando mayúsculas/minúsculas
  if (modality && modality !== 'Todas') {
    filtered = filtered.filter(e => e.modality.toLowerCase() === modality.toString().toLowerCase());
  }

  // Si hay un texto de búsqueda, filtramos por coincidencia en título, descripción o categoría
  if (search) {
    const q = search.toString().toLowerCase();
    filtered = filtered.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  }

  // Respondemos enviando la lista (filtrada o completa) en formato JSON
  res.json(filtered);
});

// Ruta GET para obtener el detalle de un solo evento por su ID
app.get('/api/events/:id', (req, res) => {
  // Buscamos el evento que coincida con el ID recibido en la URL
  const event = events.find(e => e.id === req.params.id);
  
  // Si no se encuentra, retornamos un error 404
  if (!event) {
    return res.status(404).json({ error: 'Evento no encontrado' });
  }
  
  // Retornamos la información del evento hallado
  res.json(event);
});

// Ruta POST para registrar a un asistente en un evento específico
app.post('/api/events/:id/register', (req, res) => {
  const { id } = req.params; // ID del evento
  const { nombre, correo, telefono } = req.body; // Datos enviados desde el formulario

  // Validación: confirmamos que no falte ningún campo obligatorio
  if (!nombre || !correo || !telefono) {
    return res.status(400).json({ error: 'Todos los campos (nombre, correo y teléfono) son obligatorios.' });
  }

  // Verificamos que el evento exista en nuestra lista
  const targetEvent = events.find(e => e.id === id);
  if (!targetEvent) {
    return res.status(404).json({ error: 'El evento especificado no existe.' });
  }

  // Verificamos que queden cupos disponibles
  if (targetEvent.availableSpots <= 0) {
    return res.status(400).json({ error: 'No quedan cupos disponibles para este evento.' });
  }

  // Evitamos que una persona se inscriba dos veces al mismo evento con el mismo correo
  const existing = attendees.find(a => a.eventId === id && a.correo.toLowerCase() === correo.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Este correo electrónico ya se encuentra registrado en este evento.' });
  }

  // Descontamos un cupo disponible en el evento
  targetEvent.availableSpots -= 1;

  // Creamos el objeto del nuevo asistente
  const newAttendee = {
    id: `att-${Date.now()}`, // Generamos un ID único basado en el tiempo actual
    eventId: id,
    nombre: nombre.trim(),
    correo: correo.trim(),
    telefono: telefono.trim(),
    registeredAt: new Date().toISOString()
  };

  // Guardamos el nuevo registro en el arreglo global
  attendees.push(newAttendee);

  // Respondemos con estatus 201 (Creado) y la confirmación
  res.status(201).json({
    message: 'Inscripción realizada con éxito. Se ha registrado tu cupo.',
    attendee: newAttendee,
    updatedAvailableSpots: targetEvent.availableSpots
  });
});

// Ruta GET para consultar estadísticas globales sobre los eventos
app.get('/api/stats', (req, res) => {
  // Retornamos el total de eventos y la cantidad filtrada por cada modalidad
  res.json({
    totalEvents: events.length,
    presenciales: events.filter(e => e.modality === 'Presencial').length,
    virtuales: events.filter(e => e.modality === 'Virtual').length,
    nocturnas: events.filter(e => e.modality === 'Nocturna').length
  });
});

// Iniciamos el servidor express en el puerto configurado
app.listen(PORT, () => {
  console.log(`[CalendarUnite Backend] Servidor activo en http://localhost:${PORT}`);
});