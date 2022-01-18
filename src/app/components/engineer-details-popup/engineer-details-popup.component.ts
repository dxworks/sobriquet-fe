import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Engineer} from '../../data/engineer';
import {Identity} from '../../data/identity';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {EngineerService} from '../../services/engineer.service';
import {Project} from '../../data/project';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-engineer-details-popup',
  templateUrl: './engineer-details-popup.component.html',
  styleUrls: ['./engineer-details-popup.component.css']
})
export class EngineerDetailsPopupComponent implements OnInit {

  selectedEngineer: Engineer;
  dataSource: MatTableDataSource<Identity>
  project: Project;
  selection = new SelectionModel<Identity>(true, []);
  displayedColumns = ['select', 'name', 'email', 'actions'];

  constructor(public dialogRef: MatDialogRef<EngineerDetailsPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private engineerService: EngineerService,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.selectedEngineer = this.data.engineer;
    this.project = this.data.project;
    this.dataSource = new MatTableDataSource<Identity>(this.selectedEngineer.identities);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.engineerService.edit(this.selectedEngineer).subscribe(() => this.dialogRef.close({projectIdentities: this.project.identities}));
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

  useEmail(emailAddress: string) {
    this.selectedEngineer.email = emailAddress;
  }

  rejectIdentity(identity: Identity) {
    this.selectedEngineer.identities.splice(this.selectedEngineer.identities.indexOf(identity), 1);
    this.projectService.getById(this.project.id).subscribe(response => {
      this.project = response;
      this.project.identities.length === 0 ? this.project.identities = [identity] : this.project.identities.push(identity);
      this.projectService.editProject(this.project.id, this.project.identities).subscribe();
    })
    this.dataSource.data = this.selectedEngineer.identities;
  }

}
