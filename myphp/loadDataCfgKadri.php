<?php    
    include 'openConn.php';
    $id_doc_type = $_GET['d'];
    
    $sql = "SELECT * FROM doc_user WHERE id_doc_type = $id_doc_type ORDER BY position";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>