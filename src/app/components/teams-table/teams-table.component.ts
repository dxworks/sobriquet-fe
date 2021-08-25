import {Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Team} from "../../data/team";
import {TeamsService} from "../../services/teams.service";
import {EngineerService} from "../../services/engineer.service";
import {Engineer} from "../../data/engineer";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TeamLinkerPopupComponent} from "../popups/team-linker-popup/team-linker-popup.component";

@Component({
  selector: 'app-teams-table',
  templateUrl: './teams-table.component.html',
  styleUrls: ['./teams-table.component.css']
})
export class TeamsTableComponent implements OnInit, OnChanges {

  @Input()
  teams: Team[] = [];
  @Output()
  teamDeleted = new EventEmitter();

  engineers: Engineer[] = [];

  displayedColumns = ['name', 'description', 'members', 'actions'];

  dataSource: MatTableDataSource<Team> = new MatTableDataSource(this.teams);

  constructor(private engineerService: EngineerService,
              private teamsService: TeamsService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getEngineers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.teams) {
      this.dataSource = new MatTableDataSource(this.teams);
    }
  }

  getEngineers() {
    this.engineerService.getAll().subscribe(response => this.engineers = response);
  }

  handleInput($event) {
    return this.applyFilter($event.target.value);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    this.dataSource.filter = filterValue;
  }

  deleteTeam(team: Team) {
    this.teamsService.deleteTeam(team.id).subscribe(() => this.teamDeleted.emit());
  }

  getTeamEngineers(team: Team) {
    return this.engineers.filter(engineer => engineer.teams.includes(team.id));
  }

  openDialog(team: Team) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: team,
      source: 'TeamsTable'
    };
    const dialogRef = this.dialog.open(TeamLinkerPopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.getEngineers();
      this.getTeamEngineers(team);
    });
  }

}
