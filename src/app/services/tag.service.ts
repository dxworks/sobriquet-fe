import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Tag } from '../data/tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private httpClient: HttpClient) {
  }

  getAllTags(): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(`${environment.apiUrl}/tags`);
  }

  addTag(tag: Tag): Observable<Tag> {
    return this.httpClient.post<Tag>(`${environment.apiUrl}/addTag`, tag);
  }

}
