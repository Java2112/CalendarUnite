"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UserAdapter_1 = require("./infrastructure/adapter/UserAdapter");
const UserApplication_1 = require("./application/UserApplication");
const UserController_1 = require("./infrastructure/controller/UserController");
const UserRoutes_1 = require("./infrastructure/routes/UserRoutes");
const EventAdapter_1 = require("./infrastructure/adapter/EventAdapter");
const EventApplication_1 = require("./application/EventApplication");
const EventController_1 = require("./infrastructure/controller/EventController");
const EventRoutes_1 = require("./infrastructure/routes/EventRoutes");
function createApp() {
    const app = (0, express_1.default)();
    // Middlewares
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Instanciación de Capas (Inyección de Dependencias)
    const userAdapter = new UserAdapter_1.UserAdapter();
    const userApp = new UserApplication_1.UserApplication(userAdapter);
    const userController = new UserController_1.UserController(userApp);
    const eventAdapter = new EventAdapter_1.EventAdapter();
    const eventApp = new EventApplication_1.EventApplication(eventAdapter);
    const eventController = new EventController_1.EventController(eventApp);
    // Registro de Rutas
    app.use('/api/auth', (0, UserRoutes_1.createUserRoutes)(userController));
    app.use('/api', (0, EventRoutes_1.createEventRoutes)(eventController));
    return app;
}
