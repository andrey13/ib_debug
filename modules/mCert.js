function mCert() {
    let appHeight = appBodyHeight();
    let tCert = '<div id="tabCert" style="display: inline-block; height: 100%; width: 100%;"></div>';

    id2e('appBody').innerHTML = tCert;
    id2e('appBody').style.height = appHeight;

    createTabCert("tabCert", appHeight);
}

//=======================================================================================
function customFilterCert(data, filterParams){
    let dt = moment().format('YYYY-MM-DD');
    let cENA = id2e('cENA').checked;
    let cDIS = id2e('cDIS').checked;

    return ((cENA && data.dt_stop >= dt) || (cDIS && data.dt_stop <= dt));
}

//=======================================================================================
function tabCertSetFilter() {
    tabCert.setFilter(customFilterCert, '');
}

//=======================================================================================
function cb_onclick() {
    tabCert.setFilter(customFilterCert, '');
}




//=======================================================================================
//  табулятор инцидентов
//=======================================================================================
function createTabCert(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";
    //let dt_now = moment().format('YYYY-MM-DDTHH:mm');  
    let dt_now = new Date(moment().format('YYYY-MM-DD'));  
    dt_now = dt_now.getTime();
    let cENA = `<input type='checkbox' id='cENA' checked style="vertical-align: middle;" onclick="cb_onclick()"><label for='cENA' style="vertical-align: middle;"> действительный</label>&nbsp;&nbsp;&nbsp;&nbsp;`;
    let cDIS = `<input type='checkbox' id='cDIS' checked style="vertical-align: middle;" onclick="cb_onclick()"><label for='cDIS' style="vertical-align: middle;"> недействительные</label>&nbsp;&nbsp;&nbsp;&nbsp;`;
    let bVEW = "<button id='vewCert' title='Предварительный просмотр заявки' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-eye'></i></button>";
    let bPRT = "<button id='prtCert' title='Сохранение в файле PDF заявки'   class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-download'></i></button>";
    let bDEL = "<button id='delCert' title='Удаление заявки'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-minus'></i></button>";
    let bADD = "<button id='addCert' title='Создание заявки'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-plus'></i></button>";
    let bMOD = `<button id='modCert' title='Изменить заявку'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`;
    let ms = cENA + cDIS + bPRT + bVEW + bDEL + bMOD + bADD;

    tabCert = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataCert.php",
        ajaxParams: { s: g_user.sono },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>сертификаты<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,
        rowFormatter: function (row) {
            let dt_stop = new Date(row.getData().dt_stop);
            dt_stop = dt_stop.getTime();
            let dt_diff = (dt_stop - dt_now)  / (60 * 60 * 24 * 1000);
            //console.log(dt_stop, dt_now, dt_stop - dt_now, dt_diff)
            if (dt_diff < 30) { row.getCell("dt_stop").getElement().style.color = g_color_v3; }
        },


        columns: [
            { title: "id",                          field: "id",   width: 50, print: false},
            //{ title: "i_comp",                      field: "id_comp",   width: 50},
            //{ title: "i_cert",                      field: "id_cert",   width: 50},
            { title: "СОНО ",                       field: "sono", width: 60, headerFilter: true, topCalc: "count", print: false},
            { title: "АРМ",                         field: "name", width: 110, headerFilter: true},
            { title: "комната",                     field: "room", width: 60, headerFilter: true},
            { title: "ip",                          field: "ip",   width: 110, headerFilter: true, print: false},
            { title: "управляется",                 field: "user",     widthGrow: 2, headerFilter: true, formatter:"textarea"},
            { title: "начало",                      field: "dt_start", width: 80, headerFilter: true, 
              formatter: "datetime", formatterParams: {
                  inputFormat: "YYYY-MM-DD",
                  outputFormat: "DD.MM.YYYY",
              }
            },
            { title: "конец",                      field: "dt_stop", width: 80, headerFilter: true, 
              formatter: "datetime", formatterParams: {
                  inputFormat: "YYYY-MM-DD",
                  outputFormat: "DD.MM.YYYY",
              }
            },
            { title: "серийный номер",               field: "Serial",      widthGrow: 1, headerFilter: true, formatter:"textarea", print: false},
            { title: "Наименование УЦ",              field: "org",         widthGrow: 2, headerFilter: true, formatter:"textarea"},
            { title: "ФИО владельца",                field: "fio",         widthGrow: 2, headerFilter: true, formatter:"textarea"},
            { title: "должность",                    field: "title",       widthGrow: 2, headerFilter: true, formatter:"textarea"},
            { title: "поле Issuer сертификата",      field: "Issuer",      widthGrow: 4, headerFilter: true, formatter:"textarea", print: false},
            { title: "поле Subject сертификата",     field: "Subject",     widthGrow: 4, headerFilter: true, formatter:"textarea", print: false},
        ],

        renderStarted: function () {
        },

        dataLoaded: function (data) {
            let id_Cert = getFirstID( tabCert );
            tabCert.selectRow( id_Cert );
        },

        rowClick: function (e, row) {
            let id_Cert_old = getCurrentID( tabCert );
            let id_Cert_new = row.getData().id;
            if (id_Cert_new==id_Cert_old) return;
            tabCert.deselectRow(id_Cert_old);
            tabCert.selectRow(  id_Cert_new )
        },

        cellDblClick: function (e, cell) { editCert('edit'); },

        footerElement: ms,
    });

    id2e('cDIS').checked = false;

    //id2e("delCert").disabled = (allow.D == 0);
    //id2e("addCert").disabled = (allow.C == 0);
    //id2e("modCert").disabled = (allow.E == 0);

    //id2e("vewCert").onclick = function () { printCert('view')  };
    //id2e("prtCert").onclick = function () { printCert('print') };
    //id2e("modCert").onclick = function () { editCert('edit')   };
    //id2e("addCert").onclick = function () { editCert('new')    };
