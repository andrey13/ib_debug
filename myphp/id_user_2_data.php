<?php

include 'openConn.php';
    
$id_user = $_GET['u'];

$sql = "SELECT user.*,
            depart.id_otdel,
            depart.name AS depart 
        FROM user LEFT JOIN depart ON depart.id = user.id_depart
        WHERE user.id=$id_user";

include 'closeConn.php';