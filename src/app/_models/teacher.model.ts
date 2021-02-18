export class Teacher {
  pictureUrl: string;
  firstName: string;
  lastName: string;
  university: string;
  subject: string;
  about: string;
  calendarUrl: string;
  emailAddress: string;
  phoneNumber: string;

  constructor(
    pictureUrl: string,
    firstName: string,
    lastName: string,
    university: string,
    subject: string,
    about: string,
    calendarUrl: string,
    emailAddress: string,
    phoneNumber: string
  ) {
    this.pictureUrl = pictureUrl;
    this.firstName = firstName;
    this.lastName = lastName;
    this.university = university;
    this.subject = subject;
    this.about = about;
    this.calendarUrl = calendarUrl;
    this.emailAddress = emailAddress;
    this.phoneNumber = phoneNumber;
  }

  copy(teacher: Teacher): void {
    Object.keys(teacher).forEach((key: string) => this[key] = teacher[key]);
  }
}
