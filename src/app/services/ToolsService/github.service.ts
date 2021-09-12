import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private httpClient: HttpClient) {
  }

  getCollaborators(ownerUsername: string, repositoryName: string, emailAddress: string, token: string) {
    return this.httpClient.get(`${environment.githubApiUrl}/repos/${ownerUsername}/${repositoryName}/collaborators`,
      {headers: {authorization: `Basic ${btoa(`${emailAddress}:${token}`)}`}});
  }
}
