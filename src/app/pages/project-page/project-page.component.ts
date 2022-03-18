import {Component, OnInit} from '@angular/core';
import {Identity} from '../../data/identity';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../../data/project';
import {Engineer} from '../../data/engineer';
import {ProjectService} from '../../services/project.service';
import {FileUploadPopupComponent} from '../../components/file-upload-popup/file-upload-popup.component';
import {MatDialog} from '@angular/material/dialog';
import {EngineerService} from '../../services/engineer.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {

  project: Project;
  identities: Identity[] = [];
  engineers: Engineer[] = [];
  engineer: Engineer;
  suggestions: Identity[] = [];
  demergedIdentities: Identity[] = [];
  allEngineers: Engineer[] = [];
  currentView = ''

  constructor(private activatedRoute: ActivatedRoute,
              private engineerService: EngineerService,
              public dialog: MatDialog,
              private projectService: ProjectService) {
    this.getProjectDetails();
  }

  ngOnInit(): void {
  }

  getProjectDetails() {
    this.projectService.getAllProjects().subscribe(response => {
      this.project = response.find(project => project.name === this.activatedRoute.snapshot.url[1].path);
      this.identities = this.project?.identities;
      this.engineers = this.project?.engineers
    })
  }

  updateIdentities(identities?) {
    if (identities?.length > 0) {
      this.identities = identities;
    }
  }

  manageProjectChanges(identities, engineers) {
    if (engineers) {
      engineers.forEach(eng => this.project.engineers.splice(this.project.engineers.indexOf(eng), 1));
      this.projectService.editProject(this.project.id, this.project).subscribe(() => this.getProjectDetails());
      this.engineers = this.project.engineers;
      this.identities = identities;
    } else {
      this.updateIdentities(identities);
    }
  }

  removeDuplicate(engineers: Engineer[]) {
    engineers.forEach(eng => {
      this.engineers.forEach(savedEng => {
        if (eng?.email === savedEng?.email && savedEng?.identities.length === 0) {
          this.project.engineers.splice(this.project.engineers.indexOf(savedEng), 1);
          this.projectService.editProject(this.project.id, this.project).subscribe();
          this.engineers = this.project.engineers;
        }
      })
    })
  }

  openFileUploadDialog() {
    const dialogRef = this.dialog.open(FileUploadPopupComponent, {data: {project: this.project}});

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getProjectDetails();
        this.engineers = response;
        this.allEngineers = this.project.engineers;
        this.getMergedIdentitiesOnMatch();
      }
    });
  }

  getMergedIdentitiesOnMatch() {
    const allIdentities = [];
    this.identities.forEach(identity => {
      this.allEngineers.forEach(engineer => {
        if (engineer.identities.find(id => id.email === identity.email) && !allIdentities.includes(identity)) {
          allIdentities.push(identity);
        }
      })
    });
    this.project.identities = this.identities.concat(allIdentities);
    this.projectService.editProject(this.project.id, this.project).subscribe();
  }


  manageDemerge($event) {
    const newIdentities = [];
    $event.forEach(identity => {
      if (!this.demergedIdentities.includes(identity)) {
        newIdentities.push(identity);
      }
    });
    this.demergedIdentities = newIdentities;
  }

  changeEngineerDetails() {
    this.getProjectDetails();
    this.updateIdentities(undefined)
  }

  scroll($event) {
    this.currentView = $event;
    document.getElementById($event).scrollIntoView();
  }
}
