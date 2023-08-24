<?php    
    include 'openConn.php';

    $sql = "SELECT ur.id, 
                   ur.id_usr,
                   ur.id_res, 
                   ur.dt_start, 
                   ur.dt_stop, 
                   ur.comment,
                   u.account,
                   u.name AS uname,
                   c.name AS cname,
                   c.ip,
                   c.esk_status
            FROM usr_res AS ur
            LEFT JOIN user AS u ON u.id = ur.id_usr
            LEFT JOIN comp AS c ON c.user = u.name
            WHERE c.esk_status= '2'
            ORDER BY u.name";

    //echo($sql);

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>