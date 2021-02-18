import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {UpdatesComponent} from './_components/updates/updates.component';
import {ProfileComponent} from './_components/profile/profile.component';
import {PublicationsComponent} from './_components/publications/publications.component';
import {LoginComponent} from './_components/login/login.component';
import {ContactComponent} from './_components/contact/contact.component';
import {AuthInterceptor} from './_helpers/auth.interceptor';
import {AuthService} from './_services/auth.service';
import {FilesService} from './_services/files.service';
import {LinkedInService} from './_services/linked-in.service';
import {LoggerService} from './_services/logger.service';
import {SettingsService} from './_services/settings.service';
import {TeacherService} from './_services/teacher.service';
import {UpdateService} from './_services/update.service';
import {OrcidService} from './_services/orcid.service';
import {PublicationService} from './_services/publication.service';
import {ProfileEditComponent} from './_components/profile/profile-edit/profile-edit.component';
import {UpdateComponent} from './_components/updates/update/update.component';
import {PublicationEditComponent} from './_components/publications/publication-edit/publication-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    UpdatesComponent,
    ProfileComponent,
    PublicationsComponent,
    LoginComponent,
    ContactComponent,
    ProfileEditComponent,
    UpdateComponent,
    PublicationEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    FilesService,
    LinkedInService,
    LoggerService,
    SettingsService,
    TeacherService,
    UpdateService,
    OrcidService,
    PublicationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
