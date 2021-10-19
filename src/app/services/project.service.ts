import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Project} from "../data/project";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) {
  }

  getAllProjects() {
    return this.httpClient.get<Project[]>(`${environment.apiUrl}/projects`);
  }

  addProject(projectName: string, projectFiles: File) {
    return this.httpClient.post(`${environment.apiUrl}/addProject/${projectName}`, projectFiles);

  }
}
