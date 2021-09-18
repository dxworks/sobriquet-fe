import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {File} from "../data/file";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClient) { }

  getAllFiles(){
    return this.httpClient.get<File[]>(`${environment.apiUrl}/files`);
  }

  addFile(file: File){
    return this.httpClient.post(`${environment.apiUrl}/addFile`, file);
  }
}
