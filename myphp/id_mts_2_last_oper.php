<?php
include 'openConn.php';

$id_mts = $_GET['m'];

$sql = 
"SELECT zm.id_mts, zm.id_zayavka, zm.id_user, z.date 
FROM zayavka2mts AS zm 
LEFT JOIN zayavka AS z ON z.id=zm.id_zayavka 
WHERE id_mts=$id_mts
ORDER BY z.date desc
limit 1";

include 'closeConn.php';
?>