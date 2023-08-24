<?php    
    include 'openConn.php';

    $table = $_GET['t'];
    
    $sql = "INSERT INTO $table VALUES ()";
    
    if ($conn->query($sql) === TRUE) {
        $id = mysqli_insert_id($conn);
        echo $id;
    } 
    else {
        echo "Error: ".$sql."->".$conn->error."\r\n";
    }
    
    $conn = null;
?>