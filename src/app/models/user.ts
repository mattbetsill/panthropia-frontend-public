import { Role } from './role';

export class User {
  username: string;
  token?: string;
  role: Role;
  email: string;
  firstname?: string;
  lastname?: string;
  _id: string;
  orgref: any;
  campusref: any;
  organization: string;
}
