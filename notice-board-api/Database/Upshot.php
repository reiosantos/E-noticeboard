<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 3/26/18
 * Time: 12:28 AM
 */

class Upshot
{
    private $handle;

    /**
     * upshots constructor.
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
     * @param bool $archives
     * @return array|bool
     */
    public function getUpshots($archives=false){
        $upshots_list = array();
        try{
            $this->handle->beginTransaction();

            if ($archives){
                $upshots = $this->handle->prepare("SELECT * FROM events_upshots WHERE (DATE(event_date) < CURRENT_DATE) ORDER BY post_date DESC, event_date ASC ");
            }else{
                $upshots = $this->handle->prepare("SELECT * FROM events_upshots WHERE (DATE(event_date) > SUBDATE(CURRENT_DATE, 1)) ORDER BY post_date DESC, event_date ASC ");
            }

            if($upshots->execute()){

                if($upshots->rowCount() < 1){ return false; }

                foreach ($upshots->fetchAll() as $row) {
                    $temp = [
                        'id' => $row['event_id'],
                        'title' => $row['event_subtitle'],
                        'subtitle' => $row['event_title'],
                        'file_name' => $row['file_name'],
                        'file' => $this->downloadFile($row['file_name'], "events"),
                        'post_date' => $row['post_date'],
                        'posted_by' => $row['posted_by'],
                        'event_date' => $row['event_date'],
                        'description' => $row['description'],
                    ];
                    array_push($upshots_list, $temp);
                }
            }
            $this->handle->commit();

            return $upshots_list;

        }catch (PDOException $e){
            $this->handle->rollBack();
            return false;
        }
    }

    /**
     * @param $upshot
     * @return bool
     */
    public function updateInsertUpshots($upshot){
        try{
            $this->handle->beginTransaction();

            if (isset($upshot['id'])){
                $update = $this->handle->prepare("UPDATE events_upshots SET event_title=:title,
 event_subtitle=:subtitle, event_date=:event_date, description=:description, posted_by=:posted_by, file_name=:file_name, post_date=:post_date WHERE event_id=:id");
                if(!$update->execute(
                    [
                        'id' => $upshot['event_id'],
                        'title' => $upshot['subtitle'],
                        'subtitle' => $upshot['title'],
                        'file_name' => $upshot['file_name'],
                        'post_date' => $upshot['post_date'],
                        'posted_by' => $upshot['posted_by'],
                        'event_date' => $upshot['event_date'],
                        'description' => $upshot['description'],
                    ]
                )){
                    return false;
                }
            }else{
                $insert = $this->handle->prepare("INSERT INTO events_upshots(event_date, event_title, event_subtitle, description, post_date, posted_by, file_name)
 VALUES(:event_date, :title, :subtitle, :description, :post_date, :posted_by, :file_name)");
                if(!$insert->execute(
                    [
                        'title' => $upshot['subtitle'],
                        'subtitle' => $upshot['title'],
                        'file_name' => $upshot['file_name'],
                        'post_date' => $upshot['post_date'],
                        'posted_by' => $upshot['posted_by'],
                        'event_date' => $upshot['event_date'],
                        'description' => $upshot['description'],
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
     * @param $upshotId
     * @return bool
     */
    public function deleteUpshot($upshotId){
        try{
            $this->handle->beginTransaction();

            $result = $this->handle->prepare("DELETE FROM events_upshots WHERE event_id=:id" );

            if(!$result->execute([ ':id'=>$upshotId ])){
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
     * @param $file_name
     * @param $location
     * @return string
     */
    function downloadFile($file_name, $location){
        $path = "uploads/" . $location. "/" . $file_name;
        if (file_exists($path)){
            $data = file_get_contents($path);
            return base64_encode($data);
        }
        return false;
    }
}
