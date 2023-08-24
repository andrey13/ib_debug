<?php    
    include 'openConn.php';
    $postData     = file_get_contents('php://input');
    $data         = json_decode($postData, true);
    
    $id           = $data["id"];
    $maxreestr    = $data["maxreestr"];
    $id_category  = $data["id_category"];
    //if ($maxreestr == "")   $maxreestr= "0";
    //if ($id_category == "") $id_category= "0";

    $sql="UPDATE comp SET maxreestr=$maxreestr,id_category=$id_category WHERE id=$id";

    if ($conn->query($sql) === TRUE) {echo "OK: ".$sql."\r\n";} 
    else {echo "Error: ".$sql."->".$conn->error."\r\n";}
  
    $conn = null;
?>