import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {Engineer} from '../../data/engineer';
import {EngineerService} from '../../services/engineer.service';
import {Project} from '../../data/project';
import {MatTableDataSource} from '@angular/material/table';
import {Identity} from '../../data/identity';
import {Team} from '../../data/team';
import {TeamsService} from '../../services/teams.service';
import {ProjectService} from '../../services/project.service';
import {TagService} from '../../services/tag.service';
import {Tag} from '../../data/tag';
import {RoleService} from '../../services/role.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Role} from '../../data/role';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {NewEngineerPopupComponent} from '../new-engineer-popup/new-engineer-popup.component';
import {MatDialog} from '@angular/material/dialog';
import {EngineerDetailsPopupComponent} from '../engineer-details-popup/engineer-details-popup.component';

@Component({
  selector: 'app-engineers-table',
  templateUrl: './engineers-table.component.html',
  styleUrls: ['./engineers-table.component.css']
})
export class EngineersTableComponent implements OnInit, OnChanges {

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  @Input()
  engineer: Engineer;
  @Input()
  engineers: Engineer[] = [];
  @Input()
  project: Project;
  @Input()
  suggestions: Identity[] = [];
  @Input()
  showAll = false;

  @Output()
  identitiesChanged = new EventEmitter()

  dataSource: MatTableDataSource<Engineer>;
  displayedColumns = ['select', 'firstname', 'email', 'city', 'country', 'position', 'role', 'roleActions', 'tags', 'tagsAction',
    'teams', 'teamsAction', 'reportsTo', 'reportsToAction', 'status', 'statusAction', 'actions'];
  teams: Team[] = [];
  filteredTeams: Team[] = [];
  filteredTags: Tag[] = [];
  filteredRoles: Role[] = [];
  newTeamName: string = '';
  newTagName: string = '';
  newRoleName: string = '';
  projects: Project[] = [];
  tags: Tag[] = [];
  tag: Tag;
  selection = new SelectionModel<Engineer>(true, []);
  roles: Role[] = [];
  engineerCity: string[] = [];
  engineerCountry: string[] = [];
  engineerPosition: string[] = [];
  selectedEngineer: Engineer;
  team: Team;
  role: Role;
  statuses = ['In Project', 'Leaving', 'Left'];
  status: string;

  constructor(private engineerService: EngineerService,
              private teamService: TeamsService,
              private projectService: ProjectService,
              private tagService: TagService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private roleService: RoleService,
              private _liveAnnouncer: LiveAnnouncer,
              public dialog: MatDialog) {
    this.showAll = !this.activatedRoute.snapshot.url.toString().includes('project');
  }

  ngOnInit(): void {
    this.engineerService.getAll().subscribe(response => {
      this.engineers = response.filter(engineer => engineer.project === this.project.id);
      this.initializeData();
    });
    this.getTeams();
    this.getProjects();
    this.getTags();
    this.getRoles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.engineer?.firstChange && !changes.engineers?.firstChange && this.project && this.engineer) {
      this.getEngineers();
    }
  }

  initializeData() {
    this.projectService.getAllProjects().subscribe(response => {
      this.project = response.find(project => project.name === this.activatedRoute.snapshot.url[this.activatedRoute.snapshot.url.length - 1].path);
      this.engineerCity = [];
      this.getEngineers();
    });
  }

  getEngineers() {
    this.engineers.forEach(engineer => {
        this.getEngineerDetails(engineer);
    });
    this.getTableData(this.engineers);
  }

  getEngineerDetails(engineer: Engineer) {
    engineer?.city ? this.engineerCity.push(engineer.city) : this.engineerCity.push('');
    engineer?.country ? this.engineerCountry.push(engineer.country) : this.engineerCountry.push('');
    engineer?.senority ? this.engineerPosition.push(engineer.senority) : this.engineerPosition.push('');
  }

  getTableData(engineers: Engineer[]) {
    this.dataSource = new MatTableDataSource(engineers);
  }

  applyFilter($event, property) {
    if (property.endsWith('s') && property !== 'status') {
      this.dataSource = new MatTableDataSource(this.engineers.concat(this.engineers.filter(engineer => engineer.project === this.project.id)).filter(engineer => engineer[property].find(prop => prop.name === $event.name || prop === $event.id)));
    } else if (property === 'status') {
      this.dataSource = new MatTableDataSource(this.engineers.concat(this.engineers.filter(engineer => engineer.project === this.project.id)).filter(engineer => engineer[property] === $event));
    } else {
      this.dataSource = new MatTableDataSource(this.engineers.concat(this.engineers.filter(engineer => engineer.project === this.project.id)).filter(engineer => engineer[property] === $event.name));
    }
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

  getProjects() {
    this.projectService.getAllProjects().subscribe(response => this.projects = response);
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

  selectReportsTo($event, engineer: Engineer) {
    engineer.reportsTo = $event.id;
    this.engineerService.edit(engineer).subscribe(() => {
      this.getEngineers();
    })
  }

  selectStatus($event, engineer: Engineer) {
    engineer.status = $event;
    this.engineerService.edit(engineer).subscribe(() => {
      this.getEngineers();
    });
  }

  linkTeamToEngineer(teamId, engineerId) {
    this.engineerService.linkTeam(engineerId, teamId).subscribe(() => this.getEngineers());
  }

  linkTagToEngineer(tag, engineer, onCreate?) {
    if (onCreate) {
      engineer.tags.push(tag);
    }
    this.engineerService.edit(engineer).subscribe(() => this.getEngineers());
  }

  linkRoleToEngineer($event, engineer) {
    engineer.role = $event.name;
    this.engineerService.edit(engineer).subscribe(() => {
      this.getEngineers();
    });
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

  createTeam(engineer: Engineer) {
    this.teamService.addTeam({name: this.newTeamName, description: ''}).subscribe(response => {
      let data: any = response;
      this.getTeams();
      this.linkTeamToEngineer(data.id, engineer.id);
      this.getEngineers();
      this.newTeamName = '';
    });
  }

  createTag(engineer) {
    this.tagService.addTag({name: this.newTagName}).subscribe(response => {
      this.getTags();
      this.linkTagToEngineer(response, engineer, true);
      this.getEngineers();
      this.newTagName = '';
    })
  }

  createRole(engineer) {
    this.roleService.addRole({name: this.newRoleName}).subscribe(response => {
      this.getRoles();
      this.linkRoleToEngineer(response, engineer);
      this.getEngineers();
      this.newRoleName = '';
    })
  }

  manageTeamSelection($event, engineer) {
    if (engineer.teams.length === 0) {
      this.selectTeam($event, engineer);
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'firstname':
          return this.compare(a.name, b.name, isAsc);
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'city':
          return this.compare(a.city, b.city, isAsc);
        case 'country':
          return this.compare(a.country, b.country, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewEngineerPopupComponent, {data: {project: this.project}});

    dialogRef.afterClosed().subscribe(() => this.initializeData());
  }

  openInfoDialog() {
    const dialogRef = this.dialog.open(EngineerDetailsPopupComponent, {
      data: {
        engineer: this.selectedEngineer,
        project: this.project
      }
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.identitiesChanged.emit(response.projectIdentities);
      }
    });
  }

  getReportsTo(reportsTo) {
    return this.engineers.find(eng => eng.id === reportsTo)?.name;
  }
}
