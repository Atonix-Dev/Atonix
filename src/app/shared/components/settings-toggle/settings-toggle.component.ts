
import { Component, OnInit } from '@angular/core';
import { SettingsService, Language, Theme } from '../../services/settings.service';

/**
 * Settings Toggle Component
 * Displays language and theme toggles
 */
@Component({
  selector: 'app-settings-toggle',
  templateUrl: './settings-toggle.component.html',
  styleUrls: ['./settings-toggle.component.css']
})
export class SettingsToggleComponent implements OnInit {
  currentLanguage: Language = 'es';
  currentTheme: Theme = 'light';
  showDropdown = false;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });

    this.settingsService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleLanguage(): void {
    this.settingsService.toggleLanguage();
  }

  toggleTheme(): void {
    this.settingsService.toggleTheme();
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }
}
