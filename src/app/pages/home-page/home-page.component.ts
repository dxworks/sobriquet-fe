import {Component, OnInit} from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../data/project';
import {Router} from '@angular/router';
import {Engineer} from '../../data/engineer';
import {EngineerService} from '../../services/engineer.service';

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

  constructor(private projectService: ProjectService,
              private engineerService: EngineerService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.projectService.getAllProjects().subscribe(response => this.projects = response);
  }

  upload($event): void {
    this.selectedJSON = this.projectService.upload($event, this.fileDropped);
  }

  save() {
    if (this.selectedJSON instanceof File) {
      this.readFile(this.selectedJSON);
      this.projectService.addProject(this.projectName, this.selectedJSON).subscribe(response => {
        this.getProjects();
        const identities: any = this.selectedJSON;
        this.changeIdentityToEngineer(JSON.parse(localStorage.getItem(`${identities.name}`)), response.uuid)
        this.router.navigate([`/project/${response.name}/identities`]).then();
      });
    } else {
      let fileResults = [];
      for (let i = 0; i < this.selectedJSON.length; i++) {
        this.readFile(this.selectedJSON[i]);
        fileResults.push(JSON.parse(localStorage.getItem(`${this.selectedJSON[i].name}`)));
      }
      this.projectService.addProject(this.projectName, this.transformIdentities(fileResults)).subscribe(response => {
        this.getProjects();
        this.changeIdentityToEngineer(this.transformIdentities(fileResults), response.uuid);
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

  changeIdentityToEngineer(identities, projectId) {
    identities?.forEach(identity => this.engineers.push({
      name: identity.firstName + ' ' + identity.lastName,
      email: identity.email,
      project: projectId,
      tags: [],
      teams: [],
      country: '',
      city: '',
      senority: '',
      role: '',
      identities: [],
      status: '',
      reportsTo: '',
      username: '',
      ignorable: false
    }));
    this.saveEngineers();
  }

  saveEngineers() {
    this.engineers.forEach(engineer => this.engineerService.add(engineer).subscribe());
  }
}
