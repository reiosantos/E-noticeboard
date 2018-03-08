<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 3/24/18
 * Time: 1:36 PM
 */

class Department
{
  private $handle;

  /**
   * departments constructor.
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
  public function getDepartments(){
    $departments_list = array();
    try{
      $this->handle->beginTransaction();

      $departments = $this->handle->prepare("SELECT * FROM departments ORDER BY department_name ASC ");

      if($departments->execute()){

        if($departments->rowCount() < 1){ return false; }

        foreach ($departments->fetchAll() as $row) {
          $temp = [
            'id' => $row['department_id'],
            'name' => $row['department_name'],
            'head' => $row['department_head']
          ];
          array_push($departments_list, $temp);
        }
      }
      $this->handle->commit();

      return $departments_list;

    }catch (PDOException $e){
      $this->handle->rollBack();
      return false;
    }
  }

  /**
   * @param $department
   * @return bool
   */
  public function updateInsertDepartments($department){
    try{
      $this->handle->beginTransaction();

      if (isset($department['id'])){
        $update = $this->handle->prepare("UPDATE departments SET department_name=:department_name,
 department_head=:department_head WHERE department_id=:id");
        if(!$update->execute(
          [
            ':id' => $department['id'],
            ':department_name' => $department['name'],
            ':department_head' => $department['head']
          ]
        )){
          return false;
        }
      }else{
        $insert = $this->handle->prepare("INSERT INTO departments(department_name, department_head)
 VALUES(:department_name, :department_head)");
        if(!$insert->execute(
          [
            ':department_name' => $department['name'],
            ':department_head' => $department['head'],
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
   * @param $departmentId
   * @return bool
   */
  public function deleteDepartment($departmentId){
    try{
      $this->handle->beginTransaction();

      $result = $this->handle->prepare("DELETE FROM departments WHERE department_id=:id" );

      if(!$result->execute([ ':id'=>$departmentId ])){
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
