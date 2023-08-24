function mAdmin() {    
    let appHeight = appBodyHeight();

    let tMOD = '<div id="tabMod"    style="display: inline-block; height: 50%; width: 50%;"></div>';
    let tMG  = '<div id="tabModGrp" style="display: inline-block; height: 50%; width: 50%;"></div>';
    let tGRP = '<div id="tabGrp"    style="display: inline-block; height: 50%; width: 50%;"></div>';
    let tGU  = '<div id="tabGrpUsr" style="display: inline-block; height: 50%; width: 50%;"></div>';

    //$("#appBody").html(tMOD + tMG + tGRP + tGU);
    document.getElementById('appBody').innerHTML = tMOD + tMG + tGRP + tGU;
    $("#appBody").height(appHeight);
    //$("#appBody").html('<div id="tabModUsr"><div id="tabMod"></div><div id="tabUsr"></div></div>');

    createTabulatorMod(    "tabMod",    appBodyHeight()/2 );
    createTabulatorModGrp( "tabModGrp", appBodyHeight()/2 );
  //createTabulatorUsr(    "tabModGrp", appBodyHeight()/2 );
    createTabulatorGrp(    "tabGrp",    appBodyHeight()/2 );
    createTabulatorGrpUsr( "tabGrpUsr", appBodyHeight()/2 );
}

//=======================================================================================
// табулятор списка модулей
//=======================================================================================

function createTabulatorMod(id_div, appH) { 
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let bADD = (allow.C == 1) ? "<button id='addMod' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.D == 1) ? "<button id='delMod' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let ms = bDEL + bADD;

    tableMod = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataModule.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Программные модули<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",

        columns: [
          //{ title: "id",                      field: "id", width: 50, print: false },
            { title: "№",                       field: "i_module",  width: 50, editor: ed },
            { title: "имя модуля",              field: "name",  headerFilter: true, widthGrow: 5, topCalc: "count", editor: ed, },
            { title: "заголовок модуля в меню", field: "title", headerFilter: true, widthGrow: 10, editor: ed, },
        ],

        rowFormatter: function (row) {
            rowFormatterCursor(row, g_tableMod);
        },
        renderStarted: function () {
            renderStartedCursor(tableMod, g_tableMod);
            tableModGrp.setFilter("id_module", "=", g_tableMod.id_current);
            tableModGrp.columnManager.columns[0].titleElement.textContent = 'групы модуля "' + g_tableMod.row_current.getData().title + '"';
        },
        rowClick: function (e, row) {
            rowClickCursor(row, g_tableMod);
            tableModGrp.setFilter("id_module", "=", g_tableMod.id_current);
            tableModGrp.columnManager.columns[0].titleElement.textContent = 'групы модуля "' + g_tableMod.row_current.getData().title + '"';
          //let id = tableModGrp.rowManager.activeRows[0].data.id;
          //let r = tableModGrp.searchRows("id", "=", id)[0];
          //rowClickCursor(r, g_tableModGrp)
        },
        cellEdited: function (cell) {
            let o = cell.getRow().getData();
            runSQL(`UPDATE module SET i_module=${o.i_module}, name="${o.name}", title="${o.title}" WHERE id=${o.id}`);
        },

        footerElement: ms,
    });

    // кнопка добавления нового модуля --------------------------------------------------
    $("#addMod").click(function () {
        runSQL_p(`INSERT INTO module VALUES ()`)
            .then((id) => {
                tableMod.replaceData();
                g_tableMod.id_current = parseInt(id);
            });
    });

    // кнопка удаления  модуля ----------------------------------------------------------
    $("#delMod").click(function () {
        dialogYESNO("Модуль:" + "<br><b>«" + g_tableMod.row_current.getData().name + "»<br>«" + g_tableMod.row_current.getData().title + "»</b><br>будет удален, вы уверены?<br>")
            .then(() => {
                //if (result != "YES") return;
                return runSQL_p(`DELETE FROM user_module WHERE id_module=${g_tableMod.id_current}`);
            })
            .then(() => {
                return runSQL_p(`DELETE FROM module WHERE id=${g_tableMod.id_current}`);
            })
            .then(() => {
                g_tableMod.id_current = 0;
                tableMod.replaceData("myphp/loadDataModule.php");
                g_tableMod.id_current = 0;
            });            
    });

    document.getElementById(id_div).style.display = 'inline-block';
}

