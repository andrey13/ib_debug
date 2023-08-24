<?php    
    include 'openConn.php';

    $id_prog = $_GET['p'];

    $sql = "SELECT id, id_prog, name, id_status FROM soft WHERE id_prog=$id_prog ORDER BY name";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>