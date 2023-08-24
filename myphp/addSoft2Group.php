<?php    
    include 'openConn.php';
    $id_soft   = $_GET['id_soft'];
    $id_prog   = $_GET['id_prog'];
    $name_soft = $_GET['name_soft'];

    $sql = "UPDATE soft SET id_prog=$id_prog WHERE id=$id_soft";

    if ($conn->query($sql) === TRUE) { echo $sql."->OK"; } 
    else { echo "Error: ".$sql."->".$conn->error; }

    $sql = "UPDATE prog SET name='$name_soft' WHERE id=$id_prog AND name=''";

    if ($conn->query($sql) === TRUE) { echo $sql."->OK"; } 
    else { echo "Error: ".$sql."->".$conn->error; }

    $conn = null;
?>