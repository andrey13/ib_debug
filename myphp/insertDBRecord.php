<?php    
    include 'openConn.php';
    $postData     = file_get_contents('php://input');
    $data         = json_decode($postData, true);
    $table        = $data['mysql_table'];
    $fields       = ""; 
    $values       = "";

    foreach($data as $f => $v) {
        if ($f=="id" or $f=="mysql_table") continue;

        if ($fields == "") {
            $fields = "(";
        } else {
            $fields = $fields . ",";
        }

        $fields = $fields . $f;

        if ($values == "") {
            $values = "(";
        } else {
            $values = $values . ",";
        }

        if (gettype($v)=="integer") {
            $values = $values . $v;
        } else {
            $values = $values . "'" . $v . "'";
        }
    }

    $fields = $fields . ")";
    $values = $values . ")";

    $sql="INSERT INTO $table $fields VALUES $values";

    if ($conn->query($sql) === TRUE) {
        $id = mysqli_insert_id($conn);
        echo $id;
    } else {echo "Error: ".$sql."->".$conn->error."\r\n";}
  
    $conn = null;
?>