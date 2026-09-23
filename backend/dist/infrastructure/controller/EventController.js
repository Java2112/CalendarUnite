"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const user_validation_1 = require("../../util/user-validation");
class EventController {
    eventPort;
    getEventsUseCase;
    getEventByIdUseCase;
    createEventUseCase;
    updateEventUseCase;
    deleteEventUseCase;
    constructor(eventPort, getEventsUseCase, getEventByIdUseCase, createEventUseCase, updateEventUseCase, deleteEventUseCase) {
        this.eventPort = eventPort;
        this.getEventsUseCase = getEventsUseCase;
        this.getEventByIdUseCase = getEventByIdUseCase;
        this.createEventUseCase = createEventUseCase;
        this.updateEventUseCase = updateEventUseCase;
        this.deleteEventUseCase = deleteEventUseCase;
    }
    getAll = async (req, res) => {
        try {
            const { modality, search } = req.query;
            const events = await this.getEventsUseCase.execute(modality ? String(modality) : undefined, search ? String(search) : undefined);
            return res.json(events);
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
    getById = async (req, res) => {
        try {
            const { id } = req.params;
            const event = await this.getEventByIdUseCase.execute(id);
            if (!event) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }
            return res.json(event);
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
    create = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado. Inicia sesión para crear eventos.' });
            }
            const createdEvent = await this.createEventUseCase.execute(req.body, req.user);
            return res.status(201).json({
                message: 'Evento creado exitosamente en el cronograma institucional.',
                event: createdEvent
            });
        }
        catch (error) {
            const status = error.status || 400;
            return res.status(status).json({ error: error.message || 'Error al crear el evento' });
        }
    };
    update = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado. Inicia sesión para modificar eventos.' });
            }
            const { id } = req.params;
            const eventIdNum = Number(id.replace('evt-', ''));
            const updatedEvent = await this.updateEventUseCase.execute(eventIdNum, req.body, req.user);
            return res.json({
                message: 'Evento actualizado exitosamente.',
                event: updatedEvent
            });
        }
        catch (error) {
            const status = error.status || 400;
            return res.status(status).json({ error: error.message || 'Error al actualizar el evento' });
        }
    };
    delete = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'No autenticado. Inicia sesión para eliminar eventos.' });
            }
            const { id } = req.params;
            const eventIdNum = Number(id.replace('evt-', ''));
            const success = await this.deleteEventUseCase.execute(eventIdNum, req.user);
            if (!success) {
                return res.status(404).json({ error: 'No se pudo eliminar el evento.' });
            }
            return res.json({ message: 'Evento eliminado correctamente del sistema.' });
        }
        catch (error) {
            const status = error.status || 400;
            return res.status(status).json({ error: error.message || 'Error al eliminar el evento' });
        }
    };
    register = async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, correo, telefono } = req.body;
            const validationError = (0, user_validation_1.validateRegisterInput)({ nombre, correo, telefono });
            if (validationError) {
                return res.status(400).json({ error: validationError });
            }
            const event = await this.eventPort.findById(id);
            if (!event) {
                return res.status(404).json({ error: 'El evento especificado no existe.' });
            }
            const currentSpots = event.availableSpots !== undefined ? event.availableSpots : (event.totalSpots || 0);
            if (currentSpots <= 0) {
                return res.status(400).json({ error: 'No quedan cupos disponibles para este evento.' });
            }
            const existing = await this.eventPort.findAttendeeByEventAndEmail(id, correo.trim());
            if (existing) {
                return res.status(400).json({ error: 'Este correo electrónico ya se encuentra registrado en este evento.' });
            }
            const updatedSpots = currentSpots - 1;
            await this.eventPort.updateAvailableSpots(id, updatedSpots);
            const savedAttendee = await this.eventPort.saveAttendee({
                id: `att-${Date.now()}`,
                eventId: id,
                nombre: nombre.trim(),
                correo: correo.trim(),
                telefono: telefono.trim(),
                registeredAt: new Date().toISOString()
            });
            return res.status(201).json({
                message: 'Inscripción realizada con éxito. Se ha registrado tu cupo.',
                attendee: savedAttendee,
                updatedAvailableSpots: updatedSpots
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error al procesar la inscripción' });
        }
    };
    getStats = async (req, res) => {
        try {
            const stats = await this.eventPort.getStats();
            return res.json(stats);
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
}
exports.EventController = EventController;
