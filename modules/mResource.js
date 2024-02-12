function mResource() {
    let appHeight = appBodyHeight();
    //appHeight = appHeight - 40;

    let tTyp = '<div id="tabTyp" style="display: inline-block; height: 100%; width: 10%;"></div>';
    let tRes = '<div id="tabRes" style="display: inline-block; height: 100%; width: 35%;"></div>';
    let tUsr = '<div id="tabCmp" style="display: inline-block; height: 100%; width: 55%;"></div>';

    document.getElementById('appBody').innerHTML    =  tTyp + tRes + tUsr;
    document.getElementById('appBody').style.height = appHeight;

    createTabTyp("tabTyp", appHeight);
    createTabRes("tabRes", appHeight);
    createTabCmp("tabCmp", appHeight);

    document.getElementById('tabTyp').style.display = 'inline-block';
    document.getElementById('tabRes').style.display = 'inline-block';
    document.getElementById('tabCmp').style.display = 'inline-block';
    
}

//=======================================================================================
//  табулятор типов ресурсов
//=======================================================================================

function createTabTyp(id_div, appH) {
    let allow = getAllows();
    let ed   = (allow.A == 1) ? "input" : "";
    let bADD = (allow.A == 1) ? "<button id='addTyp' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.A == 1) ? "<button id='delTyp' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let msgF = bDEL + bADD;

    tableResTyp = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataResTyp.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>тип ресурса<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",

        columns: [
            //{ title: "id", field: "id", headerFilter: true, width: 50 },
            { title: "тип ресурса", field: "name", headerFilter: true, topCalc: "count", headerSort:false, editor: ed, },
        ],

        rowFormatter: function (row) {
            rowFormatterCursor(row, g_tableResTyp);
        },
        renderStarted: function () {
            renderStartedCursor(tableResTyp, g_tableResTyp);
            tableResRes.setFilter("id_type", "=", g_tableResTyp.id_current);
            //tableResCmp.setFilter("id_res",  "=", g_tableResRes.id_current);
        },
        tableBuilt:function(){
        },
        rowClick: function (e, row) {
            rowClickCursor(row, g_tableResTyp);
            tableResRes.setFilter("id_type", "=", g_tableResTyp.id_current);
            if (!tableResRes.rowManager.activeRows.length) return;
            let id = tableResRes.rowManager.activeRows[0].data.id;
            let r  = tableResRes.searchRows("id", "=", id)[0];
            rowClickCursor(r, g_tableResRes);
            tableResCmpSetFilter(dt_now);
        },
        cellEdited: function (cell) {
            let o = cell.getRow().getData();
            runSQL_p(`UPDATE res_type SET name="${o.name}" WHERE id=${o.id}`);
        },

        footerElement: msgF,
    });

    (bADD) ? document.getElementById("addTyp").onclick = function () {  
        runSQL_p(`INSERT INTO res_type (name) VALUES ('')`)
        .then((id) => {
            tableResTyp.addData([{
                id: id,
                name: '',
            }], true);
            let row = tableResTyp.searchRows('id', '=', id)[0];
            rowClickCursor(row, tableResTyp);
            tableResTyp.scrollToRow(id, "top", false);
            tableResRes.setFilter("id_type", "=", g_tableResTyp.id_current);
            //createTabulatorDD(appH);
            //g_tableSZ.id_current = parseInt(id);
        });
    } : 0;
    (bDEL) ? document.getElementById("delTyp").onclick = function () {
        if (!g_tableResTyp.id_current) return;
        r = g_tableResTyp.row_current.getData();
        dialogYESNO("Тип ресурса:<br>" + "id:" + r.id + "<br>" + r.name + "<br>" + "</b><br>будет удален, вы уверены?<br>")
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM res_type WHERE id=${g_tableResTyp.id_current}`)
                        .then((res) => {
                            g_tableResTyp.id_current = 0;
                            tableResTyp.replaceData("myphp/loadDataResTyp.php");
                            g_tableResTyp.id_current = 0;
                        });
                }
            });
    } : 0;
}

//=======================================================================================
//  табулятор ресурсов
//=======================================================================================

function createTabRes(id_div, appH) {
    let allow = getAllows();
    let ed   = (allow.E == 1) ? "input" : "";
    let bADD = (allow.C == 1) ? "<button id='addRes' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.D == 1) ? "<button id='delRes' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let msgF = bDEL + bADD;

    g_tableResRes.id_current = 0;
    
    tableResRes = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataResRes.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>ресурсы<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",

        columns: [
            //{ title: "id_typ", field: "id_type", headerFilter: true, width: 50 },
            //{ title: "id", field: "id", headerFilter: true, width: 50 },
            { title: '№',  formatter:"rownum", hozAlign:"center", width:20, headerSort:false},
            { title: "наименование ресурса", field: "name", widthGrow: 4, headerFilter: true, topCalc: "count", headerSort:false, editor: ed, },
            { title: "адрес ресурса", field: "dn", widthGrow: 4, headerFilter: true, headerSort:false, editor: ed, },
            { title: "DioNIS ACL", field: "filter", widthGrow: 2, headerFilter: true, headerSort:false, editor: ed, },
        ],

        rowFormatter: function (row) {
            rowFormatterCursor(row, g_tableResRes);
        },
        renderStarted: function () {
            renderStartedCursor(tableResRes, g_tableResRes);
            tableResCmpSetFilter(dt_now);
        },

//        dataLoaded: function (data) {
//            let msgFooterVULN = `<button id="b_REP1" class="w3-button w3-white w3-border w3-hover-teal">Сформировать квартальный отчет</button>`;
//            createTabulatorVulners("#tabUsr", appH, msgFooterVULN, g_tableResRes.id_current);
//        },
        rowClick: function (e, row) {
            rowClickCursor(row, g_tableResRes);
            //let id = g_tableResRes.id_current;
            tableResCmpSetFilter(dt_now);
    
            //if (!tableResCmp.rowManager.activeRows.length) return;
            //let id = tableResCmp.rowManager.activeRows[0].data.id;
            //let r  = tableResCmp.searchRows("id", "=", id)[0];
            ////rowClickCursor(r, g_tableResCmp)
        },
        cellEdited: function (cell) {
            let o = cell.getRow().getData();
            runSQL(`UPDATE resource SET name='${o.name}', dn='${o.dn}', filter='${o.filter}' WHERE id=${o.id}`);
        },

        footerElement: msgF,
    });
    
    (bADD) ? document.getElementById("addRes").onclick = function () {
        runSQL_p(`INSERT INTO resource (id_type, name, dn) VALUES (${g_tableResTyp.id_current}, '', '')`)
        .then((id) => {
            tableResRes.addData([{
                id: id,
                id_type: g_tableResTyp.id_current,
                name: '',
                dn: '',
            }], true);
            let row = tableResRes.searchRows('id', '=', id)[0];
            rowClickCursor(row, tableResRes);
            tableResRes.scrollToRow(id, "top", false);
            //let id = g_tableResRes.id_current;
            tableResCmpSetFilter(dt_now);
    
        });

    } : 0;
    (bDEL) ? document.getElementById("delRes").onclick = function () {
        if (!g_tableResRes.id_current) return;
        r = g_tableResRes.row_current.getData();
        dialogYESNO("Ресурс:<br>" + "id:" + r.id + "<br>" + r.name + "<br>" + "</b><br>будет удален, вы уверены?<br>")
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM resource WHERE id=${g_tableResRes.id_current}`)
                        .then((res) => {
                            g_tableResRes.id_current = 0;
                            tableResRes.replaceData("myphp/loadDataResRes.php");
                            g_tableResRes.id_current = 0;
                        });
                }
            });

    } : 0;
}

