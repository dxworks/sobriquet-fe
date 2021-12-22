import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Role} from '../data/role';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private httpClient: HttpClient) {
  }

  getAllRoles() {
    return this.httpClient.get<Role[]>(`${environment.apiUrl}/roles`);
  }

  addRole(role: Role) {
    return this.httpClient.post(`${environment.apiUrl}/addRole`, role);
  }
}
