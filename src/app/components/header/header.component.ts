import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Project} from '../../data/project';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input()
  project: Project;

  urlPath: string;
  previousUrl: string;

  constructor(public router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.urlPath = this.router.url;
  }


  goTo(path: string) {
    this.urlPath = path;
    this.router.navigate([`${path}`]);
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  logOut() {
    this.authService.logout();
  }

  configureEngineersPageRouting() {
    if (this.project) {
      this.router.navigate([`/engineers/project/${this.project.name}`]);
    } else {
      this.router.navigate(['/engineers']);
    }
  }

}
