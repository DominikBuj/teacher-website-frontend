import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Teacher} from '../../_models/teacher.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {GlobalService} from '../../_services/global.service';
import {TeacherService} from '../../_services/teacher.service';
import {Post} from '../../_entities/post.model';
import {PostService} from '../../_services/post.service';
import {Animations} from '../../_helpers/animations';
import {MatSort} from '@angular/material/sort';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  animations: [
    Animations.easeInOutVerticalEditingContainer,
    Animations.easeInOutEditingButton
  ]
})
export class PostsComponent implements OnInit, AfterViewInit, OnDestroy {
  teacher: Teacher = null;
  postsDataSource: MatTableDataSource<Post> = new MatTableDataSource<Post>();
  paginator: MatPaginator = null;
  sort: MatSort = null;
  filterValue = '';
  columns: string[] = ['title', 'subtitle', 'date'];

  private setDataSourceAttributes(): void {
    this.postsDataSource.paginator = this.paginator;
    this.postsDataSource.sort = this.sort;
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
    public changeDetectorRef: ChangeDetectorRef,
    public global: GlobalService,
    private teacherService: TeacherService,
    private postService: PostService
  ) {
  }

  ngOnInit(): void {
    this.teacherService.teacher.pipe(filter((teacher: Teacher) => !!teacher)).subscribe((teacher: Teacher) => {
      this.teacher = teacher;
    });

    this.postService.posts.pipe(filter((posts: Post[]) => !!posts)).subscribe((posts: Post[]) => {
      posts = posts.sort((a: Post, b: Post) => b.date - a.date);
      this.postsDataSource.data = posts;
      this.postsDataSource._updateChangeSubscription();
    });
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.postsDataSource?.disconnect();
  }

  applyFilter(event: KeyboardEvent): void {
     this.filterValue = (event.target as HTMLInputElement).value;
     this.postsDataSource.filter = this.filterValue.trim().toLowerCase();
     this.postsDataSource.paginator.firstPage();
  }

  deletePost(post: Post): void {
    this.postService.deletePost(post).subscribe();
  }
}
