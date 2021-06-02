import {Injectable} from '@angular/core';
import {LoggerService} from './logger.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {Constants} from '../constants';
import {catchError, tap} from 'rxjs/operators';
import {Publication} from '../_models/publication.model';
import {FunctionsService} from './functions.service';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  publications: BehaviorSubject<Publication[]>;

  constructor(
    private functions: FunctionsService,
    private logger: LoggerService,
    private http: HttpClient
  ) {
    this.publications = new BehaviorSubject<Publication[]>([]);
    this.getPublications().subscribe((publications: Publication[]) => this.publications.next(publications));
  }

  getPublications(): Observable<Publication[]> {
    return this.http.get<Publication[]>(Constants.PUBLICATION_URL).pipe(
      tap(_ => this.logger.logMessage(`got publications`)),
      catchError(this.logger.handleError<Publication[]>(`getting publications`))
    );
  }

  addPublication(publication: Publication): Observable<Publication> {
    return this.http.post<Publication>(Constants.PUBLICATION_URL, publication).pipe(
      tap((addedPublication: Publication) => {
        const publications = this.publications.value;
        publications.push(addedPublication);
        this.publications.next(publications);
        this.logger.logMessage(`added publication of id ${addedPublication.id}`);
      }),
      catchError(this.logger.handleError<Publication>(`adding publication`))
    );
  }

  replacePublication(publication: Publication): Observable<Publication> {
    const url = `${Constants.PUBLICATION_URL}/${publication.id}`;
    return this.http.put<Publication>(url, publication).pipe(
      tap((replacedPublication: Publication) => {
        const publications = this.publications.value;
        const index = this.functions.indexOf<Publication>(publications, publication.id);
        if (index !== null) {
          publications[index] = replacedPublication;
          this.publications.next(publications);
          this.logger.logMessage(`replaced publication of id ${replacedPublication.id}`);
        }
      }),
      catchError(this.logger.handleError<Publication>(`replacing publication of id ${publication.id}`))
    );
  }

  deletePublication(publication: Publication): Observable<{}> {
    const url = `${Constants.PUBLICATION_URL}/${publication.id}`;
    return this.http.delete(url).pipe(
      tap(_ => {
        const publications = this.publications.value;
        const index = this.functions.indexOf<Publication>(publications, publication.id);
        if (index !== null) {
          publications.splice(index, 1);
          this.publications.next(publications);
          this.logger.logMessage(`deleted publication of id ${publication.id}`);
        }
      }),
      catchError(this.logger.handleError(`deleting publication of id ${publication.id}`))
    );
  }
}
