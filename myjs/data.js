async function sono_2_data(sono) {
    let sql = `SELECT * FROM ifns WHERE sono='${sono}'`
    let res = await runSQL_p(sql)
    let data = await JSON.parse(res)[0]
    return data
}

async function sono_torm_2_data(sono_torm) {
    let sql = `SELECT * FROM torm WHERE sono_torm=${sono_torm}`
    let res = await runSQL_p(sql)
    let data = await JSON.parse(res)[0]
    return data
}

async function id_oper_2_date(id_dionis_oper) {
    let sql =
    `SELECT 
    do.date,
    do.date_time,
    do.id_dionis,
    d.id_gk,
    g.date_fns,
    g.numb_fns,
    g.date_ufns,
    g.numb_ufns,
    g.date_vendor,
    g.numb_vendor,
    v.name as vendor,
    do.id_user_tno,
    u1.name as user_tno,
    u2.name as user_fku,
    do.id_connect_point1,
    do.id_connect_point2,
    do.point1_str,
    do.point2_str,
    do.sn_str,
    cp1.id_torm,
    cp2.id_torm,
    t1.name as tno1, 
    t2.name as tno2,
    t1.id_co,
    t2.id_co,
    i1.name as ifns1,
    i2.name as ifns2,
    do.date_time as oper_date
    FROM dionis_oper as do 
    left join dionis as d on d.id=do.id_dionis 
    left join goskontrakt as g on g.id=d.id_gk 
    left join vendor v on v.id=g.id_vendor 
    left join user as u1 on u1.id=do.id_user_tno 
    left join user as u2 on u2.id=do.id_user_fku
    left join connect_point as cp1 on cp1.id=do.id_connect_point1
    left join connect_point as cp2 on cp2.id=do.id_connect_point2 
    left join torm as t1 on t1.id=cp1.id_torm 
    left join torm as t2 on t2.id=cp2.id_torm
    left join ifns as i1 on i1.id=t1.id_co
    left join ifns as i2 on i2.id=t2.id_co
    WHERE do.id = ${id_dionis_oper}`

    let res = await runSQL_p(sql)
    let data = await JSON.parse(res)[0]
    return data
}



async function dionis_oper_2_dionis_oper(
    id_dionis_oper,
    id_oper_type1,
    id_oper_type2
) {
    let sql = 
   `SELECT *
    FROM dionis_oper AS do 
    WHERE do.id_dionis = (SELECT do1.id_dionis FROM dionis_oper AS do1 WHERE do1.id=${id_dionis_oper}) 
    AND do.date_time < (SELECT do2.date_time FROM dionis_oper AS do2 WHERE do2.id=${id_dionis_oper})
    AND do.id_oper_type = ${id_oper_type2}
    ORDER BY do.date_time DESC LIMIT 1`

    let res = await runSQL_p(sql)
    let data = await JSON.parse(res)[0]

    return data
}


// загрузка типов таксономии -------------------------------------------------
async function id_taxonomy_2_types(id_taxonomy) {
    let response = await fetch(`myphp/loadDataTypes.php?t=${id_taxonomy}`);
    let data = await response.json();
    return data;
}


async function id_oper_2_model_content(id_oper) {
    let response = await fetch(`myphp/id_oper_2_model_content.php?o=${id_oper}`)
    let data = await response.json()
    return data
}


async function recalc_mts(id_mts) {
    let response = await fetch(`myphp/recalc_mts.php?m=${id_mts}`)
    let data = await response.json()
    return data[0];
}



async function id_mts_2_last_oper(id_mts) {
    let response = await fetch(`myphp/id_mts_2_last_oper.php?m=${id_mts}`)
    let data = await response.json()
    return data[0]
}


//=======================================================================================
// id -> все данные
//=======================================================================================
async function id_2_data(id, table) {
    let response = await fetch(`myphp/id_2_data.php?t=${table}&i=${id}`)
    let data = await response.json()
    return data[0]
}

