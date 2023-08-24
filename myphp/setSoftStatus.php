<?php    
    include 'openConn.php';
    $id_soft   = $_GET['id_soft'];
    $id_status = $_GET['id_status'];
    $soft_name = $_GET['soft_name'];

    $sql = "UPDATE soft SET id_status=$id_status WHERE id=$id_soft";

    if ($conn->query($sql) === TRUE) { echo $sql."->OK"; } 
    else { echo "Error: ".$sql."->".$conn->error; }

    $conn = null;
?>