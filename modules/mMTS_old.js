function mMTS() {
    // очистка таймера -----------------------------------------------------------------
    if (g_timerId != 0) clearInterval(g_timerId)

    let appHeight = appBodyHeight();
    let tMTS = '<div id="tabMTS" style="display: inline-block; height: 100%; width: 100%;"></div>';

    id2e('appBody').innerHTML = tMTS;
    id2e('appBody').style.height = appHeight;

    createTabMTS("tabMTS", appHeight);
}

//=======================================================================================
function customFilterMTS(data, filterParams){
    return true

    let dt = moment().format('YYYY-MM-DD');
    let cENA = id2e('cENA').checked;
    let cDIS = id2e('cDIS').checked;

    return ((cENA && data.dt_stop >= dt) || (cDIS && data.dt_stop <= dt));
}

//=======================================================================================
function tabMTSSetFilter() {
    tabMTS.setFilter(customFilterMTS, '');
}

//=======================================================================================
function cb_onclick() {
    tabMTS.setFilter(customFilterMTS, '');
}




//=======================================================================================
//  табулятор инцидентов
//=======================================================================================
function createTabMTS(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";
    //let dt_now = moment().format('YYYY-MM-DDTHH:mm');  
    let dt_now = new Date(moment().format('YYYY-MM-DD'));  
    dt_now = dt_now.getTime();
    let cENA = `<input type='checkbox' id='cENA' checked style="vertical-align: middle;" onclick="cb_onclick()"><label for='cENA' style="vertical-align: middle;"> действительный</label>&nbsp;&nbsp;&nbsp;&nbsp;`;
    let cDIS = `<input type='checkbox' id='cDIS' checked style="vertical-align: middle;" onclick="cb_onclick()"><label for='cDIS' style="vertical-align: middle;"> недействительные</label>&nbsp;&nbsp;&nbsp;&nbsp;`;
    let bVEW = "<button id='vewMTS' title='Предварительный просмотр заявки' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-eye'></i></button>";
    let bPRT = "<button id='prtMTS' title='Сохранение в файле PDF заявки'   class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-download'></i></button>";
    let bDEL = "<button id='delMTS' title='Удаление заявки'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-minus'></i></button>";
    let bADD = "<button id='addMTS' title='Создание заявки'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-plus'></i></button>";
    let bMOD = `<button id='modMTS' title='Изменить заявку'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`;
    let ms = cENA + cDIS + bPRT + bVEW + bDEL + bMOD + bADD;

    tabMTS = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataMTS.php",
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
        // rowFormatter: function (row) {
        //     let dt_stop = new Date(row.getData().dt_stop);
        //     dt_stop = dt_stop.getTime();
        //     let dt_diff = (dt_stop - dt_now)  / (60 * 60 * 24 * 1000);
        //     //console.log(dt_stop, dt_now, dt_stop - dt_now, dt_diff)
        //     if (dt_diff < 30) { row.getCell("dt_stop").getElement().style.color = g_color_v3; }
        // },


        columns: [
            { title: "id",                          field: "id",   width: 50, print: false},
            { title: "i_user",                      field: "id_user",   width: 50},
            { title: "i_depart",                    field: "id_depart",   width: 50},
            { title: "дата",                        field: "date", width: 80, headerFilter: true, 
              formatter: "datetime", formatterParams: {
                  inputFormat: "YYYY-MM-DD",
                  outputFormat: "DD.MM.YYYY",
              }
            },
            { title: "SN",            field: "SN",   width: 200, headerFilter: true, print: false},
            { title: "пользователь",  field: "user", widthGrow: 2, headerFilter: true},
            { title: "отдел",         field: "otdel",widthGrow: 2, headerFilter: true},
            { title: "описание",      field: "desc", widthGrow: 2, headerFilter: true},
            { title: "объем Гб",      field: "size", width: 80, headerFilter: true},
            { title: "производитель", field: "manufacturer", width: 90, headerFilter: true, print: false},
            { title: "модель",        field: "product_model", widthGrow: 2, headerFilter: true, print: false},
            { title: "ревизия",       field: "revision", width: 60, headerFilter: true, print: false},
            { title: "USB device ID", field: "usb_device_id",     widthGrow: 2, headerFilter: true},
            { title: "комментарии",   field: "comment", widthGrow: 2, headerFilter: true},
        ],

        renderStarted: function () {
        },

        dataLoaded: function (data) {
            let id_MTS = getFirstID( tabMTS );
            tabMTS.selectRow( id_MTS );
        },

        rowClick: function (e, row) {
            let id_MTS_old = getCurrentID( tabMTS );
            let id_MTS_new = row.getData().id;
            if (id_MTS_new==id_MTS_old) return;
            tabMTS.deselectRow(id_MTS_old);
            tabMTS.selectRow(  id_MTS_new )
        },

        cellDblClick: function (e, cell) { editMTS('edit'); },

        footerElement: ms,
    });

    id2e('cDIS').checked = false;

    //id2e("delMTS").disabled = (allow.D == 0);
    //id2e("addMTS").disabled = (allow.C == 0);
    //id2e("modMTS").disabled = (allow.E == 0);

    //id2e("vewMTS").onclick = function () { printMTS('view')  };
    //id2e("prtMTS").onclick = function () { printMTS('print') };
    //id2e("modMTS").onclick = function () { editMTS('edit')   };
    //id2e("addMTS").onclick = function () { editMTS('new')    };
