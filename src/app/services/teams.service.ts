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
    return this.httpClient.get<any>(`${environment.apiUrl}/teams`);
  }

  addTeam(team: Team){
    return this.httpClient.post(`${environment.apiUrl}/addTeam`, team);
  }

  deleteTeam(id: string){
    return this.httpClient.delete(`${environment.apiUrl}/deleteTeam/${id}`);
  }
}
