<?php    
    include 'openConn.php';

    $sql = "SELECT gu.id, gu.id_group, gu.id_user, u.account, u.name
    FROM group_user AS gu 
    LEFT JOIN user AS u ON gu.id_user=u.id";

$result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>