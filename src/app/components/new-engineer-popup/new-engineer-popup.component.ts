import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Team } from '../../data/team';
import { Engineer } from '../../data/engineer';
import { EngineerService } from '../../services/engineer.service';
import { TeamsService } from '../../services/teams.service';
import { Tag } from '../../data/tag';
import { Role } from '../../data/role';
import { TagService } from '../../services/tag.service';
import { RoleService } from '../../services/role.service';
import { Project } from '../../data/project';
import { ProjectService } from '../../services/project.service';
import { Characters } from '../../resources/characters';

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
  statuses = ['In Project', 'Leaving', 'Left'];
  engineers: Engineer[] = [];
  project: Project;
  characters = Characters;
  name: string;
  newEngineer: Engineer = new Engineer();

  constructor(public dialogRef: MatDialogRef<NewEngineerPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private engineerService: EngineerService,
              private projectService: ProjectService,
              private teamsService: TeamsService,
              private tagService: TagService,
              private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.project = this.data.project;
    this.manageTeams();
    this.manageTags();
    this.manageRoles();
    this.manageEngineers();
  }

  manageTeams() {
    this.teamsService.getAllTeams().subscribe(response => this.teams = response);
    this.newEngineer.teams = [];
  }

  manageTags() {
    this.tagService.getAllTags().subscribe(response => this.tags = response);
    this.newEngineer.tags = [];
  }

  manageRoles() {
    this.roleService.getAllRoles().subscribe(response => this.roles = response);
  }

  manageEngineers() {
    this.engineers = this.project.engineers
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  addEngineer() {
    this.newEngineer.project = this.project.id;
    this.newEngineer.identities = [];
    this.project.engineers.push(this.newEngineer);
    this.projectService.editProject(this.project.id, this.project).subscribe(() => this.onCancelClick());
  }

  anonymize() {
    this.newEngineer = this.engineerService.anonymize(this.newEngineer, this.name);
  }
}
