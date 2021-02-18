import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  messages: string[];

  constructor() {
    this.messages = [];
  }

  logMessage(message: string): void {
    const [hours, minutes, seconds] = new Date().toLocaleTimeString().split(/:| /);
    message = `${hours}:${minutes}:${seconds} : ${message}`;
    this.messages.push(message);
    console.log(message);
  }

  handleError<T>(operation = 'operation', result?: T): any {
    return (error: any): Observable<T> => {
      console.error(error);
      this.logMessage(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
