<?php    
    include 'openConn.php';

    $id_doc      = $_GET['d'];
    $id_fir_user = $_GET['f'];

    $sql = "SELECT fup.id, 
                   fup.id_doc,
                   fup.id_fir_user, 
                   fup.id_fir_profile, 
                   fp.name,
                   fp.title
            FROM fir_usr_prf  AS fup
            LEFT JOIN fir_profile AS fp ON fp.id = fup.id_fir_profile
            WHERE  id_doc = $id_doc AND id_fir_user=$id_fir_user
            ORDER BY fp.name";      

    include 'closeConn.php';

?>