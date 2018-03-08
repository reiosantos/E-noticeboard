import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Upshot} from '../_models/upshot';
import {User} from '../_models/user';

@Injectable()
export class UpshotService {
	constructor(private http: HttpClient) { }

	getAll(user: User) {
		return this.http.get<any>(environment.api + '?action=load&table=events&user=' + JSON.stringify(user));
	}

	getArchives(user: User) {
		return this.http.get<any>(environment.api + '?action=load&table=events&archives=true&user=' + JSON.stringify(user));
	}

	createOrUpdate(event: Upshot) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'events', event: JSON.stringify(event)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=events&id=' + id);
	}
}
