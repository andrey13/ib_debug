<?php
include 'openConn.php';

$id_model = $_GET['m'];

$sql = "SELECT * FROM dionis_model_content WHERE id_dionis_model=$id_model ORDER BY name";

include 'closeConn.php';