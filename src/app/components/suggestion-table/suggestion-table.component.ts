import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {Identity} from "../../data/identity";
import {MatTableDataSource} from "@angular/material/table";
import {MergeSuggestionService} from "../../services/ToolsService/merge-suggestion.service";
import {Engineer} from "../../data/engineer";
import {Project} from "../../data/project";
import {EngineerService} from "../../services/engineer.service";
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "../../services/project.service";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-suggestion-table',
  templateUrl: './suggestion-table.component.html',
  styleUrls: ['./suggestion-table.component.css']
})
export class SuggestionTableComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input()
  identities: Identity[] = [];
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

  pagination: number[];

  constructor(private mergeSuggestionService: MergeSuggestionService,
              private engineersService: EngineerService,
              private activatedRoute: ActivatedRoute,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.sortIdentities();
    this.dataSource = new MatTableDataSource(this.identities);
    this.projectService.getAllProjects().subscribe(response => this.projects = response);
    this.getSuggestions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.project) {
      this.identities = this.project.identities;
    }
  }

  sortIdentities() {
    this.identities.sort((id1, id2) => id1.firstName.localeCompare(id2.firstName));
  }

  getSuggestions() {
    this.suggestions = this.mergeSuggestionService.getMergeSuggestions(this.identities);
    this.pagination = [this.suggestions.length];
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
    this.engineersService.add(data).subscribe(() => {
      this.engineerEmitter.emit(data);
      this.updateProjectIdentities();
      this.updateTable();
      this.getSuggestions();
      this.managePagination();
    });
  }

  rejectMerge() {
    this.updateProjectIdentities();
    this.updateTable();
    this.getSuggestions();
    this.managePagination();
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
  }

  updateProjectIdentities() {
    this.suggestions.forEach(suggestion => {
      this.project.identities = this.project.identities.filter(identity => identity.username !== suggestion.username);
    });
    this.projectService.editProject(this.project.name, this.project.identities).subscribe();
  }

  managePagination() {
    this.dataSource = new MatTableDataSource<Identity>(this.identities);
    this.paginator._displayedPageSizeOptions = [this.suggestions.length];
    setTimeout(
      () => {
        this.dataSource.paginator = this.paginator;
      });
  }

}
