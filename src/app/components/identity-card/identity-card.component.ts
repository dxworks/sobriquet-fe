import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {IdentityService} from "../../services/identity.service";
import {Identity} from "../../data/identity";

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

  constructor(private identityService: IdentityService) {}

  ngOnInit(): void {}

  deleteIdentity(){
    this.identityService.deleteIdentity(this.identity.id).subscribe(() => this.identityDeleted.emit());
  }

}
