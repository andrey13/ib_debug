<?php
include 'openConn.php';

$table = $_GET['t'];
$sort  = $_GET['s'];
$ok    = $_GET['o'];

if ($ok == -1) {
    $sql = "SELECT * FROM $table ORDER By $sort";
} else {
    $sql = "SELECT * FROM $table WHERE ok=$ok ORDER By $sort";
}

//echo $sql;

$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($outp);
} else {
    echo "[]";
}

$conn = null;
