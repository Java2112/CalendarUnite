import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
// Componente modal para crear o editar usuarios del sistema
export class UserFormComponent implements OnInit {
  // Usuario a editar (o null para registrar nuevo)
  @Input() userToEdit: User | null = null;
  // Evento emitido al cerrar el modal
  @Output() close = new EventEmitter<void>();
  // Evento emitido cuando se guarda el usuario exitosamente
  @Output() saved = new EventEmitter<User>();

  // Campos vinculados al formulario
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  password: string = '';
  rol: UserRole = 'Lider';
  telefono: string = '';
  estado: boolean = true;

  // Estado del proceso de envío
  isSubmitting: boolean = false;
  // Mensaje de error para alertas
  errorMessage: string | null = null;

  // Propiedad computada que indica si estamos en modo edición
  get isEditing(): boolean {
    return this.userToEdit !== null;
  }

  // Inyecta el servicio de autenticación y detección de cambios
  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  // Inicializa los campos del formulario con los datos del usuario si es edición
  ngOnInit(): void {
    if (this.userToEdit) {
      this.nombre = this.userToEdit.nombre || this.userToEdit.name.split(' ')[0] || '';
      this.apellido = this.userToEdit.apellido || this.userToEdit.name.split(' ').slice(1).join(' ') || '';
      this.correo = this.userToEdit.correo || this.userToEdit.email || '';
      this.rol = this.userToEdit.rol || this.userToEdit.role || 'Lider';
      this.telefono = this.userToEdit.telefono || '';
      this.estado = this.userToEdit.estado !== undefined ? this.userToEdit.estado : true;
    }
  }

  // Emite el evento para cerrar el modal
  onClose(): void {
    this.close.emit();
  }

  // Envía el formulario para crear o actualizar el usuario
  onSubmit(): void {
    if (!this.nombre.trim() || !this.apellido.trim() || !this.correo.trim()) {
      this.errorMessage = 'Nombre, apellido y correo son campos obligatorios.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    if (this.isEditing && this.userToEdit) {
      const updateData: UpdateUserRequest = {
        nombre: this.nombre.trim(),
        apellido: this.apellido.trim(),
        correo: this.correo.trim(),
        rol: this.rol,
        telefono: this.telefono.trim(),
        estado: this.estado
      };

      if (this.password && this.password.trim() !== '') {
        updateData.password = this.password.trim();
      }

      const userId = this.userToEdit.id_usuario || Number(this.userToEdit.id);
      this.authService.updateUser(userId, updateData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.saved.emit(res.user);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Error al actualizar usuario.';
          this.cdr.markForCheck();
        }
      });
    } else {
      const createData: CreateUserRequest = {
        nombre: this.nombre.trim(),
        apellido: this.apellido.trim(),
        correo: this.correo.trim(),
        password: this.password.trim() || 'Unite2026*',
        rol: this.rol,
        telefono: this.telefono.trim(),
        estado: this.estado
      };

      this.authService.createUser(createData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.saved.emit(res.user);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.error || 'Error al registrar usuario.';
          this.cdr.markForCheck();
        }
      });
    }
  }
}
