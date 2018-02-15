<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/14/18
 * Time: 9:15 AM
 */

class Comments
{
	private $handle;

	/**
	 * Comments constructor.
	 */
	public function __construct()
	{
		$this->handle = Connection::getConnection();
		if($this->handle == null){
			return null;
		}
	}

	/**
	 * @return array|bool
	 */
	public function getComments(){
		if ($this->handle == null) return false;

		$comments_list = array();
		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$comments = $this->handle->prepare("SELECT * FROM comments ORDER BY comment_date DESC");

			if(!$comments->execute([])){ return false;}

			if($comments->rowCount() < 1){ return false; }

			foreach ($comments->fetchAll() as $row) {
				$temp = [
					'id' => $row['id'],
					'comment' => $row['comment'],
					'comment_date' => $row['comment_date'],
				];
				array_push($comments_list, $temp);
			}
			$this->handle->commit();

		}catch (PDOException $e){
			$this->handle->rollBack();
			return false;
		}
		return $comments_list;
	}

	/**
	 * @param $comment
	 * @return bool
	 */
	public function insertComment($comment){
		if ($this->handle == null) return false;

		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$insert = $this->handle->prepare("INSERT INTO comments(comment) VALUES(:comment)");
			if(!$insert->execute(
				[
					':comment' => $comment,
				]
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
	 * @param $commentId
	 * @return bool
	 */
	public function deleteComment($commentId){
		if ($this->handle == null) return false;

		try{
			$this->handle->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->handle->beginTransaction();

			$result = $this->handle->prepare("DELETE FROM comments WHERE id=:id" );
			if(!$result->execute([ ':id'=>$commentId ])){
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