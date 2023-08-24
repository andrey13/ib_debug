<?php
include 'openConn.php';

$id_zayavka = $_GET['z'];

$sql = "SELECT mc.id, 
               mc.id_zayavka,
               mc.id_mts,
               mc.id_comp,
               c.name AS comp_name,
               c.user AS comp_user
               FROM mts2comp AS mc
               LEFT JOIN comp AS c ON c.id = mc.id_comp
               WHERE mc.id_zayavka=$id_zayavka";

include 'closeConn.php';
?>