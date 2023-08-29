<?php    
    include 'openConn.php';

    $sono = $_GET['s'];
    
    if ($sono == "6100") {
        $sql = "SELECT mts.id, 
                       mts.id_user,
                       mts.id_depart,
                       mts.id_oper,
                       mts.id_status,
                       mts.date,
                       mts.user,
                       mts.manufacturer, 
                       mts.product_model, 
                       mts.revision, 
                       mts.size, 
                       mts.usb_device_id,
                       mts.SN,
                       mts.desc,
                       mts.status,
                       mts.comment,
                       u.name AS uname,
                       mts.otdel,
                       d.name AS oname
                FROM mts AS mts 
                LEFT JOIN user AS u ON u.id = mts.id_user
                LEFT JOIN depart AS d ON d.id = mts.id_depart
                ORDER BY mts.date";
    } else {
        $sql = "SELECT mts.id, mts.id_comp, mts.id_cert, p.sono, p.name, p.user, p.ip, c.Serial, c.Issuer, c.Subject, c.dt_start, c.dt_stop, c.org, c.fio, u.title
                FROM mtsflash AS mts 
                LEFT JOIN comp AS p ON p.id = mts.id_comp 
                LEFT JOIN user AS u ON u.sono=p.sono AND u.name=c.fio AND u.esk_status=2
                WHERE p.sono = '$sono'
                GROUP BY mts.id
                ORDER BY c.dt_stop";
    }

    include 'closeConn.php';
?>