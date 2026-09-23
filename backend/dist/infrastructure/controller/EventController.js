"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const user_validation_1 = require("../../util/user-validation");
class EventController {
    eventApp;
    constructor(eventApp) {
        this.eventApp = eventApp;
    }
    getAll = async (req, res) => {
        try {
            const { modality, search } = req.query;
            const events = await this.eventApp.getEvents(modality ? String(modality) : undefined, search ? String(search) : undefined);
            return res.json(events);
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
    getById = async (req, res) => {
        try {
            const { id } = req.params;
            const event = await this.eventApp.getEventById(id);
            if (!event) {
                return res.status(404).json({ error: 'Evento no encontrado' });
            }
            return res.json(event);
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
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
            const result = await this.eventApp.registerAttendee(id, nombre, correo, telefono);
            return res.status(201).json({
                message: 'Inscripción realizada con éxito. Se ha registrado tu cupo.',
                attendee: result.attendee,
                updatedAvailableSpots: result.updatedAvailableSpots
            });
        }
        catch (error) {
            const errorMessage = error.message || 'Error al procesar la inscripción';
            if (errorMessage.includes('no existe') ||
                errorMessage.includes('no quedan cupos') ||
                errorMessage.includes('ya se encuentra registrado')) {
                const statusCode = errorMessage.includes('no existe') ? 404 : 400;
                return res.status(statusCode).json({ error: errorMessage });
            }
            return res.status(500).json({ error: errorMessage });
        }
    };
    getStats = async (req, res) => {
        try {
            const stats = await this.eventApp.getStats();
            return res.json(stats);
        }
        catch (error) {
            return res.status(500).json({ error: error.message || 'Error interno del servidor' });
        }
    };
}
exports.EventController = EventController;
