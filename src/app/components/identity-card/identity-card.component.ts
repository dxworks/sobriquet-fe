import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {IdentityService} from "../../services/identity.service";
import {Identity} from "../../data/identity";
import {LinkerService} from "../../services/ToolsService/linker.service";
import {Engineer} from "../../data/engineer";
import {EngineerService} from "../../services/engineer.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationPopupComponent} from "../popups/confirmation-popup/confirmation-popup.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-identity-card',
  templateUrl: './identity-card.component.html',
  styleUrls: ['./identity-card.component.css']
})
export class IdentityCardComponent implements OnInit {

  @Input()
  identity: Identity;
  @Output()
  identityDeleted = new EventEmitter();

  engineers: Engineer[] = [];

  progressValue: number;

  linked = false;

  constructor(public dialog: MatDialog,
              private identityService: IdentityService,
              private linkerService: LinkerService,
              private engineerService: EngineerService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.engineerService.getAll().subscribe(response => this.engineers = response);
    this.setProgressNumber();
  }

  setProgressNumber() {
    if (!this.identity.firstName && !this.identity.lastName) {
      this.progressValue = 35;
      this.linked = false;
    } else {
      this.progressValue = 100;
      this.linked = true;
    }
  }

  deleteIdentity() {
    this.identityService.deleteIdentity(this.identity.id).subscribe(() => this.identityDeleted.emit());
  }

  linkIdentity() {
    let engineer = this.linkerService.linkIdentity(this.engineers, this.identity);
    if (engineer) {
      this.progressValue = 85;
      this.openConfirmationDialog(engineer);
    } else {
      this.openSnackBar('Looks like this identity cannot be linked to any engineer', 'OK');
    }
  }

  openConfirmationDialog(engineer: Engineer) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: engineer
    };
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.completeIdentityData(result);
        this.progressValue = 100;
        this.linked = true;
      }
    });
  }

  completeIdentityData(engineer: Engineer) {
    this.identity.firstName = engineer.firstName;
    this.identity.lastName = engineer.lastName;
    this.identity.email = engineer.email;
    this.identityService.updateIdentity(this.identity).subscribe();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
