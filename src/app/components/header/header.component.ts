import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  goToHomePage(){
    this.router.navigate(['/home']);
  }

  logOut(){
    this.authService.logout();
  }

  goTo(path: string){
    this.router.navigate([`${path}`]);
  }

}
