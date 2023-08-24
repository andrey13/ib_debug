<?php
	include 'openConn.php';
    $comm = $_GET['c'];
    $ip = $_SERVER['REMOTE_ADDR'];
    if ($ip<>"10.161.214.3") {
        $dt = date ("Y-m-d H:i:s");
        $sql = "INSERT INTO logs (ip_user,seans_datetime,comment) VALUES ('$ip', '$dt', '$comm')";
        if ($conn->query($sql) === TRUE) { echo $sql;; 
        } else { $err=1; echo "Error: ".$sql."->".$conn->error; }
    }
	$conn = null;
?>