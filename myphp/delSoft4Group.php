<?php    
    include 'openConn.php';
    $id_soft   = $_GET['id_soft'];
    $id_prog   = $_GET['id_prog'];
    $name_soft = $_GET['name_soft'];

    $sql = "UPDATE soft SET id_prog=0 WHERE id=$id_soft";

    if ($conn->query($sql) === TRUE) { echo $sql."->OK"; } 
    else { echo "Error: ".$sql."->".$conn->error; }

    $conn = null;
?>