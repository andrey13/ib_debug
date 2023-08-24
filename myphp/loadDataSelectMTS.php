<?php
include 'openConn.php';
$sono = $_GET['s'];
$id_otdel = $_GET['o'];

$sql = "SELECT * FROM mts WHERE id_otdel=$id_otdel";

$result = $conn->query($sql);

if (!$result) {
    echo $sql;
    echo "\r\n\r\n";
    echo ($conn->error);
    return;
}

if ($result->num_rows > 0) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($outp);
} else {
    echo "[]";
}

$conn = null;
?>