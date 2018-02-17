<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/4/18
 * Time: 10:55 PM
 */

require 'config/wsdl.php';
require 'autoload.php';

ini_set('display_errors', 1);
error_reporting(E_ALL);

$request = json_decode(file_get_contents("php://input"), true);
if($request){
	foreach ($request as $key=>$val){
		$_POST[$key] = $val;
	}
}

$db= new Database();

if ($db == null){

	echo json_encode(['error'=>'Unable to connect to database. Please consult the administrator.']);

}

else{

	if(isset($_GET['action'])) {

		if($_GET['action'] ==  "load"){
			if (isset($_GET['table'])){

				if ($_GET['table'] == 'users'){
					echo json_encode(['error'=> false, 'data'=>$db->users->getUsers()]);

				}else if ($_GET['table'] == 'sales'){
					echo json_encode(['error'=> false, 'data'=>$db->sales->getSales($_GET['store'])]);

				}else if ($_GET['table'] == 'products'){
					echo json_encode(['error'=> false, 'data'=>$db->products->getProducts($_GET['store'])]);

				}else if ($_GET['table'] == 'comments'){
					echo json_encode(['error'=> false, 'data'=>$db->comments->getComments()]);

				}else if ($_GET['table'] == 'stores'){
					echo json_encode(['error'=> false, 'data'=>$db->stores->getStores()]);

				}else{ echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']); }

			}else{ echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']); }

		}else if($_GET['action'] ==  "delete"){

			$id = isset($_GET['id']) ? $_GET['id']: null;

			if($id == null) {
				echo json_encode(['error'=>'Request is missing a parameter. Please follow the correct steps.']);
			} else {
				$id = cleanData($id);

				if( cleanId($id) < 1){
					echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']);
				}else{

					if (isset($_GET['table'])){
						if ($_GET['table'] == 'users'){
							echo json_encode(['error'=> false, 'data'=>$db->users->deleteUser($id)]);

						}else if ($_GET['table'] == 'sales'){
							echo json_encode(['error'=> false, 'data'=>$db->sales->deleteSale($id)]);

						}else if ($_GET['table'] == 'comments'){
							echo json_encode(['error'=> false, 'data'=>$db->comments->deleteComment($id)]);

						}else if ($_GET['table'] == 'stores'){
							echo json_encode(['error'=> false, 'data'=>$db->stores->deleteStore($id)]);

						}else if ($_GET['table'] == 'products'){
							echo json_encode(['error'=> false, 'data'=>$db->products->deleteProduct($id)]);

						}else{ echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']); }

					}else { echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']); }
				}
			}
		}
	}

	else if(isset($_POST['action'])) {

		if($_POST['action'] ==  "login") {
			$username = isset($_POST['username']) ? $_POST['username']: null;

			if ($username == null){
				echo json_encode(['error'=>'Please Fill all the fields and submit.']);
			}else{
				echo json_encode(['error'=> false, 'data' => $db->users->login(cleanData($username))]);
			}
		}
		elseif ($_POST['action'] ==  "saveComment"){
			$comment = isset($_POST['comment']) ? $_POST['comment']: null;
			if($comment == null){
				echo json_encode(['error'=>'No comment received.']);
			}else{
				echo json_encode(['error'=> false, 'data'=>$db->comments->insertComment(cleanData($comment))]);
			}
		}
		elseif ($_POST['action'] ==  "saveStore"){
			$store_name = isset($_POST['store']) ? $_POST['store']: null;
			if($store_name == null){
				echo json_encode(['error'=>'No store data received.']);
			}else{
				echo json_encode(['error'=> false, 'data'=>$db->stores->insertStore($store_name)]);
			}
		}
		elseif($_POST['action'] ==  "insertOrUpdate"){

			if (isset($_POST['table'])){
				if ($_POST['table'] == 'users'){

					$user = isset($_POST['user']) ? $_POST['user']: null;
					if($user == null){

						$userId = isset($_POST['user_id']) ? $_POST['user_id']: null;
						$userPassword = isset($_POST['user_password']) ? $_POST['user_password']: null;
						if ($userId != null && $userPassword != null){
							if(cleanId($userId) < 1){
								echo json_encode(['error'=>'Received data corrupted. Please refresh and re-submit']);
							}else{
								echo json_encode(['error'=> false, 'data'=>$db->users->updateUserPassword($userId, $userPassword)]);
							}
						}else{
							echo json_encode(['error'=>'Received data is Missing.']);
						}

					}else{
						$user = validateObject($user);
						if($user){
							echo json_encode(['error'=> false, 'data'=>$db->users->updateInsertUser($user)]);
						}else{
							echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
						}
					}
				}else if ($_POST['table'] == 'sales'){

					$sale = isset($_POST['sale']) ? $_POST['sale']: null;
					if($sale == null){
						echo json_encode(['error'=>'No Sold Item received.']);
					}else{
						$sale = validateObject($sale);
						if($sale){
							echo json_encode(['error'=> false, 'data'=>$db->sales->updateInsertSales($sale)]);
						}else{
							echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
						}
					}

				}else if ($_POST['table'] == 'products'){

					$product = isset($_POST['product']) ? $_POST['product']: null;
					if($product == null){
						echo json_encode(['error'=>'No Product received.']);
					}else{
						$product = validateObject($product);
						if($product){
							echo json_encode(['error'=> false, 'data'=>$db->products->updateInsertProducts($product)]);
						}else{
							echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
						}
					}

				}else{ echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']); }

			}else { echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']); }

		}else { echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']); }

	}

	else{ echo json_encode(['error'=>'Request Method is not understood.']); }
}

/**
 * @param $data
 * @return string
 */
function cleanData($data){
	$data = htmlentities(htmlspecialchars($data), ENT_QUOTES);
	return $data;
}

/**
 * @param $id
 * @return int
 */
function cleanId($id){
	return preg_match_all('/^(\d+)$/', $id);
}

/**
 * @param $obj
 * @return array|bool
 */
function validateObject($obj){
	$temp = [];
	$object = json_decode($obj, true);

	if (isset($object['id'])){
		if( cleanId($object['id']) < 1){
			return false;
		}
	}
	foreach ($object as $key=>$val){
		$temp[$key] = cleanData($val);
	}
	return $temp;
}
