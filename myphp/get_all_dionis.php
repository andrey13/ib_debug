<?php
include 'openConn.php';
$sono = $_GET['s'];
$id_otdel = $_GET['o'];
$sklad = $_GET['k'];
$id_type_oper = $_GET['t'];

// if ($id_otdel == '0' and $sklad == '0') $sfx = "";
// if ($id_otdel != '0' and $sklad == '0') $sfx = "WHERE m.id_otdel=$id_otdel";
// if ($id_otdel == '0' and $sklad != '0') $sfx = "WHERE m.sklad=$sklad";
// if ($id_otdel != '0' and $sklad != '0') $sfx = "WHERE m.id_otdel=$id_otdel AND sklad=$sklad";
    
// if ($id_otdel == '0' and $id_type_oper == '0') $sfx = "";
// if ($id_otdel != '0' and $id_type_oper == '0') $sfx = "WHERE m.id_otdel=$id_otdel";
// if ($id_otdel == '0' and $id_type_oper != '0') $sfx = "WHERE m.id_type_oper=$id_type_oper";
// if ($id_otdel != '0' and $id_type_oper != '0') $sfx = "WHERE m.id_type_otdel=$id_otdel AND id_oper=$id_type_oper";

$sql = "SELECT 
        d.*
    FROM dionis AS d
    ORDER BY d.sono1, d.sono2 ";

// echo $sql;        

$result = $conn->query($sql);

if (!$result) {
    echo $sql;
    echo "\r\n\r\n";
    echo ($conn->error);
    return;
}

if ($result->num_rows > 0) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($outp);
} else {
    echo "[]";
}

$conn = null;
?>