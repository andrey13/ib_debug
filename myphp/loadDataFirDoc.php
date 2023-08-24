<?php    
    include 'openConn.php';

    $sono      = $_GET['s'];
    $id_depart = $_GET['d'];
    
    // УФНС администратор
    if ($sono == '6100' and $id_depart == -1) $sql = "SELECT * FROM fir_doc ORDER BY date DESC, id DESC";

    // УФНС технолог
    if ($sono == '6100' and $id_depart <> -1) $sql = "SELECT * FROM fir_doc WHERE id_depart=$id_depart ORDER BY date DESC, id DESC";

    // ИФНС
    if ($sono <> '6100')                      $sql = "SELECT * FROM fir_doc WHERE sono=$sono ORDER BY date DESC, id DESC";
    

    include 'closeConn.php';
?>