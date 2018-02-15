import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment.prod';
import {Notice} from '../_models/notice';

@Injectable()
export class NoticeService {
	constructor(private http: HttpClient) { }

	getAll() {
		return this.http.get<any>(environment.api + '?action=load&table=notices');
	}

	createOrUpdate(c: Notice) {
		return this.http.post<any>(environment.api, { action: 'insertOrUpdate', table: 'notices', course: JSON.stringify(c)});
	}

	delete(id: number) {
		return this.http.get<any>(environment.api + '?action=delete&table=notices&id=' + id);
	}
}
