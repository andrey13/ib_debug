<?php

include 'openConn.php';
    
$account = $_GET['a'];

$sql = "SELECT 
            user.id,
            user.sono,
            user.name,
            user.telephone,
            user.id_depart,
            depart.id_otdel,
            depart.name AS depart 
        FROM user LEFT JOIN depart ON depart.id = user.id_depart
        WHERE account='$account'";

$result = $conn->query($sql);

//if ($result->num_rows > 0) {
//    $row = $result->fetch_assoc();
//    echo $row["id"];
//} else { echo "0"; }

if ($result->num_rows > 0) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($outp);
} else { echo "[]"; }


$conn = null;
?>