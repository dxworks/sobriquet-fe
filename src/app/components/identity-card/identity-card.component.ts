import {Component, Input, OnInit} from '@angular/core';
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

  constructor(private identityService: IdentityService) {}

  ngOnInit(): void {}

  deleteIdentity(){
    console.log(this.identity);
    this.identityService.deleteIdentity(this.identity.id).subscribe();
  }

}
