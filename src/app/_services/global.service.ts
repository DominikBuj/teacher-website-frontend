import {Injectable} from '@angular/core';
import {SettingsService} from './settings.service';
import {Settings} from '../_models/settings.model';
import {AuthService} from './auth.service';
import {User} from '../_entities/user.model';
import {BehaviorSubject} from 'rxjs';
import {Operation} from '../_models/operation.enum';
import {DissertationStatus} from '../_models/dissertation-status.enum';
import {LinkType} from '../_models/link-type.enum';
import {PublicationType} from '../_models/publication-type.enum';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  readonly operations = Operation;
  readonly dissertationStatuses = DissertationStatus;
  readonly dissertationStatusLabels: Map<string, string> = new Map<string, string>([
    [DissertationStatus.Proposed.toString(), 'Proposed'],
    [DissertationStatus.InProgress.toString(), 'In progress'],
    [DissertationStatus.Completed.toString(), 'Completed']
  ]);
  readonly linkTypes = LinkType;
  readonly linkTypeLabels: Map<string, string> = new Map<string, string>([
    [LinkType.LinkedIn.toString(), 'LinkedIn'],
    [LinkType.Orcid.toString(), 'ORCID'],
    [LinkType.ResearchGate.toString(), 'ResearchGate'],
    [LinkType.Other.toString(), 'Other']
  ]);
  readonly publicationTypes = PublicationType;
  readonly publicationTypeLabels: Map<string, string> = new Map<string, string>([
    [PublicationType.Book.toString(), 'Book'],
    [PublicationType.Article.toString(), 'Article'],
    [PublicationType.Dissertation.toString(), 'Dissertation'],
    [PublicationType.Other.toString(), 'Other']
  ]);

  isLoggedIn: boolean;
  isEditing: boolean;
  isDarkMode: boolean;
  isLoading: BehaviorSubject<boolean>;
  error = false;
  areAnimationsDisabled = true;

  isScreenSmall = false;
  isScreenMedium = false;
  isScreenLarge = false;
  isScreenVeryLarge = true;

  constructor(
    private settings: SettingsService,
    private auth: AuthService
  ) {
    this.auth.user.subscribe((user: User) => user ? this.isLoggedIn = true : this.isLoggedIn = false);
    this.settings.settings.subscribe((currentSettings: Settings) => {
      this.isEditing = currentSettings.isEditing;
      this.isDarkMode = currentSettings.isDarkMode;
    });
    this.isLoading = new BehaviorSubject<boolean>(false);
  }

  canEdit(): boolean {
    return (this.isLoggedIn && this.isEditing);
  }
}
