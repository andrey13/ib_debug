<?php
include 'openConn.php';

$id_taxonomy = $_GET['t'];

$sql = "SELECT * FROM types WHERE id_taxonomy=$id_taxonomy ORDER BY code";

include 'closeConn.php';
?>