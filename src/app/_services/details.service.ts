import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {LoggerService} from './logger.service';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../constants';
import {catchError, tap} from 'rxjs/operators';
import {Details} from '../_models/details.model';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  details: BehaviorSubject<Details> = new BehaviorSubject<Details>(null);

  constructor(
    private logger: LoggerService,
    private http: HttpClient
  ) {
    this.getDetails().subscribe((details: Details) => this.details.next(details));
  }

  getDetails(): Observable<Details> {
    return this.http.get<Details>(Constants.DETAILS_URL).pipe(
      tap(_ => this.logger.logMessage(`got details`)),
      catchError(this.logger.handleError<Details>(`getting details`))
    );
  }

  updateDetails(update: any): Observable<Details> {
    return this.http.patch<Details>(Constants.DETAILS_URL, update).pipe(
      tap((details: Details) => {
        this.logger.logMessage(`updated details`);
        this.details.next(details);
      }),
      catchError(this.logger.handleError<Details>(`updating details`))
    );
  }
}
