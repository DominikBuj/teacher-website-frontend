import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Settings} from '../_models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  settings: BehaviorSubject<Settings>;

  constructor() {
    let settingsString = localStorage.getItem('settings');

    if (!settingsString) {
      const settings = new Settings(false);
      localStorage.setItem('settings', JSON.stringify(settings));
      settingsString = localStorage.getItem('settings');
    }

    this.settings = new BehaviorSubject<Settings>(JSON.parse(settingsString));
  }

  public switchEditSetting(): void {
    const settings = this.settings.value;
    settings.edit = !settings.edit;
    this.settings.next(settings);
  }
}
