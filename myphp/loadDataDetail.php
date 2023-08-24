<?php    
    include 'openConn.php';

    $id_change = $_GET['i'];
    $id_type   = $_GET['t'];

    $sql = "SELECT k.id, 
                   k.id_change, 
                   k.id_type, 
                   k.id_user, 
                   k.fio_new, 
                   k.id_reson,
                   k.id_depart,
                   k.id_depart_new,
                   k.id_title,
                   k.id_title_new,
                   k.id_prikaz,
                   k.fio_old,
                   k.fio_new,
                   k.tabn,
                   k.date_start,
                   k.date_stop,
                   u.account,
                   u.name  AS uname, 
                   p.date  AS pdate, 
                   p.numb  AS pnumb, 
                   r.name  AS rname, 
                   r.type  AS rtype,
                   d1.name AS d1name, 
                   d2.name AS d2name,
                   t1.name AS t1name, 
                   t2.name AS t2name
            FROM kadri_change_detail AS k
            LEFT JOIN user           AS u  ON u.id  = k.id_user
            LEFT JOIN kadri_prikaz   AS p  ON p.id  = k.id_prikaz
            LEFT JOIN reson          AS r  ON r.id  = k.id_reson
            LEFT JOIN depart         AS d1 ON d1.id = k.id_depart
            LEFT JOIN depart         AS d2 ON d2.id = k.id_depart_new
            LEFT JOIN user_title     AS t1 ON t1.id = k.id_title
            LEFT JOIN user_title     AS t2 ON t2.id = k.id_title_new            
            WHERE k.id_change = $id_change AND k.id_type = $id_type
            ORDER BY uname";

    //echo($sql);

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>