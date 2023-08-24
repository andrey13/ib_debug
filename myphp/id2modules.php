<?php    
    include 'openConn.php';
    
    $id = $_GET['id'];

    $sql = "SELECT um.id_user,
                   m.name,
                   m.title,
                   um.id_module,
                   um.i_module,
                   um.allow_R,
                   um.allow_E,
                   um.allow_C,
                   um.allow_D,
                   um.allow_A 
            FROM user_module AS um 
            JOIN module AS m ON um.id_module=m.id 
            WHERE id_user=$id ORDER BY um.i_module";

    $sql = "SELECT u.id,
                   m.name,
                   m.title,
                   mg.id_module,
                   m.i_module,  
                   max(mg.allow_R) as allow_R, 
                   max(mg.allow_E) as allow_E, 
                   max(mg.allow_C) as allow_C, 
                   max(mg.allow_D) as allow_D, 
                   max(mg.allow_A) as allow_A
            FROM module_group AS mg
            JOIN module AS m ON m.id = mg.id_module
            join group_user AS gu on mg.id_group = gu.id_group
            JOIN user AS u ON u.id=gu.id_user
            WHERE u.id=$id GROUP BY mg.id_module ORDER BY m.i_module";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>