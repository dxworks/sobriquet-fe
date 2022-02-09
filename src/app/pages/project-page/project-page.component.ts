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

  manageProjectChanges(identities, engineers) {
    if (engineers) {
      engineers.forEach(eng => this.engineerService.delete(eng.id).subscribe());
      setTimeout(() => this.engineerService.getAll().subscribe(response => {
        this.engineers = response.filter(eng => eng.project === this.project.id);
        this.identities = identities;
      }), 500);
    } else {
      this.engineerService.getAll().subscribe(response => {
        this.engineers = response.filter(eng => eng.project === this.project.id);
        this.identities = identities;
      });
    }
  }

  openFileUploadDialog() {
    const dialogRef = this.dialog.open(FileUploadPopupComponent, {data: {project: this.project}});

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getIdentities();
        this.engineers = response;
      }
    });
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
}