//
    //id2e("delCert").onclick = function () {
    //    let r = tabCert.getSelectedData()[0];
    //    dialogYESNO("инцидент:<br>" + "id:" + r.id + "<br>" + r.date + "»</b><br>будет удален, вы уверены?<br>")
    //        .then(ans => {
    //            if (ans == "YES") {
    //                runSQL_p(`DELETE FROM Cert WHERE id=${r.id}`)
    //                    .then((res) => {
    //                        tabCert.replaceData();
    //                    });
    //            }
    //        });
    //};

    id2e(id_div).style.display = 'inline-block';
    tabCert.setFilter(customFilterCert, '');
}


//=======================================================================================
// модальное окно редактора инцидента (mode = 'edit'/'new')
//=======================================================================================
async function editCert( mode ) {
    let allow = getAllows();
    let d ={};
    let user   = await runSQL_p(`SELECT * FROM user WHERE id=${g_user.id}`);
    let depart = await runSQL_p(`SELECT * FROM depart WHERE id=${g_user.id_depart}`);
    let title_tex = JSON.parse(user)[0].title;              
    let dep_tex = JSON.parse(depart)[0].name;
    let id_depart = g_user.id_depart;
    let fio_tex = g_user.name;
    let itype = '';

    if (mode == 'new') {          
        d = {date: moment().format('YYYY-MM-DD'),
             sono: g_user.sono,
             id_Cert: 0, 
             name: '',
             description: '',
             result: '',               
             comment: '',
            };    
    } else {
        d = tabCert.getSelectedData()[0];
    }
    console.log('d=', d);

    let formFirDoc  = `<div id="veditCert" class="w3-container">
                              <br><br>

                              <input type="date" id="date" value="${d.date}" tabindex="2"> Дата инцидента (нарушения)
                              <br><br>

                              <b>Краткое описание инцидента (нарушения):</b><br>
                              <textarea id="name" rows="2" style="width:100%">${d.name}</textarea><br>
                              <button id="b_TYPE" class="w3-button w3-border w3-hover-teal"  tabindex="6">выбрать из справочника</button><br><br>
                              
                              <b>Краткое описание инцидента (нарушения):</b><br>
                              <textarea id="description" rows="6" style="width:100%">${d.description}</textarea><br><br>

                              <b>Результат проверки инцидента:</b><br>
                              <textarea id="result" rows="6" style="width:100%">${d.result}</textarea><br><br>

                              <b>примечание:</b><br>
                              <textarea id="comment" rows="6" style="width:100%">${d.comment}</textarea><br><br>

                              <button id="b_ENTER" class="w3-button w3-border w3-hover-teal"  tabindex="6">сохранить</button>
                              <button id="b_CANCEL" class="w3-button w3-border w3-hover-teal" tabindex="7">отменить</button>
                              <br><br>
                  </div>`;

    newModalWindow('editCert', '', formFirDoc, '', '80%', '5%');
  
//    id2e("FirDoc_ok").checked = (d.ok == 1);   
//    id2e("FirDoc_ok").focus();
//    id2e("FirDoc_ok").select();

    id2e("b_TYPE"  ).onclick = function () { 
        selectVocab('Cert_type', 'name', -1, 'виды инцидентов', allow)
        .then(selected => {
            d.id_Cert = selected.id;
            d.name        = selected.name;
            id2e('name').innerText = d.name;
        });
};

    // кнопка ENTER --------------------------------------------------------------------
    id2e("b_ENTER").onclick = function () {
        d.date        = id2e('date').value;
        d.description = id2e('description').value;
        d.result      = id2e('result').value;
        d.comment     = id2e('comment').value;
        let name      = d.name;
        delete d.name;

        if (mode=='edit') {
            updateDBRecord(d, 'Cert')
            d.name = name;
            tabCert.updateData([d]);
        } else {
            insertDBRecord_p(d, 'Cert')
                .then((id) => {
                    d.id = id;
                    //tabCert.addData([d], true);
                    tabCert.replaceData()
                        .then((rows)=>{
                            tabCert.scrollToRow(id, "top", false);
                            tabCert.deselectRow();
                            tabCert.selectRow(id);
                        });
                });
        }

        removeModalWindow('editCert');
    }; //b_ENTER -------------------------------------------------------------------------

    // кнопка CANCEL --------------------------------------------------------------------
    id2e("b_CANCEL").onclick = function () {
        removeModalWindow('editCert');
    }; //b_CANCEL ------------------------------------------------------------------------   
} 
