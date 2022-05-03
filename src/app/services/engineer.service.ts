import {Injectable} from '@angular/core';
import {Engineer} from '../data/engineer';

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
}
