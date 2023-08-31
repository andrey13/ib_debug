<?php
include 'openConn.php';

$postData     = file_get_contents('php://input');
$data         = json_decode($postData, true);
$sql          = $data['sql'];

$oper = substr($sql, 0, 6);

// echo "\n\r";
// echo $sql;
// echo "\n\r";

switch ($oper) {
    case "SELECT":
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $outp = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($outp);
        } else { echo "[]"; }
        break;

    case "INSERT":
        if ($conn->query($sql) === TRUE) {
            $id = mysqli_insert_id($conn);
            echo $id;
        } else {
            echo 0;
        }
        break;
        
    default:
        if ($conn->query($sql) === TRUE) {
            echo "OK: " . $sql . "\r\n";
        } else {
            echo "Error: " . $sql . "->" . $conn->error . "\r\n";
        }
}

$conn = null;
?>
