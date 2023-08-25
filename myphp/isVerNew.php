<?php
include 'openConn.php';

// имя проверяемой таблицы --------------------------------------------------------------
$table_name = $_GET['t'];

// значение индекса поля с именем name_key ----------------------------------------------
$id_key     = $_GET['k'];

// имя поля, по которому фильтруются записи таблицы -------------------------------------
$name_key   = $_GET['n'];

// номер предыдущей версии данных, с которым сравнивается номер текущей версии ----------
$ver_old    = $_GET['v'];

$is_ver_new    = '[false]';

if ($id_key == '0') {
    $sql = "SELECT * FROM version WHERE table_name='$table_name'";
} else {
    $sql = "SELECT * FROM version WHERE table_name='$table_name' AND id_key=$id_key AND name_key='$name_key'";
}

// echo $sql;

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    $res = $outp[0]['ver'];
    if ($res > $ver_old) $is_ver_new='[true]';
}

echo $is_ver_new;

 $conn = null;
?>