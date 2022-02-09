import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
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

  constructor(public router: Router) {
  }

  ngOnInit(): void {
    this.urlPath = this.router.url;
  }

  goTo(path: string) {
    this.urlPath = path;
    this.router.navigate([`/project/${this.router.url.split('/')[2]}${path}`]);
  }

  goToHomePage() {
    this.router.navigate(['']);
  }
}
