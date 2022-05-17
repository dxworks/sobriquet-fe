import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Engineer } from '../../data/engineer';
import { Tag } from '../../data/tag';
import { Identity } from '../../data/identity';
import { Team } from '../../data/team';
import { Role } from '../../data/role';
import { FormControl } from '@angular/forms';
import { EngineerService } from '../../services/engineer.service';
import { ProjectService } from '../../services/project.service';
import { TeamsService } from '../../services/teams.service';
import { TagService } from '../../services/tag.service';
import { RoleService } from '../../services/role.service';
import { Project } from '../../data/project';
import { MatTableDataSource } from '@angular/material/table';
import { Characters } from '../../resources/characters';

@Component({
  selector: 'app-merge-information-popup',
  templateUrl: './merge-information-popup.component.html',
  styleUrls: ['./merge-information-popup.component.css']
})
export class MergeInformationPopupComponent implements OnInit {

  selectedEngineers: Engineer[] = [];
  teams: Team[] = [];
  tags: Tag[] = [];
  roles: Role[] = [];
  teamsFormControl = new FormControl();
  tagFormControl = new FormControl();
  rolesFormControl = new FormControl();
  engineersFormControl = new FormControl();
  statusFormControl = new FormControl();
  statuses = ['In Project', 'Leaving', 'Left'];
  project: Project;
  engineers: Engineer[] = [];
  dataSource: MatTableDataSource<Engineer>;
  delete: boolean;
  name: string;
  characters = Characters;
  tag: string[] = [];
  mergedEngineer: Engineer = new Engineer();
  displayedColumns = ['name', 'email', 'username', 'city', 'country', 'senority', 'role', 'tags', 'teams', 'reportsTo', 'status'];

  constructor(public dialogRef: MatDialogRef<MergeInformationPopupComponent>,
              private engineerService: EngineerService,
              private projectService: ProjectService,
              private teamsService: TeamsService,
              private tagService: TagService,
              private roleService: RoleService,
              @Inject(MAT_DIALOG_DATA) public data,) {
  }

  ngOnInit(): void {
    this.selectedEngineers = this.data.selected;
    this.project = this.data.project;
    this.delete = this.data.delete;
    this.manageTeams();
    this.manageTags();
    this.manageRoles();
    this.manageEngineers();
    this.manageStatuses();
    this.data.mergedEngineer ? this.mergedEngineer = this.data.mergedEngineer : this.getMergedEngineerDetails();
    this.dataSource = new MatTableDataSource<Engineer>(this.selectedEngineers);
  }

  getMergedEngineerDetails() {
    this.mergedEngineer = {
      ...this.selectedEngineers[0],
      identities: [],
      ignorable: false
    }
  }

  manageTeams() {
    this.teamsService.getAllTeams().subscribe(response => this.teams = response);
    this.mergedEngineer.teams = [];
    this.teamsFormControl.valueChanges.subscribe(response => response.forEach(element => {
      if (!this.mergedEngineer?.teams.includes(element.id)) {
        this.mergedEngineer?.teams.push(element.id);
      }
    }));
  }

  manageTags() {
    this.tagService.getAllTags().subscribe(response => this.tags = response);
    this.tagFormControl.valueChanges.subscribe(response => response.forEach(element => !this.mergedEngineer.tags ? this.mergedEngineer.tags = [element] : this.mergedEngineer.tags.push(element)));
  }

  manageRoles() {
    this.roleService.getAllRoles().subscribe(response => this.roles = response);
    this.rolesFormControl.valueChanges.subscribe(response => response.forEach(element => {
      this.mergedEngineer.role = element.name
    }));
  }

  manageEngineers() {
    this.engineersFormControl.valueChanges.subscribe(response => response.forEach(element => this.mergedEngineer.reportsTo = element.id));
  }

  manageStatuses() {
    this.statusFormControl.valueChanges.subscribe(response => response.forEach(element => {
      this.mergedEngineer.status = element
    }));
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  useProperty(value, property: string) {
    this.mergedEngineer[property] = value;
  }

  getSelectedTeams(value: string[]): Team[] {
    const teams = [];
    value.forEach(val => {
      if (this.teams.find(team => team.id === val)) {
        teams.push(this.teams.find(team => team.id === val));
      }
    });
    return teams;
  }

  getTags(engineerTags: { name: string }[]): string {
    let tags = ''
    engineerTags.forEach(tag => tags += tag.name + ',');
    return tags;
  }

  getTeams(engineerTeams: string[]): string {
    let teams = '';
    engineerTeams.forEach(teamId => {
      if (this.teams.find(team => teamId === team.id)) {
        teams += this.teams.find(team => teamId === team.id)?.name + ',';
      }
    })
    return teams;
  }

  getReportsTo(reportsTo: string): string {
    return this.engineers.find(engineer => engineer.id === reportsTo)?.name;
  }

  save() {
    if (this.delete) {
      this.selectedEngineers.forEach(eng => {
        eng.identities.forEach(identity => this.mergedEngineer.identities.push(identity));
        if (this.mergedEngineer.identities.length === 0) {
          this.mergedEngineer.identities = this.transformSelectedEngToIdentities();
        }
        this.project.engineers.splice(this.project.engineers.indexOf(eng), 1);
        this.projectService.editProject(this.project.id, this.project).subscribe();
      });
      this.project.engineers.push(this.mergedEngineer);
      this.projectService.editProject(this.project.id, this.project).subscribe(() => this.onCancelClick());
    } else {
      this.dialogRef.close(this.mergedEngineer);
    }
  }

  transformSelectedEngToIdentities(): Identity[] {
    const identities: Identity[] = [];
    this.selectedEngineers.forEach(eng => {
      identities.push({
        firstName: eng.name.split(' ')[0],
        lastName: eng.name.split(' ')[1],
        username: eng.username,
        email: eng.email,
        source: '',
        avatar: ''
      });
    })
    this.removeIdentities(identities);
    return identities;
  }

  removeIdentities(identities: Identity[]) {
    identities.forEach(identity => this.project.identities.splice(this.project.identities.indexOf(this.project.identities.find(prId => prId.email === identity.email)), 1));
  }

  compareSimpleProperty(c1: any, c2: any): boolean {
    return c1 === c2 || c1?.name === c2?.name || c1?.name === c2 || c1 === c2?.name;
  }

  anonymize() {
    this.mergedEngineer = this.engineerService.anonymize(this.mergedEngineer, this.name);
  }

  getUniqueTags(engineerTags: Tag[]): Tag[] {
    return engineerTags?.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.name === value.name
      ))
    )
  }
}