//=======================================================================================
// создание табулятора компьютеров ресурса
//=======================================================================================

function createTabCmp(id_div, appH) {
    let allow = getAllows();
    let ed   = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";

    //let bADD = (allow.C == 1) ? "<button id='addCmp' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    //let bDEL = (allow.D == 1) ? "<button id='delCmp' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Удалить</button>" : "";

    let bADD = "<button id='addCmp' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Добавить</button>";
    let bDEL = "<button id='delCmp' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Удалить</button>";

    let msgFooter = `<span>список доступа на момент времени: </span>
                     <input  id="date" type="date" value="${dt_now}">&nbsp;&nbsp;
                     <span id="select-stats"></span>&nbsp;&nbsp;
                     <button id='bOff' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>отменить выделение</button> 
                     <button id='bPrt' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>заявка</button>` + bDEL + bADD;


    tableResCmp = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataResCmp.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Компьютеры ресурса<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: true,

        columns: [
          //{ title: "id_res",    field: "id_res", headerFilter: true, width: 50 },
            { title: "id_cmp",    field: "id_cmp", headerFilter: true, width: 50 },
          //{ title: "id",        field: "id",     headerFilter: true, width: 50 },
            { title: '№',              formatter:"rownum", hozAlign:"center",  width: 20, headerSort:false },
            { title: "соно",           field: "sono",      headerFilter: true, width: 60 },
            { title: "компьютер",      field: "cname",     headerFilter: true, width: 110, topCalc: "count" },
            { title: "пользователь",   field: "uname",     headerFilter: true, widthGrow: 5 },
            { title: "ip",             field: "ip",        headerFilter: true, width: 110 },
            { title: 'DioNIS ACL',     field: "filter",    headerFilter: true, width: 100 },
            { title: "DioNIS",         field: "torm",      headerFilter: true, width: 80 },
          //{ title: "ЕСК",            field: "esk_status",  headerFilter: true, width: 50 },
            {//create column group
                title: "Распоряжение о включении",
                columns: [
                    { title: "дата", field: "dt_start",    width: 120, headerFilter: true, editor: ed_date, 
                      sorter: "date",
                      formatter: "datetime", formatterParams: {
                        inputFormat: "YYYY-MM-DD",
                        outputFormat: "DD.MM.YYYY",
                      }
                    },
                    { title: "№",    field: "numb_start",  width: 30, headerFilter: true, editor: ed, },
                ],
            },
            {//create column group
                title: "Распоряжение о выключении",
                columns: [
                    { title: "дата", field: "dt_stop",    width: 120, headerFilter: true, editor: ed_date, 
                      sorter: "date",
                      formatter: "datetime", formatterParams: {
                        inputFormat: "YYYY-MM-DD",
                        outputFormat: "DD.MM.YYYY",
                      }
                    },
                    { title: "№",    field: "numb_stop",  width: 30, headerFilter: true, editor: ed, },
                ],
            },
            

        ],

        renderComplete: function () {
            if (allow.C=='0') document.getElementById("addCmp").disabled = true;
            if (allow.D=='0') document.getElementById("delCmp").disabled = true;
        },

        rowSelectionChanged: function (data, rows) {
            let disabled = (data.length==0) ? true : false;
            document.getElementById("bOff").disabled   = disabled;
            document.getElementById("bPrt").disabled   = disabled;
            document.getElementById("delCmp").disabled = disabled;
            document.getElementById("select-stats").innerHTML = 'выбрано: ' + data.length;
            if (allow.C=='0') document.getElementById("addCmp").disabled = true;
            if (allow.D=='0') document.getElementById("delCmp").disabled = true;
        },

        rowFormatter: function (row) {
            setRowColor(row, dt_now);
            //rowFormatterCursor(row, g_tableResCmp);
        },

        renderStarted: function () {
            //renderStartedCursor(tableResCmp, g_tableResCmp);
        },

        rowClick: function (e, row) {
            //rowClickCursor(row, g_tableResCmp);
        },

        cellEdited: function (cell) {
            let row = cell.getRow();
            let d   = row.getData();
            runSQL(`UPDATE cmp_res SET 
                        dt_start   = '${d.dt_start}', 
                        dt_stop    = '${d.dt_stop}', 
                        numb_start = '${d.numb_start}',
                        numb_stop  = '${d.numb_stop}'     WHERE id=${d.id}`
            );
            setRowColor(row, dt_now);
        },

        footerElement: msgFooter,
    });

    // изменить фильтр по дате конфигурации ---------------------------------------------
    document.getElementById("date").onchange = function () {
        dt_now = this.value;
        tableResCmpSetFilter(dt_now);
    };
    
    // отменить выделение записей -------------------------------------------------------
    document.getElementById("bOff").onclick = function () {
        tableResCmp.deselectRow();
    };

    // сформировать запрос на удаление фильтров -----------------------------------------
    document.getElementById("bPrt").onclick = function () {
        printAddRequest( tableResCmp.getSelectedData() );
    };

    document.getElementById("addCmp").onclick = function () {
        selectComp('6100', '', 0, true)
        .then(selectedComps => {
            selectedComps.forEach(comp => {
                runSQL_p(`INSERT INTO cmp_res (id_cmp, id_res, dt_start, dt_stop) VALUES (${comp.id}, ${g_tableResRes.id_current}, '', '3000-01-01')`)
                    .then((id) => {
                        tableResCmp.addData([{
                            id: id,
                            id_cmp:     comp.id,
                            id_res:     g_tableResRes.id_current,
                            cname:      comp.name,
                            uname:      comp.user,
                            esk_status: comp.esk_status,                            
                            ip:         comp.ip
                        }], true);
                        tableResCmp.scrollToRow(id, "top", false);
                        let row = tableResCmp.searchRows('id', '=', id)[0];
                        //rowClickCursor(row, g_tableResCmp);
                    });
            });

        });
    };

    document.getElementById("delCmp").onclick = function () {
        
            dialogYESNO("Выбранные компьютеры<br>будут удалены<br>из списка доступа<br>вы уверены?<br>")
            .then(ans => {
                if (ans == "YES") {
                    tableResCmp.getSelectedData().forEach(comp => {
                        runSQL_p(`DELETE FROM cmp_res WHERE id=${comp.id}`)
                            .then((res) => {
                                g_tableResCmp.id_current = 0;
                                tableResCmp.replaceData("myphp/loadDataResCmp.php");
                                g_tableResCmp.id_current = 0;
                            });
                    });
                }
            });
    };
}


