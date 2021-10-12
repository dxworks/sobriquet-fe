import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Project} from "../../data/project";
import {Router} from "@angular/router";
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  @Input()
  project: Project;

  @Output()
  projectDeleted = new EventEmitter()

  buttonClicked = false;

  constructor(private router: Router,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
  }

  showProjectIdentities() {
    if (!this.buttonClicked) {
      this.router.navigate(['/identities'], {queryParams: {project: JSON.stringify(this.project)}});
    }
  }

  delete() {
    this.projectService.delete(this.project.name).subscribe(() => this.projectDeleted.emit());
  }

}
