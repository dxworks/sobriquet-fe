import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Team } from '../data/team';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private httpClient: HttpClient) {
  }

  getAllTeams(): Observable<Team[]> {
    return this.httpClient.get<Team[]>(`${environment.apiUrl}/teams`);
  }

  addTeam(team: Team): Observable<Team> {
    return this.httpClient.post<Team>(`${environment.apiUrl}/addTeam`, team);
  }
}
