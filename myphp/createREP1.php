<?php    
    include 'openConn.php';

    $sono      = $_GET['s'];
    $scan      = $_GET['c'];
    
    $sql = "SELECT c.ip, c.name AS cname, t.id AS tid, t.name AS tname, v.id AS vid, v.descr2, v.id_level, r.done, r.numb FROM comp_vulner AS cv 
            JOIN comp     AS c ON c.id=cv.id_comp AND c.maxreestr>0
            JOIN vulner   AS v ON v.id=cv.id_vulner
            JOIN request  AS r ON v.id=r.id_vulner 
            JOIN category AS t on t.id=c.id_category 
            WHERE cv.id_scan=$scan AND cv.sono='$sono' AND cv.on_off='1'
            ORDER by v.id_level desc, v.id";

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $file_name = $sono.".csv";
        $file = fopen($file_name, "w");
		while($row = $result->fetch_assoc()) {

            switch ($row["done"]) {
                case "0":
                    $done="не устранено"; break;
                case "1":
                    $done="устранено собственными силами"; break;
                case "2":
                    $done="устранено ФКУ"; break;
                case "3":
                    $done="устранено ЦОД"; break;
                default:
                    $done="???";
            }
            
            switch ($row["id_level"]) {
                case "0":
                    $id_level="низкий"; break;
                case "1":
                    $id_level="средний"; break;
                case "2":
                    $id_level="высокий"; break;
                case "3":
                    $id_level="критический"; break;
                default:
                    $id_level="???";
            }

            $descr2 = str_replace(";",",",$row["descr2"]);

            fwrite($file, $row["ip"].", ");
            fwrite($file, $row["cname"].";");
            fwrite($file, $row["tid"]."-");
            fwrite($file, iconv("UTF-8","CP1251",$row["tname"]).";");
            fwrite($file, $row["vid"].";");
            fwrite($file, iconv("UTF-8","CP1251",$descr2).";");
            fwrite($file, iconv("UTF-8","CP1251",$id_level).";");
            fwrite($file, iconv("UTF-8","CP1251",$done).";");
            fwrite($file, iconv("UTF-8","CP1251",$row["numb"])."\r\n");          
        }
        
        fclose($file);
        echo "myphp/".$file_name;

    } else { echo "[]"; }
    
    $conn = null;
?>