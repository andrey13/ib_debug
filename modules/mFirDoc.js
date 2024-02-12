let id_dep_dep = 0;

function mFirDoc() {
    console.log("run mFirDoc");

    let appHeight = appBodyHeight();

    let tDoc = '<div id="tabDoc" style="display: inline-block; height: 100%; width:  30%;"></div>';
    let tUsr = '<div id="tabUsr" style="display: inline-block; height: 100%; width:  50%;"></div>';
    let tPrf = '<div id="tabPrf" style="display: inline-block; height: 100%; width:  20%;"></div>';


    $("#appBody").html(tDoc + tUsr + tPrf);
    $("#appBody").height(appHeight);

    createTabFirDoc("tabDoc", appHeight);
    
    //createTabFirDocUsrPrf("tabPrf", appHeight);
}


//=======================================================================================
//  табулятор заявок ФИР
//=======================================================================================
function createTabFirDoc(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";
    let bMOD = (allow.E == 1) ? `<button id='modFirDoc' title='Изменить заявку'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>` : ``;
    let bVEW =                  "<button id='vewFirDoc' title='Предварительный просмотр заявки' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-eye'></i></button>";
    let bPRT =                  "<button id='prtFirDoc' title='Сохранение в файле PDF заявки'   class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-download'></i></button>";
    let bUPL =                  "<button id='uplFirDoc' title='Загрузка скана заявки'           class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-upload'></i></button>";
    let bDEL = (allow.D == 1) ? "<button id='delFirDoc' title='Удаление заявки'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-minus'></i></button>" : "";
    let bADD = (allow.C == 1) ? "<button id='addFirDoc' title='Создание заявки'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-plus'></i></button>" : "";
    let bCOP = (allow.C == 1) ? "<button id='copFirDoc' title='Копирование заявки'              class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-clone'></i></button>" : "";
    
    let ms = bUPL + bPRT + bVEW + bDEL + bMOD + bADD + bCOP;
    let dep_filter = (allow.A == 1) ? -1 : g_user.id_depart;

    tableFirDoc = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataFirDoc.php",
        ajaxParams: { s: g_user.sono, d:  dep_filter },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>заявки ФИР<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,

        columns: [
            { title: "id", field: "id", width: 50, },
            { title: "",   field: "ok", formatter:"tickCross", width: 5},
            { title: "дата", field: "date", width: 80, headerFilter: true, topCalc: "count", 
              formatter: "datetime", formatterParams: {
                  inputFormat: "YYYY-MM-DD",
                  outputFormat: "DD.MM.YYYY",
              }
            },
            { title: "отдел",            field: "dep_dep"},
            { title: "начальник отдела", field: "fio_dep"},
            { title: "исполнитель",      field: "fio_tex"},
        ],

        renderStarted: function () {
        },

        dataLoaded: function (data) {
            let id_FirDoc = getFirstID( tableFirDoc );
            tableFirDoc.selectRow( id_FirDoc );
            createTabFirDocUsr("tabUsr", id_FirDoc, appH);
        },

        rowClick: function (e, row) {
            let id_FirDoc_old = getCurrentID( tableFirDoc );
            let id_FirDoc_new = row.getData().id;
            if (id_FirDoc_new==id_FirDoc_old) return;
            tableFirDoc.deselectRow(id_FirDoc_old);
            tableFirDoc.selectRow(  id_FirDoc_new )
            createTabFirDocUsr("tabUsr", id_FirDoc_new, appH);
        },

        cellDblClick: function (e, cell) { editFirDoc('edit'); },

        footerElement: ms,
    });

    id2e("vewFirDoc").onclick = function () { printFirDoc('view')  };
    id2e("prtFirDoc").onclick = function () { printFirDoc('print') };
    id2e("modFirDoc").onclick = function () { editFirDoc('edit')   };
    id2e("addFirDoc").onclick = function () { editFirDoc('new')    };
    id2e("copFirDoc").onclick = function () { editFirDoc('copy')   };

    // кнопка удаления заявки -----------------------------------------------------------
    id2e("delFirDoc").onclick = function () {
        let r = tableFirDoc.getSelectedData()[0];
        dialogYESNO("заявки:<br>" + "id:" + r.id + "<br>" + r.date + "</b><br>будет удалена, вы уверены?<br>")
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM fir_usr_prf WHERE id_doc=${r.id}`);
                    runSQL_p(`DELETE FROM fir_user WHERE id_doc=${r.id}`);
                    runSQL_p(`DELETE FROM fir_doc  WHERE id=${r.id}`)
                        .then((res) => {
                            tableFirDoc.replaceData();
                        });
                }
            });
    };

    id2e(id_div).style.display = 'inline-block';
}

//=======================================================================================
// создание табулятора пользователей ФИР
//=======================================================================================
function createTabFirDocUsr(id_div, id_doc, appH) {

    let allow = getAllows();
    let ed   = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";

    let msgFooter = `<div style="vertical-align: middle; margin: auto;">
                        <button id='uplFirCmp' title='Загрузить скан АКТа'           class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-upload'></i></button>
                        <button id='prtFirCmp' title='Сохранение в файле PDF АКТа'   class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-download'></i></button>
                        <button id='vewFirCmp' title='Предварительный просмотр АКТа' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-eye'></i></button>
                        <button id='delFirCmp' title='Удалить пользователя'          class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-minus'></i></button>
                        <button id='modFirCmp' title='Изменить пользователя'         class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>
                        <button id='addFirCmp' title='Добавить пользователя'         class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-plus'></i></button>
                        <button id='copFirCmp' title='Копировать пользователя'       class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-clone'></i></button>
                     </div>`;

    tableFirDocUsr = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataFirDocUsr.php",
        ajaxConfig: "GET",
        ajaxParams: { d: id_doc },
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Пользователи ФИР<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        columns: [
          { title: '№',  formatter:"rownum", hozAlign:"center", width:50},
          //{ title: "id",                   field: "id",            headerFilter: true, width: 50 },
                    { title: "логин",      field: "logon",         headerFilter: true, width: 80 },
                    { title: "подключено", field: "dt_start",    width: 100, headerFilter: true, topCalc: "count",
                        formatter: "datetime", formatterParams: { inputFormat: "YYYY-MM-DD", outputFormat: "DD.MM.YYYY" }
                    },
                    { title: "отключено",  field: "dt_stop",    width: 100, headerFilter: true,
                        formatter:function(cell, formatterParams, onRendered){
                            let d = cell.getValue();
                            console.log("d=",d);
                            if (d=='3000-01-01') return '';
                            return d;
                        },
                },
                    { title: "уч/запись",        field: "Account",       headerFilter: true, width: 100 },                    
                    { title: "пользователь ЕСК", field: "fio_esk",       headerFilter: true,  },
                    { title: "компьютер",        field: "comp_esk",      headerFilter: true,  },
        ],

        renderComplete: function () {
            if (allow.C=='0') id2e("addFirCmp").disabled = true;
            if (allow.D=='0') id2e("delFirCmp").disabled = true;
        },

        dataLoaded: function (data) {
            let id_FirDocUsr = getFirstID( tableFirDocUsr );
            tableFirDocUsr.selectRow( id_FirDocUsr );
            createTabFirDocUsrPrf("tabPrf", id_doc, id_FirDocUsr, appH);
        },

        rowClick: function (e, row) {
            let id_FirDocUsr_old = getCurrentID( tableFirDocUsr );
            let id_FirDocUsr_new = row.getData().id;
            if (id_FirDocUsr_new==id_FirDocUsr_old) return;
            tableFirDocUsr.deselectRow(id_FirDocUsr_old);
            tableFirDocUsr.selectRow(  id_FirDocUsr_new )
            createTabFirDocUsrPrf("tabPrf", id_doc, id_FirDocUsr_new, appH);
        },

        cellDblClick: function (e, cell) { editFirCmp('edit'); },


        footerElement: msgFooter,
    });  //tableFirDocUsr

    id2e("modFirCmp").onclick = function () { editFirCmp('edit') };
//  id2e("addFirCmp").onclick = function () { editFirCmp('new') };

    id2e("addFirCmp").onclick = function () {
        let sono      = tableFirDoc.getSelectedData()[0].sono;
        let id_depart = tableFirDoc.getSelectedData()[0].id_depart;
        if (sono != '6100') id_depart = -1;

        selectComp(sono, ESK_ON, id_depart, SELECTABLE_ON)
        .then(selectedComps => {
            selectedComps.forEach(comp => {
                let sql = `INSERT INTO fir_user (id_doc, sono, id_comp, id_user, fio_fir, fio_esk, comp_usr, comp_esk, comp_dsc, comp_lock, user_lock, dt_start, dt_stop, fir_status) 
                           VALUES (${id_doc}, '${sono}', ${comp.id_comp}, ${comp.id_user}, '${comp.user}', '${comp.user}', '${comp.user}', '${comp.name}', '${comp.description}', 1, 1, '', '3000-01-01', 2)`;
                runSQL_p(sql)
                    .then((id) => {
                        tableFirDocUsr.addData([{
                            id:       id,
                            id_doc:   id_doc,
                            id_comp:  comp.id_comp,
                            id_user:  comp.id_user,
                            Account:  comp.Account,
                            comp_esk: comp.name,
                            user_esk: comp.user,
                            fio_esk:  comp.user,
                            fir_status: 2,
                        }], true);
                        tableFirDocUsr.scrollToRow(id, "top", false);
                        tableFirDocUsr.deselectRow();
                        tableFirDocUsr.selectRow(id);
                        createTabFirDocUsrPrf("tabPrf", id_doc, id, appH);
                    });
            });

        });
    }; // addFirCmp

    id2e("delFirCmp").onclick = function () {
        
            dialogYESNO("Выбранные компьютеры<br>будут удалены<br>из заявки<br>вы уверены?<br>")
            .then(ans => {
                if (ans == "YES") {
                    tableFirDocUsr.getSelectedData().forEach(comp => {
                        runSQL_p(`DELETE FROM fir_usr_prf WHERE id_doc=${id_doc} AND id_fir_user=${comp.id}`);
                        runSQL_p(`DELETE FROM fir_user WHERE id=${comp.id}`)
                            .then((res) => {
                                tableFirDocUsr.replaceData();
                            });
                    });
                }
            });
    }; // delFirCmp

    id2e(id_div).style.display = 'inline-block';
}

//=======================================================================================
// создание табулятора профилей ФИР
//=======================================================================================
function createTabFirDocUsrPrf(id_div, id_doc, id_fir_user, appH) {
    console.log("id_doc1=", id_doc);
    let allow = getAllows();
    let ed   = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";

    let msgFooter = `<div style="vertical-align: middle; margin: auto;">
                        <button id='delUsrPrf' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-minus'></i></button>
                        <button id='addUsrPrf' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-plus'></i></button>
                     </div>`;

    tableFirDocUsrPrf = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataFirDocUsrPrf.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { d: id_doc, f: id_fir_user },
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
            { title: "профиль",   field: "name",        headerFilter: true, widthGrow: 1, topCalc: "count" },    
            { title: "примечание",field: "title",       headerFilter: true, widthGrow: 2,}
        ],

        renderComplete: function () {
            if (allow.C=='0') id2e("addUsrPrf").disabled = true;
            if (allow.D=='0') id2e("delUsrPrf").disabled = true;
        },

        dataLoaded: function (data) {
            let id_FirDocUsrPrf = getFirstID( tableFirDocUsrPrf );
            tableFirDocUsrPrf.selectRow( id_FirDocUsrPrf );
        },

        rowClick: function (e, row) {
            let id_FirDocUsrPrf_old = getCurrentID( tableFirDocUsrPrf );
            let id_FirDocUsrPrf_new = row.getData().id;
            if (id_FirDocUsrPrf_new==id_FirDocUsrPrf_old) return;
            tableFirDocUsrPrf.deselectRow(id_FirDocUsrPrf_old);
            tableFirDocUsrPrf.selectRow(  id_FirDocUsrPrf_new )
        },

        footerElement: msgFooter,

    }); // tableFirDocUsrPrf

    id2e("addUsrPrf").onclick = function () {
        selectProfile(true)
        .then(selectedProfiles => {
            selectedProfiles.forEach(profile => {
                let sql = `INSERT INTO fir_usr_prf (id_doc, id_fir_user, id_fir_profile) 
                           VALUES (${id_doc}, ${id_fir_user}, ${profile.id})`;
                runSQL_p(sql)
                    .then((id) => {
                        tableFirDocUsrPrf.addData([{
                            id: id,
                            id_doc: id_doc,
                            id_fir_user:    id_fir_user,
                            id_fir_profile: profile.id,
                            name:           profile.name,
                        }], true);
                        tableFirDocUsrPrf.scrollToRow(id, "top", false);
                        tableFirDocUsrPrf.deselectRow();
                        tableFirDocUsrPrf.selectRow(id);

                        let row = tableFirDocUsrPrf.searchRows('id', '=', id)[0];
                    });
            });

        });
    }; // addFirCmp

    id2e("delUsrPrf").onclick = function () {
        
            dialogYESNO("Выбранные профили<br>будут удалены<br>вы уверены?<br>")
            .then(ans => {
                if (ans == "YES") {
                    tableFirDocUsrPrf.getSelectedData().forEach(profile => {
                        runSQL_p(`DELETE FROM fir_usr_prf WHERE id=${profile.id}`)
                            .then((res) => {
                                tableFirDocUsrPrf.replaceData();
                            });
                    });
                }
            });
    }; // delFirCmp


    id2e(id_div).style.display = 'inline-block';

}




//=======================================================================================
// модальное окно редактора заявки ФИР (mode = 'edit'/'new'/'copy')
//=======================================================================================
async function editFirDoc( mode ) {
    let allow = getAllows();
    let d = {};
    let n_selected = tableFirDoc.getSelectedRows().length;

    // id_depart = 0 для админов и ИФНС, id_depart <> 0 для технологов УФНС
    let id_depart = (g_user.sono == '6100' && allow.A == '0') ? g_user.id_depart : 0;

    // копирование данных заявки в объект d
    if ((mode == 'edit' || mode == 'copy') && n_selected == 1) {
        d = tableFirDoc.getSelectedData()[0];
        if (mode=='copy') { 
            delete d.id;
            d.date = moment().format('YYYY-MM-DD');
            d.ok = 0;
        }
    }

    // создание пустой заявки
    if (mode == 'new' || (mode == 'copy' && n_selected == 0)) {        
        let user   = await runSQL_p(`SELECT * FROM user WHERE id=${g_user.id}`);
        let depart = await runSQL_p(`SELECT * FROM depart WHERE id=${g_user.id_depart}`);
        
        d = {ok: 0,
             date: moment().format('YYYY-MM-DD'),
             sono: g_user.sono,
             id_user_tex: g_user.id, 
             title_tex: JSON.parse(user)[0].title,               
             dep_tex: JSON.parse(depart)[0].name,
             id_depart: id_depart,
             fio_tex: g_user.name,
             id_user_dep: "",
             title_dep: "",               
             dep_dep: "",
             fio_dep: "",
             id_user_ib: "",
             title_ib: "",               
             dep_ib: "",
             fio_ib: "",
             id_user_it: "",
             title_it: "",               
             dep_it: "",
             fio_it: "",
             id_user_ruk: "",
             title_ruk: "",               
             dep_ruk: "",
             fio_ruk: "",
            };    
    }

    let formFirDoc  = `<div id="vEditFirDoc" class="w3-container">
                              <br><br>
                              <span id="id_depart">id_depart = ${d.id_depart}</span><br><br>
                              <input type="checkbox" id="FirDoc_ok" tabindex="1"> Формирование заявки завершено
                              <br><br>
                              <input type="date" id="FirDoc_date" value="${d.date}" tabindex="2"> Дата заявки
                              <br><br>
                              <button id="b_TEX" class="w3-button w3-border w3-hover-teal"  tabindex="6">составил</button> <br> 
                              <span id="title_tex">${d.title_tex}</span><br>
                              <span id="dep_tex">  ${d.dep_tex}</span><br> 
                              <span id="fio_tex">  ${d.fio_tex}</span><br><br>
                              <button id="b_DEP" class="w3-button w3-border w3-hover-teal"  tabindex="6">подписал (начальник отдела)</button> <br> 
                              <span id="title_dep">${d.title_dep}</span><br>
                              <span id="dep_dep">  ${d.dep_dep}</span><br> 
                              <span id="fio_dep">  ${d.fio_dep}</span><br><br>
                              <button id="b_IB" class="w3-button w3-border w3-hover-teal"  tabindex="6">согласовал (начальник ОИБ или сотрудник, ответственный за ИБ) </button> <br> 
                              <span id="title_ib">${d.title_ib}</span><br>
                              <span id="dep_ib">  ${d.dep_ib}</span><br> 
                              <span id="fio_ib">  ${d.fio_ib}</span><br><br>
                              <button id="b_IT" class="w3-button w3-border w3-hover-teal"  tabindex="6">согласовал (начальник ОИТ)</button> <br> 
                              <span id="title_it">${d.title_it}</span><br>
                              <span id="dep_it">  ${d.dep_it}</span><br> 
                              <span id="fio_it">  ${d.fio_it}</span><br><br>
                              <button id="b_RUK" class="w3-button w3-border w3-hover-teal"  tabindex="6">руководитель УФНС или начальник ТНО</button> <br> 
                              <span id="title_ruk">${d.title_ruk}</span><br>
                              <span id="dep_ruk">  ${d.dep_ruk}</span><br> 
                              <span id="fio_ruk">  ${d.fio_ruk}</span><br><br>
                              <button id="b_ENTER" class="w3-button w3-border w3-hover-teal"  tabindex="6">сохранить</button>
                              <button id="b_CANCEL" class="w3-button w3-border w3-hover-teal" tabindex="7">отменить</button>
                              <br><br>
                  </div>`;

    newModalWindow('editFirDoc', '', formFirDoc, '', '600px', '5%');
  
    id2e("FirDoc_ok").checked = (d.ok == 1);   
    id2e("FirDoc_ok").focus();
    id2e("FirDoc_ok").select();


    function fioOnClick(sufix) {
        let id_dep = 0;

        // id_dep - номер отдела для разных подписантов заявки
        switch (sufix) {
            case 'tex': id_dep = id_depart;   break; // <>0 только для технологов УФНС
            case 'dep': id_dep = id_depart;   break; // <>0 только для технологов УФНС
            case 'ib':  id_dep = 18;          break;
            case 'it':  id_dep = 8;           break;
            case 'ruk': id_dep = 47;          break;
        }

        id_dep = (g_user.sono != '6100') ? 0 : id_dep;  // =0 для ИФНС
        
        selectUser(g_user.sono, ESK_ON, id_dep)
        .then(selectedUsers => {
            selectedUsers.forEach(user => {
                runSQL_p(`SELECT * FROM depart WHERE id=${user.id_depart}`)
                    .then((depart) => {       
                        if (sufix == 'dep') {
                            d.id_depart = user.id_depart;
                            id2e('id_depart').innerText = `id_depart = ${user.id_depart}`;
                            console.log('d.id_depart=', d.id_depart);
                        }
                        d['id_user_' + sufix]   = user.id;
                        d['title_'   + sufix]   = user.title;
                        d['dep_'     + sufix]   = JSON.parse(depart)[0].name;
                        d['fio_'     + sufix]   = user.name;
                        id2e('title_' + sufix).innerText = d['title_' + sufix];
                        id2e('dep_'   + sufix).innerText = d['dep_'   + sufix];
                        id2e('fio_'   + sufix).innerText = d['fio_'   + sufix];
                    });
            });

        });
    }

    id2e("b_TEX"  ).onclick = function () { fioOnClick('tex') };
    id2e("b_DEP"  ).onclick = function () { fioOnClick('dep') };
    id2e("b_IB"   ).onclick = function () { fioOnClick('ib' ) };
    id2e("b_IT"   ).onclick = function () { fioOnClick('it' ) };
    id2e("b_RUK"  ).onclick = function () { fioOnClick('ruk') };

    id2e("b_ENTER").onclick = function () {
        d.ok        = (id2e('FirDoc_ok').checked) ? 1: 0;
        d.date      =  id2e('FirDoc_date').value;
        //d.id_depart = +id2e('id_depart').innerText;
        if (mode=='edit') {
            updateDBRecord(d, "fir_doc")
            console.log("update",d);
            tableFirDoc.updateData([d]);
        } else {
            // создание новой записи
            console.log("insert",d);
            insertDBRecord_p(d, "fir_doc")
                .then((id) => {
                    console.log("id=",id);
                    d.id = id;
                    //tableFirDoc.addData([d], true);
                    tableFirDoc.replaceData()
                        .then((rows)=>{
                            tableFirDoc.scrollToRow(id, "top", false);
                            tableFirDoc.deselectRow();
                            tableFirDoc.selectRow(id);
                        });
                });
        }
        removeModalWindow('editFirDoc');
    }; //b_ENTER -------------------------------------------------------------------------

    // кнопка CANCEL --------------------------------------------------------------------
    id2e("b_CANCEL").onclick = function () {
        removeModalWindow('editFirDoc');
    }; //b_CANCEL ------------------------------------------------------------------------   
} 

//=======================================================================================
// модальное окно редактора пользователя ФИР (mode = 'edit'/'new')
//=======================================================================================
async function editFirCmp( mode ) {
    let allow = getAllows();
    let d ={};
    let n_selected = tableFirDocUsr.getSelectedRows().length;

    if (n_selected == 1) {
        d = tableFirDocUsr.getSelectedData()[0];
        if (mode=='new') { delete d.id; }
    }

    if (mode=='new' && n_selected == 0) {        
        d = {
                logon:           '',
                sono:            '',
                fio_fir:         '',
                fio_esk:         '',
                comp_esk:        '',
                comp_usr:        '',
                comp_dsc:        '',
                ncomp:            0,
                id_comp:          0,
                id_user:          0,
                fir_status:      '',
                dt_start:        '',
                dt_stop:         '',
                numb_req:        '',
                dt_req_start:    '',
                dt_req_stop:     '',
                numb_req_start:  '',
                numb_req_stop:   '',
                cname:           '',
                uname:           '',
                Account:         '',
                ip:              '',
                c_esk_status:    '',
                u_esk_status:    '',
                c_dsc:           '',
                u_dsc:           '',
                reson:           '',
            };    
    }

    let formFirDocUsr  = `<div id="vEditFirDocUsr" class="w3-container">
                              <br><br>
                              <button id="b_FIR" class="w3-button w3-border w3-hover-teal"  tabindex="6">пользователь ФИР</button> 
                              <span id="fio_esk"> ${d.fio_esk} </span> 
                              <span id="comp_esk">${d.comp_esk}</span><br><br> 
                              <span>Обоснование необходимости доступа (положения должностных инструкций и регламентов, задачи, работы)</span><br>
                              <button id="b_RESON" class="w3-button w3-border w3-hover-teal"  tabindex="6">выбрать</button><br><br>
                              <textarea id="reson" rows="6" style="width:100%">${d.reson}</textarea><br>
                              <br>
                              <button id="b_ENTER" class="w3-button w3-border w3-hover-teal"  tabindex="6">сохранить</button>
                              <button id="b_CANCEL" class="w3-button w3-border w3-hover-teal" tabindex="7">отменить</button>
                              <br><br>
                  </div>`;

    newModalWindow('editFirDocUsr', '', formFirDocUsr, '', '90%', '5%', '%5');
  
    id2e("b_RESON").onclick = function () {
        let sono      = tableFirDoc.getSelectedData()[0].sono;
        let id_depart = tableFirDoc.getSelectedData()[0].id_depart;
        if (sono != '6100' || allow.A == 1) id_depart = 0;

        selectReson(g_user.sono, id_depart)  
            .then(selectedResons => {
                selectedResons.forEach(reson => {
                    d.reson       = reson.text; 
                    id2e('reson').innerHTML  = d.reson;
                });
            });
    };

    id2e("b_FIR").onclick = function () {
        let sono      = tableFirDoc.getSelectedData()[0].sono;
        let id_doc    = tableFirDoc.getSelectedData()[0].id;
        let id_depart = tableFirDoc.getSelectedData()[0].id_depart;
        if (sono != '6100' || allow.A == 1) id_depart = -1;

        //selectComp('6100', '2', g_user.id_depart, false)
        selectComp(sono, ESK_ON, id_depart, SELECTABLE_1)  
        .then(selectedComps => {
            selectedComps.forEach(comp => {
                d.sono       = sono; 
                d.id_doc     = id_doc;
                d.id_comp    = comp.id_comp; 
                d.id_user    = comp.id_user;
                d.fio_fir    = comp.user; 
                d.fio_esk    = comp.user;
                d.comp_usr   = comp.user;
                d.comp_esk   = comp.name;
                d.comp_dsc   = comp.description;
                d.comp_lock  = 1;
                d.user_lock  = 1;
                d.dt_start   = '';
                d.dt_stop    = '';
                d.fir_status = 2;
                id2e('fio_esk').innerText  = d.fio_esk;
                id2e('comp_esk').innerText = d.comp_esk;
            });
        });
    };

    id2e("b_ENTER").onclick = function () {
        if (mode=='edit') {
            delete d.cname;
            delete d.uname;
            delete d.Account;
            delete d.ip;
            delete d.c_esk_status;
            delete d.u_esk_status;
            delete d.c_dsc;
            delete d.u_dsc;
            d.reson = id2e('reson').value;

            updateDBRecord(d, "fir_user")
            tableFirDocUsr.updateData([d]);
        } else {
            // создание новой записи
            console.log("insert",d);
            insertDBRecord_p(d, "fir_user")
                .then((id) => {
                    console.log("id=",id);
                    d.id = id;
                    //tableFirDoc.addData([d], true);
                    tableFirDoc.replaceData()
                        .then((rows)=>{
                            tableFirDocUsr.scrollToRow(id, "top", false);
                            tableFirDocUsr.deselectRow();
                            tableFirDocUsr.selectRow(id);
                        });
                });
        }
        removeModalWindow('editFirDocUsr');
    }; //b_ENTER ------------------------------------------------------------------------

    // кнопка CANCEL --------------------------------------------------------------------
    id2e("b_CANCEL").onclick = function () {
        removeModalWindow('editFirDocUsr');
    }; //b_CANCEL ------------------------------------------------------------------------   
} 

//=======================================================================================
// создание PDF-файла заявки на доступ в ФИР
//=======================================================================================
async function printFirDoc( mode ) {
    let doc_data = tableFirDoc.getSelectedData()[0];
    let pdf_name = `${doc_data.date} Заявка на доступ к ФИР ${doc_data.dep_dep}.pdf`;
    console.log("pdf_name=",pdf_name);

    // параметры шрифта pdf-документа ---------------------------------------------------
    pdfMake.fonts = {
        times: {
            normal: 'times.ttf',
            bold: 'timesbd.ttf',
            italics: 'timesi.ttf',
            bolditalics: 'timesbi.ttf'
        }
    };

    // параметры заголовка pdf-документа ------------------------------------------------
    let doc_head = { 
        pageSize: 'A4', pageOrientation: 'landscape', pageMargins: [20, 20, 20, 20],

        defaultStyle: { font: 'times', fontSize: 8, },

        styles: {
            header1: { font: 'times', fontSize: 14,                alignment: 'left',  },
            header2: { font: 'times', fontSize:  9,                alignment: 'left',  },
            header3: { font: 'times', fontSize: 11, bold:    true, alignment: 'center', },
            header4: { font: 'times', fontSize:  9, bold:    true, alignment: 'center', },
            header5: { font: 'times', fontSize:  9,                alignment: 'center', },
            header6: { font: 'times', fontSize:  9,                alignment: 'left', },
            header7: { font: 'times', fontSize: 10,                alignment: 'left', },
            table:   { margin: [0, 0, 0, 0] },
            tableHeader: { fontSize: 8, alignment: 'center', }
        },
    };

    let content1 = [
        {
            columns:[
                {
                    text: `«Утверждаю  удаленный доступ
                    к федеральным информационным ресурсам»
                    ${txt2txt( doc_data.title_ruk )}
                    ${txt2txt( doc_data.dep_ruk )}

                    _____________________________________${fio2fio2(doc_data.fio_ruk)}
                    «____»____________________  20   г.
                   `,
                    style: ['header1'],
                    width: 500,
                },
                {
                    text: `Приложение № 4
                    к Порядку подключения пользователей к федеральным 
                    информационным ресурсам и сервисам, сопровождаемым 
                    ФКУ «Налог-Сервис ФНС России, 
                    утвержденному приказом ФНС России
                    от «___» ___________________ 2014 года
                    №  ________________________________
                    `,
                    style: ['header2'],
                    width: 300,
                },
            ],            
        },
        { text: `Заявка №________`, style: ['header3'], },
        { text: `на предоставление услуги удаленного доступа к федеральным информационным ресурсам и сервисам, сопровождаемым ФКУ «Налог-Сервис» ФНС России`, style: ['header4'], },
        { text: `В связи со служебной необходимостью, обусловленной положениями должностных инструкций, прошу предоставить удаленный доступ  к федеральным информационным ресурсам следующим`, style: ['header5'], }, 
        { text: `специалистам отдела ${doc_data.dep_dep} УФНС России по Ростовской области:`, style: ['header6'], },
    ];

    let content3 = [

        { text: `* Своей подписью пользователь подтверждает, что:
        1. соглашается c обработкой, сбором, систематизацией, накоплением, хранением, уточнением, подтверждением, использованием, уничтожением своих персональных данных;
        2. ознакомлен с требованиями о неразглашении информации, полученной при использовании федеральных информационных ресурсов (приложение №14к Порядку подключения пользователей к федеральным информационным ресурсам и сервисам, сопровождаемым ФКУ «Налог-Сервис» ФНС России).
        `, style: ['header6']
        },
        { text: `${txt2txt( doc_data.title_dep )} ${txt2txt( doc_data.dep_dep )} УФНС России по Ростовской области
        
        «____»  _______________  20__г   ________________  ${fio2fio2(doc_data.fio_dep)}
        ${String.fromCharCode(0x00A0)}                                                              подпись

        Согласовано:

        ${txt2txt( doc_data.title_ib )} ${txt2txt( doc_data.dep_ib )} УФНС России по Ростовской области

        «____»  _______________  20__г   ________________  ${fio2fio2(doc_data.fio_ib)}
        ${String.fromCharCode(0x00A0)}                                                              подпись

        ${txt2txt( doc_data.title_it )} ${txt2txt( doc_data.dep_it )} УФНС России по Ростовской области

        «____»  _______________  20__г   ________________  ${fio2fio2(doc_data.fio_it)}
        ${String.fromCharCode(0x00A0)}                                                              подпись
        `, style: ['header7']},

    ];

    let content2 = await printFirDocTable();
    console.log('content2=',content2);

    let doc = Object.assign(doc_head, { content: content1.concat(content2).concat(content3) });

    pdfMake.tableLayouts = {
        szLayout: {
            hLineWidth:   function (i, node) { return     0.5; },
            vLineWidth:   function (i)       { return     0.5; },
            hLineColor:   function (i)       { return 'black'; },
            paddingLeft:  function (i)       { return       3; },
            paddingRight: function (i, node) { return       3; }
        }
    };

    if (mode == 'view') {
        pdfMake.createPdf( doc ).open();
    } else {
        pdfMake.createPdf( doc ).download(pdf_name);
    }
}

async function printFirDocTable() {
    let doc_data = tableFirDoc.getSelectedData()[0];
    let usr_data = tableFirDocUsr.getData();

    if (usr_data.length == 0) return [];

    let table_head = [
        {
            style: 'table',
            table: {
                widths: [20, 140, 140, 90, 180, 60, 60, 60],
                headerRows: 1,
                // keepWithHeaderRows: 1,
                body: [
                    [
                        { text: '№', style: 'tableHeader' },
                        { text: 'Фамилия, имя, отчество', style: 'tableHeader' },
                        { text: 'Структурное\nподразделение\n(отдел)', style: 'tableHeader' },
                        { text: 'Наименование федерального информационного ресурса\n(наименование профиля по перечню\nресурсов ФИР)', style: 'tableHeader' },
                        { text: 'Обоснование необходимости\nдоступа\n(конкретные положения\nдолжностных инструкций и\nрегламентов, конкретные\nзадачи, работы)', style: 'tableHeader' },
                        { text: 'Номер комнаты,\nгде будет\nустановлено АРМ\nдля работы с\nУслугой', style: 'tableHeader' },
                        { text: 'Имя учетной\nзаписи\nпользователя\n(если\nучетная\nзапись\nсуществует)', style: 'tableHeader' },
                        { text: 'Подпись\nпользователя*', style: 'tableHeader'},
                    ],
                    [
                        { text: '1', style: 'tableHeader' },
                        { text: '2', style: 'tableHeader' },
                        { text: '3', style: 'tableHeader' },
                        { text: '4', style: 'tableHeader' },
                        { text: '5', style: 'tableHeader' },
                        { text: '6', style: 'tableHeader' },
                        { text: '7', style: 'tableHeader' },
                        { text: '8', style: 'tableHeader' },
                    ],
                ]
            },
            layout: 'szLayout'
        },
    ];

    let table_content = [];
    let profiles = '';
    let reson = '';
    let nroom = '';
    let logon = '';

    let i = 0;
    for (d of usr_data) {
        profiles = await user2profiles(doc_data.id, d.id);
        table_content[i] = [{text: i+1, style: 'tableHeader'}, d.fio_esk, doc_data.dep_dep, profiles, reson, nroom, logon, ''];
        i += 1;
    }

      table_head[0].table.body = table_head[0].table.body.concat(table_content);
      console.log('table_head[0].table.body=', table_head[0].table.body);

    return table_head;
}

// формирование списка профилей пользователя ФИР ----------------------------------------
async function user2profiles(id_doc, id_fir_user) {
    return new Promise(function (resolve, reject) {
        let sql = `SELECT fp.name
                    FROM fir_usr_prf  AS fup
                    LEFT JOIN fir_profile AS fp ON fp.id = fup.id_fir_profile
                    WHERE  id_doc = ${id_doc} AND id_fir_user=${id_fir_user}
                    ORDER BY fp.name`;
        runSQL_p(sql).then((profiles) => { 
            let prfls = profiles
                            .replaceAll(`{"name":"`,``)
                            .replaceAll(`"}`,``)
                            .replaceAll(`[`,``)
                            .replaceAll(`]`,``)
                            .replaceAll(`,`,`\n`);
            resolve(prfls); 
        });
    });
}




