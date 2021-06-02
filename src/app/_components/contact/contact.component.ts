import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {GlobalService} from '../../_services/global.service';
import {Teacher} from '../../_models/teacher.model';
import {TeacherService} from '../../_services/teacher.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FunctionsService} from '../../_services/functions.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {CalendarEditDialogComponent} from './calendar-edit-dialog/calendar-edit-dialog.component';
import {LinkService} from '../../_services/link.service';
import {Link} from '../../_models/link.model';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterViewInit {
  teacherContactForm: FormGroup = null;
  teacher: Teacher = null;
  submitted = false;
  calendarUrlSafe: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
  contactInfoExists = false;
  calendarExists = false;
  linksPanelExists = false;

  constructor(
    private formBuilder: FormBuilder,
    public functions: FunctionsService,
    public global: GlobalService,
    private teacherService: TeacherService,
    private sanitizer: DomSanitizer,
    public linkService: LinkService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.teacherContactForm = this.formBuilder.group({
      emailAddress: [this.teacher?.emailAddress, [Validators.email, Validators.maxLength(400)]],
      phoneNumber: [this.teacher?.phoneNumber, [Validators.maxLength(16)]]
    });
  }

  ngOnInit(): void {
    this.linkService.links.pipe(filter((links: Link[]) => !!links)).subscribe((links: Link[]) => {
      this.linksPanelExists = links.length !== 0;
    });

    this.teacherService.teacher.pipe(filter((teacher: Teacher) => !!teacher)).subscribe((teacher: Teacher) => {
      this.teacher = teacher;
      this.teacherContactForm.patchValue(teacher);
      this.contactInfoExists = !!this.teacher.emailAddress || !!this.teacher.phoneNumber;
      this.calendarExists = !!this.teacher.calendarUrl;
      this.calendarUrlSafe = this.calendarExists ?
        this.sanitizer.bypassSecurityTrustResourceUrl(this.teacher.calendarUrl) :
        this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    });
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.teacherContactForm.invalid) {
      return;
    }

    const teacherUpdate = this.functions.createModelUpdate<Teacher>(
      ['emailAddress', 'phoneNumber'],
      this.teacherContactForm.getRawValue(),
      this.teacher
    );
    this.teacherService.updateTeacher(teacherUpdate).subscribe();
  }

  openCalendarEditDialog(): void {
    const data = {teacher: this.teacher};
    this.functions.openDialog(CalendarEditDialogComponent, data);
  }
}
