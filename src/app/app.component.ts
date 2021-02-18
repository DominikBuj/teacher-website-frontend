import {Component} from '@angular/core';
import {AuthService} from './_services/auth.service';
import {SettingsService} from './_services/settings.service';
import {Teacher} from './_models/teacher.model';
import {TeacherService} from './_services/teacher.service';
import {FunctionsService} from './_services/functions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TeacherWebsite';
  teacher: Teacher;

  constructor(
    public functions: FunctionsService,
    public settings: SettingsService,
    public auth: AuthService,
    private teacherService: TeacherService
  ) {
    this.teacherService.teacher.subscribe((teacher: Teacher) => this.teacher = teacher);
  }

  logout(): void {
    this.auth.logout();
  }
}
