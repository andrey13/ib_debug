<?php    
    include 'openConn.php';
    $no = $_GET['n'];
    // $ifns=$sono;
    
    $sql = "SELECT c.no AS no, c.kpp, c.org AS org, c.inn AS inn, c.date1 AS date1, c.date2 AS date2, c.uz AS uz, u.okopf1 AS okopf1, u.status AS status 
            FROM inn_cert AS c JOIN inn AS u on u.inn=c.inn 
            WHERE no='$no' ORDER BY inn";


    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>