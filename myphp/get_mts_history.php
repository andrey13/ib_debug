<?php
include 'openConn.php';
$id_mts = $_GET['i'];

if ($id_mts == 0) {
    $sql = "SELECT 
    zm.id AS zm_id,
    z.id AS z_id, 
    z.date AS z_date, 
    zm.id_mts AS zm_id_mts,
    m.SN AS m_SN,
    z.id_type AS z_id_type, 
    z.id_status AS z_id_status, 
    z.id_depart AS z_id_depart, 
    z.id_user_it AS z_id_user_it, 
    z.id_user AS z_id_user, 
    z.id_user_isp AS z_id_user_isp, 
    zm.id_user AS zm_id_user, 
    zm.id_oper AS zm_id_oper, 
    zm.dsp AS zm_dsp, 
    zm.size_gb AS zm_size_gb,
    u1.name AS user_name,
    u2.name AS user_mts_name,
    u3.name AS user_isp_name,
    t1.name AS type,
    t2.name AS status,
    t3.name AS oper
    FROM zayavka2mts AS zm
    LEFT JOIN zayavka AS z ON z.id = zm.id_zayavka
    LEFT JOIN user AS u1 ON u1.id = z.id_user
    LEFT JOIN user AS u2 ON u2.id = zm.id_user
    LEFT JOIN user AS u3 ON u3.id = z.id_user_isp
    LEFT JOIN types AS t1 ON t1.id = z.id_type
    LEFT JOIN types AS t2 ON t2.id = z.id_status
    LEFT JOIN types AS t3 ON t3.id = zm.id_oper
    LEFT JOIN mts   AS m ON m.id = zm.id_mts
    ORDER BY z_date DESC, zm_id DESC";
} else {
    $sql = "SELECT 
    zm.id AS zm_id,
    z.id AS z_id, 
    z.date AS z_date, 
    zm.id_mts AS zm_id_mts,
    m.SN AS m_SN,
    z.id_type AS z_id_type, 
    z.id_status AS z_id_status, 
    z.id_depart AS z_id_depart, 
    z.id_user_it AS z_id_user_it, 
    z.id_user AS z_id_user, 
    z.id_user_isp AS z_id_user_isp, 
    zm.id_user AS zm_id_user, 
    zm.id_oper AS zm_id_oper, 
    zm.dsp AS zm_dsp, 
    zm.size_gb AS zm_size_gb,
    u1.name AS user_name,
    u2.name AS user_mts_name,
    u3.name AS user_isp_name,
    t1.name AS type,
    t2.name AS status,
    t3.name AS oper
    FROM zayavka2mts AS zm
    LEFT JOIN zayavka AS z ON z.id = zm.id_zayavka
    LEFT JOIN user AS u1 ON u1.id = z.id_user
    LEFT JOIN user AS u2 ON u2.id = zm.id_user
    LEFT JOIN user AS u3 ON u3.id = z.id_user_isp
    LEFT JOIN types AS t1 ON t1.id = z.id_type
    LEFT JOIN types AS t2 ON t2.id = z.id_status
    LEFT JOIN types AS t3 ON t3.id = zm.id_oper
    LEFT JOIN mts   AS m ON m.id = zm.id_mts
    WHERE zm.id_mts=$id_mts
    ORDER BY z_date, zm_id";
}

// ORDER BY z_date DESC, zm_id DESC";
// --  AS m 
// --         LEFT JOIN user AS u ON u.id = m.id_user
// --         LEFT JOIN comp AS c ON u.id = m.id_comp
// --         LEFT JOIN depart AS d ON d.id = m.id_depart ";
        
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