<?php
include 'openConn.php';

$id_depart     = $_GET['d'];

$sql = "SELECT * FROM user WHERE title='начальник отдела' AND id_depart=$id_depart";

$result = $conn->query($sql);

include 'closeConn.php';
