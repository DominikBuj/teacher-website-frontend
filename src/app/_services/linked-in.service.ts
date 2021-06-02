import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LinkedInAccessTokenResponse} from '../_models/linked-in-access-token-response.model';
import {Constants} from '../constants';
import {catchError, tap} from 'rxjs/operators';
import {LoggerService} from './logger.service';
import {AccessTokenRequest} from '../_models/access-token-request.model';

@Injectable({
  providedIn: 'root'
})
export class LinkedInService {

  constructor(
    private logger: LoggerService,
    private http: HttpClient
  ) {
  }

  get authorization(): boolean {
    const authorization = localStorage.getItem('linkedIn');
    if (!!authorization) {
      return (authorization === 'true');
    }
    localStorage.setItem('linkedIn', 'false');
    return false;
  }

  set authorization(value: boolean) {
    localStorage.setItem('linkedIn', value.toString());
  }

  getAccessToken(authorizationCode: string): Observable<LinkedInAccessTokenResponse> {
    const accessTokenRequest = new AccessTokenRequest(
      Constants.LINKED_IN_CLIENT_ID,
      Constants.LINKED_IN_CLIENT_SECRET,
      authorizationCode,
      Constants.LINKED_IN_REDIRECT_URI
    );

    return this.http.post<LinkedInAccessTokenResponse>(Constants.LINKED_IN_ACCESS_TOKEN_URL, accessTokenRequest).pipe(
      tap(_ => this.logger.logMessage(`got linked in access token`)),
      catchError(this.logger.handleError<LinkedInAccessTokenResponse>(`getting linked in access token`))
    );
  }

  getProfileInformation(accessToken: string): Observable<object> {
    const url = `${Constants.LINKED_IN_PROFILE_URL}/${accessToken}`;
    return this.http.get<object>(url).pipe(
      tap(_ => this.logger.logMessage(`got linked in profile information`)),
      catchError(this.logger.handleError<object>(`getting linked in profile information`))
    );
  }

  getEmail(accessToken: string): Observable<object> {
    const url = `${Constants.LINKED_IN_EMAIL_URL}/${accessToken}`;
    return this.http.get<object>(url).pipe(
      tap(_ => this.logger.logMessage(`got linked in email`)),
      catchError(this.logger.handleError<object>(`getting linked in email`))
    );
  }
}
