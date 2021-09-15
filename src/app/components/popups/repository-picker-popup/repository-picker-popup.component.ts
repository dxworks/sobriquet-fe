import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {GithubService} from "../../../services/ToolsService/github.service";
import {IdentityService} from "../../../services/identity.service";
import {Identity} from "../../../data/identity";
import {Repository} from "../../../data/repository";
import {RepositoryService} from "../../../services/repository.service";

@Component({
  selector: 'app-identity-linker-popup',
  templateUrl: './repository-picker-popup.component.html',
  styleUrls: ['./repository-picker-popup.component.css']
})
export class RepositoryPickerPopupComponent implements OnInit {

  repositories: Repository[] = [];

  selectedRepository: Repository;

  repositoriesFormControl = new FormControl();

  ownerUsername: string = '';

  token: string = '';

  emailAddress: string = '';

  collaborators;

  constructor(private repositoryService: RepositoryService,
              private githubService: GithubService,
              private identityService: IdentityService,
              private dialogRef: MatDialogRef<RepositoryPickerPopupComponent>) {
  }

  ngOnInit(): void {
    this.repositoryService.getAllRepos().subscribe(response => this.repositories = response);
    this.repositoriesFormControl.valueChanges.subscribe(response => this.selectedRepository = response);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  search() {
    this.githubService.getCollaborators(this.selectedRepository.owner, this.selectedRepository.name, this.emailAddress, this.token)
      .subscribe(response => {
        this.collaborators = response;
        this.collaborators.forEach(collaborator => {
          const data = this.buildIdentity(collaborator);
          this.createIdentity(data);
        });
      });
  }

  createIdentity(identity: Identity) {
    this.identityService.addIdentity(identity).subscribe(() =>  this.onCancelClick());
  }

  buildIdentity(collaborator){
    return {
      firstName: '',
      lastName: '',
      username: collaborator.login,
      avatar: collaborator.avatar_url,
      email: ''
    } as Identity;
  }
}
