import express, { Application } from 'express';
import cors from 'cors';

// Adaptadores de Infraestructura (Secundarios)
import { UserAdapter } from './infrastructure/adapter/UserAdapter';
import { PlaceAdapter } from './infrastructure/adapter/PlaceAdapter';
import { AttachmentAdapter } from './infrastructure/adapter/AttachmentAdapter';
import { EventAdapter } from './infrastructure/adapter/EventAdapter';

// Casos de Uso - Eventos
import { GetEventsUseCase } from './application/use-cases/events/GetEventsUseCase';
import { GetEventByIdUseCase } from './application/use-cases/events/GetEventByIdUseCase';
import { CreateEventUseCase } from './application/use-cases/events/CreateEventUseCase';
import { UpdateEventUseCase } from './application/use-cases/events/UpdateEventUseCase';
import { DeleteEventUseCase } from './application/use-cases/events/DeleteEventUseCase';

// Casos de Uso - Usuarios
import { ListUsersUseCase } from './application/use-cases/users/ListUsersUseCase';
import { CreateUserUseCase } from './application/use-cases/users/CreateUserUseCase';
import { UpdateUserUseCase } from './application/use-cases/users/UpdateUserUseCase';
import { ToggleUserStatusUseCase } from './application/use-cases/users/ToggleUserStatusUseCase';

// Casos de Uso - Lugares
import { GetPlacesUseCase } from './application/use-cases/places/GetPlacesUseCase';

// Controladores (Primarios)
import { UserController } from './infrastructure/controller/UserController';
import { EventController } from './infrastructure/controller/EventController';
import { PlaceController } from './infrastructure/controller/PlaceController';

// Creadores de Rutas
import { createUserRoutes } from './infrastructure/routes/UserRoutes';
import { createEventRoutes } from './infrastructure/routes/EventRoutes';
import { createPlaceRoutes } from './infrastructure/routes/PlaceRoutes';

export function createApp(): Application {
  const app: Application = express();

  // Middlewares globales
  app.use(cors());
  app.use(express.json());

  // Inyección de Dependencias (Hexagonal Architecture)
  const userAdapter = new UserAdapter();
  const placeAdapter = new PlaceAdapter();
  const attachmentAdapter = new AttachmentAdapter();
  const eventAdapter = new EventAdapter(placeAdapter, userAdapter, attachmentAdapter);

  // Casos de Uso - Eventos
  const getEventsUseCase = new GetEventsUseCase(eventAdapter);
  const getEventByIdUseCase = new GetEventByIdUseCase(eventAdapter);
  const createEventUseCase = new CreateEventUseCase(eventAdapter);
  const updateEventUseCase = new UpdateEventUseCase(eventAdapter);
  const deleteEventUseCase = new DeleteEventUseCase(eventAdapter);

  // Casos de Uso - Usuarios
  const listUsersUseCase = new ListUsersUseCase(userAdapter);
  const createUserUseCase = new CreateUserUseCase(userAdapter);
  const updateUserUseCase = new UpdateUserUseCase(userAdapter);
  const toggleUserStatusUseCase = new ToggleUserStatusUseCase(userAdapter);

  // Casos de Uso - Lugares
  const getPlacesUseCase = new GetPlacesUseCase(placeAdapter);

  // Controladores
  const userController = new UserController(
    userAdapter,
    listUsersUseCase,
    createUserUseCase,
    updateUserUseCase,
    toggleUserStatusUseCase
  );

  const eventController = new EventController(
    eventAdapter,
    getEventsUseCase,
    getEventByIdUseCase,
    createEventUseCase,
    updateEventUseCase,
    deleteEventUseCase
  );

  const placeController = new PlaceController(getPlacesUseCase);

  // Montaje de Rutas
  app.use('/api/auth', createUserRoutes(userController));
  app.use('/api', createUserRoutes(userController));
  app.use('/api', createEventRoutes(eventController));
  app.use('/api', createPlaceRoutes(placeController));

  return app;
}
