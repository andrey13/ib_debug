<?php    
    include 'openConn.php';
    $postData     = file_get_contents('php://input');
    $data         = json_decode($postData, true);

    $id           = $data["id"];
    $id_torm      = $data["id_torm"];
    $ip           = $data["ip"];
    $mask         = $data["mask"];
    $nbit         = $data["nbit"];
    $comment      = $data["comment"];
    $gw           = $data["gw"];
    $id_lvs_type  = $data["id_lvs_type"];

    $sql="UPDATE lvs SET id_torm=$id_torm,ip='$ip',comment='$comment',mask='$mask',nbit=$nbit,gw='$gw',id_lvs_type=$id_lvs_type WHERE id=$id";

    if ($conn->query($sql) === TRUE) {echo "OK: ".$sql."\r\n";} 
    else {echo "Error: ".$sql."->".$conn->error."\r\n";}
  
    $conn = null;
?>