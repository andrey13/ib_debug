<?php    
    include 'openConn.php';
    $postData     = file_get_contents('php://input');
    $data         = json_decode($postData, true);
    
    $id           = $data["id"];
    $name         = $data["name"];
    $otss         = $data["otss"];
    $license      = $data["license"];

    $sql="UPDATE prog SET name='$name',otss='$otss',license='$license' WHERE id=$id";

    if ($conn->query($sql) === TRUE) {echo "OK: ".$sql."\r\n";} 
    else {echo "Error: ".$sql."->".$conn->error."\r\n";}
  
    $conn = null;
?>