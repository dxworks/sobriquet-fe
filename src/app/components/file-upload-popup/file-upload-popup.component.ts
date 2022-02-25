import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProjectService} from '../../services/project.service';
import {EngineerService} from '../../services/engineer.service';

@Component({
  selector: 'app-file-upload-popup',
  templateUrl: './file-upload-popup.component.html',
  styleUrls: ['./file-upload-popup.component.css']
})
export class FileUploadPopupComponent implements OnInit {

  fileDropped = false;
  selectedJSON: File | File[];
  projectIdentities = []
  projectId = '';

  constructor(public dialogRef: MatDialogRef<FileUploadPopupComponent>,
              private projectService: ProjectService,
              private engineerService: EngineerService,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit(): void {
    this.projectId = this.data.project.id;
    this.projectIdentities = this.data.project.identities;
  }

  upload($event): void {
    this.selectedJSON = this.projectService.upload($event, this.fileDropped);
  }

  save() {
    if (this.selectedJSON instanceof File) {
      this.readFile(this.selectedJSON);
      this.projectService.editProject(this.projectId, this.projectIdentities.concat(this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(this.selectedJSON.name))))).subscribe(() => {
        const identities: any = this.selectedJSON;
        const engineers = this.changeIdentityToEngineer(this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(identities.name))), this.projectId)
        this.dialogRef.close(engineers);
      });
    } else {
      let fileResults = [];
      for (let i = 0; i < this.selectedJSON.length; i++) {
        this.readFile(this.selectedJSON[i]);
        fileResults.push(this.projectService.transformIdentitiesName(JSON.parse(localStorage.getItem(`${this.selectedJSON[i].name}`))));
      }
      this.projectService.editProject(this.projectId, this.projectIdentities.concat(this.transformIdentities(fileResults))).subscribe(() => {
        const engineers = this.changeIdentityToEngineer(this.transformIdentities(fileResults), this.projectId);
        this.dialogRef.close(engineers);
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

  changeIdentityToEngineer(identities, projectId) {
    const engineers = [];
    identities?.forEach(identity => engineers.push({
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
      username: identity.username,
      ignorable: false
    }));
    this.saveEngineers(engineers);
    return engineers;
  }

  saveEngineers(engineers) {
    engineers.forEach(engineer => this.engineerService.add(engineer).subscribe());
  }

}
