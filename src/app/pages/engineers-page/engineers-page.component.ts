import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {NewEngineerPopupComponent} from "../../components/popups/new-engineer-popup/new-engineer-popup.component";
import {Engineer} from "../../data/engineer";
import {EngineerService} from "../../services/engineer.service";

@Component({
  selector: 'app-engineers-page',
  templateUrl: './engineers-page.component.html',
  styleUrls: ['./engineers-page.component.css']
})
export class EngineersPageComponent implements OnInit {

  engineers: Engineer[] = [];

  constructor(public dialog: MatDialog,
              private engineerService: EngineerService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.engineerService.getAll().subscribe(response => this.engineers = response);
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewEngineerPopupComponent);

    dialogRef.afterClosed().subscribe(() => this.getData());
  }

}
