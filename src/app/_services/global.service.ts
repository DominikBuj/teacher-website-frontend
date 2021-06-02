import {Injectable} from '@angular/core';
import {SettingsService} from './settings.service';
import {Settings} from '../_models/settings.model';
import {AuthService} from './auth.service';
import {User} from '../_models/user.model';
import {BehaviorSubject} from 'rxjs';
import {Operation} from '../_models/operation.enum';
import {DissertationStatus} from '../_models/dissertation-status.enum';
import {LinkType} from '../_models/link-type.enum';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  readonly operations = Operation;
  readonly dissertationStatuses = DissertationStatus;
  readonly dissertationStatusLabels: Map<string, string> = new Map<string, string>([
    [DissertationStatus.Proposed.toString(), 'Proponowane'],
    [DissertationStatus.InProgress.toString(), 'W realizacji'],
    [DissertationStatus.Completed.toString(), 'Ukończone']
  ]);
  readonly linkTypes = LinkType;
  readonly linkTypeLabels: Map<string, string> = new Map<string, string>([
    [LinkType.LinkedIn.toString(), 'LinkedIn'],
    [LinkType.Orcid.toString(), 'Orcid'],
    [LinkType.ResearchGate.toString(), 'ResearchGate'],
    [LinkType.Other.toString(), 'Inne']
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
