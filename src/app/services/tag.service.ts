import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Tag} from "../data/tag";

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private httpClient: HttpClient) {}

  getAllTags(){
    return this.httpClient.get<Tag[]>(`${environment.apiUrl}/tags`);
  }

  addTag(tag: Tag){
    return this.httpClient.post(`${environment.apiUrl}/addTag`, tag);
  }

}
