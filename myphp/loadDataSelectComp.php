<?php    
    include 'openConn.php';
    $sono      = $_GET['s'];
    $esk       = $_GET['e'];
    $id_depart = $_GET['d'];

    if ($id_depart == 0) {
        if ($sono=='' and $esk=='') $sql = "SELECT id, name, ip, sono, esk_status, user, description FROM comp ORDER BY user";
        if ($sono=='' and $esk!='') $sql = "SELECT id, name, ip, sono, esk_status, user, description FROM comp WHERE esk_status='$esk' ORDER BY user";
        if ($sono!='' and $esk=='') $sql = "SELECT id, name, ip, sono, esk_status, user, description FROM comp WHERE sono='$sono' ORDER BY user";
        if ($sono!='' and $esk!='') $sql = "SELECT id, name, ip, sono, esk_status, user, description FROM comp WHERE sono='$sono' AND esk_status='$esk' ORDER BY user";
    }

    if ($id_depart > 0) {
        $sql= "SELECT c.sono, c.id AS id_comp, u.id AS id_user, c.ip, c.name, c.description, c.user, u.Account, u.id_depart
               FROM comp AS c
               LEFT JOIN user AS u ON u.name=c.user
               WHERE u.id_depart=$id_depart AND u.esk_status='2' AND u.sono='$sono'
               ORDER BY c.user"; 
    }

    if ($id_depart == -1) {
        $sql= "SELECT c.sono, c.id AS id_comp, u.id AS id_user, c.ip, c.name, c.description, c.user, u.Account, u.id_depart
               FROM comp AS c
               LEFT JOIN user AS u ON u.name=c.user
               WHERE u.esk_status='2' AND u.sono='$sono'
               ORDER BY c.user"; 
    }

    $result = $conn->query($sql);

    if (!$result) {
        echo $sql;
        echo "\r\n\r\n";
        echo($conn->error);
        return;
    }

    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>