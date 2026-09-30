"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
// Importa la función de validación de datos de inscripción
const user_validation_1 = require("../../util/user-validation");
// Controlador HTTP para gestionar las peticiones de eventos y actividades
class EventController {
    eventPort;
    getEventsUseCase;
    getEventByIdUseCase;
    createEventUseCase;
    updateEventUseCase;
    deleteEventUseCase;
    // Inyecta el puerto y los casos de uso necesarios
    constructor(eventPort, getEventsUseCase, getEventByIdUseCase, createEventUseCase, updateEventUseCase, deleteEventUseCase) {
        this.eventPort = eventPort;
        this.getEventsUseCase = getEventsUseCase;
        this.getEventByIdUseCase = getEventByIdUseCase;
        this.createEventUseCase = createEventUseCase;
        this.updateEventUseCase = updateEventUseCase;
        this.deleteEventUseCase = deleteEventUseCase;
    }
    // Manejador GET para listar eventos con filtros de modalidad y búsqueda
    getAll = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Extrae los parámetros de consulta modality y search
            const { modality, search } = req.query;
            // Ejecuta el caso de uso para obtener los eventos
            const events = await this.getEventsUseCase.execute(modality ? String(modality) : undefined, search ? String(search) : undefined);
            // Retorna los eventos en formato JSON
            return res.json(events);
        }
        catch (error) {
            // Retorna error 500 en caso de fallo
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
    // Manejador GET para consultar el detalle de un evento por su ID
    getById = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Extrae el ID de los parámetros de la URL
            const { id } = req.params;
            // Ejecuta el caso de uso para buscar el evento
            const event = await this.getEventByIdUseCase.execute(id);
            // Si no existe, retorna 404
            if (!event) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }
            // Retorna el evento encontrado
            return res.json(event);
        }
        catch (error) {
            // Retorna error 500 si falla la consulta
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
    // Manejador POST para registrar una nueva actividad
    create = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Valida que el usuario esté autenticado
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado. Inicia sesión para crear eventos.' });
            }
            // Ejecuta el caso de uso de creación con el cuerpo de la petición y usuario actual
            const createdEvent = await this.createEventUseCase.execute(req.body, req.user);
            // Retorna respuesta 201 Created con el evento generado
            return res.status(201).json({
                message: 'Evento creado exitosamente en el cronograma institucional.',
                event: createdEvent
            });
        }
        catch (error) {
            // Obtiene el código de estado del error o 400 por defecto
            const status = error.status || 400;
            // Retorna la respuesta de error correspondiente
            return res.status(status).json({ error: error.message || 'Error al crear el evento' });
        }
    };
    // Manejador PUT para actualizar los datos de un evento existente
    update = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Valida autenticación del usuario
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado. Inicia sesión para modificar eventos.' });
            }
            // Extrae el ID de la URL
            const { id } = req.params;
            // Normaliza el ID a formato numérico
            const eventIdNum = Number(id.replace('evt-', ''));
            // Ejecuta el caso de uso de actualización
            const updatedEvent = await this.updateEventUseCase.execute(eventIdNum, req.body, req.user);
            // Retorna respuesta 200 con el evento modificado
            return res.json({
                message: 'Evento actualizado exitosamente.',
                event: updatedEvent
            });
        }
        catch (error) {
            // Obtiene el código de error o 400 por defecto
            const status = error.status || 400;
            // Retorna respuesta de error
            return res.status(status).json({ error: error.message || 'Error al actualizar el evento' });
        }
    };
    // Manejador DELETE para remover un evento del sistema
    delete = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Valida autenticación del usuario
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado. Inicia sesión para eliminar eventos.' });
            }
            // Extrae el ID de la URL
            const { id } = req.params;
            // Convierte el ID a número
            const eventIdNum = Number(id.replace('evt-', ''));
            // Ejecuta el caso de uso de eliminación
            const success = await this.deleteEventUseCase.execute(eventIdNum, req.user);
            // Si no se pudo eliminar retorna 404
            if (!success) {
                return res.status(404).json({ error: 'No se pudo eliminar el evento.' });
            }
            // Retorna mensaje de confirmación
            return res.json({ message: 'Evento eliminado correctamente del sistema.' });
        }
        catch (error) {
            // Obtiene el código de error
            const status = error.status || 400;
            // Retorna el error al cliente
            return res.status(status).json({ error: error.message || 'Error al eliminar el evento' });
        }
    };
    // Manejador POST para inscribir a un estudiante en una actividad
    register = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Extrae el ID del evento
            const { id } = req.params;
            // Extrae los datos del formulario de inscripción
            const { nombre, correo, telefono } = req.body;
            // Valida los datos requeridos del formulario
            const validationError = (0, user_validation_1.validateRegisterInput)({ nombre, correo, telefono });
            // Si la validación falla, retorna 400
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }
            // Consulta el evento en la base de datos
            const event = await this.eventPort.findById(id);
            // Si el evento no existe, retorna 404
            if (!event) {
                return res.status(404).json({ error: 'El evento especificado no existe.' });
            }
            // Obtiene los cupos disponibles actuales
            const currentSpots = event.availableSpots !== undefined ? event.availableSpots : (event.totalSpots || 0);
            // Si ya no quedan cupos disponibles, retorna 400
            if (currentSpots <= 0) {
                return res.status(400).json({ error: 'No quedan cupos disponibles para este evento.' });
            }
            // Comprueba si el correo ya está registrado en este evento
            const existing = await this.eventPort.findAttendeeByEventAndEmail(id, correo.trim());
            // Si ya está inscrito, retorna 400
            if (existing) {
                return res.status(400).json({ error: 'Este correo electrónico ya se encuentra registrado en este evento.' });
            }
            // Descuenta un cupo
            const updatedSpots = currentSpots - 1;
            // Actualiza los cupos disponibles en el evento
            await this.eventPort.updateAvailableSpots(id, updatedSpots);
            // Guarda el registro del nuevo asistente
            const savedAttendee = await this.eventPort.saveAttendee({
                id: `att-${Date.now()}`,
                eventId: id,
                nombre: nombre.trim(),
                correo: correo.trim(),
                telefono: telefono.trim(),
                registeredAt: new Date().toISOString()
            });
            // Retorna 201 Created con los datos de confirmación
            return res.status(201).json({
                message: 'Inscripción realizada con éxito. Se ha registrado tu cupo.',
                attendee: savedAttendee,
                updatedAvailableSpots: updatedSpots
            });
        }
        catch (error) {
            // Retorna error 500 en caso de fallo inesperado
            return res.status(500).json({ error: error.message || 'Error al procesar la inscripción' });
        }
    };
    // Manejador GET para consultar las estadísticas globales del cronograma
    getStats = async (req, res) => {
        // Inicia bloque try-catch
        try {
            // Consulta las estadísticas a través del puerto
            const stats = await this.eventPort.getStats();
            // Retorna el resultado en JSON
            return res.json(stats);
        }
        catch (error) {
            // Retorna error 500 en caso de fallo
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
}
exports.EventController = EventController;
