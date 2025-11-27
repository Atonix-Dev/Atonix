import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageUtil } from '../utils/storage.util';

export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';

const STORAGE_KEYS = {
  LANGUAGE: 'radio_app_language',
  THEME: 'radio_app_theme'
};

/**
 * Settings Service
 * Manages application settings: language, theme, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private currentLanguageSubject$ = new BehaviorSubject<Language>('es');
  private currentThemeSubject$ = new BehaviorSubject<Theme>('light');

  public currentLanguage$ = this.currentLanguageSubject$.asObservable();
  public currentTheme$ = this.currentThemeSubject$.asObservable();

  constructor(private translate: TranslateService) {
    this.initializeSettings();
  }

  /**
   * Initialize settings from localStorage or browser defaults
   */
  private initializeSettings(): void {
    // Initialize language
    const savedLanguage = StorageUtil.getItem<Language>(STORAGE_KEYS.LANGUAGE);
    const browserLang = this.translate.getBrowserLang() || 'es';
    const defaultLang = savedLanguage || (browserLang === 'en' ? 'en' : 'es');
    
    this.translate.setDefaultLang('es');
    this.translate.use(defaultLang);
    this.currentLanguageSubject$.next(defaultLang);

    // Initialize theme
    const savedTheme = StorageUtil.getItem<Theme>(STORAGE_KEYS.THEME);
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.currentLanguageSubject$.value;
  }

  /**
   * Set language
   */
  setLanguage(lang: Language): void {
    this.translate.use(lang);
    StorageUtil.setItem(STORAGE_KEYS.LANGUAGE, lang);
    this.currentLanguageSubject$.next(lang);
  }

  /**
   * Toggle language between English and Spanish
   */
  toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang: Language = currentLang === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): Theme {
    return this.currentThemeSubject$.value;
  }

  /**
   * Set theme
   */
  setTheme(theme: Theme): void {
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    StorageUtil.setItem(STORAGE_KEYS.THEME, theme);
    this.currentThemeSubject$.next(theme);
  }

  /**
   * Toggle theme between light and dark
   */
  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Get available languages
   */
  getAvailableLanguages(): Array<{ code: Language; name: string }> {
    return [
      { code: 'es', name: 'Español' },
      { code: 'en', name: 'English' }
    ];
  }
}
