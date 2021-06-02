import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
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
import {OrcidService} from './_services/orcid.service';
import {PublicationService} from './_services/publication.service';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {LoadingInterceptor} from './_helpers/loading.interceptor';
import {GlobalService} from './_services/global.service';
import {LinkService} from './_services/link.service';
import {DissertationService} from './_services/dissertation.service';
import {DissertationsComponent} from './_components/dissertations/dissertations.component';
import {PostsComponent} from './_components/posts/posts.component';
import {PostComponent} from './_components/posts/post/post.component';
import {PostService} from './_services/post.service';
import {MaterialModule} from './_modules/material.module';
import {DirectivesModule} from './_modules/directives.module';
import {CalendarEditDialogComponent} from './_components/contact/calendar-edit-dialog/calendar-edit-dialog.component';
import {DissertationEditDialogComponent} from './_components/dissertations/dissertation-edit-dialog/dissertation-edit-dialog.component';
import {PublicationEditDialogComponent} from './_components/publications/publication-edit-dialog/publication-edit-dialog.component';
import {LinksPanelComponent} from './_components/links-panel/links-panel.component';
import {LinkEditDialogComponent} from './_components/links-panel/link-edit-dialog/link-edit-dialog.component';
import {DetailsService} from './_services/details.service';
import {PipesModule} from './_modules/pipes.module';
import {LayoutModule} from '@angular/cdk/layout';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {LinkedInImportDialogComponent} from './_components/imports/linked-in-import-dialog/linked-in-import-dialog.component';
import {OrcidImportDialogComponent} from './_components/imports/orcid-import-dialog/orcid-import-dialog.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {FileEditDialogComponent} from './_components/posts/post/file-edit-dialog/file-edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    PublicationsComponent,
    LoginComponent,
    ContactComponent,
    DissertationsComponent,
    PostsComponent,
    PostComponent,
    CalendarEditDialogComponent,
    DissertationEditDialogComponent,
    PublicationEditDialogComponent,
    LinksPanelComponent,
    LinkEditDialogComponent,
    LinkedInImportDialogComponent,
    OrcidImportDialogComponent,
    FileEditDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    DirectivesModule,
    PipesModule,
    LayoutModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    CKEditorModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    AuthService,
    FilesService,
    LinkedInService,
    LoggerService,
    SettingsService,
    TeacherService,
    PostService,
    OrcidService,
    PublicationService,
    LinkService,
    DissertationService,
    GlobalService,
    DetailsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
