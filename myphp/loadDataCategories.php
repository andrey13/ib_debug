<?php    
    include 'openConn.php';

    $categories = "";

    $sql = "SELECT * FROM category ORDER BY id";    

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $categories = $categories.$row["id"].". ".$row["name"]."<br>";
        }
    }
    echo $categories;
    
    $conn = null;
?>
