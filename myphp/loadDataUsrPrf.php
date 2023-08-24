<?php    
    include 'openConn.php';

    //$filter = $_GET['f'];

    $sql = "SELECT fup.id, 
                   fup.id_fir_user, 
                   fup.id_fir_profile, 
                   fp.name
            FROM fir_usr_prf  AS fup
            LEFT JOIN fir_profile AS fp ON fp.id = fup.id_fir_profile
            ORDER BY fup.id_fir_user, fp.name";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>