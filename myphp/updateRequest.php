<?php    
    include 'openConn.php';
    $postData     = file_get_contents('php://input');
    $data         = json_decode($postData, true);
    $id_vulner    = $data['id_vulner'];
    $sono         = $data['sono'];
    $id_scan      = $data['id_scan'];
    $numb         = $data['numb'];
    $date         = $data['date'];
    $done         = $data['done'];
    $comment      = $data['comment'];
    $set          = "";

    //echo var_dump($data);

    $sql1 = "SELECT * FROM request WHERE sono='$sono' AND id_scan=$id_scan AND id_vulner=$id_vulner";
    $result1 = $conn->query($sql1);

    if ($result1->num_rows > 0) {
        $sql2 = "UPDATE request SET numb='$numb', date='$date', done=$done, comment='$comment' WHERE sono='$sono' AND id_scan=$id_scan AND id_vulner=$id_vulner";
        if ($conn->query($sql2) === TRUE) {echo "OK: ".$sql2."\r\n";} 
        else {echo "Error: ".$sql2."->".$conn->error."\r\n";}
    } else { 
        $sql3 = "INSERT INTO request (sono, id_scan, id_vulner, numb, date, done, comment) VALUES ('$sono', $id_scan, $id_vulner, '$numb', '$date', $done, '$comment')";
        if ($conn->query($sql3) === TRUE) {echo "OK: ".$sql3."\r\n";} 
        else {echo "Error: ".$sql3."->".$conn->error."\r\n";}
    }
  
    $conn = null;
?>