import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../_services/authentication.service';
import {AlertService} from '../_services/alert.service';
import {isNullOrUndefined} from 'util';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

	title = 'NoticeBoard';
	loginForm: FormGroup;
	loading = false;
	submitted = false;
	model: any = [];
	loginSubscription: any;

	constructor(
		private formBuilder: FormBuilder,
		private location: Location,
		private alertService: AlertService,
		private authService: AuthenticationService,
	) {
		this.loginForm = formBuilder.group({
			email: ['', Validators.compose([Validators.required])],
			password: ['', Validators.compose([Validators.required])]
		});
	}

	ngOnInit() {
		this.authService.logout();
	}

	login() {
		this.submitted = true;
		if (!this.loginForm.valid) {
			return false;
		}
		this.loading = true;
		this.loginSubscription = this.authService.login(this.model.username, this.model.password).subscribe(
			data => {
				if (!data) {
					this.alertService.error('Internal Server Error. Consult the administrator.');
				}else if (!isNullOrUndefined(data.data) && data.data) {
					location.reload();
				}else {
					this.alertService.error(data.error || 'Invalid user Credentials..');
				}
				this.loading = false;
				this.submitted = true;
			},
			error => {
				this.alertService.error('Network Connection error..');
				this.loading = false;
				this.submitted = true;
			});
	}

	ngOnDestroy(): void {
		if (this.loginSubscription) {
			this.loginSubscription.unsubscribe();
		}
	}
}