//=======================================================================================
// модальное окно справочника оснований
//=======================================================================================
function selectReson(sono, id_depart) {
    return new Promise(function (resolve, reject) {
        let formReson  = `<div id="selectReson" class="w3-container"></div>`;
        newModalWindow('selectReson', '', formReson, '', '80%', '10%', '5%');
        appHeight = appBodyHeight() * 0.7;
        createTabSelectReson("#selectResonBody", appHeight, sono, id_depart, resolve, reject);
    });
}

//=======================================================================================
// табулятор справочника 
// id_div - блок DIV, в которм показывать табулятор
// appH   - высота блока DIV
//=======================================================================================

function createTabSelectReson(id_div, appH, sono, id_depart, resolve, reject) {
    let div_modal = id2e('selectResonMain');
    let allow = getAllows();
    let ed = (allow.E == 1) ? "textarea" : "";
    let bSel = (allow.E == 1) ? `<button id='bSel' class='w3-button w3-white w3-border w3-hover-teal'>Выбрать</button>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp` : ``;
    let bDel = (allow.E == 1) ? `<button id='bDel' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>` : ``;
    let bAdd = (allow.E == 1) ? `<button id='bAdd' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>` : ``;

    let msgFooter = bSel + bDel + bAdd;

    let cols = [
        { title: "id",                field: "id",               widthGrow: 1,  headerFilter: true, },
        { title: "sono",              field: "sono",             widthGrow: 1,  headerFilter: true, },
        { title: "id_depart",         field: "id_depart",        widthGrow: 1,  headerFilter: true, },
        { title: "название",          field: "name", editor: ed, widthGrow: 10, headerFilter: true, topCalc: "count" },
        { title: "текст обоснования", field: "text", editor: ed, widthGrow: 30, headerFilter: true, formatter:"textarea"},
    ];

    tabReson = new Tabulator(id_div, {
        ajaxURL: "myphp/loadDataReson.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { s: sono, d: id_depart },
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        columns: cols,
        footerElement: msgFooter,

        dataLoaded: function (data) {
            let id = getFirstID( tabReson );
            tabReson.selectRow( id )
        },

        cellClick: function (e, cell) {
            let row       = cell.getRow();
            let id_dd_old = getCurrentID( tabReson );
            let id_dd_new = row.getData().id;

            if (id_dd_new!=id_dd_old) {
                tabReson.deselectRow(id_dd_old);
                tabReson.selectRow(  id_dd_new )
            }
        },
        

        cellEdited: function (cell) {
            let o = cell.getRow().getData();
                runSQL(`UPDATE fir_reson SET name="${o.name}", text="${o.text}" WHERE id=${o.id}`);
        },

        cellDblClick: function (e, cell) {
            //let id = getCurrentID( tabReson );
            div_modal.style.display = "none";
            div_modal.remove();
            //let r = tabReson.searchRows("id", "=", id)[0].getData();
            //resolve(r);
            resolve(tabReson.getSelectedData());
        },

    });

    $("#bSel").click(function () {
        //let id = getCurrentID( tabReson );
        div_modal.style.display = "none";
        div_modal.remove();
        //let r = tabReson.searchRows("id", "=", id)[0].getData();
        //console.log('r=', r);
        //resolve(r);
        resolve(tabReson.getSelectedData());
    });

    $("#bAdd").click(function () {
        runSQL_p(`INSERT INTO fir_reson (sono, id_depart) VALUES ('${sono}', ${id_depart})`)
            .then((id) => {
                //tabReson.replaceData();
                tabReson.addData([{ id: id, sono: sono, id_depart: id_depart }], true);
                //g_tabReson.id_current = parseInt(id);
                tabReson.scrollToRow(id, "top", false);
                tabReson.deselectRow();
                tabReson.selectRow(id);

            });
    });

    $("#bDel").click(function () {
        let r = tabReson.getSelectedData()[0];
        dialogYESNO(`запись:<br>id:${r.id}<br>«${r.name}»</b><br>будет удалена, вы уверены?<br>`)
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM fir_reson WHERE id=${r.id}`)
                    .then((id) => {                
                        tabReson.replaceData();
                                //.then((rows)=>{
                                //    tabReson.scrollToRow(id, "top", false);
                                //    tabReson.deselectRow();
                                //    tabReson.selectRow(id);
                                //});
                    });
                }
            });
    });


}
