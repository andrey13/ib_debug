<?php    
    include 'openConn.php';
    $sono = $_GET['s'];
    $ifns=$sono;
   

    $sql = "SELECT * FROM user WHERE sono LIKE '$sono%' ORDER BY name";


    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>