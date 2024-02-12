function mMaxpatrol() {
    console.log("run mMaxpatrol-------------------------------------->");
    let appHeight = appBodyHeight();

    let tQuart   = '<div id="tabQuartals"   style="display: inline-block; height: 100%; width: 5%;"></div>';
    let tScans   = '<div id="tabScanners"   style="display: inline-block; height: 100%; width: 15%;"></div>';
    let tVulners = '<div id="tabVulners"    style="display: inline-block; height: 100%; width: 80%;"></div>';

   // appHeight = appHeight - 31;
    $("#appBody").html(tQuart + tScans + tVulners);
    $("#appBody").height(appHeight);

    document.getElementById('appBody').style.display = 'inline-block';

    createTabulatorQuart("tabQuartals", appHeight);
    createTabulatorScans("tabScanners", appHeight);
}

//=======================================================================================
//  табулятор кварталов Maxpatrol
//=======================================================================================

function createTabulatorQuart(id_div, appH) {
    tableQuart = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataQuartals.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>кварталы<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",

        columns: [
            //{ title: "id", field: "id", headerFilter: true, widthGrow: 1 },
            { title: "квартал", field: "name", headerFilter: true, widthGrow: 1, topCalc: "count", headerSort:false, },
        ],

        rowFormatter: function (row) {
            rowFormatterCursor(row, g_tableQuart);
        },
        renderStarted: function () {
            renderStartedCursor(tableQuart, g_tableQuart);
            tableScans.setFilter("id_quart", "=", g_tableQuart.id_current);
        },
        rowClick: function (e, row) {
            rowClickCursor(row, g_tableQuart);
            tableScans.setFilter("id_quart", "=", g_tableQuart.id_current);
            let id = tableScans.rowManager.activeRows[0].data.id;
            let r = tableScans.searchRows("id", "=", id)[0];
            rowClickCursor(r, g_tableScans)

            let msgFooterVULN = `<button id="b_REP1" class="w3-button w3-white w3-border w3-hover-teal">Сформировать квартальный отчет</button>`;
            createTabulatorVulners("tabVulners", appH, g_tableScans.id_current);
        },
        footerElement: '',
    });
    document.getElementById(id_div).style.display = 'inline-block';

}

//=======================================================================================
//  табулятор сканов Maxpatrol
//=======================================================================================

function createTabulatorScans(id_div, appH) {
    g_tableScans.id_current = 0;  
    let allow = getAllows();

    tableScans = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataQuartScan.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>сканы<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",

        columns: [
            //{ title: "id",        field: "id",      widthGrow: 1, headerFilter: true,  },
            { title: "СОНО",      field: "sono",    widthGrow: 1, headerFilter: true, topCalc: "count", headerSort:false, },
            { title: "готово",    field: "f_ready", widthGrow: 1, formatter: "tickCross", headerSort:false, },
            { title: "устранено", field: "f_ok",    widthGrow: 1, formatter: "tickCross", headerSort:false, },
            { title: "проверено", field: "f_done",  widthGrow: 1, formatter: "tickCross", headerSort:false, },
        ],

        rowFormatter: function (row) {
            rowFormatterCursor(row, g_tableScans);
        },
        renderStarted: function () {
            renderStartedCursor(tableScans, g_tableScans);
        },
        dataLoaded: function (data) {
            createTabulatorVulners("tabVulners", appH, g_tableScans.id_current);
        },
        rowClick: function (e, row) {
            let id = row.getData().id;
            if (id==g_tableScans.id_current) return;
            rowClickCursor(row, g_tableScans);
            let sono = row.getData().sono
            createTabulatorVulners("tabVulners", appH, g_tableScans.id_current);
        },
        cellDblClick: function (e, cell) { editScan_vue(); },
//        cellEdited: function (cell) {
//            let o = cell.getRow().getData();
//            runSQL(`UPDATE scan SET f_ready=${o.f_ready}, f_ok=${o.f_ok}, f_done=${o.f_done} WHERE id=${o.id}`);
//        },

        //footerElement:  (allow.A=='1') ? `<button id='bSTAT' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>изменить статус выполнения</button>` : ``,
    });
