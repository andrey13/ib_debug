<?php    
    include 'openConn.php';

    //$filter = $_GET['f'];

    $sql = "SELECT DISTINCT
                   fu.id, 
                   fu.logon, 
                   fu.sono, 
                   fu.fio_fir, 
                   fu.fio_esk, 
                   fu.comp_esk, 
                   fu.comp_usr, 
                   fu.comp_dsc, 
                   fu.ncomp,
                   fu.id_comp, 
                   fu.id_user, 
                   fu.fir_status, 
                   fu.dt_start,
                   fu.dt_stop,
                   fu.numb_req,
                   fu.dt_req_start,
                   fu.dt_req_stop,
                   fu.numb_req_start,
                   fu.numb_req_stop,
                   c.name AS cname,
                   u.name AS uname,
                   u.Account,
                   c.ip,
                   c.esk_status AS c_esk_status,
                   u.esk_status AS u_esk_status,
                   c.description AS c_dsc,
                   u.description AS u_dsc,
                   dm.torm,
                   dm.name AS filter
            FROM fir_user  AS fu
            LEFT JOIN comp AS c ON c.id = fu.id_comp
            LEFT JOIN user AS u ON u.id = fu.id_user
            LEFT JOIN dionis_matrix AS dm ON dm.name = 'in-fir' AND LOCATE(CONCAT(src_ip,','), CONCAT(c.ip,','))>0 AND dm.dt_off = '3000-01-01'            
            ORDER BY sono,fio_fir";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>