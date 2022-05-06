import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../data/project';
import { Router } from '@angular/router';
import { Engineer } from '../../data/engineer';
import { EngineerService } from '../../services/engineer.service';

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
  engineers: Engineer[] = [];
  project: Project = new Project();

  constructor(private projectService: ProjectService,
              private engineerService: EngineerService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.projectService.allProjects$.subscribe(response => this.projects = response);
  }

  upload($event): void {
    this.selectedJSON = this.projectService.upload($event, this.fileDropped);
  }

  save() {
    if (this.selectedJSON instanceof File) {
      this.readFile(this.selectedJSON);
      this.changeIdentityToEngineer(this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(this.selectedJSON.name))))
      this.project.identities = this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(this.selectedJSON.name)));
      this.project.engineers = this.engineers;
      this.project.name = this.projectName;
      this.projectService.addProject(this.project).subscribe(() => {
        this.getProjects();
        this.router.navigate([`/project/${this.projectName}/identities`]).then();
      });
    } else {
      let fileResults = [];
      for (let i = 0; i < this.selectedJSON.length; i++) {
        this.readFile(this.selectedJSON[i]);
        fileResults.push(this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(`${this.selectedJSON[i].name}`))));
      }
      this.changeIdentityToEngineer(this.transformIdentities(fileResults));
      this.project.name = this.projectName;
      this.project.identities = this.transformIdentities(fileResults);
      this.project.engineers = this.engineers;
      this.projectService.addProject(this.project).subscribe(response => {
        this.getProjects();
        this.router.navigate([`/project/${response.name}/identities`]).then();
      });
    }
  }

  transformIdentities(fileResults) {
    const data = [];
    fileResults?.forEach(fileResult => fileResult.forEach(result => data.push(result)));
    return data;
  }

  getFileNames() {
    if (this.selectedJSON instanceof File) {
      return this.selectedJSON.name;
    } else {
      let title = '';
      for (let i = 0; i < this.selectedJSON?.length; i++) {
        title += this.selectedJSON[i].name + ', ';
      }
      return title.slice(0, -2);
    }
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onloadend = function () {
      localStorage.setItem(`${file.name}`, reader.result.toString());
    }
    reader.readAsText(file);
  }

  changeIdentityToEngineer(identities) {
    identities?.forEach(identity => {
      let engineer = new Engineer();
      if (identity.username) {
        engineer.username = identity.username;
      }
      if (identity.firstName) {
        identity.lastName ? engineer.name = identity.firstName + ' ' + identity.lastName : engineer.name = identity.firstName;
      } else {
        if (identity.lastName) {
          engineer.name = identity.lastName;
        }
      }
      if (identity.email) {
        engineer.email = identity.email;
      }
      this.engineers.push(engineer);
    });
  }
}
