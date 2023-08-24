<?php    
    include 'openConn.php';

    //$id_module = $_GET['i'];
    
    //$sql = "SELECT um.id, um.id_module, um.id_user, u.account, u.name, um.allow_R, um.allow_E, um.allow_C, um.allow_D 
    //        FROM user_module AS um 
    //        LEFT JOIN user AS u ON um.id_user=u.id 
    //        WHERE um.id_module=$id_module";

    $sql = "SELECT um.id, um.id_module, um.i_module, um.id_user, u.account, u.name, um.allow_R, um.allow_E, um.allow_C, um.allow_D, um.allow_A 
    FROM user_module AS um 
    LEFT JOIN user AS u ON um.id_user=u.id";

$result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>