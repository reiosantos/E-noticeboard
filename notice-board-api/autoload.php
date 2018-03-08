<?php
/**
 * Created by PhpStorm.
 * User: reiosantos
 * Date: 1/6/18
 * Time: 5:28 PM
 */

require 'vendor/autoload.php';
$env = Dotenv\Dotenv::create(__DIR__);
$env->load();

spl_autoload_register(function ($class_name){
	include 'Database/'. $class_name . '.php';
});
