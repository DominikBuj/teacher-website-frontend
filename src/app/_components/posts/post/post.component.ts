import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {GlobalService} from '../../../_services/global.service';
import {Post} from '../../../_models/post.model';
import {PostService} from '../../../_services/post.service';
import {Operation} from '../../../_models/operation.enum';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FunctionsService} from '../../../_services/functions.service';
import * as CKEditor from '../../../ckeditor/build/ckeditor';
import {FileEditDialogComponent} from './file-edit-dialog/file-edit-dialog.component';
import {TemporaryFile} from '../../../_models/temporary-file.model';
import {filter} from 'rxjs/operators';
import {FilesService} from '../../../_services/files.service';
import {FileSaveResponse} from '../../../_models/file-save-response.model';
import {SavedFile} from '../../../_models/saved-file.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit {
  post = {} as Post;
  postForm: FormGroup = null;
  operation: Operation = Operation.Add;
  submitted = false;
  ckEditor = CKEditor;
  temporaryFiles: TemporaryFile[] = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    public global: GlobalService,
    private postService: PostService,
    public functions: FunctionsService,
    private fileService: FilesService
  ) {
  }

  getFilesListColumnsArray(): number[] {
    return (this.global.isScreenSmall || this.global.isScreenMedium) ? [0] : [0, 0, 0];
  }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: [this.post?.title, [Validators.required, Validators.maxLength(200)]],
      subtitle: [this.post?.subtitle, [Validators.maxLength(200)]],
      content: [this.post?.content, [Validators.required, Validators.maxLength(4000)]]
    });

    this.route.params.subscribe((params: Params) => {
      const postId = +params?.id;

      if (!!postId) {
        this.operation = Operation.Save;
        this.postService.getPost(postId).subscribe((post: Post) => {
          this.post = post;
          this.postForm.patchValue(post);
        });
      } else {
        this.operation = Operation.Add;
        this.post.date = new Date().getTime();
      }
    });
  }

  private performOperation(post: Post): void {
    (this.operation === Operation.Add) ?
      this.postService.addPost(post).subscribe(() => this.router.navigate(['posts'])) :
      this.postService.replacePost(post).subscribe(() => this.router.navigate(['posts']));
  }

  private saveTemporaryFile(savedFiles: SavedFile[], index: number, post: Post): void {
    if (index === (this.temporaryFiles.length - 1)) {
      post.files = savedFiles;
      this.performOperation(post);
    } else {
      this.saveTemporaryFiles(savedFiles, index + 1, post);
    }
  }

  private saveTemporaryFiles(savedFiles: SavedFile[], index: number, post: Post): void {
    const temporaryFile = this.temporaryFiles[index];
    const savedFile = {
      id: temporaryFile.id,
      name: temporaryFile.name,
      post: temporaryFile.post,
      postId: temporaryFile.postId
    } as SavedFile;

    if (!!temporaryFile.file) {
      this.fileService.uploadFile(temporaryFile.file).subscribe((fileSaveResponse: FileSaveResponse) => {
        savedFile.url = fileSaveResponse.databasePath;
        savedFiles.push(savedFile);
        this.saveTemporaryFile(savedFiles, index, post);
      });
    } else {
      savedFile.url = temporaryFile.url;
      savedFiles.push(savedFile);
      this.saveTemporaryFile(savedFiles, index, post);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.postForm.invalid) {
      return;
    }

    const post = this.functions.createModelFromForm<Post>(this.post, this.postForm.getRawValue());
    post.date = new Date().getTime();

    (this.temporaryFiles.length > 0) ? this.saveTemporaryFiles([], 0, post) : this.performOperation(post);
  }

  deletePost(post: Post): void {
    this.postService.deletePost(post).subscribe(() => this.router.navigate(['posts']));
  }

  replaceTemporaryFile(file: TemporaryFile): void {
    const data = {temporaryFile: file};
    const fileEditDialogRef = this.functions.openDialog(FileEditDialogComponent, data);
    fileEditDialogRef.afterClosed().pipe(filter((temporaryFile: TemporaryFile) => !!temporaryFile))
      .subscribe((temporaryFile: TemporaryFile) => this.temporaryFiles[this.temporaryFiles.indexOf(file)] = temporaryFile);
  }

  deleteTemporaryFile(file: TemporaryFile): void {
    this.temporaryFiles.splice(this.temporaryFiles.indexOf(file), 1);
  }

  replaceSavedFile(file: SavedFile): void {
    const data = {
      temporaryFile: {
        id: file.id,
        name: file.name,
        url: file.url,
        postId: file.postId,
        post: file.post
      } as TemporaryFile
    };
    const fileEditDialogRef = this.functions.openDialog(FileEditDialogComponent, data);
    fileEditDialogRef.afterClosed().pipe(filter((temporaryFile: TemporaryFile) => !!temporaryFile))
      .subscribe((temporaryFile: TemporaryFile) => {
        this.post.files.splice(this.post.files.indexOf(file));
        this.temporaryFiles.push(temporaryFile);
      });
  }

  deleteSavedFile(file: SavedFile): void {
    this.post.files.splice(this.post.files.indexOf(file), 1);
  }

  addFile(): void {
    const data = {temporaryFile: {} as TemporaryFile};
    const fileEditDialogRef = this.functions.openDialog(FileEditDialogComponent, data);
    fileEditDialogRef.afterClosed().pipe(filter((temporaryFile: TemporaryFile) => !!temporaryFile))
      .subscribe((temporaryFile: TemporaryFile) => this.temporaryFiles.push(temporaryFile));
  }
}
