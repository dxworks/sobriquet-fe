import {Component, Inject, Input, OnInit} from '@angular/core';
import {Engineer} from "../../../data/engineer";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EngineerService} from "../../../services/engineer.service";
import {Team} from "../../../data/team";
import {TeamsService} from "../../../services/teams.service";
import {FormControl} from "@angular/forms";

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
    city: string;
    country: string;
    firstName: string;
    id: string;
    lastName: string;
    phone: string;
    position: string;
    teams: string[];
  };

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
    this.engineerService.add(this.newEngineer).subscribe(() => this.onCancelClick());
  }

}
