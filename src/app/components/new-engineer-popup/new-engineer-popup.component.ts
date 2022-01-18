import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Team} from '../../data/team';
import {FormControl} from '@angular/forms';
import {Engineer} from '../../data/engineer';
import {EngineerService} from '../../services/engineer.service';
import {TeamsService} from '../../services/teams.service';
import {Affiliation} from '../../data/affiliation';
import {Identity} from '../../data/identity';
import {Tag} from '../../data/tag';
import {Role} from '../../data/role';
import {TagService} from '../../services/tag.service';
import {RoleService} from '../../services/role.service';
import {Project} from '../../data/project';

@Component({
  selector: 'app-new-engineer-popup',
  templateUrl: './new-engineer-popup.component.html',
  styleUrls: ['./new-engineer-popup.component.css']
})
export class NewEngineerPopupComponent implements OnInit {

  @Input()
  visible = false;

  teams: Team[] = [];
  tags: Tag[] = [];
  roles: Role[] = [];
  teamsFormControl = new FormControl();
  tagFormControl = new FormControl();
  rolesFormControl = new FormControl();
  project: Project;

  newEngineer: Engineer = new class implements Engineer {
    affiliations: Affiliation[];
    city: string;
    country: string;
    email: string;
    firstName: string;
    id: string;
    identities: Identity[];
    lastName: string;
    position: string;
    project: string;
    role: string;
    tags: Tag[];
    teams: string[];
  }();

  constructor(public dialogRef: MatDialogRef<NewEngineerPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private engineerService: EngineerService,
              private teamsService: TeamsService,
              private tagService: TagService,
              private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.project = this.data.project;
    this.teamsService.getAllTeams().subscribe(response => this.teams = response);
    this.newEngineer.teams = [];
    this.teamsFormControl.valueChanges.subscribe(response => response.forEach(element => {
      if (!this.newEngineer?.teams.includes(element.id)) {
        this.newEngineer?.teams.push(element.id);
      }
    }));

    this.tagService.getAllTags().subscribe(response => this.tags = response);
    this.tagFormControl.valueChanges.subscribe(response => response.forEach(element => {
      !this.newEngineer.tags ? this.newEngineer.tags = [element] : this.newEngineer.tags.push(element);
    }));
    this.roleService.getAllRoles().subscribe(response => this.roles = response);
    this.rolesFormControl.valueChanges.subscribe(response => response.forEach(element => {
      this.newEngineer.role = element.name
    }));
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  addEngineer() {
    this.newEngineer.affiliations = [];
    this.newEngineer.project = this.project.id;
    this.newEngineer.identities = [];
    this.engineerService.add(this.newEngineer).subscribe(() => this.onCancelClick());
  }


}
