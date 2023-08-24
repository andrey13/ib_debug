<?php
include 'openConn.php';

$id_user = $_GET['id'];

$sql = "SELECT u.id, g.name, g.role, gu.id_group
        FROM user AS u
        LEFT JOIN group_user AS gu ON gu.id_user = u.id
        LEFT JOIN group_of_users AS g ON g.id = gu.id_group 
        WHERE u.id =  $id_user";

include 'closeConn.php';
?>