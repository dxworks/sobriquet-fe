import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Repository} from "../data/repository";

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private httpClient: HttpClient) {}

  getAllRepos(){
    return this.httpClient.get<Repository[]>(`${environment.apiUrl}/repositories`);
  }

  addRepo(repository: Repository){
    return this.httpClient.post(`${environment.apiUrl}/addRepository`, repository);
  }
}
