<?php

include 'openConn.php';

$tb = $_GET['t'];
$id = $_GET['i'];

$sql = "SELECT * FROM $tb WHERE id=$id";

include 'closeConn.php';