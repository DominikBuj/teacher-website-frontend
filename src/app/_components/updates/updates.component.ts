import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Teacher} from '../../_models/teacher.model';
import {TeacherService} from '../../_services/teacher.service';
import {Update} from '../../_models/update.model';
import {MatPaginator} from '@angular/material/paginator';
import {Observable} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {UpdateService} from '../../_services/update.service';
import {FunctionsService} from '../../_services/functions.service';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.component.html',
  styleUrls: ['./updates.component.scss']
})
export class UpdatesComponent implements OnInit, OnDestroy {
  teacher: Teacher;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  updates: Observable<Update[]>;
  updatesDataSource: MatTableDataSource<Update>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public functions: FunctionsService,
    private teacherService: TeacherService,
    private updateService: UpdateService
  ) {
    this.teacherService.teacher.subscribe((teacher: Teacher) => this.teacher = teacher);

    this.updatesDataSource = new MatTableDataSource<Update>([]);
    this.updateService.getUpdates().subscribe((updates: Update[]) => {
      this.updatesDataSource.data = updates.sort((a, b) => b.date - a.date);
      this.updatesDataSource._updateChangeSubscription();
    });
  }

  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
    this.updatesDataSource.paginator = this.paginator;
    this.updates = this.updatesDataSource.connect();
  }

  ngOnDestroy(): void {
    if (this.updatesDataSource) {
      this.updatesDataSource.disconnect();
    }
  }

  deleteUpdate(update: Update): void {
    this.updateService.deleteUpdate(update).subscribe(_ => this.updatesDataSource._updateChangeSubscription());
  }
}
