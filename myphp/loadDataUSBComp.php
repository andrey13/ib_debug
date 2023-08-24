<?php
include 'openConn.php';

$id_usb = $_GET['u'];

$sql = "SELECT uc.id, 
               uc.id_zayavka,
               uc.id_usb,
               uc.id_comp,
               c.name AS comp_name,
               c.user AS comp_user
               FROM usb2comp AS uc
               LEFT JOIN comp AS c ON c.id = uc.id_comp
               WHERE uc.id_usb=$id_usb";

include 'closeConn.php';
?>