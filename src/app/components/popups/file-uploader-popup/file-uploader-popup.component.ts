import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {FileService} from "../../../services/file.service";
import {Router} from "@angular/router";
import {readAndParseJson} from "@angular/cli/utilities/json-file";

@Component({
  selector: 'app-file-uploader-popup',
  templateUrl: './file-uploader-popup.component.html',
  styleUrls: ['./file-uploader-popup.component.css']
})
export class FileUploaderPopupComponent implements OnInit {

  selectedJSON: File;
  url: string;

  constructor(public dialogRef: MatDialogRef<FileUploaderPopupComponent>,
              private storage: AngularFireStorage,
              private fileService: FileService,
              @Inject(MAT_DIALOG_DATA) public data,
              public router: Router) {
  }

  ngOnInit(): void {
    if (this.data){
      this.importFromArchive();
    }
  }

  closePopup() {
    this.dialogRef.close();
  }

  import() {
    this.createFile();
    this.dialogRef.close(this.selectedJSON);
  }

  importFromArchive(){
    console.log(JSON.parse(JSON.stringify(this.data.data.url)));
    const blob = new Blob([this.data.data.url], {type: 'application/json'});
    this.readBlob(blob);
  }

  readBlob(file: Blob){
    const reader = new FileReader();
    reader.onloadend = function () {
      console.log(reader.result);
    }
    reader.readAsDataURL(file);
  }

  upload($event): void {
    this.selectedJSON = $event.target.files[0];
    this.createRecord();
  }

  createRecord(): void {
    let filePath = `/files/_${new Date().getTime()}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath, this.selectedJSON).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.url = url;
        });
      })
    ).subscribe();
  }

  createFile(){
    const data = {
      filename: this.selectedJSON.name,
      url: this.url
    }
    this.fileService.addFile(data).subscribe();
  }

  goToArchive(){
    this.router.navigate(['/archive'], {queryParams: {'selection': true}});
    this.closePopup();
  }
}
