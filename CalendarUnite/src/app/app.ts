import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { CalendarComponent } from './components/calendar/calendar';
import { EventDetailComponent } from './components/event-detail/event-detail';
import { EventItem } from './models/event.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    CalendarComponent,
    EventDetailComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  selectedEvent: EventItem | null = null;

  onSelectEvent(event: EventItem): void {
    this.selectedEvent = event;
  }

  closeEventModal(): void {
    this.selectedEvent = null;
  }
}
