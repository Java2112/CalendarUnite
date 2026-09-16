import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { EventItem, ModalityType } from '../../models/event.model';

// Interfaz que define la estructura de cada celda/día en la cuadrícula del calendario
export interface CalendarDay {
  dayNumber: number;          // Número del día (ej. 1, 15, 30)
  dateStr: string;            // Fecha en formato texto "AAAA-MM-DD"
  isCurrentMonth: boolean;    // Indica si el día pertenece al mes que se está viendo
  hasEvents: boolean;         // 'true' si hay eventos programados en este día
  events: EventItem[];        // Lista de eventos de ese día
  eventCategories: string[]; // Categorías presentes para pintar los puntos de colores
}

@Component({
  selector: 'app-calendar',
  standalone: true, // Componente independiente (Angular 14+)
  imports: [CommonModule, FormsModule], // Importamos las directivas básicas y soporte para formularios (ngModel)
  template: `
    <div class="dashboard-container">
      <!-- Sección principal del Banner con el título y estadísticas -->
      <section class="hero-banner">
        <div class="hero-content">
          <span class="hero-badge">Portal Oficial de Actividades Extracurriculares</span>
          <h1>Cronograma de Actividades de Bienestar Universitario</h1>
          <p>
            Consulta y participa en las jornadas de salud mental, actividades deportivas, talleres culturales y eventos institucionales disponibles para la comunidad estudiantil.
          </p>
          
          <!-- Tarjetas de Estadísticas Globales (Obtenidas dinámicamente desde el EventService) -->
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-num">{{ totalEventsCount }}</span>
              <span class="stat-label">Eventos Publicados</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ presencialesCount }}</span>
              <span class="stat-label">Modalidad Presencial</span>
            </div>
            <div class="stat-card">
              <span class="stat-num">{{ virtualesCount }}</span>
              <span class="stat-label">Modalidad Virtual</span>
            </div>
            <div class="stat-card accent">
              <span class="stat-num">{{ nocturnasCount }}</span>
              <span class="stat-label">Jornada Nocturna</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Barra de Filtros: Buscador por texto, botones de modalidad y cambio de vista -->
      <div class="controls-bar">
        <!-- Campo de búsqueda en texto libre -->
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="onFilterChange()" 
            placeholder="Buscar por título, categoría o palabra clave..." />
        </div>

        <!-- Botones (Chips) para filtrar por modalidad -->
        <div class="modality-filters">
          @for (mod of modalities; track mod) {
            <button 
              [class.active]="selectedModality === mod"
              (click)="setModality(mod)"
              class="chip-button">
              {{ mod }}
            </button>
          }
        </div>

        <!-- Botones para alternar la vista entre cuadrícula (grid) y lista (list) -->
        <div class="view-toggle">
          <button [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'" title="Vista de Cuadrícula">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </button>
          <button [class.active]="viewMode === 'list'" (click)="viewMode = 'list'" title="Vista de Lista">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
        </div>
      </div>

      <!-- Layout principal: Columna izquierda (Calendario) + Columna derecha (Tarjetas de eventos) -->
      <div class="calendar-layout-grid">
        <aside class="calendar-sidebar">
          <div class="calendar-widget-card">
            <!-- Encabezado del Widget con mes, año y botones de navegación de mes -->
            <div class="calendar-header">
              <h2>{{ currentMonthName }} {{ currentYear }}</h2>
              <div class="calendar-nav-buttons">
                <button (click)="prevMonth()" class="btn-cal-nav" title="Mes anterior">&lt;</button>
                <button (click)="nextMonth()" class="btn-cal-nav" title="Mes siguiente">&gt;</button>
              </div>
            </div>

            <!-- Encabezado con las iniciales de los días de la semana -->
            <div class="calendar-weekdays">
              <span>L</span>
              <span>M</span>
              <span>X</span>
              <span>J</span>
              <span>V</span>
              <span>S</span>
              <span>D</span>
            </div>

            <!-- Renderizado dinámico de las celdas de días del mes -->
            <div class="calendar-days-grid">
              @for (cell of calendarDays; track cell.dateStr + '-' + cell.dayNumber) {
                <div 
                  class="calendar-day-cell"
                  [class.empty-cell]="!cell.isCurrentMonth"
                  [class.has-events]="cell.hasEvents"
                  [class.active]="selectedDate === cell.dateStr"
                  (click)="selectCalendarDay(cell)">
                  
                  @if (cell.isCurrentMonth) {
                    <span class="day-number">{{ cell.dayNumber }}</span>
                    <!-- Indicadores (puntos) de categorías de eventos en el día -->
                    @if (cell.hasEvents) {
                      <div class="day-dots">
                        @for (cat of cell.eventCategories; track cat) {
                          <span class="dot-indicator" [ngClass]="getDotClass(cat)"></span>
                        }
                      </div>
                    }
                  }
                </div>
              }
            </div>

            <!-- Convención/Leyenda de colores según el tipo de categoría -->
            <div class="calendar-legend">
              <div class="legend-item">
                <span class="dot-indicator dot-salud"></span>
                <span>Salud Mental</span>
              </div>
              <div class="legend-item">
                <span class="dot-indicator dot-deporte"></span>
                <span>Deporte</span>
              </div>
              <div class="legend-item">
                <span class="dot-indicator dot-cultura"></span>
                <span>Cultura</span>
              </div>
              <div class="legend-item">
                <span class="dot-indicator dot-desarrollo"></span>
                <span>Desarrollo</span>
              </div>
            </div>

            <!-- Botón para quitar el filtro por día específico -->
            @if (selectedDate) {
              <div class="reset-date-bar">
                <button (click)="clearDateFilter()" class="btn-clear-date">
                  Ver eventos de todo el mes
                </button>
              </div>
            }
          </div>
        </aside>

        <!-- Sección Principal donde se muestran los Eventos -->
        <section class="events-main-section">
          <!-- Título dinámico cuando hay un día seleccionado en el calendario -->
          @if (selectedDate) {
            <div class="selected-day-header">
              <h3>Actividades del día {{ selectedDateDisplay }}</h3>
              <span class="events-count-badge">{{ filteredEvents.length }} {{ filteredEvents.length === 1 ? 'evento' : 'eventos' }}</span>
            </div>
          }

          <!-- Mensaje mientras carga la información desde el backend -->
          @if (eventService.isLoading()) {
            <div class="loading-container">
              <p>Cargando información de actividades...</p>
            </div>
          }

          <!-- Estado vacío cuando la búsqueda o fecha no arroja resultados -->
          @if (!eventService.isLoading() && filteredEvents.length === 0) {
            <div class="empty-state">
              <h3>No hay actividades programadas para esta fecha</h3>
              <p>Selecciona otro día en el calendario o filtra por modalidad.</p>
              <button (click)="clearDateFilter()" class="btn-reset">Ver todos los eventos</button>
            </div>
          }

          <!-- Listado o Grilla de Eventos -->
          @if (!eventService.isLoading() && filteredEvents.length > 0) {
            <div [class.events-grid]="viewMode === 'grid'" [class.events-list]="viewMode === 'list'">
              @for (evt of filteredEvents; track evt.id) {
                <div class="event-card" (click)="onSelect(evt)">
                  <div class="card-image-wrapper">
                    <img [src]="evt.imageUrl" [alt]="evt.title" class="card-img" />
                    <div class="card-badges">
                      <span class="badge-modality" [ngClass]="'mod-' + evt.modality.toLowerCase()">
                        {{ evt.modality }}
                      </span>
                      <span class="badge-category">{{ evt.category }}</span>
                    </div>
                  </div>

                  <div class="card-body">
                    <div class="card-date-strip">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <span>{{ evt.date | date:'mediumDate' }} • {{ evt.time }}</span>
                    </div>

                    <h3 class="card-title">{{ evt.title }}</h3>
                    
                    <p class="card-description">
                      {{ evt.description | slice:0:110 }}{{ evt.description.length > 110 ? '...' : '' }}
                    </p>

                    <div class="card-location">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{{ evt.location }}</span>
                    </div>

                    <div class="card-footer">
                      <div class="spots-info" [class.urgent]="evt.availableSpots <= 5">
                        <span class="spots-count">{{ evt.availableSpots }}</span>
                        <span class="spots-label">cupos disponibles de {{ evt.totalSpots }}</span>
                      </div>

                      <button class="btn-register-cta">
                        Ver e Inscribirme
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </section>
      </div>
    </div>
  `
})
export class CalendarComponent implements OnInit {
  // Evento de salida para avisar al componente padre cuando el usuario selecciona un evento
  @Output() selectEvent = new EventEmitter<EventItem>();