//    document.getElementById("bSTAT").onclick = function () {
//        editScan_vue()
//    };
    tableScans.setFilter("id_quart", "=", g_tableQuart.id_current);
    document.getElementById(id_div).style.display = 'inline-block';
}

//=======================================================================================
// создание табулятора списка уязвимостей скана Maxpatrol с id=id_scan
//=======================================================================================

function createTabulatorVulners(id_div, appH, id_scan) {
    let allow = getAllows();
    
    console.log("createTabulatorVulners -> ", id_div);

    tableVulners = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataScanVuln.php",
        ajaxParams: { s: id_scan },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Уязвимости<h1>",
        printFooter: "",
        rowFormatter: function (row) {
            if (row.getData().id_level == 0) { row.getElement().style.backgroundColor = g_color_v0; }
            if (row.getData().id_level == 1) { row.getElement().style.backgroundColor = g_color_v1; }
            if (row.getData().id_level == 2) { row.getElement().style.backgroundColor = g_color_v2; }
            if (row.getData().id_level == 3) { row.getElement().style.backgroundColor = g_color_v3; }
        },
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        columns: [
            { title: "id",             field: "id_scan",   headerFilter: true, width: 50 },
            { title: "ID",             field: "id_vulner", headerFilter: true, width: 50, topCalc: "count" },
            { title: "уровень",        field: "id_level",  headerFilter: true, widthGrow: 1 },
            { title: "уязвимость",     field: "name",      headerFilter: true, widthGrow: 10 },
            { title: "заявка СТП ФКУ", field: "request",   headerFilter: true, width: 170 },
            { title: "дата",           field: "date",      headerFilter: true, width: 75 },
            {
                title: "состояние", field: "done", headerFilter: true, widthGrow: 5,
                formatter: function (cell, formatterParams) {
                    return id2done(cell.getValue());
                },
            },
            { title: "примечание", field: "comment", headerFilter: true, widthGrow: 5 },
            {
                title: "АРМов", field: "n_comp", widthGrow: 1, topCalc: "sum",
                //formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); },
            },
        ],

        cellClick: function (e, cell) {
            activateModalWindow("mainModal");

            if (cell.getField() == "n_comp") {
                appHeight = window.innerHeight - 200;
                let v_sono = tableScans.searchRows("id", "=", g_tableScans.id_current)[0].getData().sono;
                console.log("sono=", v_sono);
                console.log("id=", cell.getRow().getData().id_vulner);
                createTabulatorVulnerComp("mainModalBody", cell.getRow().getData().id_vulner, cell.getRow().getData().name, appHeight, v_sono, g_tableScans.id_current);
            } else {
                editVulner(cell);
            }
        },
        //rowFormatter: function (row) {
        //    rowFormatterCursor(row, g_tableVulners);
        //},
        //renderStarted: function () {
        //    renderStartedCursor(tableVulners, g_tableVulners);
        //},
        //
        //rowMouseEnter: function (e, row) {
        //    row.getElement().style.backgroundColor = "#c4c4c4";
        //},
        //rowClick: function (e, row) {
        //    rowClickCursor(row, g_tableVulners);
        //},


        rowMouseLeave: function (e, row) {
            if (row.getData().id_level == 0) { row.getElement().style.backgroundColor = g_color_v0; }
            if (row.getData().id_level == 1) { row.getElement().style.backgroundColor = g_color_v1; }
            if (row.getData().id_level == 2) { row.getElement().style.backgroundColor = g_color_v2; }
            if (row.getData().id_level == 3) { row.getElement().style.backgroundColor = g_color_v3; }
        },

        footerElement: `<button id="b_REP1" class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Сформировать квартальный отчет</button>`,
    });

    //tableVulners.setFilter(ff, ">", 0);

    // вкл/выкл фильтра по актуальным уязвимостям -------------------------------------------
    $("#cAll").click(function () {
        let cc = document.getElementById('cAll')
        console.log("cAll:", cc.checked);
        if (cc.checked) {
            tableVulner.setFilter(ff, ">=", 0);
        } else {
            tableVulner.setFilter(ff, ">", 0);
        }
        tableVulner.refreshFilter();
    });

    $("#b_REP1").click(function () {
        let msgFooter = '<button id="b_scanREP" class="w3-button w3-white w3-border w3-hover-teal">Сохранить отчет в файле</button>';
        let appHeight = window.innerHeight - 200;
        activateModalWindow("mainModal");
        createTabulatorScanREP("mainModalBody", appHeight, msgFooter, g_user.sono, g_tableScans.id_current);
    });

    //if (allow.E=='0' || sono!=g_user.sono) {
    //    document.getElementById('b_REP1').disabled = true;
    //}
    //$("#tabVulners").prop('display', 'inline-block');

    document.getElementById(id_div).style.display = 'inline-block';
}

