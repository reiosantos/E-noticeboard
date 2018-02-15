<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/4/18
 * Time: 10:30 PM
 */


class Database
{
	public $users;
	public $sales;
	public $products;
	public $comments;
	public $stores;

	public function __construct()
	{
		$this->users = new Users();
		$this->sales = new Sales();
		$this->products = new Products();
		$this->comments = new Comments();
		$this->stores = new Stores();

		if ($this->users==null || $this->comments==null || $this->stores==null ||
			$this->sales==null || $this->products==null){
			return null;
		}
	}

}