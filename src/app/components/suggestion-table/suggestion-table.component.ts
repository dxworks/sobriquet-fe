import {Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
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
export class SuggestionTableComponent implements OnInit, OnChanges {

  @Input()
  identities: Identity[] = [];
  @Input()
  acceptedSuggestions: Identity[] = [];
  @Input()
  deniedSuggestions: Identity[] = [];
  @Input()
  project: Project;

  @Output()
  engineerEmitter = new EventEmitter();
  @Output()
  suggestionsEmitter = new EventEmitter();

  dataSource: MatTableDataSource<Identity>;

  displayedColumns = ['firstname', 'lastname', 'username', 'email', 'actions'];

  suggestions: Identity[] = [];

  projects: Project[] = [];

  constructor(private mergeSuggestionService: MergeSuggestionService,
              private engineersService: EngineerService,
              private activatedRoute: ActivatedRoute,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.identities);
    this.projectService.getAllProjects().subscribe(response => this.projects = response);
    this.getSuggestions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.acceptedSuggestions?.firstChange && !changes.deniedSuggestions) {
      this.updateProjectIdentities();
    }
    if (changes.project) {
      this.identities = this.project.identities;
    }
    if (!changes.deniedSuggestions?.firstChange && !changes.acceptedSuggestions) {
      this.addBackIdentities()
    }
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

  checkIdentity(identity: Identity) {
    return !!this.suggestions.find(suggestion => suggestion === identity);

  }

  merge() {
    const data: Engineer = this.buildEngineer();
    this.engineerEmitter.emit(data);
    this.suggestionsEmitter.emit(this.suggestions);
    this.updateTable();
    this.getSuggestions();
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

  updateProjectIdentities() {
    this.acceptedSuggestions.forEach(suggestion => {
      this.project.identities = this.project.identities.filter(identity => identity.username !== suggestion.username);
    });
    this.projectService.editProject(this.project.name, this.project.identities).subscribe();
  }

  addBackIdentities(){
    this.deniedSuggestions.forEach(deniedIdentity => this.identities.push(deniedIdentity));
    this.dataSource = new MatTableDataSource<Identity>(this.identities);
  }

}
