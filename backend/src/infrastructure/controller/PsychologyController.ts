// Importa los tipos Request y Response de Express
import { Request, Response } from 'express';
// Importa los casos de uso del módulo de psicología
import { GetPsychologyMeetingsUseCase } from '../../application/use-cases/psychology/GetPsychologyMeetingsUseCase';
import { GetPsychologyMeetingByIdUseCase } from '../../application/use-cases/psychology/GetPsychologyMeetingByIdUseCase';
import { BookPsychologyMeetingUseCase } from '../../application/use-cases/psychology/BookPsychologyMeetingUseCase';
import { UpdatePsychologyMeetingUseCase } from '../../application/use-cases/psychology/UpdatePsychologyMeetingUseCase';
import { DeletePsychologyMeetingUseCase } from '../../application/use-cases/psychology/DeletePsychologyMeetingUseCase';
import { GetPsychologistsUseCase } from '../../application/use-cases/psychology/GetPsychologistsUseCase';

// Controlador HTTP para gestionar los endpoints de atención psicológica
export class PsychologyController {
  // Inyecta los casos de uso necesarios en el constructor
  constructor(
    private getMeetingsUseCase: GetPsychologyMeetingsUseCase,
    private getMeetingByIdUseCase: GetPsychologyMeetingByIdUseCase,
    private bookMeetingUseCase: BookPsychologyMeetingUseCase,
    private updateMeetingUseCase: UpdatePsychologyMeetingUseCase,
    private deleteMeetingUseCase: DeletePsychologyMeetingUseCase,
    private getPsychologistsUseCase: GetPsychologistsUseCase
  ) {}

  // Manejador HTTP para obtener la lista de citas con filtros
  getMeetings = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, date, search } = req.query;
      const meetings = await this.getMeetingsUseCase.execute({
        status: status ? String(status) : undefined,
        date: date ? String(date) : undefined,
        search: search ? String(search) : undefined
      });
      res.status(200).json({ success: true, data: meetings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error al obtener citas.' });
    }
  };

  // Manejador HTTP para obtener una cita específica por su ID
  getMeetingById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const meeting = await this.getMeetingByIdUseCase.execute(id);
      if (!meeting) {
        res.status(404).json({ success: false, message: 'Cita no encontrada.' });
        return;
      }
      res.status(200).json({ success: true, data: meeting });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error al consultar la cita.' });
    }
  };

  // Manejador HTTP para que un estudiante agende una cita
  bookMeeting = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        studentName,
        studentEmail,
        studentPhone,
        studentProgram,
        studentCode,
        reason,
        date,
        startHour,
        endHour,
        modality,
        professionalName
      } = req.body;

      const newMeeting = await this.bookMeetingUseCase.execute({
        studentName,
        studentEmail,
        studentPhone,
        studentProgram: studentProgram || studentCode || '',
        reason,
        date,
        startHour: startHour || '09:00',
        endHour: endHour || '10:00',
        modality: modality || 'Presencial',
        professionalName: professionalName || 'Dra. Laura Camila Mendoza',
        linkMeeting: '',
        status: 'Pendiente',
        observations: ''
      });

      res.status(201).json({
        success: true,
        message: '¡Tu solicitud de cita psicológica ha sido agendada con éxito! El área de Bienestar se contactará contigo.',
        data: newMeeting
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Error al agendar la cita.' });
    }
  };

  // Manejador HTTP para actualizar el estado, enlaces u observaciones de una cita
  updateMeeting = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updated = await this.updateMeetingUseCase.execute(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Cita de psicología actualizada correctamente.',
        data: updated
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Error al actualizar la cita.' });
    }
  };

  // Manejador HTTP para cancelar o eliminar una cita
  deleteMeeting = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.deleteMeetingUseCase.execute(id);
      if (!success) {
        res.status(404).json({ success: false, message: 'La cita no pudo ser eliminada o no existe.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Cita eliminada correctamente.' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error al eliminar la cita.' });
    }
  };

  // Manejador HTTP para obtener la lista de psicólogos disponibles
  getProfessionals = async (req: Request, res: Response): Promise<void> => {
    try {
      const professionals = await this.getPsychologistsUseCase.execute();
      res.status(200).json({ success: true, data: professionals });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error al obtener profesionales.' });
    }
  };

  // Manejador HTTP para estadísticas del módulo de psicología
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const meetings = await this.getMeetingsUseCase.execute();
      const total = meetings.length;
      const pendientes = meetings.filter(m => m.status === 'Pendiente').length;
      const confirmadas = meetings.filter(m => m.status === 'Confirmada').length;
      const completadas = meetings.filter(m => m.status === 'Completada').length;
      const canceladas = meetings.filter(m => m.status === 'Cancelada').length;

      res.status(200).json({
        success: true,
        data: {
          total,
          pendientes,
          confirmadas,
          completadas,
          canceladas
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Error al calcular estadísticas.' });
    }
  };
}
