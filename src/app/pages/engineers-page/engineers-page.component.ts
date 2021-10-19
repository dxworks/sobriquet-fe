import {Component, OnInit} from '@angular/core';
import {Engineer} from "../../data/engineer";
import {EngineerService} from "../../services/engineer.service";

@Component({
  selector: 'app-engineers-page',
  templateUrl: './engineers-page.component.html',
  styleUrls: ['./engineers-page.component.css']
})
export class EngineersPageComponent implements OnInit {

  engineers: Engineer[] = [];

  tableView: boolean;
  cardsView: boolean;

  constructor(private engineerService: EngineerService) {
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.engineerService.getAll().subscribe(response => {
      this.engineers = response;
      this.tableView = true;
      this.cardsView = false;
    });
  }

  changeView(){
     if (this.cardsView) {
       this.tableView = true;
       this.cardsView = false;
     } else {
       this.tableView = false;
       this.cardsView = true;
     }
  }
}
