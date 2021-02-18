import {Component, Input, OnInit} from '@angular/core';
import {Teacher} from '../../../_models/teacher.model';
import {Constants} from '../../../constants';
import {TeacherService} from '../../../_services/teacher.service';
import {FilesService} from '../../../_services/files.service';
import {FunctionsService} from '../../../_services/functions.service';
import {ActivatedRoute} from '@angular/router';
import {LinkedInService} from '../../../_services/linked-in.service';
import {LoggerService} from '../../../_services/logger.service';
import {Authorization} from '../../../_models/authorization.enum';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  @Input() teacher: Teacher;
  form: any;

  teacherFormValues = [
    'firstName',
    'lastName',
    'university',
    'subject',
    'about',
    'pictureUrl'
  ];
  linkedInAuthorizationUrl = Constants.LINKED_IN_AUTHORIZATION_URL;

  constructor(
    private route: ActivatedRoute,
    private functions: FunctionsService,
    private logger: LoggerService,
    private linkedInService: LinkedInService,
    private teacherService: TeacherService,
    private filesService: FilesService
  ) {
    this.form = {};
  }

  ngOnInit(): void {
    this.functions.fillFormWithObject(this.form, this.teacherFormValues, this.teacher);
  }

  switchLinkedInAuthorization(): void {
    this.functions.setAuthorization(Authorization.LinkedIn, true);
  }

  onSubmit(): void {
    const update = this.functions.createTeacherUpdate(this.teacherFormValues, this.form, this.teacher);
    this.teacherService.updateTeacher(update).subscribe((teacher: Teacher) => {
      this.functions.fillFormWithObject(this.form, this.teacherFormValues, teacher);
    });
  }


  uploadProfilePicture(files: FileList): void {
    if (files.length !== 0) {
      const profilePicture = files[0];
      this.filesService.uploadImage(profilePicture).subscribe((response: object) => {
        this.functions.updateFormValue(this.form, 'pictureUrl', response[`databasePath`]);
        const update = this.functions.createTeacherUpdate(['pictureUrl'], this.form, this.teacher);
        this.teacherService.updateTeacher(update).subscribe();
      });
    }
  }
}
