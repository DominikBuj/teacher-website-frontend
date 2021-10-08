import {Component, Inject, OnInit} from '@angular/core';
import {Operation} from '../../../_models/operation.enum';
import {DissertationStatus} from '../../../_models/dissertation-status.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DissertationsComponent} from '../dissertations.component';
import {Dissertation} from '../../../_entities/dissertation.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalService} from '../../../_services/global.service';
import {DissertationService} from '../../../_services/dissertation.service';
import {FunctionsService} from '../../../_services/functions.service';

@Component({
  selector: 'app-dissertation-edit-dialog',
  templateUrl: './dissertation-edit-dialog.component.html',
  styleUrls: ['./dissertation-edit-dialog.component.scss']
})
export class DissertationEditDialogComponent implements OnInit {
  operation: Operation = Operation.Add;
  dissertation: Dissertation = null;
  dissertationForm: FormGroup = null;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    public global: GlobalService,
    public dialogRef: MatDialogRef<DissertationsComponent>,
    private dissertationService: DissertationService,
    public functions: FunctionsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.dissertation = this.data?.dissertation;
    this.operation = !!this.dissertation?.id ? Operation.Save : Operation.Add;

    this.dissertationForm = this.formBuilder.group({
      topic: [this.dissertation?.topic, [Validators.required, Validators.maxLength(256)]],
      status: [{value: this.dissertation?.status || DissertationStatus.Proposed, disabled: this.operation === Operation.Add}],
      date: [{
        value: !!this.dissertation?.date ? new Date(this.dissertation?.date) : null,
        disabled: this.dissertation?.status !== DissertationStatus[DissertationStatus.Completed]
      }],
      description: [this.dissertation?.description, [Validators.maxLength(2048)]]
    });
  }

  updateDateDisabled(dissertationStatus: string): void {
    (dissertationStatus !== DissertationStatus[DissertationStatus.Completed]) ?
      this.dissertationForm.controls.date.disable() :
      this.dissertationForm.controls.date.enable();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.dissertationForm.invalid) {
      return;
    }

    const dissertationForm = this.dissertationForm.getRawValue();
    const dissertation = this.functions.createModelFromForm<Dissertation>(this.dissertation, dissertationForm);
    dissertation.date = dissertationForm.date?.getTime();
    this.functions.logModel<Dissertation>(dissertation);

    this.operation === Operation.Add ?
      this.dissertationService.addDissertation(dissertation).subscribe(() => this.dialogRef.close()) :
      this.dissertationService.replaceDissertation(dissertation).subscribe(() => this.dialogRef.close());
  }
}
