import {Identity} from './identity';

export interface Project {
  id?: string;
  name: string;
  identities: Identity[];
}
