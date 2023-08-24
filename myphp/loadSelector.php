<?php    
    include 'openConn.php';
    
    $table = $_GET['t'];
    $sql   = "SELECT name FROM $table ORDER BY name";
    $outp  = "{";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $outp = $outp.'"'.$row["name"].'":"'.$row["name"].'",';
        }
    }
    $outp  = $outp."}";
    $outp  = str_replace(",}","}",$outp);
    echo $outp;
    
    $conn = null;
?>