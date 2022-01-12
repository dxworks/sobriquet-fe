import {Injectable} from '@angular/core';
import {Engineer} from '../../data/engineer';

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
        name: engineer.firstName + ' ' + engineer.lastName,
        parentID: this.getParentForSingleTeamSelection(engineer.position, engineers)
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
        name: engineer.firstName + ' ' + engineer.lastName + '(' + engineer.position + ')',
        parentID: this.getParentForHQ(engineer, engineers)
      })
    })
    return nodes;
  }

  getParentForSingleTeamSelection(position: string, engineers: Engineer[]) {
    switch (position) {
      case 'Developer' :
        return this.getSuperior(engineers, 'ProjectManager')
      default:
        return undefined;
    }
  }

  getParentForHQ(engineer: Engineer, engineers: Engineer[]) {
    switch (engineer.position) {
      case 'Developer' :
        return this.getSuperiorByTeam(engineer, engineers, 'ProjectManager')
      case 'ProjectManager':
        return this.getSuperior(engineers, 'CEO');
      default:
        return undefined;
    }
  }

  getSuperior(engineers: Engineer[], superiorPosition: string) {
    return engineers.find(engineer => engineer.position === superiorPosition)?.id;
  }

  getSuperiorByTeam(currentEngineer: Engineer, engineers: Engineer[], superiorPosition: string) {
    return engineers.find(engineer => engineer.position === superiorPosition && this.teamsMatch(engineer, currentEngineer))?.id;
  }

  teamsMatch(engineer: Engineer, currentEngineer: Engineer) {
    return engineer.teams.some(r => currentEngineer.teams.includes(r));
  }

}
