import {Component, OnInit} from '@angular/core';
import {Identity} from "../../data/identity";
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../data/project";
import {Engineer} from "../../data/engineer";

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

  constructor(private activatedRoute: ActivatedRoute) {
    this.project = JSON.parse(this.activatedRoute.snapshot.queryParams.project);
  }

  ngOnInit(): void {
    this.identities = this.project.identities;
  }
}
