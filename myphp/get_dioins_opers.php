<?php
include 'openConn.php';

$id_dionis = $_GET['d'];

// echo $id_dionis;

if ($id_dionis == 0) {
    $sql = "SELECT 
        o.*,
        d.sn,
        d.type,
        d.ver,
        d.model,
        d.inv_n,
        p1.ip AS ip1,        
        p2.ip AS ip2,
        p1.stock AS stock1,
        p2.stock AS stock2,
        t1.name as t1name,
        t2.name as t2name,
        i1.sono AS ifns_sono1,
        t1.sono AS torm_sono1,
        i2.sono AS ifns_sono2,
        t2.sono AS torm_sono2
    FROM dionis_oper AS o
    LEFT JOIN dionis AS d ON d.id=o.id_dionis
    LEFT JOIN connect_point AS p1 ON p1.id=o.id_connect_point1
    LEFT JOIN connect_point AS p2 ON p2.id=o.id_connect_point2
    LEFT JOIN torm AS t1 ON t1.id=p1.id_torm
    LEFT JOIN torm AS t2 ON t2.id=p2.id_torm
    LEFT JOIN ifns AS i1 ON i1.id=t1.id_co
    LEFT JOIN ifns AS i2 ON i2.id=t2.id_co
    ORDER BY o.date DESC, ifns_sono1, torm_sono1, ifns_sono2, torm_sono2";
} else {
    $sql = "SELECT 
        o.*,
        d.sn,
        d.type,
        d.ver,
        d.model,
        d.inv_n,
        p1.ip AS ip1,        
        p2.ip AS ip2,
        p1.stock AS stock1,
        p2.stock AS stock2,
        t1.name as t1name,
        t2.name as t2name,
        i1.sono AS ifns_sono1,
        t1.sono AS torm_sono1,
        i2.sono AS ifns_sono2,
        t2.sono AS torm_sono2
    FROM dionis_oper AS o
    LEFT JOIN dionis AS d ON d.id=o.id_dionis
    LEFT JOIN connect_point AS p1 ON p1.id=o.id_connect_point1
    LEFT JOIN connect_point AS p2 ON p2.id=o.id_connect_point2
    LEFT JOIN torm AS t1 ON t1.id=p1.id_torm
    LEFT JOIN torm AS t2 ON t2.id=p2.id_torm
    LEFT JOIN ifns AS i1 ON i1.id=t1.id_co
    LEFT JOIN ifns AS i2 ON i2.id=t2.id_co
    WHERE o.id_dionis=$id_dionis
    ORDER BY o.date DESC, ifns_sono1, torm_sono1, ifns_sono2, torm_sono2";
}

// echo $sql;        

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