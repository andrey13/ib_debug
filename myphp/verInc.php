<?php
include 'openConn.php';

$table_name = $_GET['t'];
$id_key = $_GET['k'];
$name_key = $_GET['n'];

$sql = "SELECT * FROM version WHERE table_name='$table_name' AND id_key=$id_key AND name_key='$name_key'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $sql = "UPDATE version SET ver=ver+1 WHERE table_name='$table_name' AND id_key=$id_key AND name_key='$name_key'";
} else {
    $sql = "INSERT INTO version (table_name, id_key, name_key, ver) VALUES ('$table_name', $id_key, '$name_key',1)";
}

$result = $conn->query($sql);
   
if (!$result) {
     echo $sql;
     echo "\r\n\r\n";
     echo($conn->error);
     return;
 }

echo "[]";

 $conn = null;
?>