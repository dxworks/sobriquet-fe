import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Engineer} from '../data/engineer';

@Injectable({
  providedIn: 'root'
})
export class EngineerService {

  constructor(private httpClient: HttpClient) {
  }

  getAll() {
    return this.httpClient.get<Engineer[]>(`${environment.apiUrl}/engineers`);
  }

  addEngineer(engineer: Engineer) {
    return this.httpClient.post(`${environment.apiUrl}/addEngineer`, engineer);
  }

  addEngineers(engineers: Engineer[]) {
    return this.httpClient.post(`${environment.apiUrl}/addEngineers`, engineers);
  }

  linkTeam(engineerId: string, teamId: string) {
    return this.httpClient.put(`${environment.apiUrl}/addTeam/${engineerId}/${teamId}`, null);
  }

  delete(engineerId: String) {
    return this.httpClient.delete(`${environment.apiUrl}/deleteEngineer/${engineerId}`);
  }

  edit(engineer: Engineer) {
    return this.httpClient.put(`${environment.apiUrl}/editEngineer/${engineer.id}`, engineer);
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
