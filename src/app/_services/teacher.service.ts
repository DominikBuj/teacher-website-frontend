import {Injectable} from '@angular/core';
import {Teacher} from '../_models/teacher.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Constants} from '../constants';
import {catchError, tap} from 'rxjs/operators';
import {LoggerService} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  teacher: BehaviorSubject<Teacher>;

  constructor(
    private logger: LoggerService,
    private http: HttpClient
  ) {
    const blankTeacher = new Teacher(undefined, undefined, undefined, undefined, undefined,
      undefined, undefined, undefined, undefined);
    this.teacher = new BehaviorSubject<Teacher>(blankTeacher);
    this.getTeacher().subscribe((teacher: Teacher) => this.teacher.next(teacher));
  }

  getTeacher(): Observable<Teacher> {
    return this.http.get<Teacher>(Constants.TEACHER_URL).pipe(
      tap(_ => this.logger.logMessage(`got teacher`)),
      catchError(this.logger.handleError<Teacher>(`getting teacher`))
    );
  }

  updateTeacher(update: any): Observable<Teacher> {
    return this.http.patch<Teacher>(Constants.TEACHER_URL, update).pipe(
      tap((teacher: Teacher) => {
        this.logger.logMessage(`added teacher`);
        this.teacher.next(teacher);
      }),
      catchError(this.logger.handleError<Teacher>(`adding teacher`))
    );
  }
}
