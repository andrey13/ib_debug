<?php
include 'openConn.php';
$sono = $_GET['s'];
$id_otdel = $_GET['o'];
$sklad = $_GET['k'];

if ($id_otdel == '0' and $sklad == '0') $sfx = "";
if ($id_otdel != '0' and $sklad == '0') $sfx = "WHERE m.id_otdel=$id_otdel";
if ($id_otdel == '0' and $sklad != '0') $sfx = "WHERE m.sklad=$sklad";
if ($id_otdel != '0' and $sklad != '0') $sfx = "WHERE m.id_otdel=$id_otdel AND sklad=$sklad";

$sql = "SELECT 
            m.id,
            m.numb,
            m.SN,
            m.id_user,
            m.id_comp,
            m.id_depart,
            m.id_otdel,
            m.id_status,
            m.id_oper,
            m.id_zayavka,
            m.id_vendor,
            m.date_status,
            m.otdel,
            m.sono,
            m.eko,
            m.date2,
            m.date,
            m.user,
            m.manufacturer,
            m.product_model,
            m.revision,
            m.size,
            m.usb_device_id,
            m.descr,
            m.sklad,
            m.status1,
            m.comment,
            m.dsp,
            m.size_gb,
            m.status,
            m.bad,
            m.old,
            u.name AS uname,
            u.esk_status AS user_esk_status,
            c.name AS cname,
            d.name AS dname,
            zm.id AS z_id
        FROM mts AS m 
        LEFT JOIN zayavka2mts AS zm ON zm.id_mts = m.id
        LEFT JOIN user AS u ON u.id = m.id_user
        LEFT JOIN comp AS c ON u.id = m.id_comp
        LEFT JOIN depart AS d ON d.id = m.id_depart ";
        
        $sql = "SELECT 
        m.id,
        m.SN,
        m.id_user,
        m.id_comp,
        m.id_depart,
        m.id_otdel,
        m.id_status,
        m.id_oper,
        m.id_zayavka,
        m.id_vendor,
        m.date_status,
        m.otdel,
        m.sono,
        m.eko,
        m.date2,
        m.date,
        m.user,
        m.manufacturer,
        m.product_model,
        m.revision,
        m.size,
        m.usb_device_id,
        m.descr,
        m.sklad,
        m.status1,
        m.comment,
        m.dsp,
        m.size_gb,
        m.status,
        m.bad,
        m.old,
        u.name AS uname,
        u.esk_status AS user_esk_status,
        d.name AS dname,
        (SELECT COUNT(id) FROM zayavka2mts AS zm WHERE zm.id_mts = m.id) as z_count
    FROM mts AS m 
    LEFT JOIN user AS u ON u.id = m.id_user
    LEFT JOIN depart AS d ON d.id = m.id_depart ";

//zm.id_zayavka AS z_id,
//LEFT JOIN zayavka2mts AS zm ON zm.id_mts = m.id


// $sql = $sql . $sfx . " ORDER BY id,date2 DESC";
$sql = $sql . $sfx . " ORDER BY SN, date";

// echo $sql;        

$result = $conn->query($sql);

if (!$result) {
    echo $sql;
    echo "\r\n\r\n";
    echo ($conn->error);
    return;
}

if ($result->num_rows > 0) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($outp);
} else {
    echo "[]";
}

$conn = null;
?>