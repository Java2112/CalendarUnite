"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Adaptadores de Infraestructura (Secundarios)
const UserAdapter_1 = require("./infrastructure/adapter/UserAdapter");
const PlaceAdapter_1 = require("./infrastructure/adapter/PlaceAdapter");
const AttachmentAdapter_1 = require("./infrastructure/adapter/AttachmentAdapter");
const EventAdapter_1 = require("./infrastructure/adapter/EventAdapter");
// Casos de Uso - Eventos
const GetEventsUseCase_1 = require("./application/use-cases/events/GetEventsUseCase");
const GetEventByIdUseCase_1 = require("./application/use-cases/events/GetEventByIdUseCase");
const CreateEventUseCase_1 = require("./application/use-cases/events/CreateEventUseCase");
const UpdateEventUseCase_1 = require("./application/use-cases/events/UpdateEventUseCase");
const DeleteEventUseCase_1 = require("./application/use-cases/events/DeleteEventUseCase");
// Casos de Uso - Usuarios
const ListUsersUseCase_1 = require("./application/use-cases/users/ListUsersUseCase");
const CreateUserUseCase_1 = require("./application/use-cases/users/CreateUserUseCase");
const UpdateUserUseCase_1 = require("./application/use-cases/users/UpdateUserUseCase");
const ToggleUserStatusUseCase_1 = require("./application/use-cases/users/ToggleUserStatusUseCase");
// Casos de Uso - Lugares
const GetPlacesUseCase_1 = require("./application/use-cases/places/GetPlacesUseCase");
// Controladores (Primarios)
const UserController_1 = require("./infrastructure/controller/UserController");
const EventController_1 = require("./infrastructure/controller/EventController");
const PlaceController_1 = require("./infrastructure/controller/PlaceController");
// Creadores de Rutas
const UserRoutes_1 = require("./infrastructure/routes/UserRoutes");
const EventRoutes_1 = require("./infrastructure/routes/EventRoutes");
const PlaceRoutes_1 = require("./infrastructure/routes/PlaceRoutes");
function createApp() {
    const app = (0, express_1.default)();
    // Middlewares globales
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Inyección de Dependencias (Hexagonal Architecture)
    const userAdapter = new UserAdapter_1.UserAdapter();
    const placeAdapter = new PlaceAdapter_1.PlaceAdapter();
    const attachmentAdapter = new AttachmentAdapter_1.AttachmentAdapter();
    const eventAdapter = new EventAdapter_1.EventAdapter(placeAdapter, userAdapter, attachmentAdapter);
    // Casos de Uso - Eventos
    const getEventsUseCase = new GetEventsUseCase_1.GetEventsUseCase(eventAdapter);
    const getEventByIdUseCase = new GetEventByIdUseCase_1.GetEventByIdUseCase(eventAdapter);
    const createEventUseCase = new CreateEventUseCase_1.CreateEventUseCase(eventAdapter);
    const updateEventUseCase = new UpdateEventUseCase_1.UpdateEventUseCase(eventAdapter);
    const deleteEventUseCase = new DeleteEventUseCase_1.DeleteEventUseCase(eventAdapter);
    // Casos de Uso - Usuarios
    const listUsersUseCase = new ListUsersUseCase_1.ListUsersUseCase(userAdapter);
    const createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(userAdapter);
    const updateUserUseCase = new UpdateUserUseCase_1.UpdateUserUseCase(userAdapter);
    const toggleUserStatusUseCase = new ToggleUserStatusUseCase_1.ToggleUserStatusUseCase(userAdapter);
    // Casos de Uso - Lugares
    const getPlacesUseCase = new GetPlacesUseCase_1.GetPlacesUseCase(placeAdapter);
    // Controladores
    const userController = new UserController_1.UserController(userAdapter, listUsersUseCase, createUserUseCase, updateUserUseCase, toggleUserStatusUseCase);
    const eventController = new EventController_1.EventController(eventAdapter, getEventsUseCase, getEventByIdUseCase, createEventUseCase, updateEventUseCase, deleteEventUseCase);
    const placeController = new PlaceController_1.PlaceController(getPlacesUseCase);
    // Montaje de Rutas
    app.use('/api/auth', (0, UserRoutes_1.createUserRoutes)(userController));
    app.use('/api', (0, UserRoutes_1.createUserRoutes)(userController));
    app.use('/api', (0, EventRoutes_1.createEventRoutes)(eventController));
    app.use('/api', (0, PlaceRoutes_1.createPlaceRoutes)(placeController));
    return app;
}
