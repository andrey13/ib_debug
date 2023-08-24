<?php    
    include 'openConn.php';
    $sono = $_GET['s'];
    $ifns=$sono;
    $dd = date("Y-m-d");
    
    $sql = "SELECT * FROM signature WHERE date<='$dd' ORDER BY date,id";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        $n_outp = sizeof($outp);

        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>