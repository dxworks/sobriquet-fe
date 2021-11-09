import {Component, OnInit} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {Project} from "../../data/project";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  selectedJSON: File | File[];
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
    if (this.fileDropped) {
      $event.length === 1 ? this.selectedJSON = $event[0] : this.selectedJSON = $event;
    } else {
      $event.target.files.length === 1 ? this.selectedJSON = $event.target.files[0] : this.selectedJSON = $event.target.files;
    }
  }

  save() {
    if (this.selectedJSON instanceof File) {
      this.projectService.addProject(this.projectName, this.selectedJSON).subscribe(() => this.getProjects());
    } else {
      let fileResults = [];
      for (let i = 0; i < this.selectedJSON.length ; i++ ){
       this.readFile(this.selectedJSON[i]);
       fileResults.push(JSON.parse(localStorage.getItem(`${this.selectedJSON[i].name}`)));
      }
      this.projectService.addProject(this.projectName, this.transformIdentities(fileResults)).subscribe(() => this.getProjects());
    }
  }

  transformIdentities(fileResults){
    const data = [];
    fileResults?.forEach(fileResult => fileResult.forEach(result => data.push(result)));
    return data;
  }

  getFileNames() {
    if (this.selectedJSON instanceof File) {
      return this.selectedJSON.name;
    }
    return '';
  }

  readFile(file: File){
    const reader = new FileReader();
    reader.onloadend = function () {
      localStorage.setItem(`${file.name}`, reader.result.toString());
    }
    reader.readAsText(file);
  }
}
