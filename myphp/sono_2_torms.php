<?php    
    include 'openConn.php';

    $sono  = $_GET['s'];  

    if ($sono == '6100' or $sono == '6199') {
        $sql = "SELECT * FROM torm ORDER BY sono, sono_torm";
    } else {
        $sql = "SELECT * FROM torm WHERE sono = '$sono' ORDER BY sono, sono_torm";
    }

    include 'closeConn.php';