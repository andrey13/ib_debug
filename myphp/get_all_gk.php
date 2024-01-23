<?php
include 'openConn.php';

$sql = 
"SELECT g.*, v.name AS vendor_name, u.name AS executor_name
FROM goskontrakt AS g 
LEFT JOIN vendor AS v ON v.id=g.id_vendor
LEFT JOIN user AS u ON u.id=g.id_user_executor
ORDER BY g.date_gk";

include 'closeConn.php';