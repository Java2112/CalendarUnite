// Importa los decoradores y funciones de reactividad de Angular
import { Injectable, signal, computed } from '@angular/core';
// Importa HttpClient para realizar peticiones HTTP al backend
import { HttpClient } from '@angular/common/http';
// Importa operadores de RxJS para manejo reactivo y captura de errores
import { Observable, of, tap, catchError, map } from 'rxjs';
// Importa las interfaces del modelo de psicología
import {
  PsychologyMeeting,
  PsychologyBookingRequest,
  PsychologistProfile,
  PsychologyStats
} from '../models/psychology.model';

// Servicio inyectable global para la gestión de citas de psicología y salud mental
@Injectable({
  providedIn: 'root'
})
export class PsychologyService {
  // URL base de la API REST del backend
  private readonly apiUrl = 'http://localhost:3000/api/psychology';

  // Señal reactiva que almacena la lista de citas de psicología
  meetings = signal<PsychologyMeeting[]>([]);

  // Señal reactiva que almacena la lista de profesionales de Bienestar Universitario
  professionals = signal<PsychologistProfile[]>([
    {
      id: 2,
      name: 'María Elena Restrepo',
      specialty: 'Atención Psicológica y Acompañamiento Estudiantil • Bienestar Universitario',
      email: 'bienestar@unite.edu.co',
      availableSchedule: 'Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 5:00 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80'
    }
  ]);

  // Señal reactiva indicadora de carga activa
  isLoading = signal<boolean>(false);

  // Citas de respaldo iniciales para funcionamiento garantizado en demostraciones
  private readonly mockMeetings: PsychologyMeeting[] = [
    {
      id: 1,
      studentName: 'Valentina Rodríguez Gómez',
      studentEmail: 'v.rodriguez@uniempresarial.edu.co',
      studentPhone: '3157894561',
      studentProgram: 'Ingeniería de Software',
      reason: 'Manejo de ansiedad y bloqueo durante semanas de parciales',
      date: '2026-10-15',
      startHour: '09:00',
      endHour: '10:00',
      modality: 'Presencial',
      professionalName: 'María Elena Restrepo',
      linkMeeting: '',
      status: 'Confirmada',
      observations: 'Primera sesión diagnóstica agendada en Consultorio de Bienestar.',
      createdAt: '2026-10-10 14:20:00'
    },
    {
      id: 2,
      studentName: 'Carlos Eduardo Peña',
      studentEmail: 'c.pena@uniempresarial.edu.co',
      studentPhone: '3204561239',
      studentProgram: 'Administración de Empresas',
      reason: 'Orientación vocacional y equilibrio de horarios modelo dual con prácticas',
      date: '2026-10-16',
      startHour: '14:00',
      endHour: '15:00',
      modality: 'Virtual',
      professionalName: 'María Elena Restrepo',
      linkMeeting: 'https://teams.microsoft.com/l/meetup-join/uniempresarial-psicologia-sesion-2',
      status: 'Confirmada',
      observations: 'Sesión virtual por Teams para asesoría de adaptación al entorno laboral.',
      createdAt: '2026-10-11 09:15:00'
    },
    {
      id: 3,
      studentName: 'Daniela Morales Silva',
      studentEmail: 'd.morales@uniempresarial.edu.co',
      studentPhone: '3109876543',
      studentProgram: 'Finanzas y Comercio Exterior',
      reason: 'Acompañamiento emocional por duelo familiar y bajo rendimiento',
      date: '2026-10-17',
      startHour: '11:00',
      endHour: '12:00',
      modality: 'Presencial',
      professionalName: 'María Elena Restrepo',
      linkMeeting: '',
      status: 'Pendiente',
      observations: 'Solicitud recibida. Pendiente confirmar disponibilidad de consultorio.',
      createdAt: '2026-10-12 11:30:00'
    }
  ];

  // Cálculo computado en tiempo real de estadísticas de las citas
  stats = computed<PsychologyStats>(() => {
    const list = this.meetings();
    return {
      total: list.length,
      pendientes: list.filter(m => m.status === 'Pendiente').length,
      confirmadas: list.filter(m => m.status === 'Confirmada').length,
      completadas: list.filter(m => m.status === 'Completada').length,
      canceladas: list.filter(m => m.status === 'Cancelada').length
    };
  });

