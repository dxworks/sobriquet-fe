import {Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {Engineer} from "../../data/engineer";
import {EngineerService} from "../../services/engineer.service";
import {Project} from "../../data/project";
import {MatTableDataSource} from "@angular/material/table";
import {Identity} from "../../data/identity";
import {Team} from "../../data/team";
import {TeamsService} from "../../services/teams.service";

@Component({
  selector: 'app-engineers-table',
  templateUrl: './engineers-table.component.html',
  styleUrls: ['./engineers-table.component.css']
})
export class EngineersTableComponent implements OnInit, OnChanges {

  @Input()
  engineer: Engineer;
  @Input()
  engineers: Engineer[] = [];
  @Input()
  project: Project;
  @Input()
  suggestions: Identity[] = [];
  @Input()
  filter: Project;

  dataSource: MatTableDataSource<Engineer>;

  displayedColumns = ['firstname', 'lastname', 'email', 'position', 'phone', 'city', 'country'];

  valueSaved: Engineer[] = [];

  allEngineers: Engineer[] = [];

  teams: Team[] = [];

  filteredTeams: Team[] = [];

  disableButtons = false;

  newTeamName: string = '';

  shiftKeyUp = false;


  constructor(private engineerService: EngineerService,
              private teamService: TeamsService) {
  }

  ngOnInit(): void {
    if (this.project) {
      this.engineerService.getAll().subscribe(engineers => {
        this.allEngineers = engineers;
        engineers.forEach(engineer => {
          if (engineer.projects.some(prname => prname === this.project?.name)) {
            this.engineers.push(engineer);
            this.getTableData();
          }
        })
      });
      this.displayedColumns.push('actions');
    } else {
      this.getTableData();
      this.valueSaved = this.engineers;
      this.displayedColumns.push('projects');
      this.displayedColumns.push('teams');
      this.displayedColumns.push('teamsAction');
      this.getTeams();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.engineer?.firstChange && this.project) {
      this.engineers.push(this.engineer);
      this.getTableData()
    }
    if (!changes.filter?.firstChange && !this.project){
      this.applyFilter();
    }
  }

  applyFilter(){
    this.dataSource = new MatTableDataSource(this.engineers.filter(engineer => engineer.projects.find(project => project === this.filter.name)));
  }

  getTeams() {
    this.teamService.getAllTeams().subscribe(response => this.filteredTeams = this.teams = response);
  }

  updateTableView() {
    this.engineerService.getAll().subscribe(response => {
      this.engineers = response;
      this.getTableData();
    })
  }

  getTableData() {
    this.dataSource = new MatTableDataSource(this.engineers);
  }

  getTeamName(teamId: string) {
    return this.teams.find(team => team.id === teamId)?.name;
  }

  selectTeam($event, engineer: Engineer) {
    $event?.id ? this.linkTeamToEngineer($event.id, engineer.id) : this.createTeam(engineer);
  }

  linkTeamToEngineer(teamId, engineerId) {
    this.engineerService.linkTeam(engineerId, teamId).subscribe(() => this.updateTableView());
  }

  onKey($event) {
    if ($event.key === 'Backspace') {
      this.newTeamName = this.newTeamName.substring(0, this.newTeamName.length - 1);
    } else if ($event.key === 'Shift') {
      this.shiftKeyUp = !this.shiftKeyUp;
    } else if ($event.key === 'CapsLock') {
      this.shiftKeyUp = false;
    } else {
      if (this.shiftKeyUp) {
        this.newTeamName += $event.key.toUpperCase();
        this.shiftKeyUp = false;
      } else {
        this.newTeamName += $event.key;
      }
    }
    this.filteredTeams = this.search();
  }

  search() {
    let filter = this.newTeamName.toLowerCase();
    return this.teams.filter(option => option.name.toLowerCase().includes(filter));
  }

  saveChanges(engineer) {
    this.engineerService.edit(engineer).subscribe(() => this.getTableData());
  }

  createTeam(engineer: Engineer) {
    this.teamService.addTeam({name: this.newTeamName, description: ''}).subscribe(response => {
      let data: any = response;
      this.getTeams();
      this.linkTeamToEngineer(data.id, engineer.id);
      this.updateTableView();
      this.newTeamName = '';
    });
  }

  manageSelection($event, engineer) {
    if (engineer.teams.length === 0) {
      this.selectTeam($event, engineer);
    }
  }
}
