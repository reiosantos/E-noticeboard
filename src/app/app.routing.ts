import { Routes, RouterModule } from '@angular/router';

import {LoginComponent} from './login/login.component';
import {HomeComponent} from './home/home.component';
import {StudentsComponent} from './students/students.component';
import {LecturersComponent} from './lecturers/lecturers.component';
import {CoursesComponent} from './courses/courses.component';
import {RoomsOfficesComponent} from './rooms-offices/rooms-offices.component';
import {TimetablesComponent} from './timetables/timetables.component';
import {NoticesComponent} from './notices/notices.component';
import {UpshotsComponent} from './upshots/upshots.component';
import {ProgrammesComponent} from './programmes/programmes.component';
import {AuthGuard} from './_guards/auth.guard';
import {AdminComponent} from './admins/admin.component';

const appRoutes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full'},
	{ path: 'home', component: HomeComponent},
	{ path: 'courses', component: CoursesComponent},
	{ path: 'programmes', component: ProgrammesComponent},
	{ path: 'students', component: StudentsComponent},
	{ path: 'lecturers', component: LecturersComponent},
	{ path: 'rooms', component: RoomsOfficesComponent},
	{ path: 'events', component: UpshotsComponent},
	{ path: 'timetables', component: TimetablesComponent},
	{ path: 'notices', component: NoticesComponent},
	{ path: 'admins', component: AdminComponent, canActivate: [AuthGuard]},
	{ path: 'login', component: LoginComponent },
	// otherwise redirect to home
	{ path: '**', redirectTo: '', canActivate: [AuthGuard]}
];

export const routing = RouterModule.forRoot(appRoutes, {useHash: true});
