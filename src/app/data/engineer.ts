import {Tag} from './tag';
import {Identity} from './identity';

export interface Engineer {
  id?: string;
  name: string;
  senority: string;
  teams: string[];
  city: string;
  country: string;
  email: string;
  project: string;
  tags: Tag[];
  role: string;
  identities: Identity[];
  reportsTo: string;
  status: string;
}
