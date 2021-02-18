import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Constants} from '../constants';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {LoggerService} from './logger.service';
import {AccessTokenRequest} from '../_models/access-token-request.model';
import {OrcidAccessTokenResponse} from '../_models/orcid-access-token-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrcidService {

  constructor(
    private logger: LoggerService,
    private http: HttpClient
  ) { }

  getAccessToken(authorizationCode: string): Observable<OrcidAccessTokenResponse> {
    const accessTokenRequest = new AccessTokenRequest(
      Constants.ORCID_CLIENT_ID,
      Constants.ORCID_CLIENT_SECRET,
      authorizationCode,
      Constants.ORCID_REDIRECT_URL
    );

    return this.http.post<OrcidAccessTokenResponse>(Constants.ORCID_ACCESS_TOKEN_URL, accessTokenRequest).pipe(
      tap(_ => this.logger.logMessage(`got ORCID access token`)),
      catchError(this.logger.handleError<OrcidAccessTokenResponse>(`getting ORCID access token`))
    );
  }

  getRecord(accessToken: string, orcidId: string): Observable<object> {
    const url = `${Constants.ORCID_RECORD}/${accessToken}/${orcidId}`;
    return this.http.get<object>(url).pipe(
      tap(_ => this.logger.logMessage(`got ORCID record`)),
      catchError(this.logger.handleError<object>(`getting ORCID record`))
    );
  }

  getWorks(accessToken: string, orcidId: string): Observable<object> {
    const url = `${Constants.ORCID_WORKS}/${accessToken}/${orcidId}`;
    return this.http.get<object>(url).pipe(
      tap(_ => this.logger.logMessage(`got ORCID works`)),
      catchError(this.logger.handleError<object>(`getting ORCID works`))
    );
  }
}
