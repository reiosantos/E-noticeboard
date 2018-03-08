import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class MainService {
  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any>(environment.api + '?action=load&table=summary');
  }
}
