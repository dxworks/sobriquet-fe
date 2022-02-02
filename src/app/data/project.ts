import {Identity} from './identity';

export interface Project {
  uuid?: string;
  id?: string;
  name: string;
  identities: Identity[];
}