//=======================================================================================
// id_depart (id отдела) -> все данные отдела
//=======================================================================================
async function id_depart_2_data(id_depart) {
    if (id_depart == 0) return {name: ''}
    let response = await fetch(`myphp/id_depart_2_data.php?i=${id_depart}`)
    let data = await response.json()
    return data[0]
}

//=======================================================================================
// depart (название отдела) -> все данные отдела
//=======================================================================================
async function getDepart(depart) {
    let response = await fetch(`myphp/getDepart.php?d=${depart}`)
    let data = await response.json()
    return data[0]
}

//=======================================================================================
// id_depart (id отдела) -> все данные начальника отдела
//=======================================================================================
async function getBoss(id_depart) {
    if (id_depart == 0 ) return {id: 0, name: ''}
    let response = await fetch(`myphp/getBoss.php?d=${id_depart}`)
    let data = await response.json()
    if (data.length == 0 ) return {id: 0, name: ''}
    return data[0]
}

//=======================================================================================
// taxonomy (имя таксономии) -> все типы таксономии
//=======================================================================================
async function getTypes(taxonomy) {
    let response = await fetch(`myphp/getTypes.php?t=${taxonomy}`)
    let data = await response.json()
    return data
}

//=======================================================================================
// id_user (id пользователя) -> должность (нач или и.о.) + отдел
//=======================================================================================
async function id_user_2_title_depart(id_user) {
    if (id_user == 0) return ''
    const d_user = await id_user_2_data(id_user)
    const d_depart = await id_depart_2_data(d_user.id_depart)
    return (d_user.title + ' ' + txt2dat(d_depart.name)).toLowerCase()
}

//=======================================================================================
// id_user (id пользователя) -> должность
//=======================================================================================
async function id_user_2_data(id_user) {
    if (!!!id_user || id_user == 0) return {id: 0, name: '', title: '', id_depart: 0}
    let response = await fetch(`myphp/id_user_2_data.php?u=${id_user}`)
    let data = await response.json()
    return data[0]
}

//=======================================================================================
// id_user (id пользователя) -> должность
//=======================================================================================
async function idUser2Title(id_user) {
}

//=======================================================================================
// id_user (id пользователя) -> отдел
//=======================================================================================
async function idUser2Depart(id_user) {
}

//////////////////// УВЕЛИЧЕНИЕ ВЕРСИИ ДАННЫХ ТАБЛИЦЫ НА ЕДИНИЦУ ////////////////////////////
// table_name - имя проверяемой таблицы                                                    //
// id_key - значение индекса поля с именем name_key                                        //
// name_key - имя поля, по которому фильтруются записи таблицы                             //
/////////////////////////////////////////////////////////////////////////////////////////////

async function verInc(table_name, id_key, name_key) {
    let response = await fetch(`myphp/verInc.php?t=${table_name}&k=${id_key}&n=${name_key}`)
}

///////////////////// ПРОВЕРКА ТАБЛИЦЫ НА НОВУЮ ВЕРСИЮ ДАННЫХ ///////////////////////////////
// table_name - имя проверяемой таблицы                                                    //
// id_key - значение индекса поля с именем name_key                                        //
// name_key - имя поля, по которому фильтруются записи таблицы                             //
// ver_old - номер предыдущей версии данных, с которым сравнивается номер текущей версии   //
/////////////////////////////////////////////////////////////////////////////////////////////

async function isVerNew(table_name, id_key, name_key, ver_old) {
    let response = await fetch(`myphp/isVerNew.php?t=${table_name}&k=${id_key}&n=${name_key}&v=${ver_old}`)
    let data = await response.json()
    return data[0]
}

//////////////////////////// ПОЛУЧЕНИЕ ВЕРСИИ ДАННЫХ ТАБЛИЦЫ  ///////////////////////////////
// table_name - имя проверяемой таблицы                                                    //
// id_key - значение индекса поля с именем name_key                                        //
// name_key - имя поля, по которому фильтруются записи таблицы                             //
/////////////////////////////////////////////////////////////////////////////////////////////

