// Importa la función para inicializar la aplicación Angular standalone
import { bootstrapApplication } from '@angular/platform-browser';
// Importa la configuración global de la aplicación
import { appConfig } from './app/app.config';
// Importa el componente raíz principal de la aplicación
import { App } from './app/app';

// Inicializa y arranca la aplicación Angular montando el componente raíz con sus proveedores
bootstrapApplication(App, appConfig)
  // Captura e imprime en la consola cualquier error ocurrido durante el arranque
  .catch((err) => console.error(err));
