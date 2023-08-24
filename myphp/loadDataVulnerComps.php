<?php    
    include 'openConn.php';

    $id_vulner = $_GET['v'];
    $id_scan   = $_GET['s'];
    $comps     = "";

    $sql = "SELECT cv.id_comp, cv.sono, cv.id_vulner, cm.name 
    FROM comp_vulner1 AS cv 
    JOIN comp AS cm ON cv.id_comp=cm.id AND cm.maxreestr>0
    WHERE cv.id_vulner=$id_vulner AND cv.on_off='1' AND cv.id_scan=$id_scan
    ORDER BY cm.name";    

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $comps = $comps.$row["name"]."; ";
        }
    }
    echo $comps;
    
    $conn = null;
?>