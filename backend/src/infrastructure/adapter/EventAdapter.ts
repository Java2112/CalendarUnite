import { EventPort } from '../../domain/EventPort';
import { Event, Attendee, EventStats, EventModality } from '../../domain/Event';
import { PlaceAdapter } from './PlaceAdapter';
import { UserAdapter } from './UserAdapter';
import { AttachmentAdapter } from './AttachmentAdapter';

export class EventAdapter implements EventPort {
  private events: Event[] = [
    {
      id_evento: 100,
      id: 'evt-100',
      nombre: 'Hablemos: Manejo de Ansiedad en Parciales',
      title: 'Hablemos: Manejo de Ansiedad en Parciales',
      category: 'Psicología y Salud Mental',
      organizer: 'Dra. María Elena Restrepo (Psicóloga Bienestar)',
      modalidad: 'Virtual',
      modality: 'Virtual',
      link_virtual: ['https://meet.google.com/abc-defg-hij'],
      descripcion: 'Espacio de acompañamiento psicológico virtual y preguntas en línea sobre cómo afrontar la carga académica.',
      fecha_inicio: '2026-09-18',
      fecha_fin: '2026-09-18',
      date: '2026-09-18',
      hora_inicio: '08:00',
      hora_fin: '09:30',
      time: '08:00 - 09:30',
      estado: 'Activo',
      id_lugar: 5,
      location: 'Enlace Google Meet Institucional',
      id_responsable: 2,
      totalSpots: 200,
      availableSpots: 145,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      banner_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date('2026-09-01').toISOString()
    },
    {
      id_evento: 101,
      id: 'evt-100b',
      nombre: 'Inducción Coro y Ensamble Universitario',
      title: 'Inducción Coro y Ensamble Universitario',
      category: 'Cultura y Arte',
      organizer: 'Área Cultural Bienestar',
      modalidad: 'Presencial',
      modality: 'Presencial',
      link_virtual: [],
      descripcion: 'Encuentro e integración para estudiantes interesados en formar parte del coro institucional y agrupaciones musicales.',
      fecha_inicio: '2026-09-18',
      fecha_fin: '2026-09-18',
      date: '2026-09-18',
      hora_inicio: '16:00',
      hora_fin: '18:00',
      time: '16:00 - 18:00',
      estado: 'Activo',
      id_lugar: 2,
      location: 'Casa U - Salón de Cultura',
      id_responsable: 2,
      totalSpots: 30,
      availableSpots: 16,
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      banner_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date('2026-09-01').toISOString()
    },
    {
      id_evento: 102,
      id: 'evt-101',
      nombre: 'Taller de Manejo del Estrés Académico y Ansiedad',
      title: 'Taller de Manejo del Estrés Académico y Ansiedad',
      category: 'Psicología y Salud Mental',
      organizer: 'Dra. María Elena Restrepo (Psicóloga Bienestar)',
      modalidad: 'Presencial',
      modality: 'Presencial',
      link_virtual: [],
      descripcion: 'Espacio dinámico orientado a brindar herramientas prácticas de respiración, gestión de tiempo y afrontamiento emocional.',
      fecha_inicio: '2026-09-20',
      fecha_fin: '2026-09-20',
      date: '2026-09-20',
      hora_inicio: '14:00',
      hora_fin: '16:00',
      time: '14:00 - 16:00',
      estado: 'Activo',
      id_lugar: 1,
      location: 'Auditorio Principal - Edificio A',
      id_responsable: 2,
      totalSpots: 30,
      availableSpots: 12,
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      banner_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date('2026-09-01').toISOString()
    },
    {
      id_evento: 103,
      id: 'evt-102',
      nombre: 'Torneo Relámpago de Fútsal Mixto Nocturno',
      title: 'Torneo Relámpago de Fútsal Mixto Nocturno',
      category: 'Deportes y Recreación',
      organizer: 'Juan Pablo Ríos (Líder Estudiantil)',
      modalidad: 'Nocturna',
      modality: 'Nocturna',
      link_virtual: [],
      descripcion: 'Gran torneo relámpago interfacultades para estudiantes de jornada nocturna. Habrá premiación e hidratación deportiva.',
      fecha_inicio: '2026-09-22',
      fecha_fin: '2026-09-22',
      date: '2026-09-22',
      hora_inicio: '18:30',
      hora_fin: '21:30',
      time: '18:30 - 21:30',
      estado: 'Activo',
      id_lugar: 3,
      location: 'Canchas Sintéticas Campus Norte',
      id_responsable: 3,
      totalSpots: 40,
      availableSpots: 8,
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
      banner_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date('2026-09-02').toISOString()
    },
    {
      id_evento: 104,
      id: 'evt-103',
      nombre: 'Webinar: Orientación Vocacional y Hoja de Vida Impactante',
      title: 'Webinar: Orientación Vocacional y Hoja de Vida Impactante',
      category: 'Desarrollo Profesional',
      organizer: 'Coordinación de Desarrollo Estudiantil',
      modalidad: 'Virtual',
      modality: 'Virtual',
      link_virtual: ['https://teams.microsoft.com/l/meetup-join/19%3ameeting_unite'],
      descripcion: 'Aprende a estructurar tu perfil profesional, destacar tus habilidades blandas y prepararte para tu primera entrevista laboral.',
      fecha_inicio: '2026-09-25',
      fecha_fin: '2026-09-25',
      date: '2026-09-25',
      hora_inicio: '17:00',
      hora_fin: '18:30',
      time: '17:00 - 18:30',
      estado: 'Activo',
      id_lugar: 5,
      location: 'Enlace Teams / Google Meet',
      id_responsable: 1,
      totalSpots: 100,
      availableSpots: 65,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      banner_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date('2026-09-05').toISOString()
    },
    {
      id_evento: 105,
      id: 'evt-104',
      nombre: 'Taller de Pintura y Expresión Artística',
      title: 'Taller de Pintura y Expresión Artística',
      category: 'Cultura y Arte',
      organizer: 'Área Cultural Bienestar',
      modalidad: 'Presencial',
      modality: 'Presencial',
      link_virtual: [],
      descripcion: 'Liberar el estrés mediante técnicas básicas de pintura con acrílico. Los materiales están incluidos para todos los participantes.',
      fecha_inicio: '2026-09-28',
      fecha_fin: '2026-09-28',
      date: '2026-09-28',
      hora_inicio: '10:00',
      hora_fin: '12:30',
      time: '10:00 - 12:30',
      estado: 'Activo',
      id_lugar: 4,
      location: 'Taller de Artes B-204',
      id_responsable: 2,
      totalSpots: 15,
      availableSpots: 3,
      imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80',
      banner_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date('2026-09-10').toISOString()
    }
  ];

