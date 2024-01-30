<?php
include 'openConn.php';

$stock = $_GET['s'];

// $id_otdel = $_GET['o'];
// $sklad = $_GET['k'];
// $id_type_oper = $_GET['t'];

// $sql = "SELECT 
//     p.*,
//     i.sono AS ifns_sono,
//     t.sono AS torm_sono
//     FROM connect_point AS p 
//     LEFT JOIN torm AS t ON t.id=p.id_torm
//     LEFT JOIN ifns AS i ON i.id=t.id_co
//     ORDER By ifns_sono,p.ip ";


$sql = "SELECT 
    p.*,
    t.sono AS ifns_sono,
    t.sono_torm AS torm_sono,
    t.name AS torm_name
    FROM connect_point AS p 
    LEFT JOIN torm AS t ON t.id=p.id_torm
    WHERE p.stock = $stock
    ORDER By ifns_sono,p.ip ";

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