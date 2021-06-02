import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GlobalService} from '../_services/global.service';
import {finalize} from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(
    private global: GlobalService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    /* Updates the isLoading variable based on the completion of http calls */
    this.global.isLoading.next(true);
    return next.handle(request).pipe(finalize(() => this.global.isLoading.next(false)));
  }
}
