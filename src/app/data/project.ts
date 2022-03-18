import {Identity} from './identity';

export class Project {
  uuid?: string;
  id?: string;
  name: string;
  identities: Identity[];
  engineers: any[];
}
