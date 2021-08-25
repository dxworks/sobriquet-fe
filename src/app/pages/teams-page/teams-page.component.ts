import { Component, OnInit } from '@angular/core';
import {Team} from "../../data/team";
import {TeamsService} from "../../services/teams.service";

@Component({
  selector: 'app-teams-page',
  templateUrl: './teams-page.component.html',
  styleUrls: ['./teams-page.component.css']
})
export class TeamsPageComponent implements OnInit {

  teams: Team[] = []

  constructor(private teamService: TeamsService) { }

  ngOnInit(): void {
    this.teamService.getAllTeams().subscribe(response => this.teams = response);
  }

}
