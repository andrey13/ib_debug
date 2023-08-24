//console.log("load mVulner");
let msgFooterVULN = `<button id="b_REP1" class="w3-button w3-white w3-border w3-hover-teal">Сформировать квартальный отчет</button>`;

function mVulner() {
    console.log("run mVulner");
    let appHeight = appBodyHeight();
    $("#appBody").html(
        '<div id="tabScanVulner"><div id="tabScan"></div><div id="tabVulner"></div></div>'
    );
    $("#appBody").height(appHeight);
    createTabulatorScns("tabScan", appHeight, "");
}

//=======================================================================================
//  табулятор сканов Maxpatrol ==========================================================
//=======================================================================================

function createTabulatorScns(id_div, appH, msgF) {
    let ms = msgF;

    tableScns = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataScans.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>сканы Maxpatrol<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",

        columns: [
            { title: "скан", field: "name", headerFilter: true, width: 200, topCalc: "count", },
        ],

        rowFormatter: function (row) {
            rowFormatterCursor(row, g_tableScns);
        },
        renderStarted: function () {
            renderStartedCursor(tableScns, g_tableScns);
            createTabulatorVulner("tabVulner", appH, msgFooterVULN, g_tableScns.id_current);
        },
        rowClick: function (e, row) {
            rowClickCursor(row, g_tableScns);
            createTabulatorVulner("tabVulner", appH, msgFooterVULN, g_tableScns.id_current);
        },

        /*
        renderComplete: function () {
            tableScns.scrollToRow(g_id_scan, "center", false);
        */

        footerElement: ms,
    });

}


//=======================================================================================
// создание табулятора списка уязвимостей скана Maxpatrol с id=id_scan ==================
//=======================================================================================

function createTabulatorVulner(id_div, appH, msgF, id_scan) {
    let ss = g_user.sono.substr(2, 2);
    let ff = "n" + ss;
    let cols = [];
    if (ss == "00") {
        ff = "nnn";
        cols = [
            { title: "всего", field: "nnn", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "00", field: "n00", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "52", field: "n52", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "54", field: "n54", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "64", field: "n64", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "65", field: "n65", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "71", field: "n71", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "73", field: "n73", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "74", field: "n74", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "81", field: "n81", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "82", field: "n82", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "83", field: "n83", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "86", field: "n86", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "88", field: "n88", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "91", field: "n91", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "92", field: "n92", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "93", field: "n93", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "94", field: "n94", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "95", field: "n95", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            { title: "96", field: "n96", topCalc: "sum", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
        ];
    } else {
        cols = [{
            title: "", field: ff, widthGrow: 1, topCalc: "sum",
            formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); },
        }];

    }

    tableVulner = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataVulner.php",
        ajaxParams: { s: id_scan, o: g_user.sono },
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
        //initialFilter:[
        //  {field:ff, type:">", value:0}
        //],
        columns: [
            { title: "ID", field: "id", headerFilter: true, width: 50 },
            { title: "уровень", field: "id_level", headerFilter: true, widthGrow: 1 },
            { title: "уязвимость", field: "name", headerFilter: true, topCalc: "count", widthGrow: 10 },
            { title: "заявка СТП ФКУ", field: "numb", headerFilter: true, topCalc: "count", width: 170 },
            { title: "дата", field: "date", headerFilter: true, width: 75 },
            {
                title: "состояние", field: "done", headerFilter: true, widthGrow: 5,
                formatter: function (cell, formatterParams) {
                    return id2done(cell.getValue());
                },
            },
            { title: "примечание", field: "comment", headerFilter: true, widthGrow: 5 },
            {//create column group
                title: "Количество АРМов с уязвимостью",
                columns: cols,
            },
        ],

        cellClick: function (e, cell) {
            let v_sono = "";
            let v_fieldName = cell.getField();
            activateModalWindow("mainModal");

            // клик на любом поле кроме nnn, n52, n54, ... n96 ----------------------------
            if (v_fieldName.slice(0, 1) != "n" || v_fieldName == "name" || v_fieldName == "numb") {
                console.log("v_fieldName:", v_fieldName);
                editVulner1(cell);
            }

            // клик на любом поле nnn, n52, n54, ... n96 ----------------------------------
            if (v_fieldName.slice(0, 1) == "n" && v_fieldName != "name" && v_fieldName != "numb") {
                appHeight = window.innerHeight - 200;
                v_sono = (v_fieldName == "nnn") ? "" : "61" + v_fieldName.slice(1, 3);
                createTabulatorVulnerComp1("mainModalBody", cell.getRow().getData().id, cell.getRow().getData().name, appHeight, v_sono, g_tableScns.id_current);
            }
        },

        rowMouseEnter: function (e, row) {
            row.getElement().style.backgroundColor = "#c4c4c4";
        },

        rowMouseLeave: function (e, row) {
            if (row.getData().id_level == 0) { row.getElement().style.backgroundColor = g_color_v0; }
            if (row.getData().id_level == 1) { row.getElement().style.backgroundColor = g_color_v1; }
            if (row.getData().id_level == 2) { row.getElement().style.backgroundColor = g_color_v2; }
            if (row.getData().id_level == 3) { row.getElement().style.backgroundColor = g_color_v3; }
        },

        footerElement: msgF,
    });

    tableVulner.setFilter(ff, ">", 0);

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
        createTabulatorScanREP1("mainModalBody", appHeight, msgFooter, g_user.sono, g_tableScns.id_current);
    });
}

