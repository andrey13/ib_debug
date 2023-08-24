<?php    
    include 'openConn.php';
    //$ifns = $_GET['i'];
    $sono = $_GET['s'];
    $ifns=$sono;
    
    //$sql = "SELECT * FROM comp WHERE sono LIKE '$sono%' AND (esk_status='2' OR esk_status='0') ORDER BY name";

    if ($sono == '6100' or $sono == '6199') {
        $sql = "SELECT * FROM comp WHERE esk_status='2' OR esk_status='0' ORDER BY sono, name";
    } else {
        $sql = "SELECT * FROM comp WHERE sono='$sono' AND (esk_status='2' OR esk_status='0') ORDER BY name";

    }

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        $n_outp = sizeof($outp);

//        for ($i=0; $i<$n_outp; $i++) {
//             if ($outp[$i]['maxreestr']=="0") $outp[$i]['maxreestr']="";
//             if ($outp[$i]['id_category']=="0") $outp[$i]['id_category']="";
//        }

        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>