//=======================================================================================
// табулятор списка групп пользователей
//=======================================================================================

function createTabulatorGrp(id_div, appH) { 
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let bADD = (allow.C == 1) ? "<button id='addGrp' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.D == 1) ? "<button id='delGrp' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let ms = bDEL + bADD;

    tableGrp = new Tabulator( '#' + id_div, {
        ajaxURL: "myphp/loadDataGroup.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Группы пользователей<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",

        columns: [
          //{ title: "id", field: "id", width: 50, print: false },
            { title: "группа пользователей", field: "name", headerFilter: true, widthGrow: 5, topCalc: "count", editor: ed, },
            { title: "роль", field: "role", headerFilter: true, widthGrow: 5, editor: ed, },
            { title: "описание группы", field: "description", headerFilter: true, widthGrow: 10, editor: ed, },
        ],

        rowFormatter: function (row) {
            rowFormatterCursor(row, g_tableGrp);
        },
        renderStarted: function () {
            renderStartedCursor(tableGrp, g_tableGrp);
            tableGrpUsr.setFilter("id_group", "=", g_tableGrp.id_current);
            tableGrpUsr.columnManager.columns[1].titleElement.textContent = 'пользователи - члены групы "' + g_tableGrp.row_current.getData().name + '"';
        },
        rowClick: function (e, row) {
            rowClickCursor(row, g_tableGrp);
            tableGrpUsr.setFilter("id_group", "=", g_tableGrp.id_current);
            tableGrpUsr.columnManager.columns[1].titleElement.textContent = 'пользователи - члены групы "' + g_tableGrp.row_current.getData().name + '"';
//            let id = tableGrpUsr.rowManager.activeRows[0].data.id;
//            let r  = tableGrpUsr.searchRows("id", "=", id)[0];
//            rowClickCursor(r, g_tableGrpUsr)
        },
        cellEdited: function (cell) {
            let o = cell.getRow().getData();
            runSQL_p(`UPDATE group_of_users SET name="${o.name}", description="${o.description}", role="${o.role}" WHERE id=${o.id}`);
        },

        footerElement: ms,
    });

    // кнопка добавления новой группы ---------------------------------------------------
    $("#addGrp").click(function () {
        runSQL_p(`INSERT INTO group_of_users VALUES ()`)
            .then((id) => {
                tableGrp.replaceData();
                g_tableGrp.id_current = parseInt(id);
            });
    });

    // кнопка удаления  модуля ----------------------------------------------------------
    $("#delGrp").click(function () {
        dialogYESNO("Группа пользователей:" + "<br><b>«" + g_tableGrp.row_current.getData().name + "»</b><br>будет удалена, вы уверены?<br>")
            .then(() => {
                return runSQL_p(`DELETE FROM group_module WHERE id_group=${g_tableGrp.id_current}`);
            })
            .then(() => {
                return runSQL_p(`DELETE FROM group_of_users WHERE id=${g_tableGrp.id_current}`);
            })
            .then(() => {
                g_tableGrp.id_current = 0;
                tableGrp.replaceData("myphp/loadDataGroup.php");
                g_tableGrp.id_current = 0;
            });            
    });

    document.getElementById(id_div).style.display = 'inline-block';
}

//=======================================================================================
// табулятор списка групп модуля
//=======================================================================================

