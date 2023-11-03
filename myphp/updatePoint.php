<?php    
    include 'openConn.php';
    $postData     = file_get_contents('php://input');
    $data         = json_decode($postData, true);
    
    $id           = $data["id"];
    $id_torm      = $data["id_torm"];
    $ip           = $data["ip"];
    $mask         = $data["mask"];
    $stock        = $data["stock"];

    $sql="UPDATE connect_point SET ip='$ip', mask='$mask', stock=$stock WHERE id=$id";

    if ($conn->query($sql) === TRUE) {echo "OK: ".$sql."\r\n";} 
    else {echo "Error: ".$sql."->".$conn->error."\r\n";}
  
    $conn = null;
?>