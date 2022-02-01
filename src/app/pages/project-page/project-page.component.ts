import {Component, OnInit} from '@angular/core';
import {Identity} from '../../data/identity';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../../data/project';
import {Engineer} from '../../data/engineer';
import {ProjectService} from '../../services/project.service';
import {FileUploadPopupComponent} from '../../components/file-upload-popup/file-upload-popup.component';
import {MatDialog} from '@angular/material/dialog';

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
              public dialog: MatDialog,
              private projectService: ProjectService) {
    this.getIdentities();
  }

  getIdentities() {
    this.projectService.getAllProjects().subscribe(response => {
      this.project = response.find(project => project.name === this.activatedRoute.snapshot.url[this.activatedRoute.snapshot.url.length - 1].path);
      this.identities = this.project?.identities;
      this.transformIdentities();
    })
  }

  ngOnInit(): void {
  }

  transformIdentities() {
    this.identities?.forEach(identity => this.engineers.push({
      name: identity.firstName + ' ' + identity.lastName,
      email: identity.email,
      project: this.project.id,
      tags: [],
      teams: [],
      country: '',
      city: '',
      senority: '',
      role: '',
      identities: [],
      status: '',
      reportsTo: ''
    }));
  }

  manageProjectChanges($event) {
    this.identities = $event;
    this.engineers = [];
    this.transformIdentities()
  }

  openFileUploadDialog() {
    const dialogRef = this.dialog.open(FileUploadPopupComponent, {data: {project: this.project}});

    dialogRef.afterClosed().subscribe(response => {
      if (response === 'saved') {
        this.getIdentities();
      }
    });
  }
}
