import {Injectable} from '@angular/core';
import {Engineer} from '../data/engineer';

@Injectable({
  providedIn: 'root'
})
export class DiagramService {

  constructor() {
  }

  transformEngineersForSingleTeamSelection(engineers: Engineer[]) {
    const nodes = [];
    engineers.forEach(engineer => {
      nodes.push({
        id: engineer.id,
        type: 'ellipse',
        name: engineer.name,
        parentID: engineer.reportsTo
      })
    })
    return nodes;
  }

  transformEngineersForHQ(engineers: Engineer[]) {
    const nodes = [];
    engineers.forEach(engineer => {
      nodes.push({
        id: engineer.id,
        type: 'ellipse',
        name: engineer.name,
        parentID: engineer.reportsTo
      })
    })
    return nodes;
  }

}
