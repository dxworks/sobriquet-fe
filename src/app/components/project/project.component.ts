import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../data/project";
import {Router} from "@angular/router";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  @Input()
  project: Project

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  showProjectIdentities(){
    this.router.navigate(['/identities'], {queryParams: {project: JSON.stringify(this.project)}});
  }

}
