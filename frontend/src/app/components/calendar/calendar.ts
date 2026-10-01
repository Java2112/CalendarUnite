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
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
// Componente del cronograma y calendario interactivo de actividades
export class CalendarComponent implements OnInit {
  // Evento emitido al hacer clic en un evento para abrir su detalle
  @Output() selectEvent = new EventEmitter<EventItem>();

  // Lista de modalidades disponibles para el filtro
  modalities: ModalityType[] = ['Todas', 'Presencial', 'Virtual', 'Nocturna'];
  // Modalidad seleccionada actualmente
  selectedModality: ModalityType = 'Todas';
  // Texto de búsqueda ingresado por el usuario
  searchQuery: string = '';
  // Modo de visualización de eventos ('grid' o 'list')
  viewMode: 'grid' | 'list' = 'grid';

  // Fecha base para la navegación del calendario mensual
  currentDate: Date = new Date(2026, 8, 1);
  // Fecha específica seleccionada para filtrar
  selectedDate: string | null = null;
  // Celdas calculadas para la cuadrícula del calendario
  calendarDays: CalendarDay[] = [];

  // Inyecta el servicio de eventos
  constructor(public eventService: EventService) {}

  // Total de eventos calculados
  get totalEventsCount(): number {
    return this.eventService.stats()?.totalEvents || 0;
  }

  // Total de eventos presenciales
  get presencialesCount(): number {
    return this.eventService.stats()?.presenciales || 0;
  }

  // Total de eventos virtuales
  get virtualesCount(): number {
    return this.eventService.stats()?.virtuales || 0;
  }

  // Total de eventos nocturnos
  get nocturnasCount(): number {
    return this.eventService.stats()?.nocturnas || 0;
  }

  // Inicializa el componente cargando eventos y construyendo el calendario
  ngOnInit(): void {
    this.fetchData();
    this.buildCalendarGrid();
  }

  // Nombre del mes actualmente visualizado
  get currentMonthName(): string {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[this.currentDate.getMonth()];
  }

  // Año actual del calendario
  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  // Formato legible de la fecha seleccionada
  get selectedDateDisplay(): string {
    if (!this.selectedDate) return '';
    const parts = this.selectedDate.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  // Lista de eventos filtrados por fecha si está seleccionada
  get filteredEvents(): EventItem[] {
    let list = this.eventService.events();
    if (this.selectedDate) {
      list = list.filter(e => e.date === this.selectedDate);
    }
    return list;
  }

  // Consulta los eventos al servicio con los filtros aplicados
  fetchData(): void {
    this.eventService.loadEvents(this.selectedModality, this.searchQuery).subscribe({
      next: () => this.buildCalendarGrid(),
      error: () => this.buildCalendarGrid()
    });
  }

  // Establece la modalidad seleccionada y recarga
  setModality(mod: ModalityType): void {
    this.selectedModality = mod;
    this.fetchData();
  }

  // Maneja cambios en los filtros de búsqueda
  onFilterChange(): void {
    this.fetchData();
  }

  // Restablece todos los filtros a sus valores por defecto
  resetFilters(): void {
    this.selectedModality = 'Todas';
    this.searchQuery = '';
    this.selectedDate = null;
    this.fetchData();
  }

  // Limpia el filtro por fecha seleccionada
  clearDateFilter(): void {
    this.selectedDate = null;
  }

  // Retrocede al mes anterior en el calendario
  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.buildCalendarGrid();
  }

  // Avanza al siguiente mes en el calendario
  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.buildCalendarGrid();
  }

  // Maneja la selección o deselección de un día en la cuadrícula
  selectCalendarDay(cell: CalendarDay): void {
    if (!cell.isCurrentMonth) return;
    if (this.selectedDate === cell.dateStr) {
      this.selectedDate = null;
    } else {
      this.selectedDate = cell.dateStr;
    }
  }

  // Construye la cuadrícula de días del mes con sus eventos asociados
  buildCalendarGrid(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const paddingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const allEvents = this.eventService.events();

    const cells: CalendarDay[] = [];

    // Agrega celdas de relleno para los días previos al inicio de mes
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

    // Genera las celdas correspondientes a cada día del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const monthStr = (month + 1) < 10 ? `0${month + 1}` : `${month + 1}`;
      const fullDateStr = `${year}-${monthStr}-${dayStr}`;

      const dayEvents = allEvents.filter(e => e.date === fullDateStr);
      const categories = Array.from(new Set(dayEvents.map(e => e.category || 'General')));

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

  // Determina la clase CSS para el punto indicador según la categoría
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