import {Component, OnInit} from '@angular/core';
import {Team} from '../../data/team';
import {TeamsService} from '../../services/teams.service';
import {MatDialog} from '@angular/material/dialog';
import {NewTeamPopupComponent} from '../new-team-popup/new-team-popup.component';

@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.css']
})
export class TeamsPageComponent implements OnInit {

  teams: Team[] = []
  selectedTeam: Team;
  showAllTeams = false;

  constructor(private teamService: TeamsService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.teamService.getAllTeams().subscribe(response => {
      this.teams = response;
      this.selectedTeam = this.teams[0];
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewTeamPopupComponent);

    dialogRef.afterClosed().subscribe(() => this.getData());
  }

  selectTeam(team: Team) {
    this.showAllTeams = team.name.includes('HQ') || team.name.includes('EU');
    this.selectedTeam = team;
  }

}
