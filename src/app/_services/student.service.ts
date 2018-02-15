import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Student} from '../_models/student';

@Injectable()
export class StudentService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(environment.api + '?action=load&table=students');
	}

	createOrUpdate(c: Student) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'students', course: JSON.stringify(c)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=students&id=' + id);
	}
}
