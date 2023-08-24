<?php    
    include 'openConn.php';

    $sono = $_GET['s'];

    if ($sono=="6100" or $sono=="6199") {
        $field="nnn";
    } else {
        $field="n".substr($sono,2,2);
    }
    
    $sql = "SELECT  p.id, p.id_status AS idstatus, s.name AS sname, p.name AS pname, p.n_comp FROM soft AS p LEFT JOIN status AS s ON p.id_status=s.id WHERE p.n_comp>0 ORDER BY p.name";

    $sql = "SELECT  p.id, p.id_status AS idstatus, s.name AS sname, p.name AS pname, p.n_comp, p.nnn, p.n00, p.n52, p.n54, p.n64, p.n65, p.n71, p.n73, p.n74, p.n81, p.n82, p.n83, p.n86, p.n88, p.n91, p.n92, p.n93, p.n94, p.n95, p.n96
    FROM soft AS p LEFT JOIN status AS s ON p.id_status=s.id WHERE p.n_comp>0 ORDER BY p.name";

    $sql = "SELECT  p.id, p.id_prog, p.id_status AS idstatus, s.name AS sname, p.name AS pname, p.n_comp, p.nnn, p.n00, p.n52, p.n54, p.n64, p.n65, p.n71, p.n73, p.n74, p.n81, p.n82, p.n83, p.n86, p.n88, p.n91, p.n92, p.n93, p.n94, p.n95, p.n96, p.license, p.comment
    FROM soft AS p LEFT JOIN status AS s ON p.id_status=s.id WHERE p." . $field . ">0 ORDER BY p.name";

    //$sql = "SELECT  p.id, p.id_status AS idstatus, s.name AS sname, p.name AS pname, p.n_comp FROM soft AS p LEFT JOIN status AS s ON p.id_status=s.id ORDER BY p.name";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>