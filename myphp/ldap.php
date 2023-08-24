if(!defined("LDAP_OPT_DIAGNOSTIC_MESSAGE")) {
    define("LDAP_OPT_DIAGNOSTIC_MESSAGE", 0x0032); // needed for more detailed logging
}

$success = false; // could we authenticate the user?

if(($ldap = @ldap_connect($ldap_server)) !== false && is_resource($ldap)) {
    ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
    ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);

    // instead of trying to bind the user, we bind to the server...
    if(@ldap_bind($ldap, $ldap_username, $ldap_password)) {
        // then we search for the given user...
        if(($search = ldap_search($ldap, "ou=Workers,o=Internal", sprintf("(&(uid=%s))", $username))) !== false && is_resource($search)) {
            // they should be the first and only user found for the search...
            if((ldap_count_entries($ldap, $search) == 1) && ($entry = ldap_first_entry($ldap, $search)) !== false && is_resource($entry)) {
                // we ensure this is the case by obtaining the user identifier (UID) from the search which must match the provided $username...
                if(($uid = ldap_get_values($ldap, $entry, "uid")) !== false && is_array($uid)) {
                    // ensure that just one entry was returned by ldap_get_values() and ensure the obtained value matches the provided $username (excluding any case-differences)
                    if((isset($uid["count"]) && $uid["count"] == 1) && (isset($uid[0]) && is_string($uid[0]) && (strcmp(mb_strtolower($uid[0], "UTF-8"), mb_strtolower($username, "UTF-8")) === 0))) {
                        // once we have compared the provied $username with the discovered username, we get the DN for the user, which we need to provide to ldap_compare()...
                        if(($dn = ldap_get_dn($ldap, $entry)) !== false && is_string($dn)) {
                            // we then use ldap_compare() to compare the user's password with the provided $password
                            // ldap_compare() will respond with a boolean true/false depending on if the comparison succeeded or not, and -1 on error...
                            if(($comparison = ldap_compare($ldap, $dn, "userPassword", $password)) !== -1 && is_bool($comparison)) {
                                if($comparison === true) {
                                    $success = true; // user successfully authenticated, if we don't get this far, it failed...
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if(!$success) { // if not successful, either an error occurred or the credentials were actually incorrect
        error_log(sprintf("* Unable to authenticate user (%s) against LDAP!", $username));
        error_log(sprintf(" * LDAP Error: %s", ldap_error($ldap)));
        if(ldap_get_option($ldap, LDAP_OPT_DIAGNOSTIC_MESSAGE, $extended_error)) {
            error_log(sprintf(" * LDAP Extended Error: %s\n", $extended_error));
            unset($extended_error);
        }
    }
}
@ldap_close($ldap);
unset($ldap);