import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Student} from '../_models/student';
import {User} from '../_models/user';

@Injectable()
export class StudentService {
	constructor(private http: HttpClient) { }

	getAll(user: User) {
		return this.http.get<any>(environment.api + '?action=load&table=students&user=' + JSON.stringify(user));
	}

	createOrUpdate(c: Student) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'students', student: JSON.stringify(c)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=students&id=' + id);
	}
}
