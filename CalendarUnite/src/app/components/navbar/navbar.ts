import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar-header">
      <div class="navbar-container">
        <div class="navbar-brand">
          <div class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
              <path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/>
              <path d="M8 18h.01"/><path d="M12 18h.01"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">CalendarUnite</span>
            <span class="brand-sub">Bienestar Universitario</span>
          </div>
        </div>

        <div class="navbar-actions">
          <div class="public-badge">
            <span class="pulse-dot"></span>
            <span>Portal de Consulta de Actividades</span>
          </div>
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {}
