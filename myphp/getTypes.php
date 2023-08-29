<?php
include 'openConn.php';

$taxonomy = $_GET['t'];

$sql = "SELECT * FROM taxonomy WHERE name='$taxonomy'";

$result = $conn->query($sql);

if (!$result) {
    echo $sql;
    echo "\r\n\r\n";
    echo($conn->error);
    $conn = null;
    return;
}

if ($result->num_rows > 0) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    $id_taxonomy = $outp[0]["id"];  
} else { 
    echo "[]"; 
    $conn = null;
    return;
}

// echo "\n\rid_taxonomy = ".$id_taxonomy;

$sql = "SELECT * FROM types WHERE id_taxonomy=$id_taxonomy";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($outp);
} else { echo "[]"; }

$conn = null;
