import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UpdatesComponent} from './_components/updates/updates.component';
import {ProfileComponent} from './_components/profile/profile.component';
import {PublicationsComponent} from './_components/publications/publications.component';
import {ContactComponent} from './_components/contact/contact.component';
import {LoginComponent} from './_components/login/login.component';
import {UpdateComponent} from './_components/updates/update/update.component';

const routes: Routes = [
  { path: '', component: UpdatesComponent },
  { path: 'update/:id', component: UpdateComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'publications', component: PublicationsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