//=======================================================================================
// создание табулятора пользователей ресурса
//=======================================================================================

//function createTabUsr(id_div, appH) {
//    let allow = getAllows();
//    let bADD = (allow.C == 1) ? "<button id='addUsr' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
//    let bDEL = (allow.D == 1) ? "<button id='delUsr' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
//    let msgF = bDEL + bADD;
//
//    tableResUsr = new Tabulator(id_div, {
//        ajaxURL: "myphp/loadDataResUsr.php",
//        ajaxConfig: "GET",
//        ajaxContentType: "json",
//        height: appH,
//        layout: "fitColumns",
//        tooltipsHeader: true,
//        printAsHtml: true,
//        printHeader: "<h1>Уязвимости<h1>",
//        printFooter: "",
//        rowContextMenu: rowMenu(),
//        headerFilterPlaceholder: "",
//        columns: [
//            //{ title: "id_res", field: "id_res", headerFilter: true, width: 50 },
//            //{ title: "id_usr", field: "id_usr", headerFilter: true, width: 50 },
//            //{ title: "id",     field: "id",     headerFilter: true, width: 50 },
//            { title: '№',      formatter:"rownum", hozAlign:"center", width:20},
//            { title: "ФИО",    field: "uname",  headerFilter: true, widthGrow: 5 },
//        ],
//
//        rowFormatter: function (row) {
//            rowFormatterCursor(row, g_tableResUsr);
//        },
//        renderStarted: function () {
//            renderStartedCursor(tableResUsr, g_tableResUsr);
//        },
//        rowClick: function (e, row) {
//            rowClickCursor(row, g_tableResUsr);
//        },
//
//
//        footerElement: msgF,
//    });
//
//    (bADD) ? document.getElementById("addUsr").onclick = function () {
//        selectUser('6100', '')
//        .then(selectedUsers => {
//            selectedUsers.forEach(user => {
//                runSQL_p(`INSERT INTO usr_res (id_usr, id_res) VALUES (${user.id}, ${g_tableResRes.id_current})`)
//                    .then((id) => {
//                        tableResUsr.addData([{
//                            id: id,
//                            id_usr: user.id,
//                            id_res: g_tableResRes.id_current,
//                            uname: user.name,
//                            account: user.Account
//                        }], true);
//                        tableResUsr.scrollToRow(id, "top", false);
//                        let row = tableResUsr.searchRows('id', '=', id)[0];
//                        rowClickCursor(row, g_tableResUsr);
//                    });
//            });
//
//        });
//} : 0;
//    (bDEL) ? document.getElementById("delUsr").onclick = function () {
//        if (!g_tableResUsr.id_current) return;
//        r = g_tableResUsr.row_current.getData();
//        dialogYESNO("Пользователь:<br>" + "id:" + r.id + "<br>" + r.uname + "<br>" + "<br>будет удален,<br>из списка доступа<br>вы уверены?<br>")
//            .then(ans => {
//                if (ans == "YES") {
//                    runSQL_p(`DELETE FROM usr_res WHERE id=${r.id}`)
//                        .then((res) => {
//                            g_tableResUsr.id_current = 0;
//                            tableResUsr.replaceData("myphp/loadDataResUsr.php");
//                            g_tableResUsr.id_current = 0;
//                        });
//                }
//            });
//
//    } : 0;
//}

