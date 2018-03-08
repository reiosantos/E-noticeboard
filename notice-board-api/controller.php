<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/4/18
 * Time: 10:55 PM
 */

require 'config/wsdl.php';
require 'autoload.php';

//ini_set('display_errors', 1);
//error_reporting(E_ALL);

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
        if ($_GET['action'] == "download"){

            $data = isset($_GET['object']) ? $_GET['object'] : false;
            if ($data){
                $data = validateObject($data);
                if ($data['file'] === "timetable"){

                    $result = "uploads/timetables/".$data['file_name'];
                    if (file_exists($result)) {
                        header('Content-Description: File Transfer');
                        header('Content-Type: application/force-download');
                        header('Content-Disposition: attachment; filename='.basename($result));
                        header('Content-Transfer-Encoding: binary');
                        header('Expires: 0');
                        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                        header('Pragma: public');
                        header('Content-Length: ' . filesize($result));
                        ob_clean();
                        flush();
                        readfile($result);
                        @unlink($result);
                        //echo json_encode(['error'=> false, 'data'=>true]);
                    }else{
                        echo json_encode(['error'=> false, 'data'=>false]);
                    }
                }else{
                    echo json_encode(['error'=> false, 'data'=>false]);
                }
            }else{
                echo json_encode(['error'=> false, 'data'=>false]);
            }

        }

        else if($_GET['action'] ==  "load"){

            if (isset($_GET['table'])){

                $user = isset($_GET['user']) ? $_GET['user'] : false;
                if ($user){
                    $user = validateObject($user);
                }

                if ($_GET['table'] == 'departments'){
                    echo json_encode(['error'=> false, 'data'=>$db->departments->getDepartments()]);

                }else if ($_GET['table'] == 'programmes'){
                    echo json_encode(['error'=> false, 'data'=>$db->programmes->getProgrammes()]);

                }else if ($_GET['table'] == 'courses'){
                    echo json_encode(['error'=> false, 'data'=>$db->courses->getCourses($user)]);

                }else if ($_GET['table'] == 'rooms'){
                    echo json_encode(['error'=> false, 'data'=>$db->rooms->getRooms()]);

                }else if ($_GET['table'] == 'lecturers'){
                    echo json_encode(['error'=> false, 'data'=>$db->lecturers->getLecturers()]);

                }else if ($_GET['table'] == 'students'){
                    echo json_encode(['error'=> false, 'data'=>$db->students->getStudents($user)]);

                }else if ($_GET['table'] == 'admins'){
                    echo json_encode(['error'=> false, 'data'=>$db->admins->getAdmins()]);

                }else if ($_GET['table'] == 'notices'){
                    $urgent = isset($_GET['urgent']) ? boolval($_GET['urgent']) : false;
                    $times = isset($_GET['archives']) ? true : false;
                    echo json_encode(['error'=> false, 'data'=>$db->notices->getNotices($user, $urgent, $times)]);

                }else if ($_GET['table'] == 'timetables'){
                    echo json_encode(['error'=> false, 'data'=>$db->timetables->getTimeTables($user)]);

                }else if ($_GET['table'] == 'events'){
                    $shots = isset($_GET['archives']) ? true : false;
                    echo json_encode(['error'=> false, 'data'=>$db->events->getUpshots($shots)]);

                }else if ($_GET['table'] == 'summary'){
                    echo json_encode(['error'=> false, 'data'=>$db->main->getMainSummary()]);

                }else{ echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']); }

            }else{ echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']); }

        }
        else if($_GET['action'] ==  "delete"){

            $id = isset($_GET['id']) ? $_GET['id']: null;

            if($id == null) {
                echo json_encode(['error'=>'Request is missing a parameter. Please follow the correct steps.']);
            } else {
                $id = cleanData($id);

                if( cleanId($id) < 1){
                    echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']);
                }else{

                    if (isset($_GET['table'])){
                        if ($_GET['table'] == 'departments'){
                            echo json_encode(['error'=> false, 'data'=>$db->departments->deleteDepartment($id)]);

                        }else if ($_GET['table'] == 'programmes'){
                            echo json_encode(['error'=> false, 'data'=>$db->programmes->deleteProgramme($id)]);

                        }else if ($_GET['table'] == 'courses'){
                            echo json_encode(['error'=> false, 'data'=>$db->courses->deleteCourse($id)]);

                        }else if ($_GET['table'] == 'rooms'){
                            echo json_encode(['error'=> false, 'data'=>$db->rooms->deleteRoom($id)]);

                        }else if ($_GET['table'] == 'lecturers'){
                            echo json_encode(['error'=> false, 'data'=>$db->lecturers->deleteLecturer($id)]);

                        }else if ($_GET['table'] == 'students'){
                            echo json_encode(['error'=> false, 'data'=>$db->students->deleteStudent($id)]);

                        }else if ($_GET['table'] == 'admins'){
                            echo json_encode(['error'=> false, 'data'=>$db->admins->deleteAdmin($id)]);

                        }else if ($_GET['table'] == 'notices'){
                            echo json_encode(['error'=> false, 'data'=>$db->notices->deleteNotice($id)]);

                        }else if ($_GET['table'] == 'timetables'){
                            echo json_encode(['error'=> false, 'data'=>$db->timetables->deleteTimeTable($id)]);

                        }else if ($_GET['table'] == 'events'){
                            echo json_encode(['error'=> false, 'data'=>$db->events->deleteUpshot($id)]);

                        }else{ echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']); }

                    }else { echo json_encode(['error'=>'Request parameter value is corrupted. Please refresh and try again.']); }
                }
            }
        }
    }

    else if(isset($_POST['action'])) {

        if($_POST['action'] ==  "login") {
            $username = isset($_POST['username']) ? $_POST['username']: null;
            $pass = isset($_POST['password']) ? $_POST['password']: null;

            if ($username == null){
                echo json_encode(['error'=>'Please Fill all the fields and submit.']);
            }else{
                try {
                    echo json_encode(['error' => false, 'data' => $db->users->login(cleanData($username), cleanData($pass))]);
                } catch (Exception $e) {
                    echo json_encode(['error'=>'Invalid user details.']);
                }
            }
        }
        elseif($_POST['action'] ==  "insertOrUpdate"){

            if (isset($_POST['table'])){
                if ($_POST['table'] == 'departments'){

                    $department = isset($_POST['department']) ? $_POST['department']: null;
                    if($department == null){
                        echo json_encode(['error'=>'No Department Item received.']);
                    }else{
                        $department = validateObject($department);
                        if($department){
                            echo json_encode(['error'=> false, 'data'=>$db->departments->updateInsertDepartments($department)]);
                        }else{
                            echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
                        }
                    }

                }else if ($_POST['table'] == 'programmes'){

                    $programme = isset($_POST['programme']) ? $_POST['programme']: null;
                    if($programme == null){
                        echo json_encode(['error'=>'No programme data received.']);
                    }else{
                        $programme = validateObject($programme);
                        if($programme){
                            echo json_encode(['error'=> false, 'data'=>$db->programmes->updateInsertProgrammes($programme)]);
                        }else{
                            echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
                        }
                    }

                }else if ($_POST['table'] == 'courses'){

                    $course = isset($_POST['course']) ? $_POST['course']: null;
                    if($course == null){
                        echo json_encode(['error'=>'No course data received.']);
                    }else{
                        $course = validateObject($course);
                        if($course){
                            echo json_encode(['error'=> false, 'data'=>$db->courses->updateInsertCourses($course)]);
                        }else{
                            echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
                        }
                    }

                }else if ($_POST['table'] == 'rooms'){

                    $room= isset($_POST['room']) ? $_POST['room']: null;
                    if($room == null){
                        echo json_encode(['error'=>'No room received.']);
                    }else{
                        $room = validateObject($room);
                        if($room){
                            echo json_encode(['error'=> false, 'data'=>$db->rooms->updateInsertRooms($room)]);
                        }else{
                            echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
                        }
                    }

                }else if ($_POST['table'] == 'lecturers'){

                    $lecturer= isset($_POST['lecturer']) ? $_POST['lecturer']: null;
                    if($lecturer == null){
                        echo json_encode(['error'=>'No data received.']);
                    }else{
                        $lecturer = validateObject($lecturer);
                        if($lecturer){
                            echo json_encode(['error'=> false, 'data'=>$db->lecturers->updateInsertLecturers($lecturer)]);
                        }else{
                            echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
                        }
                    }

                }else if ($_POST['table'] == 'students'){

                    $student= isset($_POST['student']) ? $_POST['student']: null;
                    if($student == null){
                        echo json_encode(['error'=>'No data received.']);
                    }else{
                        $student = validateObject($student);
                        if($student){
                            echo json_encode(['error'=> false, 'data'=>$db->students->updateInsertStudents($student)]);
                        }else{
                            echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
                        }
                    }

                }else if ($_POST['table'] == 'admins'){

                    $admin= isset($_POST['admin']) ? $_POST['admin']: null;
                    if($admin == null){
                        echo json_encode(['error'=>'No data received.']);
                    }else{
                        $admin = validateObject($admin);
                        if($admin){
                            echo json_encode(['error'=> false, 'data'=>$db->admins->updateInsertAdmins($admin)]);
                        }else{
                            echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
                        }
                    }

                }else if ($_POST['table'] == 'notices'){

                    $notice= isset($_POST['notice']) ? $_POST['notice']: null;
                    if($notice == null){
                        echo json_encode(['error'=>'No data received.']);
                    }else{
                        $notice = validateObject($notice);
                        if($notice){
                            echo json_encode(['error'=> false, 'data'=>$db->notices->updateInsertNotices($notice)]);
                        }else{
                            echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
                        }
                    }

                }else if ($_POST['table'] == 'timetables'){

                    $timetable = isset($_POST['timetable']) ? $_POST['timetable']: null;
                    if($timetable == null){
                        echo json_encode(['error'=>'No data received.']);
                    }else{
                        $object = json_decode($timetable, true);
                        $file = $object["file"];
                        $timetable = validateObject($timetable);
                        $result = uploadFile($file, $timetable["file_name"], "timetables");
                        if ($result){
                            if($timetable){
                                echo json_encode(['error'=> false, 'data'=>$db->timetables->updateInsertTimeTables($timetable)]);
                            }else{
                                echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
                            }
                        }else{ echo json_encode(['error'=>'Unable to upload file... make sure your file is not corrupt']); }

                    }
                }else if ($_POST['table'] == 'events'){

                    $event = isset($_POST['event']) ? $_POST['event']: null;
                    if($event == null){
                        echo json_encode(['error'=>'No data received.']);
                    }else{
                        $object = json_decode($event, true);
                        $event = validateObject($event);
                        $file = $object["file"];

                        $result = true;
                        if(trim($file) !== ""){
                            $result = uploadFile($file, $event["file_name"], "events");
                        }
                        if ($result){
                            if($event){
                                echo json_encode(['error'=> false, 'data'=>$db->events->updateInsertUpshots($event)]);
                            }else{
                                echo json_encode(['error'=>'Wrong Data has been submitted. Verify your data']);
                            }
                        }else{ echo json_encode(['error'=>'Unable to upload file... make sure your file is not corrupt']); }

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
    if (is_null($obj) || $obj === null || $obj === 'null'){
        return false;
    }
    if (is_bool($obj)){
        return $obj;
    }
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


/**
 * @param $encodedFile
 * @param $file_name
 * @param $location
 * @return bool
 */
function uploadFile($encodedFile, $file_name, $location){
    $encodedFile = explode(",", $encodedFile, 2);
    $file = base64_decode($encodedFile[1]);
    if($file){
        if(file_put_contents("uploads/" . $location . "/" . $file_name, $file)){
            return true;
        }
    }
    return false;
}
