import { Component, OnInit } from '@angular/core';
import {File} from "../../data/file";
import {FileService} from "../../services/file.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploaderPopupComponent} from "../../components/popups/file-uploader-popup/file-uploader-popup.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  files: File[];
  selectionEnabled = false;

  constructor(private fileService: FileService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog) {
    this.selectionEnabled = this.activatedRoute.snapshot.queryParams.selection;
  }

  ngOnInit(): void {
    this.fileService.getAllFiles().subscribe(files => this.files = files);
  }

  chooseFile(file){
    this.router.navigate(['/home']).then(() => this.openPopup(file))
  }

  openPopup(file){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: file
    };
    const dialogref = this.dialog.open(FileUploaderPopupComponent, dialogConfig);
  }

}
