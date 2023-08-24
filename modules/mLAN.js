function mLAN() {
    $("#appBody").html('<div id="tabLLT"><div id="tabL"></div><div id="tabLT"></div></div>');
    createTabulatorLVS("tabL", appBodyHeight());
    createTabulatorLVST("tabLT", appBodyHeight());
}

//=======================================================================================
// табулятор списка подсетей ============================================================
//=======================================================================================

function createTabulatorLVS(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let es = (allow.E == 1) ? "select" : "";
    let bADD = (allow.C == 1) ? "<button id='addLVS' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.D == 1) ? "<button id='delLVS' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let ms = bDEL + bADD;

    tableLVS = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataLVS.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Подсети<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        columns: [
            //{title:"id",          field:"id",                             widthGrow:1, print:false},
            { title: "СОНО", field: "sono", headerFilter: true, widthGrow: 1, topCalc: "count" },
            { title: "офис", field: "sono_torm", headerFilter: true, widthGrow: 1, },
            { title: "ЕКП",  field: "ekp",  headerFilter: true, widthGrow: 1 },
            {
                title: "офис", field: "nametorm",
                headerFilter: true, headerFilterParams: { editor: "select", values: sel_TORM },
                widthGrow: 3,
                editor: es,
                editorParams: { values: sel_TORM },
            },
            { title: "адрес сети", field: "ip", headerFilter: true, widthGrow: 3, editor: ed },
            { title: "маска сети", field: "mask", headerFilter: true, widthGrow: 3 },
            { title: "длина маски", field: "nbit", headerFilter: true, widthGrow: 1, editor: ed },
            { title: "шлюз", field: "gw", headerFilter: true, widthGrow: 3, editor: ed },
            { title: "внешний ip шлюза", field: "gw_ext", headerFilter: true, widthGrow: 3, editor: ed },
            {
                title: "тип", field: "nametype", headerFilter: true, widthGrow: 2,
                editor: es, editorParams: { values: sel_LVST },
                headerFilter: true, headerFilterParams: { editor: "select", values: sel_LVST },
            },
            { title: "примечание", field: "comment", headerFilter: true, editor: ed, widthGrow: 5 },
        ],
        rowFormatter: function (row) { 
            let color = row.getData().color;
            //console.log("color=",color);
            //row.getElement().style.backgroundColor = color;
            row.getCells()[8].getElement().style.backgroundColor = color;
            //console.log('row.getElement().style.backgroundColor=',row.getElement().style.backgroundColor)
            rowFormatterCursor(row, g_tableLVS);             
        },
        renderStarted: function () { 
            renderStartedCursor(tableLVS, g_tableLVS); 
        },
        rowClick: function (e, row) { 
            rowClickCursor(row, g_tableLVS) 
        },

        cellEdited: function (cell) {
            let obj = cell.getRow().getData();
            console.log("obj.nametype=", obj.nametype, "id_lvs_type=", obj.id_lvs_type);
            obj.mask = bit2mask(Number(obj.nbit));
            console.log("obj.nbit:", obj.nbit, "   obj.mask:", obj.mask);

            if (obj.nametype == null) { } else {
                obj.id_lvs_type = tableLVST.getRows().filter((row) => { return row.getData().name == obj.nametype })[0].getIndex();
            }

            console.log("obj.nametorm=", obj.nametorm, "id_torm=", obj.id_torm);
            if (obj.nametorm == null) { } else {
                obj.id_torm = tableTORM.getRows().filter((row) => { return row.getData().name == obj.nametorm })[0].getIndex();
            }

            updateREC(obj, "myphp/updateLVS.php");
            //tableLVS.replaceData("myphp/loadDataLVS.php");
            //tableLVS.redraw();
        },
        footerElement: ms,
    });

    // кнопка добавление новой подсети --------------------------------------------------
    $("#addLVS").click(function () {
        runSQL_p(`INSERT INTO lvs () VALUES ()`)
            .then(id => tableLVS.addData(
                [{
                    id: id,
                }],
                true
            ));

    });

    // кнопка удаления подсети ----------------------------------------------------------
    $("#delLVS").click(function () {
        dialogYESNO(`Подсеть:<br><b>${g_tableLVS.row_current.getData().nametorm}-${g_tableLVS.row_current.getData().ip}<br>${g_tableLVS.row_current.getData().mask}</b><br>будет удален, вы уверены?<br>`)
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM lvs WHERE id=${g_tableLVS.id_current}`)
                        .then((res) => {
                            g_tableLVS.id_current = 0;
                            tableLVS.replaceData();
                            g_tableLVS.id_current = 0;
                        });
                }
            });
    });

    if (g_user.sono!='6100') tableLVS.setFilter("sono", "=", g_user.sono);

}

//=======================================================================================
//  табулятор типов подсетей ============================================================
//=======================================================================================

function createTabulatorLVST(id_div, appH, msgF) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let bADD = (allow.C == 1) ? "<button id='addLVST' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.D == 1) ? "<button id='delLVST' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let ms = bDEL + bADD;

    tableLVST = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadData.php",
        ajaxParams: { t: "lvs_type", o: "name" },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Подсети<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        columns: [
            //{title:"id",        field:"id",    headerFilter:true, widthGrow:1, topCalc:"count"},
            { title: "тип сети", field: "name",  headerFilter: true, widthGrow: 2, editor: ed },
            { title: "описание", field: "descr", headerFilter: true, widthGrow: 4, editor: ed },
            { title: "цвет",     field: "color", headerFilter: true, widthGrow: 2, editor: ed },
        ],
        rowFormatter: function (row) { 
            let color = row.getData().color;
            //console.log("color=",color);
            //row.getElement().style.backgroundColor = color;
            row.getCells()[0].getElement().style.backgroundColor = color;
            rowFormatterCursor(row, g_tableLVST); 
        },
        renderStarted: function () { renderStartedCursor(tableLVST, g_tableLVST); },
        rowClick: function (e, row) { rowClickCursor(row, g_tableLVST) },

        cellEdited: function (cell) {
            //cEditLVST(cell.getRow().getData());
            updateREC(cell.getRow().getData(), "myphp/updateLVST.php");
            sel_LVST = loadSelector("lvs_type");
            //listLVS();
            //listLVST();
        },
        footerElement: ms,
    });

    // кнопка добавление нового типа подсети --------------------------------------------
    $("#addLVST").click(function () {
        runSQL_p(`INSERT INTO lvs_type () VALUES ()`)
            .then(id => tableLVST.addData(
                [{
                    id: id,
                }],
                true
            ));

    });

    // кнопка удаления типа подсети -----------------------------------------------------
    $("#delLVST").click(function () {
        dialogYESNO(`Тип подсети:<br><b>${g_tableLVST.row_current.getData().name}</b><br>будет удален, вы уверены?<br>`)
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM lvs_type WHERE id=${g_tableLVST.id_current}`)
                        .then((res) => {
                            g_tableLVST.id_current = 0;
                            tableLVST.replaceData();
                            g_tableLVST.id_current = 0;
                        });
                }
            });
    });

}

