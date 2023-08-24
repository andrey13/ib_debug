<?php
include 'openConn.php';

$id_zayavka = $_GET['z'];

$sql = "SELECT zu.id, 
               zu.id_zayavka,
               zu.id_usb,
               zu.dsp,
               uf.SN AS usb_SN,
               zu.size_gb,
               zu.comment
               FROM zayavka2usb AS zu
               LEFT JOIN usbflash AS uf ON uf.id=zu.id_usb
               WHERE zu.id_zayavka=$id_zayavka";

include 'closeConn.php';
?>