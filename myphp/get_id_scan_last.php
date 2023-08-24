<?php
include 'openConn.php';  

$sql="SELECT * FROM maxscan WHERE name=(SELECT MAX(name) from maxscan)";
$result = $conn->query($sql);
$row = $result->fetch_assoc();
$maxname = $row["name"];
$id_scan = $row["id"];
echo $id_scan;

$conn = null;

?>