import {Component, Inject, OnInit} from '@angular/core';
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
  identities = [];

  constructor(public dialogRef: MatDialogRef<EngineerDetailsPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private engineerService: EngineerService,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.selectedEngineer = this.data.engineer;
    this.projectService.getById(this.data.project.id).subscribe(response => {
      this.project = response;
      this.identities = this.project.identities;
    });
    const email = this.selectedEngineer.email;
    this.selectedEngineer.identities = this.selectedEngineer.identities.filter(identity => identity.email !== email);
    this.dataSource = new MatTableDataSource<Identity>(this.selectedEngineer.identities);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  save() {
    this.engineerService.edit(this.selectedEngineer).subscribe(() => {
      this.projectService.editProject(this.project.id, this.identities).subscribe();
      this.dialogRef.close({projectIdentities: this.identities})
    });
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
    this.dataSource.data = this.selectedEngineer.identities;
  }

}
