import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Operation} from '../../../_models/operation.enum';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalService} from '../../../_services/global.service';
import {ContactComponent} from '../contact.component';
import {Teacher} from '../../../_models/teacher.model';
import {TeacherService} from '../../../_services/teacher.service';
import {FunctionsService} from '../../../_services/functions.service';

@Component({
  selector: 'app-calendar-edit-dialog',
  templateUrl: './calendar-edit-dialog.component.html',
  styleUrls: ['./calendar-edit-dialog.component.scss']
})
export class CalendarEditDialogComponent implements OnInit {
  operation: Operation = null;
  calendarForm: FormGroup = null;
  teacher: Teacher = null;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    public global: GlobalService,
    public dialogRef: MatDialogRef<ContactComponent>,
    private teacherService: TeacherService,
    public functions: FunctionsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.teacher = this.data?.teacher;
    this.operation = !!this.teacher?.calendarUrl ? Operation.Save : Operation.Add;

    this.calendarForm = this.formBuilder.group({
      calendarUrl: [this.teacher?.calendarUrl, [Validators.maxLength(2048)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.calendarForm.invalid) {
      return;
    }

    const teacherUpdate = this.functions.createModelUpdate<Teacher>(['calendarUrl'], this.calendarForm.getRawValue(), this.teacher);
    this.teacherService.updateTeacher(teacherUpdate).subscribe(() => this.dialogRef.close());
  }
}
