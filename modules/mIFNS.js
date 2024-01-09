function mIFNS() {
    $("#appBody").html('<div id="tabIT"><div id="tabI"></div><div id="tabT"></div><div id="tabP"></div></div>')
    createTabulatorIFNS("tabI", appBodyHeight())
    createTabulatorTORM("tabT", appBodyHeight())
    createTabulatorPoint("tabP", appBodyHeight())
}

//=======================================================================================
// табулятор справочника инспекций ======================================================
//=======================================================================================

function createTabulatorIFNS(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let bADD = (allow.C == 1) ? "<button id='addIFNS' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.D == 1) ? "<button id='delIFNS' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let ms = bDEL + bADD;

    tableIFNS = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadData.php",
        ajaxParams: { t: "ifns", o: "sono" },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Инспекции<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: 1,
        selectableRangeMode: "click",
        columns: [
            { title: "id", field: "id", widthGrow: 1, print: false },
            { title: "A", field: "actual",  headerFilter: true, widthGrow: 1, print: false },
            { title: "СОНО", field: "sono", headerFilter: true, widthGrow: 2, topCalc: "count" },
            { title: "ЕКП",  field: "ekp",  headerFilter: true, widthGrow: 2 },
            { title: "наименование", field: "name", headerFilter: true, widthGrow: 8 },
            {//create column group
                title: "компьютеров",
                columns: [
                    { title: "ЕСК+", field: "n_wrk", topCalc: "sum", widthGrow: 1 },
                    { title: "ЕСК-", field: "n_wrk_disabled", topCalc: "sum", widthGrow: 1 },
                ],
            },
            {//create column group
                title: "серверов",
                columns: [
                    { title: "ЕСК+", field: "n_srv", topCalc: "sum", widthGrow: 1 },
                    { title: "ЕСК-", field: "n_srv_disabled", topCalc: "sum", widthGrow: 1 },
                ],
            },
            { title: "вне<br>ЕСК", field: "n_esk_out", widthGrow: 1 },
        ],

        rowClick: function (e, row) {
            tableTORM.setFilter("id_co", "=", tableIFNS.getSelectedData()[0].id);
        },

        cellDblClick: function (e, cell) { editIFNS(cell); },

        //cellEdited: function (cell) { updateREC(cell.getRow().getData(), "myphp/updateIFNS.php"); },

        footerElement: ms,
    });

    // кнопка добавления новой инспекции ------------------------------------------------
    $("#addIFNS").click(function () {
        runSQL_p(`INSERT INTO ifns VALUES ()`)
            .then((id) => {
                tableIFNS.replaceData();
                g_tableMod.id_current = parseInt(id);
            });
    });

    // кнопка удаления инспекции --------------------------------------------------------
    $("#delIFNS").click(function () {
        let d = tableIFNS.getSelectedData()[0]
        let id = d.id
        let sono = d.sono
        let name = d.name

        dialogYESNO(`Инспекция:<br><b>${sono}<br>${name}</b><br>будет удалена, вы уверены?<br>`)
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM torm WHERE id_co=${id}`);
                    runSQL_p(`DELETE FROM ifns WHERE id=${id}`)
                        .then((res) => {
                            // g_tableIFNS.id_current = 0;
                            tableIFNS.replaceData();
                            // g_tableIFNS.id_current = 0;
                        });
                }
            });
    });


}

//=======================================================================================
//  табулятор справочника тормов ========================================================
//=======================================================================================

function createTabulatorTORM(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let bADD = (allow.C == 1) ? "<button id='addTORM' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.D == 1) ? "<button id='delTORM' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let ms = bDEL + bADD;

    tableTORM = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadData.php",
        ajaxParams: { t: "torm", o: "sono_torm" },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>ТОРМы<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: 1,
        selectableRangeMode: "click",
        columns: [
          //{ title: "id_co",        field:"id_co",   editor: ed,                        widthGrow:1, print:false },
            { title: "id", field: "id", widthGrow: 1, print: false },
            { title: "СОНО ц.о.", field: "sono", headerFilter: true, widthGrow: 2, editor: ed },
            { title: "СОНО ТОРМ", field: "sono_torm", headerFilter: true, widthGrow: 2, topCalc: "count", editor: ed },
            { title: "ЕКП",       field: "ekp",  headerFilter: true, widthGrow: 2, editor: ed },
            { title: "наименование", field: "name", headerFilter: true, widthGrow: 6, editor: ed },
        ],
        rowClick: function (e, row) {
            tablePoint.setFilter("id_torm", "=", tableTORM.getSelectedData()[0].id);
        },

        cellEdited: function (cell) { updateREC(cell.getRow().getData(), "myphp/updateTORM.php"); },

        footerElement: ms,
    });

    // кнопка добавление нового ТОРМа ---------------------------------------------------
    $("#addTORM").click(function () {
        let d = tableIFNS.getSelectedData()[0]
        let id_co = d.id
        let sono = d.sono

        let sql = `INSERT INTO torm (id_co,sono) VALUES (${id_co},${sono})`;
        runSQL_p(sql)
            .then(id => tableTORM.addData(
                [{
                    id: id,
                    id_co: id_co,
                    sono: sono,
                    ekp: ekp,
                }],
                false
            ))
    })

    // кнопка удаления ТОРМа ------------------------------------------------------------
    $("#delTORM").click(function () {
        let d = tableTORM.getSelectedData()[0]
        let id = d.id
        let sono = d.sono
        let sono_torm = d.sono_torm
        let name = d.name

        dialogYESNO(`ТОРМ:<br><b>${sono}-${sono_torm}<br>${name}</b><br>будет удален, вы уверены?<br>`)
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM torm WHERE id=${id}`)
                        .then((res) => {
                            // g_tableTORM.id_current = 0
                            tableTORM.replaceData()
                            // g_tableTORM.id_current = 0
                        })
                }
            })
    })
}

