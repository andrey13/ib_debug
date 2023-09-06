<?php    
    include 'openConn.php';
    $sono       = $_GET['s'];
    $esk        = $_GET['e'];
    $id_depart  = $_GET['d'];

    $sql = "SELECT id,name,Account,sono,esk_status,id_depart FROM user WHERE esk_status='2' ORDER BY name";
    if ($id_depart == "0") {
        if ($sono=='' and $esk=='') $sql = "SELECT id,name,Account,id_depart,id_title,title,sono,esk_status FROM user ORDER BY name";
        if ($sono=='' and $esk!='') $sql = "SELECT id,name,Account,id_depart,id_title,title,sono,esk_status FROM user WHERE esk_status='$esk' ORDER BY name";
        if ($sono!='' and $esk=='') $sql = "SELECT id,name,Account,id_depart,id_title,title,sono,esk_status FROM user WHERE sono='$sono' ORDER BY name";
        if ($sono!='' and $esk!='') $sql = "SELECT id,name,Account,id_depart,id_title,title,sono,esk_status FROM user WHERE sono='$sono' AND esk_status='$esk' ORDER BY name";
    } else {
        if ($sono=='' and $esk=='') $sql = "SELECT id,name,Account,id_depart,id_title,title,sono,esk_status FROM user WHERE id_depart=$id_depart ORDER BY name";
        if ($sono=='' and $esk!='') $sql = "SELECT id,name,Account,id_depart,id_title,title,sono,esk_status FROM user WHERE id_depart=$id_depart AND esk_status='$esk' ORDER BY name";
        if ($sono!='' and $esk=='') $sql = "SELECT id,name,Account,id_depart,id_title,title,sono,esk_status FROM user WHERE id_depart=$id_depart AND sono='$sono' ORDER BY name";
        if ($sono!='' and $esk!='') $sql = "SELECT id,name,Account,id_depart,id_title,title,sono,esk_status FROM user WHERE id_depart=$id_depart AND sono='$sono' AND esk_status='$esk' ORDER BY name";
    }


    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>