import {Component, Inject, OnInit} from '@angular/core';
import {Operation} from '../../../_models/operation.enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PublicationsComponent} from '../publications.component';
import {Publication} from '../../../_entities/publication.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GlobalService} from '../../../_services/global.service';
import {PublicationService} from '../../../_services/publication.service';
import {FunctionsService} from '../../../_services/functions.service';
import {PublicationType} from '../../../_models/publication-type.enum';

@Component({
  selector: 'app-publication-edit-dialog',
  templateUrl: './publication-edit-dialog.component.html',
  styleUrls: ['./publication-edit-dialog.component.scss']
})
export class PublicationEditDialogComponent implements OnInit {
  maxDate = new Date();
  publication: Publication = null;
  publicationForm: FormGroup = null;
  operation: Operation = Operation.Add;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    public global: GlobalService,
    public dialogRef: MatDialogRef<PublicationsComponent>,
    private publicationService: PublicationService,
    public functions: FunctionsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.publication = this.data?.publication;
    this.operation = !!this.publication?.id ? Operation.Save : Operation.Add;

    this.publicationForm = this.formBuilder.group({
      title: [this.publication?.title, [Validators.required, Validators.maxLength(256)]],
      subtitle: [this.publication?.subtitle, [Validators.maxLength(256)]],
      publisher: [this.publication?.publisher, [Validators.maxLength(128)]],
      type: [this.publication?.type, [Validators.required]],
      typeName: [
        {value: this.publication?.typeName, disabled: this.publication?.type !== PublicationType[PublicationType.Other]},
        [Validators.required, Validators.maxLength(128)]
      ],
      url: [this.publication?.url, [Validators.maxLength(2048)]],
      date: [!!this.publication.date ? new Date(this.publication.date) : null]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.publicationForm.invalid) {
      return;
    }

    const publicationForm = this.publicationForm.getRawValue();
    const publication = this.functions.createModelFromForm<Publication>(this.publication, publicationForm);
    publication.date = publicationForm.date?.getTime();

    (this.operation === Operation.Add) ?
      this.publicationService.addPublication(publication).subscribe(() => this.dialogRef.close()) :
      this.publicationService.replacePublication(publication).subscribe(() => this.dialogRef.close());
  }

  updatePublicationTypeDisabled(publicationType: string): void {
    if (publicationType === PublicationType[PublicationType.Other]) {
      this.publicationForm.controls.typeName.enable();
    } else {
      this.publicationForm.patchValue({typeName: publicationType});
      this.publicationForm.controls.typeName.disable();
    }
  }
}
