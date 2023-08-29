<?php
include 'openConn.php';

$depart     = $_GET['d'];

$sql = "SELECT * FROM depart WHERE name='$depart' AND id_otdel>0";

// $result = $conn->query($sql);

include 'closeConn.php';
