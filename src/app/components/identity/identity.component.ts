import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Identity} from "../../data/identity";

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.css']
})
export class IdentityComponent implements OnInit {

  @Input()
  identities: Identity[] = [];
  @Output()
  identityDeleted = new EventEmitter()

  constructor() {
  }

  ngOnInit(): void {
  }

}
