function mFIR() {
    let appHeight = appBodyHeight();
    //appHeight = appHeight - 40;

    let tFirCmp = '<div id="tabFirCmp" style="display: inline-block; height: 100%; width: 93%;"></div>';
    let tFirPrf = '<div id="tabFirPrf" style="display: inline-block; height: 100%; width: 7%;"></div>';

    document.getElementById('appBody').innerHTML    =  tFirCmp + tFirPrf;
    document.getElementById('appBody').style.height = appHeight;

    createTabUsrPrf("tabFirPrf", appHeight);
    createTabFirUsr("tabFirCmp", appHeight);
    console.log('createTabUsrPrf1');

    document.getElementById('tabFirCmp').style.display = 'inline-block';
    document.getElementById('tabFirPrf').style.display = 'inline-block';   
}


//=======================================================================================



//=======================================================================================
// создание табулятора пользователей ФИР
//=======================================================================================

function createTabFirUsr(id_div, appH) {
    g_tableFirUsr = {cSONO: true, cACTIVE: true, cNULL: false};

    let allow = getAllows();
    let ed   = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";

    let bADD = "<button id='addFirCmp' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Добавить</button>";
    let bDEL = "<button id='delFirCmp' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Удалить</button>";

    let msgFooterComp = `<div style="vertical-align: middle; margin: auto;">
                            <input type='checkbox' id='cESK2' checked style="vertical-align: middle;" onclick="cb_onclick('cESK2')"><label for='cESK2' style="vertical-align: middle;">ЕСК</label>&nbsp;&nbsp;&nbsp;&nbsp;
                           (<input type='checkbox' id='cESK0' checked style="vertical-align: middle;" onclick="cb_onclick('cESK0')"><label for='cESK0' style="vertical-align: middle;">вне ЕСК</label>
                            <input type='checkbox' id='cVLN1' checked style="vertical-align: middle;" onclick="cb_onclick('cVLN1')"><label for='cVLN1' style="vertical-align: middle;">с уязвимостями</label>
                            <input type='checkbox' id='cVLN0'         style="vertical-align: middle;" onclick="cb_onclick('cVLN0')"><label for='cVLN0' style="vertical-align: middle;">без уязвимостей</label>)&nbsp;&nbsp;&nbsp;&nbsp;
                            <button id='bHLP' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Помощь</button>
                        </div>`;

    let msgFooter = `<div style="vertical-align: middle; margin: auto;">
                        <input type='checkbox' id='cSONO'   checked style="vertical-align: middle;" onclick="fir_onclick('cSONO')"><label for='cSONO' style="vertical-align: middle;"> ${g_user.sono}</label>&nbsp;&nbsp;+&nbsp;&nbsp
                        <input type='checkbox' id='cACTIVE' checked style="vertical-align: middle;" onclick="fir_onclick('cACTIVE')"><label for='cACTIVE' style="vertical-align: middle;"> Активные</label>&nbsp;&nbsp;+&nbsp;&nbsp
                        <input type='checkbox' id='cNULL'           style="vertical-align: middle;" onclick="fir_onclick('cNULL')"><label for='cNULL' style="vertical-align: middle;"> Аннулированные</label>&nbsp;&nbsp;&nbsp;&nbsp                       
                        <span>список доступа на момент времени: </span>
                        <input  id="date" type="date" value="${dt_now}">&nbsp;&nbsp;
                        <span id="select-stats"></span>&nbsp;&nbsp;
                        <button id='bOff' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>отменить выделение</button> 
                        <button id='bPrt' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>заявка</button>
                        <button id='addFirCmp' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Добавить</button>
                        <button id='delFirCmp' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Удалить</button>
                     </div>`;


    tableFirUsr = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataFirUsr.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Пользователи ФИР<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        //selectable: true,
        //selectable: "highlight",

        columns: [
          //{ title: '№',  formatter:"rownum", hozAlign:"center", width:50},
          //{ title: "id",               field: "id",            headerFilter: true, width: 50 },
          {formatter:"rowSelection", titleFormatter:"rowSelection", align:"center", headerSort:false},
          { title: '<p align="center" style="margin:0;">Данные ФИР</sp>',
                columns: [
                    { title: "соно",             field: "sono",          headerFilter: true, width: 50, topCalc: "count" },
                    { title: "логин",            field: "logon",         headerFilter: true, width: 80 },
                    { title: "пользователь ФИР", field: "fio_fir",       headerFilter: true, widthGrow: 5 },
                    { title: "статус",           field: "fir_status",    headerFilter: true, width: 10 },
                    { title: "подключено", field: "dt_start",    width: 100, headerFilter: true, editor: ed_date, 
                        //sorter: "date",
                        formatter: "datetime", formatterParams: {
                            inputFormat: "YYYY-MM-DD",
                            outputFormat: "DD.MM.YYYY",
                        }
                    },
                    { title: "отключено", field: "dt_stop",    width: 100, headerFilter: true, editor: ed_date, 
                        //sorter: "date",
                        formatter: "datetime", formatterParams: {
                            inputFormat: "YYYY-MM-DD",
                            outputFormat: "DD.MM.YYYY",
                        }
                },
                    ],
            },
            { title: '<p align="center" style="margin:0;">Данные ЕСК</sp>',
                columns: [
                    { title: "",                 field: "u_esk_status",  headerFilter: true, width: 5,
                      formatter:function(cell, formatterParams, onRendered){
                          let esk_status = cell.getValue();
                          if (esk_status==2) return 'ЕСК'
                            return "";
                      },
                    },
                    { title: "уч/запись",        field: "Account",       headerFilter: true, width: 100 },                    
                    { title: "пользователь ЕСК", field: "fio_esk",       headerFilter: true, widthGrow: 5 },
                    { title: "",                 field: "c_esk_status",  headerFilter: true, width: 5,
                      formatter:function(cell, formatterParams, onRendered){
                          let esk_status = cell.getValue();
                          if (esk_status==2) return 'ЕСК'
                            return "";
                      },
                    },
                    { title: "компьютер",        field: "comp_esk",      headerFilter: true, width: 110,
                      cellClick:function(e, cell){
                          let id = cell.getRow().getData().id;
                          console.log('id=',id);
                          selectComp(g_user.sono, '', 0, false)
                          .then(selectedComps => {
                            selectedComps.forEach(comp => {
                                runSQL_p(`SELECT * FROM comp WHERE id=${comp.id}`)
                                .then((comp_rec) => {
                                    console.log(comp_rec[0].id);                                
                                    console.log(comp_rec[0]);       
                                });
//                              runSQL_p(`UPDATE cmp_res SET 
//                                               id_comp    = '${comp.id}', 
//                                               dt_stop    = '${d.dt_stop}', 
//                                               numb_start = '${d.numb_start}',
//                                               numb_stop  = '${d.numb_stop}'     WHERE id=${id}`
//                              );
//                              .then((id) => {
//                                      tableFirUsr.addData([{
//                                          id: id,
//                                          id_cmp:     comp.id,
//                                          id_res:     44,
//                                          cname:      comp.name,
//                                          uname:      comp.user,
//                                          esk_status: comp.esk_status,                            
//                                          ip:         comp.ip
//                                      }], true);
//                                      tableFirUsr.scrollToRow(id, "top", false);
//                                      let row = tableFirUsr.searchRows('id', '=', id)[0];
//                              });
                            });
                
                        });                
                      }, 
                    },
                    { title: "управляется",      field: "comp_usr",      headerFilter: true, width: 110 },
                    { title: "описание",         field: "comp_dsc",      headerFilter: true, width: 110 },
                    { title: "ip",               field: "ip",            headerFilter: true, width: 110 },
                ],
            },
            { title: '<p align="center" style="margin:0;">Данные DioNIS</sp>',
                columns: [
                    { title: 'acl',              field: "filter",    headerFilter: true, width: 50 },
                    { title: "DioNIS",           field: "torm",      headerFilter: true, width: 50 },
                ],
            },
            { title: "№ заявки",         field: "numb_req",      headerFilter: true, width: 30 },
            { title: "Письмо на подкл.",
                columns: [
                    { title: "№",    field: "numb_req_start",  width: 30, headerFilter: true, editor: ed, },
                    { title: "дата", field: "dt_req_start",    width: 80, headerFilter: true, editor: ed_date, 
                      //sorter: "date",
                      formatter: "datetime", formatterParams: {
                        inputFormat: "YYYY-MM-DD",
                        outputFormat: "DD.MM.YYYY",
                      }
                    },
                ],
            },
            { title: "Письмо на откл.",
                columns: [
                    { title: "№",    field: "numb_req_stop",  width: 30, headerFilter: true, editor: ed, },
                    { title: "дата", field: "dt_req_stop",    width: 100, headerFilter: true, editor: ed_date, 
                      //sorter: "date",
                      formatter: "datetime", formatterParams: {
                        inputFormat: "YYYY-MM-DD",
                        outputFormat: "DD.MM.YYYY",
                      }
                    },
                ],
            },          

        ],

        renderComplete: function () {
            if (allow.C=='0') document.getElementById("addFirCmp").disabled = true;
            if (allow.D=='0') document.getElementById("delFirCmp").disabled = true;
        },

        rowSelectionChanged: function (data, rows) {
            let disabled = (data.length==0) ? true : false;
            document.getElementById("bOff").disabled   = disabled;
            document.getElementById("bPrt").disabled   = disabled;
            document.getElementById("delFirCmp").disabled = disabled;
            document.getElementById("select-stats").innerHTML = 'выбрано: ' + data.length;
            if (allow.C=='0') document.getElementById("addFirCmp").disabled = true;
            if (allow.D=='0') document.getElementById("delFirCmp").disabled = true;
        },

        rowFormatter: function (row) {
            setRowColor(row, dt_now);
        },

        renderStarted: function () {
        },

        rowClick: function (e, row) {
            tableUsrPrf.setFilter([ {field:"id_fir_user",    type:"=",  value:row.getData().id} ]);
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
        tableFirUsrSetFilter(dt_now);
    };
    
    // отменить выделение записей -------------------------------------------------------
    document.getElementById("bOff").onclick = function () {
        tableFirUsr.deselectRow();
    };

    // сформировать запрос на удаление фильтров -----------------------------------------
    document.getElementById("bPrt").onclick = function () {
        printAddRequest( tableFirUsr.getSelectedData() );
    };

    document.getElementById("addFirCmp").onclick = function () {
        return;
        selectComp('6100', '', 0, false)
        .then(selectedComps => {
            selectedComps.forEach(comp => {
                runSQL_p(`INSERT INTO cmp_res (id_cmp, id_res, dt_start, dt_stop) VALUES (${comp.id}, 44, '', '3000-01-01')`)
                    .then((id) => {
                        tableFirUsr.addData([{
                            id: id,
                            id_cmp:     comp.id,
                            id_res:     44,
                            cname:      comp.name,
                            uname:      comp.user,
                            esk_status: comp.esk_status,                            
                            ip:         comp.ip
                        }], true);
                        tableFirUsr.scrollToRow(id, "top", false);
                        let row = tableFirUsr.searchRows('id', '=', id)[0];
                    });
            });

        });
    };

    document.getElementById("delFirCmp").onclick = function () {
        
            dialogYESNO("Выбранные компьютеры<br>будут удалены<br>из списка доступа<br>вы уверены?<br>")
            .then(ans => {
                if (ans == "YES") {
                    tableFirUsr.getSelectedData().forEach(comp => {
                        runSQL_p(`DELETE FROM cmp_res WHERE id=${comp.id}`)
                            .then((res) => {
                                tableFirUsr.replaceData("myphp/loadDataResCmp.php");
                            });
                    });
                }
            });
    };

    tableFirUsr.setFilter(customFilterFirUsr, '');

    
    //function tableFirUsrSetFilter(dt) {
    //    tableFirUsr.setFilter([
    //        {field:"id_res",    type:"=",  value:44},
    //        {field:"dt_start",  type:"<=", value:dt},
    //        [
    //            {field:"dt_stop",   type:">",   value:dt},
    //            {field:"filter",    type:"!=",  value:null},
    //        ]
    //    ]);    
    //}
    
}

