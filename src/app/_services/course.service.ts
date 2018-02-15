import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Course} from '../_models/course';

@Injectable()
export class CourseService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(environment.api + '?action=load&table=courses');
	}

	createOrUpdate(c: Course) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'courses', course: JSON.stringify(c)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=courses&id=' + id);
	}
}
