<?php    
    include 'openConn.php';

    $sono = $_GET['i'];

    $sql = "SELECT DISTINCT p.id,p.name,p.license,cs.id_comp,c.arm
    FROM prog AS p 
    JOIN soft      AS s  ON p.id=s.id_prog 
    JOIN comp_soft AS cs ON s.id=cs.id_soft 
    JOIN comp      AS c  ON cs.id_comp=c.id
    WHERE p.otss='1' AND c.arm LIKE 'АРМ%'
    ORDER BY p.name,c.arm";

$sql = "SELECT DISTINCT p.id,p.name,p.license
FROM prog AS p 
JOIN soft      AS s  ON p.id=s.id_prog 
JOIN comp_soft AS cs ON s.id=cs.id_soft 
JOIN comp      AS c  ON cs.id_comp=c.id
WHERE p.otss='1' AND c.arm LIKE 'АРМ%'
ORDER BY p.name,c.arm";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>