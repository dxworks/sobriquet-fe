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
import {MergeInformationPopupComponent} from '../merge-information-popup/merge-information-popup.component';
import {MergeSuggestionService} from '../../services/ToolsService/merge-suggestion.service';
import {Characters} from '../../resources/characters';

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

  @Output()
  identitiesChanged = new EventEmitter();
  @Output()
  engineerChanged = new EventEmitter();
  @Output()
  manualMerge = new EventEmitter();

  dataSource: MatTableDataSource<Engineer>;
  displayedColumns = ['select', 'firstname', 'email', 'username', 'city', 'country', 'position', 'role', 'roleActions', 'tags', 'tagsAction',
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
  searchValue: string;
  showIgnored = false;
  showAll = true;
  characters = Characters;

  constructor(private engineerService: EngineerService,
              private teamService: TeamsService,
              private projectService: ProjectService,
              private tagService: TagService,
              private router: Router,
              private mergeSuggestionService: MergeSuggestionService,
              private activatedRoute: ActivatedRoute,
              private roleService: RoleService,
              private _liveAnnouncer: LiveAnnouncer,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.showEngineers();
    this.getTeams();
    this.getProjects();
    this.getTags();
    this.getRoles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.engineer?.firstChange && !changes.engineers?.firstChange && this.project && this.engineer) {
      this.getEngineers();
    }

    if (changes.engineers) {
      this.showEngineers();
    }
  }

  initializeData() {
    this.projectService.getAllProjects().subscribe(response => {
      this.project = response.find(project => project.name === this.activatedRoute.snapshot.url[1].path);
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
    if ($event.length === 0) {
      this.dataSource = new MatTableDataSource<Engineer>(this.engineers);
    } else {
      if (property.endsWith('s') && property !== 'status') {
        this.dataSource = new MatTableDataSource(this.engineers.filter(engineer => engineer[property].find(prop => $event.includes(prop.name) || $event.includes(prop))));
      } else {
        this.dataSource = new MatTableDataSource(this.engineers.filter(engineer => $event.includes(engineer[property])));
      }
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
    this.engineerChanged.emit();
    this.engineerService.edit(engineer).subscribe(() => {
      this.getEngineers();
    })
  }

  selectStatus($event, engineer: Engineer) {
    engineer.status = $event;
    this.engineerChanged.emit();
    this.engineerService.edit(engineer).subscribe(() => {
      this.getEngineers();
    });
  }

  linkTeamToEngineer(teamId, engineerId) {
    this.engineerChanged.emit();
    this.engineerService.linkTeam(engineerId, teamId).subscribe(() => this.getEngineers());
  }

  linkTagToEngineer(tag, engineer, onCreate?) {
    if (onCreate && !engineer.tags.includes(tag)) {
      engineer.tags.push(tag);
      this.engineerChanged.emit();
      this.engineerService.edit(engineer).subscribe(() => this.getEngineers());
    }
  }

  linkRoleToEngineer($event, engineer) {
    engineer.role = $event.name;
    this.engineerChanged.emit();
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
    this.teams.push({name: this.newTeamName, description: ''});
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

    dialogRef.afterClosed().subscribe(() => this.showEngineers());
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

  search() {
    this.dataSource = new MatTableDataSource(this.engineers
      .filter(engineer => engineer.username.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        engineer.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        engineer.email.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        engineer.city.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        engineer.status.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        engineer.senority.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        engineer.country.toLowerCase().includes(this.searchValue.toLowerCase())));
  }

  ignore() {
    this.selection.selected.forEach(selectedEngineer => {
      selectedEngineer.ignorable = !this.showIgnored;
      this.engineerService.edit(selectedEngineer).subscribe(() => {
        this.selection.deselect(selectedEngineer);
        this.showEngineers();
      });
    });
  }

  showEngineers() {
    this.engineerService.getAll().subscribe(response => {
      this.engineers = response.filter(engineer => engineer.project === this.project?.id);
      this.initializeData();
    });
  }

  showEngineersByIgnorableProperty() {
    this.engineerService.getAll().subscribe(response => {
      this.engineers = response.filter(engineer => engineer.project === this.project.id && engineer.ignorable === this.showIgnored);
      this.initializeData();
      this.showAll = false;
    });
  }

  mergeEngineers() {
    const dialogRef = this.dialog.open(MergeInformationPopupComponent, {
      data: {
        selected: this.selection.selected,
        project: this.project,
        delete: true
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      this.showEngineers();
      if (!response) {
        this.manualMerge.emit();
      }
    });
  }

  anonymize() {
    this.selection.selected.forEach(eng => {
      let index = Math.floor(Math.random() * this.characters.length);
      eng.name = this.characters[index];
      this.characters[index].split(' ').length > 1
        ? eng.username = this.characters[index].split(' ')[0].toLowerCase() + '.' + this.characters[index].split(' ')[0].toLowerCase()
        : eng.username = this.characters[index].split(' ')[0].toLowerCase();
      eng.email = eng.username + '@gmail.com';
      this.engineerService.edit(eng).subscribe(() => this.showEngineers());
    });
  }

  sanitizeNames() {
    this.selection.selected.forEach(eng => {
      eng.name = this.mergeSuggestionService.cleanName(eng.name);
      this.engineerService.edit(eng).subscribe(() => this.showEngineers());
    });
  }
}
