// Importa decoradores y funciones de señales reactivas de Angular
import { Injectable, signal, computed } from '@angular/core';
// Importa el cliente HTTP y encabezados de Angular
import { HttpClient, HttpHeaders } from '@angular/common/http';
// Importa utilidades reactivas de RxJS
import { Observable, tap } from 'rxjs';
// Importa los modelos y tipos relacionados con usuarios y autenticación
import { User, UserRole, AuthResponse, LoginCredentials, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

// Declara el servicio disponible en toda la aplicación
@Injectable({
  providedIn: 'root'
})
// Servicio de gestión de autenticación, sesión y administración de usuarios
export class AuthService {
  // URL base del backend
  private apiUrl = 'http://localhost:3000/api';
  // Clave para guardar la sesión en el almacenamiento local
  private STORAGE_KEY = 'calendarunite_auth';

  // Señal reactiva con el usuario autenticado
  public currentUser = signal<User | null>(this.getStoredUser());
  // Señal reactiva con el token JWT
  public activeToken = signal<string | null>(this.getStoredToken());
  // Valor computado booleano que indica si hay sesión activa
  public isLoggedIn = computed<boolean>(() => this.currentUser() !== null);
  // Valor computado con el rol del usuario en sesión
  public userRole = computed<UserRole | null>(() => this.currentUser()?.role || this.currentUser()?.rol || null);
  // Señal reactiva que controla la visibilidad del modal de login
  public isAuthModalOpen = signal<boolean>(false);

  // Inyecta el cliente HTTP
  constructor(private http: HttpClient) {}

  // Envía credenciales al backend para iniciar sesión con JWT
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res && res.user && res.token) {
          this.setCurrentSession(res.user, res.token);
        }
      })
    );
  }

  // Cierra la sesión activa y elimina datos del localStorage
  logout(): void {
    this.currentUser.set(null);
    this.activeToken.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Abre el modal de inicio de sesión
  openLoginModal(): void {
    this.isAuthModalOpen.set(true);
  }

  // Cierra el modal de inicio de sesión
  closeLoginModal(): void {
    this.isAuthModalOpen.set(false);
  }

  // Comprueba si el usuario autenticado tiene uno de los roles solicitados
  hasRole(roles: UserRole[]): boolean {
    const current = this.userRole();
    return current ? roles.some(r => r.toLowerCase() === current.toLowerCase()) : false;
  }

  // Obtiene el token JWT actual
  getToken(): string | null {
    return this.activeToken();
  }

  // Construye encabezados HTTP con autorización Bearer JWT
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // Obtiene todos los usuarios (solo administrador)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() });
  }

  // Registra un nuevo usuario (solo administrador)
  createUser(userData: CreateUserRequest): Observable<{ message: string; user: User }> {
    return this.http.post<{ message: string; user: User }>(`${this.apiUrl}/users`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  // Actualiza los datos de un usuario (solo administrador)
  updateUser(id: number, userData: UpdateUserRequest): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.apiUrl}/users/${id}`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  // Cambia el estado de activación de un usuario
  toggleUserStatus(id: number, estado: boolean): Observable<{ message: string; success: boolean }> {
    return this.http.patch<{ message: string; success: boolean }>(
      `${this.apiUrl}/users/${id}/status`,
      { estado },
      { headers: this.getAuthHeaders() }
    );
  }

  // Elimina un usuario por su ID
  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Guarda la sesión en el almacenamiento local y actualiza las señales
  private setCurrentSession(user: User, token: string): void {
    const normalized: User = {
      ...user,
      id_usuario: user.id_usuario || Number(user.id) || 1,
      id: String(user.id_usuario || user.id || 1),
      role: user.role || user.rol || 'Lider',
      rol: user.rol || user.role || 'Lider',
      name: user.name || `${user.nombre || ''} ${user.apellido || ''}`.trim(),
      email: user.email || user.correo || ''
    };

    this.currentUser.set(normalized);
    this.activeToken.set(token);

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ user: normalized, token }));
    } catch (e) {
      console.error('Error al guardar sesión en localStorage', e);
    }
  }

  // Recupera el usuario desde el almacenamiento local
  private getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.user || null;
      }
    } catch (e) {
      console.error('Error al leer sesión almacenada', e);
    }
    return null;
  }

  // Recupera el token guardado en el almacenamiento local
  private getStoredToken(): string | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.token || null;
      }
    } catch (e) {
      console.error('Error al leer token almacenado', e);
    }
    return null;
  }
}
