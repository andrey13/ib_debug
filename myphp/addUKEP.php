<?php   
    include 'openConn.php';

    $sono = $_GET['s'];
    $date = $_GET['d'];
    
    $sql = "INSERT INTO signature (sono, date) VALUES ('$sono', '$date')";
    
    if ($conn->query($sql) === TRUE) {
        $id = mysqli_insert_id($conn);
        echo $id;
    } 
    else {
        echo "Error: ".$sql."->".$conn->error."\r\n";
    }
    
    $conn = null;
?>