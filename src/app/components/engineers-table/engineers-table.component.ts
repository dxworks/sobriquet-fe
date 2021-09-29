import {Component, Input, OnInit} from '@angular/core';
import {Engineer} from "../../data/engineer";

@Component({
  selector: 'app-engineers-table',
  templateUrl: './engineers-table.component.html',
  styleUrls: ['./engineers-table.component.css']
})
export class EngineersTableComponent implements OnInit {

  @Input()
  engineers: Engineer[] = [];

  displayedColumns = ['firstname', 'lastname', 'email', 'position'];

  constructor() { }

  ngOnInit(): void {
  }

}
