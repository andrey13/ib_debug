<?php    
    ini_set('display_errors', true);
    $conn = new mysqli('localhost', 'soft1', 'soft1', 'soft1');
    mysqli_set_charset($conn,"utf8");    
    if($conn->connect_error) {die("Connection failed:".$conn->connect_error);}

?>