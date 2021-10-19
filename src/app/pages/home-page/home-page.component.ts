import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {Project} from "../../data/project";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  selectedJSON: File;
  projectName = '';
  projects: Project[] = [];
  fileDropped = false;

  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.projectService.getAllProjects().subscribe(response => this.projects = response);
  }

  upload($event): void {
    this.fileDropped ? this.selectedJSON = $event[0] : this.selectedJSON = $event.target.files[0];
  }

  save() {
    this.projectService.addProject(this.projectName, this.selectedJSON).subscribe(() => this.getProjects());
  }
}
