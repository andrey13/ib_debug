<?php
include 'openConn.php';

$id_zayavka = $_GET['z'];

$sql = "SELECT zm.id, 
               zm.id_zayavka,
               zm.id_mts,
               zm.id_status,
               zm.id_oper,
               zm.id_user,
               t1.name AS status,
               t2.name AS oper,
               zm.date_zakaz,
               zm.date_vidano,
               zm.date_podkl,
               zm.dsp,
               m.SN AS mts_SN,
               m.size_gb AS size2,
               zm.size_gb,
               u.name AS user,
               zm.reson,
               zm.comment
               FROM zayavka2mts AS zm
               LEFT JOIN user AS u ON u.id=zm.id_user
               LEFT JOIN types AS t1 ON t1.id = zm.id_status
               LEFT JOIN types AS t2 ON t2.id = zm.id_oper
               LEFT JOIN mts AS m ON m.id=zm.id_mts
               WHERE zm.id_zayavka=$id_zayavka";

include 'closeConn.php';
?>