import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Team} from '../../data/team';
import {EngineerService} from '../../services/engineer.service';
import {DiagramService} from '../../services/ToolsService/diagram.service';
import ArrayStore from 'devextreme/data/array_store';
import {Router} from '@angular/router';
import {Project} from '../../data/project';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-teams-diagram',
  templateUrl: './teams-diagram.component.html',
  styleUrls: ['./teams-diagram.component.css']
})
export class TeamsDiagramComponent implements OnInit, OnChanges {

  @Input()
  team: Team;
  @Input()
  allTeams: Team[] = [];
  @Input()
  showAllTeams = false;

  dataSource;
  teamEngineers = new Map();
  nodes = [];
  project: Project;

  constructor(private engineerService: EngineerService,
              private router: Router,
              private projectService: ProjectService,
              private diagramService: DiagramService) {
  }

  ngOnInit(): void {
    this.getProject();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.team) {
      this.getProject();
    }
  }

  getProject() {
    this.projectService.getAllProjects().subscribe(response => {
      this.project = response.find(project => project.name === this.router.url.split('/')[2]);
      this.getData();
    })
  }

  getData() {
    this.engineerService.getAll().subscribe(engineers => {
      if (!this.showAllTeams) {
        this.nodes = this.diagramService.transformEngineersForSingleTeamSelection(engineers.filter(engineer => engineer.teams.includes(this.team.id) && engineer.project === this.project.id));
        this.prepareDiagram();
      } else {
        this.nodes = this.diagramService.transformEngineersForHQ(engineers.filter(engineer => engineer.teams && engineer.project === this.project.id));
        this.prepareDiagram();
      }
    });
  }

  prepareDiagram() {
    this.dataSource = new ArrayStore({
      key: 'id',
      data: this.nodes
    })
  }

}
