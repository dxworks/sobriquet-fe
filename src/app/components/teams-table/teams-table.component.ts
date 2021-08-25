import {Component, Input, OnInit} from '@angular/core';
import {Team} from "../../data/team";
import {MatTableDataSource} from "@angular/material/table";
import {TeamsService} from "../../services/teams.service";
import {EngineerService} from "../../services/engineer.service";
import {Engineer} from "../../data/engineer";

@Component({
  selector: 'app-teams-table',
  templateUrl: './teams-table.component.html',
  styleUrls: ['./teams-table.component.css']
})
export class TeamsTableComponent implements OnInit {

  @Input()
  teams: Team[] = [];

  engineers: Engineer[] = [];

  displayedColumns = ['name', 'description', 'members', 'actions'];

  constructor(private engineerService: EngineerService) {
  }

  ngOnInit(): void {
    this.engineerService.getAll().subscribe(response => this.engineers = response);
  }

  applyFilter(filterValue: KeyboardEvent) {
    // filterValue = filterValue.target.trim();
    // filterValue = filterValue.toLowerCase();
    // this.dataSource.filter = filterValue;
  }

  deleteTeam(team: Team) {
  }

  getTeamEngineers(team: Team) {
    return this.engineers.filter(engineer => engineer.teams.includes(team.id));
  }
  addEngineerToTeam(team: Team){

  }

}
