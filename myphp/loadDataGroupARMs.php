<?php    
    include 'openConn.php';

    $id_prog   = $_GET['p'];
    $sono      = $_GET['s'];
    $arms     = "";

    $sql = "SELECT DISTINCT p.id,p.name,p.license,cs.id_comp,c.arm
    FROM prog AS p 
    JOIN soft      AS s  ON p.id=s.id_prog 
    JOIN comp_soft AS cs ON s.id=cs.id_soft 
    JOIN comp      AS c  ON cs.id_comp=c.id
    WHERE p.id=$id_prog AND p.otss='1' AND c.arm LIKE 'АРМ%'
    ORDER BY p.name,c.arm";


    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $arms = $arms.$row["arm"].",";
        }
    }
    echo $arms;
    
    $conn = null;
?>