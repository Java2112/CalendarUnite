import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, UserRole, AuthResponse, LoginCredentials } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private STORAGE_KEY = 'calendarunite_auth';

  // Signals reactivas para la sesión activa del usuario
  public currentUser = signal<User | null>(this.getStoredUser());
  public isLoggedIn = computed<boolean>(() => this.currentUser() !== null);
  public userRole = computed<UserRole | null>(() => this.currentUser()?.role || null);
  public isAuthModalOpen = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  // Autenticación estricta contra el servidor Backend en Express
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res && res.user) {
          this.setCurrentSession(res.user, res.token);
        }
      })
    );
  }

  // Cierra la sesión activa
  logout(): void {
    this.currentUser.set(null);
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
    return current ? roles.includes(current) : false;
  }

  // Guarda la sesión en localStorage y actualiza la Signal
  private setCurrentSession(user: User, token: string): void {
    this.currentUser.set(user);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ user, token }));
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
}
