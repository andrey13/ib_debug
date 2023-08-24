<?php    
    include 'openConn.php';

    $id_comp = $_GET['c'];
    $id_scan   = $_GET['sc'];


    $sql = "SELECT cv.id_vulner, v.id_level, v.name
    FROM comp_vulner AS cv 
    LEFT JOIN vulner AS v ON cv.id_vulner=v.id
    WHERE cv.id_comp=$id_comp AND cv.on_off='1' AND cv.id_scan=$id_scan
    ORDER BY v.id_level DESC,v.name ASC";    

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>