//
    //id2e("delMTS").onclick = function () {
    //    let r = tabMTS.getSelectedData()[0];
    //    dialogYESNO("инцидент:<br>" + "id:" + r.id + "<br>" + r.date + "»</b><br>будет удален, вы уверены?<br>")
    //        .then(ans => {
    //            if (ans == "YES") {
    //                runSQL_p(`DELETE FROM MTS WHERE id=${r.id}`)
    //                    .then((res) => {
    //                        tabMTS.replaceData();
    //                    });
    //            }
    //        });
    //};

    id2e(id_div).style.display = 'inline-block';
    tabMTS.setFilter(customFilterMTS, '');
}


//=======================================================================================
// модальное окно редактора инцидента (mode = 'edit'/'new')
//=======================================================================================
async function editMTS( mode ) {
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
             id_MTS: 0, 
             name: '',
             description: '',
             result: '',               
             comment: '',
            };    
    } else {
        d = tabMTS.getSelectedData()[0];
    }
    console.log('d=', d);

    let formFirDoc  = `<div id="veditMTS" class="w3-container">
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

    newModalWindow('editMTS', '', formFirDoc, '', '80%', '5%');
  
//    id2e("FirDoc_ok").checked = (d.ok == 1);   
//    id2e("FirDoc_ok").focus();
//    id2e("FirDoc_ok").select();

    id2e("b_TYPE"  ).onclick = function () { 
        selectVocab('MTS_type', 'name', -1, 'виды инцидентов', allow)
        .then(selected => {
            d.id_MTS = selected.id;
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
            updateDBRecord(d, 'MTS')
            d.name = name;
            tabMTS.updateData([d]);
        } else {
            insertDBRecord_p(d, 'MTS')
                .then((id) => {
                    d.id = id;
                    //tabMTS.addData([d], true);
                    tabMTS.replaceData()
                        .then((rows)=>{
                            tabMTS.scrollToRow(id, "top", false);
                            tabMTS.deselectRow();
                            tabMTS.selectRow(id);
                        });
                });
        }

        removeModalWindow('editMTS');
    }; //b_ENTER -------------------------------------------------------------------------

    // кнопка CANCEL --------------------------------------------------------------------
    id2e("b_CANCEL").onclick = function () {
        removeModalWindow('editMTS');
    }; //b_CANCEL ------------------------------------------------------------------------   
} 
