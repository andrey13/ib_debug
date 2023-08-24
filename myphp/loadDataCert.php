<?php    
    include 'openConn.php';

    $sono = $_GET['s'];
    
    if ($sono == "6100") {
        $sql = "SELECT cc.id, cc.id_comp, cc.id_cert, p.sono, p.name, p.user, p.ip, c.Serial, c.Issuer, c.Subject, c.dt_start, c.dt_stop, c.org, c.fio, u.title, p.room
                FROM comp_cert AS cc 
                JOIN comp AS p ON p.id = cc.id_comp 
                JOIN cert AS c ON c.id = cc.id_cert
                JOIN user AS u ON u.sono=p.sono AND u.name=c.fio AND u.esk_status=2
                GROUP BY cc.id
                ORDER BY c.dt_stop";
    } else {
        $sql = "SELECT cc.id, cc.id_comp, cc.id_cert, p.sono, p.name, p.user, p.ip, c.Serial, c.Issuer, c.Subject, c.dt_start, c.dt_stop, c.org, c.fio, u.title
                FROM comp_cert AS cc 
                LEFT JOIN comp AS p ON p.id = cc.id_comp 
                LEFT JOIN cert AS c ON c.id = cc.id_cert
                LEFT JOIN user AS u ON u.sono=p.sono AND u.name=c.fio AND u.esk_status=2
                WHERE p.sono = '$sono'
                GROUP BY cc.id
                ORDER BY c.dt_stop";
    }

    include 'closeConn.php';
?>