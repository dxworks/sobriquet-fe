import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Engineer} from "../../data/engineer";
import {EngineerService} from "../../services/engineer.service";
import {Project} from "../../data/project";
import {MatTableDataSource} from "@angular/material/table";

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

  dataSource: MatTableDataSource<Engineer>;

  displayedColumns = ['firstname', 'lastname', 'email', 'position', 'phone', 'city', 'country', 'actions'];

  valueSaved: Engineer[] = [];

  constructor(private engineerService: EngineerService) {
  }

  ngOnInit(): void {
    if (this.project) {
      this.engineerService.getAll().subscribe(engineers => {
        engineers.forEach(engineer => {
          if (engineer.projects.some(prname => prname === this.project?.name)) {
            this.engineers.push(engineer);
            this.getTableData();
          }
        })
      });
    } else {
      this.getTableData();
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

  save(engineer: Engineer) {
    this.engineerService.edit(engineer).subscribe(() => this.valueSaved.push(engineer));
  }
}
