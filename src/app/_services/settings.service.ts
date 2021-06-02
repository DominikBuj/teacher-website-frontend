import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Settings} from '../_models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings: BehaviorSubject<Settings>;

  initSettings(): string {
    let settingsString = localStorage.getItem('settings');

    if (!settingsString) {
      const settings = new Settings(false, false);
      localStorage.setItem('settings', JSON.stringify(settings));
      settingsString = localStorage.getItem('settings');
    }

    return settingsString;
  }

  constructor() {
    const settingsString = this.initSettings();
    this.settings = new BehaviorSubject<Settings>(JSON.parse(settingsString));
  }

  switchEditing(): void {
    const settings = this.settings.value;
    settings.isEditing = !settings.isEditing;
    localStorage.setItem('settings', JSON.stringify(settings));
    this.settings.next(settings);
  }

  switchDarkMode(): void {
    const settings = this.settings.value;
    settings.isDarkMode = !settings.isDarkMode;
    localStorage.setItem('settings', JSON.stringify(settings));
    this.settings.next(settings);
  }
}
