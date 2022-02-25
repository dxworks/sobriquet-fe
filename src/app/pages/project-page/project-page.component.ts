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

  constructor(private activatedRoute: ActivatedRoute,
              private engineerService: EngineerService,
              public dialog: MatDialog,
              private projectService: ProjectService) {
    this.getIdentities();
  }

  ngOnInit(): void {
  }

  getIdentities() {
    this.projectService.getAllProjects().subscribe(response => {
      this.project = response.find(project => project.name === this.activatedRoute.snapshot.url[1].path);
      this.identities = this.project?.identities;
    })
  }

  getEngineers(identities?) {
    this.engineerService.getAll().subscribe(response => {
      this.engineers = response.filter(eng => eng.project === this.project.id);
      if (identities?.length > 0) {
        this.identities = identities;
      }
    });
  }

  manageProjectChanges(identities, engineers) {
    if (engineers) {
      engineers.forEach(eng => this.engineerService.delete(eng.id).subscribe());
      setTimeout(() => this.engineerService.getAll().subscribe(response => {
        this.engineers = response.filter(eng => eng.project === this.project.id);
        this.identities = identities;
        this.removeDuplicate(engineers);
      }), 500);
    } else {
      this.getEngineers(identities);
    }
  }

  removeDuplicate(engineers: Engineer[]) {
    engineers.forEach(eng => {
      this.engineers.forEach(savedEng => {
        if (eng.email === savedEng.email && savedEng.identities.length === 0) {
          this.engineerService.delete(savedEng.id).subscribe(() => {
            this.engineerService.getAll().subscribe(res => this.engineers = res.filter(eng => eng.project === this.project.id));
          });
        }
      })
    })
  }

  openFileUploadDialog() {
    const dialogRef = this.dialog.open(FileUploadPopupComponent, {data: {project: this.project}});

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getIdentities();
        this.engineers = response;
        this.engineerService.getAll().subscribe(response => {
          this.allEngineers = response;
          this.getMergedIdentitiesOnMatch();
        });
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
    this.projectService.editProject(this.project.id, this.project.identities).subscribe();
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
    this.getEngineers(undefined)
  }
}
