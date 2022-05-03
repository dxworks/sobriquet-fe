import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Engineer} from '../data/engineer';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EngineerService {

  private allEngineersBehaviorSubject: BehaviorSubject<Engineer[]> = new BehaviorSubject<Engineer[]>([]);

  allEngineers$: Observable<Engineer[]> = this.allEngineersBehaviorSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.getAll();
  }

  getAll() {
    return this.httpClient.get<Engineer[]>(`${environment.apiUrl}/engineers`).subscribe(response => this.allEngineersBehaviorSubject.next(response));
  }

  addEngineer(engineer: Engineer): Observable<Engineer> {
    return this.httpClient.post<Engineer>(`${environment.apiUrl}/addEngineer`, engineer);
  }

  addEngineers(engineers: Engineer[]): Observable<Engineer[]> {
    return this.httpClient.post<Engineer[]>(`${environment.apiUrl}/addEngineers`, engineers);
  }

  linkTeam(engineerId: string, teamId: string): Observable<Engineer> {
    return this.httpClient.put<Engineer>(`${environment.apiUrl}/addTeam/${engineerId}/${teamId}`, null);
  }

  delete(engineerId: String) {
    return this.httpClient.delete(`${environment.apiUrl}/deleteEngineer/${engineerId}`);
  }

  edit(engineer: Engineer): Observable<Engineer> {
    return this.httpClient.put<Engineer>(`${environment.apiUrl}/editEngineer/${engineer.id}`, engineer);
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
