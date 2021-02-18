import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Constants} from '../../constants';
import {ActivatedRoute} from '@angular/router';
import {OrcidService} from '../../_services/orcid.service';
import {OrcidAccessTokenResponse} from '../../_models/orcid-access-token-response.model';
import {Publication} from '../../_models/publication.model';
import {PublicationService} from '../../_services/publication.service';
import * as _ from 'lodash';
import {Authorization} from '../../_models/authorization.enum';
import {FunctionsService} from '../../_services/functions.service';
import {AuthService} from '../../_services/auth.service';
import {SettingsService} from '../../_services/settings.service';
import {MatPaginator} from '@angular/material/paginator';
import {Observable, of} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {PublicationEditComponent} from './publication-edit/publication-edit.component';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit, OnDestroy {
  orcidAuthorization: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  publications: Observable<Publication[]>;
  publicationsDataSource: MatTableDataSource<Publication>;

  orcidAuthorizationUrl = Constants.ORCID_AUTHORIZATION_URL;

  constructor(
    private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public functions: FunctionsService,
    private auth: AuthService,
    private settings: SettingsService,
    private orcidService: OrcidService,
    private publicationService: PublicationService
  ) {
    this.publications = of([]);
    this.publicationsDataSource = new MatTableDataSource<Publication>([]);
  }

  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
    this.publicationsDataSource.paginator = this.paginator;
    this.publications = this.publicationsDataSource.connect();

    this.publicationService.publications.subscribe((publications: Publication[]) => {
      this.publicationsDataSource.data = publications;
      this.publicationsDataSource._updateChangeSubscription();
    });

    this.orcidAuthorization = this.functions.getAuthorization(Authorization.Orcid);
    const orcidAuthorizationCode = this.route.snapshot.queryParamMap.get('code');
    if (orcidAuthorizationCode && this.orcidAuthorization) {
      this.orcidAuthorization = this.functions.setAuthorization(Authorization.Orcid, false);
      this.importOrcidPublications(orcidAuthorizationCode);
    }
  }

  ngOnDestroy(): void {
    if (this.publicationsDataSource) {
      this.publicationsDataSource.disconnect();
    }
  }

  switchOrcidAuthorization(): void {
    this.orcidAuthorization = this.functions.setAuthorization(Authorization.Orcid, true);
  }

  addWork(work: object): void {
    const title = _.get(work, 'work-summary[0].title.title.value')?.toString();
    const subtitle = _.get(work, 'work-summary[0].title.subtitle.value')?.toString();
    const publisher = _.get(work, 'work-summary[0].journal-title.value')?.toString();
    const type = _.get(work, 'work-summary[0].type')?.toString();
    const link = _.get(work, 'work-summary[0].url.value')?.toString();
    const year = +_.get(work, 'work-summary[0].publication-date.year.value');
    const month = +_.get(work, 'work-summary[0].publication-date.month.value');
    const day = +_.get(work, 'work-summary[0].publication-date.day.value');

    const date = year ? new Date(year, month ? month : 0, day ? day : 0).getTime() : undefined;
    const publication = new Publication(undefined, title, subtitle, publisher, type, link, date);

    this.publicationService.addPublication(publication).subscribe();
  }

  importOrcidPublications(authorizationCode: string): void {
    this.orcidService.getAccessToken(authorizationCode).subscribe((accessTokenResponse: OrcidAccessTokenResponse) => {
      const accessToken = accessTokenResponse.access_token;
      const orcidId = accessTokenResponse.orcid;

      this.orcidService.getWorks(accessToken, orcidId).subscribe((response: object) => {
        response[`group`].forEach((work: object) => this.addWork(work));
      });
    });
  }

  addPublication(): void {
    const blankPublication = new Publication(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    const dialogRef = this.dialog.open(PublicationEditComponent, { data: blankPublication });
    dialogRef.afterClosed().subscribe((addedPublication: Publication) => {
      if (addedPublication) {
        this.publicationService.addPublication(addedPublication).subscribe();
      }
    });
  }

  updatePublication(publication: Publication): void {
    const currentPublication = new Publication(
      publication.id,
      publication.title,
      publication.subtitle,
      publication.publisher,
      publication.type,
      publication.link,
      publication.date
    );

    const dialogRef = this.dialog.open(PublicationEditComponent, { data: currentPublication });
    dialogRef.afterClosed().subscribe((editedPublication: Publication) => {
      if (editedPublication) {
        this.publicationService.replacePublication(editedPublication).subscribe((updatedPublication: Publication) => {
          this.publicationsDataSource.data[this.publicationsDataSource.data.indexOf(publication)] = updatedPublication;
          this.publicationsDataSource._updateChangeSubscription();
        });
      }
    });
  }

  deletePublication(publication: Publication): void {
    this.publicationService.deletePublication(publication).subscribe();
  }
}
