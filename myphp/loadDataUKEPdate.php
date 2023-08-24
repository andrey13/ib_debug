<?php    
    include 'openConn.php';
    $dd = date("Y-m-d");
    $sono = $_GET['s'];

    if ($sono=="") {
        $sql = "select date,'6171' as sono,id,kol_requested_6171 as kol_req,sum_requested_6171 as sum_req,kol_completed_6171 as kol_com,sum_completed_6171 as sum_com,kol_work_6171 as kol_w from signature  WHERE date<='$dd' UNION
        select date,'6173' as sono,id,kol_requested_6173 as kol_req,sum_requested_6173 as sum_req,kol_completed_6173 as kol_com,sum_completed_6173 as sum_com,kol_work_6173 as kol_w from signature  WHERE date<='$dd' UNION
        select date,'6174' as sono,id,kol_requested_6174 as kol_req,sum_requested_6174 as sum_req,kol_completed_6174 as kol_com,sum_completed_6174 as sum_com,kol_work_6174 as kol_w from signature  WHERE date<='$dd' UNION
        select date,'6181' as sono,id,kol_requested_6181 as kol_req,sum_requested_6181 as sum_req,kol_completed_6181 as kol_com,sum_completed_6181 as sum_com,kol_work_6181 as kol_w from signature  WHERE date<='$dd' UNION
        select date,'6182' as sono,id,kol_requested_6182 as kol_req,sum_requested_6182 as sum_req,kol_completed_6182 as kol_com,sum_completed_6182 as sum_com,kol_work_6182 as kol_w from signature  WHERE date<='$dd' UNION
        select date,'6183' as sono,id,kol_requested_6183 as kol_req,sum_requested_6183 as sum_req,kol_completed_6183 as kol_com,sum_completed_6183 as sum_com,kol_work_6183 as kol_w from signature  WHERE date<='$dd' UNION
        select date,'6186' as sono,id,kol_requested_6186 as kol_req,sum_requested_6186 as sum_req,kol_completed_6186 as kol_com,sum_completed_6186 as sum_com,kol_work_6186 as kol_w from signature  WHERE date<='$dd' UNION
        select date,'6188' as sono,id,kol_requested_6188 as kol_req,sum_requested_6188 as sum_req,kol_completed_6188 as kol_com,sum_completed_6188 as sum_com,kol_work_6188 as kol_w from signature  WHERE date<='$dd' UNION
        select date,'6191' as sono,id,kol_requested_6191 as kol_req,sum_requested_6191 as sum_req,kol_completed_6191 as kol_com,sum_completed_6191 as sum_com,kol_work_6191 as kol_w from signature  WHERE date<='$dd' UNION
        select date,'6193' as sono,id,kol_requested_6193 as kol_req,sum_requested_6193 as sum_req,kol_completed_6193 as kol_com,sum_completed_6193 as sum_com,kol_work_6193 as kol_w from signature  WHERE date<='$dd' UNION
        select date,'6195' as sono,id,kol_requested_6195 as kol_req,sum_requested_6195 as sum_req,kol_completed_6195 as kol_com,sum_completed_6195 as sum_com,kol_work_6195 as kol_w from signature  WHERE date<='$dd' UNION
        select date,'6196' as sono,id,kol_requested_6196 as kol_req,sum_requested_6196 as sum_req,kol_completed_6196 as kol_com,sum_completed_6196 as sum_com,kol_work_6196 as kol_w from signature  WHERE date<='$dd'
        order by date,sono,id";
    } else {
        $sql = "select date,'$sono' as sono,id,kol_requested_$sono as kol_req,sum_requested_$sono as sum_req,kol_completed_$sono as kol_com,sum_completed_$sono as sum_com,kol_work_$sono as kol_w from signature  WHERE date<='$dd'
        order by date,sono,id";
    }
    

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $outp = $result->fetch_all(MYSQLI_ASSOC);
        $n_outp = sizeof($outp);

        echo json_encode($outp);
    } else { echo "[]"; }
    
    $conn = null;
?>
