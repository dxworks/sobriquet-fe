import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Team} from '../../data/team';
import {FormControl} from '@angular/forms';
import {Engineer} from '../../data/engineer';
import {EngineerService} from '../../services/engineer.service';
import {TeamsService} from '../../services/teams.service';
import {Affiliation} from '../../data/affiliation';
import {Identity} from '../../data/identity';
import {Tag} from '../../data/tag';

@Component({
  selector: 'app-new-engineer-popup',
  templateUrl: './new-engineer-popup.component.html',
  styleUrls: ['./new-engineer-popup.component.css']
})
export class NewEngineerPopupComponent implements OnInit {

  @Input()
  visible = false;

  teams: Team[] = [];

  teamsFormControl = new FormControl();

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
              @Inject(MAT_DIALOG_DATA) public data: Engineer,
              private engineerService: EngineerService,
              private teamsService: TeamsService) { }

  ngOnInit(): void {
    this.teamsService.getAllTeams().subscribe(response => this.teams = response);
    this.newEngineer.teams = [];
    this.teamsFormControl.valueChanges.subscribe(response => response.forEach(element => {
      if (!this.newEngineer?.teams.includes(element.id)){
        this.newEngineer?.teams.push(element.id);
      }
    }));
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  addEngineer(){
    console.log(this.newEngineer);
    // this.engineerService.add(this.newEngineer).subscribe(() => this.onCancelClick());
  }


}
