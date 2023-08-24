<?php    
    include 'openConn.php';

    $sono      = $_GET['s'];

    //echo "\r\nsono:".$sono;

    $sss = "n".substr($sono,2,2);
    //echo "\r\nsss:".$sss;
    
    $sql = "SELECT * FROM vulner WHERE id_level>0 AND $sss>0";

    //echo "\r\n".$sql;

    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			
			$v_id       = trim($row["id"]);
            $v_id_level = trim($row["id_level"]);
			$v_name     = trim($row["name"]);
			$v_descr1   = trim($row["descr1"]);
			$v_descr2   = trim($row["descr2"]);
			$v_descr3   = trim($row["descr3"]);
			$v_descr4   = trim($row["descr4"]);

            switch ($v_id_level) {
                case "0":
                    $level="низкий"; break;
                case "1":
                    $level="средний"; break;
                case "2":
                    $level="высокий"; break;
                case "3":
                    $level="критический"; break;
                default:
                    $level="???";
            }



            $file = fopen($sono."_ID_".$v_id."_".$v_id_level.".txt", "w");
            fwrite($file, "устранить уязвимость согласно прилагаемым рекомендациям\r\n");
            fwrite($file, "ID:".$v_id."\r\n");
            fwrite($file, "уровень:".$level."\r\n");
            fwrite($file, $v_name."\r\n");
            fwrite($file, $v_descr1."\r\n");
            fwrite($file, $v_descr2."\r\n");
            fwrite($file, $v_descr3."\r\n");
            fwrite($file, $v_descr4."\r\n");
            fwrite($file, "компьютеры, на которых обнаружена уязвимость\r\n");

            $sql1 = "SELECT c.ip, c.name FROM comp_vulner AS cv LEFT JOIN comp AS c ON cv.id_comp=c.id WHERE on_off='1' AND cv.id_vulner=$v_id AND cv.sono=$sono";
            $result1 = $conn->query($sql1);
            if ($result1->num_rows > 0) {
                while($row1 = $result1->fetch_assoc()) {
                    $c_name   = trim($row1["name"]);
                    fwrite($file, $c_name.";");
                }
            }
            //echo "\r\n".$v_id;
            fclose($file);
        }
        
        
        $s_exec = "7z a -sdel -y ".$sono." ".$sono."*.TXT";
        //echo "\r\n".$s_exec;
        exec($s_exec);


        $file = $sono.".7z";

        echo $file;

//        if (file_exists($file)) {
//            if (ob_get_level()) {
//              ob_end_clean();
//            }
//            header('Content-Description: File Transfer');
//            //header('Content-Type: application/octet-stream');
//            header('Content-Type: application/force-download');
//            header('Content-Disposition: attachment; filename="'.$file.'"');
//            header('Content-Transfer-Encoding: binary');
//            header('Expires: 0');
//            header('Cache-Control: must-revalidate');
//            header('Pragma: public');
//            header('Content-Length: ' . filesize($file));
//            readfile($file);
//        }

    } else { echo json_encode(""); }
    
    $conn = null;
?>