<?php    
    include 'openConn.php';
    $sono = $_GET['s'];

    $sql = "SELECT * FROM dionis_matrix ORDER BY sono, torm";
    $sql = "SELECT dm.*,c.description,c.name AS cname FROM dionis_matrix AS dm LEFT JOIN comp AS c ON c.ip=dm.src_ip AND c.esk_status='2' ORDER BY sono, torm, name";

    if ($sono=='6100' or $sono=='6199') {
        $sql = "SELECT dm.*,c.description,c.name AS cname FROM dionis_matrix AS dm LEFT JOIN comp AS c ON c.id=dm.id_comp_src ORDER BY sono, torm, name";
    } else {
        $sql = "SELECT dm.*,c.description,c.name AS cname FROM dionis_matrix AS dm LEFT JOIN comp AS c ON c.id=dm.id_comp_src WHERE dm.sono='$sono' ORDER BY sono, torm, name";
    }
    
    //echo $sql;

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>