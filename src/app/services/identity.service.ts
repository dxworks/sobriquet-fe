import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Identity} from "../data/identity";

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  constructor(private httpClient: HttpClient) {}

  getAllIdentities(){
    return this.httpClient.get<any[]>(`${environment.apiUrl}/identities`);
  }

  getIdentity(firstname: string, lastname: string){
    return this.httpClient.get<any>(`${environment.apiUrl}/identity/${firstname}/${lastname}`);
  }

  deleteIdentity(id: number){
    return this.httpClient.delete(`${environment.apiUrl}/deleteIdentity/${id}`);
  }

  addIdentity(identity: Identity){
    return this.httpClient.post(`${environment.apiUrl}/addIdentity`, identity);
  }
}
