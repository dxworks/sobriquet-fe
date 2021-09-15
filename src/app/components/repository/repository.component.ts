import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Repository} from "../../data/repository";
import {RepositoryService} from "../../services/repository.service";

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.css']
})
export class RepositoryComponent implements OnInit {

  @Input()
  repositories: Repository[] = [];
  @Output()
  repositoryDeleted = new EventEmitter()

  constructor(private repositoryService: RepositoryService) {
  }

  ngOnInit(): void {
  }

  deleteRepository(repoId: string) {
    this.repositoryService.deleteRepo(repoId).subscribe(() => this.repositoryDeleted.emit());
  }

}
