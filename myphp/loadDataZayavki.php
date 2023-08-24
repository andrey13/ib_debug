<?php
include 'openConn.php';

$id_depart = $_GET['d'];

$sql = "SELECT z.id, 
            z.id_type,
            z.id_user,
            z.id_user_it,
            z.id_user_ib,
            z.id_depart,
            z.date,
            t.name AS type,
            u1.name AS user,
            u2.name AS user_it,
            u3.name AS user_ib,
            d.name AS depart,
            z.comment
        FROM zayavka AS z
        LEFT JOIN types AS t ON t.id = z.id_type
        LEFT JOIN user AS u1 ON u1.id = z.id_user
        LEFT JOIN user AS u2 ON u1.id = z.id_user_it
        LEFT JOIN user AS u3 ON u1.id = z.id_user_ib
        LEFT JOIN depart AS d ON d.id = z.id_depart        
        WHERE z.id_depart = $id_depart
        ORDER BY z.id DESC";

include 'closeConn.php';
