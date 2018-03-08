<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 3/24/18
 * Time: 8:38 PM
 */

class Student
{
  private $handle;

  /**
   * students constructor.
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
   * @param $user
   * @return array|bool
   */
  public function getStudents($user){
    $students_list = array();
    try{
      $this->handle->beginTransaction();

      if ($user && !boolval($user['is_admin']) && !boolval($user['is_lecturer'])){

        $students = $this->handle->prepare("SELECT students.*, programmes.* FROM students, programmes WHERE 
students.programme_id_fk=programmes.programme_id AND programme_id_fk='" . $user['student_programme_id'] . "' ORDER BY student_name ASC, registration_no ASC ");

      }else{
        $students = $this->handle->prepare("SELECT students.*, programmes.* FROM students, programmes WHERE 
students.programme_id_fk=programmes.programme_id ORDER BY student_name ASC, registration_no ASC ");
      }

      if($students->execute()){

        if($students->rowCount() < 1){ return false; }

        foreach ($students->fetchAll() as $row) {
          $temp = [
            'id' => $row['student_id'],
            'student_no' => $row['student_no'],
            'registration_no' => $row['registration_no'],
            'full_name' => $row['student_name'],
            'programme_id' => $row['programme_id'],
            'programme_name' => $row['programme_name'],
            'programme_code' => $row['programme_code'],
          ];
          array_push($students_list, $temp);
        }
      }
      $this->handle->commit();

      return $students_list;

    }catch (PDOException $e){
      $this->handle->rollBack();
      return false;
    }
  }

  /**
   * @param $student
   * @return bool
   */
  public function updateInsertStudents($student){
    try{
      $this->handle->beginTransaction();

      if (isset($student['id'])){
        $update = $this->handle->prepare("UPDATE students SET student_name=:fname, registration_no=:reg_no,
student_no=:stud_no, programme_id_fk=:prog_id WHERE student_id=:id");
        if(!$update->execute(
          [
            ':id' => $student['id'],
            ':fname' => $student['full_name'],
            ':reg_no' => $student['registration_no'],
            ':stud_no' => $student['student_no'],
            ':prog_id' => $student['programme_id'],
          ]
        )){
          return false;
        }
      }else{
        $insert = $this->handle->prepare("INSERT INTO students(student_name, registration_no, student_no, programme_id_fk)
 VALUES(:fname, :reg_no, :stud_no, :prog_id)");
        if(!$insert->execute(
          [
            ':fname' => $student['full_name'],
            ':reg_no' => $student['registration_no'],
            ':stud_no' => $student['student_no'],
            ':prog_id' => $student['programme_id'],
          ]
        )){
          return false;
        }
      }
      $this->handle->commit();

    }catch (PDOException $e){
      $this->handle->rollBack();
      return false;
    }
    return true;
  }

  /**
   * @param $studentId
   * @return bool
   */
  public function deleteStudent($studentId){
    try{
      $this->handle->beginTransaction();

      $result = $this->handle->prepare("DELETE FROM students WHERE student_id=:id" );

      if(!$result->execute([ ':id'=>$studentId ])){
        return false;
      }
      $this->handle->commit();

    }catch (PDOException $e){
      $this->handle->rollBack();
      return false;
    }
    return true;
  }
}
