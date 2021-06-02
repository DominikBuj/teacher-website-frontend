import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Constants} from '../constants';
import {catchError, tap} from 'rxjs/operators';
import {LoggerService} from './logger.service';
import {FileSaveResponse} from '../_models/file-save-response.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private logger: LoggerService,
    private http: HttpClient
  ) { }

  uploadImage(image: File): Observable<FileSaveResponse> {
    const formData = new FormData();
    formData.append('file', image, image.name);
    return this.http.post<FileSaveResponse>(Constants.IMAGE_URL, formData).pipe(
      tap(() => this.logger.logMessage(`uploaded an image`)),
      catchError(this.logger.handleError<FileSaveResponse>(`uploading an image`))
    );
  }

  uploadFile(file: File): Observable<FileSaveResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<FileSaveResponse>(Constants.FILE_URL, formData).pipe(
      tap(() => this.logger.logMessage(`uploaded a file`)),
      catchError(this.logger.handleError<FileSaveResponse>(`uploading a file`))
    );
  }
}
