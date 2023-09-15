<?php
include 'openConn.php';

$id_zayavka = $_GET['z'];

$sql = "SELECT zm.id, 
               zm.id_zayavka,
               zm.id_mts,
               zm.id_mts2,
               zm.SN,
               zm.SN1,
               zm.dsp,
               zm.id_status,
               zm.id_oper,
               zm.id_user,
               zm.id_user1,
               zm.date_zakaz,
               zm.date_vidano,
               zm.date_podkl,
               zm.size_gb,
               zm.reson,
               zm.comment,
               t1.name AS status,
               t2.name AS oper,
               m1.size_gb AS mts_size1,
               m1.SN AS mts_SN1,
               m2.size_gb AS mts_size2,
               m2.SN AS mts_SN2,
               u.name AS user,
               u1.name AS user1
               FROM zayavka2mts AS zm
               LEFT JOIN user AS u ON u.id=zm.id_user
               LEFT JOIN user AS u1 ON u1.id=zm.id_user1
               LEFT JOIN types AS t1 ON t1.id = zm.id_status
               LEFT JOIN types AS t2 ON t2.id = zm.id_oper
               LEFT JOIN mts AS m1 ON m1.id=zm.id_mts
               LEFT JOIN mts AS m2 ON m2.id=zm.id_mts2
               WHERE zm.id_zayavka=$id_zayavka";

include 'closeConn.php';
?>