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
	}

	/**
	 * @return array|bool
	 */
	public function getUsers(){
		$users_list = array();
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$users = $this->handle->prepare("SELECT a.*, b.store_name FROM users a  LEFT OUTER JOIN stores b ON a.store_id=b.id ORDER BY first_name ASC, last_name ASC ");
			if($users->execute([])){

				if($users->rowCount() < 1){ return false; }

				foreach ($users->fetchAll() as $row) {
					$temp = [
						'id' => $row['id'],
						'first_name' => $row['first_name'],
						'last_name' => $row['last_name'],
						'contact' => $row['contact'],
						'email' => $row['email'],
						'date_registered' => $row['date_registered'],
						'is_admin' => boolval($row['is_admin']),
						'password' => $row['plain_password'],
						'store_id' => $row['store_id'],
						'store_name' => $row['store_name'],
						'token' => $this->generateToken(),
					];
					array_push($users_list, $temp);
				}
				return $users_list;
			}
			$this->handle->commit();

		}catch (PDOException $e){
			$this->handle->rollBack();
			return false;
		}
		return false;
	}

	/**
	 * @param $user
	 * @return bool
	 */
	public function updateInsertUser($user){
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			if (isset($user['id']) && $user['id'] != null){
				$update = $this->handle->prepare("UPDATE users SET password=:pass, plain_password=:plain, first_name=:fname, last_name=:lname, contact=:contact, email=:email, is_admin=:is_admin, store_id=:store_id WHERE id=:id");
				if(!$update->execute(
					[
						':fname'=>$user['first_name'],
						':lname'=>$user['last_name'],
						':contact'=>$user['contact'],
						':email'=>$user['email'],
						':is_admin'=>$user['is_admin'],
						':pass'=>$this->hashPassword($user['password']),
						':plain'=>$user['password'],
						'store_id' => $user['store_id'],
						':id'=>$user['id'],
					]
				)){
					return false;
				}
			}else{
				$insert = $this->handle->prepare("INSERT INTO users(first_name, last_name, contact, email, password, plain_password, is_admin, store_id) VALUES(:fname, :lname, :contact, :email, :password, :plain, :is_admin, :store_id)");
				if(!$insert->execute(
					[
						':fname'=>$user['first_name'],
						':lname'=>$user['last_name'],
						':contact'=>$user['contact'],
						':email'=>$user['email'],
						':password'=> $this->hashPassword($user['password']),
						':plain'=> $user['password'],
						'store_id' => $user['store_id'],
						':is_admin'=>$user['is_admin'],
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
	 * @param $userId
	 * @param $password
	 * @return bool
	 */
	public function updateUserPassword($userId, $password){
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$result = $this->handle->prepare(
				"UPDATE users SET password=:password WHERE id=:id"
			);
			if(!$result->execute([
					':password'=> $this->hashPassword($password),
					':id'=>$userId,
				]
			)){
				return false;
			}

			$this->handle->commit();

		}catch (PDOException $e){
			$this->handle->rollBack();
			return false;
		}
		return true;
	}

	/**
	 * @param $userId
	 * @return bool
	 */
	public function deleteUser($userId){
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$result = $this->handle->prepare("DELETE FROM users WHERE id=:id" );

			if(!$result->execute([ ':id'=>$userId ])){
				return false;
			}
			$this->handle->commit();

		}catch (PDOException $e){
			$this->handle->rollBack();
			return false;
		}
		return true;
	}

	/**
	 * @param $username
	 * @return array|bool
	 */
	public function login($username){
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$users = $this->handle->prepare("SELECT a.*, b.course_code, b.course_name FROM users a LEFT OUTER JOIN 
courses b ON a.course_id_fk=b.course_id WHERE (registration_no=:username OR student_no=:username)");
			if($users->execute([
				':username'=>$username,
			])){

				if($users->rowCount() < 1){ return false; }

				$row = $users->fetch(PDO::FETCH_ASSOC);

				$ret = [
					'id' => $row['user_id'],
					'name' => $row['first_name'] . $row['last_name'],
					'registration_no' => $row['registration_no'],
					'student_no' => $row['student_no'],
					'student_course_name' => boolval($row['course_name']),
					'student_course_code' => boolval($row['course_code']),
					'user_type' => 'student',
					'token' => $this->generateToken(),
				];
				return $ret;
			}
			$this->handle->commit();

		}catch (PDOException $e){
			$this->handle->rollBack();
			return false;
		}
		return false;
	}

	/**
	 * @param $pass
	 * @return bool|string
	 */
	private function hashPassword($pass){
		//return password_hash($pass, PASSWORD_DEFAULT);
		return md5(sha1($pass));
	}

	/**
	 * @return int|string
	 */
	private function generateToken() {
        try {
            return bin2hex(random_bytes(32)); //for php 7+
        } catch (Exception $e) {
            // for php 5.3+
            if (function_exists('mcrypt_create_iv')){
                return bin2hex(mcrypt_create_iv(32, MCRYPT_DEV_URANDOM));
            }else{
                return bin2hex(openssl_random_pseudo_bytes(32));
            }
        }
		// return mb_convert_encoding(rand(100000, 900000),'UTF-8', 'UTF-8');
	}
}