  // Opciones de filtros y estados locales de la interfaz
  modalities: ModalityType[] = ['Todas', 'Presencial', 'Virtual', 'Nocturna'];
  selectedModality: ModalityType = 'Todas';
  searchQuery: string = '';
  viewMode: 'grid' | 'list' = 'grid'; // Modo de visualización alternable

  // Control de fechas para la navegación del calendario (Inicia en Septiembre de 2026)
  currentDate: Date = new Date(2026, 8, 1);
  selectedDate: string | null = null;
  calendarDays: CalendarDay[] = [];

  // Inyectamos el servicio global de eventos en el constructor
  constructor(public eventService: EventService) {}

  // Getters para leer fácilmente los totales directamente desde el servicio
  get totalEventsCount(): number {
    return this.eventService.stats()?.totalEvents || 0;
  }

  get presencialesCount(): number {
    return this.eventService.stats()?.presenciales || 0;
  }

  get virtualesCount(): number {
    return this.eventService.stats()?.virtuales || 0;
  }

  get nocturnasCount(): number {
    return this.eventService.stats()?.nocturnas || 0;
  }

  // Al iniciar el componente, cargamos los datos del servidor y generamos la grilla del mes
  ngOnInit(): void {
    this.fetchData();
    this.buildCalendarGrid();
  }

