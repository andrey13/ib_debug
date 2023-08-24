<?php    
    include 'openConn.php';

    $sql = "SELECT mg.id, mg.id_module, mg.i_module, mg.id_group, g.name, mg.allow_R, mg.allow_E, mg.allow_C, mg.allow_D, mg.allow_A 
    FROM module_group AS mg 
    LEFT JOIN group_of_users AS g ON mg.id_group = g.id
    ORDER BY g.name";

$result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>