//=======================================================================================
// табулятор компьютеров с уязвимостью с id=id_vulner ===================================
//=======================================================================================

function createTabulatorVulnerComp(id_div, id_vulner, vulner_name, appH, sono, id_scan) {
    tableVulnerComp = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataVulnerComp.php",
        ajaxParams: { i: id_vulner.toString(), s: sono.toString(), sc: id_scan },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        layout: "fitColumns",
        height: appH,
        rowContextMenu: rowMenu(),
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Компьютеры, на которых обнаружена уязвимость:<br>" + id_vulner.toString() + ":" + vulner_name + "<h1>",
        printFooter: "",
        headerFilterPlaceholder: "",
        columns: [
            { title: "comp", field: "id_comp", width: 50, print: false },
            { title: "vulner", field: "id_vulner", width: 50, print: false },
            { title: vulner_name.toString(), field: "name", headerFilter: true, topCalc: "count", widthGrow: 10 },
            { title: "Имя пользователя", field: "user", headerFilter: true, widthGrow: 10 },
            //{title:"комната", field:"room", headerFilter:true, widthGrow:2},
            {
                title: "Реестр узлов", field: "maxreestr", headerFilter: true, width: 80, topCalc: "sum",
                editor: "input",
                editorParams: { mask: "9", min: "0", max: "2", verticalNavigation: "table", }
            },
            {
                title: "Категория узла", field: "id_category", headerFilter: true, width: 100,
                editor: "input",
                editorParams: { mask: "99", min: "0", max: "16", verticalNavigation: "table", }
            },
            { title: "ЕСК", field: "esk_status", headerFilter: true, widthGrow: 1 },
            { title: "обновлено", field: "script_ok_datetime", headerFilter: true, widthGrow: 2 },
        ],

        cellEdited: function (cell) {
            let d = cell.getRow().getData();
            let o = { "id": d.id_comp, "mysql_table": "comp", "maxreestr": d.maxreestr, "id_category": d.id_category };
            updateTable(o);
        },

    });

}

 

