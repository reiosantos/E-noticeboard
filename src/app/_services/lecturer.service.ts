import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Lecturer} from '../_models/lecturer';

@Injectable()
export class LecturerService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(environment.api + '?action=load&table=lecturers');
	}

	createOrUpdate(c: Lecturer) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'lecturers', course: JSON.stringify(c)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=lecturers&id=' + id);
	}
}
