import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Update} from '../_models/update.model';
import {catchError, tap} from 'rxjs/operators';
import {Constants} from '../constants';
import {LoggerService} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  updates: BehaviorSubject<Update[]>;

  constructor(
    private logger: LoggerService,
    private http: HttpClient
  ) {
    this.updates = new BehaviorSubject<Update[]>([]);
    this.getUpdates().subscribe((updates: Update[]) => this.updates.next(updates));
  }

  getUpdates(): Observable<Update[]> {
    return this.http.get<Update[]>(Constants.UPDATE_URL).pipe(
      tap(_ => this.logger.logMessage(`got updates`)),
      catchError(this.logger.handleError<Update[]>(`getting updates`))
    );
  }

  getUpdate(id: number): Observable<Update> {
    const url = `${Constants.UPDATE_URL}/${id}`;
    return this.http.get<Update>(url).pipe(
      tap((update: Update) => this.logger.logMessage(`got update of id ${update.id}`)),
      catchError(this.logger.handleError<Update>(`getting update of id ${id}`))
    );
  }

  addUpdate(update: Update): Observable<Update> {
    return this.http.post<Update>(Constants.UPDATE_URL, update).pipe(
      tap((addedUpdate: Update) => {
        const updates = this.updates.value;
        updates.push(addedUpdate);
        this.updates.next(updates);
        this.logger.logMessage(`added update of id ${addedUpdate.id}`);
      }),
      catchError(this.logger.handleError<Update>(`adding update`))
    );
  }

  replaceUpdate(update: Update): Observable<Update> {
    const url = `${Constants.UPDATE_URL}/${update.id}`;
    return this.http.put<Update>(url, update).pipe(
      tap((replacedUpdate: Update) => {
        const updates = this.updates.value;
        update[this.updates.value.indexOf(update)] = replacedUpdate;
        this.updates.next(updates);
        this.logger.logMessage(`replaced update of id ${replacedUpdate.id}`);
      }),
      catchError(this.logger.handleError<Update>(`replacing update of id ${update.id}`))
    );
  }

  deleteUpdate(update: Update): Observable<{}> {
    const url = `${Constants.UPDATE_URL}/${update.id}`;
    return this.http.delete(url).pipe(
      tap(_ => {
        const updates = this.updates.value;
        updates.splice(updates.indexOf(update), 1);
        this.updates.next(updates);
        this.logger.logMessage(`deleted update of id ${update.id}`);
      }),
      catchError(this.logger.handleError(`deleting update of id ${update.id}`))
    );
  }
}
