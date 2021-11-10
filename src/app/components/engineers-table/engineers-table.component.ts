import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Engineer} from "../../data/engineer";
import {EngineerService} from "../../services/engineer.service";
import {Project} from "../../data/project";
import {MatTableDataSource} from "@angular/material/table";
import {Identity} from "../../data/identity";
import {Team} from "../../data/team";
import {TeamsService} from "../../services/teams.service";
import {ProjectService} from "../../services/project.service";
import {TagService} from "../../services/tag.service";
import {Tag} from "../../data/tag";
import {Role} from "../../data/role";
import {RoleService} from "../../services/role.service";

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

  displayedColumns = ['firstname', 'lastname', 'email', 'city', 'country', 'position', 'role', 'roleActions', 'tags', 'tagsAction'];

  valueSaved: Engineer[] = [];

  allEngineers: Engineer[] = [];

  teams: Team[] = [];

  filteredTeams: Team[] = [];

  filteredTags: Tag[] = [];

  filteredRoles: Role[] = [];

  newTeamName: string = '';

  newTagName: string = '';

  newRoleName: string = '';

  shiftKeyUp = false;

  projects: Project[] = [];

  tags: Tag[] = [];

  roles: Role[] = [];


  constructor(private engineerService: EngineerService,
              private teamService: TeamsService,
              private projectService: ProjectService,
              private tagService: TagService,
              private roleService: RoleService) {
  }

  ngOnInit(): void {
    if (this.project) {
      this.engineerService.getAll().subscribe(engineers => {
        this.allEngineers = engineers;
        engineers.forEach(engineer => {
          if (engineer.project ===  this.project?.id) {
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
      this.getProjects();
    }

    this.getTags();
    this.getRoles();
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

  updateTableView() {
    this.engineerService.getAll().subscribe(response => {
      this.engineers = response;
      this.getTableData();
    })
  }

  getTableData() {
    this.dataSource = new MatTableDataSource(this.engineers);
  }

  applyFilter(){
    this.dataSource = new MatTableDataSource(this.engineers.filter(engineer => engineer.project === this.filter.id));
  }

  getTeams() {
    this.teamService.getAllTeams().subscribe(response => this.filteredTeams = this.teams = response);
  }

  getTags() {
    this.tagService.getAllTags().subscribe(response => this.filteredTags = this.tags = response);
  }

  getRoles() {
    this.roleService.getAllRoles().subscribe(response => this.filteredRoles = this.roles = response);
  }

  getProjects(){
    this.projectService.getAllProjects().subscribe(response => this.projects = response);
  }

  getEngineerProject(projectId) {
    return this.projects.find(project => project.id === projectId)?.name;
  }

  getTeamName(teamId: string) {
    return this.teams.find(team => team.id === teamId)?.name;
  }

  selectTeam($event, engineer: Engineer) {
    $event?.id ? this.linkTeamToEngineer($event.id, engineer.id) : this.createTeam(engineer);
  }

  selectTag($event, engineer: Engineer) {
    $event?.name ? this.linkTagToEngineer($event, engineer) : this.createTag(engineer);
  }

  selectRole($event, engineer: Engineer) {
    $event?.name ? this.linkRoleToEngineer($event, engineer) : this.createRole(engineer);
  }

  linkTeamToEngineer(teamId, engineerId) {
    this.engineerService.linkTeam(engineerId, teamId).subscribe(() => this.updateTableView());
  }

  linkTagToEngineer(tag, engineer, onCreate?) {
    if (onCreate) {
      engineer.tags.push(tag);
    }
    this.engineerService.edit(engineer).subscribe(() => this.updateTableView());
  }

  linkRoleToEngineer($event, engineer) {
    engineer.role = $event.name;
    this.engineerService.edit(engineer).subscribe(() => {
      this.updateTableView();
    });
  }

  onKeyTeams($event) {
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
    this.filteredTeams = this.searchTeam();
  }

  onKeyTag($event){
    if ($event.key === 'Backspace') {
      this.newTagName = this.newTagName.substring(0, this.newTagName.length - 1);
    } else if ($event.key === 'Shift') {
      this.shiftKeyUp = !this.shiftKeyUp;
    } else if ($event.key === 'CapsLock') {
      this.shiftKeyUp = false;
    } else {
      if (this.shiftKeyUp) {
        this.newTagName += $event.key.toUpperCase();
        this.shiftKeyUp = false;
      } else {
        this.newTagName += $event.key;
      }
    }
    this.filteredTags = this.searchTag();
  }

  onKeyRole($event) {
    if ($event.key === 'Backspace') {
      this.newRoleName = this.newRoleName.substring(0, this.newRoleName.length - 1);
    } else if ($event.key === 'Shift') {
      this.shiftKeyUp = !this.shiftKeyUp;
    } else if ($event.key === 'CapsLock') {
      this.shiftKeyUp = false;
    } else {
      if (this.shiftKeyUp) {
        this.newRoleName += $event.key.toUpperCase();
        this.shiftKeyUp = false;
      } else {
        this.newRoleName += $event.key;
      }
    }
    this.filteredRoles = this.searchRole();
  }

  searchTeam() {
    let filter = this.newTeamName.toLowerCase();
    return this.teams.filter(option => option.name.toLowerCase().includes(filter));
  }

  searchTag() {
    let filter = this.newTagName.toLowerCase();
    return this.tags.filter(option => option.name.toLowerCase().includes(filter));
  }

  searchRole() {
    let filter = this.newRoleName.toLowerCase();
    return this.roles.filter(option => option.name.toLowerCase().includes(filter));
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

  createTag(engineer) {
    this.tagService.addTag({name: this.newTagName}).subscribe(response => {
      this.getTags();
      this.linkTagToEngineer(response, engineer, true);
      this.updateTableView();
      this.newTagName = '';
    })
  }

  createRole(engineer) {
    this.roleService.addRole({name: this.newRoleName}).subscribe(response => {
      this.getRoles();
      this.linkRoleToEngineer(response, engineer);
      this.updateTableView();
      this.newRoleName = '';
    })
  }

  manageTeamSelection($event, engineer) {
    if (engineer.teams.length === 0) {
      this.selectTeam($event, engineer);
    }
  }
}
