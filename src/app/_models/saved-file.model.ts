import {Post} from '../_entities/post.model';

export interface SavedFile {
  id: number;
  name: string;
  url: string;
  postId: number;
  post: Post;
}
