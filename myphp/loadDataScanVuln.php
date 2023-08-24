<?php    
    include 'openConn.php';

    $id_scan = $_GET['s'];

    $sql = "SELECT sv.id,
                   sv.id_scan,
                   sv.id_vulner, 
                   sv.request, 
                   sv.comment, 
                   sv.date, 
                   sv.done,
                   sv.n_comp, 
                   v.name, 
                   v.id_level,
                   v.descr1, 
                   v.descr2, 
                   v.descr3, 
                   v.descr4
            FROM scan_vulner AS sv
            LEFT JOIN vulner AS v ON sv.id_vulner=v.id
            WHERE sv.id_scan=$id_scan
            ORDER BY v.id_level DESC";

    $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $outp = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($outp);
        } else { 
            echo "[]"; 
        }
    
    $conn = null;
?>