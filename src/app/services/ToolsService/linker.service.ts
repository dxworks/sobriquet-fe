import {Injectable} from '@angular/core';
import {Engineer} from "../../data/engineer";
import {Identity} from "../../data/identity";

@Injectable({
  providedIn: 'root'
})
export class LinkerService {

  constructor() {
  }

  linkIdentity(engineers: Engineer[], identity: Identity) {
    return engineers.find(engineer => identity.username.includes(engineer.lastName.toLowerCase())
      || identity.username.includes(engineer.firstName.toLowerCase())
      || identity.username.toLowerCase().includes(engineer.firstName.toLowerCase())
      || identity.username.toLowerCase().includes(engineer.lastName.toLowerCase()));
  }
}
