import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Notice} from '../_models/notice';
import {User} from '../_models/user';

@Injectable()
export class NoticeService {
	constructor(private http: HttpClient) { }

	getAll(user: User) {
		return this.http.get<any>(environment.api + '?action=load&table=notices&user=' + JSON.stringify(user));
	}

	getArchives(user: User) {
		return this.http.get<any>(environment.api + '?action=load&table=notices&archives=true&user=' + JSON.stringify(user));
	}

	getUrgent(user: User, urgent: boolean) {
		return this.http.get<any>(environment.api + '?action=load&table=notices&urgent=' + urgent + '&user=' + JSON.stringify(user));
	}

	createOrUpdate(c: Notice) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'notices', notice: JSON.stringify(c)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=notices&id=' + id);
	}
}
