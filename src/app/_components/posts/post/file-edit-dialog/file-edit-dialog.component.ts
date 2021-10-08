import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {GlobalService} from '../../../../_services/global.service';
import {FunctionsService} from '../../../../_services/functions.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PostComponent} from '../post.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Operation} from '../../../../_models/operation.enum';
import {MatCheckbox} from '@angular/material/checkbox';
import {TemporaryFile} from '../../../../_models/temporary-file.model';

@Component({
  selector: 'app-file-edit-dialog',
  templateUrl: './file-edit-dialog.component.html',
  styleUrls: ['./file-edit-dialog.component.scss']
})
export class FileEditDialogComponent implements OnInit {
  temporaryFile: TemporaryFile = null;
  fileForm: FormGroup = null;
  operation: Operation = Operation.Add;
  submitted = false;
  @ViewChild('fileUrlCheckbox') private fileUrlCheckbox: MatCheckbox;

  constructor(
    private formBuilder: FormBuilder,
    public global: GlobalService,
    public functions: FunctionsService,
    public dialogRef: MatDialogRef<PostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.temporaryFile = this.data?.temporaryFile;
    this.operation = !!this.temporaryFile.url ? Operation.Save : Operation.Add;

    this.fileForm = this.formBuilder.group({
      name: [this.temporaryFile?.name, [Validators.required, Validators.maxLength(128)]],
      url: [this.temporaryFile?.url, [Validators.required, Validators.maxLength(2048)]]
    });
  }

  disableFileUrl(file: File): void {
    this.temporaryFile.file = file;
    const fileName = file.name;
    this.fileUrlCheckbox.checked = true;
    this.fileForm.controls.url.disable();
    this.fileForm.patchValue({name: fileName, url: fileName});
  }

  enableFileUrl(): void {
    this.temporaryFile.file = null;
    this.fileUrlCheckbox.checked = false;
    this.fileForm.controls.url.enable();
    this.fileForm.patchValue({name: null, url: null});
  }

  uploadFile(files: FileList): void {
    if (files.length > 0) {
      this.disableFileUrl(files[0]);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.fileForm.invalid) {
      return;
    }

    const temporaryFile = this.functions.createModelFromForm<TemporaryFile>(this.temporaryFile, this.fileForm.getRawValue());
    this.dialogRef.close(temporaryFile);
  }
}
