// Importamos Express para crear el servidor web
const express = require('express');
// Importamos CORS para permitir peticiones desde el frontend Angular
const cors = require('cors');

// Inicializamos la aplicación de Express
const app = express();
// Definimos el puerto del servidor (usa la variable de entorno o por defecto el 3000)
const PORT = process.env.PORT || 3000;

// Habilitamos CORS en toda la aplicación
app.use(cors());
// Middleware para procesar JSON en el cuerpo de las peticiones
app.use(express.json());

// --- BASE DE DATOS EN MEMORIA DE USUARIOS (Roles: Admin, Bienestar, Lider) ---
const users = [
  {
    id: 'usr-admin',
    name: 'Carlos Mendoza',
    email: 'admin@unite.edu.co',
    password: 'admin123',
    role: 'Admin',
    department: 'Administración General',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-bienestar',
    name: 'Dra. María Elena Restrepo',
    email: 'bienestar@unite.edu.co',
    password: 'bienestar123',
    role: 'Bienestar',
    department: 'Coordinación de Bienestar Universitario',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'usr-lider',
    name: 'Juan Pablo Ríos',
    email: 'lider@unite.edu.co',
    password: 'lider123',
    role: 'Lider',
    department: 'Líder Estudiantil Interfacultades',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
  }
];

// --- BASE DE DATOS EN MEMORIA DE EVENTOS ---
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

// Asistentes registrados
let attendees = [];

// ==========================================
// RUTAS DE AUTENTICACIÓN (LOGIN DE ROLES)
// ==========================================

// POST /api/auth/login -> Autentica usuarios por correo/contraseña o por selección rápida de rol
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;

  let foundUser = null;

  // Si se envió un rol específico directamente (login rápido de prueba)
  if (role) {
    foundUser = users.find(u => u.role.toLowerCase() === role.toLowerCase());
  } 
  // Si se envió correo y contraseña
  else if (email && password) {
    foundUser = users.find(u => 
      u.email.toLowerCase() === email.trim().toLowerCase() && 
      u.password === password
    );
  }

  if (!foundUser) {
    return res.status(401).json({ 
      error: 'Credenciales inválidas. Por favor verifica el correo y contraseña.' 
    });
  }

  // Generamos un token simulado de sesión
  const token = `token-${foundUser.role.toLowerCase()}-${Date.now()}`;

  // Retornamos el perfil de usuario sin exporner la contraseña
  const userProfile = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
    role: foundUser.role,
    department: foundUser.department,
    avatar: foundUser.avatar
  };

  res.json({
    message: `Inicio de sesión exitoso como ${foundUser.role}`,
    token,
    user: userProfile
  });
});

// GET /api/auth/me -> Obtiene los datos del usuario logueado según el token enviado en headers
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No se proporcionó token de autorización' });
  }

  const token = authHeader.replace('Bearer ', '');
  let matchedUser = null;

  if (token.includes('admin')) matchedUser = users.find(u => u.role === 'Admin');
  else if (token.includes('bienestar')) matchedUser = users.find(u => u.role === 'Bienestar');
  else if (token.includes('lider')) matchedUser = users.find(u => u.role === 'Lider');

  if (!matchedUser) {
    return res.status(401).json({ error: 'Sesión o token inválido' });
  }

  res.json({
    user: {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      department: matchedUser.department,
      avatar: matchedUser.avatar
    }
  });
});

// ==========================================
// RUTAS DE EVENTOS Y REGISTRO
// ==========================================

// GET /api/events -> Consulta la lista de eventos con filtros opcionales
app.get('/api/events', (req, res) => {
  const { modality, search } = req.query;
  let filtered = [...events];

  if (modality && modality !== 'Todas') {
    filtered = filtered.filter(e => e.modality.toLowerCase() === modality.toString().toLowerCase());
  }

  if (search) {
    const q = search.toString().toLowerCase();
    filtered = filtered.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

// GET /api/events/:id -> Detalle de un evento
app.get('/api/events/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Evento no encontrado' });
  }
  res.json(event);
});

// POST /api/events/:id/register -> Inscripción a evento
app.post('/api/events/:id/register', (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono } = req.body;

  if (!nombre || !correo || !telefono) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const targetEvent = events.find(e => e.id === id);
  if (!targetEvent) {
    return res.status(404).json({ error: 'El evento especificado no existe.' });
  }

  if (targetEvent.availableSpots <= 0) {
    return res.status(400).json({ error: 'No quedan cupos disponibles para este evento.' });
  }

  const existing = attendees.find(a => a.eventId === id && a.correo.toLowerCase() === correo.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Este correo electrónico ya se encuentra registrado en este evento.' });
  }

  targetEvent.availableSpots -= 1;

  const newAttendee = {
    id: `att-${Date.now()}`,
    eventId: id,
    nombre: nombre.trim(),
    correo: correo.trim(),
    telefono: telefono.trim(),
    registeredAt: new Date().toISOString()
  };

  attendees.push(newAttendee);

  res.status(201).json({
    message: 'Inscripción realizada con éxito. Se ha registrado tu cupo.',
    attendee: newAttendee,
    updatedAvailableSpots: targetEvent.availableSpots
  });
});

// GET /api/stats -> Estadísticas globales
app.get('/api/stats', (req, res) => {
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
