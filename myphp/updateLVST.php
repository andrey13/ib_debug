<?php    
    include 'openConn.php';
    $postData = file_get_contents('php://input');
    $data     = json_decode($postData, true);
    $id       = $data["id"];
    $name     = $data["name"];
    $descr    = $data["descr"];
    $color    = $data["color"];

    $sql="UPDATE lvs_type SET name='$name', descr='$descr', color='$color' WHERE id=$id";

    if ($conn->query($sql) === TRUE) {echo "OK: ".$sql."\r\n";} 
    else {echo "Error: ".$sql."->".$conn->error."\r\n";}
  
    $conn = null;
?>