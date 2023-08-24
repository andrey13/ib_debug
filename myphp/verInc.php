<?php
include 'openConn.php';

$table = $_GET['t'];
$key = $_GET['k'];

$sql = "SELECT id FROM version AS v WHERE v.table='$table' AND v.key=$key";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $sql = "UPDATE version SET ver=ver+1 WHERE table='$table' AND key=$key";
} else {
    $sql = "INSERT INTO version (table, key, ver) VALUES ('$table', $key, 1)";
}

$result = $conn->query($sql);
   
if (!$result) {
     echo $sql;
     echo "\r\n\r\n";
     echo($conn->error);
     return;
 }

 if ($result->num_rows > 0) {
     $outp = $result->fetch_all(MYSQLI_ASSOC);
     echo json_encode($outp);
 } else { echo "[]"; }
 
 $conn = null;
?>