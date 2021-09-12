import { Component, OnInit } from '@angular/core';
import {Repository} from "../../data/repository";
import {RepositoryService} from "../../services/repository.service";
import {MatDialog} from "@angular/material/dialog";
import {NewRepositoryPopupComponent} from "../../components/popups/new-repository-popup/new-repository-popup.component";

@Component({
  selector: 'app-repositories-page',
  templateUrl: './repositories-page.component.html',
  styleUrls: ['./repositories-page.component.css']
})
export class RepositoriesPageComponent implements OnInit {

  repositories: Repository[] = []

  constructor(private repoService: RepositoryService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.repoService.getAllRepos().subscribe(response => this.repositories = response);
  }

  openDialog(){
    const dialogRef = this.dialog.open(NewRepositoryPopupComponent);

    dialogRef.afterClosed().subscribe(() => this.getData());
  }

}
