"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
// Importa express y el tipo Application
const express_1 = __importDefault(require("express"));
// Importa middleware cors para permitir peticiones cross-origin
const cors_1 = __importDefault(require("cors"));
// Importa las variables de entorno validadas
const environment_vars_1 = __importDefault(require("../config/environment-vars"));
// Importa el adaptador de usuarios para PostgreSQL
const UserAdapter_1 = require("../adapter/UserAdapter");
// Importa el adaptador de lugares para PostgreSQL
const PlaceAdapter_1 = require("../adapter/PlaceAdapter");
// Importa el adaptador de archivos adjuntos
const AttachmentAdapter_1 = require("../adapter/AttachmentAdapter");
// Importa el adaptador de eventos para PostgreSQL
const EventAdapter_1 = require("../adapter/EventAdapter");
// Importa el adaptador de recursos públicos
const ResourceAdapter_1 = require("../adapter/ResourceAdapter");
// Importa el caso de uso para obtener todos los eventos
const GetEventsUseCase_1 = require("../../application/use-cases/events/GetEventsUseCase");
// Importa el caso de uso para consultar un evento por ID
const GetEventByIdUseCase_1 = require("../../application/use-cases/events/GetEventByIdUseCase");
// Importa el caso de uso para crear eventos
const CreateEventUseCase_1 = require("../../application/use-cases/events/CreateEventUseCase");
// Importa el caso de uso para actualizar eventos
const UpdateEventUseCase_1 = require("../../application/use-cases/events/UpdateEventUseCase");
// Importa el caso de uso para eliminar eventos
const DeleteEventUseCase_1 = require("../../application/use-cases/events/DeleteEventUseCase");
// Importa el caso de uso para listar usuarios
const ListUsersUseCase_1 = require("../../application/use-cases/users/ListUsersUseCase");
// Importa el caso de uso para registrar usuarios
const CreateUserUseCase_1 = require("../../application/use-cases/users/CreateUserUseCase");
// Importa el caso de uso para actualizar usuarios
const UpdateUserUseCase_1 = require("../../application/use-cases/users/UpdateUserUseCase");
// Importa el caso de uso para cambiar estado de usuario
const ToggleUserStatusUseCase_1 = require("../../application/use-cases/users/ToggleUserStatusUseCase");
const path_1 = __importDefault(require("path"));
// Importa el caso de uso para consultar lugares
const GetPlacesUseCase_1 = require("../../application/use-cases/places/GetPlacesUseCase");
// Importa el caso de uso para consultar recursos públicos
const GetResourcesUseCase_1 = require("../../application/use-cases/resources/GetResourcesUseCase");
// Importa el caso de uso para crear recursos públicos
const CreateResourceUseCase_1 = require("../../application/use-cases/resources/CreateResourceUseCase");
// Importa el controlador HTTP de usuarios
const UserController_1 = require("../controller/UserController");
// Importa el controlador HTTP de eventos
const EventController_1 = require("../controller/EventController");
// Importa el controlador HTTP de lugares
const PlaceController_1 = require("../controller/PlaceController");
// Importa el controlador HTTP de recursos públicos
const ResourceController_1 = require("../controller/ResourceController");
// Importa la función constructora de rutas de usuarios
const UserRoutes_1 = require("../routes/UserRoutes");
// Importa la función constructora de rutas de eventos
const EventRoutes_1 = require("../routes/EventRoutes");
// Importa la función constructora de rutas de lugares
const PlaceRoutes_1 = require("../routes/PlaceRoutes");
// Importa la función constructora de rutas de recursos públicos
const ResourceRoutes_1 = require("../routes/ResourceRoutes");
// Función principal que ensambla y configura la aplicación Express
function createApp() {
    // Crea la instancia de la aplicación Express
    const app = (0, express_1.default)();
    // Configura el middleware CORS con origen permitido y credenciales
    app.use((0, cors_1.default)({
        origin: environment_vars_1.default.CORS_ORIGIN || '*',
        credentials: true
    }));
    // Configura el parser para interpretar cuerpos de petición en formato JSON
    app.use(express_1.default.json());
    // Sirve la carpeta de archivos subidos localmente de forma estática
    app.use('/uploads', express_1.default.static(path_1.default.resolve(process.cwd(), 'uploads')));
    // Instancia el adaptador de persistencia de usuarios
    const userAdapter = new UserAdapter_1.UserAdapter();
    // Instancia el adaptador de persistencia de lugares
    const placeAdapter = new PlaceAdapter_1.PlaceAdapter();
    // Instancia el adaptador de archivos adjuntos
    const attachmentAdapter = new AttachmentAdapter_1.AttachmentAdapter();
    // Instancia el adaptador de eventos con sus dependencias
    const eventAdapter = new EventAdapter_1.EventAdapter(placeAdapter, userAdapter, attachmentAdapter);
    // Instancia el adaptador de recursos públicos
    const resourceAdapter = new ResourceAdapter_1.ResourceAdapter();
    // Instancia el caso de uso de obtención de eventos
    const getEventsUseCase = new GetEventsUseCase_1.GetEventsUseCase(eventAdapter);
    // Instancia el caso de uso de consulta de evento por ID
    const getEventByIdUseCase = new GetEventByIdUseCase_1.GetEventByIdUseCase(eventAdapter);
    // Instancia el caso de uso de creación de eventos
    const createEventUseCase = new CreateEventUseCase_1.CreateEventUseCase(eventAdapter);
    // Instancia el caso de uso de actualización de eventos
    const updateEventUseCase = new UpdateEventUseCase_1.UpdateEventUseCase(eventAdapter);
    // Instancia el caso de uso de eliminación de eventos
    const deleteEventUseCase = new DeleteEventUseCase_1.DeleteEventUseCase(eventAdapter);
    // Instancia el caso de uso de listado de usuarios
    const listUsersUseCase = new ListUsersUseCase_1.ListUsersUseCase(userAdapter);
    // Instancia el caso de uso de creación de usuarios
    const createUserUseCase = new CreateUserUseCase_1.CreateUserUseCase(userAdapter);
    // Instancia el caso de uso de actualización de usuarios
    const updateUserUseCase = new UpdateUserUseCase_1.UpdateUserUseCase(userAdapter);
    // Instancia el caso de uso de alternar estado de usuario
    const toggleUserStatusUseCase = new ToggleUserStatusUseCase_1.ToggleUserStatusUseCase(userAdapter);
    // Instancia el caso de uso para listar lugares
    const getPlacesUseCase = new GetPlacesUseCase_1.GetPlacesUseCase(placeAdapter);
    // Instancia el caso de uso para consultar recursos públicos
    const getResourcesUseCase = new GetResourcesUseCase_1.GetResourcesUseCase(resourceAdapter);
    // Instancia el caso de uso para crear y subir recursos públicos
    const createResourceUseCase = new CreateResourceUseCase_1.CreateResourceUseCase(resourceAdapter);
    // Instancia el controlador de usuarios con sus casos de uso
    const userController = new UserController_1.UserController(userAdapter, listUsersUseCase, createUserUseCase, updateUserUseCase, toggleUserStatusUseCase);
    // Instancia el controlador de eventos con sus casos de uso
    const eventController = new EventController_1.EventController(eventAdapter, getEventsUseCase, getEventByIdUseCase, createEventUseCase, updateEventUseCase, deleteEventUseCase);
    // Instancia el controlador de lugares con su caso de uso
    const placeController = new PlaceController_1.PlaceController(getPlacesUseCase);
    // Instancia el controlador de recursos públicos con sus casos de uso
    const resourceController = new ResourceController_1.ResourceController(getResourcesUseCase, createResourceUseCase);
    // Registra las rutas de autenticación bajo /api/auth
    app.use('/api/auth', (0, UserRoutes_1.createUserRoutes)(userController));
    // Registra las rutas de gestión de usuarios bajo /api
    app.use('/api', (0, UserRoutes_1.createUserRoutes)(userController));
    // Registra las rutas de eventos bajo /api
    app.use('/api', (0, EventRoutes_1.createEventRoutes)(eventController));
    // Registra las rutas de catálogo de lugares bajo /api
    app.use('/api', (0, PlaceRoutes_1.createPlaceRoutes)(placeController));
    // Registra las rutas de recursos públicos bajo /api
    app.use('/api', (0, ResourceRoutes_1.createResourceRoutes)(resourceController));
    // Ruta de comprobación de salud del servicio backend
    app.get('/api/health', (req, res) => {
        // Retorna estado OK, hora actual y nombre del servicio
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'CalendarUnite Backend'
        });
    });
    // Retorna la aplicación completamente configurada
    return app;
}