  // Constructor que inicializa las citas y profesionales
  constructor(private http: HttpClient) {
    this.meetings.set(this.mockMeetings);
    this.loadMeetings().subscribe();
    this.loadProfessionals().subscribe();
  }

  // Carga el listado de citas desde el backend con fallback a los datos mock
  loadMeetings(status?: string): Observable<PsychologyMeeting[]> {
    this.isLoading.set(true);
    const query = status && status !== 'Todas' ? `?status=${status}` : '';

    return this.http.get<{ success: boolean; data: PsychologyMeeting[] }>(`${this.apiUrl}/meetings${query}`).pipe(
      map(res => res.data),
      tap(data => {
        if (data && data.length > 0) {
          this.meetings.set(data);
        }
        this.isLoading.set(false);
      }),
      catchError(() => {
        // En caso de no tener backend encendido, preserva o inicializa los datos locales
        this.isLoading.set(false);
        return of(this.meetings());
      })
    );
  }

  // Carga el directorio de psicólogos de Bienestar Universitario
  loadProfessionals(): Observable<PsychologistProfile[]> {
    return this.http.get<{ success: boolean; data: PsychologistProfile[] }>(`${this.apiUrl}/professionals`).pipe(
      map(res => res.data),
      tap(data => {
        if (data && data.length > 0) {
          this.professionals.set(data);
        }
      }),
      catchError(() => of(this.professionals()))
    );
  }

  // Registra una nueva cita solicitada por un estudiante
  bookMeeting(request: PsychologyBookingRequest): Observable<{ success: boolean; message: string; data: PsychologyMeeting }> {
    this.isLoading.set(true);

    return this.http.post<{ success: boolean; message: string; data: PsychologyMeeting }>(`${this.apiUrl}/book`, request).pipe(
      tap(res => {
        if (res.data) {
          this.meetings.update(prev => [res.data, ...prev]);
        }
        this.isLoading.set(false);
      }),
      catchError(() => {
        // Fallback local en caso de desconexión
        const newMeeting: PsychologyMeeting = {
          ...request,
          id: Date.now(),
          professionalName: request.professionalName || 'María Elena Restrepo',
          status: 'Pendiente',
          linkMeeting: request.modality === 'Virtual' ? 'https://teams.microsoft.com/l/meetup-join/uniempresarial-psicologia' : '',
          observations: 'Solicitud registrada localmente.',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        this.meetings.update(prev => [newMeeting, ...prev]);
        this.isLoading.set(false);
        return of({
          success: true,
          message: '¡Tu solicitud de cita psicológica ha sido agendada con éxito! El área de Bienestar se contactará contigo.',
          data: newMeeting
        });
      })
    );
  }

  // Actualiza los datos, estado o notas de una cita (uso para personal/psicólogo)
  updateMeeting(id: string | number, updates: Partial<PsychologyMeeting>): Observable<PsychologyMeeting> {
    return this.http.put<{ success: boolean; data: PsychologyMeeting }>(`${this.apiUrl}/meetings/${id}`, updates).pipe(
      map(res => res.data),
      tap(updated => {
        this.meetings.update(prev => prev.map(m => String(m.id) === String(id) ? updated : m));
      }),
      catchError(() => {
        // Actualiza en la señal local
        this.meetings.update(prev => prev.map(m => {
          if (String(m.id) === String(id)) {
            return { ...m, ...updates };
          }
          return m;
        }));
        const current = this.meetings().find(m => String(m.id) === String(id))!;
        return of(current);
      })
    );
  }

  // Elimina o cancela definitivamente una cita
  deleteMeeting(id: string | number): Observable<boolean> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/meetings/${id}`).pipe(
      map(res => res.success),
      tap(() => {
        this.meetings.update(prev => prev.filter(m => String(m.id) !== String(id)));
      }),
      catchError(() => {
        this.meetings.update(prev => prev.filter(m => String(m.id) !== String(id)));
        return of(true);
      })
    );
  }
}
