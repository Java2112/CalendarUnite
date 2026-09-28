// Importa express y el tipo Application
import express, { Application } from 'express';
// Importa middleware cors para permitir peticiones cross-origin
import cors from 'cors';
// Importa las variables de entorno validadas
import envs from '../config/environment-vars';

// Importa el adaptador de usuarios para PostgreSQL
import { UserAdapter } from '../adapter/UserAdapter';
// Importa el adaptador de lugares para PostgreSQL
import { PlaceAdapter } from '../adapter/PlaceAdapter';
// Importa el adaptador de archivos adjuntos
import { AttachmentAdapter } from '../adapter/AttachmentAdapter';
// Importa el adaptador de eventos para PostgreSQL
import { EventAdapter } from '../adapter/EventAdapter';

// Importa el caso de uso para obtener todos los eventos
import { GetEventsUseCase } from '../../application/use-cases/events/GetEventsUseCase';
// Importa el caso de uso para consultar un evento por ID
import { GetEventByIdUseCase } from '../../application/use-cases/events/GetEventByIdUseCase';
// Importa el caso de uso para crear eventos
import { CreateEventUseCase } from '../../application/use-cases/events/CreateEventUseCase';
// Importa el caso de uso para actualizar eventos
import { UpdateEventUseCase } from '../../application/use-cases/events/UpdateEventUseCase';
// Importa el caso de uso para eliminar eventos
import { DeleteEventUseCase } from '../../application/use-cases/events/DeleteEventUseCase';

// Importa el caso de uso para listar usuarios
import { ListUsersUseCase } from '../../application/use-cases/users/ListUsersUseCase';
// Importa el caso de uso para registrar usuarios
import { CreateUserUseCase } from '../../application/use-cases/users/CreateUserUseCase';
// Importa el caso de uso para actualizar usuarios
import { UpdateUserUseCase } from '../../application/use-cases/users/UpdateUserUseCase';
// Importa el caso de uso para cambiar estado de usuario
import { ToggleUserStatusUseCase } from '../../application/use-cases/users/ToggleUserStatusUseCase';

// Importa el caso de uso para consultar lugares
import { GetPlacesUseCase } from '../../application/use-cases/places/GetPlacesUseCase';

// Importa el controlador HTTP de usuarios
import { UserController } from '../controller/UserController';
// Importa el controlador HTTP de eventos
import { EventController } from '../controller/EventController';
// Importa el controlador HTTP de lugares
import { PlaceController } from '../controller/PlaceController';

// Importa la función constructora de rutas de usuarios
import { createUserRoutes } from '../routes/UserRoutes';
// Importa la función constructora de rutas de eventos
import { createEventRoutes } from '../routes/EventRoutes';
// Importa la función constructora de rutas de lugares
import { createPlaceRoutes } from '../routes/PlaceRoutes';

// Función principal que ensambla y configura la aplicación Express
export function createApp(): Application {
  // Crea la instancia de la aplicación Express
  const app: Application = express();

  // Configura el middleware CORS con origen permitido y credenciales
  app.use(cors({
    origin: envs.CORS_ORIGIN || '*',
    credentials: true
  }));
  // Configura el parser para interpretar cuerpos de petición en formato JSON
  app.use(express.json());

  // Instancia el adaptador de persistencia de usuarios
  const userAdapter = new UserAdapter();
  // Instancia el adaptador de persistencia de lugares
  const placeAdapter = new PlaceAdapter();
  // Instancia el adaptador de archivos adjuntos
  const attachmentAdapter = new AttachmentAdapter();
  // Instancia el adaptador de eventos con sus dependencias
  const eventAdapter = new EventAdapter(placeAdapter, userAdapter, attachmentAdapter);

  // Instancia el caso de uso de obtención de eventos
  const getEventsUseCase = new GetEventsUseCase(eventAdapter);
  // Instancia el caso de uso de consulta de evento por ID
  const getEventByIdUseCase = new GetEventByIdUseCase(eventAdapter);
  // Instancia el caso de uso de creación de eventos
  const createEventUseCase = new CreateEventUseCase(eventAdapter);
  // Instancia el caso de uso de actualización de eventos
  const updateEventUseCase = new UpdateEventUseCase(eventAdapter);
  // Instancia el caso de uso de eliminación de eventos
  const deleteEventUseCase = new DeleteEventUseCase(eventAdapter);

  // Instancia el caso de uso de listado de usuarios
  const listUsersUseCase = new ListUsersUseCase(userAdapter);
  // Instancia el caso de uso de creación de usuarios
  const createUserUseCase = new CreateUserUseCase(userAdapter);
  // Instancia el caso de uso de actualización de usuarios
  const updateUserUseCase = new UpdateUserUseCase(userAdapter);
  // Instancia el caso de uso de alternar estado de usuario
  const toggleUserStatusUseCase = new ToggleUserStatusUseCase(userAdapter);

  // Instancia el caso de uso para listar lugares
  const getPlacesUseCase = new GetPlacesUseCase(placeAdapter);

  // Instancia el controlador de usuarios con sus casos de uso
  const userController = new UserController(
    userAdapter,
    listUsersUseCase,
    createUserUseCase,
    updateUserUseCase,
    toggleUserStatusUseCase
  );

  // Instancia el controlador de eventos con sus casos de uso
  const eventController = new EventController(
    eventAdapter,
    getEventsUseCase,
    getEventByIdUseCase,
    createEventUseCase,
    updateEventUseCase,
    deleteEventUseCase
  );

  // Instancia el controlador de lugares con su caso de uso
  const placeController = new PlaceController(getPlacesUseCase);

  // Registra las rutas de autenticación bajo /api/auth
  app.use('/api/auth', createUserRoutes(userController));
  // Registra las rutas de gestión de usuarios bajo /api
  app.use('/api', createUserRoutes(userController));
  // Registra las rutas de eventos bajo /api
  app.use('/api', createEventRoutes(eventController));
  // Registra las rutas de catálogo de lugares bajo /api
  app.use('/api', createPlaceRoutes(placeController));

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