function customFilterFirUsr(data, filterParams){
    return (!g_tableFirUsr.cSONO || (g_tableFirUsr.cSONO && data.sono == g_user.sono)) && ((g_tableFirUsr.cACTIVE && data.fir_status == 1) || (g_tableFirUsr.cNULL && data.fir_status == 2));
}  

function fir_onclick(id_checkbox) {
    g_tableFirUsr[id_checkbox] = id2e(id_checkbox).checked;
    tableFirUsr.setFilter(customFilterFirUsr, '');
}





function setRowColor(row,date) {
    let d = row.getData();
    row.getCells()[2].getElement().style.backgroundColor = '';
    row.getCells()[5].getElement().style.backgroundColor = '';
    if (d.fio_esk == '???' && d.fir_status == 1) {
        row.getCells()[9].getElement().style.backgroundColor = '#8cdeff';
    }
    if (d.ncomp > 1) {
        row.getCells()[11].getElement().style.backgroundColor = '#8cdeff';
        if (d.filter==null) row.getCells()[11].getElement().style.backgroundColor = '#e58fff';
        return;
    }
    if (d.id_comp == 0) {
        row.getCells()[11].getElement().style.backgroundColor = '#ff8585';
        return;
    }
    //if (d.c_esk_status != '2')                row.getCells()[9].getElement().style.backgroundColor = '#ff8585'; 
    if (!d.filter && d.fir_status == 1)       row.getCells()[10].getElement().style.backgroundColor = '#8cff8c'; 
    if (d.filter != null && d.dt_stop < date) row.getCells()[14].getElement().style.backgroundColor = '#ff8585'; 
}



