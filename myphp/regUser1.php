<?php

$postData     = file_get_contents('php://input');
$data         = json_decode($postData, true);
$usr          = $data['usr'];
$pwd          = $data['pwd'];
$logfile      = fopen("regUser.log", "a");

fwrite($logfile, "\r\n" . $usr . "->" . $pwd);


if (!extension_loaded('ldap')) {
    fwrite($logfile, "\r\n" . "extension ldap not loaded!");
    fclose($logfile);
    die("extension ldap not loaded!");
}

$ldap = ldap_connect("ldap://10.161.201.251") or die("not connect with ldap server");
       
if ($bind = ldap_bind($ldap, $usr, $pwd)) {
    fwrite($logfile, "->YES");
    echo "YES";
} else {
    fwrite($logfile, "->NO");
    fwrite($logfile, "\r\n" . ldap_error($ldap));
    echo "NO";
}


fclose($logfile);

?>