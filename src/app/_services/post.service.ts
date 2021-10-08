import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {FunctionsService} from './functions.service';
import {LoggerService} from './logger.service';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../constants';
import {catchError, tap} from 'rxjs/operators';
import {Post} from '../_entities/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  posts: BehaviorSubject<Post[]>;

  constructor(
    private functions: FunctionsService,
    private logger: LoggerService,
    private http: HttpClient
  ) {
    this.posts = new BehaviorSubject<Post[]>([]);
    this.getPosts().subscribe((posts: Post[]) => this.posts.next(posts));
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(Constants.POST_URL).pipe(
      tap(_ => this.logger.logMessage(`got posts`)),
      catchError(this.logger.handleError<Post[]>(`getting posts`))
    );
  }

  getPost(id: number): Observable<Post> {
    const url = `${Constants.POST_URL}/${id}`;
    return this.http.get<Post>(url).pipe(
      tap(_ => this.logger.logMessage(`got post`)),
      catchError(this.logger.handleError<Post>(`getting post`))
    );
  }

  addPost(post: Post): Observable<Post> {
    return this.http.post<Post>(Constants.POST_URL, post).pipe(
      tap((addedPost: Post) => {
        const posts = this.posts.value;
        posts.push(addedPost);
        this.posts.next(posts);
        this.logger.logMessage(`added post of id ${addedPost.id}`);
      }),
      catchError(this.logger.handleError<Post>(`adding post`))
    );
  }

  replacePost(post: Post): Observable<Post> {
    const url = `${Constants.POST_URL}/${post.id}`;
    return this.http.put<Post>(url, post).pipe(
      tap((replacedPost: Post) => {
        const posts = this.posts.value;
        const index = this.functions.indexOf<Post>(posts, post.id);
        if (index !== null) {
          posts[index] = replacedPost;
          this.posts.next(posts);
          this.logger.logMessage(`replaced post of id ${replacedPost.id}`);
        }
      }),
      catchError(this.logger.handleError<Post>(`replacing post of id ${post.id}`))
    );
  }

  deletePost(post: Post): Observable<{}> {
    const url = `${Constants.POST_URL}/${post.id}`;
    return this.http.delete(url).pipe(
      tap(_ => {
        const posts = this.posts.value;
        const index = this.functions.indexOf<Post>(posts, post.id);
        if (index !== null) {
          posts.splice(index, 1);
          this.posts.next(posts);
          this.logger.logMessage(`deleted post of id ${post.id}`);
        }
      }),
      catchError(this.logger.handleError(`deleting post of id ${post.id}`))
    );
  }
}