  // Retorna el nombre del mes actual en español
  get currentMonthName(): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[this.currentDate.getMonth()];
  }

  // Retorna el año actual cargado
  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  // Formatea la fecha seleccionada a DD/MM/AAAA para mostrar en el título
  get selectedDateDisplay(): string {
    if (!this.selectedDate) return '';
    const parts = this.selectedDate.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  // Filtra los eventos traídos del servicio si hay un día particular seleccionado
  get filteredEvents(): EventItem[] {
    let list = this.eventService.events();
    if (this.selectedDate) {
      list = list.filter(e => e.date === this.selectedDate);
    }
    return list;
  }

  // Llama al servicio para obtener los eventos aplicando los filtros actuales de modalidad y texto
  fetchData(): void {
    this.eventService.loadEvents(this.selectedModality, this.searchQuery).subscribe({
      next: () => this.buildCalendarGrid() // Al terminar de cargar, reconstruimos el calendario
    });
  }

  // Cambia la modalidad activa y vuelve a cargar los datos
  setModality(mod: ModalityType): void {
    this.selectedModality = mod;
    this.fetchData();
  }

  // Evento al escribir en la barra de búsqueda
  onFilterChange(): void {
    this.fetchData();
  }

  // Restablece todos los filtros de búsqueda a su estado inicial
  resetFilters(): void {
    this.selectedModality = 'Todas';
    this.searchQuery = '';
    this.selectedDate = null;
    this.fetchData();
  }

  // Elimina la selección del día actual para volver a mostrar el mes completo
  clearDateFilter(): void {
    this.selectedDate = null;
  }

  // Retrocede un mes en el calendario
  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.buildCalendarGrid();
  }

  // Avanza un mes en el calendario
  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.buildCalendarGrid();
  }

  // Selecciona o deselecciona un día específico al hacer clic en una celda
  selectCalendarDay(cell: CalendarDay): void {
    if (!cell.isCurrentMonth) return;
    if (this.selectedDate === cell.dateStr) {
      this.selectedDate = null; // Si ya estaba seleccionado, lo deselecciona
    } else {
      this.selectedDate = cell.dateStr;
    }
  }

  // Algoritmo para construir las celdas del mes actual con sus respectivos desfases de días
  buildCalendarGrid(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Calculamos en qué día de la semana cae el primer día del mes (Ajustado para comenzar en Lunes)
    const firstDayIndex = new Date(year, month, 1).getDay();
    const paddingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const allEvents = this.eventService.events();

    const cells: CalendarDay[] = [];

    // Agregamos celdas vacías de relleno (días pertenecientes al mes anterior)
    for (let i = 0; i < paddingDays; i++) {
      cells.push({
        dayNumber: 0,
        dateStr: `pad-${i}`,
        isCurrentMonth: false,
        hasEvents: false,
        events: [],
        eventCategories: []
      });
    }

    // Generamos cada uno de los días pertenecientes al mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const monthStr = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
      const fullDateStr = `${year}-${monthStr}-${dayStr}`;

      // Buscamos si hay eventos para este día concreto
      const dayEvents = allEvents.filter(e => e.date === fullDateStr);
      const categories = Array.from(new Set(dayEvents.map(e => e.category)));

      cells.push({
        dayNumber: day,
        dateStr: fullDateStr,
        isCurrentMonth: true,
        hasEvents: dayEvents.length > 0,
        events: dayEvents,
        eventCategories: categories
      });
    }

    this.calendarDays = cells;
  }

  // Devuelve la clase CSS adecuada para asignar un color al punto del calendario según la categoría
  getDotClass(category: string): string {
    if (category.includes('Psicología') || category.includes('Salud')) return 'dot-salud';
    if (category.includes('Deportes')) return 'dot-deporte';
    if (category.includes('Cultura') || category.includes('Arte')) return 'dot-cultura';
    return 'dot-desarrollo';
  }

  // Emite el evento seleccionado hacia el componente padre
  onSelect(evt: EventItem): void {
    this.selectEvent.emit(evt);
  }
}