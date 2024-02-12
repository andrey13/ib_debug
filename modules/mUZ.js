//console.log("load mUZ");

function mUZ(){
    console.log("run mUZ");
    field_kol_requested = "kol_requested_" + g_user.sono;
    field_sum_requested = "sum_requested_" + g_user.sono;
    field_kol_completed = "kol_completed_" + g_user.sono;
    field_sum_completed = "sum_completed_" + g_user.sono;
    field_kol_work      = "kol_work_"      + g_user.sono;

    let msgFooterUKEPdate   = "";
    let appHeight = appBodyHeight();
    $("#appBody").html('<div id="tabUKEP"></div>');
    $("#appBody").height(appHeight);
    createTabulatorUKEPdate("tabUKEP", appHeight, msgFooterUKEPdate);

}

//=======================================================================================
// табулятор ведения журнала УКЭП  ======================================================
//=======================================================================================

function createTabulatorUKEPdate(id_div, appH, msgF) {
    let sono_mask = (g_user.sono == "6100") ? "" : g_user.sono;
    console.log("sono_mask:", sono_mask);

    let allow_R = g_user.modules.find(module => module.name==g_moduleActive).allow_R;
    let allow_E = g_user.modules.find(module => module.name==g_moduleActive).allow_E;
    let allow_C = g_user.modules.find(module => module.name==g_moduleActive).allow_C;
    let allow_D = g_user.modules.find(module => module.name==g_moduleActive).allow_D;
    console.log(allow_R,allow_E,allow_C,allow_D);

    let col_req = {title: "за день", field: "kol_req", topCalc: "sum", width: 100,};
    let col_com = {title: "за день", field: "kol_com", topCalc: "sum", width: 100,};

    if (allow_E==1 && g_user.sono != "6100") {
        col_req.editor       = "number";
        col_com.editor       = "number";
        col_req.editorParams = {mask: "99", min: 0, max: 16, verticalNavigation: "table",};
        col_com.editorParams = {mask: "99", min: 0, max: 16, verticalNavigation: "table",};
    }
   
    tableUKEP = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataUKEPdate.php",
        ajaxParams: { s: sono_mask },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h5>Журнал статистики принятых и выполненных заявок на выпуск УКЭП<h5>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        reactiveData: true,
        headerHozAlign: "center",
        columnHeaderVertAlign: "center",
        columns: [
            { title: "id", field: "id", width: 10, print: false, headerSort: false },
            { title: "СОНО", field: "sono", width: 60, headerFilter: true, headerSort: false },
            { title: "дата", field: "date", width: 200, headerFilter: true,  },
            {//create column group
                title: "Количество принятых заявок",
                columns: [
                    col_req,
                    {
                        title: "всего<br>нарастающим<br>итогом", field: "sum_req", width: 100, headerSort: false,
                        formatter: function (cell, formatterParams) {
                            var value = cell.getValue();
                            return "<span style='color:blue; font-weight:bold;'>" + value + "</span>";
                        }
                    },
                ],
            },
            {//create column group
                title: "Количество выданных УКЭП",
                columns: [
                    col_com,
                    {
                        title: "всего<br>нарастающим<br>итогом", field: "sum_com", width: 100, headerSort: false,
                        formatter: function (cell, formatterParams) {
                            var value = cell.getValue();
                            return "<span style='color:green; font-weight:bold;'>" + value + "</span>";
                        },

                    },
                ],
            },
            {
                title: "количество<br>заявок<br>в работе", field: "kol_w", width: 100,
                formatter: function (cell, formatterParams) {
                    var value = cell.getValue();
                    return "<span style='color:red; font-weight:bold;'>" + value + "</span>";
                },
            },
            //{ title: "примечания", field: "comment", editor: "input", headerSort: false },

        ],

        dataLoaded:function(data){
        },

        cellEditing: function (cell) {
            let r = cell.getRow().getData();
            tableUKEP.getRow(r.id).getElement().style.backgroundColor = g_upd_rec_bg;
            console.log("cellEditing");
        },

        cellEditCancelled: function (cell) {
            let r = cell.getRow().getData();
            console.log("cellEditCancelled");
            tableUKEP.getRow(r.id).getElement().style.backgroundColor = "";
        },

        cellEdited: function (cell) {
            let r = cell.getRow().getData();
            recalcSum(r.id);
            tableUKEP.getRow(r.id).getElement().style.backgroundColor = "";
        },

        cellClick: function (e, cell) {
            console.log("ID:" + cell.getRow().getData().id);
            console.log("H: " + cell.getField());
        },
    
        footerElement: msgF,
    });

    if (g_user.sono !== "6100") {
        tableUKEP.setFilter("sono", "=", g_user.sono);
    }

    //button_init("#b_calcUKEP");
    //button_init("#b_foolUKEP");
    
    // кнопка перерасчета таблицы------------------------------
    $("#b_calcUKEP").click(function () {
        recalcSum(0);
    });

    // кнопка заполнения журнала------------------------------
    $("#b_foolUKEP").click(function () {
        let date_start = moment("2021-08-01");
        let date_stop = moment("2021-12-31");

        for (let d = date_start; d <= date_stop; d.add(1, 'day')) {
            console.log(d.format("YYYY-MM-DD"));
            let xhr = new XMLHttpRequest(); xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let id = this.responseText
                }
            }
            let yymmdd = d.format("YYYY-MM-DD");
            xhr.open("GET", "myphp/addUKEP.php?s=" + g_user.sono + "&d=" + yymmdd, true); xhr.send();
        }

    });


}

// сохранение записи в БД ---------------------------------------------------------------
function saveRow(r) {
    let o = {
        "id":                  r.id,
        //"mysql_table":         "signature",
        "date":                r.date,
        [field_kol_requested]: r.kol_req,
        [field_sum_requested]: r.sum_req,
        [field_kol_completed]: r.kol_com,
        [field_sum_completed]: r.sum_com,
        [field_kol_work]:      r.kol_w,
        "comment":             r.comment
    };
    //console.log("cellEdited",o);
    //updateTable(o);
    updateDBRecord(o,"signature",);
}

// перерасчет суммарных показателей -----------------------------------------------------
function recalcSum(id_start) {
    console.log("id_start = " + id_start);
    let rr = tableUKEP.rowManager.rows;
    if (id_start == 0) { id_start = rr[0].data.id; }
    let sum_req = 0;
    let sum_com = 0;
    let sum_wrk = 0;
    let sum = false;

    console.log("rr.length=",rr.length);

    for (let i = 0; i < rr.length; i++) {

        let r = rr[i].data;
        //console.log(field_kol_requested);
        //console.log(field_sum_requested);
        //console.log(field_kol_completed);
        //console.log(field_sum_completed);
        //console.log(field_kol_work);

        if (r.id != id_start && !sum) {
            sum_req = parseInt(r.sum_req);
            sum_com = parseInt(r.sum_com);
            //console.log(sum_req, " ", sum_com);
            continue;
        }

        if (r.id == id_start) { sum = true; }
            
        sum_req = sum_req + parseInt(r.kol_req);
        sum_com = sum_com + parseInt(r.kol_com);
        //console.log(sum_req, " ", sum_com);

        r.sum_req = sum_req;
        r.sum_com = sum_com;
        r.kol_w   = sum_req - sum_com;

        saveRow(r);
    }

}
