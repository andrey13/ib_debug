<?php    
    include 'openConn.php';
    
    $sono      = $_GET['s'];
    $id_depart = $_GET['d'];

    // администраторы УФН - видят все
    if ($sono == '6100' and $id_depart == 0) $sql = "SELECT * FROM fir_reson ORDER BY name";

    // технологи УФНС - видят только свой отдел
    if ($sono == '6100' and $id_depart <> 0) $sql = "SELECT * FROM fir_reson WHERE sono = '$sono' AND id_depart = $id_depart ORDER BY name";

    // администраторы ИБ ИФНС - видят только ИФНС
    if ($sono <> '6100')                     $sql = "SELECT * FROM fir_reson WHERE sono = '$sono' ORDER BY name";

    include 'closeConn.php';
?>