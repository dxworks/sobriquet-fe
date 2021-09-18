import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {RepositoryPickerPopupComponent} from "../../components/popups/repository-picker-popup/repository-picker-popup.component";
import {Identity} from "../../data/identity";
import {IdentityService} from "../../services/identity.service";
import {FileUploaderPopupComponent} from "../../components/popups/file-uploader-popup/file-uploader-popup.component";
@Component({
  selector: 'app-main',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  githubIdentities: Identity[] = [];
  jiraIdentities: Identity[] = [];
  jenkinsIdentities: Identity[] = [];
  identities: Identity[] = [];

  constructor(public dialog: MatDialog,
              private identityService: IdentityService) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.identityService.getAllIdentities().subscribe(response => this.identities = response);
    this.githubIdentities = this.getGithubIdentities();
  }

  getGithubIdentities() {
    return this.identities.filter(identity => identity.source === 'github');
  }

  getJiraIdentities() {
    return this.identities.filter(identity => identity.source === 'jira');
  }

  getJenkinsIdentities() {
    return this.identities.filter(identity => identity.source === 'jenkins');
  }

  openDialog() {
    const dialogRef = this.dialog.open(RepositoryPickerPopupComponent);

    dialogRef.afterClosed().subscribe(() => this.getData());
  }

  openFileUploadDialog() {
    const dialogref = this.dialog.open(FileUploaderPopupComponent);

    dialogref.afterClosed().subscribe(result => {
      if (result) {
        const file: File = result;
        const reader = new FileReader();
        reader.onloadend = function () {
          localStorage.setItem('identities', reader.result.toString());
        }
        reader.readAsText(file);
        this.readData();
      }
    });
  }

  readData(){
    JSON.parse(localStorage.getItem('identities')).forEach(identity => {
      this.identities.push(identity);
      this.identityService.addIdentity(identity).subscribe();
    });
    localStorage.removeItem('identities');
  }

}
