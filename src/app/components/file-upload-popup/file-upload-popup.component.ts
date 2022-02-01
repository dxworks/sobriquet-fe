import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-file-upload-popup',
  templateUrl: './file-upload-popup.component.html',
  styleUrls: ['./file-upload-popup.component.css']
})
export class FileUploadPopupComponent implements OnInit {

  fileDropped = false;
  selectedJSON: File | File[];
  projectIdentities = []
  projectName = '';

  constructor(public dialogRef: MatDialogRef<FileUploadPopupComponent>,
              private projectService: ProjectService,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  ngOnInit(): void {
    this.projectName = this.data.project.id;
    this.projectIdentities = this.data.project.identities;
  }

  upload($event): void {
    this.selectedJSON = this.projectService.upload($event, this.fileDropped);
  }

  save() {
    if (this.selectedJSON instanceof File) {
      this.readFile(this.selectedJSON);
      this.projectService.editProject(this.projectName, this.projectIdentities.concat(JSON.parse(localStorage.getItem(`${this.selectedJSON.name}`)))).subscribe(() => {
        this.dialogRef.close('saved');
      });
    } else {
      let fileResults = [];
      for (let i = 0; i < this.selectedJSON.length; i++) {
        this.readFile(this.selectedJSON[i]);
        fileResults.push(JSON.parse(localStorage.getItem(`${this.selectedJSON[i].name}`)));
      }
      this.projectService.addProject(this.projectName, this.projectIdentities.concat(this.transformIdentities(fileResults))).subscribe(() => {
        this.dialogRef.close('saved');
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

}