//=======================================================================================
function printAddRequest(data) {

    div_modal = document.createElement('div');
    div_modal.className = "modal";

    div_modal.innerHTML = `<div id="modalWindow"class="modal-content" style="width:90%;height:1px">
                            <div id="modalHeader" class="modal-header w3-teal" style="padding:1px 16px"><p>заявка на добавление фильтров в список доступа ${g_tableResRes.row_current.getData().filter}</p></div>
                            <div id="modalBody"   class="modal-body tabulator"  style="padding:10px 10px"></div>     
                            <div id="modalFooter" class="modal-footer w3-teal"></div>
                           </div>`;

    let table    = '';
    table = table + 'на DioNIS СОНО: '   + '6100' + '<br>';
    table = table + '&nbsp;&nbsp;&nbsp;в списке доступа: ' + g_tableResRes.row_current.getData().filter + ' ' + ' добавить записи: <br>';

    data.forEach(d => {
        // permit src 10.161.212.23 dst 10.253.252.0/24 remark "Ильин Владимир Евгеньевич"
        table = table + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;permit src ' + d.ip + ' dst 10.253.252.0/24 remark "' + d.uname + '"<br>';
    });


    document.body.append(div_modal);
    modal_body = document.getElementById('modalBody');
    modal_body.innerHTML = table;

    document.onkeyup = function (e) {
        if (e.key == 'Escape') {
            div_modal.style.display = "none";
            div_modal.remove();
            document.onkeyup = function (e) { };
        }
    };

    div_modal.style.display = "block";
}

function tableResCmpSetFilter(dt) {
    tableResCmp.setFilter([
        {field:"id_res",    type:"=",  value:g_tableResRes.id_current},
        {field:"dt_start",  type:"<=", value:dt},
        [
            {field:"dt_stop",   type:">",   value:dt},
            {field:"filter",    type:"!=",  value:null},
        ]
    ]);    
}

function setRowColor(row,date) {
    let d = row.getData();
    row.getCells()[2].getElement().style.backgroundColor = '';
    row.getCells()[5].getElement().style.backgroundColor = '';
    if (d.esk_status != '2')                  row.getCells()[2].getElement().style.backgroundColor = '#ff8585'; 
    if (!d.filter)                            row.getCells()[5].getElement().style.backgroundColor = '#8cff8c'; 
    if (d.filter != null && d.dt_stop < date) row.getCells()[5].getElement().style.backgroundColor = '#ff8585'; 
}
