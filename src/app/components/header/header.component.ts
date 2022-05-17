import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../data/project';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input()
  project: Project;
  @Input()
  currentView = ''

  @Output()
  scrollButtonClicked = new EventEmitter();

  urlPath: string;

  constructor(public router: Router) {
  }

  ngOnInit(): void {
    this.urlPath = this.router.url;
  }

  goTo(path: string) {
    this.urlPath = path;
    this.router.navigate([`/project/${this.router.url.split('/')[2]}${path}`]).then();
  }

  goToHomePage() {
    this.router.navigate(['']).then();
  }

  scroll() {
    !this.currentView || this.currentView === 'authors' ? this.currentView = 'suggestions' : this.currentView = 'authors';
    this.scrollButtonClicked.emit(this.currentView)
  }
}
