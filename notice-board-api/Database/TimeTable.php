<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 3/25/18
 * Time: 8:44 PM
 */

class TimeTable
{
    private $handle;

    /**
     * timeTables constructor.
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
     * @return array|bool
     */
    public function getTimeTables($user){
        $timeTables_list = array();
        try{
            $this->handle->beginTransaction();
            if ($user && boolval($user['is_student'])){
                $timeTables = $this->handle->prepare("SELECT * FROM time_tables, programmes WHERE  programme_id=? AND 
        programme_id_fk=programmes.programme_id ORDER BY year ASC, programme_code ASC ");
                $data = [$user['student_programme_id']];
            }else{
                $timeTables = $this->handle->prepare("SELECT * FROM time_tables, programmes WHERE programme_id_fk=programmes.programme_id ORDER BY year ASC, programme_code ASC ");
                $data = [];
            }

            if($timeTables->execute($data)){

                if($timeTables->rowCount() < 1){ return false; }

                foreach ($timeTables->fetchAll() as $row) {
                    $temp = [
                        'id' => $row['time_table_id'],
                        'year' => $row['year'],
                        'semester' => $row['semester'],
                        'file_name' => $row['file_name'],
                        'file' => $this->downloadFile($row['file_name'], "timetables"),
                        'post_date' => $row['post_date'],
                        'programme_id' => $row['programme_id'],
                        'programme_code' => $row['programme_code'],
                        'programme_name' => $row['programme_name'],
                    ];
                    array_push($timeTables_list, $temp);
                }
            }
            $this->handle->commit();

            return $timeTables_list;

        }catch (PDOException $e){
            $this->handle->rollBack();
            return false;
        }
    }

    /**
     * @param $timeTable
     * @return bool
     */
    public function updateInsertTimeTables($timeTable){
        try{
            $this->handle->beginTransaction();

            if (isset($timeTable['id'])){
                $update = $this->handle->prepare("UPDATE time_tables SET year=:year,
 semester=:semester, file_name=:file_name, post_date=:post_date, programme_id_fk=:pid WHERE time_table_id=:id");
                if(!$update->execute(
                    [
                        'id' => $timeTable['id'],
                        'year' => $timeTable['year'],
                        'semester' => $timeTable['semester'],
                        'file_name' => $timeTable['file_name'],
                        'post_date' => $timeTable['post_date'],
                        'pid' => $timeTable['programme_id'],
                    ]
                )){
                    return false;
                }
            }else{
                $insert = $this->handle->prepare("INSERT INTO time_tables(year, semester, file_name, post_date, programme_id_fk)
 VALUES(:year, :semester, :file_name, :post_date, :pid)");
                if(!$insert->execute(
                    [
                        'year' => $timeTable['year'],
                        'semester' => $timeTable['semester'],
                        'file_name' => $timeTable['file_name'],
                        'post_date' => $timeTable['post_date'],
                        'pid' => $timeTable['programme_id'],
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
     * @param $timeTableId
     * @return bool
     */
    public function deleteTimeTable($timeTableId){
        try{
            $this->handle->beginTransaction();

            $result = $this->handle->prepare("DELETE FROM time_tables WHERE time_table_id=:id" );

            if(!$result->execute([ ':id'=>$timeTableId ])){
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
