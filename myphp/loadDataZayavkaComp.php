<?php
include 'openConn.php';

$id_zayavka = $_GET['z'];

$sql = "SELECT uc.id, 
               uc.id_usb,
               uc.id_comp,
               uc.id_zayavka,
               c.name AS comp_name,
               c.user AS comp_user
               FROM usb2comp AS uc
               LEFT JOIN comp AS c ON c.id = uc.id_comp
               WHERE uc.id_zayavka=$id_zayavka";

include 'closeConn.php';
?>