//=======================================================================================
// модальное окно квартального отчета ===================================================
//=======================================================================================
function createTabulatorScanREP1(id_div, appH, msgF, sono, id_scan) {
    tableScanREP = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataScanREP1.php",
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
        ws_data.forEach((item, index, array) => { array[index] = Object.values(item) });
        let ws = XLSX.utils.aoa_to_sheet(ws_data);

        wb.Sheets["Отчет " + g_user.sono] = ws;

        let file_name = g_user.sono + "-Maxpatrol report " + tableScns.getRow(id_scan).getData().name;

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
// модальное окно редактора уязвимости ==================================================
//=======================================================================================
async function editVulner1(c) {
    let d = c.getRow().getData();

    let v_descr3 = d.descr3;
    let v_descr4 = d.descr4;

    v_descr3 = v_descr3.replace(/.http/g, ".<br>http");
    v_descr4 = v_descr4.replace(/.http/g, ".<br>http");

    //let v_comps = await loadVulnerComps(d.id, g_user.sono, g_tableScns.id_current);
    
    let v_comps = await loadVulnerComps(d.id, g_tableScns.id_current);    

    let formVulner = `<div id="vEdit" class="w3-container">
                              <b>ID: ${d.id} <br> ${d.name}</b><br><br>
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

                              <label for="numb"><b>№ заявки СТП ФКУ / № письма в ЦОД / причина отсутствия заявки:</b></label><br>
                              <input id="numb" style="width:100%" value="${d.numb}"><br>

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

    $("#numb").change(function () {
        let true_false = (!$("#numb").val()) ? true : false;
        $("#date").prop('disabled', true_false);
        $("#done").prop('disabled', true_false);
        $("#comment").prop('disabled', true_false);
        $("#b_ENTER").prop('disabled', true_false);
    });

    if (d.numb == null) {
        $("#date").prop('disabled', true);
        $("#done").prop('disabled', true);
        $("#comment").prop('disabled', true);
        $("#b_ENTER").prop('disabled', true);
    }

    document.getElementById("b_ENTER").onclick = function () {
        let v_comment = $("#comment").val();
        let v_numb = $("#numb").val();
        let v_date = $("#date").val();
        let v_done = $("#done").val();
        let sql = "";

        if (v_numb != "") {
            //console.log(v_numb);
            //updateRequest({ "sono": g_user.sono, "id_scan": g_tableScns.id_current, "id_vulner": d.id, "numb": v_numb, "date": v_date, "done": v_done, "comment": v_comment });

            sql = `SELECT * FROM request WHERE sono='${g_user.sono}' AND id_scan=${g_tableScns.id_current} AND id_vulner=${d.id}`;
            runSQL_p(sql)
                .then(res => {
                    //console.log("result=", res);
                    //console.log("result.length=", res.length);
                    // если строка res = "[]" --------------------------------------------
                    if (res.length == 2) {
                        sql = `INSERT INTO request (sono, id_scan, id_vulner, numb, date, done, comment) 
                               VALUES ('${g_user.sono}', ${g_tableScns.id_current}, ${d.id}, '${v_numb}', '${v_date}', ${v_done}, '${v_comment}')`;
                        runSQL_p(sql);
                    } else {
                        sql = `UPDATE request SET 
                               numb='${v_numb}', 
                               date='${v_date}', 
                               done=${v_done}, 
                               comment='${v_comment}' 
                               WHERE sono='${g_user.sono}' AND id_scan=${g_tableScns.id_current} AND id_vulner=${d.id}`;
                        runSQL_p(sql);
                    }
                });
        }

        c.getRow().update({ "comment": v_comment, "numb": v_numb, "date": v_date, "done": v_done });
        c.getRow().reformat();
        deactivateModalWindow("mainModal");
        //updateTable({ "id": d.id, "mysql_table": "vulner", "comment": v_comment })

    }

    document.getElementById("b_CANCEL").onclick = function () {
        deactivateModalWindow("mainModal");
    }
}


//=======================================================================================
// табулятор компьютеров с уязвимостью с id=id_vulner ===================================
//=======================================================================================

function createTabulatorVulnerComp1(id_div, id_vulner, vulner_name, appH, sono, id_scan) {
    tableVulnerComp = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataVulnerComp1.php",
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
