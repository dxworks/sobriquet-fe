import {Tag} from './tag';
import {Identity} from './identity';

export class Engineer {
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
  username: string;
  ignorable: boolean;
}
