<?php

include 'openConn.php';

$tb = $_GET['t'];
$id = $_GET['i'];

$sql = "SELECT * FROM $tb WHERE id=$id";

// echo $tb . "\n\r";
// echo $id . "\n\r";
// echo $sql;

include 'closeConn.php';