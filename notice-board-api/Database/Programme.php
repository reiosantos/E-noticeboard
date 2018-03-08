<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 3/24/18
 * Time: 1:36 PM
 */

class Programme
{
  private $handle;

  /**
   * programmes constructor.
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
  public function getProgrammes(){
    $programmes_list = array();
    try{
      $this->handle->beginTransaction();

      $programmes = $this->handle->prepare("SELECT a.*, b.* FROM programmes a, departments b WHERE (a.department_id_fk=b.department_id) ORDER BY programme_name ASC ");

      if($programmes->execute()){

        if($programmes->rowCount() < 1){ return false; }

        foreach ($programmes->fetchAll() as $row) {
          $temp = [
            'id' => $row['programme_id'],
            'name' => $row['programme_name'],
            'code' => $row['programme_code'],
            'department_name' => $row['department_name'],
            'department_head' => $row['department_head'],
            'department_id' => $row['department_id'],
          ];
          array_push($programmes_list, $temp);
        }
      }
      $this->handle->commit();

      return $programmes_list;

    }catch (PDOException $e){
      $this->handle->rollBack();
      return false;
    }
  }

  /**
   * @param $programme
   * @return bool
   */
  public function updateInsertProgrammes($programme){
    try{
      $this->handle->beginTransaction();

      if (isset($programme['id'])){
        $update = $this->handle->prepare("UPDATE programmes SET programme_name=:programme_name,
 programme_code=:programme_code, department_id_fk=:d_id WHERE programme_id=:id");
        if(!$update->execute(
          [
            ':id' => $programme['id'],
            ':programme_name' => $programme['name'],
            ':programme_code' => $programme['code'],
            ':d_id' => $programme['department_id'],
          ]
        )){
          return false;
        }
      }else{
        $insert = $this->handle->prepare("INSERT INTO programmes(programme_name, programme_code, department_id_fk)
 VALUES(:programme_name, :programme_code, :d_id)");
        if(!$insert->execute(
          [
            ':programme_name' => $programme['name'],
            ':programme_code' => $programme['code'],
            ':d_id' => $programme['department_id'],
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
   * @param $programmeId
   * @return bool
   */
  public function deleteProgramme($programmeId){
    try{
      $this->handle->beginTransaction();

      $result = $this->handle->prepare("DELETE FROM programmes WHERE programme_id=:id" );

      if(!$result->execute([ ':id'=>$programmeId ])){
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
