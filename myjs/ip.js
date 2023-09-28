// определение ip адреса пользователя ---------------------------------------------------
function ip2mask(ip) {
    return ip.slice(0, ip.lastIndexOf(".")) + ".0";
}

// вычисление маски подсети =============================================================
function bit2mask(nb) {
    let mask = "";
    //console.log(" nb:", nb, " type:", typeof nb);
    switch (nb) {
        case 32:
            mask = "255.255.255.255";
            break;
        case 31:
            mask = "255.255.255.254";
            break;
        case 30:
            mask = "255.255.255.252";
            break;
        case 29:
            mask = "255.255.255.248";
            break;
        case 28:
            mask = "255.255.255.240";
            break;
        case 27:
            mask = "255.255.255.224";
            break;
        case 26:
            mask = "255.255.255.192";
            break;
        case 25:
            mask = "255.255.255.128";
            break;
        case 24:
            mask = "255.255.255.0";
            break;
        case 23:
            mask = "255.255.254.0";
            break;
        case 22:
            mask = "255.255.252.0";
            break;
        case 21:
            mask = "255.255.248.0";
            break;
        case 20:
            mask = "255.255.240.0";
            break;
        case 19:
            mask = "255.255.224.0";
            break;
        case 18:
            mask = "255.255.192.0";
            break;
        case 17:
            mask = "255.255.128.0";
            break;
        case 16:
            mask = "255.255.0.0";
            break;
        case 15:
            mask = "255.254.0.0";
            break;
        case 14:
            mask = "255.252.0.0";
            break;
        case 13:
            mask = "255.248.0.0";
            break;
        case 12:
            mask = "255.240.0.0";
            break;
        case 11:
            mask = "255.224.0.0";
            break;
        case 10:
            mask = "255.192.0.0";
            break;
        case 9:
            mask = "255.128.0.0";
            break;
        case 8:
            mask = "255.0.0.0";
            break;
        case 7:
            mask = "254.0.0.0";
            break;
        case 6:
            mask = "252.0.0.0";
            break;
        case 5:
            mask = "248.0.0.0";
            break;
        case 4:
            mask = "240.0.0.0";
            break;
        case 3:
            mask = "224.0.0.0";
            break;
        case 2:
            mask = "192.0.0.0";
            break;
        case 1:
            mask = "128.0.0.0";
            break;
        case 0:
            mask = "0.0.0.0";
            break;
        default:
            mask = "";
    }
    //console.log("mask:", mask);
    return mask;
}

//=======================================================================================
function ip_compare(ip1, ip2) {
    if (ip1 == ip2) return 0;
    let ip1_array = ip1.split('.');
    let ip2_array = ip2.split('.');
    let ip1_nnnn = ip1_array[0] * 16777216 + ip1_array[1] * 65536 + ip1_array[2] * 256 + ip1_array[3] * 1;
    let ip2_nnnn = ip2_array[0] * 16777216 + ip2_array[1] * 65536 + ip2_array[2] * 256 + ip2_array[3] * 1;
    //console.log(ip1_nnnn, '    ', ip2_nnnn);
    if (+ip1_nnnn > +ip2_nnnn) return 1;
    if (+ip1_nnnn < +ip2_nnnn) return -1;
}

//=======================================================================================
function ip10(ip_string) {
    let ip = '';
    let ip_array = ip_string.split(',');
    ip_array.every(element => {
        ip = element.trim();
        if (ip.slice(0, 2) == '10') {
            return false;
        } else {
            return true;
        }
    });
    return ip;
}