//=======================================================================================
// модальное окно квартального отчета
//=======================================================================================
function createTabulatorScanREP(id_div, appH, msgF, sono, id_scan) {
    tableScanREP = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataScanREP.php",
        ajaxParams: { s: sono, c: id_scan },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        layout: "fitColumns",
        height: appH,
        rowContextMenu: rowMenu(),
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Квартальный отчет<h1>",
        printFooter: "",
        headerFilterPlaceholder: "",
        columns: [
            { title: "Уязвимый узел (IP адрес и имя)", field: "cname", widthGrow: 10, topCalc: "count", },
            { title: "Номер и наименование категории узла", field: "tname", widthGrow: 20, },
            { title: "ID уязвимости", field: "vid", widthGrow: 5, headerFilter: true },
            { title: "описание уязвимости", field: "descr", widthGrow: 20 },
            { title: "уровень критичности", field: "vlevel", widthGrow: 6, headerFilter: true },
            { title: "отметка об устранении", field: "vdone", widthGrow: 10, },
            { title: "Действия повлекшие устранения уязвимости либо причина не устранения уязвимости", field: "numb", widthGrow: 10 },
        ],
        footerElement: msgF,
    });

    $("#b_scanREP").click(function () {
        report2xls();
    });

    function report2xls() {
        let wb = XLSX.utils.book_new();

        wb.Props = {
            Title: "Отчет " + g_user.sono,
            Subject: g_user.sono,
            Author: "Maxpatrol",
            CreatedDate: new Date()
        };

        wb.SheetNames.push("Отчет " + g_user.sono);
        ws_data = tableScanREP.getData();
        console.log(ws_data[0]);

        ws_data.forEach((item, index, array) => { 
            let o = array[index];
            let a = [o.cname, o.tname, o.id_vulner, o.descr, o.vlevel, o.vdone, o.numb];
            //array[index] = Object.values(item);
            array[index] = a; 
        });

        console.log(ws_data[0]);

        let ws = XLSX.utils.aoa_to_sheet(ws_data);

        wb.Sheets["Отчет " + g_user.sono] = ws;

        let file_name = g_user.sono + "-Maxpatrol report " + g_tableQuart.row_current.getData().name;

        let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), file_name + '.xlsx');
    }

    function s2ab(s) {
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;
    }

}

//=======================================================================================
// модальное окно редактора скана VUE
//=======================================================================================
async function editScan_vue() {
    let allow = getAllows();
    let d = g_tableScans.row_current.getData();

    var enable_ready = (allow.A==1);
    var enable_ok    = (allow.A==1) || (d.sono == g_user.sono && allow.E == 1 && d.f_done == 0);
    var enable_done  = (allow.A==1);


    let formScan = `<div id="vEdit" class="w3-container">
                              <b>ID: ${d.id} <br>
                              <b>скан: ${d.sono}<br>
                              <b>квартал: ${g_tableQuart.row_current.getData().name}<br><br> 

                              <input type="checkbox" id="f_ready" v-model="checked_ready">
                              <label for="f_ready">  Отчет готов для работы над устранением уязвимостей</label><br><br>

                              <input type="checkbox" id="f_ok" v-model="checked_ok">
                              <label for="f_ok">  Работы над устранением уязвимостей завершены</label><br><br>

                              <input type="checkbox" id="f_done" v-model="checked_done">
                              <label for="f_done">  Отчет проверен и отправлен в ЦОД</label><br><br><br>

                              <button id="b_ENTER" class="w3-button w3-border w3-hover-teal">записать</button>
                              <button id="b_CANCEL" class="w3-button w3-border w3-hover-teal">отмена</button>
                              <br><br>
                  </div>`;

    $("#mainModalBody").html(formScan);

    let v1 = Vue.createApp({
        data() {
          return {
            checked_ready: d.f_ready==1,
            checked_ok:    d.f_ok==1,
            checked_done:  d.f_done==1
          }
        }
    }).mount('#vEdit');

    activateModalWindow("mainModal");

    // кнопка ENTER ---------------------------------------------------------------------
    document.getElementById("b_ENTER").onclick = function () {
        d.f_ready = (document.getElementById("f_ready").checked) ? 1: 0;
        d.f_ok    = (document.getElementById("f_ok").checked)    ? 1: 0;
        d.f_done  = (document.getElementById("f_done").checked)  ? 1: 0;

        sql = `UPDATE scan SET 
                f_ready = '${d.f_ready}', 
                f_ok    = '${d.f_ok}', 
                f_done  = '${d.f_done}'
               WHERE id =  ${d.id}`;

        runSQL_p(sql);

        deactivateModalWindow("mainModal");

        //g_tableScans.row_current.update({ "f_ready": d.f_ready, "f_ok": d.f_ok, "f_done": d.f_done });
//      cell.getRow().reformat();
   }

    // кнопка CANCEL --------------------------------------------------------------------
    document.getElementById("b_CANCEL").onclick = function () {
        deactivateModalWindow("mainModal");
    }   
}

