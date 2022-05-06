import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../data/project';
import { Identity } from '../../data/identity';
import { Engineer } from '../../data/engineer';

@Component({
  selector: 'app-file-upload-popup',
  templateUrl: './file-upload-popup.component.html',
  styleUrls: ['./file-upload-popup.component.css']
})
export class FileUploadPopupComponent implements OnInit {

  fileDropped = false;
  selectedJSON: File | File[];
  projectIdentities: Identity[] = []
  projectEngineers: Engineer[] = [];
  project: Project;

  constructor(public dialogRef: MatDialogRef<FileUploadPopupComponent>,
              private projectService: ProjectService,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit(): void {
    this.project = this.data.project;
    this.projectIdentities = this.data.project.identities;
    this.projectEngineers = this.data.project.engineers;
  }

  upload($event): void {
    this.selectedJSON = this.projectService.upload($event, this.fileDropped);
  }

  save() {
    if (this.selectedJSON instanceof File) {
      this.readFile(this.selectedJSON);
      this.project.identities = this.projectIdentities.concat(this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(this.selectedJSON.name))));
      this.project.engineers = this.projectEngineers.concat(this.changeIdentityToEngineer(this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(this.selectedJSON.name)))));
      this.projectService.editProject(this.project.id, this.project).subscribe(() => {
        this.dialogRef.close(this.project.engineers);
      });
    } else {
      let fileResults = [];
      for (let i = 0; i < this.selectedJSON.length; i++) {
        this.readFile(this.selectedJSON[i]);
        fileResults.push(this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(`${this.selectedJSON[i].name}`))));
      }
      this.project.identities = this.projectIdentities.concat(this.transformIdentities(fileResults));
      this.project.engineers = this.projectEngineers.concat(this.changeIdentityToEngineer(this.transformIdentities(fileResults)));
      this.projectService.editProject(this.project.id, this.project).subscribe(() => {
        this.dialogRef.close(this.project.engineers);
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
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

  changeIdentityToEngineer(identities: Identity[]) {
    const engineers = [];
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
      engineers.push(engineer);
    });
    return engineers;
  }
}
