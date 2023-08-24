<?php
include 'openConn.php';

$sono      = $_GET['s'];
$scan      = $_GET['c'];

$sql = "SELECT DISTINCt CONCAT(c.ip, ' ', c.name) AS cname,
                        CONCAT(t.id, '. ',t.name) AS tname,
                        v.id AS vid, 
                        IF(v.descr1<>'', v.descr1, v.descr2) AS descr,
                        vl.name AS vlevel,
                        vd.name AS vdone,
                        sv.request AS numb
        FROM comp_vulner1 AS cv 
        JOIN comp         AS c  ON c.id=cv.id_comp AND c.maxreestr>0
        JOIN vulner       AS v  ON v.id=cv.id_vulner
        LEFT JOIN vulner_level AS vl ON vl.id=v.id_level 
        LEFT JOIN category     AS t  ON t.id=c.id_category 
        INNER JOIN scan_vulner AS sv ON cv.id_vulner=sv.id_vulner
        LEFT JOIN vulner_done  AS vd ON vd.id=sv.done
        WHERE cv.id_scan=$scan AND cv.on_off='1' AND v.id_level>0
        ORDER by v.id_level desc, v.id";


$sql = "SELECT sv.id, sv.id_vulner, sv.id_scan, cv.id_comp,
       CONCAT(c.ip, ' ', c.name) AS cname,  CONCAT(t.id, '. ',t.name) AS tname,
       v.id AS vid, 
       vl.name AS vlevel,
       vd.name AS vdone,
       sv.request AS numb,
       IF(v.descr1<>'', v.descr1, v.descr2) AS descr
        FROM scan_vulner AS sv 
        LEFT join comp_vulner1 AS cv on cv.id_vulner=sv.id_vulner AND cv.id_scan=sv.id_scan
        left join comp as c on c.id=cv.id_comp
        LEFT JOIN category AS t  ON t.id=c.id_category 
        Left JOIN vulner   AS v  ON v.id=cv.id_vulner
        LEFT JOIN vulner_level AS vl ON vl.id=v.id_level 
        LEFT JOIN vulner_done  AS vd ON vd.id=sv.done
        WHERE sv.id_scan=$scan AND c.maxreestr<>0  AND cv.on_off='1' AND v.id_level>0 ORDER BY v.id_level DESC, id_vulner DESC";

$sql = "SELECT sv.id_vulner,
       CONCAT(c.ip, ' ', c.name) AS cname,  CONCAT(t.id, '. ',t.name) AS tname,
       v.id AS vid, 
       vl.name AS vlevel,
       vd.name AS vdone,
       sv.request AS numb,
       IF(v.descr1<>'', v.descr1, v.descr2) AS descr
        FROM scan_vulner AS sv 
        LEFT join comp_vulner1 AS cv on cv.id_vulner=sv.id_vulner AND cv.id_scan=sv.id_scan
        left join comp as c on c.id=cv.id_comp
        LEFT JOIN category AS t  ON t.id=c.id_category 
        Left JOIN vulner   AS v  ON v.id=cv.id_vulner
        LEFT JOIN vulner_level AS vl ON vl.id=v.id_level 
        LEFT JOIN vulner_done  AS vd ON vd.id=sv.done
        WHERE sv.id_scan=$scan AND c.maxreestr<>0  AND cv.on_off='1' AND v.id_level>0 ORDER BY v.id_level DESC, id_vulner DESC";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($outp);
} else {
    echo "[]";
}

$conn = null;
