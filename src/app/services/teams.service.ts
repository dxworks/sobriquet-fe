import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Team} from "../data/team";

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private httpClient: HttpClient) { }

  getAllTeams(){
    return this.httpClient.get<any>(`${environment.apiUrl}/getAllTeams`);
  }

  addTeam(team: Team){
    return this.httpClient.post(`${environment.apiUrl}/teams`, team);
  }

  deleteTeam(id: number){
    return this.httpClient.delete(`${environment.apiUrl}/deleteTeam/${id}`);
  }
}
