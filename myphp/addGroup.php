<?php    
    include 'openConn.php';
  
    $sql = "INSERT INTO prog (id_co) VALUES ($id_co)";

    if ($conn->query($sql) === TRUE) {echo "OK: ".$sql."\r\n";} 
    else {echo "Error: ".$sql."->".$conn->error."\r\n";}
    
    $conn = null;
?>