  private attendees: Attendee[] = [];

  constructor(
    private placeAdapter?: PlaceAdapter,
    private userAdapter?: UserAdapter,
    private attachmentAdapter?: AttachmentAdapter
  ) {}

  private async enrichEvent(event: Event): Promise<Event> {
    const copy = { ...event };
    // Aseguramos sincronía de campos id / id_evento
    copy.id = copy.id || `evt-${copy.id_evento}`;
    copy.title = copy.title || copy.nombre;
    copy.modality = copy.modality || copy.modalidad;
    copy.date = copy.date || copy.fecha_inicio;
    if (!copy.time && copy.hora_inicio && copy.hora_fin) {
      copy.time = `${copy.hora_inicio} - ${copy.hora_fin}`;
    }

    if (this.placeAdapter) {
      const place = await this.placeAdapter.findById(copy.id_lugar);
      if (place) {
        copy.lugar = place;
        copy.location = copy.location || `${place.nombre} (${place.edificio || ''} ${place.aula || ''})`.trim();
      }
    }

    if (this.userAdapter) {
      const user = await this.userAdapter.findById(copy.id_responsable);
      if (user) {
        copy.responsable = {
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          apellido: user.apellido,
          correo: user.correo,
          rol: user.rol
        };
        copy.organizer = copy.organizer || `${user.nombre} ${user.apellido} (${user.rol})`;
      }
    }

    copy.imageUrl = copy.imageUrl || copy.banner_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80';
    copy.banner_url = copy.imageUrl;

    return copy;
  }

