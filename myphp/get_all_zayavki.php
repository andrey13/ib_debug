<?php
include 'openConn.php';

$id_depart = $_GET['d'];

if ($id_depart == '0') {
    $sql = "SELECT z.id, 
    z.id_type,
    z.id_user,
    z.id_user_ruk,
    z.id_user_it,
    z.id_user_ib,
    z.id_user_otd,
    z.id_user_isp,
    z.id_depart,
    z.id_status,
    z.date,
    z.io_it,
    z.io_ib,
    z.io_otd,
    z.io_ruk,
    z.user_title,
    z.user_isp_title,
    t1.name AS type,
    t2.name AS status,
    u1.name AS user,
    u2.name AS user_otd,
    u3.name AS user_it,
    u4.name AS user_ib,
    u5.name AS user_ruk,
    u6.name AS user_isp,
    d.name AS depart,
    z.comment
FROM zayavka AS z
LEFT JOIN types AS t1 ON t1.id = z.id_type
LEFT JOIN types AS t2 ON t2.id = z.id_status
LEFT JOIN user AS u1 ON u1.id = z.id_user
LEFT JOIN user AS u2 ON u2.id = z.id_user_otd
LEFT JOIN user AS u3 ON u3.id = z.id_user_it
LEFT JOIN user AS u4 ON u4.id = z.id_user_ib
LEFT JOIN user AS u5 ON u5.id = z.id_user_ruk
LEFT JOIN user AS u6 ON u6.id = z.id_user_isp
LEFT JOIN depart AS d ON d.id = z.id_depart        
ORDER BY z.date DESC";
} else {
    $sql = "SELECT z.id, 
    z.id_type,
    z.id_user,
    z.id_user_ruk,
    z.id_user_it,
    z.id_user_ib,
    z.id_user_otd,
    z.id_user_isp,
    z.id_depart,
    z.id_status,
    z.date,
    z.io_it,
    z.io_ib,
    z.io_otd,
    z.io_ruk,
    z.user_title,
    z.user_isp_title,
    t1.name AS type,
    t2.name AS status,
    u1.name AS user,
    u2.name AS user_otd,
    u3.name AS user_it,
    u4.name AS user_ib,
    u5.name AS user_ruk,
    u6.name AS user_isp,
    d.name AS depart,
    z.comment
FROM zayavka AS z
LEFT JOIN types AS t1 ON t1.id = z.id_type
LEFT JOIN types AS t2 ON t2.id = z.id_status
LEFT JOIN user AS u1 ON u1.id = z.id_user
LEFT JOIN user AS u2 ON u2.id = z.id_user_otd
LEFT JOIN user AS u3 ON u3.id = z.id_user_it
LEFT JOIN user AS u4 ON u4.id = z.id_user_ib
LEFT JOIN user AS u5 ON u5.id = z.id_user_ruk
LEFT JOIN user AS u6 ON u6.id = z.id_user_isp
LEFT JOIN depart AS d ON d.id = z.id_depart        
WHERE z.id_depart = $id_depart
ORDER BY z.date DESC";
}


include 'closeConn.php';