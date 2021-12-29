import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit, ChangeDetectorRef
} from '@angular/core';
import {Identity} from '../../data/identity';
import {MatTableDataSource} from '@angular/material/table';
import {MergeSuggestionService} from '../../services/ToolsService/merge-suggestion.service';
import {Engineer} from '../../data/engineer';
import {Project} from '../../data/project';
import {EngineerService} from '../../services/engineer.service';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {TagService} from '../../services/tag.service';

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

  displayedColumns = ['firstname', 'lastname', 'username', 'email', 'source', 'actions'];

  suggestions: Identity[] = [];

  projects: Project[] = [];

  pagination: number[];

  identitiesByCluster = [];

  current = 1;

  constructor(private mergeSuggestionService: MergeSuggestionService,
              private engineersService: EngineerService,
              private activatedRoute: ActivatedRoute,
              private tagService: TagService,
              private changeDetectorRef: ChangeDetectorRef,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe(response => this.projects = response);
    this.identities = this.project?.identities;
    this.prepareData();
    this.initTable();
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.paginator = new MatPaginator(new MatPaginatorIntl(), this.changeDetectorRef);
      this.paginator._displayedPageSizeOptions = [this.suggestions.length];
      setTimeout(
        () => {
          this.dataSource.paginator = this.paginator;
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.project?.firstChange) {
      this.identities = this.project.identities;
      this.prepareData();
      this.initTable();
    }
  }

  initTable() {
    this.paginator = new MatPaginator(new MatPaginatorIntl(), this.changeDetectorRef);
    this.paginator._displayedPageSizeOptions = [this.suggestions.length];
    setTimeout(
      () => {
        this.dataSource.paginator = this.paginator;
      });
  }

  prepareData() {
    this.sortIdentities();
    this.dataSource = new MatTableDataSource(this.identities);
    this.identitiesByCluster = this.mergeSuggestionService.buildCluster(this.identities);
    this.getSuggestions(this.identities);
  }

  sortIdentities() {
    this.identities?.sort((id1, id2) => id1.firstName.localeCompare(id2.firstName));
  }

  getSuggestions(identities: Identity[]) {
    this.suggestions = this.mergeSuggestionService.getMergeSuggestions(identities);
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
    const data: Engineer = this.buildData(this.checkBotIdentity());
    this.engineersService.add(data).subscribe(() => {
      this.engineerEmitter.emit(data);
      this.manageIdentities();
      this.updateProjectIdentities();
      this.sortIdentities();
      this.identitiesByCluster = this.mergeSuggestionService.buildCluster(this.identities);
      this.getSuggestions(this.identitiesByCluster[this.paginator.pageIndex]);
      this.dataSource = new MatTableDataSource(this.identitiesByCluster[this.paginator.pageIndex]);
    });
  }

  rejectMerge() {
    this.updateProjectIdentities();
    this.manageIdentities();
    this.getSuggestions(this.identities);
    this.managePagination(this.identities);
  }

  checkBotIdentity() {
    return !!this.suggestions.every(identity => this.mergeSuggestionService.checkBot(identity.email) === true);
  }

  buildData(bot: boolean) {
    if (bot) {
      return this.buildBot();
    }
    return this.buildEngineer();
  }

  buildBot() {
    return {
      firstName: this.suggestions[0].firstName,
      lastName: this.suggestions[0].lastName,
      email: this.suggestions[0].email,
      position: '',
      teams: [],
      city: '',
      country: '',
      affiliations: [],
      project: this.project.id,
      role: '',
      tags: [{name: 'BOT'}]
    }
  }

  buildEngineer() {
    return {
      firstName: this.suggestions[0].firstName,
      lastName: this.suggestions[0].lastName,
      email: this.suggestions[0].email,
      position: '',
      teams: [],
      city: '',
      country: '',
      affiliations: [],
      project: this.project.id,
      role: '',
      tags: []
    }
  }

  manageIdentities() {
    this.suggestions.forEach(suggestion => {
      this.identities.splice(this.identities.indexOf(suggestion), 1);
    });
  }

  updateProjectIdentities() {
    this.suggestions.forEach(suggestion => {
      this.project.identities = this.project.identities.filter(identity => identity.username !== suggestion.username);
    });
    this.projectService.editProject(this.project.id, this.project.identities).subscribe();
  }

  managePagination(identities: Identity[]) {
    this.dataSource = new MatTableDataSource<Identity>(identities);
    this.paginator._displayedPageSizeOptions = [this.suggestions.length];
    setTimeout(
      () => {
        this.dataSource.paginator = this.paginator;
      });
  }

  changePage($event) {
    this.current = $event.pageIndex + 1;
    this.getSuggestions(this.identitiesByCluster[$event.pageIndex]);
    this.dataSource = new MatTableDataSource(this.identitiesByCluster[$event.pageIndex]);
    this.initTable();
  }

  manageCheckboxChange($event, identity) {
    if ($event.checked) {
      this.suggestions.push(identity);
    } else {
      this.suggestions.splice(this.suggestions.indexOf(identity), 1);
    }
  }

  getSourceDisplayIcon(source: string) {
    switch (source) {
      case 'jira' :
        return 'assets/source/jira.png'
      case 'github':
        return 'assets/source/github.png'
      case 'bitbucket':
        return 'assets/source/bitbucket.png'
      case 'circle':
        return 'assets/source/circle.png'
      case 'gitlab':
        return 'assets/source/gitlab.png'
      case 'jenkins':
        return 'assets/source/jenkins.png'
      case 'pivotal':
        return 'assets/source/pivotal.png'
      case 'travis':
        return 'assets/source/travis.png'
      default:
        return 'assets/source/git.png'
    }
  }

}
