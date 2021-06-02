import {AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DissertationStatus} from '../../_models/dissertation-status.enum';
import {Dissertation} from '../../_models/dissertation.model';
import {MatDialog} from '@angular/material/dialog';
import {GlobalService} from '../../_services/global.service';
import {DissertationService} from '../../_services/dissertation.service';
import {KeyValue} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Observable, of} from 'rxjs';
import {DissertationEditDialogComponent} from './dissertation-edit-dialog/dissertation-edit-dialog.component';
import {FunctionsService} from '../../_services/functions.service';
import {Animations} from '../../_helpers/animations';

@Component({
  selector: 'app-dissertations',
  templateUrl: './dissertations.component.html',
  styleUrls: ['./dissertations.component.scss'],
  animations: [
    Animations.easeInOutVerticalEditingContainer,
    Animations.easeInOutEditingButton,
    Animations.expandCollapseDissertationDescription
  ]
})
export class DissertationsComponent implements OnInit, AfterViewInit {
  @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;
  @ViewChildren(MatSort) sorts: QueryList<MatSort>;
  dissertations: Map<string, Observable<Dissertation[]>>;
  dissertationsDataSources: Map<string, MatTableDataSource<Dissertation>>;
  expandedDissertation: Dissertation = null;
  highlightedDissertation: Dissertation = null;
  columns = new Map<string, string[]>([
    [DissertationStatus.Proposed.toString(), ['topic']],
    [DissertationStatus.InProgress.toString(), ['topic']],
    [DissertationStatus.Completed.toString(), ['topic', 'date']]
  ]);
  columnsWithActionButtons = new Map<string, string[]>([
    [DissertationStatus.Proposed.toString(), ['topic', 'actionButtons']],
    [DissertationStatus.InProgress.toString(), ['topic', 'actionButtons']],
    [DissertationStatus.Completed.toString(), ['topic', 'date', 'actionButtons']]
  ]);
  filterValues = new Map<string, string>([
    [DissertationStatus.Proposed.toString(), ''],
    [DissertationStatus.InProgress.toString(), ''],
    [DissertationStatus.Completed.toString(), '']
  ]);

  constructor(
    private dialog: MatDialog,
    public functions: FunctionsService,
    public changeDetectorRef: ChangeDetectorRef,
    public global: GlobalService,
    private dissertationService: DissertationService
  ) {
    this.paginators = new QueryList<MatPaginator>();
    this.sorts = new QueryList<MatSort>();
    this.dissertations = new Map<string, Observable<Dissertation[]>>([
      [DissertationStatus.Proposed.toString(), of([])],
      [DissertationStatus.InProgress.toString(), of([])],
      [DissertationStatus.Completed.toString(), of([])]
    ]);
    this.dissertationsDataSources = new Map<string, MatTableDataSource<Dissertation>>([
      [DissertationStatus.Proposed.toString(), new MatTableDataSource<Dissertation>([])],
      [DissertationStatus.InProgress.toString(), new MatTableDataSource<Dissertation>([])],
      [DissertationStatus.Completed.toString(), new MatTableDataSource<Dissertation>([])]
    ]);
  }

  ngOnInit(): void {
    let index = 0;
    let dissertationStatusKeys = Object.keys(DissertationStatus);
    dissertationStatusKeys = dissertationStatusKeys.splice(0, dissertationStatusKeys.length / 2);

    for (const dissertationStatus of dissertationStatusKeys) {
      const dissertationDataSource = this.dissertationsDataSources.get(dissertationStatus);
      let dissertation = this.dissertations.get(dissertationStatus);
      dissertationDataSource.paginator = this.paginators.toArray()[index];
      dissertationDataSource.sort = this.sorts.toArray()[index];
      ++index;
      dissertation = dissertationDataSource.connect();
    }

    this.dissertationService.dissertations.subscribe((dissertations: Dissertation[]) => {
      if (dissertations.length > 0) {
        for (const dissertationStatus of dissertationStatusKeys) {
          const dissertationDataSource = this.dissertationsDataSources.get(dissertationStatus);
          dissertationDataSource.data = dissertations.filter((dissertation: Dissertation) => {
            return dissertation.status === this.global.dissertationStatuses[dissertationStatus];
          });
          dissertationDataSource._updateChangeSubscription();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  getColumns(dissertationStatus: string): string[] {
    return this.global.canEdit() ? this.columnsWithActionButtons.get(dissertationStatus) : this.columns.get(dissertationStatus);
  }

  getColumnsLength(dissertationStatus: string): number {
    return this.global.canEdit() ?
      this.columnsWithActionButtons.get(dissertationStatus).length :
      this.columns.get(dissertationStatus).length;
  }

  isDissertationCompleted(dissertationStatus: string): boolean {
    return dissertationStatus === DissertationStatus.Completed.toString();
  }

  originalOrder(a: KeyValue<any, any>, b: KeyValue<any, any>): number {
    return 0;
  }

  applyFilter(event: KeyboardEvent, dissertationStatus: string): void {
    this.filterValues = this.filterValues.set(dissertationStatus, (event.target as HTMLInputElement).value);
    const dissertationDataSource = this.dissertationsDataSources.get(dissertationStatus);

    dissertationDataSource.filter = this.filterValues.get(dissertationStatus).trim().toLowerCase();
    dissertationDataSource.paginator.firstPage();
  }

  assignExpandedDissertation(dissertation: Dissertation): void {
    if (!!dissertation.description) {
      this.global.areAnimationsDisabled = false;
      this.expandedDissertation = this.expandedDissertation === dissertation ? null : dissertation;
    }
  }

  addDissertation(dissertationStatus: string): void {
    const data = {
      dissertation: {
        status: dissertationStatus
      } as Dissertation
    };
    this.functions.openDialog(DissertationEditDialogComponent, data);
  }

  replaceDissertation(dissertation: Dissertation): void {
    const data = {
      dissertation: {
        id: dissertation.id,
        topic: dissertation.topic,
        description: dissertation.description,
        status: dissertation.status,
        date: dissertation.date
      } as Dissertation
    };
    this.functions.openDialog(DissertationEditDialogComponent, data);
  }

  deleteDissertation(dissertation: Dissertation): void {
    this.dissertationService.deleteDissertation(dissertation).subscribe();
  }

  isDissertationHighlighted(dissertation: Dissertation): boolean {
    return (dissertation !== this.expandedDissertation && dissertation === this.highlightedDissertation && !!dissertation.description);
  }
}
