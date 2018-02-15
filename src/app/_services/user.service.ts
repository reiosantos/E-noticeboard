﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../_models/user';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class UserService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(environment.api + '?action=load&table=users');
	}

	createOrUpdate(user: User) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'users', user: JSON.stringify(user)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=users&id=' + id);
	}
}
