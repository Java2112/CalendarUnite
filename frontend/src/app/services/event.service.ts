import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { EventItem, RegisterRequest, StatsSummary, CreateEventRequest, UpdateEventRequest } from '../models/event.model';
import { Place } from '../models/place.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api';

  // Signals reactivas para el estado global de la app
  public events = signal<EventItem[]>([]);
  public selectedEvent = signal<EventItem | null>(null);
  public isLoading = signal<boolean>(false);
  public backendError = signal<string | null>(null);
  public places = signal<Place[]>([]);

  // Signal calculada (computed) para estadísticas
  public stats = computed<StatsSummary>(() => {
    const list = this.events();
    return {
      totalEvents: list.length,
      presenciales: list.filter(e => (e.modality || e.modalidad) === 'Presencial').length,
      virtuales: list.filter(e => (e.modality || e.modalidad) === 'Virtual').length,
      nocturnas: list.filter(e => (e.modality || e.modalidad) === 'Nocturna').length
    };
  });

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Consulta eventos al backend Express
  loadEvents(modality?: string, search?: string): Observable<EventItem[]> {
    this.isLoading.set(true);
    this.backendError.set(null);
    let params = new HttpParams();

    if (modality && modality !== 'Todas') {
      params = params.set('modality', modality);
    }
    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }

    return this.http.get<EventItem[]>(`${this.apiUrl}/events`, { params }).pipe(
      tap({
        next: (data) => {
          // Normalizar items
          const normalized = data.map(e => this.normalizeEvent(e));
          this.events.set(normalized);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.backendError.set('No se pudo establecer conexión con el servidor Backend en http://localhost:3000. Por favor verifica que esté encendido.');
        }
      }),
      catchError((err) => throwError(() => err))
    );
  }

  // Consulta lugares del campus
  loadPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.apiUrl}/places`).pipe(
      tap((data) => {
        this.places.set(data);
      })
    );
  }

  // Crear nuevo evento (Líder, Bienestar, Admin)
  createEvent(eventData: CreateEventRequest): Observable<{ message: string; event: EventItem }> {
    return this.http.post<{ message: string; event: EventItem }>(
      `${this.apiUrl}/events`,
      eventData,
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      tap((res) => {
        if (res && res.event) {
          const normalized = this.normalizeEvent(res.event);
          this.events.update(list => [normalized, ...list]);
        }
      })
    );
  }

  // Editar evento existente (Con Ownership RBAC)
  updateEvent(id: number | string, eventData: UpdateEventRequest): Observable<{ message: string; event: EventItem }> {
    return this.http.put<{ message: string; event: EventItem }>(
      `${this.apiUrl}/events/${id}`,
      eventData,
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      tap((res) => {
        if (res && res.event) {
          const normalized = this.normalizeEvent(res.event);
          this.events.update(list => list.map(e => (e.id === normalized.id || e.id_evento === normalized.id_evento) ? normalized : e));
          if (this.selectedEvent()?.id === normalized.id || this.selectedEvent()?.id_evento === normalized.id_evento) {
            this.selectedEvent.set(normalized);
          }
        }
      })
    );
  }

  // Eliminar evento (Con Ownership RBAC)
  deleteEvent(id: number | string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/events/${id}`,
      { headers: this.authService.getAuthHeaders() }
    ).pipe(
      tap(() => {
        this.events.update(list => list.filter(e => e.id !== String(id) && e.id_evento !== Number(id)));
        if (this.selectedEvent()?.id === String(id) || this.selectedEvent()?.id_evento === Number(id)) {
          this.selectedEvent.set(null);
        }
      })
    );
  }

  // Registra la inscripción de un estudiante
  registerForEvent(eventId: string, registrationData: RegisterRequest): Observable<{ message: string; updatedAvailableSpots: number }> {
    return this.http.post<{ message: string; updatedAvailableSpots: number }>(`${this.apiUrl}/events/${eventId}/register`, registrationData).pipe(
      tap((res) => {
        if (res && typeof res.updatedAvailableSpots === 'number') {
          this.events.update(list => list.map(e => {
            if (e.id === eventId || String(e.id_evento) === eventId) {
              return { ...e, availableSpots: res.updatedAvailableSpots };
            }
            return e;
          }));

          if (this.selectedEvent()?.id === eventId || String(this.selectedEvent()?.id_evento) === eventId) {
            const current = this.selectedEvent();
            if (current) {
              this.selectedEvent.set({ ...current, availableSpots: res.updatedAvailableSpots });
            }
          }
        }
      })
    );
  }

  private normalizeEvent(e: any): EventItem {
    const numId = e.id_evento || (typeof e.id === 'string' && e.id.startsWith('evt-') ? parseInt(e.id.replace('evt-', ''), 10) : Number(e.id) || 1);
    const date = e.fecha_inicio || e.date || '';
    const time = e.time || (e.hora_inicio && e.hora_fin ? `${e.hora_inicio} - ${e.hora_fin}` : 'Horario a confirmar');
    const modality = e.modalidad || e.modality || 'Presencial';
    const location = e.location || (e.lugar ? `${e.lugar.nombre} (${e.lugar.edificio || ''} ${e.lugar.aula || ''})`.trim() : 'Lugar por definir');
    const organizer = e.organizer || (e.responsable ? `${e.responsable.nombre} ${e.responsable.apellido} (${e.responsable.rol})` : 'Bienestar Universitario');
    const totalSpots = e.totalSpots !== undefined ? e.totalSpots : 50;
    const availableSpots = e.availableSpots !== undefined ? e.availableSpots : totalSpots;
    const imageUrl = e.banner_url || e.imageUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80';

    return {
      ...e,
      id_evento: numId,
      id: e.id || `evt-${numId}`,
      title: e.nombre || e.title || 'Actividad Institucional',
      nombre: e.nombre || e.title || 'Actividad Institucional',
      description: e.descripcion || e.description || '',
      descripcion: e.descripcion || e.description || '',
      modality: modality as 'Presencial' | 'Virtual' | 'Nocturna',
      modalidad: modality as 'Presencial' | 'Virtual' | 'Nocturna',
      date,
      fecha_inicio: date,
      time,
      location,
      organizer,
      totalSpots,
      availableSpots,
      imageUrl,
      banner_url: imageUrl,
      link_virtual: Array.isArray(e.link_virtual) ? e.link_virtual : []
    };
  }
}