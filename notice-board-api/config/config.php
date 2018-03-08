<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/4/18
 * Time: 9:50 PM
 */

global $details;
$details=array();

$details['host'] = getenv('DB_HOST');
$details['username'] = getenv('DB_USERNAME');
$details['password'] = getenv('DB_PASS');
$details['database'] = getenv('DB_NAME');
