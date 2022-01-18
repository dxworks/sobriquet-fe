import {Component, OnInit} from '@angular/core';
import {Identity} from '../../data/identity';
import {ActivatedRoute} from '@angular/router';
import {Project} from '../../data/project';
import {Engineer} from '../../data/engineer';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {

  project: Project;
  identities: Identity[] = [];
  engineers: Engineer[] = [];
  engineer: Engineer;
  suggestions: Identity[] = [];

  constructor(private activatedRoute: ActivatedRoute, private projectService: ProjectService) {
    this.projectService.getAllProjects().subscribe(response => {
      this.project = response.find(project => project.name === this.activatedRoute.snapshot.url[this.activatedRoute.snapshot.url.length - 1].path);
      this.identities = this.project?.identities;
      this.transformIdentities();
    })
  }

  ngOnInit(): void {
  }

  transformIdentities() {
    this.identities.forEach(identity => this.engineers.push({
      firstName: identity.firstName,
      lastName: identity.lastName,
      email: identity.email,
      project: this.project.id,
      affiliations: [],
      tags: [],
      teams: [],
      country: '',
      city: '',
      position: '',
      role: '',
      identities: []
    }))
  }

  changeEngineerTable($event) {
    this.engineer = $event;
    this.engineers = [];
    this.projectService.getById(this.project.id).subscribe(response => {
      this.identities = response.identities;
      this.transformIdentities();
    });
  }
}
