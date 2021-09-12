import { Component, OnInit } from '@angular/core';
import {Repository} from "../../../data/repository";
import {MatDialogRef} from "@angular/material/dialog";
import {RepositoryService} from "../../../services/repository.service";

@Component({
  selector: 'app-new-repository-popup',
  templateUrl: './new-repository-popup.component.html',
  styleUrls: ['./new-repository-popup.component.css']
})
export class NewRepositoryPopupComponent implements OnInit {

  newRepository: Repository = new class implements Repository {
    id: string;
    name: string;
    owner: string;
  };

  constructor(private dialogRef: MatDialogRef<NewRepositoryPopupComponent>,
              private repositoryService: RepositoryService) { }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  createRepository(){
    this.repositoryService.addRepo(this.newRepository).subscribe(() => this.onCancelClick());
  }

}