function createTabulatorModGrp(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let bADD = (allow.C == 1) ? "<button id='addModGrp' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.D == 1) ? "<button id='delModGrp' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let ms = bDEL + bADD;

    tableModGrp = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataModGrp.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        //ajaxParams: { i: id_mod },
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Список групп модуля<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        //initialFilter: [    { field: "id_module", type: "=", value: f }    ],

        columns: [
          //{ title: "id",     field: "id",        width: 50, print: false },
          //{ title: "id_mod", field: "id_module", width: 50, print: false },
          //{ title: "id_grp", field: "id_group",  width: 50, print: false },
            { title: "группа пользователей",    field: "name",      widthGrow: 5, headerFilter: true },
            { title: "Чтение",      field: "allow_R",   widthGrow: 1, editor: ed, headerSort:false },
            { title: "Запись",      field: "allow_E",   widthGrow: 1, editor: ed, headerSort:false },
            { title: "Создание",    field: "allow_C",   widthGrow: 1, editor: ed, headerSort:false },
            { title: "Удаление",    field: "allow_D",   widthGrow: 1, editor: ed, headerSort:false },
            { title: "Aдмин",       field: "allow_A",   widthGrow: 1, editor: ed, headerSort:false, editorParams:{ min:0, max:1, step:1 } },
        ],

        rowFormatter: function (row) {  rowFormatterCursor(row, g_tableModGrp);  },
        renderStarted: function () {  renderStartedCursor(tableModGrp, g_tableModGrp);  },
        rowClick: function (e, row) { rowClickCursor(row, g_tableModGrp) },

        cellEdited: function (cell) {
            let o = cell.getRow().getData();
//          let sql = `UPDATE module_group
//                 SET id_group  = ${o.id_group}, 
//                     id_module = ${o.id_module}, 
//                     i_module  = ${o.i_module}, 
//                     allow_R   = ${o.allow_R}, 
//                     allow_E   = ${o.allow_E}, 
//                     allow_C   = ${o.allow_C}, 
//                     allow_D   = ${o.allow_D},
//                     allow_A   = ${o.allow_A} 
//                 WHERE id_user = ${o.id_user} AND id_module = ${o.id_module}`;
            let sql = `UPDATE module_group
            SET id_group  = ${o.id_group}, 
                id_module = ${o.id_module}, 
                i_module  = ${o.i_module}, 
                allow_R   = ${o.allow_R}, 
                allow_E   = ${o.allow_E}, 
                allow_C   = ${o.allow_C}, 
                allow_D   = ${o.allow_D},
                allow_A   = ${o.allow_A} WHERE id = ${o.id}`;
            runSQL_p(sql);
        },
        footerElement: ms,
    });

    tableModGrp.setFilter("id_module", "=", g_tableMod.id_current);

    // кнопка удаления группы из модуля -------------------------------------------
    $("#delModGrp").click(function () {
        dialogYESNO("Группа:" + "<br><b>«" + g_tableModGrp.row_current.getData().name + "»</b><br>будет удалена из списка доступа к модулю:<br><b>«" + g_tableMod.row_current.getData().name + "»<br>«" + g_tableMod.row_current.getData().title + "»</b><br>вы уверены?<br>")
            .then(() => {
                return runSQL_p(`DELETE FROM module_group WHERE id=${g_tableModGrp.id_current}`);
            })
            .then(() => {
                g_tableModGrp.id_current = 0;
                tableModGrp.replaceData("myphp/loadDataModGrp.php");
            });
    });

    // кнопка добавление группы к модулю ------------------------------------------
    $("#addModGrp").click(function () {
        selectVocab('group_of_users', 'name', -1, 'группы пользователей')
            .then(group => {
                    let sql = `INSERT INTO module_group (id_module, id_group) VALUES (${g_tableMod.id_current},${group.id})`;
                    runSQL_p(sql)
                        .then(id => tableModGrp.addData(
                            [{
                                id: id,
                                id_group:  group.id,
                                id_module: g_tableMod.id_current,
                                name:      group.name,
                                allow_R: 0,
                                allow_E: 0,
                                allow_C: 0,
                                allow_D: 0,
                                allow_A: 0,
                            }],
                            false
                        ));

            });
    });

    document.getElementById(id_div).style.display = 'inline-block';
}


