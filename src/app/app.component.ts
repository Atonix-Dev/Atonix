import { Component } from '@angular/core';

/**
 * Root Application Component
 * 
 * This component serves as the entry point for the application.
 * It uses lazy loading for all features to improve initial load time.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Radio App - Tu Radio Mundial';
}
