import express, { Application } from 'express';
import cors from 'cors';

import { UserAdapter } from './infrastructure/adapter/UserAdapter';
import { UserApplication } from './application/UserApplication';
import { UserController } from './infrastructure/controller/UserController';
import { createUserRoutes } from './infrastructure/routes/UserRoutes';

import { EventAdapter } from './infrastructure/adapter/EventAdapter';
import { EventApplication } from './application/EventApplication';
import { EventController } from './infrastructure/controller/EventController';
import { createEventRoutes } from './infrastructure/routes/EventRoutes';

export function createApp(): Application {
  const app: Application = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Instanciación de Capas (Inyección de Dependencias)
  const userAdapter = new UserAdapter();
  const userApp = new UserApplication(userAdapter);
  const userController = new UserController(userApp);

  const eventAdapter = new EventAdapter();
  const eventApp = new EventApplication(eventAdapter);
  const eventController = new EventController(eventApp);

  // Registro de Rutas
  app.use('/api/auth', createUserRoutes(userController));
  app.use('/api', createEventRoutes(eventController));

  return app;
}
