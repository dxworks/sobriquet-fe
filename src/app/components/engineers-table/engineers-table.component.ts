import {Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {Engineer} from "../../data/engineer";
import {EngineerService} from "../../services/engineer.service";
import {Project} from "../../data/project";
import {MatTableDataSource} from "@angular/material/table";
import {Identity} from "../../data/identity";

@Component({
  selector: 'app-engineers-table',
  templateUrl: './engineers-table.component.html',
  styleUrls: ['./engineers-table.component.css']
})
export class EngineersTableComponent implements OnInit, OnChanges {

  @Input()
  engineer: Engineer;
  @Input()
  engineers: Engineer[] = [];
  @Input()
  project: Project;
  @Input()
  suggestions: Identity[] = [];

  @Output()
  suggestionDenied = new EventEmitter();
  @Output()
  suggestionAccepted = new EventEmitter();

  dataSource: MatTableDataSource<Engineer>;

  displayedColumns = ['firstname', 'lastname', 'email', 'position', 'phone', 'city', 'country'];

  valueSaved: Engineer[] = [];

  allEngineers: Engineer[] = []

  constructor(private engineerService: EngineerService) {
  }

  ngOnInit(): void {
    if (this.project) {
      this.engineerService.getAll().subscribe(engineers => {
        this.allEngineers = engineers;
        engineers.forEach(engineer => {
          if (engineer.projects.some(prname => prname === this.project?.name)) {
            this.engineers.push(engineer);
            this.getTableData();
          }
        })
      });
      this.displayedColumns.push('actions');
    } else {
      this.getTableData();
      this.valueSaved = this.engineers;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.engineer?.firstChange && this.project) {
      this.engineers.push(this.engineer);
      this.getTableData()
    }
  }

  getTableData() {
    this.dataSource = new MatTableDataSource(this.engineers);
  }

  acceptSuggestion(engineer: Engineer) {
    this.engineerService.add(engineer).subscribe(() => this.suggestionAccepted.emit(this.suggestions));
    this.suggestionAccepted.emit(this.suggestions);
  }

  denySuggestion(engineer: Engineer) {
    this.engineers.splice(this.engineers.indexOf(engineer), 1);
    this.getTableData();
    this.suggestionDenied.emit(this.suggestions);
  }
}
