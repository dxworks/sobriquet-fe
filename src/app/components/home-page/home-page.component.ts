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
    this.projectService.allProjects$.subscribe(response => this.projects = response);
  }

  upload($event): void {
    this.selectedJSON = this.projectService.upload($event, this.fileDropped);
  }

  save() {
    if (this.selectedJSON instanceof File) {
      this.readFile(this.selectedJSON);
      this.projectService.addProject(this.projectName, this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(this.selectedJSON.name)))).subscribe(response => {
        localStorage.setItem('project', JSON.stringify(response));
        const identities: any = this.selectedJSON;
        this.changeIdentityToEngineer(this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(identities.name))), response.uuid)
        this.router.navigate([`/project/${response.name}/identities`]).then();
      });
    } else {
      let fileResults = [];
      for (let i = 0; i < this.selectedJSON.length; i++) {
        this.readFile(this.selectedJSON[i]);
        fileResults.push(this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(`${this.selectedJSON[i].name}`))));
      }
      this.projectService.addProject(this.projectName, this.transformIdentities(fileResults)).subscribe(response => {
        localStorage.setItem('project', JSON.stringify(response));
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
      engineer.project = projectId;
      this.engineers.push(engineer);
    });
    this.saveEngineers();
  }

  saveEngineers() {
    this.engineerService.addEngineers(this.engineers).subscribe();
  }
}
