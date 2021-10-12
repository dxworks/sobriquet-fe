import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Engineer} from "../../data/engineer";
import {EngineerService} from "../../services/engineer.service";
import {Project} from "../../data/project";
import {ActivatedRoute} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-engineers-table',
  templateUrl: './engineers-table.component.html',
  styleUrls: ['./engineers-table.component.css']
})
export class EngineersTableComponent implements OnInit, OnChanges {

  @Input()
  engineer: Engineer;

  project: Project;

  engineers: Engineer[] = [];

  dataSource: MatTableDataSource<Engineer>;

  displayedColumns = ['firstname', 'lastname', 'email', 'position', 'phone', 'city', 'country', 'actions'];

  constructor(private engineerService: EngineerService,
              private activatedRoute: ActivatedRoute) {
    this.project = JSON.parse(this.activatedRoute.snapshot.queryParams.project);
  }

  ngOnInit(): void {
    this.engineerService.getAll().subscribe(engineers => {
      engineers.forEach(engineer => {
        if (engineer.projects.some(prname => prname === this.project.name)) {
          this.engineers.push(engineer);
          this.getTableData();
        }
      })
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.engineer.firstChange) {
      this.engineers.push(this.engineer);
      this.getTableData()
    }
  }

  getTableData(){
    this.dataSource = new MatTableDataSource(this.engineers);
  }

  save(engineer: Engineer){
    this.engineerService.edit(engineer).subscribe();
  }

}
