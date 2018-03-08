<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 3/24/18
 * Time: 4:28 PM
 */

class Lecturer
{
  private $handle;

  /**
   * lecturers constructor.
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
  public function getLecturers(){
    $lecturers_list = array();
    try{
      $this->handle->beginTransaction();

      $lecturers = $this->handle->prepare("SELECT lecturers.*, departments.*, rooms.* FROM lecturers, rooms, departments WHERE 
(lecturers.department_id_fk=department_id AND lecturer_office_id_fk=rooms.room_id) ORDER BY first_name ASC, last_name ASC ");

      if($lecturers->execute()){

        if($lecturers->rowCount() < 1){ return false; }

        foreach ($lecturers->fetchAll() as $row) {
          $temp = [
            'id' => $row['lecturer_id'],
            'first_name' => $row['first_name'],
            'last_name' => $row['last_name'],
            'contact' => $row['lecturer_contact'],
            'email' => $row['lecturer_email'],
            'room_id' => $row['room_id'],
            'room_no' => $row['room_no'],
            'department_id' => $row['department_id'],
            'department_name' => $row['department_name'],
          ];
          array_push($lecturers_list, $temp);
        }
      }
      $this->handle->commit();

      return $lecturers_list;

    }catch (PDOException $e){
      $this->handle->rollBack();
      return false;
    }
  }

  /**
   * @param $lecturer
   * @return bool
   */
  public function updateInsertLecturers($lecturer){
    try{
      $this->handle->beginTransaction();

      if (isset($lecturer['id'])){
        $update = $this->handle->prepare("UPDATE lecturers SET first_name=:first_name, last_name=:last_name,
 lecturer_contact=:contact, lecturer_email=:email, lecturer_office_id_fk=:room_id, department_id_fk=:department_id WHERE lecturer_id=:id");
        if(!$update->execute(
          [
            ':id' => $lecturer['id'],
            'first_name' => $lecturer['first_name'],
            'last_name' => $lecturer['last_name'],
            'contact' => $lecturer['contact'],
            'email' => $lecturer['email'],
            'room_id' => $lecturer['room_id'],
            'department_id' => $lecturer['department_id'],
          ]
        )){
          return false;
        }
      }else{
        $insert = $this->handle->prepare("INSERT INTO lecturers(first_name, last_name, lecturer_email, lecturer_contact, lecturer_office_id_fk, department_id_fk)
 VALUES(:first_name, :last_name, :email, :contact, :room_id, :department_id)");
        if(!$insert->execute(
          [
            'first_name' => $lecturer['first_name'],
            'last_name' => $lecturer['last_name'],
            'contact' => $lecturer['contact'],
            'email' => $lecturer['email'],
            'room_id' => $lecturer['room_id'],
            'department_id' => $lecturer['department_id'],
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
   * @param $lecturerId
   * @return bool
   */
  public function deleteLecturer($lecturerId){
    try{
      $this->handle->beginTransaction();

      $result = $this->handle->prepare("DELETE FROM lecturers WHERE lecturer_id=:id" );

      if(!$result->execute([ ':id'=>$lecturerId ])){
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
