<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/6/18
 * Time: 3:39 PM
 */


class Sales
{
	private $handle;

	/**
	 * Sales constructor.
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
	public function getSales($store_id){
		if ($this->handle == null) return false;

		$sales_list = array();
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$sales = $this->handle->prepare("SELECT sales.id,
sales.product_id, sale_date, sale_price, sale_quantity, profit, total_price, item_name, item_price, 
available_quantity, last_purchase_date, last_purchase_quantity, users.store_id, store_name, user_id
FROM sales, products, users, stores WHERE (sales.product_id = products.id AND sales.user_id = users.id
 AND users.store_id = stores.id AND stores.id=:store_id) ORDER BY sale_date DESC ");

			if(!$sales->execute([
				':store_id'=>$store_id,
			])){ $this->handle->rollBack(); return false;}

			if($sales->rowCount() < 1){ $this->handle->rollBack(); return false; }

			foreach ($sales->fetchAll() as $row) {

				$index = date_parse($row['sale_date']);

				$index = $index['year'] . '-' . $index['month'] . '-' . $index['day'];

				if(!isset($sales_list[$index])){
					$sales_list[$index] = [];
				}
				$temp = [
					'id' => $row['id'],
					'product_id' => $row['product_id'],
					'sale_date' => $row['sale_date'],
					'sale_price' => $row['sale_price'],
					'sale_quantity' => $row['sale_quantity'],
					'profit' => $row['profit'],
					'total_price' => $row['total_price'],
					'item_name' => $row['item_name'],
					'store_id' => $row['store_id'],
					'user_id' => $row['user_id'],
					'store_name' => $row['store_name'],
				];
				array_push($sales_list[$index], $temp);
			}
			$this->handle->commit();

		}catch (PDOException $e){
			$this->handle->rollBack();
			return false;
		}
		return $sales_list;
	}

	/**
	 * @param $sales
	 * @return bool
	 */
	public function updateInsertSales($sales){
		if ($this->handle == null) return false;

		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			if (isset($sales['id'])){
				$update = $this->handle->prepare("UPDATE sales SET product_id=:product_id, sale_price=:sale_price,
 sale_date=:sale_date, sale_quantity=:sale_quantity, profit=:profit, total_price=:total_price, user_id=:user_id WHERE id=:id");
				if(!$update->execute(
					[
						':id' => $sales['id'],
						':product_id' => $sales['product_id'],
						':sale_price' => $sales['sale_price'],
						':sale_quantity' => $sales['sale_quantity'],
						':profit' => $sales['profit'],
						':total_price' => $sales['total_price'],
						':sale_date' => $sales['sale_date'],
						':user_id' => $sales['user_id'],
					]
				)){
					$this->handle->rollBack();
					return false;
				}
				$insert_up = $this->handle->prepare("UPDATE products SET available_quantity=(available_quantity + :aq) WHERE id=:id");
				if(!$insert_up->execute([
						':id' => $sales['product_id'],
						':aq' => $sales['sale_quantity']
					]
				)){
					$this->handle->rollBack();
					return false;
				}
			}else{
				$insert = $this->handle->prepare("INSERT INTO sales(product_id, sale_price, sale_date, sale_quantity, profit, total_price, user_id)
 VALUES(:product_id, :sale_price, :sale_date, :sale_quantity, :profit, :total_price, :user_id)");
				if(!$insert->execute(
					[
						':product_id' => $sales['product_id'],
						':sale_price' => $sales['sale_price'],
						':sale_quantity' => $sales['sale_quantity'],
						':profit' => $sales['profit'],
						':total_price' => $sales['total_price'],
						':sale_date' => $sales['sale_date'],
						':user_id' => $sales['user_id'],
					]
				)){
					$this->handle->rollBack();
					return false;
				}
				$insert_up = $this->handle->prepare("UPDATE products SET available_quantity=(available_quantity - :aq) WHERE id=:id");
				if(!$insert_up->execute([
					':id' => $sales['product_id'],
					':aq' => $sales['sale_quantity']
					]
				)){
					$this->handle->rollBack();
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
	 * @param $saleId
	 * @return bool
	 */
	public function deleteSale($saleId){
		if ($this->handle == null) return false;

		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$result_update = $this->handle->prepare("SELECT product_id, sale_quantity FROM sales WHERE id=:id" );
			if(!$result_update->execute([ ':id'=>$saleId ])){
				return false;
			}
			$row = $result_update->fetch(PDO::FETCH_ASSOC);
			$result_update1 = $this->handle->prepare("UPDATE products SET available_quantity=(available_quantity - :aq) WHERE id=:id" );
			if(!$result_update1->execute([
				':aq'=>$row['sale_quantity'],
				':id'=>$row['product_id'] ])){
				return false;
			}
			$result = $this->handle->prepare("DELETE FROM sales WHERE id=:id" );
			if(!$result->execute([ ':id'=>$saleId ])){
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