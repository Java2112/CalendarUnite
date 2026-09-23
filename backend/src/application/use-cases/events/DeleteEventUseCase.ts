import { EventPort } from '../../../domain/EventPort';
import { UserRole, UserDomainRule } from '../../../domain/User';

export class DeleteEventUseCase {
  constructor(private eventPort: EventPort) {}

  async execute(
    eventId: number,
    currentUser: { id_usuario: number; rol: UserRole }
  ): Promise<boolean> {
    const existing = await this.eventPort.findById(eventId);
    if (!existing) {
      const err: any = new Error('El evento solicitado no existe.');
      err.status = 404;
      throw err;
    }

    const canManage = UserDomainRule.isAuthorizedToManageEvent(currentUser, existing);
    if (!canManage) {
      const err: any = new Error(
        'Acceso denegado: No tienes autorización para eliminar este evento. Solo el usuario responsable o un Administrador pueden eliminarlo.'
      );
      err.status = 403;
      throw err;
    }

    return this.eventPort.delete(eventId);
  }
}
