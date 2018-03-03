import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {LoginComponent} from './login/login.component';
import {AlertService} from './_services/alert.service';
import {AuthenticationService} from './_services/authentication.service';
import {UserService} from './_services/user.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {routing} from './app.routing';
import {AlertComponent} from './_directives/alert.component';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { LecturersComponent } from './lecturers/lecturers.component';
import { StudentsComponent } from './students/students.component';
import { RoomsOfficesComponent } from './rooms-offices/rooms-offices.component';
import { TimetablesComponent } from './timetables/timetables.component';
import { NoticesComponent } from './notices/notices.component';
import {CourseService} from './_services/course.service';
import {UpshotService} from './_services/upshot.service';
import { UpshotsComponent } from './upshots/upshots.component';
import {TimetableService} from './_services/timetable.service';
import {NoticeService} from './_services/notice.service';
import { ProgrammesComponent } from './programmes/programmes.component';
import {ProgrammeService} from './_services/programme.service';
import { DepartmentsComponent } from './departments/departments.component';
import {DepartmentService} from './_services/department.service';
import {LecturerService} from './_services/lecturer.service';
import {StudentService} from './_services/student.service';
import {RoomService} from './_services/room.service';
import {AuthGuard} from './_guards/auth.guard';
import {AdminComponent} from './admins/admin.component';
import {AdminService} from './_services/admin.service';


@NgModule({
	declarations: [
		AppComponent,
		AdminComponent,
		AlertComponent,
		LoginComponent,
		HomeComponent,
		CoursesComponent,
		LecturersComponent,
		StudentsComponent,
		RoomsOfficesComponent,
		TimetablesComponent,
		NoticesComponent,
		UpshotsComponent,
		ProgrammesComponent,
		DepartmentsComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		routing,
		HttpClientModule,
	],
	providers: [
		AdminService,
		AuthGuard,
		AlertService,
		AuthenticationService,
		CourseService,
		UserService,
		UpshotService,
		TimetableService,
		NoticeService,
		ProgrammeService,
		DepartmentService,
		LecturerService,
		StudentService,
		RoomService,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
