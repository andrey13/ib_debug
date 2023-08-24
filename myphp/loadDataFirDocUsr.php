<?php    
    include 'openConn.php';

    $id_doc = $_GET['d'];

    $id_doc = ($id_doc==0) ? -1 : $id_doc;

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
                   fu.reson,
                   c.name AS cname,
                   u.name AS uname,
                   u.Account,
                   c.ip,
                   c.esk_status AS c_esk_status,
                   u.esk_status AS u_esk_status,
                   c.description AS c_dsc,
                   u.description AS u_dsc
            FROM fir_user  AS fu
            LEFT JOIN comp AS c ON c.id = fu.id_comp
            LEFT JOIN user AS u ON u.id = fu.id_user
            WHERE id_doc = $id_doc
            ORDER BY sono,fio_fir";

    include 'closeConn.php';
?>