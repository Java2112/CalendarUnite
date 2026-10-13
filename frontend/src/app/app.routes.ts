import { Routes } from '@angular/router';
import { ResourcesComponent } from './components/resources/resources';
import { CalendarComponent } from './components/calendar/calendar';
import { PsychologyComponent } from './components/psychology/psychology';

// Exporta la lista de rutas configuradas para la navegación pública de la aplicación
export const routes: Routes = [
  // Ruta pública del módulo de Recursos para Estudiantes (libre acceso sin autenticación)
  { path: 'recursos', component: ResourcesComponent },
  { path: 'resources', component: ResourcesComponent },
  // Ruta pública del módulo de Psicología y Acompañamiento
  { path: 'psicologia', component: PsychologyComponent },
  { path: 'psychology', component: PsychologyComponent },
  // Ruta pública del Cronograma de Actividades
  { path: 'cronograma', component: CalendarComponent },
  // Ruta raíz redirige por defecto al cronograma de actividades
  { path: '', redirectTo: 'cronograma', pathMatch: 'full' }
];