async function verGet(table_name, id_key, name_key) {
    const response = await fetch(`myphp/verGet.php?t=${table_name}&k=${id_key}&n=${name_key}`)
    const data = await response.json()
    return data[0]
}

//=======================================================================================
// определение ID и СОНО пользователя
//=======================================================================================
async function account2data(account) {
    let response = await fetch('myphp/account2data.php?a=' + account);
    let data = await response.json();
    return data;
}

//=======================================================================================
// определение модулей, доступных пользователю
//=======================================================================================
async function id2modules(id_user) {
    //alert('id2modules-1');
    let response = await fetch('myphp/id2modules.php?id=' + id_user);
    let data = await response.json();
    //alert('id2modules-2');
    return data;
}

//=======================================================================================
// определение ролей пользователя
//=======================================================================================
async function id2roles(id_user) {
    let response = await fetch('myphp/id2roles.php?id=' + id_user)
    let data = await response.json()
    return data
}

// определение id последнего скана Maxpatrol ===================================================
async function get_id_scan_last() {
    let response = await fetch('myphp/get_id_scan_last.php');
    let scanlast = await response.text();
    return scanlast;
}

// определение ip адреса пользователя ===================================================
async function get_ip() {
    let response = await fetch('myphp/get_ip.php');
    let ip = await response.text();
    return ip;
}

// загрузка селектора ---------------------------------------------------------
async function loadSelector(table) {
    let response = await fetch('myphp/loadSelector.php?t=' + table);
    let selector = await response.json();
    return selector;
}

async function insertDBRecord_p(o, table) {
    o.mysql_table = table;
    let response = await fetch('myphp/insertDBRecord.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(o),
    });
    let result = await response.text();
    return result;
}





function insertDBRecord(o, table) {
    let xh = new XMLHttpRequest();
    xh.open("POST", "myphp/insertDBRecord.php", true);
    xh.setRequestHeader("Content-Type", "application/json");
    xh.onreadystatechange = function () {
        if (xh.readyState === 4 && xh.status === 200) { }
    };
    o.mysql_table = table;
    xh.send(JSON.stringify(o));
}

// сохранение измененной записи в через обобщенный микросервис updateDBRecord.php ==========
function updateDBRecord(o, table) {
    let xh = new XMLHttpRequest();
    xh.open("POST", "myphp/updateDBRecord.php", true);
    xh.setRequestHeader("Content-Type", "application/json");
    xh.onreadystatechange = function () {
        if (xh.readyState === 4 && xh.status === 200) { }
    };
    o.mysql_table = table;
    xh.send(JSON.stringify(o));
}

// сохранение измененной записи в через обобщенный микросервис updateTable.php ==========
function updateTable(o) {
    let xh = new XMLHttpRequest();
    xh.open("POST", "myphp/updateTable.php", true);
    xh.setRequestHeader("Content-Type", "application/json");
    xh.onreadystatechange = function () {
        if (xh.readyState === 4 && xh.status === 200) {
            //console.log(this.responseText);
        }
    };
    xh.send(JSON.stringify(o));
}

// сохранение измененной записи в через микросервис srv_php =============================
function updateREC(o, srv_php) {
    let xh = new XMLHttpRequest();
    xh.open("POST", srv_php, false);
    xh.setRequestHeader("Content-Type", "application/json");
    xh.onreadystatechange = function () {
        if (xh.readyState === 4 && xh.status === 200) {
            //console.log(this.responseText);
        }
    };
    xh.send(JSON.stringify(o));
}

// загрузка справочника категорий узлов -------------------------------------------------
async function loadCategories() {
    let response = await fetch('myphp/loadDataCategories.php');
    let data = await response.text();
    return data;
}

