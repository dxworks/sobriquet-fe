import { Component, OnInit } from '@angular/core';
import {Identity} from "../../data/identity";
import {IdentityService} from "../../services/identity.service";

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.css']
})
export class IdentityComponent implements OnInit {

  identities: Identity[] = [];

  constructor(private identityService: IdentityService) { }

  ngOnInit(): void {
    this.identityService.getAllIdentities().subscribe(response => this.identities = response);
  }

}
