export class Constants {
  public static readonly API_URL = 'https://localhost:5001/api';
  public static readonly LOGIN_URL = Constants.API_URL + '/auth/login';
  public static readonly TEACHER_URL = Constants.API_URL + '/teacher';
  public static readonly IMAGE_URL = Constants.API_URL + '/files/image';
  public static readonly FILE_URL = Constants.API_URL + '/files/file';
  public static readonly UPDATE_URL = Constants.API_URL + '/updates';
  public static readonly PUBLICATION_URL = Constants.API_URL + '/publications';

  public static readonly LINKED_IN_CLIENT_ID = '78h24m4vkdn1aw';
  public static readonly LINKED_IN_CLIENT_SECRET = '3pARoUqmqjWybkZc';
  public static readonly LINKED_IN_REDIRECT_URI = 'https://localhost:4200/profile/';
  public static readonly LINKED_IN_SCOPE = 'r_liteprofile%20r_emailaddress';
  public static readonly LINKED_IN_STATE = 'zBbc0Xvsbu';

  public static readonly LINKED_IN_AUTHORIZATION_URL = `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${Constants.LINKED_IN_CLIENT_ID}&` +
    `redirect_uri=${Constants.LINKED_IN_REDIRECT_URI}&` +
    `state=${Constants.LINKED_IN_STATE}&` +
    `scope=${Constants.LINKED_IN_SCOPE}`;
  public static readonly LINKED_IN_ACCESS_TOKEN_URL = Constants.API_URL + '/linkedIn';
  public static readonly LINKED_IN_PROFILE_URL = Constants.API_URL + '/linkedIn/profile';
  public static readonly LINKED_IN_EMAIL_URL = Constants.API_URL + '/linkedIn/email';

  public static readonly ORCID_CLIENT_ID = 'APP-UGR8SQO99JF6ASUI';
  public static readonly ORCID_CLIENT_SECRET = '6199a6f9-b88e-4ffb-9c7a-b0b768236727';
  public static readonly ORCID_REDIRECT_URL = 'https://localhost:4200/publications';

  public static readonly ORCID_AUTHORIZATION_URL = `https://orcid.org/oauth/authorize?` +
    `client_id=${Constants.ORCID_CLIENT_ID}&` +
    `response_type=code&` +
    `scope=/authenticate&` +
    `redirect_uri=${Constants.ORCID_REDIRECT_URL}`;
  public static readonly ORCID_ACCESS_TOKEN_URL = Constants.API_URL + '/orcid';
  public static readonly ORCID_RECORD = Constants.API_URL + '/orcid/record';
  public static readonly ORCID_WORKS = Constants.API_URL + '/orcid/works';

  public static readonly LOGIN_PATH = '/auth/login';
}
