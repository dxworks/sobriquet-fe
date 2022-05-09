import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { Engineer } from '../../data/engineer';
import { Project } from '../../data/project';
import { Identity } from '../../data/identity';
import { Team } from '../../data/team';
import { TeamsService } from '../../services/teams.service';
import { ProjectService } from '../../services/project.service';
import { TagService } from '../../services/tag.service';
import { Tag } from '../../data/tag';
import { RoleService } from '../../services/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../data/role';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NewEngineerPopupComponent } from '../new-engineer-popup/new-engineer-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { EngineerDetailsPopupComponent } from '../engineer-details-popup/engineer-details-popup.component';
import { MergeInformationPopupComponent } from '../merge-information-popup/merge-information-popup.component';
import { MergeSuggestionService } from '../../tools-services/merge-suggestion.service';
import { Characters } from '../../resources/characters';

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
  identitiesChanged = new EventEmitter();
  @Output()
  engineerChanged = new EventEmitter();
  @Output()
  manualMerge = new EventEmitter();

  teams: Team[] = [];
  filteredTeams: Team[] = [];
  filteredTags: Tag[] = [];
  filteredRoles: Role[] = [];
  newTeamName: string = '';
  newTagName: string = '';
  newRoleName: string = '';
  tags: Tag[] = [];
  tag: Tag;
  roles: Role[] = [];
  engineerCity: string[] = [];
  engineerCountry: string[] = [];
  engineerPosition: string[] = [];
  selectedEngineer: Engineer;
  team: Team;
  role: Role;
  statuses = ['In Project', 'Leaving', 'Left'];
  status: string;
  showIgnored = false;
  showAll = true;
  characters = Characters;
  selectedEngineers: Engineer[] = [];
  loading: boolean;
  frozenCols = [{field: 'name', header: 'Name'}];

  constructor(private teamService: TeamsService,
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
    this.getTeams();
    this.getTags();
    this.getRoles();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.engineer?.firstChange && !changes.engineers?.firstChange && this.project && this.engineer) {
      this.getEngineers();
    }
    if (this.project || (changes.engineers && this.project)) {
      this.showEngineers();
    }
  }

  initializeData() {
    this.engineerCity = [];
    this.getEngineers();
  }

  getEngineers() {
    this.engineers.forEach(engineer => this.getEngineerDetails(engineer));
  }

  getEngineerDetails(engineer: Engineer) {
    engineer?.city ? this.engineerCity.push(engineer.city) : this.engineerCity.push('');
    engineer?.country ? this.engineerCountry.push(engineer.country) : this.engineerCountry.push('');
    engineer?.senority ? this.engineerPosition.push(engineer.senority) : this.engineerPosition.push('');
  }

  getTeams() {
    this.teamService.getAllTeams().subscribe(response => this.filteredTeams = this.teams = response);
  }

  getTags() {
    this.tagService.getAllTags().subscribe(response => this.filteredTags = this.tags = response.filter((v, i, a) => v.name && a.findIndex(t => ['name'].every(k => t[k] === v[k])) === i));
  }

  getRoles() {
    this.roleService.getAllRoles().subscribe(response => this.filteredRoles = this.roles = response.filter((v, i, a) => a.findIndex(t => ['name'].every(k => t[k] === v[k])) === i));
  }

  getTeamName(teamId: string) {
    return this.teams.find(team => team.id === teamId)?.name;
  }

  selectTeam($event, engineer: Engineer) {
    $event?.id ? this.linkTeamToEngineer($event.id, engineer) : this.createTeam(engineer);
  }

  selectTag($event, engineer: Engineer) {
    $event?.name ? this.linkTagToEngineer($event, engineer) : this.createTag(engineer);
  }

  selectRole($event, engineer: Engineer) {
    $event?.name ? this.linkRoleToEngineer($event, engineer) : this.createRole(engineer);
  }

  selectReportsTo($event, engineer: Engineer) {
    this.project.engineers.find(eng => eng === engineer).reportsTo = $event.id;
    this.projectService.editProject(this.project.id, this.project).subscribe(() => this.engineerChanged.emit());
  }

  selectStatus($event, engineer: Engineer) {
    this.project.engineers.find(eng => eng === engineer).status = $event;
    this.projectService.editProject(this.project.id, this.project).subscribe(() => this.engineerChanged.emit());
  }

  linkTeamToEngineer(teamId: string, engineer: Engineer) {
    this.project.engineers.find(eng => eng === engineer).teams.push(teamId);
    if (this.project.engineers.find(eng => eng === engineer).teams.find(team => team.description)) {
      this.project.engineers.find(eng => eng === engineer).teams.splice(this.project.engineers.find(eng => eng === engineer).teams.indexOf(this.project.engineers.find(eng => eng === engineer).teams.find(team => team.description)), 1);
    }
    this.projectService.editProject(this.project.id, this.project).subscribe(() => this.engineerChanged.emit());
  }

  linkTagToEngineer(tag: Tag, engineer: Engineer) {
    this.project.engineers.find(eng => eng === engineer).tags.push(tag);
    this.projectService.editProject(this.project.id, this.project).subscribe(() => this.engineerChanged.emit());
  }

  linkRoleToEngineer($event, engineer: Engineer) {
    this.project.engineers.find(eng => eng === engineer).role = $event.name;
    this.projectService.editProject(this.project.id, this.project).subscribe(() => this.engineerChanged.emit());
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
      this.linkTeamToEngineer(data.id, engineer);
      this.getEngineers();
      this.newTeamName = '';
    });
  }

  createTag(engineer: Engineer) {
    this.tagService.addTag({name: this.newTagName}).subscribe(response => {
      this.getTags();
      this.linkTagToEngineer(response, engineer);
      this.getEngineers();
      this.newTagName = '';
    })
  }

  createRole(engineer: Engineer) {
    this.roleService.addRole({name: this.newRoleName}).subscribe(response => {
      this.getRoles();
      this.linkRoleToEngineer(response, engineer);
      this.getEngineers();
      this.newRoleName = '';
    })
  }

  manageTeamSelection($event, engineer: Engineer) {
    if (engineer.teams.length === 0) {
      this.selectTeam($event, engineer);
    }
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

  getReportsTo(reportsTo: string) {
    return this.project.engineers.find(eng => eng.id === reportsTo)?.name;
  }

  ignore() {
    this.selectedEngineers.forEach(selectedEngineer => {
      this.project.engineers.find(eng => eng === selectedEngineer).ignorable = !this.showIgnored;
      this.projectService.editProject(this.project.id, this.project).subscribe(() => this.engineerChanged.emit());
    });
  }

  showEngineers() {
    this.engineers = this.project.engineers;
    this.initializeData();
  }

  showEngineersByIgnorableProperty() {
    this.engineers = this.engineers.filter(engineer => engineer.ignorable === this.showIgnored);
    this.showAll = false;
  }

  mergeEngineers() {
    const dialogRef = this.dialog.open(MergeInformationPopupComponent, {
      data: {
        selected: this.selectedEngineers,
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
    this.selectedEngineers.forEach(eng => {
      const selectedEngineer = this.project.engineers.find(engineer => engineer.id === eng.id);
      let index = Math.floor(Math.random() * this.characters.length);
      selectedEngineer.name = this.characters[index];
      this.characters[index].split(' ').length > 1
        ? selectedEngineer.username = this.characters[index].split(' ')[0].toLowerCase() + '.' + this.characters[index].split(' ')[0].toLowerCase()
        : selectedEngineer.username = this.characters[index].split(' ')[0].toLowerCase();
      selectedEngineer.email = selectedEngineer.username + '@gmail.com';
      this.projectService.editProject(this.project.id, this.project).subscribe(() => this.engineerChanged);
    });
  }

  sanitizeNames() {
    this.selectedEngineers.forEach(eng => {
      this.project.engineers.find(engineer => engineer.id === eng.id).name = this.mergeSuggestionService.cleanName(eng.name);
      this.projectService.editProject(this.project.id, this.project).subscribe(() => this.engineerChanged.emit());
    });
  }

  getUniqueTags(engineerTags: Tag[]) {
    return engineerTags?.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.name === value.name
      ))
    )
  }
}
