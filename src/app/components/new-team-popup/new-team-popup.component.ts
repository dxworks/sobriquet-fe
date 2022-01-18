import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Team} from '../../data/team';
import {TeamsService} from '../../services/teams.service';

@Component({
  selector: 'app-new-team-popup',
  templateUrl: './new-team-popup.component.html',
  styleUrls: ['./new-team-popup.component.css']
})
export class NewTeamPopupComponent implements OnInit {

  newTeam: Team = new class implements Team {
    description: string;
    id: string;
    name: string;
  };

  constructor(private dialogRef: MatDialogRef<NewTeamPopupComponent>,
              private teamsService: TeamsService) {
  }

  ngOnInit(): void {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  createTeam() {
    this.teamsService.addTeam(this.newTeam).subscribe(response => this.dialogRef.close(response));
  }

}
