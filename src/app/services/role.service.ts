import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from '../data/role';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClient: HttpClient) {
  }

  getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${environment.apiUrl}/roles`);
  }

  addRole(role: Role): Observable<Role> {
    return this.httpClient.post<Role>(`${environment.apiUrl}/addRole`, role);
  }
}
