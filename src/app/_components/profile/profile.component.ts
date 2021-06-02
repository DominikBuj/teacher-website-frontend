import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Teacher} from '../../_models/teacher.model';
import {FunctionsService} from '../../_services/functions.service';
import {TeacherService} from '../../_services/teacher.service';
import {LinkedInService} from '../../_services/linked-in.service';
import {GlobalService} from '../../_services/global.service';
import {Constants} from '../../constants';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LinkService} from '../../_services/link.service';
import {FilesService} from '../../_services/files.service';
import {filter} from 'rxjs/operators';
import {LinkedInImportDialogComponent} from '../imports/linked-in-import-dialog/linked-in-import-dialog.component';
import * as CKEditor from '../../ckeditor/build/ckeditor';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  teacher: Teacher = null;
  teacherProfileForm: FormGroup = null;
  linkedInAuthorizationUrl = Constants.LINKED_IN_AUTHORIZATION_URL;
  ckEditor = CKEditor;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public global: GlobalService,
    public functions: FunctionsService,
    private teacherService: TeacherService,
    public linkedInService: LinkedInService,
    public linkService: LinkService,
    private filesService: FilesService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.teacherProfileForm = this.formBuilder.group({
      firstName: [this.teacher?.firstName, [Validators.maxLength(100)]],
      lastName: [this.teacher?.lastName, [Validators.maxLength(100)]],
      university: [this.teacher?.university, [Validators.maxLength(100)]],
      subject: [this.teacher?.subject, [Validators.maxLength(100)]],
      about: [this.teacher?.about, [Validators.maxLength(4000)]]
    });

    this.teacherService.teacher.pipe(filter((teacher: Teacher) => !!teacher)).subscribe((teacher: Teacher) => {
      this.teacher = teacher;
      this.teacherProfileForm?.patchValue(teacher);

      const authorizationCode = this.route.snapshot.queryParamMap.get('code');
      if (!!authorizationCode && this.linkedInService.authorization) {
        this.linkedInService.authorization = false;
        const data = {teacher: this.teacher, authorizationCode};
        this.functions.openDialog(LinkedInImportDialogComponent, data);
      }
    });
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  onSubmit(): void {
    const teacherUpdate = this.functions.createModelUpdate<Teacher>(
      ['firstName', 'lastName', 'university', 'subject', 'about'],
      this.teacherProfileForm.getRawValue(),
      this.teacher
    );
    this.teacherService.updateTeacher(teacherUpdate).subscribe();
  }

  uploadProfilePicture(files: FileList): void {
    if (files.length !== 0) {
      const profilePicture = files[0];
      this.filesService.uploadImage(profilePicture).pipe(filter((response: any) => !!response)).subscribe((response: any) => {
        const teacherPictureUpdate = this.functions.createModelUpdate<Teacher>(
          ['pictureUrl'],
          {pictureUrl: response[`databasePath`]} as Teacher,
          {pictureUrl: this.teacher?.pictureUrl} as Teacher
        );
        this.teacherService.updateTeacher(teacherPictureUpdate).subscribe();
      });
    }
  }
}
