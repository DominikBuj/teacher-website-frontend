import {Role} from './role.enum';

export class User {
  id: number;
  username: string;
  role: Role;
  token: string;
}
