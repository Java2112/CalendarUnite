// Importa el puerto de eventos del dominio
import { EventPort } from '../../../domain/EventPort';
// Importa el tipo de rol y reglas de negocio del dominio de usuarios
import { UserRole, UserDomainRule } from '../../../domain/User';

// Caso de uso para eliminar un evento con validación de propiedad/rol
export class DeleteEventUseCase {
  // Inyecta el puerto de persistencia de eventos
  constructor(private eventPort: EventPort) {}

  // Ejecuta la eliminación del evento verificando permisos
  async execute(
    eventId: number,
    currentUser: { id_usuario: number; rol: UserRole }
  ): Promise<boolean> {
    // Busca si el evento a eliminar existe en la base de datos
    const existing = await this.eventPort.findById(eventId);
    // Si no existe, lanza error 404
    if (!existing) {
      const err: any = new Error('El evento solicitado no existe.');
      err.status = 404;
      throw err;
    }

    // Valida si el usuario actual es admin o el responsable del evento
    const canManage = UserDomainRule.isAuthorizedToManageEvent(currentUser, existing);
    // Si no tiene permisos, lanza error 403 Forbidden
    if (!canManage) {
      const err: any = new Error(
        'Acceso denegado: No tienes autorización para eliminar este evento. Solo el usuario responsable o un Administrador pueden eliminarlo.'
      );
      err.status = 403;
      throw err;
    }

    // Ejecuta la eliminación física/lógica a través del puerto
    return this.eventPort.delete(eventId);
  }
}
