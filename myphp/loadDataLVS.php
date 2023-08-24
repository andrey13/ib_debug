<?php    
    include 'openConn.php';
    
    $sql = "SELECT l.id, l.id_torm, i.sono, r.sono_torm, r.ekp, l.ip, l.mask, l.nbit, l.comment, l.gw, l.gw_ext, l.id_lvs_type, t.name as nametype, t.color, r.name as nametorm
            FROM lvs as l
            LEFT JOIN lvs_type as t ON l.id_lvs_type=t.id
            LEFT JOIN torm AS r ON r.id=l.id_torm
            LEFT JOIN ifns AS i ON i.id=r.id_co
            ORDER BY i.sono,r.sono_torm,nametype";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>