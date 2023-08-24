function mLog() {    
    $("#appBody").html('<div id="tabLog"></div>');
    createTabulatorLog("tabLog", appBodyHeight());
}

//=======================================================================================
// табулятор журнала  ===================================================================
//=======================================================================================

function createTabulatorLog(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let bADD = (allow.C == 1) ? "<button id='addLog' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>" : "";
    let bDEL = (allow.D == 1) ? "<button id='delLog' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>" : "";
    let ms = bDEL + bADD;

    tableLog = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadData.php",
        ajaxParams: { t: "logs", o: "seans_datetime DESC" },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Журнал работы сервисов ИБ<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: 1,
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,

        columns: [
            { title: "id",    field: "id", width: 50} ,
            { title: "дата",  field: "seans_datetime", widthGrow: 1} ,
            { title: "ip",    field: "ip_user", widthGrow: 1, headerFilter: true },
            { title: "логин", field: "account", widthGrow: 2, headerFilter: true, topCalc: "count" },
            { title: "имя",   field: "name", widthGrow: 3, headerFilter: true, editor: "input" },
            { title: "действие",   field: "comment", widthGrow: 3, headerFilter: true },
        ],

        footerElement: '',
    });

    tableLog.setSort("seans_datetime", "desc");

}

