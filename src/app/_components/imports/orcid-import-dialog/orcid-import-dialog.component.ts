import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {GlobalService} from '../../../_services/global.service';
import {Publication} from '../../../_models/publication.model';
import * as _ from 'lodash';
import {OrcidAccessTokenResponse} from '../../../_models/orcid-access-token-response.model';
import {OrcidService} from '../../../_services/orcid.service';
import {PublicationService} from '../../../_services/publication.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {filter} from 'rxjs/operators';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-orcid-import-dialog',
  templateUrl: './orcid-import-dialog.component.html',
  styleUrls: ['./orcid-import-dialog.component.scss']
})
export class OrcidImportDialogComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<Publication> = new MatTableDataSource<Publication>();
  selection: SelectionModel<Publication> = new SelectionModel<Publication>(true, []);
  columns = ['select', 'title', 'subtitle', 'publisher', 'type', 'date'];
  sort: MatSort = null;

  @ViewChild(MatSort) set matSort(matSort: MatSort) {
    this.sort = matSort;
    this.setDataSourceAttributes();
    this.changeDetectorRef.detectChanges();
  }

  constructor(
    public global: GlobalService,
    private orcidService: OrcidService,
    private publicationService: PublicationService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<OrcidImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  private static getPublicationFromOrcidWork(work: object): Publication {
    const title = _.get(work, 'work-summary[0].title.title.value')?.toString();
    const subtitle = _.get(work, 'work-summary[0].title.subtitle.value')?.toString();
    const publisher = _.get(work, 'work-summary[0].journal-title.value')?.toString();
    const type = _.get(work, 'work-summary[0].type')?.toString();
    const url = _.get(work, 'work-summary[0].url.value')?.toString();

    const year = +_.get(work, 'work-summary[0].publication-date.year.value');
    const month = +_.get(work, 'work-summary[0].publication-date.month.value');
    const day = +_.get(work, 'work-summary[0].publication-date.day.value');
    const date = !!year ? new Date(year, !!month ? month : 0, !!day ? day : 0).getTime() : undefined;

    return {id: undefined, title, subtitle, publisher, type, url, date} as Publication;
  }

  private setDataSourceAttributes(): void {
    this.dataSource.sort = this.sort;
  }

  private getPublicationsFromOrcid(): void {
    this.orcidService.getAccessToken(this.data?.authorizationCode)
      .pipe(filter((accessTokenResponse: OrcidAccessTokenResponse) => !!accessTokenResponse))
      .subscribe((accessTokenResponse: OrcidAccessTokenResponse) => {
        const accessToken = accessTokenResponse.access_token;
        const orcidId = accessTokenResponse.orcid;

        this.orcidService.getWorks(accessToken, orcidId).pipe(filter((response: object) => !!response))
          .subscribe(((response: object) => {
            const orcidPublications = [];
            response[`group`].forEach((work: object) => {
              orcidPublications.push(OrcidImportDialogComponent.getPublicationFromOrcidWork(work));
            });

            this.dataSource.data = orcidPublications;
            this.changeDetectorRef.detectChanges();
          }));
      });
  }

  ngOnInit(): void {
    this.getPublicationsFromOrcid();
  }

  ngOnDestroy(): void {
    this.dataSource?.disconnect();
  }

  isAllSelected(): boolean {
    const numberOfSelectedRows = this.selection.selected.length;
    const numberOfRows = this.dataSource.data.length;
    return numberOfSelectedRows === numberOfRows;
  }

  selectAll(): void {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onSubmit(): void {
    const addedPublications = [];
    this.dataSource.data.forEach((publication: Publication) => {
      if (this.selection.isSelected(publication)) {
        addedPublications.push(publication);
      }
    });

    for (let i = 0; i < addedPublications.length; ++i) {
      (i === addedPublications.length - 1) ?
        this.publicationService.addPublication(addedPublications[i]).subscribe(() => this.dialogRef.close()) :
        this.publicationService.addPublication(addedPublications[i]).subscribe();
    }
  }
}
