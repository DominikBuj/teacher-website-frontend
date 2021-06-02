import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TeacherService} from './teacher.service';
import {GlobalService} from './global.service';
import {ComponentType} from '@angular/cdk/overlay';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    private teacherService: TeacherService,
    private dialog: MatDialog,
    private global: GlobalService
  ) {
  }

  checkError(formGroup: FormGroup, controlName: string, errorName: string): boolean {
    return formGroup.controls[controlName].hasError(errorName);
  }

  createModelFromForm<T>(oldModel: T, form: T): T {
    const model = {} as T;

    Object.keys(oldModel).forEach((key: string) => model[key] = oldModel[key]);
    Object.keys(form).forEach((key: string) => model[key] = form[key]);

    return model;
  }

  fillModelFromForm<T>(keys: string[], form: any, model: T): void {
    for (const key of keys) {
      if (!!form[key]) {
        model[key] = form[key];
      }
    }
  }

  createModelUpdate<T>(keys: string[], newModel: T, oldModel?: T): any {
    const modelUpdate = [];
    keys.forEach((key: string) => {
      if (!oldModel || oldModel[key] !== newModel[key]) {
        const valueUpdate = {
          op: 'add',
          path: `/${key}`,
          value: newModel[key]
        };
        modelUpdate.push(valueUpdate);
      }
    });
    return modelUpdate;
  }

  openDialog(component: ComponentType<any>, data?: any): MatDialogRef<any> {
    return this.dialog.open(component, {
      data,
      panelClass: this.global.isDarkMode ? 'dialog-dark' : 'dialog',
      width: '960px'
    });
  }

  indexOf<T>(array: T[], id: number): number {
    for (let index = 0; index < array.length; ++index) {
      if (array[index][`id`] === id) {
        return index;
      }
    }
    return null;
  }

  logModel<T>(model: T): void {
    for (const key of Object.keys(model)) {
      console.log(`key ${key} is ${model[key]}`);
    }
  }
}
