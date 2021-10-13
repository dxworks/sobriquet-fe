import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Identity} from "../../data/identity";
import {MatTableDataSource} from "@angular/material/table";
import {MergeSuggestionService} from "../../services/ToolsService/merge-suggestion.service";
import {Engineer} from "../../data/engineer";
import {Project} from "../../data/project";
import {EngineerService} from "../../services/engineer.service";
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-suggestion-table',
  templateUrl: './suggestion-table.component.html',
  styleUrls: ['./suggestion-table.component.css']
})
export class SuggestionTableComponent implements OnInit {

  @Input()
  identities: Identity[] = [];

  @Output()
  engineerEmitter = new EventEmitter();

  dataSource: MatTableDataSource<Identity>;

  displayedColumns = ['firstname', 'lastname', 'username', 'email', 'actions'];

  suggestions: Identity[] = [];

  project: Project;

  projects: Project[] = [];

  constructor(private mergeSuggestionService: MergeSuggestionService,
              private engineersService: EngineerService,
              private activatedRoute: ActivatedRoute,
              private projectService: ProjectService) {

    this.project = JSON.parse(this.activatedRoute.snapshot.queryParams.project);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.identities);
    this.projectService.getAllProjects().subscribe(response => this.projects = response);
    this.getSuggestions();
  }

  getSuggestions() {
   this.suggestions = this.mergeSuggestionService.getMergeSuggestions(this.identities);
  }

  handleInput($event) {
    return this.applyFilter($event.target.value);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    this.dataSource.filter = filterValue;
  }

  checkIdentity(identity: Identity){
      return !!this.suggestions.find(suggestion => suggestion === identity);

  }

  merge() {
    const data: Engineer = this.buildEngineer();
    this.engineersService.add(data).subscribe(() => {
      this.engineerEmitter.emit(data);
      this.updateTable();
      this.getSuggestions();
    });
  }

  buildEngineer() {
    return {
      firstName: this.suggestions[0].firstName,
      lastName: this.suggestions[0].lastName,
      email: this.suggestions[0].email,
      position: '',
      teams: [],
      phone: '',
      city: '',
      country: '',
      affiliations: [],
      projects: [this.project.name]
    }
  }

  updateTable() {
    this.suggestions.forEach(suggestion => {
      this.identities.splice(this.identities.indexOf(suggestion), 1);
    });
    this.dataSource = new MatTableDataSource<Identity>(this.identities);
  }

}