//=======================================================================================
//  табулятор справочника точек подключения =============================================
//=======================================================================================

function createTabulatorPoint(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let bADD = (allow.C == 1) ? "<button id='addPoint' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.D == 1) ? "<button id='delPoint' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let ms = bDEL + bADD;

    tablePoint = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadData.php",
        ajaxParams: { t: "connect_point", o: "ip" },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Точки подключения<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: 1,
        selectableRangeMode: "click",
        columns: [
            { title: "id", field: "id", widthGrow: 1, print: false },
            { title: "ip", field: "ip", headerFilter: true, widthGrow: 2, editor: ed },
            { title: "mask", field: "mask", headerFilter: true, widthGrow: 2, topCalc: "count", editor: ed },
            { title: "sklad",       field: "stock",  headerFilter: true, widthGrow: 2, editor: ed },
        ],
        cellEdited: function (cell) { updateREC(cell.getRow().getData(), "myphp/updatePoint.php"); },

        footerElement: ms,
    });

    // кнопка добавление новой точки подключения ---------------------------------------------------
    $("#addPoint").click(function () {
        let d = tableTORM.getSelectedData()[0]
        let id_torm = d.id

        let sql = `INSERT INTO connect_point (id_torm) VALUES (${id_torm})`;
        
        runSQL_p(sql)
            .then(id => tablePoint.addData(
                [{
                    id: id,
                    id_torm: id_torm,
                }],
                false
            ));

    });

    // кнопка удаления точки подключения -----------------------------------------------------------
    $("#delPoint").click(function () {
        let d = tablePoint.getSelectedData()[0]
        let id = d.id

        dialogYESNO(`ТОРМ:<br><b>Точка подключения</b><br>будет удален, вы уверены?<br>`)
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM connect_point WHERE id=${id}`)
                        .then((res) => {
                            // tablePoint.id_current = 0
                            tablePoint.replaceData()
                            // tablePoint.id_current = 0
                        })
                }
            })
    })
}




//=======================================================================================
// модальное окно редактора ИФНС ========================================================
// c - данные текущей колонки
//=======================================================================================
function editIFNS(c) {
    let allow = getAllows();
    let r = c.getRow().getData();

    let form = `<div id="div_Edit" class="w3-container">
                    <form>
                        <label for="sono">СОНО:</label><br>
                        <input id="sono" style="width:100%" value="${r.sono}" disabled><br><br>

                        <label for="ekp">ЕКП:</label><br>
                        <input id="ekp" style="width:100%" value="${r.ekp}" disabled><br><br>

                        <label for="name">Нименование ИФНС:</label><br>
                        <input id="name" style="width:100%" value="${r.name}" disabled><br><br>

                        <label for="schtat">Штатная численность:</label><br>
                        <input id="schtat" type="number" value="${r.schtat}" disabled><br><br>

                        дата начала действия:<br>
                        <input class="o3-border" type="date" id="date_start" value="${r.date_start}" disabled><br><br>
            
                        дата конца действия:<br>
                        <input class="o3-border" type="date" id="date_stop" value="${r.date_stop}" disabled><br><br>

                        <label for="actual">Активно:</label><br>
                        <input id="actual" type="number" value="${r.actual}" disabled><br><br>

                    </form>
                    <br>
                    <button id="ENTER" class="w3-button w3-white w3-border w3-hover-teal" disabled><b>записать</b></button>
                    <button id="CANCEL" class="w3-button w3-white w3-border w3-hover-teal"><b>отмена</b></button>
                    <br><br>
                </div>`;

    $("#mainModalBody").html(form);

    // let ENTER = document.getElementById("ENTER");
    // let CANCEL = document.getElementById("CANCEL");

    if ((allow.E != "0") && (g_user.sono == r.sono)) {
        $("#ENTER").prop('disabled', false)
        $("#name").prop('disabled', false)
        $("#schtat").prop('disabled', false)
        $("#date_start").prop('disabled', false)
        $("#date_stop").prop('disabled', false)
        $("#actual").prop('disabled', false)
    }
    if ((allow.E != "0") && (g_user.sono == "6100")) {
        $("#ENTER").prop( 'disabled', false);
        $("#sono").prop(  'disabled', false);
        $("#ekp").prop(  'disabled', false);
        $("#name").prop(  'disabled', false);
        $("#schtat").prop('disabled', false);
        $("#date_start").prop('disabled', false)
        $("#date_stop").prop('disabled', false)
        $("#actual").prop('disabled', false)
    }

    id2e("ENTER").onclick = function () {
        let id = r.id
        let sono = $("#sono").val()
        let ekp = $("#ekp").val()
        let name = $("#name").val()
        let schtat = $("#schtat").val()
        let date_start = $("#date_start").val()
        let date_stop = $("#date_stop").val()
        let actual = $("#actual").val()

        c.getRow().update({ 
            "sono": sono, 
            "ekp": ekp, 
            "name": name, 
            "schtat": schtat ,
            "date_start": date_start,
            "date_stop": date_stop,
            "actual": actual 
        })
        c.getRow().reformat();

        runSQL_p(
            `UPDATE ifns SET 
            sono='${sono}', 
            ekp='${ekp}', 
            name='${name}', 
            schtat='${schtat}', 
            date_start='${date_start}', 
            date_stop='${date_stop}',
            actual=${actual} 
            WHERE id=${id}`
        )

        deactivateModalWindow("mainModal");
        log_reg('изменение параметров ИФНС: ' + name + ', штат=' + schtat); 
    }

    id2e("CANCEL").onclick = function () {
        deactivateModalWindow("mainModal");
    }

    activateModalWindow("mainModal");
}
