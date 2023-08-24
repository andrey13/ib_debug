<?php    
    include 'openConn.php';
    $postData     = file_get_contents('php://input');
    $data         = json_decode($postData, true);
    $id           = $data['id'];
    $table        = $data['mysql_table'];
    $set          = ""; 

    //echo var_dump($data);

    foreach($data as $f => $v) {
        if ($f=="id" or $f=="mysql_table") continue;

        if ($set=="") {
            $set = $set.$f."=";
        } else {
            $set = $set.",".$f."=";
        }
        if (gettype($v)=="integer") {
            $set = $set.$v;
        } else {
            $set = $set."'".$v."'";
        }
    }

    $sql="UPDATE $table SET $set WHERE id=$id";

    if ($conn->query($sql) === TRUE) {echo "OK: ".$sql."\r\n";} 
    else {echo "Error: ".$sql."->".$conn->error."\r\n";}
  
    $conn = null;
?>