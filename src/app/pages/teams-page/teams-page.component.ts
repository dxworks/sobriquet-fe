import { Component, OnInit } from '@angular/core';
import {Team} from "../../data/team";
import {TeamsService} from "../../services/teams.service";
import {MatDialog} from "@angular/material/dialog";
import {NewTeamPopupComponent} from "../../components/popups/new-team-popup/new-team-popup.component";

@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.css']
})
export class TeamsPageComponent implements OnInit {

  teams: Team[] = []

  constructor(private teamService: TeamsService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.teamService.getAllTeams().subscribe(response => this.teams = response);
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewTeamPopupComponent);

    dialogRef.afterClosed().subscribe(() => this.getData());
  }

}
