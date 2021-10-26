import {Component, OnInit} from '@angular/core';
import {Identity} from "../../data/identity";
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../data/project";
import {Engineer} from "../../data/engineer";
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-project-identity',
  templateUrl: './project-identity-page.html',
  styleUrls: ['./project-identity-page.css']
})
export class ProjectIdentityPage implements OnInit {

  project: Project;
  identities: Identity[] = [];
  engineers: Engineer[] = [];
  engineer: Engineer;
  suggestions: Identity[] = [];

  constructor(private activatedRoute: ActivatedRoute, private projectService: ProjectService) {
    this.projectService.getByName(this.activatedRoute.snapshot.queryParams.project).subscribe(response => this.project = response);
  }

  ngOnInit(): void {
    this.identities = this.project?.identities;
  }
}
