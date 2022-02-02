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
  @Input()
  demergedIdentities: Identity[] = [];

  @Output()
  projectEmitter = new EventEmitter();
  @Output()
  engineerEmitter = new EventEmitter();
  @Output()
  suggestionsEmitter = new EventEmitter();

  dataSource: MatTableDataSource<Identity>;
  displayedColumns = ['firstname', 'lastname', 'username', 'email', 'source', 'actions'];
  suggestions: Identity[] = [];
  pagination: number[];
  identitiesByCluster = [];
  current = 1;
  engineers: Engineer[] = [];

  constructor(private mergeSuggestionService: MergeSuggestionService,
              private engineersService: EngineerService,
              private activatedRoute: ActivatedRoute,
              private tagService: TagService,
              private changeDetectorRef: ChangeDetectorRef,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.getEngineers();
    this.identities = this.project?.identities;
    this.prepareData();
    this.initTable();
  }

  ngAfterViewInit() {
    this.pagination = [this.suggestions.length];
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
      this.getEngineers();
    }
    if (changes.demergedIdentities && this.demergedIdentities.length > 0) {
      this.identities.length > 0 ? this.identities = this.identities.concat(this.demergedIdentities) : this.identities = this.demergedIdentities;
      this.project.identities = this.identities;
      this.prepareData();
      this.getEngineers();
    }
  }

  getEngineers() {
    this.engineersService.getAll().subscribe(response => this.engineers = response.filter(eng => eng.project === this.project.id));
  }

  initTable() {
    this.pagination = [this.suggestions.length];
    this.paginator = new MatPaginator(new MatPaginatorIntl(), this.changeDetectorRef);
    this.paginator._displayedPageSizeOptions = [this.suggestions.length];
    setTimeout(
      () => {
        this.dataSource.paginator = this.paginator;
      });
  }

  prepareData() {
    this.sortIdentities();
    this.identitiesByCluster = this.mergeSuggestionService.buildCluster(this.identities);
    this.changePage({pageIndex: 0});
  }

  sortIdentities() {
    this.identities?.sort((id1, id2) => id1.firstName.localeCompare(id2.firstName));
  }

  getSuggestions(identities: Identity[]) {
    this.suggestions = this.mergeSuggestionService.getMergeSuggestions(identities);
    if (this.suggestions.length === 1) {
      this.merge();
    }
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

  removeSimilar() {
    const engForDelete = [];
    for (let i = 1; i < this.suggestions.length; i++) {
      engForDelete.push(this.engineers.find(eng => eng.email === this.suggestions[i].email));
    }
    this.engineers = engForDelete;
  }

  merge() {
    let data: Engineer;
    if (this.engineers.find(eng => eng.email === this.suggestions[0].email)) {
      data = this.engineers.find(eng => eng.email === this.suggestions[0].email);
      data.identities = this.suggestions;
      if (this.checkBotIdentity()) {
        if (data.tags.length === 0) {
          data.tags = [{name: 'BOT'}];
        } else {
          data.tags.push({name: 'BOT'});
        }
      }
      this.removeSimilar();
      this.engineersService.edit(data).subscribe(() => {
        this.engineerEmitter.emit(data);
        this.manageIdentities();
        this.updateProjectIdentities(this.engineers);
        this.sortIdentities();
        this.identitiesByCluster = this.mergeSuggestionService.buildCluster(this.identities);
        this.getSuggestions(this.identitiesByCluster[this.current - 1]);
        this.changePage({pageIndex: this.current - 1});
      });
    } else {
      data = this.buildData(this.checkBotIdentity());
      this.engineersService.add(data).subscribe(() => {
        this.engineerEmitter.emit(data);
        this.manageIdentities();
        this.updateProjectIdentities(null);
        this.sortIdentities();
        this.identitiesByCluster = this.mergeSuggestionService.buildCluster(this.identities);
        this.getSuggestions(this.identitiesByCluster[this.current - 1]);
        this.changePage({pageIndex: this.current - 1});
      });
    }
  }

  rejectMerge() {
    this.updateProjectIdentities(null);
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

  buildBot(): Engineer {
    return {
      name: this.suggestions[0].firstName + ' ' + this.suggestions[0].lastName,
      email: this.suggestions[0].email,
      senority: '',
      teams: [],
      city: '',
      country: '',
      project: this.project.id,
      role: '',
      tags: [{name: 'BOT'}],
      identities: this.suggestions,
      status: '',
      reportsTo: ''
    }
  }

  buildEngineer(): Engineer {
    return {
      name: this.suggestions[0].firstName + ' ' + this.suggestions[0].lastName,
      email: this.suggestions[0].email,
      senority: '',
      teams: [],
      city: '',
      country: '',
      project: this.project.id,
      role: '',
      tags: [],
      identities: this.suggestions,
      status: '',
      reportsTo: ''
    }
  }

  manageIdentities() {
    this.suggestions.forEach(suggestion => {
      this.identities.splice(this.identities.indexOf(suggestion), 1);
    });
  }

  updateProjectIdentities(engineers) {
    this.suggestions.forEach(suggestion => {
      this.project.identities = this.project.identities.filter(identity => identity.username !== suggestion.username);
    });
    this.projectService.editProject(this.project.id, this.project.identities).subscribe(() => this.projectEmitter.emit({
      projectIdentities: this.project.identities,
      engineers: engineers
    }));
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
