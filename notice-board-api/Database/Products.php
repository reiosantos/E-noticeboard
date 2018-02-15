<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/6/18
 * Time: 3:39 PM
 */


class Products
{
	private $handle;

	/**
	 * Products constructor.
	 */
	public function __construct()
	{
		$this->handle = Connection::getConnection();
		if($this->handle == null){
			return null;
		}
	}

	/**
	 * @param $store_id
	 * @return array|bool
	 */
	public function getProducts($store_id){
		$products_list = array();
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$products = $this->handle->prepare("SELECT * FROM products WHERE store_id=:store_id ORDER BY item_name ASC ");

			if($products->execute([
				'store_id'=>$store_id,
			])){

				if($products->rowCount() < 1){ return false; }

				foreach ($products->fetchAll() as $row) {
					$temp = [
						'id' => $row['id'],
						'item_name' => $row['item_name'],
						'item_price' => $row['item_price'],
						'available_quantity' => $row['available_quantity'],
						'last_purchase_quantity' => $row['last_purchase_quantity'],
						'last_purchase_date' => $row['last_purchase_date'],
					];
					array_push($products_list, $temp);
				}
				return $products_list;
			}
			$this->handle->commit();

		}catch (PDOException $e){
			$this->handle->rollBack();
			return false;
		}
		return false;
	}

	/**
	 * @param $product
	 * @return bool
	 */
	public function updateInsertProducts($product){
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			if (isset($product['id'])){
				$update = $this->handle->prepare("UPDATE products SET item_name=:item_name, item_price=:item_price, store_id=:store_id,
 available_quantity=(available_quantity + :last_purchase_quantity), last_purchase_quantity=:last_purchase_quantity, last_purchase_date=:last_purchase_date WHERE id=:id");
				if(!$update->execute(
					[
						':id' => $product['id'],
						':item_name' => $product['item_name'],
						':item_price' => $product['item_price'],
						// ':available_quantity' => $product['available_quantity'],
						':last_purchase_quantity' => $product['last_purchase_quantity'],
						':last_purchase_date' => $product['last_purchase_date'],
						':store_id' => $product['store_id'],
					]
				)){
					return false;
				}
			}else{
				$insert = $this->handle->prepare("INSERT INTO products(item_name, item_price, available_quantity, last_purchase_quantity, store_id)
 VALUES(:item_name, :item_price, :last_purchase_quantity, :last_purchase_quantity, :store_id)");
				if(!$insert->execute(
					[
						':item_name' => $product['item_name'],
						':item_price' => $product['item_price'],
						':last_purchase_quantity' => $product['last_purchase_quantity'],
						':store_id' => $product['store_id'],
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
	 * @param $productId
	 * @return bool
	 */
	public function deleteProduct($productId){
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$result = $this->handle->prepare("DELETE FROM products WHERE id=:id" );

			if(!$result->execute([ ':id'=>$productId ])){
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