//=======================================================================================
// модальное окно редактора скана
//=======================================================================================
async function editScan(cell) {
    let allow = getAllows();
    let d = cell.getRow().getData();

    var enable_ready = (allow.A==1);
    var enable_ok    = (allow.A==1) || (d.sono == g_user.sono && allow.E == 1 && d.f_done == 0);
    var enable_done  = (allow.A==1);


    let formScan = `<div id="vEdit" class="w3-container">
                              <b>ID: ${d.id} <br>
                              <b>скан: ${d.sono}<br>
                              <b>квартал: ${g_tableQuart.row_current.getData().name}<br><br> 

                              <input type="checkbox" id="f_ready" name="f_ready" value=${d.f_ready}>
                              <label for="f_ready"> Отчет готов для работы над устранением уязвимостей</label><br><br>

                              <input type="checkbox" id="f_ok" name="f_ok" value=${d.f_ok}>
                              <label for="f_ok"> Работы над устранением уязвимостей завершены</label><br><br>

                              <input type="checkbox" id="f_done" name="f_done" value=${d.f_done}>
                              <label for="f_done"> Отчет проверен и отправлен в ЦОД</label><br><br><br>

                              <button id="b_ENTER" class="w3-button w3-border w3-hover-teal">записать</button>
                              <button id="b_CANCEL" class="w3-button w3-border w3-hover-teal">отмена</button>
                              <br><br>
                  </div>`;

    $("#mainModalBody").html(formScan);

    if (d.f_ready==1) document.getElementById("f_ready").checked = true;
    if (d.f_ok==1)    document.getElementById("f_ok").checked    = true;
    if (d.f_done==1)  document.getElementById("f_done").checked  = true;

    activateModalWindow("mainModal");

    document.getElementById("b_ENTER").onclick = function () {
        d.f_ready = (document.getElementById("f_ready").checked) ? 1: 0;
        d.f_ok    = (document.getElementById("f_ok").checked)    ? 1: 0;
        d.f_done  = (document.getElementById("f_done").checked)  ? 1: 0;

        sql = `UPDATE scan SET 
                f_ready = '${d.f_ready}', 
                f_ok    = '${d.f_ok}', 
                f_done  = '${d.f_done}'
               WHERE id =  ${d.id}`;
        runSQL_p(sql);

        deactivateModalWindow("mainModal");

        cell.getRow().update({ "f_ready": d.f_ready, "f_ok": d.f_ok, "f_done": d.f_done });
//      cell.getRow().reformat();
   }

    document.getElementById("b_CANCEL").onclick = function () {
        deactivateModalWindow("mainModal");
    }   
}




