/* tslint:disable:variable-name */

export class AccessTokenRequest {
  client_id: string;
  client_secret: string;
  grant_type: string;
  code: string;
  redirect_uri: string;

  constructor(
    client_id: string,
    client_secret: string,
    code: string,
    redirect_uri: string
  ) {
    this.client_id = client_id;
    this.client_secret = client_secret;
    this.grant_type = 'authorization_code';
    this.code = code;
    this.redirect_uri = redirect_uri;
  }
}
