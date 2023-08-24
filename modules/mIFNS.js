function mIFNS() {
    $("#appBody").html('<div id="tabIT"><div id="tabI"></div><div id="tabT"></div></div>');
    createTabulatorIFNS("tabI", appBodyHeight());
    createTabulatorTORM("tabT", appBodyHeight());
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
        columns: [
          //{ title: "id", field: "id", widthGrow: 1, print: false },
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

        rowFormatter: function (row) {
            rowFormatterCursor(row, g_tableIFNS);
        },

        renderStarted: function () {
            renderStartedCursor(tableIFNS, g_tableIFNS);
            tableTORM.setFilter("id_co", "=", g_tableIFNS.id_current);
        },

        rowClick: function (e, row) {
            rowClickCursor(row, g_tableIFNS);
            tableTORM.setFilter("id_co", "=", g_tableIFNS.id_current);
            let id = tableTORM.rowManager.activeRows[0].data.id;
            let r = tableTORM.searchRows("id", "=", id)[0];
            rowClickCursor(r, g_tableTORM)
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
        dialogYESNO(`Инспекция:<br><b>${g_tableIFNS.row_current.getData().sono}<br>${g_tableIFNS.row_current.getData().name}</b><br>будет удалена, вы уверены?<br>`)
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM torm WHERE id_co=${g_tableIFNS.id_current}`);
                    runSQL_p(`DELETE FROM ifns WHERE id=${g_tableIFNS.id_current}`)
                        .then((res) => {
                            g_tableIFNS.id_current = 0;
                            tableIFNS.replaceData();
                            g_tableIFNS.id_current = 0;
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
        columns: [
          //{ title: "id_co",        field:"id_co",   editor: ed,                        widthGrow:1, print:false },
          //{ title: "id", field: "id", widthGrow: 1, print: false },
            { title: "СОНО ц.о.", field: "sono", headerFilter: true, widthGrow: 2, editor: ed },
            { title: "СОНО ТОРМ", field: "sono_torm", headerFilter: true, widthGrow: 2, topCalc: "count", editor: ed },
            { title: "ЕКП",       field: "ekp",  headerFilter: true, widthGrow: 2, editor: ed },
            { title: "наименование", field: "name", headerFilter: true, widthGrow: 6, editor: ed },
        ],
        rowFormatter: function (row) { rowFormatterCursor(row, g_tableTORM); },
        renderStarted: function () { renderStartedCursor(tableTORM, g_tableTORM); },
        rowClick: function (e, row) { rowClickCursor(row, g_tableTORM) },
        cellEdited: function (cell) { updateREC(cell.getRow().getData(), "myphp/updateTORM.php"); },

        footerElement: ms,
    });

    // кнопка добавление нового ТОРМа ---------------------------------------------------
    $("#addTORM").click(function () {
        let sono = tableIFNS.searchRows("id", "=", g_tableIFNS.id_current)[0].getData().sono;
        let sql = `INSERT INTO torm (id_co,sono) VALUES (${g_tableIFNS.id_current},${sono})`;
        runSQL_p(sql)
            .then(id => tableTORM.addData(
                [{
                    id: id,
                    id_co: g_tableIFNS.id_current,
                    sono: sono,
                    ekp: ekp,
                }],
                false
            ));

    });

    // кнопка удаления ТОРМа ------------------------------------------------------------
    $("#delTORM").click(function () {
        dialogYESNO(`ТОРМ:<br><b>${g_tableTORM.row_current.getData().sono}-${g_tableTORM.row_current.getData().sono_torm}<br>${g_tableTORM.row_current.getData().name}</b><br>будет удален, вы уверены?<br>`)
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM torm WHERE id=${g_tableTORM.id_current}`)
                        .then((res) => {
                            g_tableTORM.id_current = 0;
                            tableTORM.replaceData();
                            g_tableTORM.id_current = 0;
                        });
                }
            });
    });


}


//=======================================================================================
// модальное окно редактора ИФНС ========================================================
//=======================================================================================
function editIFNS(c) {
    let allow = getAllows();
    let r = c.getRow().getData();

    let form = `<div id="div_Edit" class="w3-container">
                    <form>
                        <b>ID:</b> ${r.id} 

                        <label for="sono"><b>СОНО</b></label><br>
                        <input id="sono" style="width:100%" value="${r.sono}" disabled><br>

                        <label for="ekp"><b>ЕКП</b></label><br>
                        <input id="ekp" style="width:100%" value="${r.ekp}" disabled><br>

                        <label for="name"><b>Нименование ИФНС</b></label><br>
                        <input id="name" style="width:100%" value="${r.name}" disabled><br>

                        <label for="schtat"><b>Штатная численность</b></label><br>
                        <input id="schtat" type="number" style="width:100%" value="${r.schtat}" disabled><br>

                    </form>
                    <br>
                    <button id="ENTER" class="w3-button w3-white w3-border w3-hover-teal" disabled><b>записать</b></button>
                    <button id="CANCEL" class="w3-button w3-white w3-border w3-hover-teal"><b>отмена</b></button>
                    <br><br>
                </div>`;

    $("#mainModalBody").html(form);

    let ENTER = document.getElementById("ENTER");
    let CANCEL = document.getElementById("CANCEL");

    if ((allow.E != "0") && (g_user.sono == r.sono)) {
        $("#ENTER").prop( 'disabled', false);
        $("#name").prop(  'disabled', false);
        $("#schtat").prop('disabled', false);
    }
    if ((allow.E != "0") && (g_user.sono == "6100")) {
        $("#ENTER").prop( 'disabled', false);
        $("#sono").prop(  'disabled', false);
        $("#ekp").prop(  'disabled', false);
        $("#name").prop(  'disabled', false);
        $("#schtat").prop('disabled', false);
    }

    ENTER.onclick = function () {
        let id = r.id;
        let sono = $("#sono").val();
        let ekp = $("#ekp").val();
        let name = $("#name").val();
        let schtat = $("#schtat").val();

        c.getRow().update({ "sono": sono, "ekp": ekp, "name": name, "schtat": schtat });
        c.getRow().reformat();

        runSQL_p(`UPDATE ifns SET sono='${sono}', ekp='${ekp}', name='${name}', schtat='${schtat}' WHERE id=${id}`);
        deactivateModalWindow("mainModal");
        log_reg('изменение параметров ИФНС: ' + name + ', штат=' + schtat); 
    }

    CANCEL.onclick = function () {
        deactivateModalWindow("mainModal");
    }

    activateModalWindow("mainModal");
}
