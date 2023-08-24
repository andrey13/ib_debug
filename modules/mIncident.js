function mIncident() {
    let appHeight = appBodyHeight();
    let tIncident = '<div id="tabIncident" style="display: inline-block; height: 100%; width: 100%;"></div>';

    id2e('appBody').innerHTML = tIncident;
    id2e('appBody').style.height = appHeight;

    createTabIncident("tabIncident", appHeight);
}

//=======================================================================================
//  табулятор инцидентов
//=======================================================================================
function createTabIncident(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";
    let bVEW = "<button id='vewIncident' title='Предварительный просмотр заявки' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-eye'></i></button>";
    let bPRT = "<button id='prtIncident' title='Сохранение в файле PDF заявки'   class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-download'></i></button>";
    let bDEL = "<button id='delIncident' title='Удаление заявки'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-minus'></i></button>";
    let bADD = "<button id='addIncident' title='Создание заявки'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-plus'></i></button>";
    let bMOD = `<button id='modIncident' title='Изменить заявку'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`;
    let ms = bPRT + bVEW + bDEL + bMOD + bADD;

    tabIncident = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataIncident.php",
        ajaxParams: { s: g_user.sono },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>инциденты<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,

        columns: [
            { title: "id",                          field: "id",   width: 50},
            { title: "СОНО ",                       field: "sono", width: 50, headerFilter: true, topCalc: "count"},
            { title: "дата",                        field: "date", width: 80, headerFilter: true, 
              formatter: "datetime", formatterParams: {
                  inputFormat: "YYYY-MM-DD",
                  outputFormat: "DD.MM.YYYY",
              }
            },
            { title: "вид инцидента",                field: "name",        widthGrow: 1, headerFilter: true},
            { title: "краткое описание",             field: "description", widthGrow: 1, headerFilter: true},
            { title: "результат проверки инцидента", field: "result",      widthGrow: 1, headerFilter: true},
            { title: "примечание",                   field: "comment",     widthGrow: 1, headerFilter: true},
        ],

        renderStarted: function () {
        },

        dataLoaded: function (data) {
            let id_Incident = getFirstID( tabIncident );
            tabIncident.selectRow( id_Incident );
        },

        rowClick: function (e, row) {
            let id_Incident_old = getCurrentID( tabIncident );
            let id_Incident_new = row.getData().id;
            if (id_Incident_new==id_Incident_old) return;
            tabIncident.deselectRow(id_Incident_old);
            tabIncident.selectRow(  id_Incident_new )
        },

        cellDblClick: function (e, cell) { editIncident('edit'); },

        footerElement: ms,
    });

    id2e("delIncident").disabled = (allow.D == 0);
    id2e("addIncident").disabled = (allow.C == 0);
    id2e("modIncident").disabled = (allow.E == 0);

    id2e("vewIncident").onclick = function () { printIncident('view')  };
    id2e("prtIncident").onclick = function () { printIncident('print') };
    id2e("modIncident").onclick = function () { editIncident('edit')   };
    id2e("addIncident").onclick = function () { editIncident('new')    };

    id2e("delIncident").onclick = function () {
        let r = tabIncident.getSelectedData()[0];
        dialogYESNO("инцидент:<br>" + "id:" + r.id + "<br>" + r.date + "»</b><br>будет удален, вы уверены?<br>")
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM incident WHERE id=${r.id}`)
                        .then((res) => {
                            tabIncident.replaceData();
                        });
                }
            });
    };

    id2e(id_div).style.display = 'inline-block';
}


//=======================================================================================
// модальное окно редактора инцидента (mode = 'edit'/'new')
//=======================================================================================
async function editIncident( mode ) {
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
             id_incident: 0, 
             name: '',
             description: '',
             result: '',               
             comment: '',
            };    
    } else {
        d = tabIncident.getSelectedData()[0];
    }
    console.log('d=', d);

    let formFirDoc  = `<div id="veditIncident" class="w3-container">
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

    newModalWindow('editIncident', '', formFirDoc, '', '80%', '5%');
  
//    id2e("FirDoc_ok").checked = (d.ok == 1);   
//    id2e("FirDoc_ok").focus();
//    id2e("FirDoc_ok").select();

    id2e("b_TYPE"  ).onclick = function () { 
        selectVocab('incident_type', 'name', -1, 'виды инцидентов', allow)
        .then(selected => {
            d.id_incident = selected.id;
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
            updateDBRecord(d, 'incident')
            d.name = name;
            tabIncident.updateData([d]);
        } else {
            insertDBRecord_p(d, 'incident')
                .then((id) => {
                    d.id = id;
                    //tabIncident.addData([d], true);
                    tabIncident.replaceData()
                        .then((rows)=>{
                            tabIncident.scrollToRow(id, "top", false);
                            tabIncident.deselectRow();
                            tabIncident.selectRow(id);
                        });
                });
        }

        removeModalWindow('editIncident');
    }; //b_ENTER -------------------------------------------------------------------------

    // кнопка CANCEL --------------------------------------------------------------------
    id2e("b_CANCEL").onclick = function () {
        removeModalWindow('editIncident');
    }; //b_CANCEL ------------------------------------------------------------------------   
} 
