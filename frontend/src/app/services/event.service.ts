import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { EventItem, RegisterRequest, StatsSummary } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // URL base del backend Node.js / Express
  private apiUrl = 'http://localhost:3000/api';

  // Signals reactivas para el estado global de la app
  public events = signal<EventItem[]>([]);                       // Lista reactiva de eventos desde el servidor
  public selectedEvent = signal<EventItem | null>(null);         // Evento seleccionado activamente
  public isLoading = signal<boolean>(false);                     // Estado de carga (spinner/loader)
  public backendError = signal<string | null>(null);            // Notificación de error de conexión con el backend

  // Signal calculada (computed): recalcula las estadísticas automáticamente si cambia 'events'
  public stats = computed<StatsSummary>(() => {
    const list = this.events();
    return {
      totalEvents: list.length,
      presenciales: list.filter(e => e.modality === 'Presencial').length,
      virtuales: list.filter(e => e.modality === 'Virtual').length,
      nocturnas: list.filter(e => e.modality === 'Nocturna').length
    };
  });

  constructor(private http: HttpClient) {}

  // Consulta eventos estrictamente al servidor backend Express
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

    // Petición HTTP al backend obligatoria
    return this.http.get<EventItem[]>(`${this.apiUrl}/events`, { params }).pipe(
      tap({
        next: (data) => {
          this.events.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.events.set([]);
          this.backendError.set('No se pudo establecer conexión con el servidor Backend en http://localhost:3000. Por favor verifica que esté encendido.');
        }
      }),
      catchError((err) => throwError(() => err))
    );
  }

  // Registra la inscripción enviando la solicitud directamente al servidor backend Express
  registerForEvent(eventId: string, registrationData: RegisterRequest): Observable<{ message: string; updatedAvailableSpots: number }> {
    return this.http.post<{ message: string; updatedAvailableSpots: number }>(`${this.apiUrl}/events/${eventId}/register`, registrationData).pipe(
      tap((res) => {
        if (res && typeof res.updatedAvailableSpots === 'number') {
          // Actualizamos la lista local con los cupos retornados por el servidor
          this.events.update(list => list.map(e => {
            if (e.id === eventId) {
              return { ...e, availableSpots: res.updatedAvailableSpots };
            }
            return e;
          }));

          if (this.selectedEvent()?.id === eventId) {
            const current = this.selectedEvent();
            if (current) {
              this.selectedEvent.set({ ...current, availableSpots: res.updatedAvailableSpots });
            }
          }
        }
      })
    );
  }
}