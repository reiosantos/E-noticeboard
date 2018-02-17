import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (localStorage.getItem(environment.userStorageKey)) {
			// logged in so return true
			return true;
		}
		// not logged in so redirect to login page with the return url
		this.router.navigate(['/login']);
		return false;
	}
}
