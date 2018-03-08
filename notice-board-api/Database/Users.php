<?php

/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/6/18
 * Time: 3:38 PM
 */


class Users
{
	private $handle;

	/**
	 * Users constructor.
	 */
	public function __construct()
	{
		$this->handle = Connection::getConnection();
    $this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}

    /**
     * @param $username
     * @param $pass
     * @return array|bool
     * @throws Exception
     */
	public function login($username, $pass){
		try{
			$this->handle->beginTransaction();

			if(trim($pass) !== "12345"){
        $admin = $this->handle->prepare("SELECT * FROM admin WHERE (email=:email AND hash_pass=:pass)");
        if(!$admin->execute([':email'=>$username, ':pass'=>Users::hashPassword($pass)])){
          return false;
        }else{
          if($admin->rowCount() < 1){ return false; }

          $row = $admin->fetch(PDO::FETCH_ASSOC);
          $user = [
            'id' => $row['admin_id'],
            'name' => $row['full_name'],
            'registration_no' => "",
            'student_no' => "",
            'student_programme_name' => "",
            'student_programme_code' => "",
            'email' => $row['email'],
            'contact' => $row['contact'],
            'office_no' => "",
            'user_type' => 'admin',
            'is_student' => false,
            'is_lecturer' => false,
            'is_admin' => true,
            'token' => $this->generateToken(),
          ];
          return $user;
        }
      }


      $lecturer = $this->handle->prepare("SELECT * FROM lecturers a, rooms c WHERE 
(lecturer_office_id_fk=c.room_id AND lecturer_email=:email)");

      if(!$lecturer->execute([':email'=>$username])){
        return false;
      }else{
        if($lecturer->rowCount() < 1){

          $student = $this->handle->prepare("SELECT a.*, b.programme_code, b.programme_name FROM students a LEFT OUTER JOIN 
programmes b ON a.programme_id_fk=b.programme_id WHERE (registration_no=:username OR student_no=:username)");

          if(!$student->execute([':username'=>$username])){
            return false;
          }else{
            if($student->rowCount() < 1){

              return false;
            }else{
              $row = $student->fetch(PDO::FETCH_ASSOC);
              $user = [
                'id' => $row['student_id'],
                'name' => $row['student_name'],
                'registration_no' => $row['registration_no'],
                'student_no' => $row['student_no'],
                'student_programme_name' => $row['programme_name'],
                'student_programme_code' => $row['programme_code'],
                'student_programme_id' => $row['programme_id_fk'],
                'email' => '',
                'contact' => '',
                'office_no' => "",
                'user_type' => 'student',
                'is_student' => true,
                'is_lecturer' => false,
                'is_admin' => false,
                'token' => $this->generateToken(),
              ];
            }
          }
        }else{
          $row = $lecturer->fetch(PDO::FETCH_ASSOC);
          $user = [
            'id' => $row['lecturer_id'],
            'name' => $row['first_name'] . " ". $row['last_name'],
            'registration_no' => "",
            'student_no' => "",
            'student_programme_name' => "",
            'student_programme_code' => "",
            'email' => $row['lecturer_email'],
            'contact' => $row['lecturer_contact'],
            'office_no' => $row['room_no'],
            'user_type' => 'lecturer',
            'is_student' => false,
            'is_lecturer' => true,
            'is_admin' => false,
            'token' => $this->generateToken(),
          ];
        }
      }

			$this->handle->commit();
      return $user;

		}catch (PDOException $e){
			$this->handle->rollBack();
			return false;
		}
	}

	/**
	 * @param $pass
	 * @return bool|string
	 */
	public static function hashPassword($pass){
		return md5(sha1($pass));
	}

    /**
     * @return int|string
     * @throws Exception
     */
	private function generateToken() {
        try {
            // for php 5.3+
            if (function_exists('mcrypt_create_iv')){
                return bin2hex(mcrypt_create_iv(32, MCRYPT_DEV_URANDOM));
            }else{
                return bin2hex(openssl_random_pseudo_bytes(32));
            }
        } catch (Exception $e) {
            return bin2hex(random_bytes(32)); //for php 7+
        }
		// return mb_convert_encoding(rand(100000, 900000),'UTF-8', 'UTF-8');
	}
}
