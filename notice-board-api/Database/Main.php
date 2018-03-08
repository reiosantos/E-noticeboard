<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 3/26/18
 * Time: 2:03 PM
 */

class Main
{
  private $handle;

  /**
   * mains constructor.
   */
  public function __construct()
  {
    $this->handle = Connection::getConnection();
    if($this->handle == null){
      return null;
    }
    $this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  }

  /**
   * @return array|bool
   */
  public function getMainSummary(){
    $summary = [
      'no_of_courses' => 0,
      'no_of_students' => 0,
      'no_of_lecturers' => 0,
      'no_of_new_events' => 0,
      'no_of_programmes' => 0,
    ];;
    try{
      $this->handle->beginTransaction();

      $courses = $this->handle->prepare("SELECT count(*) FROM courses;");
      if($courses->execute()){
        if($courses->rowCount() > 0){
          $summary['no_of_courses'] = $courses->fetchColumn(0);
        }
      }
      $students = $this->handle->prepare("SELECT count(*) FROM students;");
      if($students->execute()){
        if($students->rowCount() > 0){
          $summary['no_of_students'] = $students->fetchColumn(0);
        }
      }
      $lecturers = $this->handle->prepare("SELECT count(*) FROM lecturers;");
      if($lecturers->execute()){
        if($lecturers->rowCount() > 0){
          $summary['no_of_lecturers'] = $lecturers->fetchColumn(0);
        }
      }
      $programmes= $this->handle->prepare("SELECT count(*) FROM programmes;");
      if($programmes->execute()){
        if($programmes->rowCount() > 0){
          $summary['no_of_programmes'] = $programmes->fetchColumn(0);
        }
      }
      $events = $this->handle->prepare("SELECT count(*) FROM events_upshots WHERE DATE(event_date) > DATE(SUBDATE(CURRENT_DATE, 1));");
      if($events->execute()){
        if($events->rowCount() > 0){
          $summary['no_of_new_events'] = $events->fetchColumn(0);
        }
      }
      $this->handle->commit();

      return $summary;

    }catch (PDOException $e){
      $this->handle->rollBack();
      return false;
    }
  }
}
