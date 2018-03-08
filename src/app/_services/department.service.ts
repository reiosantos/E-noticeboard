import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Department} from '../_models/department';

@Injectable()
export class DepartmentService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(environment.api + '?action=load&table=departments');
	}

	createOrUpdate(c: Department) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'departments', department: JSON.stringify(c)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=departments&id=' + id);
	}
}