  async findAll(modality?: string, search?: string): Promise<Event[]> {
    let filtered = [...this.events];

    if (modality && modality !== 'Todas') {
      filtered = filtered.filter(
        e => (e.modalidad || e.modality || '').toLowerCase() === modality.toString().toLowerCase()
      );
    }

    if (search) {
      const q = search.toString().toLowerCase();
      filtered = filtered.filter(e =>
        (e.nombre || e.title || '').toLowerCase().includes(q) ||
        (e.descripcion || '').toLowerCase().includes(q) ||
        (e.category || '').toLowerCase().includes(q)
      );
    }

    return Promise.all(filtered.map(e => this.enrichEvent(e)));
  }

  async findById(id: number | string): Promise<Event | null> {
    const numId = Number(id);
    const event = this.events.find(e => e.id_evento === numId || e.id === String(id));
    if (!event) return null;
    return this.enrichEvent(event);
  }

  async create(eventData: Omit<Event, 'id_evento'>, bannerUrl?: string): Promise<Event> {
    const nextId = this.events.length > 0 ? Math.max(...this.events.map(e => e.id_evento)) + 1 : 1;
    const timeStr = eventData.hora_inicio && eventData.hora_fin ? `${eventData.hora_inicio} - ${eventData.hora_fin}` : '';
    const imgUrl = bannerUrl || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=80';

    if (bannerUrl && this.attachmentAdapter) {
      await this.attachmentAdapter.save({
        id_usuario: eventData.id_responsable,
        nombre: `banner-evento-${nextId}`,
        tipo: 'image/jpeg',
        url: bannerUrl,
        tamano: 150000
      });
    }

    const newEvent: Event = {
      ...eventData,
      id_evento: nextId,
      id: `evt-${nextId}`,
      title: eventData.nombre,
      modality: eventData.modalidad,
      date: eventData.fecha_inicio,
      time: timeStr,
      imageUrl: imgUrl,
      banner_url: imgUrl,
      createdAt: new Date().toISOString()
    };

    this.events.unshift(newEvent);
    return this.enrichEvent(newEvent);
  }

  async update(id: number, data: Partial<Event>, bannerUrl?: string): Promise<Event | null> {
    const index = this.events.findIndex(e => e.id_evento === Number(id));
    if (index === -1) return null;

    const current = this.events[index];
    const updated: Event = {
      ...current,
      ...data,
      id_evento: current.id_evento,
      id: current.id
    };

    if (data.nombre) updated.title = data.nombre;
    if (data.modalidad) updated.modality = data.modalidad;
    if (data.fecha_inicio) updated.date = data.fecha_inicio;
    if (data.hora_inicio && data.hora_fin) updated.time = `${data.hora_inicio} - ${data.hora_fin}`;

    if (bannerUrl) {
      updated.banner_url = bannerUrl;
      updated.imageUrl = bannerUrl;
      if (this.attachmentAdapter) {
        await this.attachmentAdapter.save({
          id_usuario: updated.id_responsable,
          nombre: `banner-evento-${updated.id_evento}`,
          tipo: 'image/jpeg',
          url: bannerUrl,
          tamano: 150000
        });
      }
    }

    this.events[index] = updated;
    return this.enrichEvent(updated);
  }

  async delete(id: number): Promise<boolean> {
    const initialLen = this.events.length;
    this.events = this.events.filter(e => e.id_evento !== Number(id));
    return this.events.length < initialLen;
  }

  async findAttendeeByEventAndEmail(eventId: string, email: string): Promise<Attendee | null> {
    const attendee = this.attendees.find(
      a => (a.eventId === eventId || a.eventId === `evt-${eventId}`) && a.correo.toLowerCase() === email.toLowerCase()
    );
    return attendee || null;
  }

  async saveAttendee(attendee: Attendee): Promise<Attendee> {
    this.attendees.push(attendee);
    return attendee;
  }

  async updateAvailableSpots(eventId: string, spots: number): Promise<void> {
    const event = this.events.find(e => e.id === eventId || String(e.id_evento) === eventId);
    if (event) {
      event.availableSpots = spots;
    }
  }

  async getStats(): Promise<EventStats> {
    return {
      totalEvents: this.events.length,
      presenciales: this.events.filter(e => (e.modalidad || e.modality) === 'Presencial').length,
      virtuales: this.events.filter(e => (e.modalidad || e.modality) === 'Virtual').length,
      nocturnas: this.events.filter(e => (e.modalidad || e.modality) === 'Nocturna').length
    };
  }
}
