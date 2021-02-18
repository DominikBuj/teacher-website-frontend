import {Component, OnInit} from '@angular/core';
import {Teacher} from '../../_models/teacher.model';
import {TeacherService} from '../../_services/teacher.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {FunctionsService} from '../../_services/functions.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  teacher: Teacher;
  form: any;
  calendarUrlSafe: SafeResourceUrl;

  teacherFormValues = [
    'emailAddress',
    'phoneNumber',
    'calendarUrl'
  ];

  constructor(
    private sanitizer: DomSanitizer,
    public functions: FunctionsService,
    private teacherService: TeacherService
  ) {
    this.form = {};
  }

  ngOnInit(): void {
    this.teacherService.teacher.subscribe((teacher: Teacher) => {
      this.teacher = teacher;
      this.calendarUrlSafe = this.teacher.calendarUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(this.teacher.calendarUrl) : undefined;
      this.functions.fillFormWithObject(this.form, this.teacherFormValues, this.teacher);
    });
  }

  onSubmit(): void {
    const update = this.functions.createTeacherUpdate(this.teacherFormValues, this.form, this.teacher);
    this.teacherService.updateTeacher(update).subscribe();
  }
}

