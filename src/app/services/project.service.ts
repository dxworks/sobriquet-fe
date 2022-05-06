import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Project } from '../data/project';
import { MergeSuggestionService } from '../tools-services/merge-suggestion.service';
import { Identity } from '../data/identity';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private allProjectsBehaviorSubject: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

  allProjects$: Observable<Project[]> = this.allProjectsBehaviorSubject.asObservable();

  constructor(private httpClient: HttpClient,
              private mergeSuggestionService: MergeSuggestionService) {
    this.getAllProjects();
  }

  getAllProjects() {
    return this.httpClient.get<Project[]>(`${environment.apiUrl}/projects`).subscribe(res => this.allProjectsBehaviorSubject.next(res));
  }

  addProject(project: Project) {
    return this.httpClient.post<Project>(`${environment.apiUrl}/addProject`, project);
  }

  delete(name: string) {
    return this.httpClient.delete(`${environment.apiUrl}/deleteProject/${name}`);
  }

  editProject(id: string, project: Project) {
    return this.httpClient.put(`${environment.apiUrl}/editProject/${id}`, project);
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

  getUniqueIdentities(identities: Identity[]) {
    return identities?.reduce((accumalator, current) => {
      if (
        !accumalator.some(
          (item) => item.id === current.id && this.mergeSuggestionService.identitiesAreEqual(item, current)
        )
      ) {
        accumalator.push(current);
      }
      return accumalator;
    }, []);
  }
}
