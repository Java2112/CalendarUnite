// Importa los tipos y utilidades de configuración base de Angular
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
// Importa la función proveedora del sistema de enrutamiento
import { provideRouter } from '@angular/router';
// Importa el proveedor del cliente HTTP para comunicación con el backend
import { provideHttpClient } from '@angular/common/http';
// Importa la tabla de rutas configurada para la aplicación
import { routes } from './app.routes';

// Define la configuración global y proveedores de dependencias de la aplicación
export const appConfig: ApplicationConfig = {
  // Arreglo de proveedores de servicios inyectables en toda la aplicación
  providers: [
    // Registra manejadores de errores globales en la ventana del navegador
    provideBrowserGlobalErrorListeners(),
    // Provee e inicializa el enrutador con las rutas especificadas
    provideRouter(routes),
    // Provee el cliente HttpClient para realizar peticiones REST
    provideHttpClient()
  ]
};
