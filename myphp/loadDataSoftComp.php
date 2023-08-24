<?php    
    include 'openConn.php';

    $soft_id = $_GET['s'];
    $sono    = $_GET['i'];

    $sql = "SELECT cs.id_comp, cs.id_soft, cm.sono, cm.name, e.nname, u.name AS uname, u.room, cm.script_ok_datetime, cm.script_last_datetime 
            FROM comp_soft AS cs 
            LEFT JOIN comp AS cm ON cs.id_comp=cm.id
            LEFT JOIN eko.equirment AS e ON cm.name=e.nname
            LEFT JOIN eko.relations AS r ON e.id=r.equirment_id AND r.date_end=''
            LEFT JOIN eko.users     AS u ON r.users_id=u.id
            WHERE cs.id_soft=$soft_id AND cs.on_off='1' 
            ORDER BY cm.name";    

    if ($sono=="") {
        $sql = "SELECT cs.id_comp, cs.id_soft, cm.sono, cm.name, cm.arm, cm.user, cm.script_ok_datetime, cm.script_last_datetime 
        FROM comp_soft AS cs 
        LEFT JOIN comp AS cm ON cs.id_comp=cm.id
        WHERE cs.id_soft=$soft_id AND cs.on_off='1' AND cm.esk_status='2'
        ORDER BY cm.name";    
    } else {
        $sql = "SELECT cs.id_comp, cs.id_soft, cm.sono, cm.name, cm.arm, cm.user, cm.script_ok_datetime, cm.script_last_datetime 
        FROM comp_soft AS cs 
        LEFT JOIN comp AS cm ON cs.id_comp=cm.id
        WHERE cs.id_soft=$soft_id AND cs.on_off='1' AND cm.esk_status='2' AND cm.sono='$sono'
        ORDER BY cm.name";    
    }

$result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>