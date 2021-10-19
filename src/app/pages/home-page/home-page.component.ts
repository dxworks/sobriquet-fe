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

  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe(response => this.projects = response);
  }

  upload($event): void {
    this.selectedJSON = $event.target.files[0];
  }

  save() {
    this.projectService.addProject(this.projectName, this.selectedJSON).subscribe();
  }
}
