import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Dissertation} from '../_entities/dissertation.model';
import {FunctionsService} from './functions.service';
import {LoggerService} from './logger.service';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../constants';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DissertationService {
  dissertations: BehaviorSubject<Dissertation[]>;

  constructor(
    private functions: FunctionsService,
    private logger: LoggerService,
    private http: HttpClient
  ) {
    this.dissertations = new BehaviorSubject<Dissertation[]>([]);
    this.getDissertations().subscribe((dissertations: Dissertation[]) => this.dissertations.next(dissertations));
  }

  getDissertations(): Observable<Dissertation[]> {
    return this.http.get<Dissertation[]>(Constants.DISSERTATION_URL).pipe(
      tap(_ => this.logger.logMessage(`got dissertations`)),
      catchError(this.logger.handleError<Dissertation[]>(`getting dissertations`))
    );
  }

  addDissertation(dissertation: Dissertation): Observable<Dissertation> {
    return this.http.post<Dissertation>(Constants.DISSERTATION_URL, dissertation).pipe(
      tap((addedDissertation: Dissertation) => {
        const dissertations = this.dissertations.value;
        dissertations.push(addedDissertation);
        this.dissertations.next(dissertations);
        this.logger.logMessage(`added dissertation of id ${addedDissertation.id}`);
      }),
      catchError(this.logger.handleError<Dissertation>(`adding dissertation`))
    );
  }

  replaceDissertation(dissertation: Dissertation): Observable<Dissertation> {
    const url = `${Constants.DISSERTATION_URL}/${dissertation.id}`;
    return this.http.put<Dissertation>(url, dissertation).pipe(
      tap((replacedDissertation: Dissertation) => {
        const dissertations = this.dissertations.value;
        const index = this.functions.indexOf<Dissertation>(dissertations, dissertation.id);
        if (index !== null) {
          dissertations[index] = replacedDissertation;
          this.dissertations.next(dissertations);
          this.logger.logMessage(`replaced dissertation of id ${replacedDissertation.id}`);
        }
      }),
      catchError(this.logger.handleError<Dissertation>(`replacing dissertation of id ${dissertation.id}`))
    );
  }

  deleteDissertation(dissertation: Dissertation): Observable<{}> {
    const url = `${Constants.DISSERTATION_URL}/${dissertation.id}`;
    return this.http.delete(url).pipe(
      tap(_ => {
        const dissertations = this.dissertations.value;
        const index = this.functions.indexOf<Dissertation>(dissertations, dissertation.id);
        if (index !== null) {
          dissertations.splice(index, 1);
          this.dissertations.next(dissertations);
          this.logger.logMessage(`deleted dissertation of id ${dissertation.id}`);
        }
      }),
      catchError(this.logger.handleError(`deleting dissertation of id ${dissertation.id}`))
    );
  }
}
