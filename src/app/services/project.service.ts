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

  editProject(id: string, suggestions: Identity[]) {
    return this.httpClient.put(`${environment.apiUrl}/editProject/${id}`, suggestions);
  }

  getById(id: string) {
    return this.httpClient.get<Project>(`${environment.apiUrl}/project/${id}`);
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

  transformIdentitiesName(identities) {
    identities?.forEach(identity => {
      if (identity.lenght > 0) {
        identity.forEach(id => {
          id.firstName = id.name.split(' ')[0];
          id.lastName = id.name.split(' ')[1];
          delete id.name;
        })
      } else {
        identity.firstName = identity.name.split(' ')[0];
        identity.lastName = identity.name.split(' ')[1];
        delete identity.name;
      }
    });
    return identities;
  }
}
