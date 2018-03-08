<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 3/24/18
 * Time: 9:33 PM
 */

class Admin
{
  private $handle;

  /**
   * admins constructor.
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
  public function getAdmins(){
    $admins_list = array();
    try{
      $this->handle->beginTransaction();

      $admins = $this->handle->prepare("SELECT * FROM admin ORDER BY full_name ASC, email ASC ");

      if($admins->execute()){

        if($admins->rowCount() < 1){ return false; }

        foreach ($admins->fetchAll() as $row) {
          $temp = [
            'id' => $row['admin_id'],
            'full_name' => $row['full_name'],
            'email' => $row['email'],
            'contact' => $row['contact'],
            'password' => $row['plain'],
          ];
          array_push($admins_list, $temp);
        }
      }
      $this->handle->commit();

      return $admins_list;

    }catch (PDOException $e){
      $this->handle->rollBack();
      return false;
    }
  }

  /**
   * @param $admin
   * @return bool
   */
  public function updateInsertAdmins($admin){
    try{
      $this->handle->beginTransaction();
      if (isset($admin['id'])){
        $update = $this->handle->prepare("UPDATE admin SET full_name=:fname, email=:email,
contact=:contact, hash_pass=:pass, plain=:plain WHERE admin_id=:id");
        if(!$update->execute(
          [
            ':id' => $admin['id'],
            'fname' => $admin['full_name'],
            'email' => $admin['email'],
            'contact' => $admin['contact'],
            'pass' => Users::hashPassword($admin['password']),
            'plain' => $admin['password'],
          ]
        )){
          return false;
        }
      }else{
        $insert = $this->handle->prepare("INSERT INTO admin(full_name, email, contact, hash_pass, plain) VALUES(:fname, :email, :contact, :pass, :plain)");

        if(!$insert->execute([
          ':fname' => $admin['full_name'],
          'email' => $admin['email'],
          'contact' => $admin['contact'],
          'pass' => Users::hashPassword($admin['password']),
          'plain' => $admin['password'],
        ])){
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
   * @param $adminId
   * @return bool
   */
  public function deleteAdmin($adminId){
    try{
      $this->handle->beginTransaction();

      $result = $this->handle->prepare("DELETE FROM admin WHERE admin_id=:id" );

      if(!$result->execute([ ':id'=>$adminId ])){
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
