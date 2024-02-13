<?php    
    include 'openConn.php';
    $sono = $_GET['s'];
    $ifns=$sono;
   

    $sql = "SELECT 
	u.*,
	d.name AS dname 
	FROM user AS u 
	LEFT JOIN depart AS d ON d.id=u.id_depart 
	WHERE u.sono LIKE '$sono%' 
	ORDER BY u.name";


    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>