// Importa el tipo Routes para definir las rutas de navegación de Angular
import { Routes } from '@angular/router';
// Importa el componente de la vista pública de recursos
import { ResourcesComponent } from './components/resources/resources';
// Importa el componente del cronograma y calendario de actividades
import { CalendarComponent } from './components/calendar/calendar';

// Exporta la lista de rutas configuradas para la navegación pública de la aplicación
export const routes: Routes = [
  // Ruta pública del módulo de Recursos para Estudiantes (libre acceso sin autenticación)
  { path: 'recursos', component: ResourcesComponent },
  { path: 'resources', component: ResourcesComponent },
  // Ruta pública del Cronograma de Actividades
  { path: 'cronograma', component: CalendarComponent },
  // Ruta raíz redirige por defecto al cronograma de actividades
  { path: '', redirectTo: 'cronograma', pathMatch: 'full' }
];