//=======================================================================================
// табулятор пользователей - членов группы
//=======================================================================================

function createTabulatorGrpUsr(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let bADD = (allow.C == 1) ? "<button id='addGrpUsr' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.D == 1) ? "<button id='delGrpUsr' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let ms = bDEL + bADD;

    tableGrpUsr = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataGrpUsr.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        //ajaxParams: { i: id_mod },
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Список членов группы<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",

        columns: [
          //{ title: "id", field: "id", width: 50, print: false },
          //{ title: "id_group", field: "id_group", width: 50, print: false },
          //{ title: "id_user", field: "id_user", width: 50, print: false },
            { title: "логин", field: "account", widthGrow: 2, headerFilter: true, topCalc: "count" },
            { title: "пользователь - член группы", field: "name", widthGrow: 5, headerFilter: true },
        ],

        rowFormatter: function (row) {  rowFormatterCursor(row, g_tableGrpUsr);  },
        renderStarted: function () {  renderStartedCursor(tableGrpUsr, g_tableGrpUsr);  },
        rowClick: function (e, row) { rowClickCursor(row, g_tableGrpUsr) },
        cellEdited: function (cell) {
        },
        footerElement: ms,
    });

    tableGrpUsr.setFilter("id_group", "=", g_tableGrp.id_current);

    // кнопка удаления пользователя из группы -------------------------------------------
    $("#delGrpUsr").click(function () {
        dialogYESNO("Пользователь:" + "<br><b>«" + g_tableGrpUsr.row_current.getData().name + "»</b><br>будет удален из группы:<br><b>«" + g_tableGrp.row_current.getData().name + "»<br>«" + g_tableMod.row_current.getData().title + "»</b><br>вы уверены?<br>")
            .then(() => {
                return runSQL_p(`DELETE FROM group_user WHERE id=${g_tableGrpUsr.id_current}`);
            })
            .then(() => {
                g_tableGrpUsr.id_current = 0;
                tableGrpUsr.replaceData("myphp/loadDataGrpUsr.php");
            });
    });

    // кнопка добавление пользователя к группе ------------------------------------------
    $("#addGrpUsr").click(function () {
        selectUser('', '2')
            .then(result => {
                result.forEach(user => {
                    let sql = `INSERT INTO group_user (id_group, id_user) VALUES (${g_tableGrp.id_current}, ${user.id})`;
                    runSQL_p(sql)
                        .then(id => tableGrpUsr.addData(
                            [{
                                id:       id,
                                id_user:  user.id,
                                id_group: g_tableGrp.id_current,
                                name:     user.name,
                                account:  user.Account,
                            }],
                            false
                        ));
                });

            });
    });

    document.getElementById(id_div).style.display = 'inline-block';
}


//=======================================================================================
// табулятор списка пользователей модулея ===============================================
//=======================================================================================

