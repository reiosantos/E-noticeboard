import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Admin} from '../_models/admin';

@Injectable()
export class AdminService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(environment.api + '?action=load&table=admins');
	}

	createOrUpdate(c: Admin) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'admins', admin: JSON.stringify(c)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=admins&id=' + id);
	}
}
