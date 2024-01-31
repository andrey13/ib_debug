<?php
include 'openConn.php';

$id_oper = $_GET['o'];

$sql = 
"select 
dmc.*,
d.sn as dionis_sn,
d.sn1,
d.sn2
from dionis_model_content as dmc
left join dionis_model as dm on dm.id=dmc.id_dionis_model 
left join dionis as d on d.id_model=dm.id
left join dionis_oper as do on do.id_dionis=d.id
where do.id=$id_oper
order by name";

include 'closeConn.php';