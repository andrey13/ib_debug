<?php

$u = $_GET['u'];
$p = $_GET['p'];

if (!extension_loaded('ldap')) {die("extension ldap not loaded!");}

$ldap = ldap_connect("ldap://10.161.201.251") or die("not connect with ldap server");

ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);

       
if ($bind = ldap_bind($ldap, $u, $p)) {echo "YES";} else {echo "NO";}

?>