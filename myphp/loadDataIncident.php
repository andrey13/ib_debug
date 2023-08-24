<?php    
    include 'openConn.php';

    $sono = $_GET['s'];
    
    if ($sono == "6100") {
        $sql = "SELECT i.id, i.sono, i.date, it.name, i.description, i.result, i.comment FROM incident AS i LEFT JOIN incident_type AS it ON it.id = i.id_incident ORDER BY date DESC";
    } else {
        $sql = "SELECT i.id, i.sono, i.date, it.name, i.description, i.result, i.comment FROM incident AS i LEFT JOIN incident_type AS it ON it.id = i.id_incident WHERE sono=$sono ORDER BY date DESC";
    }

    include 'closeConn.php';
?>