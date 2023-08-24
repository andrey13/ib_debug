//console.log("load mUZstat");
let msgFooterUKEP   = "";

function mUZstat(){
    console.log("run mUZstat");
    let appHeight = appBodyHeight();
    $("#appBody").html('<div id="tabUKEP"></div>');
    $("#appBody").height(appHeight);
    createTabulatorUKEP00("tabUKEP", appHeight, msgFooterUKEP);
}


function createTabulatorUKEP00(id_div, appH, msgF) {
    let sono_mask = (g_user.sono == "6100") ? "" : g_user.sono;
    console.log("sono_mask:", sono_mask);

    let cols = [];
    cols = [

          {title: "6171", 
           columns: [{title: "", field: "kol_requested_6171", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6171", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6171", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6171", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6171",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
          {title: "6173",
           columns: [{title: "", field: "kol_requested_6173", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6173", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6173", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6173", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6173",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
          {title: "6174",
           columns: [{title: "", field: "kol_requested_6174", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6174", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6174", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6174", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6174",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
          {title: "6181",
           columns: [{title: "", field: "kol_requested_6181", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6181", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6181", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6181", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6181",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
          {title: "6182",
           columns: [{title: "", field: "kol_requested_6182", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6182", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6182", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6182", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6182",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
          {title: "6183",
           columns: [{title: "", field: "kol_requested_6183", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6183", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6183", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6183", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6183",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
          {title: "6186",
           columns: [{title: "", field: "kol_requested_6186", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6186", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6186", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6186", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6186",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
          {title: "6188",
           columns: [{title: "", field: "kol_requested_6188", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6188", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6188", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6188", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6188",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
          {title: "6191",
           columns: [{title: "", field: "kol_requested_6191", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6191", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6191", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6191", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6191",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
          {title: "6192",
           columns: [{title: "", field: "kol_requested_6192", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6192", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6192", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6192", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6192",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
          {title: "6195",
           columns: [{title: "", field: "kol_requested_6195", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6195", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6195", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6195", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6195",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
          {title: "6196",
           columns: [{title: "", field: "kol_requested_6196", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_requested_6196", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     {title: "", field: "kol_completed_6196", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                     {title: "", field: "sum_completed_6196", width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     {title: "", field: "kol_work_6196",      width: 10, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
          ]},
        ];

    
  

    tableUKEP = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataUKEP.php",
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
            //{ title: "id", field: "id", width: 10, print: false, headerSort: false },
            //{ title: "СОНО", field: "sono", width: 60, headerFilter: true, headerSort: false },
            { title: "дата", field: "date", width: 100, headerFilter: true, frozen:true},
            {//create column group
                title: "ВСЕГО", frozen:true,
                columns: [
                    {title: "принято",
                     columns: [
                        {title: "день",  field: "kol_requested", width: 60, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                        {title: "всего", field: "sum_requested", width: 60, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"blue")}},
                     ],
                    },

                    {title: "выдано",
                     columns: [
                        {title: "день",  field: "kol_completed", width: 60, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"black")}},
                        {title: "всего", field: "sum_completed", width: 60, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"green")}},
                     ],
                    },

                    {title: "в<br>работе", field: "kol_work", width: 60, headerSort: false, formatter: function (cell, formatterParams) {return format_cell(cell,"red")}},
                ]
            }, //close group

            {title:"ИФНС",
             columns:cols,
            },

            //{title: "примечания", field: "comment", editor: "input", headerSort: false },
        ],


        // перерасчет суммарных показателей после загрузки данных их MySQL --------------
        dataLoaded: function(data){
            recalcAll();
        },

        // изменение цвета фона строки во время редактирования --------------------------
        cellEditing: function (cell) {
            let r = cell.getRow().getData();
            tableUKEP.getRow(r.id).getElement().style.backgroundColor = g_upd_rec_bg;
            console.log("cellEditing");
        },

        cellEditCancelled: function (cell) {
            console.log("cellEditCancelled");
        },

        // перерасчет сумм ИФНС, изменение цвета фона строки после редактирования -------
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

    //button_init("#b_addUKEP");
    //button_init("#b_calcUKEP");
    //button_init("#b_foolUKEP");
    //button_init("#b_calcALL");

    // кнопка перерасчета таблицы------------------------------
    $("#b_calcALL").click(function () {
        recalcAll();
    });


    // кнопка добавление записи в журнал-----------------------
    //$("#b_addUKEP").click(function () {
    //    let xhr = new XMLHttpRequest(); xhr.onreadystatechange = function () {
    //        if (this.readyState == 4 && this.status == 200) {
    //            let id = this.responseText
    //            console.log("id = ", id);
    //            console.log(yymmdd);
    //            tableUKEP.addRow([{
    //                id: id,
    //                date: yymmdd,
    //                sono: g_user.sono,
    //                kol_requested: 0,
    //                sum_requested: 0,
    //                kol_completed: 0,
    //                sum_completed: 0,
    //                kol_work: 0,
    //                comment: ""
    //            }], false)
    //            recalcSum(id);
    //            //tableUKEP.replaceData("myphp/loadDataUKEP.php");
    //            let ll = tableUKEP.rowManager.rows.length;
    //            console.log("ll = " + ll);
    //            tableUKEP.getRow(id).getElement().style.backgroundColor = g_new_rec_bg;
    //            tableUKEP.scrollToRow(ll, "center", true);
    //            tableUKEP.scrollToColumn("kol_requested", "middle", true);
    //        }
    //    }
    //    let yymmdd = moment().format("YYYY-MM-DD");
    //    xhr.open("GET", "myphp/addUKEP.php?s=" + g_user.sono + "&d=" + yymmdd, true); xhr.send();
    //});


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



function format_cell(cell, color) {
    var value = cell.getValue();
    if (value==0) {return "";}
    return "<span style='color:"+color+"; font-weight:bold;'>" + value + "</span>";
}

function saveRow(r) {
    let o = {
        "id": r.id,
        "mysql_table": "signature",
        "date": r.date,
        [field_kol_requested]: r[field_kol_requested],
        [field_sum_requested]: r[field_sum_requested],
        [field_kol_completed]: r[field_kol_completed],
        [field_sum_completed]: r[field_sum_completed],
        [field_kol_work]: r[field_kol_work],
        "comment": r.comment
    };
    console.log("cellEdited");
    updateTable(o);
}


function recalcSum(id_start) {
    console.log("id_start = " + id_start);
    let rr = tableUKEP.rowManager.rows;
    if (id_start == 0) { id_start = rr[0].data.id; }
    let sum_req = 0;
    let sum_com = 0;
    let sum_wrk = 0;
    let sum = false;

    for (let i = 0; i < rr.length; i++) {

        let r = rr[i].data;
        console.log(field_kol_requested);
        console.log(field_sum_requested);
        console.log(field_kol_completed);
        console.log(field_sum_completed);
        console.log(field_kol_work);

        if (r.id != id_start && !sum) {
            sum_req = parseInt(r[field_sum_requested]);
            sum_com = parseInt(r[field_sum_completed]);
            console.log(sum_req, " ", sum_com);
            continue;
        }

        if (r.id == id_start) { sum = true; }

        sum_req = sum_req + parseInt(r[field_kol_requested]);
        sum_com = sum_com + parseInt(r[field_kol_completed]);
        console.log(sum_req, " ", sum_com);

        r[field_sum_requested] = sum_req;
        r[field_sum_completed] = sum_com;
        r[field_kol_work] = sum_req - sum_com;

        saveRow(r);
    }

}



function recalcAll() {
    let rr = tableUKEP.rowManager.rows;
    let ff = ["6171", "6173", "6174", "6181", "6182", "6183", "6186", "6188", "6191", "6192", "6195", "6196"];

    for (let i = 0; i < rr.length; i++) {
        
        let r = rr[i].data;
        let kol_req = 0;
        let kol_com = 0;
        let sum_req = 0;
        let sum_com = 0;
        let kol_wrk = 0;
    
        for (fi in ff) {
            f = ff[fi];
            //console.log(kol_req);
            kol_req = kol_req + parseInt(r["kol_requested_" + f]);
            kol_com = kol_com + parseInt(r["kol_completed_" + f]);
            sum_req = sum_req + parseInt(r["sum_requested_" + f]);
            sum_com = sum_com + parseInt(r["sum_completed_" + f]);
            kol_wrk = kol_wrk + parseInt(r["kol_work_"      + f]);
        }
        r.kol_requested = kol_req; 
        r.kol_completed = kol_com;
        r.sum_requested = sum_req;
        r.sum_completed = sum_com;
        r.kol_work      = kol_wrk;
    }
    console.log("End recalcAll")
}
