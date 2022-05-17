import { Injectable } from '@angular/core';
import { Engineer } from '../data/engineer';
import { Identity } from '../data/identity';

@Injectable({
  providedIn: 'root'
})
export class EngineerService {

  constructor() {
  }

  anonymize(engineer: Engineer, name): Engineer {
    engineer.name = name;
    name.split(' ').length < 2
      ? engineer.username = name.toLowerCase()
      : engineer.username = name.split(' ')[0].toLowerCase() + '.' + name.split(' ')[0].toLowerCase();
    engineer.email = engineer.username + '@gmail.com';
    return engineer;
  }

  changeIdentityToEngineer(identities: Identity[]) {
    const engineers: Engineer[] = [];
    identities?.forEach(identity => {
      let engineer = new Engineer();
      if (identity.username) {
        engineer.username = identity.username;
      }
      if (identity.firstName) {
        identity.lastName ? engineer.name = identity.firstName + ' ' + identity.lastName : engineer.name = identity.firstName;
      } else {
        if (identity.lastName) {
          engineer.name = identity.lastName;
        }
      }
      if (identity.email) {
        engineer.email = identity.email;
      }
      engineers.push(engineer);
    });
    return engineers;
  }
}
