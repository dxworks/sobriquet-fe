import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {IdentityService} from "../../services/identity.service";
import {Identity} from "../../data/identity";
import {LinkerService} from "../../services/ToolsService/linker.service";
import {Engineer} from "../../data/engineer";
import {EngineerService} from "../../services/engineer.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationPopupComponent} from "../popups/confirmation-popup/confirmation-popup.component";

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

  constructor(public dialog: MatDialog,
              private identityService: IdentityService,
              private linkerService: LinkerService,
              private engineerService: EngineerService) {
  }

  ngOnInit(): void {
    this.engineerService.getAll().subscribe(response => this.engineers = response);
    this.setProgressNumber();
  }

  setProgressNumber() {
    if (!this.identity.firstName && !this.identity.lastName) {
      this.progressValue = 35;
    } else {
      this.progressValue = 100;
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
      }
    });
  }

  completeIdentityData(engineer: Engineer) {
    this.identity.firstName = engineer.firstName;
    this.identity.lastName = engineer.lastName;
    this.identity.email = engineer.email;
    this.identityService.updateIdentity(this.identity).subscribe();
  }

}
