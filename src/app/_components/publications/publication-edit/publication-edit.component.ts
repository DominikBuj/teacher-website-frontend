import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PublicationsComponent} from '../publications.component';
import {Publication} from '../../../_models/publication.model';

@Component({
  selector: 'app-publication-edit',
  templateUrl: './publication-edit.component.html',
  styleUrls: ['./publication-edit.component.scss']
})
export class PublicationEditComponent implements OnInit {
  operation: string;

  maxDate: Date;
  dateInput: Date;

  constructor(
    public dialogRef: MatDialogRef<PublicationsComponent>,
    @Inject(MAT_DIALOG_DATA) public publication: Publication
  ) { }

  ngOnInit(): void {
    this.operation = !!this.publication.title ? 'Zapisz' : 'Dodaj';

    this.maxDate = new Date();
    this.dateInput = this.publication.date ? new Date(this.publication.date) : undefined;
  }

  onSubmit(): void {
    this.publication.date = this.dateInput ? this.dateInput.getTime() : undefined;
    this.dialogRef.close(this.publication);
  }
}
