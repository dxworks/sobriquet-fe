import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Engineer} from "../data/engineer";

@Injectable({
  providedIn: 'root'
})
export class EngineerService {

  constructor(private httpClient: HttpClient) { }

  getAll(){
    return this.httpClient.get<any>(`${environment.apiUrl}/engineers`);
  }

  add(engineer: Engineer){
    return this.httpClient.post(`${environment.apiUrl}/addEngineer`, engineer);
  }

  linkTeam(engineerId: string, teamId: string){
    return this.httpClient.put(`${environment.apiUrl}/addTeam/${engineerId}/${teamId}`, null);
  }
}
