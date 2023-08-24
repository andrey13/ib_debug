<?php    
    include 'openConn.php';

    $comp_id = $_GET['с'];

    $sql = "SELECT cs.id_comp, cs.id_soft, cs.on_off, cs.upd_dt, s.name, s.id_status 
            FROM comp_soft AS cs 
            LEFT JOIN soft AS s ON cs.id_soft=s.id 
            WHERE cs.id_comp=$comp_id AND cs.on_off='1' 
            ORDER BY s.name";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>