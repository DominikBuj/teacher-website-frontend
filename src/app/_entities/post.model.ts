import {SavedFile} from '../_models/saved-file.model';

export interface Post {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  files: SavedFile[];
  date: number;
}
