// Importa la función Router de Express
import { Router } from 'express';
// Importa el controlador de psicología
import { PsychologyController } from '../controller/PsychologyController';

// Función constructora que define y retorna las rutas del módulo de psicología
export function createPsychologyRoutes(controller: PsychologyController): Router {
  // Instancia un nuevo enrutador de Express
  const router = Router();

  // Ruta pública para que cualquier estudiante agende una cita
  router.post('/psychology/book', controller.bookMeeting);

  // Ruta pública para consultar la lista de profesionales de psicología disponibles
  router.get('/psychology/professionals', controller.getProfessionals);

  // Ruta para consultar estadísticas de atención psicológica
  router.get('/psychology/stats', controller.getStats);

  // Ruta para listar todas las citas de psicología (con filtros por estado, fecha, buscador)
  router.get('/psychology/meetings', controller.getMeetings);

  // Ruta para consultar una cita específica por su identificador
  router.get('/psychology/meetings/:id', controller.getMeetingById);

  // Ruta para actualizar el estado, asignación u observaciones de una cita
  router.put('/psychology/meetings/:id', controller.updateMeeting);

  // Ruta para cancelar o eliminar una cita
  router.delete('/psychology/meetings/:id', controller.deleteMeeting);

  // Retorna el router configurado
  return router;
}
