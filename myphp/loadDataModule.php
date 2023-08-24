<?php    
    include 'openConn.php';
    
    $sql = "SELECT * FROM module ORDER BY i_module";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>