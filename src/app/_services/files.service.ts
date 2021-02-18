import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Constants} from '../constants';
import {catchError, tap} from 'rxjs/operators';
import {LoggerService} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private logger: LoggerService,
    private http: HttpClient
  ) { }

  uploadImage(image: File): Observable<object> {
    const formData = new FormData();
    formData.append('file', image, image.name);
    return this.http.post<object>(Constants.IMAGE_URL, formData).pipe(
      tap(_ => this.logger.logMessage(`uploaded an image`)),
      catchError(this.logger.handleError<object>(`uploading an image`))
    );
  }

  uploadFile(file: File): Observable<object> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<object>(Constants.FILE_URL, formData).pipe(
      tap(_ => this.logger.logMessage(`uploaded a file`)),
      catchError(this.logger.handleError<object>(`uploading a file`))
    );
  }
}
