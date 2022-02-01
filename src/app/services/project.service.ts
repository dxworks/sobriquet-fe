import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Project} from '../data/project';
import {Identity} from '../data/identity';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient: HttpClient) {
  }

  getAllProjects() {
    return this.httpClient.get<Project[]>(`${environment.apiUrl}/projects`);
  }

  addProject(projectName: string, projectFiles: File | Identity[]) {
    return this.httpClient.post<Project>(`${environment.apiUrl}/addProject/${projectName}`, projectFiles);
  }

  delete(name: string) {
    return this.httpClient.delete(`${environment.apiUrl}/deleteProject/${name}`);
  }

  editProject(name: string, suggestions: Identity[]) {
    return this.httpClient.put(`${environment.apiUrl}/editProject/${name}`, suggestions);
  }

  getById(name: string) {
    return this.httpClient.get<Project>(`${environment.apiUrl}/project/${name}`);
  }

  upload($event, fileDropped) {
    let selectedJSON;
    if (fileDropped) {
      $event.length === 1 ? selectedJSON = $event[0] : selectedJSON = $event;
    } else {
      $event.target.files.length === 1 ? selectedJSON = $event.target.files[0] : selectedJSON = $event.target.files;
    }
    return selectedJSON;
  }
}
