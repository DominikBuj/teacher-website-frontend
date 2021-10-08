import {DissertationStatus} from './_models/dissertation-status.enum';
import {Operation} from './_models/operation.enum';

export class Constants {
  public static readonly API_URL = 'https://localhost:5001/api';
  public static readonly LOGIN_URL = Constants.API_URL + '/auth/login';
  public static readonly TEACHER_URL = Constants.API_URL + '/teacher';
  public static readonly IMAGE_URL = Constants.API_URL + '/files/image';
  public static readonly FILE_URL = Constants.API_URL + '/files/file';
  public static readonly POST_URL = Constants.API_URL + '/posts';
  public static readonly PUBLICATION_URL = Constants.API_URL + '/publications';
  public static readonly LINK_URL = Constants.API_URL + '/links';
  public static readonly DISSERTATION_URL = Constants.API_URL + '/dissertations';
  public static readonly DETAILS_URL = Constants.API_URL + '/details';

  public static readonly RESOURCES_URL = 'https://localhost:5001/Resources';
  public static readonly FILES_URL = Constants.RESOURCES_URL + '/Files';
  public static readonly IMAGES_URL = Constants.RESOURCES_URL + '/Images';
  public static readonly BACKGROUNDS_URL = Constants.IMAGES_URL + '/Backgrounds';
  public static readonly ICONS_URL = Constants.IMAGES_URL + '/Icons';
  public static readonly SITE_LOGO_LIGHT_URL = Constants.ICONS_URL + '/site_logo_light.png';
  public static readonly SITE_LOGO_DARK_URL = Constants.ICONS_URL + '/site_logo_dark.png';

  public static readonly LINKED_IN_CLIENT_ID = '782gsavfid0nxq';
  public static readonly LINKED_IN_CLIENT_SECRET = 'if6eq53IDUDu8GFG';
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

  public static readonly OPERATION = Operation;
  public static readonly DISSERTATION_STATUS = DissertationStatus;
  public static readonly DISSERTATION_STATUS_LABELS = new Map<string, string>([
    [DissertationStatus.Proposed.toString(), 'Proposed'],
    [DissertationStatus.InProgress.toString(), 'In progress'],
    [DissertationStatus.Completed.toString(), 'Completed']
  ]);
}
