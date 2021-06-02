import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from '../_services/auth.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string;
        if (error.error instanceof ErrorEvent) {
          /* Client-Side Error */
          errorMessage = `Error Message: ${error.error.message}`;
        }
        else {
          /* Server-Side Error */
          errorMessage = `Error Message: ${error.message}`;
          // Logs out the user when an authorization error occurs
          if (error.status === 401 || error.status === 403) this.auth.logout();
        }
        return throwError(errorMessage);
      })
    );
  }
}
