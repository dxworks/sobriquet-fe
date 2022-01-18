import {Affiliation} from './affiliation';
import {Tag} from './tag';
import {Identity} from './identity';

export interface Engineer {
  id?: string;
  firstName: string;
  lastName: string;
  position: string;
  teams: string[];
  city: string;
  country: string;
  affiliations: Affiliation[];
  email: string;
  project: string;
  tags: Tag[];
  role: string;
  identities: Identity[];
}
