<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 3/24/18
 * Time: 3:15 PM
 */

class Rooms
{
  private $handle;

  /**
   * rooms constructor.
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
  public function getRooms(){
    $rooms_list = array();
    try{
      $this->handle->beginTransaction();

      $rooms = $this->handle->prepare("SELECT * FROM rooms ORDER BY block_no ASC ");

      if($rooms->execute()){

        if($rooms->rowCount() < 1){ return false; }

        foreach ($rooms->fetchAll() as $row) {
          $temp = [
            'id' => $row['room_id'],
            'number' => $row['room_no'],
            'level' => $row['room_level'],
            'block' => $row['block_no'],
          ];
          array_push($rooms_list, $temp);
        }
      }
      $this->handle->commit();

      return $rooms_list;

    }catch (PDOException $e){
      $this->handle->rollBack();
      return false;
    }
  }

  /**
   * @param $room
   * @return bool
   */
  public function updateInsertRooms($room){
    try{
      $this->handle->beginTransaction();

      if (isset($room['id'])){
        $update = $this->handle->prepare("UPDATE rooms SET room_no=:room_no, room_level=:room_level,
 block_no=:block_no WHERE room_id=:id");
        if(!$update->execute(
          [
            ':id' => $room['id'],
            ':room_no' => $room['number'],
            ':room_level' => $room['level'],
            ':block_no' => $room['block'],
          ]
        )){
          return false;
        }
      }else{
        $insert = $this->handle->prepare("INSERT INTO rooms(room_no, room_level, block_no)
 VALUES(:room_no, :room_level, :block_no)");
        if(!$insert->execute(
          [
            ':room_no' => $room['number'],
            ':room_level' => $room['level'],
            ':block_no' => $room['block'],
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
   * @param $roomId
   * @return bool
   */
  public function deleteRoom($roomId){
    try{
      $this->handle->beginTransaction();

      $result = $this->handle->prepare("DELETE FROM rooms WHERE room_id=:id" );

      if(!$result->execute([ ':id'=>$roomId ])){
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

