<?php    
    include 'openConn.php';
    $postData     = file_get_contents('php://input');
    $data         = json_decode($postData, true);
    
    $id           = $data["id"];
    $id_co        = $data["id_co"];
    $sono         = $data["sono"];
    $ekp          = $data["ekp"];
    $sono_torm    = $data["sono_torm"];
    $name         = $data["name"];

    $sql="UPDATE torm SET id_co=$id_co, sono='$sono', ekp='$ekp', sono_torm='$sono_torm', name='$name' WHERE id=$id";

    if ($conn->query($sql) === TRUE) {echo "OK: ".$sql."\r\n";} 
    else {echo "Error: ".$sql."->".$conn->error."\r\n";}
  
    $conn = null;
?>