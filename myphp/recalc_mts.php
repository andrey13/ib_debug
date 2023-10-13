<?php
include 'openConn.php';

$id_mts = $_GET['m'];
$result = "";

if ($id_mts ==0) {
    $sql="UPDATE mts AS m SET 
        id_zayavka=(
            SELECT zm.id_zayavka 
            FROM zayavka2mts AS zm 
            LEFT JOIN zayavka AS z ON z.id=zm.id_zayavka 
            WHERE m.id=zm.id_mts 
            ORDER BY z.date DESC 
            LIMIT 1),
        id_oper=(
            SELECT zm.id 
            FROM zayavka2mts AS zm 
            WHERE zm.id_mts=m.id AND zm.id_zayavka=m.id_zayavka 
            ORDER BY zm.id_oper DESC 
            LIMIT 1),
        id_type_oper=(
            SELECT zm.id_oper 
            FROM zayavka2mts AS zm 
            WHERE zm.id_mts=m.id AND zm.id_zayavka=m.id_zayavka 
            ORDER BY zm.id_oper DESC 
            LIMIT 1),
        id_user=(
            SELECT zm.id_user 
            FROM zayavka2mts AS zm 
            WHERE zm.id_mts=m.id AND zm.id_zayavka=m.id_zayavka 
            ORDER BY zm.id_oper DESC 
            LIMIT 1)";
} else {
    $sql="UPDATE mts AS m SET 
        id_zayavka=(
            SELECT zm.id_zayavka 
            FROM zayavka2mts AS zm 
            LEFT JOIN zayavka AS z ON z.id=zm.id_zayavka 
            WHERE m.id=zm.id_mts 
            ORDER BY z.date DESC 
            LIMIT 1),
        id_oper=(
            SELECT zm.id 
            FROM zayavka2mts AS zm 
            WHERE zm.id_mts=m.id AND zm.id_zayavka=m.id_zayavka 
            ORDER BY zm.id_oper DESC 
            LIMIT 1),
        id_type_oper=(
            SELECT zm.id_oper 
            FROM zayavka2mts AS zm 
            WHERE zm.id_mts=m.id AND zm.id_zayavka=m.id_zayavka 
            ORDER BY zm.id_oper DESC 
            LIMIT 1),
        id_user=(
            SELECT zm.id_user 
            FROM zayavka2mts AS zm 
            WHERE zm.id_mts=m.id AND zm.id_zayavka=m.id_zayavka 
            ORDER BY zm.id_oper DESC 
            LIMIT 1)          
        WHERE m.id=$id_mts";
}

$result = $conn->query($sql);

if ($id_mts ==0) {
    $sql="UPDATE mts AS m SET 
        id_depart=(
            SELECT u.id_depart
            FROM user AS u 
            WHERE u.id=id_user)";
} else {
    $sql="UPDATE mts AS m SET 
        id_depart=(
            SELECT u.id_depart
            FROM user AS u 
            WHERE u.id=id_user)
    WHERE m.id=$id_mts";
}

$result = $conn->query($sql);



if (!$result) {
    // echo $sql;
    // echo "\r\n\r\n";
    // echo ($conn->error);
    $result = $sql . " -> " . $conn->error;
    $result = "[]";
} else {
    $result = "[]";
}

$conn = null;
echo $result;
?>