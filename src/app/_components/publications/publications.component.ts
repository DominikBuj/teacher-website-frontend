import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Constants} from '../../constants';
import {ActivatedRoute} from '@angular/router';
import {OrcidService} from '../../_services/orcid.service';
import {Publication} from '../../_models/publication.model';
import {PublicationService} from '../../_services/publication.service';
import {FunctionsService} from '../../_services/functions.service';
import {SettingsService} from '../../_services/settings.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {GlobalService} from '../../_services/global.service';
import {PublicationEditDialogComponent} from './publication-edit-dialog/publication-edit-dialog.component';
import {Animations} from '../../_helpers/animations';
import {MatSort} from '@angular/material/sort';
import {OrcidImportDialogComponent} from '../imports/orcid-import-dialog/orcid-import-dialog.component';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
  animations: [
    Animations.easeInOutVerticalEditingContainer,
    Animations.easeInOutEditingButton
  ]
})
export class PublicationsComponent implements OnInit, AfterViewInit, OnDestroy {
  publicationsDataSource: MatTableDataSource<Publication> = new MatTableDataSource<Publication>();
  orcidAuthorizationUrl = Constants.ORCID_AUTHORIZATION_URL;
  paginator: MatPaginator = null;
  sort: MatSort = null;
  filterValue = '';
  columns: string[] = ['title', 'subtitle', 'publisher', 'type', 'date'];

  private setDataSourceAttributes(): void {
    this.publicationsDataSource.paginator = this.paginator;
    this.publicationsDataSource.sort = this.sort;
  }

  @ViewChild(MatPaginator) set matPaginator(matPaginator: MatPaginator) {
    this.paginator = matPaginator;
    this.setDataSourceAttributes();
    this.changeDetectorRef.detectChanges();
  }

  @ViewChild(MatSort) set matSort(matSort: MatSort) {
    this.sort = matSort;
    this.setDataSourceAttributes();
    this.changeDetectorRef.detectChanges();
  }

  constructor(
    private route: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private functions: FunctionsService,
    public global: GlobalService,
    private settings: SettingsService,
    public orcidService: OrcidService,
    private publicationService: PublicationService
  ) {
  }

  ngOnInit(): void {
    this.publicationService.publications.pipe(filter((publications: Publication[]) => !!publications))
      .subscribe((publications: Publication[]) => {
        this.publicationsDataSource.data = publications;
        this.publicationsDataSource._updateChangeSubscription();

        const authorizationCode = this.route.snapshot.queryParamMap.get('code');
        if (!!authorizationCode && this.orcidService.authorization) {
          this.orcidService.authorization = false;
          const data = {publications: this.publicationsDataSource.data, authorizationCode};
          this.functions.openDialog(OrcidImportDialogComponent, data);
        }
    });
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.publicationsDataSource?.disconnect();
  }

  applyFilter(event: KeyboardEvent): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.publicationsDataSource.filter = this.filterValue.trim().toLowerCase();
    this.publicationsDataSource.paginator.firstPage();
  }

  addPublication(): void {
    const data = {publication: {} as Publication};
    this.functions.openDialog(PublicationEditDialogComponent, data);
  }

  replacePublication(publication: Publication): void {
    const data = {
      publication: {
        id: publication.id,
        title: publication.title,
        subtitle: publication.subtitle,
        publisher: publication.publisher,
        type: publication.type,
        url: publication.url,
        date: publication.date
      } as Publication
    };
    this.functions.openDialog(PublicationEditDialogComponent, data);
  }

  deletePublication(publication: Publication): void {
    this.publicationService.deletePublication(publication).subscribe();
  }
}