//function createTabulatorUsr(id_div, appH) {
//    let allow = getAllows();
//    let ed = (allow.E == 1) ? "input" : "";
//    let bADD = (allow.C == 1) ? "<button id='addUsr' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
//    let bDEL = (allow.D == 1) ? "<button id='delUsr' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
//    let ms = bDEL + bADD;
//
//    tableUsr = new Tabulator('#'+id_div, {
//        ajaxURL: "myphp/loadDataModUsr.php",
//        ajaxConfig: "GET",
//        ajaxContentType: "json",
//        //ajaxParams: { i: id_mod },
//        height: appH,
//        layout: "fitColumns",
//        tooltipsHeader: true,
//        printAsHtml: true,
//        printHeader: "<h1>Список пользователей модуля<h1>",
//        printFooter: "",
//        rowContextMenu: rowMenu(),
//        headerFilterPlaceholder: "",
//        //initialFilter: [    { field: "id_module", type: "=", value: f }    ],
//
//        columns: [
//            //{ title: "id", field: "id", widthGrow: 1, print: false },
//            //{ title: "id_mod", field: "id_module", widthGrow: 1, print: false },
//            //{ title: "id_usr", field: "id_user", widthGrow: 1, print: false },
//            { title: "№", field: "i_module", widthGrow: 1, editor: ed },
//            { title: "логин", field: "account", widthGrow: 5, headerFilter: true, topCalc: "count" },
//            { title: "имя", field: "name", widthGrow: 5, headerFilter: true },
//            { title: "R", field: "allow_R", widthGrow: 1, editor: ed, headerSort:false },
//            { title: "W", field: "allow_E", widthGrow: 1, editor: ed, headerSort:false },
//            { title: "C", field: "allow_C", widthGrow: 1, editor: ed, headerSort:false },
//            { title: "D", field: "allow_D", widthGrow: 1, editor: ed, headerSort:false },
//            { title: "A", field: "allow_A", widthGrow: 1, editor: ed, headerSort:false },
//        ],
//
//        rowFormatter: function (row) {  rowFormatterCursor(row, g_tableUsr);  },
//        renderStarted: function () {  renderStartedCursor(tableUsr, g_tableUsr);  },
//        rowClick: function (e, row) { rowClickCursor(row, g_tableUsr) },
//
//        cellEdited: function (cell) {
//            let o = cell.getRow().getData();
//            let sql = `UPDATE user_module 
//                   SET id_user=${o.id_user}, 
//                       id_module=${o.id_module}, 
//                       i_module=${o.i_module}, 
//                       allow_R=${o.allow_R}, 
//                       allow_E=${o.allow_E}, 
//                       allow_C=${o.allow_C}, 
//                       allow_D=${o.allow_D},
//                       allow_A=${o.allow_A} 
//                   WHERE id_user=${o.id_user} AND id_module=${o.id_module}`;
//            runSQL(sql);
//        },
//        footerElement: ms,
//    });
//
//    tableUsr.setFilter("id_module", "=", g_tableMod.id_current);
//
//    // кнопка удаления пользователя из модуля -------------------------------------------
//    $("#delUsr").click(function () {
//        dialogYESNO("Пользователь:" + "<br><b>«" + g_tableUsr.row_current.getData().name + "»</b><br>будет удален из списка доступа к модулю:<br><b>«" + g_tableMod.row_current.getData().name + "»<br>«" + g_tableMod.row_current.getData().title + "»</b><br>будет удален, вы уверены?<br>")
//            .then(() => {
//                return runSQL_p(`DELETE FROM user_module WHERE id=${g_tableUsr.id_current}`);
//            })
//            .then(() => {
//                g_tableUsr.id_current = 0;
//                tableUsr.replaceData("myphp/loadDataModUsr.php");
//            });
//    });
//
//    // кнопка добавление пользователя к модулю ------------------------------------------
//    $("#addUsr").click(function () {
//        selectUser('', '2')
//            .then(result => {
//                result.forEach(user => {
//                    let sql = `INSERT INTO user_module (id_module,id_user) VALUES (${g_tableMod.id_current},${user.id})`;
//                    runSQL_p(sql)
//                        .then(id => tableUsr.addData(
//                            [{
//                                id: id,
//                                id_user: user.id,
//                                id_module: g_tableMod.id_current,
//                                name: user.name,
//                                account: user.Account,
//                                allow_R: 0,
//                                allow_E: 0,
//                                allow_C: 0,
//                                allow_D: 0,
//                                allow_A: 0,
//                            }],
//                            false
//                        ));
//                });
//
//            });
//    });
//
//    document.getElementById(id_div).style.display = 'inline-block';
//}


