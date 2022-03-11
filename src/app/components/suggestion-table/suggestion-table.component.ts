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
import {Tag} from '../../data/tag';
import {MergeInformationPopupComponent} from '../merge-information-popup/merge-information-popup.component';
import {MatDialog} from '@angular/material/dialog';
import {Characters} from '../../resources/characters';

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
  @Input()
  engineers: Engineer[] = [];

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
  name: string;
  characters = Characters;
  mergeResult: Engineer = new class implements Engineer {
    city: string;
    country: string;
    email: string;
    id: string;
    identities: Identity[];
    ignorable: boolean;
    name: string;
    project: string;
    reportsTo: string;
    role: string;
    senority: string;
    status: string;
    tags: Tag[];
    teams: string[];
    username: string;
  };

  constructor(private mergeSuggestionService: MergeSuggestionService,
              private engineersService: EngineerService,
              private activatedRoute: ActivatedRoute,
              private tagService: TagService,
              public dialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.getEngineers();
    this.identities = this.project?.identities.reduce((accumalator, current) => {
      if (
        !accumalator.some(
          (item) => item.id === current.id && this.mergeSuggestionService.identitiesAreEqual(item, current)
        )
      ) {
        accumalator.push(current);
      }
      return accumalator;
    }, []);
    this.prepareData();
    this.initTable();
    this.getMergedEngineerDetails();
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
      this.getIdentitiesWithoutDuplicates();
      this.prepareData();
      this.getEngineers();
      this.getMergedEngineerDetails();
    }
    if (changes.demergedIdentities && this.demergedIdentities.length > 0) {
      this.getIdentitiesWithoutDuplicates();
      this.demergedIdentities.forEach(identity => {
        if (!this.identities.find(id => id.email === identity.email)) {
          this.identities.push(identity);
        }
      })
      this.project.identities = this.identities;
      this.prepareData();
      this.getEngineers();
      this.getMergedEngineerDetails();
    }
  }

  getIdentitiesWithoutDuplicates() {
    this.identities = this.project?.identities.reduce((accumalator, current) => {
      if (
        !accumalator.some(
          (item) => item.id === current.id && this.mergeSuggestionService.identitiesAreEqual(item, current)
        )
      ) {
        accumalator.push(current);
      }
      return accumalator;
    }, []);
  }

  getMergedEngineerDetails() {
    this.mergeResult = {
      city: '',
      country: '',
      email: this.suggestions[0]?.email,
      identities: [],
      ignorable: false,
      name: this.suggestions[0]?.firstName + ' ' + this.suggestions[0]?.lastName,
      project: this.project?.id,
      reportsTo: '',
      role: '',
      senority: '',
      status: '',
      tags: [],
      teams: [],
      username: this.suggestions[0]?.username,
    }
  }

  getEngineers() {
    this.engineersService.getAll().subscribe(response => this.engineers = response.filter(eng => eng.project === this.project?.id));
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
    this.getSuggestions(this.identities);
    this.changePage({pageIndex: 0});
  }

  sortIdentities() {
    this.identities?.sort((id1, id2) => id1.firstName.localeCompare(id2.firstName));
  }

  getSuggestions(identities: Identity[]) {
    this.suggestions = this.mergeSuggestionService.getMergeSuggestions(identities);
    if (this.suggestions.length === 1) {
      this.getMergedEngineerDetails();
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

  getSimilar() {
    const engForDelete = [];
    for (let i = 0; i < this.suggestions.length; i++) {
      engForDelete.push(this.engineers.find(eng => eng.email === this.suggestions[i].email));
    }
    this.engineers = engForDelete;
  }

  merge() {
    this.getSimilar();
    let data = this.buildData(this.checkBotIdentity());
    this.engineersService.addEngineer(data).subscribe(() => {
      this.manageMerge(data)
    });
  }

  onMergeButtonClicked() {
    const selectedEngineers = [];
    for (let i = 0; i < this.suggestions.length; i++) {
      if (this.engineers.find(eng => eng.email === this.suggestions[i].email)) {
        selectedEngineers.push(this.engineers.find(eng => eng.email === this.suggestions[i].email));
      }
    }
    if (selectedEngineers.find(eng => eng.tags.length > 0 || eng.reportsTo || eng.role || eng.teams.length > 0 || eng.status)) {
      this.openMergeInfoPopup(selectedEngineers);
    } else {
      this.merge();
    }
  }

  openMergeInfoPopup(selectedEngineers: Engineer[]) {
    const dialogRef = this.dialog.open(MergeInformationPopupComponent, {
      data: {
        mergedEngineer: this.mergeResult,
        selected: selectedEngineers,
        project: this.project,
        delete: false
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.mergeResult = response;
      }
      this.merge();
    });
  }

  manageMerge(data) {
    this.engineerEmitter.emit(data);
    this.manageIdentities();
    this.demergedIdentities.length === 0 ? this.updateProjectIdentities(this.engineers) : this.updateProjectIdentities(null);
    this.sortIdentities();
    this.identitiesByCluster = this.mergeSuggestionService.buildCluster(this.identities);
    this.getSuggestions(this.identitiesByCluster[this.current - 1]);
    this.changePage({pageIndex: this.current - 1});
  }

  rejectMerge() {
    this.updateProjectIdentities(null);
    this.splitCluster(this.identitiesByCluster.find(cluster => cluster[0] === this.suggestions[0]));
    this.getSuggestions(this.identitiesByCluster[this.current - 1]);
    this.changePage({pageIndex: this.current - 1});
  }

  splitCluster(cluster) {
    let i, j, temporary, chunk = 1;
    for (i = 0, j = cluster.length; i < j; i += chunk) {
      temporary = cluster.slice(i, i + chunk);
    }
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
      name: this.mergeResult.name,
      email: this.mergeResult.email,
      senority: this.mergeResult.senority,
      teams: this.mergeResult.teams,
      city: this.mergeResult.city,
      country: this.mergeResult.country,
      project: this.project.id,
      role: this.mergeResult.role,
      tags: [{name: 'BOT'}],
      identities: this.getMergeResultIdentities(),
      status: this.mergeResult.status,
      reportsTo: this.mergeResult.reportsTo,
      username: this.mergeResult.username,
      ignorable: false
    }
  }

  getMergeResultIdentities() {
    this.engineers.find(eng => {
      if (eng?.email === this.mergeResult.email && eng.identities.length > 0) {
        this.mergeResult.identities = this.suggestions.concat(eng.identities);
      }
    });
    if (this.mergeResult.identities.length === 0){
      return this.suggestions;
    } else {
      return this.mergeResult.identities;
    }
  }

  buildEngineer(): Engineer {
    return {
      name: this.mergeResult.name,
      email: this.mergeResult.email,
      senority: this.mergeResult.senority,
      teams: this.mergeResult.teams,
      city: this.mergeResult.city,
      country: this.mergeResult.country,
      project: this.project.id,
      role: this.mergeResult.role,
      tags: this.mergeResult.tags,
      identities: this.getMergeResultIdentities(),
      status: this.mergeResult.status,
      reportsTo: this.mergeResult.reportsTo,
      username: this.mergeResult.username,
      ignorable: false
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

  changePage($event, getSuggestions?: boolean) {
    this.current = $event.pageIndex + 1;
    if (getSuggestions) {
      this.getSuggestions(this.identitiesByCluster[$event.pageIndex]);
    }
    this.dataSource = new MatTableDataSource(this.identitiesByCluster[$event.pageIndex]);
    this.initTable();
    this.getMergedEngineerDetails();
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

  cleanName() {
    this.mergeResult.name = this.mergeSuggestionService.cleanName(this.mergeResult.name);
  }

  anonymize() {
    this.mergeResult = this.engineersService.anonymize(this.mergeResult, this.name);
  }

}
