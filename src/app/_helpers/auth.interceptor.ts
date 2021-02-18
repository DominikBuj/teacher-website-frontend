import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../_services/auth.service';
import {Constants} from '../constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    /* Adds the JWT bearer token to the request if the user is logged in and the request is coming from the back end */

    const user = this.auth.user.value;
    const isLoggedIn = user && user.token;
    const isBackEndRequest = request.url.startsWith(Constants.API_URL);

    if (isLoggedIn && isBackEndRequest) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${user.token}` }
      });
    }

    return next.handle(request);
  }
}
