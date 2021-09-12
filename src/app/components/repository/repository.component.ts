import {Component, Input, OnInit} from '@angular/core';
import {Repository} from "../../data/repository";

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {

  @Input()
  repositories: Repository[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
