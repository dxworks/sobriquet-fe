import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../services/auth.service';
import {Route, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  logIn(username: HTMLInputElement, password: HTMLInputElement) {
    this.httpClient.get(`${environment.apiUrl}/login`, {
      headers: {
        Authorization: `Basic ${btoa(`${username.value}:${password.value}`)}`
      },
      observe: 'response'
    }).subscribe(response => {
      if (response.status >= 200 && response.status <= 204) {
        this.authService.setToken(username.value, password.value);
      }
      this.router.navigate(['']);
    });
  }
}
