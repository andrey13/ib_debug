<?php    
    include 'openConn.php';

    $scan = $_GET['s'];

    $sql = "select id,sono,Count(id_vulner) as n_vulners from comp_vulner where id_scan='$scan' AND on_off='1' group by sono ORDER BY sono";    

    $sql = "select id,id_scan,sono,Count(id_vulner) as n_vulners from comp_vulner where on_off='1' group by id_scan,sono ORDER BY id_scan,sono";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>