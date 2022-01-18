import {Component, Inject, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Team} from '../../data/team';
import {Engineer} from '../../data/engineer';
import {EngineerService} from '../../services/engineer.service';
import {TeamsService} from '../../services/teams.service';

@Component({
  selector: 'app-team-linker-popup',
  templateUrl: './team-linker-popup.component.html',
  styleUrls: ['./team-linker-popup.component.css']
})
export class TeamLinkerPopupComponent implements OnInit {

  teams: Team[] = [];

  engineers: Engineer[] = [];

  selectedTeam: Team;

  selectedEngineer: Engineer;

  teamsFormControl = new FormControl();

  engineersFormControl = new FormControl();

  constructor(private dialogRef: MatDialogRef<TeamLinkerPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private engineerService: EngineerService,
              private teamsService: TeamsService) {
  }

  ngOnInit(): void {
    this.teamsService.getAllTeams().subscribe(response => this.teams = response);
    this.teamsFormControl.valueChanges.subscribe(response => this.selectedTeam = response);

    this.engineerService.getAll().subscribe(response => this.engineers = response);
    this.engineersFormControl.valueChanges.subscribe(response => this.selectedEngineer = response);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  linkTeamToEngineer(engineerId: string, teamId: string) {
    this.engineerService.linkTeam(engineerId, teamId).subscribe(() => this.onCancelClick());
  }

}
