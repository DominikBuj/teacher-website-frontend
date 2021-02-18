import {Injectable} from '@angular/core';
import {Authorization} from '../_models/authorization.enum';
import {Teacher} from '../_models/teacher.model';
import {AuthService} from './auth.service';
import {SettingsService} from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    private auth: AuthService,
    private settings: SettingsService
  ) { }

  isEditing(): boolean {
    return (this.auth.user.value && this.settings.settings.value.edit);
  }

  getAuthorization(type: Authorization): boolean {
    const authorization = localStorage.getItem(type);
    if (!authorization) {
      localStorage.setItem(type, 'false');
      return false;
    }
    return (authorization === 'true');
  }

  setAuthorization(type: Authorization, authorization: boolean): boolean {
    localStorage.setItem(type, authorization.toString());
    return authorization;
  }

  getDate(year: number, month: number, day: number): number {
    let yearTicks = year ? 31556952000 * (year - 1970) : 0;
    yearTicks = yearTicks < 0 ? 0 : yearTicks;
    const monthTicks = month ? 2592000000 * month : 0;
    const dayTicks = day ? 86400000 * day : 0;
    return yearTicks + monthTicks + dayTicks;
  }

  fillFormWithObject(form: any, formValues: string[], object: any): void {
    formValues.forEach((value: string) => form[value] = object[value]);
  }

  updateFormValue(form: any, valueName: string, valueValue: any): void {
    if (valueValue) {
      form[valueName] = valueValue;
    }
  }

  createTeacherUpdate(teacherValues: string[], form: any, teacher: Teacher): any {
    const update = [];

    teacherValues.forEach((value: string) => {
      if (form[value] !== teacher[value]) {
        const valueUpdate = {
          op: 'add',
          path: `/${value}`,
          value: form[value]
        };
        update.push(valueUpdate);
      }
    });

    return update;
  }
}
