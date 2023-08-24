<?php    
    include 'openConn.php';

    $id_co = $_GET['i'];

    if ($id_co==0) {
        $sql = "SELECT t.id,t.id_co,t.sono_torm,t.name,i.sono FROM torm AS t LEFT JOIN ifns AS i ON i.id=t.id_co ORDER BY i.sono";    
    } else {
        $sql = "SELECT t.id,t.id_co,t.sono_torm,t.name,i.sono FROM torm AS t LEFT JOIN ifns AS i ON i.id=t.id_co WHERE t.id_co=$id_co ORDER BY t.sono_torm";    
    }

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>