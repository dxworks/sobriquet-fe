import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Engineer} from "../../data/engineer";
import {TeamsService} from "../../services/teams.service";
import {Team} from "../../data/team";
import {EngineerService} from "../../services/engineer.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TeamLinkerPopupComponent} from "../popups/team-linker-popup/team-linker-popup.component";

@Component({
  selector: 'app-engineer-card',
  templateUrl: './engineer-card.component.html',
  styleUrls: ['./engineer-card.component.css']
})
export class EngineerCardComponent implements OnInit {

  @Input()
  engineer: Engineer;

  @Output()
  engineerDeletedEventEmitter = new EventEmitter();

  @Output()
  teamLinkedEventEmitter = new EventEmitter();

  teams: Team[] = [];

  constructor(private teamService: TeamsService,
              private engineerService: EngineerService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.teamService.getAllTeams().subscribe(response => this.teams = response);
  }

  getTeamName(teamId: string){
    return this.teams.find(team => team.id === teamId)?.name;
  }

  delete(engineerId: String){
    this.engineerService.delete(engineerId).subscribe(() => this.engineerDeletedEventEmitter.emit());
  }

  openDialog(engineer: Engineer){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: engineer,
      source: 'EngineerCard'
    };
    const dialogRef = this.dialog.open(TeamLinkerPopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.teamLinkedEventEmitter.emit());
  }

}
