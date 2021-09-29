import {Component, Input, OnInit} from '@angular/core';
import {Identity} from "../../data/identity";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-suggestion-table',
  templateUrl: './suggestion-table.component.html',
  styleUrls: ['./suggestion-table.component.css']
})
export class SuggestionTableComponent implements OnInit {

  @Input()
  identities: Identity[] = [];

  dataSource: MatTableDataSource<Identity>;

  displayedColumns = ['firstname', 'lastname', 'username', 'email', 'actions'];

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.identities);
  }

  handleInput($event) {
    return this.applyFilter($event.target.value);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    this.dataSource.filter = filterValue;
  }

}
