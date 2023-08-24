<?php    
    include 'openConn.php';

    $id_scan = $_GET['s'];
    $sono    = $_GET['o'];
    
    $sql = "SELECT v.id, v.name, v.id_level, v.descr1, v.descr2, v.descr3, v.descr4,
                   s.nnn, s.n00, s.n52, s.n54, s.n64, s.n65, s.n71, s.n73, s.n74, s.n81, s.n82, s.n83, s.n86, s.n88, s.n91, s.n92, s.n93, s.n94, s.n95, s.n96, 
                   r.date, r.numb, r.done, r.comment
            FROM vulner AS v 
            LEFT JOIN vulner_stat AS s ON v.id=s.id_vulner AND s.id_scan=$id_scan 
            LEFT JOIN request AS r ON r.sono='$sono' AND  r.id_scan=$id_scan AND r.id_vulner=v.id
            WHERE s.nnn>0 AND v.id_level>0
            ORDER BY v.id_level DESC, v.name ASC";

    $sql = "SELECT v.id, v.name, v.id_level, v.descr1, v.descr2, v.descr3, v.descr4,
                s.nnn, s.n00, s.n52, s.n54, s.n64, s.n65, s.n71, s.n73, s.n74, s.n81, s.n82, s.n83, s.n86, s.n88, s.n91, s.n92, s.n93, s.n94, s.n95, s.n96, 
                r.date, r.numb, r.done, r.comment
                FROM vulner AS v 
            LEFT JOIN vulner_stat AS s ON v.id=s.id_vulner AND s.id_scan=$id_scan 
            LEFT JOIN request AS r ON r.sono='$sono' AND  r.id_scan=$id_scan AND r.id_vulner=v.id
            WHERE s.nnn>0
            ORDER BY v.id_level DESC, v.name ASC";

    $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $outp = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($outp);
        } else { 
            echo "[]"; 
        }
    
    $conn = null;
?>