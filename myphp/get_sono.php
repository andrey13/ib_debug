<?php

include 'openConn.php';
    
$mask = $_GET['m'];

$sql = "SELECT sono FROM lvs WHERE ip LIKE '$mask'";
$sql = "SELECT i.sono FROM lvs AS l LEFT JOIN torm AS t ON l.id_torm=t.id LEFT JOIN ifns AS i ON t.id_co=i.id WHERE l.ip LIKE '10.161.152.0'";
$sql = "SELECT i.sono FROM lvs AS l LEFT JOIN torm AS t ON l.id_torm=t.id LEFT JOIN ifns AS i ON t.id_co=i.id WHERE l.ip LIKE '$mask'";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
    //$outp = $result->fetch_all(MYSQLI_ASSOC);
    //echo json_encode($outp);
    $row = $result->fetch_assoc();
    echo $row["sono"];
} else { echo "9999"; }

$conn = null;
?>