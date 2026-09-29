import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Inicializa y arranca la aplicación Angular montando el componente raíz con sus proveedores
bootstrapApplication(App, appConfig)
  // Captura e imprime en la consola cualquier error ocurrido durante el arranque
  .catch((err) => console.error(err));
