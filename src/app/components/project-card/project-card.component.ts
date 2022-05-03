import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Project} from '../../data/project';
import {Router} from '@angular/router';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {

  @Input()
  project: Project;

  @Output()
  projectDeleted = new EventEmitter()

  buttonClicked = false;

  constructor(private router: Router,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
  }

  showProjectIdentities() {
    if (!this.buttonClicked) {
      this.router.navigateByUrl(`/project/${this.project.name}/identities`);
    }
  }

  delete() {
    this.projectService.delete(this.project.id).subscribe(() => this.projectDeleted.emit());
  }

}
