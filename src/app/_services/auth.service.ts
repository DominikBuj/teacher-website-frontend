import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../_models/user.model';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../constants';
import {tap} from 'rxjs/operators';
import {LoginForm} from '../_models/login-form.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: BehaviorSubject<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.user = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
  }

  login(loginForm: LoginForm): Observable<User> {
    return this.http.post<User>(Constants.LOGIN_URL, loginForm).pipe(
      tap((user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.user.next(user);
        return user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.user.next(null);
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }
}
