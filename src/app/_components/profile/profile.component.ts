import {Component, OnInit} from '@angular/core';
import {Teacher} from '../../_models/teacher.model';
import {FunctionsService} from '../../_services/functions.service';
import {TeacherService} from '../../_services/teacher.service';
import {Authorization} from '../../_models/authorization.enum';
import {ActivatedRoute} from '@angular/router';
import {LinkedInAccessTokenResponse} from '../../_models/linked-in-access-token-response.model';
import * as _ from 'lodash';
import {LinkedInService} from '../../_services/linked-in.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  teacher: Teacher;
  form: any;
  linkedInAuthorization: boolean;

  teacherLinkedInValues = [
    'firstName',
    'lastName',
    'pictureUrl',
    'emailAddress'
  ];

  constructor(
    private route: ActivatedRoute,
    public functions: FunctionsService,
    private teacherService: TeacherService,
    private linkedInService: LinkedInService
  ) {
    this.form = {};
  }

  ngOnInit(): void {
    this.teacherService.teacher.subscribe((teacher: Teacher) => this.teacher = teacher);

    this.linkedInAuthorization = this.functions.getAuthorization(Authorization.LinkedIn);
    const linkedInAuthorizationCode = this.route.snapshot.queryParamMap.get('code');
    if (linkedInAuthorizationCode && this.linkedInAuthorization) {
      this.linkedInAuthorization = this.functions.setAuthorization(Authorization.LinkedIn, false);
      this.importFromLinkedIn(linkedInAuthorizationCode);
    }
  }

  importFromLinkedIn(code: string): void {
    this.linkedInService.getAccessToken(code).subscribe((linkedInAccessTokenResponse: LinkedInAccessTokenResponse) => {
      const accessToken = linkedInAccessTokenResponse.access_token;

      this.linkedInService.getProfileInformation(accessToken).subscribe((profileInformation: object) => {
        const firstName = _.get(profileInformation, 'firstName.localized.en_US')?.toString();
        this.functions.updateFormValue(this.form, 'firstName', firstName);
        const lastName = _.get(profileInformation, 'lastName.localized.en_US')?.toString();
        this.functions.updateFormValue(this.form, 'lastName', lastName);
        const pictureUrl = _.get(profileInformation, 'profilePicture.displayImage~.elements[3].identifiers[0].identifier')?.toString();
        this.functions.updateFormValue(this.form, 'pictureUrl', pictureUrl);

        this.linkedInService.getEmail(accessToken).subscribe((email: object) => {
          const emailAddress = _.get(email, 'elements[0].handle~.emailAddress')?.toString();
          this.functions.updateFormValue(this.form, 'emailAddress', emailAddress);

          const update = this.functions.createTeacherUpdate(this.teacherLinkedInValues, this.form, this.teacher);
          this.teacherService.updateTeacher(update).subscribe((teacher: Teacher) => {
            this.functions.fillFormWithObject(this.form, this.teacherLinkedInValues, teacher);
          });
        });
      });
    });
  }
}
