import {SavedFile} from './saved-file.model';

export interface TemporaryFile extends SavedFile {
  file: File;
}
