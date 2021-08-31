import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  urlPath:string;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.urlPath = this.router.url;
  }


  goTo(path: string){
    this.urlPath = path;
    this.router.navigate([`${path}`]);
  }
}
