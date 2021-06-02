import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Link} from '../_models/link.model';
import {LoggerService} from './logger.service';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../constants';
import {catchError, tap} from 'rxjs/operators';
import {FunctionsService} from './functions.service';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  links: BehaviorSubject<Link[]>;

  constructor(
    private functions: FunctionsService,
    private logger: LoggerService,
    private http: HttpClient
  ) {
    this.links = new BehaviorSubject<Link[]>([]);
    this.getLinks().subscribe((links: Link[]) => this.links.next(links));
  }

  getLinks(): Observable<Link[]> {
    return this.http.get<Link[]>(Constants.LINK_URL).pipe(
      tap(_ => this.logger.logMessage(`got links`)),
      catchError(this.logger.handleError<Link[]>(`getting links`))
    );
  }

  addLink(link: Link): Observable<Link> {
    return this.http.post<Link>(Constants.LINK_URL, link).pipe(
      tap((addedLink: Link) => {
        const links = this.links.value;
        links.push(addedLink);
        this.links.next(links);
        this.logger.logMessage(`added link of id ${addedLink.id}`);
      }),
      catchError(this.logger.handleError<Link>(`adding link`))
    );
  }

  replaceLink(link: Link): Observable<Link> {
    const url = `${Constants.LINK_URL}/${link.id}`;
    return this.http.put<Link>(url, link).pipe(
      tap((replacedLink: Link) => {
        const links = this.links.value;
        const index = this.functions.indexOf<Link>(links, link.id);
        if (index !== null) {
          links[index] = replacedLink;
          this.links.next(links);
          this.logger.logMessage(`replaced link of id ${replacedLink.id}`);
        }
      }),
      catchError(this.logger.handleError<Link>(`replacing link of id ${link.id}`))
    );
  }

  deleteLink(link: Link): Observable<{}> {
    const url = `${Constants.LINK_URL}/${link.id}`;
    return this.http.delete(url).pipe(
      tap(_ => {
        const links = this.links.value;
        const index = this.functions.indexOf<Link>(links, link.id);
        if (index !== null) {
          links.splice(index, 1);
          this.links.next(links);
          this.logger.logMessage(`deleted link of id ${link.id}`);
        }
      }),
      catchError(this.logger.handleError(`deleting link of id ${link.id}`))
    );
  }
}
