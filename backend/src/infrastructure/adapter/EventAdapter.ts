import { EventPort } from '../../domain/EventPort';
import { Event, Attendee, EventStats } from '../../domain/Event';

export class EventAdapter implements EventPort {
  private events: Event[] = [
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

  private attendees: Attendee[] = [];

  async findAll(modality?: string, search?: string): Promise<Event[]> {
    let filtered = [...this.events];

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

    return filtered;
  }

  async findById(id: string): Promise<Event | null> {
    const event = this.events.find(e => e.id === id);
    return event || null;
  }

  async findAttendeeByEventAndEmail(eventId: string, email: string): Promise<Attendee | null> {
    const attendee = this.attendees.find(
      a => a.eventId === eventId && a.correo.toLowerCase() === email.toLowerCase()
    );
    return attendee || null;
  }

  async saveAttendee(attendee: Attendee): Promise<Attendee> {
    this.attendees.push(attendee);
    return attendee;
  }

  async updateAvailableSpots(eventId: string, spots: number): Promise<void> {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.availableSpots = spots;
    }
  }

  async getStats(): Promise<EventStats> {
    return {
      totalEvents: this.events.length,
      presenciales: this.events.filter(e => e.modality === 'Presencial').length,
      virtuales: this.events.filter(e => e.modality === 'Virtual').length,
      nocturnas: this.events.filter(e => e.modality === 'Nocturna').length
    };
  }
}
