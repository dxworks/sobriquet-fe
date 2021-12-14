import {Component, OnInit} from '@angular/core';
import {Engineer} from "../../data/engineer";
import {EngineerService} from "../../services/engineer.service";
import {ProjectService} from "../../services/project.service";
import {Project} from "../../data/project";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-engineers-page',
  templateUrl: './engineers-page.component.html',
  styleUrls: ['./engineers-page.component.css']
})
export class EngineersPageComponent implements OnInit {

  engineers: Engineer[] = [];

  tableView: boolean;
  cardsView: boolean;
  projects: Project[] = [];
  project: Project;
  engineerDeleted = false;
  projectName: string;

  constructor(private engineerService: EngineerService,
              private projectsService: ProjectService,
              private activatedRoute: ActivatedRoute) {
    if (this.activatedRoute.snapshot.url.find(urlSegment => urlSegment.path === 'project')) {
      this.projectName = this.activatedRoute.snapshot.url[this.activatedRoute.snapshot.url.length - 1].path;
    }
  }

  ngOnInit(): void {
    this.getData();
    this.projectsService.getAllProjects().subscribe(response => {
      this.projects = response;
      if (this.projectName) {
        this.project = this.projects.find(project => project.name === this.projectName);
      }
    });
  }

  getData() {
    this.engineerService.getAll().subscribe(response => {
      this.engineers = response;
      if (this.engineerDeleted) {
        this.cardsView = true;
        this.tableView = false
      } else {
        this.tableView = true;
        this.cardsView = false;
      }
    });
  }

  changeView() {
    if (this.cardsView) {
      this.tableView = true;
      this.cardsView = false;
    } else {
      this.tableView = false;
      this.cardsView = true;
    }
  }

  filterEngineersByProject($event) {
    this.project = $event
  }
}