//=======================================================================================
// модальное окно редактора уязвимости ==================================================
//=======================================================================================
async function editVulner(cell) {
    let allow = getAllows();
    let d = cell.getRow().getData();

    let v_sono   = tableScans.searchRows("id", "=", g_tableScans.id_current)[0].getData().sono;      console.log("sono=",    v_sono);
    let v_ready  = tableScans.searchRows("id", "=", g_tableScans.id_current)[0].getData().f_ready;   console.log("v_ready=", v_ready);
    let v_ok     = tableScans.searchRows("id", "=", g_tableScans.id_current)[0].getData().f_ok;      console.log("v_ok=",    v_ok);
    let v_done   = tableScans.searchRows("id", "=", g_tableScans.id_current)[0].getData().f_done;    console.log("v_done=",  v_done);
    let v_descr3 = d.descr3;
    let v_descr4 = d.descr4;
    let v_id     = d.id;

    v_descr3 = v_descr3.replace(/.http/g, ".<br>http");
    v_descr4 = v_descr4.replace(/.http/g, ".<br>http");

    let v_comps = await loadVulnerComps(d.id_vulner, g_tableScans.id_current);

    let formVulner = `<div id="vEdit" class="w3-container">
                              <b>ID: ${d.id_vulner} <br> ${d.name}</b><br><br>
                              <b>краткое описание:</b><br> 
                              ${d.descr1} <br>
                              <b>полное описание:</b><br> 
                              ${d.descr2} <br>
                              <b>как исправить:</b><br> 
                              ${v_descr3} <br>
                              <b>ссылки:</b><br> 
                              ${v_descr4} <br><br>
                              <b>компьютеры вашего НО, включенные в реестр узлов, на которых обнаружна уязвимость:</b><br>
                              <textarea id="comps" rows="6" style="width:100%">${v_comps}</textarea><br><br>

                              <label for="request"><b>№ заявки СТП ФКУ / № письма в ЦОД / причина отсутствия заявки:</b></label><br>
                              <input id="request" style="width:100%" value="${d.request}"><br>

                              <label for="date"><b>дата:</b></label><br>
                              <input id="date" type="date" value="${d.date}"><br>

                              <label for="done"><b>стаус выполнения:</b></label><br>
                              <select id="done">
                                    <option value=0 ${d.done == "0" ? "selected" : ""}>не устранено</option>
                                    <option value=1 ${d.done == "1" ? "selected" : ""}>устранено собственными силами</option>
                                    <option value=2 ${d.done == "2" ? "selected" : ""}>устранено ФКУ</option>
                                    <option value=3 ${d.done == "3" ? "selected" : ""}>устранено ЦОД</option>
                              </select><br>
                              
                              <label for="comment"><b>примечание:</b></label><br>
                              <textarea id="comment" rows="6" style="width:100%">${d.comment}</textarea><br><br>

                              <button id="b_ENTER" class="w3-button w3-border w3-hover-teal">записать</button>
                              <button id="b_CANCEL" class="w3-button w3-border w3-hover-teal">отмена</button>
                              <br><br>
                  </div>`;

    $("#mainModalBody").html(formVulner);

    document.getElementById('comps').disabled   = true;
    document.getElementById('request').disabled = true;
    document.getElementById('date').disabled    = true;
    document.getElementById('done').disabled    = true;
    document.getElementById('comment').disabled = true;
    document.getElementById('b_ENTER').disabled = true;

    if (allow.A ==1 || (allow.E == 1 && v_sono == g_user.sono && v_ok == 0)) {
        document.getElementById('request').disabled = false;
        document.getElementById('date').disabled    = false;
        document.getElementById('done').disabled    = false;
        document.getElementById('comment').disabled = false;
        document.getElementById('b_ENTER').disabled = false;
    }

    if (allow.E == '1' && v_sono == g_user.sono) {
        document.getElementById('comment').disabled = false;
        document.getElementById('b_ENTER').disabled = false;
    }

    if (allow.E == '1' && g_user.sono == '6199') {
        console.log('ФКУ');
        document.getElementById('comment').disabled = false;
        document.getElementById('b_ENTER').disabled = false;
    }

    document.getElementById("b_ENTER").onclick = function () {
        let v_comment = $("#comment").val();
        let v_request = $("#request").val();
        let v_date = $("#date").val();
        let v_done = $("#done").val();
        let sql = "";
        console.log("id=", v_id);

        //if (v_request != "") {
            console.log("UPD");
            sql = `UPDATE scan_vulner SET 
                    request = '${v_request}', 
                    date    = '${v_date}', 
                    done    =  ${v_done}, 
                    comment = '${v_comment}' 
                   WHERE id =  ${v_id}`;
            runSQL_p(sql);
        //}

        cell.getRow().update({ "comment": v_comment, "request": v_request, "date": v_date, "done": v_done });
        cell.getRow().reformat();
        deactivateModalWindow("mainModal");
    }

    document.getElementById("b_CANCEL").onclick = function () {
        deactivateModalWindow("mainModal");
    }

    
}
