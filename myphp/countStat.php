<?php    
	include 'openConn.php';
	//require_once("mysqli_conf.php");
	mysqli_set_charset($conn,"CP1251");
	//mysqli_set_charset($conn,"UTF8");
	$charset=mysqli_character_set_name($conn);
	//echo "charset = ".$charset;

	$sql1="SELECT sono,schtat FROM ifns";
	$result1 = $conn->query($sql1);
	if ($result1->num_rows > 0) {
		while($row1 = $result1->fetch_assoc()) {
			
			$sono   = $row1["sono"];
			$schtat = $row1["schtat"];
			if ($sono==="6100") {$prefix="U".$sono."%";} else {$prefix="I".$sono."%";}
			$sql2 = "SELECT COUNT(id) AS cc FROM comp WHERE name LIKE '$prefix' AND script_ok_datetime<>'0000-00-00 00:00:00'";
			echo "\r\n".$sql2;
			echo "\r\nsono:".$prefix." ";
			$result2 = $conn->query($sql2); 
			if ($result2->num_rows > 0) {
				$row2 = $result2->fetch_assoc();
				$cc=$row2["cc"];
				$ss=$cc/$schtat*100.00;
				echo $cc;
				$sql3 = "UPDATE ifns SET ncomp=$cc,nstat=$ss WHERE sono=$sono";
				if ($conn->query($sql3) === TRUE) {} else { $err=1; echo "Error: ".$sql3."->".$conn->error."\r\n"; continue;}	 
			}

		}
	}

	$conn = null;

?>