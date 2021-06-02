import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LinksPanelComponent} from '../links-panel.component';
import {Operation} from '../../../_models/operation.enum';
import {FunctionsService} from '../../../_services/functions.service';
import {LinkType} from '../../../_models/link-type.enum';
import {Link} from '../../../_models/link.model';
import {GlobalService} from '../../../_services/global.service';
import {LinkService} from '../../../_services/link.service';

@Component({
  selector: 'app-link-edit-dialog',
  templateUrl: './link-edit-dialog.component.html',
  styleUrls: ['./link-edit-dialog.component.scss']
})
export class LinkEditDialogComponent implements OnInit {
  link: Link = null;
  availableLinkTypes: string[] = [];
  nextColor: string = null;
  linkForm: FormGroup = null;
  operation: Operation = Operation.Add;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    public global: GlobalService,
    public dialogRef: MatDialogRef<LinksPanelComponent>,
    private linkService: LinkService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public functions: FunctionsService
  ) {
  }

  ngOnInit(): void {
    this.link = this.data?.link;
    this.availableLinkTypes = this.data?.availableLinkTypes;
    this.nextColor = this.data?.nextColor;
    this.operation = !!this.link.id ? Operation.Save : Operation.Add;

    this.linkForm = this.formBuilder.group({
      type: [this.link?.type, [Validators.required]],
      name: [
        {value: this.link?.name, disabled: this.link?.type !== LinkType[LinkType.Other]},
        [Validators.required, Validators.maxLength(100)]
      ],
      url: [this.link?.url, [Validators.required, Validators.maxLength(2000)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.linkForm.invalid) {
      return;
    }

    const link = this.functions.createModelFromForm<Link>(this.link, this.linkForm.getRawValue());
    if (link.type === LinkType[LinkType.Other] && !link.color) {
      link.color = this.nextColor;
    }

    this.operation === Operation.Add ?
      this.linkService.addLink(link).subscribe(() => this.dialogRef.close()) :
      this.linkService.replaceLink(link).subscribe(() => this.dialogRef.close());
  }

  updateNameDisabled(linkType: string): void {
    if (linkType === LinkType[LinkType.Other]) {
      this.linkForm.controls.name.enable();
    } else {
      this.linkForm.patchValue({name: linkType});
      this.linkForm.controls.name.disable();
    }
  }
}
