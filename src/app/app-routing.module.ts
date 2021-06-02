import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from './_components/profile/profile.component';
import {PublicationsComponent} from './_components/publications/publications.component';
import {ContactComponent} from './_components/contact/contact.component';
import {LoginComponent} from './_components/login/login.component';
import {DissertationsComponent} from './_components/dissertations/dissertations.component';
import {PostComponent} from './_components/posts/post/post.component';
import {PostsComponent} from './_components/posts/posts.component';

const routes: Routes = [
  {path: '', component: PostsComponent},
  {path: 'posts', component: PostsComponent},
  {path: 'post', redirectTo: 'post/', pathMatch: 'full'},
  {path: 'post/:id', component: PostComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'publications', component: PublicationsComponent},
  {path: 'dissertations', component: DissertationsComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'auth/login', component: LoginComponent},
  {path: '**', redirectTo: 'posts'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
