import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, UserRole, AuthResponse, LoginCredentials, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private STORAGE_KEY = 'calendarunite_auth';

  // Signals reactivas para la sesión activa del usuario
  public currentUser = signal<User | null>(this.getStoredUser());
  public activeToken = signal<string | null>(this.getStoredToken());
  public isLoggedIn = computed<boolean>(() => this.currentUser() !== null);
  public userRole = computed<UserRole | null>(() => this.currentUser()?.role || this.currentUser()?.rol || null);
  public isAuthModalOpen = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  // Autenticación estricta contra el servidor Backend con JWT
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res && res.user && res.token) {
          this.setCurrentSession(res.user, res.token);
        }
      })
    );
  }

  // Cierra la sesión activa
  logout(): void {
    this.currentUser.set(null);
    this.activeToken.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Control del modal de login
  openLoginModal(): void {
    this.isAuthModalOpen.set(true);
  }

  closeLoginModal(): void {
    this.isAuthModalOpen.set(false);
  }

  // Comprueba si el usuario tiene alguno de los roles indicados
  hasRole(roles: UserRole[]): boolean {
    const current = this.userRole();
    return current ? roles.some(r => r.toLowerCase() === current.toLowerCase()) : false;
  }

  // Obtiene el token JWT actual
  getToken(): string | null {
    return this.activeToken();
  }

  // Genera headers con Bearer token para solicitudes protegidas
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ----------------------------------------------------
  // GESTIÓN DE USUARIOS (EXCLUSIVO ADMINISTRADOR - RF9)
  // ----------------------------------------------------

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() });
  }

  createUser(userData: CreateUserRequest): Observable<{ message: string; user: User }> {
    return this.http.post<{ message: string; user: User }>(`${this.apiUrl}/users`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(id: number, userData: UpdateUserRequest): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.apiUrl}/users/${id}`, userData, {
      headers: this.getAuthHeaders()
    });
  }

  toggleUserStatus(id: number, estado: boolean): Observable<{ message: string; success: boolean }> {
    return this.http.patch<{ message: string; success: boolean }>(
      `${this.apiUrl}/users/${id}/status`,
      { estado },
      { headers: this.getAuthHeaders() }
    );
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Guarda la sesión en localStorage y actualiza Signals
  private setCurrentSession(user: User, token: string): void {
    // Normalizar datos de usuario
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

  // Recupera el usuario guardado al recargar la página
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

  // Recupera el token guardado
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
