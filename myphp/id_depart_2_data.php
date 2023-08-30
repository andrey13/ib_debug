<?php

include 'openConn.php';
    
$id_depart = $_GET['i'];

$sql = "SELECT * FROM depart WHERE id=$id_depart";

include 'closeConn.php';