import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {GlobalService} from '../../../_services/global.service';
import {LinkedInAccessTokenResponse} from '../../../_models/linked-in-access-token-response.model';
import * as _ from 'lodash';
import {Teacher} from '../../../_models/teacher.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LinkedInService} from '../../../_services/linked-in.service';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {ImportData} from '../../../_models/import-data.model';
import {filter} from 'rxjs/operators';
import {FunctionsService} from '../../../_services/functions.service';
import {TeacherService} from '../../../_services/teacher.service';

@Component({
  selector: 'app-linked-in-import-dialog',
  templateUrl: './linked-in-import-dialog.component.html',
  styleUrls: ['./linked-in-import-dialog.component.scss']
})
export class LinkedInImportDialogComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<ImportData> = new MatTableDataSource<ImportData>();
  selection: SelectionModel<ImportData> = new SelectionModel<ImportData>(true, []);
  columns = ['select', 'parameterLabel', 'oldParameter', 'newParameter'];

  constructor(
    public global: GlobalService,
    public dialogRef: MatDialogRef<LinkedInImportDialogComponent>,
    private linkedInService: LinkedInService,
    private changeDetectorRef: ChangeDetectorRef,
    private functions: FunctionsService,
    private teacherService: TeacherService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.linkedInService.getAccessToken(this.data?.authorizationCode)
      .pipe(filter((accessTokenResponse: LinkedInAccessTokenResponse) => !!accessTokenResponse))
      .subscribe((accessTokenResponse: LinkedInAccessTokenResponse) => {
        const accessToken = accessTokenResponse.access_token;
        this.linkedInService.getProfileInformation(accessToken).pipe(filter((profileInformation: any) => !!profileInformation))
          .subscribe((profileInformation: any) => {
            this.linkedInService.getEmail(accessToken).pipe(filter((email: any) => !!email)).subscribe((email: any) => {
              const oldData = this.data?.teacher;
              const newData = {
                firstName: _.get(profileInformation, 'firstName.localized.en_US')?.toString(),
                lastName: _.get(profileInformation, 'lastName.localized.en_US')?.toString(),
                pictureUrl: _.get(profileInformation, 'profilePicture.displayImage~.elements[3].identifiers[0].identifier')?.toString(),
                emailAddress: _.get(email, 'elements[0].handle~.emailAddress')?.toString()
              } as Teacher;
              this.dataSource.data = [
                {
                  parameterLabel: 'First name', parameterName: 'firstName', oldParameter: oldData.firstName,
                  newParameter: newData.firstName
                },
                {parameterLabel: 'Last name', parameterName: 'lastName', oldParameter: oldData.lastName, newParameter: newData.lastName},
                {
                  parameterLabel: 'Profile picture url', parameterName: 'pictureUrl', oldParameter: oldData.pictureUrl,
                  newParameter: newData.pictureUrl
                },
                {
                  parameterLabel: 'Email address', parameterName: 'emailAddress', oldParameter: oldData.emailAddress,
                  newParameter: newData.emailAddress
                }
              ];
              this.changeDetectorRef.detectChanges();
            });
          });
      });
  }

  ngOnDestroy(): void {
    this.dataSource?.disconnect();
  }

  isAllSelected(): boolean {
    const numberOfSelectedRows = this.selection.selected.length;
    const numberOfRows = this.dataSource.data.length;
    return numberOfSelectedRows === numberOfRows;
  }

  selectAll(): void {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onSubmit(): void {
    const changedImportData = {} as Teacher;
    const changedParametersNames = [];
    this.dataSource.data.forEach((importData: ImportData) => {
      if (this.selection.isSelected(importData)) {
        changedImportData[importData.parameterName] = importData.newParameter;
        changedParametersNames.push(importData.parameterName);
      }
    });
    const teacherUpdate = this.functions.createModelUpdate<Teacher>(changedParametersNames, changedImportData, this.data.teacher);
    this.teacherService.updateTeacher(teacherUpdate).subscribe(() => this.dialogRef.close());
  }
}