// загрузка списка компьютеров, на которых найдена уязвимость с id_vulner в скане id_scan
async function loadVulnerComps(id_vulner, id_scan) {
    let response = await fetch('myphp/loadDataVulnerComps.php?v=' + id_vulner + '&s=' + id_scan);
    let data = await response.text();
    console.log('id_vulner, id_scan, comps = ', id_vulner + ' ' + id_scan + ' ' + data);
    return data;
}

// загрузка списка компьютеров АРМов, на которых установлено ПО id_prog
function loadGroupARMs(id_prog, sono) {
    let arms = "";
    let xh = new XMLHttpRequest();
    xh.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            arms = this.responseText;
        }
    };
    xh.open(
        "GET",
        "myphp/loadDataGroupARMs.php?p=" + id_prog + "&s=" + sono,
        false
    );
    xh.send();
    return arms;
}

// сохранение измененной записи в через обощенный микросервис ===========================
function updateRequest(o) {
    let xh = new XMLHttpRequest();
    xh.open("POST", "myphp/updateRequest.php", true);
    xh.setRequestHeader("Content-Type", "application/json");
    xh.onreadystatechange = function () {
        if (xh.readyState === 4 && xh.status === 200) {
            //console.log(this.responseText);
        }
    };
    xh.send(JSON.stringify(o));
}

// добавление записи в через обобщенный микросервис updateDBRecord.php ==================
//async function autentUser(user) {
//    let usr = "regions\\" + user.usr;
//    let pwd = (user.pwd == "") ? "123" : user.pwd;
//    let o = { usr: usr, pwd: pwd };
//
//    let response = await fetch('myphp/regUser1.php', {
//        method: 'POST',
//        headers: {'Content-Type': 'application/json'},
//        body: JSON.stringify(o),
//    });
//
//    let result = await response.text();
//    return result;
//}


//=======================================================================================
// аутентификация пользователя в домене =================================================
//=======================================================================================
async function autentUser(user) {
    console.log('autentUser START')
    let usr = "regions\\" + user.usr;
    let pwd = (user.pwd == "") ? "123" : user.pwd;
    let o = { usr: usr, pwd: pwd };

    let response = await fetch('myphp/regUser1.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(o),
    });

    let result = await response.text();
    console.log('autentUser result = ', result)
    return result;
}
// запись статуса программы в таблицу SOFT-------------------------------------------------
function setSoftStatus(id_soft, id_status, soft_name) {
    //console.log( "myphp/setSoftStatus.php?id=" + id_soft.toString() + "&id_status=" + id_status );
    let xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log("STATUS SET");
            //console.log(this.responseText);
        }
    };
    xhttp.open(
        "GET",
        "myphp/setSoftStatus.php?id_soft=" +
        id_soft.toString() +
        "&id_status=" +
        id_status +
        "&soft_name=" +
        soft_name,
        true
    );
    xhttp.send();
}

// тестирование PHP модуля ---------------------------------------------------------
function testPHP() {
    let xh = new XMLHttpRequest();
    xh.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            resp = this.responseText;
            //console.log("TEST:", resp);
        }
    };
    xh.open("GET", "myphp/loadDataSoftComp.php?s=6871,i=" + ifns_auth, false);
    xh.send();
}

// выполнить SQL запрос pomise ==========================================================
function runSQL_p(sql) {
    return new Promise(function (resolve, reject) {
        // console.log("runSQL_p: sql=", sql);
        let o = { sql };

        let xh = new XMLHttpRequest();
        xh.open("POST", "myphp/runSQL.php", true);
        xh.setRequestHeader("Content-Type", "application/json");

        xh.onreadystatechange = function () {
            if (xh.readyState === 4 && xh.status === 200) {
                resolve(this.responseText);
            }
        };

        xh.send(JSON.stringify(o));
    });
}

