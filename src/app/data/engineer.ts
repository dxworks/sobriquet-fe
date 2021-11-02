import {Affiliation} from "./affiliation";

export interface Engineer{
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
  tags: string[];
  role: string;

}
