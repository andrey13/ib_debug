<?php    
    include 'openConn.php';

    //$filter = $_GET['f'];

    $sql = "SELECT cr.id, 
                   cr.id_cmp,
                   cr.id_res, 
                   cr.dt_start, 
                   cr.dt_stop, 
                   cr.comment,
                   cr.dt_start,
                   cr.dt_stop,
                   cr.numb_start,
                   cr.numb_stop,
                   c.name AS cname,
                   c.user AS uname,
                   c.sono,
                   dm.torm,
                   c.ip,
                   c.esk_status,
                   dm.dt_on,
                   dm.dt_off,
                   dm.name AS filter
            FROM cmp_res AS cr
            LEFT JOIN comp          AS c ON c.id = cr.id_cmp
            LEFT JOIN resource      AS r ON r.id = cr.id_res
            LEFT JOIN dionis_matrix AS dm ON dm.name = r.filter AND LOCATE(src_ip, c.ip)>0 AND dm.dt_off = '3000-01-01'
            ORDER BY uname";

    //echo($sql);

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>