// выполнить SQL запрос =================================================================
function runSQL(sql) {
    let o = { sql };

    let xh = new XMLHttpRequest();
    xh.open("POST", "myphp/runSQL.php", true);
    xh.setRequestHeader("Content-Type", "application/json");

    xh.onreadystatechange = function () {
        if (xh.readyState === 4 && xh.status === 200) {
            //console.log(this.responseText);
        }
    };

    xh.send(JSON.stringify(o));
}

// определение СОНО пользователя ========================================================
function get_sono(mask) {
    if (mask == "10.161.214.0") {
        ifns_sono = "6100";
        return;
    }

    if (mask == "10.197.61.0") {
        ifns_sono = "6100";
        return;
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            ifns_sono = this.responseText;
        }
    };
    xhttp.open("GET", "myphp/get_sono.php?m=" + mask, false);
    xhttp.send();
}

// ======================================================================================
function usrCheck(u, p) {
    let xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log("this.responseText:", this.responseText);
        }
    };
    xhttp.open(
        "GET",
        "myphp/regUser.php?u=" + u.toString() + "&p=" + p.toString(),
        true
    );
    xhttp.send();
}

// загрузка полного списка ПО в массив tableDataSoft---------------------------------
//function loadSoft(id,fcreateTabulator,appH) {
//  let xhttp;
//  xhttp = new XMLHttpRequest();
//  xhttp.onreadystatechange = function() {
//    if (this.readyState == 4 && this.status == 200) {
//        tableDataSoft = JSON.parse(this.responseText);
//        fcreateTabulator(id,appH);
//    }
//  };
//  xhttp.open("GET", "myphp/loadDataSoft.php", true);  xhttp.send();
//}

// загрузка полного списка АРМ в массив tableDataComp--------------------------------
//function loadComp(id,fcreateTabulator,appH) {
//  let xhttp;
//  xhttp = new XMLHttpRequest();
//  xhttp.onreadystatechange = function() {
//    if (this.readyState == 4 && this.status == 200) {
//        tableDataComp = JSON.parse(this.responseText);
//        fcreateTabulator(id,appH);
//    }
//  };
//  xhttp.open("GET", "myphp/loadDataComp.php?i="+ifns_auth, true);  xhttp.send();
//}

// сохранение измененной записи в таблице LVS_TYPE =========================================================
//function cEditLVST (o) {
//  let xh = new XMLHttpRequest();
//  let url = "myphp/updateLVST.php";
//  xh.open("POST", url, true);
//  xh.setRequestHeader("Content-Type", "application/json");
//  xh.onreadystatechange = function () {
//    if (xh.readyState === 4 && xh.status === 200)
//       sel_LVST = loadSelector("lvs_type");
//       listLVS();
//       listLVST();
//  }
//  xh.send(JSON.stringify(o));
//}

// сохранение измененной записи в таблице LVS ===========================================
//function cEditLVS (o) {
//  //if (typeof o.sono        == "undefined") o.sono        =  0;
//  //if (typeof o.ip          == "undefined") o.ip          = "";
//  //if (typeof o.mask        == "undefined") o.mask        = "";
//  //if (typeof o.nbit        == "undefined") o.nbit        = "";
//  //if (typeof o.comment     == "undefined") o.comment     = "";
//  //if (typeof o.gw          == "undefined") o.gw          = "";
//
//  //if (o.id_lvs_type>0) { o.id_lvs_type = tableLVST.getRows().filter((row) => {return row.getData().name==o.nametype})[0].getIndex();  }
//
//  //if (typeof o.id_lvs_type == "undefined") o.id_lvs_type =  0;
//
//
//  let xh = new XMLHttpRequest();
//  let url = "myphp/updateLVS.php";
//  xh.open("POST", url, true);
//  xh.setRequestHeader("Content-Type", "application/json");
//  xh.onreadystatechange = function () {
//    if (xh.readyState === 4 && xh.status === 200)
//      console.log(this.responseText);
//  }
//
//  xh.send(JSON.stringify(o));
//}
