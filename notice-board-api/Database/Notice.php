<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 3/25/18
 * Time: 1:51 PM
 */

class Notice
{
    private $handle;

    /**
     * notices constructor.
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
     * @param $user
     * @param bool $urgent
     * @param bool $archives
     * @return array|bool
     */
    public function getNotices($user=false, $urgent=false, $archives=false){
        $notices_list = array();
        try{
            $this->handle->beginTransaction();

            if ($user && !boolval($user['is_admin']) && !boolval($user['is_lecturer'])){

                $notices = $this->handle->prepare("SELECT notices.*, programmes.* FROM notices LEFT JOIN programmes 
ON notices.programme_id_fk=programme_id WHERE programme_id='" . $user['student_programme_id'] . "') ORDER BY post_date DESC, notice_title ASC ");

                if ($urgent){
                    $notices = $this->handle->prepare("SELECT notices.*, programmes.* FROM notices LEFT JOIN programmes 
ON notices.programme_id_fk=programme_id WHERE (level='urgent' AND ( DATE(post_date) > SUBDATE(CURRENT_DATE, 2)) AND programme_id='" . $user['student_programme_id'] . "') ORDER BY post_date DESC, notice_title ASC ");
                }

            }else{
                $notices = $this->handle->prepare("SELECT notices.*, programmes.* FROM notices LEFT JOIN programmes ON notices.programme_id_fk=programme_id
ORDER BY post_date DESC, notice_title ASC ");
                if ($urgent){
                    $notices = $this->handle->prepare("SELECT notices.*, programmes.* FROM notices LEFT JOIN programmes ON notices.programme_id_fk=programme_id
WHERE (level='urgent' AND DATE(post_date) > SUBDATE(CURRENT_DATE, 2)) ORDER BY post_date DESC, notice_title ASC ");
                }

            }

            if($notices->execute()){

                if($notices->rowCount() < 1){ return false; }

                $two_weeks_ago = date("Y-m-d", strtotime("-2 week", strtotime(date("Y-m-d"))));
                foreach ($notices->fetchAll() as $row) {

                    $date = date_create($row['post_date'])->format("Y-m-d");
                    if ($archives){

                        if (strtotime($date) <= strtotime($two_weeks_ago)){
                            $temp = [
                                'id' => $row['notice_id'],
                                'post_date' => $row['post_date'],
                                'title' => $row['notice_title'],
                                'posted_by' => $row['posted_by'],
                                'description' => $row['description'],
                                'programme_code' => intval($row['programme_id_fk'], 10) != 0 ? $row['programme_code'] : 'All',
                                'programme_name' => intval($row['programme_id_fk'], 10) != 0 ? $row['programme_name'] : 'All',
                                'programme_id' => $row['programme_id_fk'],
                                'level' => $row['level'],
                                'category' => $row['category'],
                            ];
                            array_push($notices_list, $temp);
                        }
                    }else{
                        if (strtotime($date) > strtotime($two_weeks_ago)){
                            $temp = [
                                'id' => $row['notice_id'],
                                'post_date' => $row['post_date'],
                                'title' => $row['notice_title'],
                                'posted_by' => $row['posted_by'],
                                'description' => $row['description'],
                                'programme_code' => intval($row['programme_id_fk'], 10) != 0 ? $row['programme_code'] : 'All',
                                'programme_name' => intval($row['programme_id_fk'], 10) != 0 ? $row['programme_name'] : 'All',
                                'programme_id' => $row['programme_id_fk'],
                                'level' => $row['level'],
                                'category' => $row['category'],
                            ];
                            array_push($notices_list, $temp);
                        }
                    }
                }
            }
            $this->handle->commit();
            return $notices_list;

        }catch (PDOException $e){
            $this->handle->rollBack();
            return false;
        }
    }

    /**
     * @param $notice
     * @return bool
     */
    public function updateInsertNotices($notice){
        try{
            $this->handle->beginTransaction();

            if (isset($notice['id'])){
                $update = $this->handle->prepare("UPDATE notices SET level=:levels, notice_title=:title,
 post_date=:post_date, description=:description, category=:category, post_date=:posted_by, programme_id_fk=:programme_id WHERE notice_id=:id");
                if(!$update->execute(
                    [
                        ':id' => $notice['id'],
                        'post_date' => $notice['post_date'],
                        'title' => $notice['title'],
                        'posted_by' => $notice['posted_by'],
                        'description' => $notice['description'],
                        'programme_id' => $notice['programme_id'],
                        'levels' => $notice['level'],
                        'category' => $notice['category']
                    ]
                )){
                    return false;
                }
            }else{
                $insert = $this->handle->prepare("INSERT INTO notices(notice_title, post_date, description, posted_by, programme_id_fk, level, category)
 VALUES(:title, :post_date, :description, :posted_by, :programme_id, :levels, :category)");
                if(!$insert->execute(
                    [
                        'post_date' => $notice['post_date'],
                        'title' => $notice['title'],
                        'posted_by' => $notice['posted_by'],
                        'description' => $notice['description'],
                        'programme_id' => $notice['programme_id'],
                        'levels' => $notice['level'],
                        'category' => $notice['category']
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
     * @param $noticeId
     * @return bool
     */
    public function deleteNotice($noticeId){
        try{
            $this->handle->beginTransaction();

            $result = $this->handle->prepare("DELETE FROM notices WHERE notice_id=:id" );

            if(!$result->execute([ ':id'=>$noticeId ])){
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
