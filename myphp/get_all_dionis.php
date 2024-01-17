<?php
include 'openConn.php';
$sono = $_GET['s'];
$id_otdel = $_GET['o'];
$sklad = $_GET['k'];
$id_type_oper = $_GET['t'];

if ($sono == '6100') {
    $sfx = "";
} else {
    $sfx = " WHERE ifns_sono1 == '$sono'";
    $sfx = "";
}

$sfx = $sfx . " ORDER BY gk_name DESC, torm_sono2, d.sn";

$sql = "SELECT 
    d.*, 
    o.id as id_oper, 
    o.id_connect_point1, 
    o.id_connect_point2, 
    o.temp,
    p1.ip AS ip1,        
    p2.ip AS ip2,
    p1.stock AS stock1,
    p2.stock AS stock2,
    t2.name as t2name,
    CASE
        WHEN o.temp = 1
            THEN i1.sono
        ELSE i2.sono
    END AS ifns_sono1,
    CASE
        WHEN o.temp = 1
            THEN t1.name
        ELSE t2.name
    END AS t1name,
      t1.sono AS torm_sono1,
    i2.sono AS ifns_sono2,
    t2.sono AS torm_sono2,
    g.name AS gk_name,
    dm.model AS model_name,
    dm.type AS type_name,
    (select count(do.id) from dionis_oper as do where do.id_dionis=d.id) as n_opers 
FROM dionis d
LEFT JOIN (
    SELECT o1.*
    FROM dionis_oper o1
    WHERE o1.id = (
        SELECT o2.id 
        FROM dionis_oper o2
        LEFT JOIN connect_point AS p3 ON p3.id=o2.id_connect_point1
        LEFT JOIN connect_point AS p4 ON p4.id=o2.id_connect_point2
        LEFT JOIN torm AS t3 ON t3.id=p3.id_torm
        LEFT JOIN torm AS t4 ON t4.id=p4.id_torm
        WHERE id_dionis = o1.id_dionis AND (t3.sono<>t4.sono OR p3.stock=3)
        ORDER BY date_time DESC LIMIT 1
    )
) o ON d.id = o.id_dionis
LEFT JOIN connect_point AS p1 ON p1.id=o.id_connect_point1
LEFT JOIN connect_point AS p2 ON p2.id=o.id_connect_point2
LEFT JOIN torm AS t1 ON t1.id=p1.id_torm
LEFT JOIN torm AS t2 ON t2.id=p2.id_torm
LEFT JOIN ifns AS i1 ON i1.id=t1.id_co
LEFT JOIN ifns AS i2 ON i2.id=t2.id_co
LEFT JOIN goskontrakt AS g ON g.id=d.id_gk
LEFT JOIN dionis_model AS dm ON dm.id=d.id_model" . $sfx;
// ORDER BY gk_name DESC, torm_sono2, d.sn";


$result = $conn->query($sql);

if (!$result) {
    echo $sql;
    echo "\r\n\r\n";
    echo ($conn->error);
    return;
}

if ($result->num_rows > 0) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($outp);
} else {
    echo "[]";
}

$conn = null;
?>