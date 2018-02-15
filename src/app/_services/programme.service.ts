import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Programme} from '../_models/programme';

@Injectable()
export class ProgrammeService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(environment.api + '?action=load&table=programmes');
	}

	createOrUpdate(c: Programme) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'programmes', course: JSON.stringify(c)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=programmes&id=' + id);
	}
}
