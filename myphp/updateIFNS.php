<?php    
    include 'openConn.php';
    $postData     = file_get_contents('php://input');
    $data         = json_decode($postData, true);
    
    $id           = $data["id"];
    $sono         = $data["sono"];
    $name         = $data["name"];

    $sql="UPDATE ifns SET sono='$sono',name='$name' WHERE id=$id";

    if ($conn->query($sql) === TRUE) {echo "OK: ".$sql."\r\n";} 
    else {echo "Error: ".$sql."->".$conn->error."\r\n";}
  
    $conn = null;
?>