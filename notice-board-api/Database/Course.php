<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 3/24/18
 * Time: 2:24 PM
 */

class Course
{
  private $handle;

  /**
   * courses constructor.
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
  public function getCourses($user){
    $courses_list = array();
    try{
      $this->handle->beginTransaction();
      if ($user && !boolval($user['is_admin']) && !boolval($user['is_lecturer'])){

        $courses = $this->handle->prepare("SELECT courses.*, programmes.* FROM courses LEFT JOIN programmes ON 
courses.programme_id_fk=programme_id WHERE programme_id='" . $user['student_programme_id'] . "' ORDER BY course_code ASC, course_name ASC ");

      }else{
        $courses = $this->handle->prepare("SELECT courses.*, programmes.* FROM courses LEFT JOIN programmes ON courses.programme_id_fk=programme_id 
ORDER BY course_code ASC, course_name ASC ");
      }

      if($courses->execute()){

        if($courses->rowCount() < 1){ return false; }

        foreach ($courses->fetchAll() as $row) {
          $temp = [
            'id' => $row['course_id'],
            'name' => $row['course_name'],
            'code' => $row['course_code'],
            'programme_code' => $row['programme_code'],
            'programme_name' => $row['programme_name'],
            'programme_id' => $row['programme_id'],
          ];
          array_push($courses_list, $temp);
        }
      }
      $this->handle->commit();

      return $courses_list;

    }catch (PDOException $e){
      $this->handle->rollBack();
      return false;
    }
  }

  /**
   * @param $course
   * @return bool
   */
  public function updateInsertCourses($course){
    try{
      $this->handle->beginTransaction();

      if (isset($course['id'])){
        $update = $this->handle->prepare("UPDATE courses SET course_name=:course_name,
 course_code=:course_code, programme_id_fk=:programme_id WHERE course_id=:id");
        if(!$update->execute(
          [
            ':id' => $course['id'],
            ':course_name' => $course['name'],
            ':course_code' => $course['code'],
            ':programme_id' => $course['programme_id']
          ]
        )){
          return false;
        }
      }else{
        $insert = $this->handle->prepare("INSERT INTO courses(course_name, course_code, programme_id_fk)
 VALUES(:course_name, :course_code, :programme_id)");
        if(!$insert->execute(
          [
            ':course_name' => $course['name'],
            ':course_code' => $course['code'],
            ':programme_id' => $course['programme_id']
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
   * @param $courseId
   * @return bool
   */
  public function deleteCourse($courseId){
    try{
      $this->handle->beginTransaction();

      $result = $this->handle->prepare("DELETE FROM courses WHERE course_id=:id" );

      if(!$result->execute([ ':id'=>$courseId ])){
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
