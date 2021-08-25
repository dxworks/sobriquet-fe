import {Component, Input, OnInit} from '@angular/core';
import {Engineer} from "../../data/engineer";
import {TeamsService} from "../../services/teams.service";
import {Team} from "../../data/team";

@Component({
  selector: 'app-engineer-card',
  templateUrl: './engineer-card.component.html',
  styleUrls: ['./engineer-card.component.css']
})
export class EngineerCardComponent implements OnInit {

  @Input()
  engineer: Engineer;

  teams: Team[] = [];

  constructor(private teamService: TeamsService) { }

  ngOnInit(): void {
    this.teamService.getAllTeams().subscribe(response => this.teams = response);
  }

  getTeamName(teamId: string){
    return this.teams.find(team => team.id === teamId)?.name;
  }

}
