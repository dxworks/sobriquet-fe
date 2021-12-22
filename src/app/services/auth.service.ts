import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken: string | null;

  constructor(private router: Router) {
    this.authToken = localStorage.getItem('token');
  }

  public setToken(username: string, password: string): void {
    this.authToken = btoa(username + ':' + password);
    localStorage.setItem('token', this.authToken);
  }

  public logout(): void {
    this.authToken = null;
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
