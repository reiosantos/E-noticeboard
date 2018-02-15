import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class AuthenticationService {
	constructor(private http: HttpClient) { }

	login(username: string, password: string) {
		return this.http.post<any>(environment.api, { action: 'login', username: username, password: password })
			.map(user => {
				// login successful if there's a jwt token in the response
				if (user && user.data && user.data.token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					localStorage.setItem('currentUser', JSON.stringify(user.data));
				}
				return user;
			});
	}

	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('currentUser');
		// localStorage.clear();
	}
}
