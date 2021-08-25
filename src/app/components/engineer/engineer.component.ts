import {Component, Input, OnInit} from '@angular/core';
import {Engineer} from "../../data/engineer";

@Component({
  selector: 'app-engineer',
  templateUrl: './engineer.component.html',
  styleUrls: ['./engineer.component.css']
})
export class EngineerComponent implements OnInit {

  @Input()
  engineers: Engineer[] = [];
  constructor() { }

  ngOnInit(): void {}

}
