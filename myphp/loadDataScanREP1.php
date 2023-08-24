<?php    
    include 'openConn.php';

    $sono      = $_GET['s'];
    $scan      = $_GET['c'];
    
    $sql = "SELECT CONCAT(c.ip, ' ', c.name) AS cname, 
                   CONCAT(t.id, '. ',t.name) AS tname, 
                   v.id AS vid, IF(v.descr1<>'', v.descr1, v.descr2) AS descr, 
                   vl.name AS vlevel,
                   vd.name AS vdone,
                   v.id_level,
                   r.numb 
            FROM comp_vulner  AS cv 
            JOIN comp         AS c  ON c.id=cv.id_comp AND c.maxreestr>0
            JOIN vulner       AS v  ON v.id=cv.id_vulner 
            LEFT JOIN request      AS r  ON v.id=r.id_vulner AND r.id_scan=$scan AND r.sono='$sono'
            LEFT JOIN vulner_level AS vl ON vl.id=v.id_level 
            LEFT JOIN vulner_done  AS vd ON vd.id=r.done
            LEFT JOIN category     AS t  ON t.id=c.id_category 
            WHERE cv.id_scan=$scan AND cv.sono='$sono' AND cv.on_off='1' AND v.id_level>0
            ORDER by v.id_level desc, v.id";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }

    $conn = null;
?>