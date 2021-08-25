import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Engineer} from "../../data/engineer";

@Component({
  selector: 'app-engineer',
  templateUrl: './engineer.component.html',
  styleUrls: ['./engineer.component.css']
})
export class EngineerComponent implements OnInit {

  @Input()
  engineers: Engineer[] = [];
  @Output()
  engineerDeletedEventEmitter = new EventEmitter();
  @Output()
  teamLinkedEventEmitter = new EventEmitter();
  constructor() { }

  ngOnInit(): void {}

}
