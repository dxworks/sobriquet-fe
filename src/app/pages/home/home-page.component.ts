import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {RepositoryPickerPopupComponent} from "../../components/popups/repository-picker-popup/repository-picker-popup.component";
import {Identity} from "../../data/identity";
import {IdentityService} from "../../services/identity.service";

@Component({
  selector: 'app-main',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  identities: Identity[] = [];

  constructor(public dialog: MatDialog,
              private identityService: IdentityService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.identityService.getAllIdentities().subscribe(response => this.identities = response);
  }

  openDialog(){
    const dialogRef = this.dialog.open(RepositoryPickerPopupComponent);

    dialogRef.afterClosed().subscribe(() => this.getData());
  }

}
