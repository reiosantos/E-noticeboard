<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/19/18
 * Time: 11:18 PM
 */

class Stores
{
	private $handle;

	/**
	 * Stores constructor.
	 */
	public function __construct()
	{
		$this->handle = Connection::getConnection();
	}

	/**
	 * @return array|bool
	 */
	public function getStores(){
		$stores_list = array();
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$stores = $this->handle->prepare("SELECT * FROM stores ORDER BY store_name ASC ");
			if($stores->execute([])){

				if($stores->rowCount() < 1){ return false; }

				foreach ($stores->fetchAll() as $row) {
					$temp = [
						'id' => $row['id'],
						'store_name' => $row['store_name'],
					];
					array_push($stores_list, $temp);
				}
				return $stores_list;
			}
			$this->handle->commit();

		}catch (PDOException $e){
			$this->handle->rollBack();
			return false;
		}
		return false;
	}

	/**
	 * @param $name
	 * @return bool
	 */
	public function insertStore($name){
		if ($this->handle == null) return false;

		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$insert = $this->handle->prepare("INSERT INTO stores(store_name) VALUES(:store)");
			if(!$insert->execute(
				[':store' => $name,]
			)){
				$this->handle->rollBack();
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
	 * @param $storeId
	 * @return bool
	 */
	public function deleteStore($storeId){
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$result = $this->handle->prepare("DELETE FROM stores WHERE id=:id" );

			if(!$result->execute([ ':id'=>$storeId ])){
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