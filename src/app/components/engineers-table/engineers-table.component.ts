import {Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {Engineer} from "../../data/engineer";
import {EngineerService} from "../../services/engineer.service";
import {Project} from "../../data/project";
import {MatTableDataSource} from "@angular/material/table";
import {Identity} from "../../data/identity";
import {Team} from "../../data/team";
import {TeamsService} from "../../services/teams.service";
import {NewTeamPopupComponent} from "../popups/new-team-popup/new-team-popup.component";
import {MatDialog} from "@angular/material/dialog";

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

  @Output()
  suggestionDenied = new EventEmitter();
  @Output()
  suggestionAccepted = new EventEmitter();

  dataSource: MatTableDataSource<Engineer>;

  displayedColumns = ['firstname', 'lastname', 'email', 'position', 'phone', 'city', 'country'];

  valueSaved: Engineer[] = [];

  allEngineers: Engineer[] = [];

  teams: Team[] = [];

  filteredTeams: Team[] = [];

  disableButtons = false;

  constructor(private engineerService: EngineerService,
              private teamService: TeamsService,
              public dialog: MatDialog) {
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
  }

  getTeams() {
    this.teamService.getAllTeams().subscribe(response => this.filteredTeams = this.teams = response);
  }

  updateTableView(){
    this.engineerService.getAll().subscribe(response => {
      this.engineers = response;
      this.getTableData();
    })
  }

  getTableData() {
    this.dataSource = new MatTableDataSource(this.engineers);
  }

  acceptSuggestion(engineer: Engineer) {
    this.engineerService.add(engineer).subscribe(() => this.suggestionAccepted.emit(this.suggestions));
    this.suggestionAccepted.emit(this.suggestions);
    this.disableButtons = true;
  }

  denySuggestion(engineer: Engineer) {
    this.engineers.splice(this.engineers.indexOf(engineer), 1);
    this.getTableData();
    this.suggestionDenied.emit(this.suggestions);
  }

  getTeamName(teamId: string) {
    return this.teams.find(team => team.id === teamId)?.name;
  }

  selectTeam($event, engineer: Engineer) {
    $event?.id ? this.linkTeamToEngineer($event.id, engineer.id) : this.openCreateNewTeamPopup(engineer);
  }

  linkTeamToEngineer(teamId, engineerId) {
    this.engineerService.linkTeam(engineerId, teamId).subscribe(() => this.updateTableView());
  }

  onKey($event) {
    let searchValue = ''
    if ($event.key === 'Backspace') {
      searchValue = searchValue.substring(0, searchValue.length - 1);
    } else {
      searchValue += $event.key;
    }
    this.filteredTeams = this.search(searchValue);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.teams.filter(option => option.name.toLowerCase().includes(filter));
  }

  openCreateNewTeamPopup(engineer) {
    const dialogRef = this.dialog.open(NewTeamPopupComponent);

    dialogRef.afterClosed().subscribe(response => {
      this.getTeams();
      this.linkTeamToEngineer(response.id, engineer.id);
      this.updateTableView();
    });
  }

  saveChanges(engineer) {
    this.engineerService.edit(engineer).subscribe(() => this.getTableData());
  }

  manageSelection($event, engineer) {
    if (engineer.teams.length === 0) {
      this.selectTeam($event, engineer);
    }
  }
}
