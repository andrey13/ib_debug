<?php    
    include 'openConn.php';
    
    $table = $_GET['t'];
    $order = $_GET['o'];

    $sql = "SELECT * FROM $table ORDER BY $order";

    include 'closeConn.php';
?>