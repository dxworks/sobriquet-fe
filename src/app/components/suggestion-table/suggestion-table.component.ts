import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { Identity } from '../../data/identity';
import { MergeSuggestionService } from '../../tools-services/merge-suggestion.service';
import { Engineer } from '../../data/engineer';
import { Project } from '../../data/project';
import { EngineerService } from '../../services/engineer.service';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TagService } from '../../services/tag.service';
import { MergeInformationPopupComponent } from '../merge-information-popup/merge-information-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Characters } from '../../resources/characters';

@Component({
  selector: 'app-suggestion-table',
  templateUrl: './suggestion-table.component.html',
  styleUrls: ['./suggestion-table.component.css']
})
export class SuggestionTableComponent implements OnInit, OnChanges {

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

  suggestions: Identity[] = [];
  identitiesByCluster = [];
  current = 0;
  name: string;
  characters = Characters;
  mergeResult: Engineer = new Engineer();
  allEngineers: Engineer[] = [];
  selectedIdentities: Identity[] = [];
  tableIdentities: Identity[] = [];

  constructor(private mergeSuggestionService: MergeSuggestionService,
              private engineersService: EngineerService,
              private activatedRoute: ActivatedRoute,
              private tagService: TagService,
              public dialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.engineers = this.project?.engineers;
    this.identities = this.projectService.getUniqueIdentities(this.project?.identities);
    this.prepareData();
    this.getMergedEngineerDetails();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.project?.firstChange) {
      this.identities = this.projectService.getUniqueIdentities(this.project.identities);
      this.prepareData();
      this.allEngineers = this.engineers = this.project.engineers;
      this.getMergedEngineerDetails();
    }
    if (changes.demergedIdentities && this.demergedIdentities.length > 0) {
      this.identities = this.projectService.getUniqueIdentities(this.project.identities);
      this.demergedIdentities.forEach(identity => {
        if (!this.identities.find(id => id.email === identity.email)) {
          this.identities.push(identity);
        }
      });
      this.project.identities = this.identities;
      this.prepareData();
      this.engineers = this.project.engineers;
      this.getMergedEngineerDetails();
    }
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
      username: this.getUsername(),
    }
  }

  getUsername() {
    if (this.suggestions[0]?.username) {
      return this.suggestions[0].username
    } else {
      return '';
    }
  }

  prepareData() {
    this.identitiesByCluster = this.mergeSuggestionService.buildCluster(this.identities);
    this.getSuggestions(this.identities);
    this.tableIdentities = this.identitiesByCluster[this.current];
    this.selectedIdentities = this.tableIdentities;
  }

  getSuggestions(identities: Identity[]) {
    this.suggestions = this.mergeSuggestionService.getMergeSuggestions(identities);
  }

  checkIdentity(identity: Identity) {
    return !!this.suggestions.find(suggestion => suggestion === identity);
  }

  getSimilar() {
    const engForDelete = [];
    for (let i = 0; i < this.suggestions.length; i++) {
      engForDelete.push(this.allEngineers.find(eng => eng.email === this.suggestions[i].email));
    }
    return engForDelete;
  }

  merge() {
    let data = this.buildData(this.checkBotIdentity());
    this.project.engineers.push(data);
    this.projectService.editProject(this.project.id, this.project).subscribe(() => this.manageMerge(data));
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
    console.log(this.project.identities);
    this.engineerEmitter.emit(data);
    this.manageIdentities();
    this.demergedIdentities.length === 0 ? this.updateProjectIdentities(this.getSimilar()) : this.updateProjectIdentities(null);
    this.identitiesByCluster = this.mergeSuggestionService.buildCluster(this.identities);
    this.getSuggestions(this.identitiesByCluster[this.current - 1]);
  }

  rejectMerge() {
    this.updateProjectIdentities(null);
    this.splitCluster(this.identitiesByCluster.find(cluster => cluster[0] === this.suggestions[0]));
    this.getSuggestions(this.identitiesByCluster[this.current - 1]);
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

  getMergeResultIdentities() {
    this.engineers.find(eng => {
      if (eng?.email === this.mergeResult.email && eng.identities.length > 0) {
        this.mergeResult.identities = this.suggestions.concat(eng.identities);
      }
    });
    if (this.mergeResult.identities.length === 0) {
      return this.suggestions;
    } else {
      return this.mergeResult.identities;
    }
  }


  buildBot(): Engineer {
    return {
      ...this.mergeResult,
      tags: [{name: 'BOT'}],
      identities: this.getMergeResultIdentities(),
      ignorable: false
    }
  }

  buildEngineer(): Engineer {
    return {
      ...this.mergeResult,
      identities: this.getMergeResultIdentities(),
      ignorable: false
    }
  }

  manageIdentities() {
    this.suggestions.forEach(suggestion => {
      this.identities.splice(this.identities.indexOf(suggestion), 1);
    });
  }

  updateProjectIdentities(engineers) {
    this.projectService.editProject(this.project.id, this.project).subscribe(() => this.projectEmitter.emit({
      projectIdentities: this.project.identities,
      engineers: engineers
    }));
  }

  changePage(pageIndex: number) {
    this.current = pageIndex;
    this.prepareData();
    this.getSuggestions(this.identitiesByCluster[this.current]);
    this.getMergedEngineerDetails();
  }

  getSourceDisplayIcon(source: string) {
    return this.mergeSuggestionService.getSourceDisplayIcon(source);
  }

  cleanName() {
    this.mergeResult.name = this.mergeSuggestionService.cleanName(this.mergeResult.name);
  }

  anonymize() {
    this.mergeResult = this.engineersService.anonymize(this.mergeResult, this.name);
  }

  loadIdentities($event) {
    this.identities = this.projectService.getUniqueIdentities(this.project?.identities);
    this.prepareData();
    this.tableIdentities = this.identitiesByCluster[$event.first];
  }
}
