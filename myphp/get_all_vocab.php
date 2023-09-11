<?php
include 'openConn.php';

$table = $_GET['t'];
$sort  = $_GET['s'];
$ok    = $_GET['o'];
$sono  = $_GET['n'];

$sql = "SELECT * FROM $table ";

if ($sono != '' && $ok != -1) {
    $sql = $sql . "WHERE sono='$sono' AND ok=$ok ";
}

if ($sono == '' && $ok != -1) {
    $sql = $sql . "WHERE ok=$ok ";
}

if ($sono != '' && $ok == -1) {
    $sql = $sql . "WHERE sono='$sono' ";
}

$sql = $sql . "ORDER By $sort";

//echo $sql;

$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($outp);
} else {
    echo "[]";
}

$conn = null;
