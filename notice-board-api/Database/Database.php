<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/4/18
 * Time: 10:30 PM
 */


class Database
{
	public $users;

	//real objects
  public $departments;
  public $programmes;
  public $courses;
  public $rooms;
  public $lecturers;
  public $students;
  public $admins;
  public $notices;
  public $timetables;
  public $events;
  public $main;

	public function __construct()
	{
		$this->users = new Users();

		//real objects
    $this->departments = new Department();
    $this->programmes = new Programme();
    $this->courses = new Course();
    $this->rooms = new Rooms();
    $this->lecturers = new Lecturer();
    $this->students = new Student();
    $this->admins = new Admin();
    $this->notices = new Notice();
    $this->timetables = new TimeTable();
    $this->events = new Upshot();
    $this->main = new Main();
	}

}