//=======================================================================================
// создание табулятора профилей ФИР
//=======================================================================================

function createTabUsrPrf(id_div, appH) {
    console.log('createTabUsrPrf2');


    let allow = getAllows();
    let ed   = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";

    let bADD = "<button id='addFirPrf' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Добавить</button>";
    let bDEL = "<button id='delFirPrf' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Удалить</button>";
    let msgFooter = bDEL + bADD;
    msgFooter = '';


    tableUsrPrf = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataUsrPrf.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Профили пользователя ФИР<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",

        columns: [
          //{ title: "id",        field: "id",          headerFilter: true, width: 50 },
          //{ title: "id_user",   field: "id_fir_user", headerFilter: true, width: 50 },
            { title: "профиль",   field: "name",        headerFilter: true, widthGrow: 5, topCalc: "count" },    
        ],

        renderComplete: function () {
            if (allow.C=='0') document.getElementById("addFirPrf").disabled = true;
            if (allow.D=='0') document.getElementById("delFirPrf").disabled = true;
        },

        rowFormatter: function (row) {
        },

        renderStarted: function () {
        },

        rowClick: function (e, row) {
        },

        footerElement: msgFooter,
    });


}


//=======================================================================================
function printAddRequest(data) {

    div_modal = document.createElement('div');
    div_modal.className = "modal";

    div_modal.innerHTML = `<div id="modalWindow"class="modal-content" style="width:90%;height:1px">
                            <div id="modalHeader" class="modal-header w3-teal" style="padding:1px 16px"><p>заявка на добавление фильтров в список доступа in-fir</p></div>
                            <div id="modalBody"   class="modal-body tabulator"  style="padding:10px 10px"></div>     
                            <div id="modalFooter" class="modal-footer w3-teal"></div>
                           </div>`;

    let table    = '';
    table = table + 'на DioNIS СОНО: '   + g_user.sono + '<br>';
    table = table + '&nbsp;&nbsp;&nbsp;в списке доступа: in-fir добавить записи: <br>';

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
