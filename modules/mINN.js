import { getAllows, isRole } from '../myjs/start.js'

let tabINN = null

function mINN() {
    let appHeight = appBodyHeight();
    let tINN = '<div id="tabINN" style="display: inline-block; height: 100%; width: 100%;"></div>';

    id2e('appBody').innerHTML = tINN;
    id2e('appBody').style.height = appHeight;

    createtabINN("tabINN", appHeight);
}

//=======================================================================================
// function customFilterRVision(data, filterParams){
//     let cStart = id2e('cStart').checked;
//     let cStop  = id2e('cStop').checked;

//     let dStart = id2e('dStart').value;
//     let dStop  = id2e('dStop').value;

//     let on_off = ((cStart ? dStart <= data.detection : true) && (cStop ? data.detection <= dStop : true));

//     id2e('dStart').disabled = !cStart;
//     id2e('dStop').disabled  = !cStop;
//     //console.log(`${on_off} = (${cStart} && '${dStart}' <= '${data.detection}') && (${cStop} && '${data.detection}' <= '${dStop}')`);
//     return on_off;
// }


//=======================================================================================
//  табулятор инцидентов
//=======================================================================================
function createtabINN(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";
    //let dt_now = moment().format('YYYY-MM-DDTHH:mm');  
    let dt_now = new Date(moment().format('YYYY-MM-DD'));  
    dt_now = dt_now.getTime();

    let dt_start = moment('2020-01-01').format('YYYY-MM-DDTHH:mm');
    let dt_stop  = moment().format('YYYY-MM-DDTHH:mm');

    // let ms = `<input type='checkbox' id='cStart' style="vertical-align: middle;"><span> начало периода: </span>
    //           <input  id="dStart" type="datetime-local" value="${dt_start}">&nbsp;&nbsp;&nbsp;&nbsp;
    //           <input type='checkbox' id='cStop' style="vertical-align: middle;"><span> конец периода: </span>
    //           <input  id="dStop" type="datetime-local" value="${dt_stop}">&nbsp;&nbsp;&nbsp;&nbsp;`;
    let ms='';
    let no = prompt('НО?', '6100');

    tabINN = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadINN.php",
        ajaxParams: { n: no },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1><h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,
//        rowFormatter: function (row) {
//            let dt_stop = new Date(row.getData().dt_stop);
//            dt_stop = dt_stop.getTime();
//            let dt_diff = (dt_stop - dt_now)  / (60 * 60 * 24 * 1000);
//            //console.log(dt_stop, dt_now, dt_stop - dt_now, dt_diff)
//            if (dt_diff < 30) { row.getCell("dt_stop").getElement().style.color = g_color_v3; }
//        },
//
//
        columns: [
            // { title: "id1", field: "id1", headerFilter: true},
            // { title: "id2", field: "id2", headerFilter: true},
            { title: "НО", field: "no", headerFilter: true, topCalc: "count"},
            { title: "Наименование", field: "org", headerFilter: true},
            { title: "ИНН", field: "inn", headerFilter: true},
            { title: "КПП", field: "kpp", headerFilter: true},
            { title: "Дата нач.",                      field: "date1", width: 80, headerFilter: true, 
            //   formatter: "datetime", formatterParams: {
            //       inputFormat: "YYYY-MM-DD",
            //       outputFormat: "DD.MM.YYYY",
            //   }
            },
            { title: "Дата оконч.",                      field: "date2", width: 80, headerFilter: true, 
            //   formatter: "datetime", formatterParams: {
            //       inputFormat: "YYYY-MM-DD",
            //       outputFormat: "DD.MM.YYYY",
            //   }
            },
            { title: "Наименование УЦ",              field: "uz",         widthGrow: 2, headerFilter: true},
            { title: "ОКОПФ",                field: "okopf1",         widthGrow: 2, headerFilter: true},
            { title: "статус",                    field: "status",       widthGrow: 2, headerFilter: true},
        ],

        renderStarted: function () {
        },

        // dataLoaded: function (data) {
        //     let id_RVison = getFirstID( tabINN );
        //     tabINN.selectRow( id_RVison );
        // },

        // rowClick: function (e, row) {
        //     let id_RVison_old = getCurrentID( tabINN );
        //     let id_RVison_new = row.getData().id;
        //     if (id_RVison_new==id_RVison_old) return;
        //     tabINN.deselectRow(id_RVison_old);
        //     tabINN.selectRow(  id_RVison_new )
        // },

        // cellDblClick: function (e, cell) { return; editRVision('edit'); },

        footerElement: ms,
    });

    //tabINN.setDataFromLocalFile("/incidents.json");

    // id2e("cStart").onclick = function () { clog('cStart'); tabINN.setFilter(customFilterRVision, ''); };
    // id2e("cStop").onclick  = function () { clog('cStop');  tabINN.setFilter(customFilterRVision, ''); };
    // id2e("dStart").onchange = function () { clog('dStart'); tabINN.setFilter(customFilterRVision, ''); };
    // id2e("dStop").onchange  = function () { clog('dStop');  tabINN.setFilter(customFilterRVision, ''); };

    //id2e('cDIS').checked = false;

    //id2e("delCert").disabled = (allow.D == 0);
    //id2e("addCert").disabled = (allow.C == 0);
    //id2e("modCert").disabled = (allow.E == 0);

    //id2e("vewCert").onclick = function () { printRVision('view')  };
    //id2e("prtRVision").onclick = function () { printRVision('print') };
    //id2e("modCert").onclick = function () { editRVision('edit')   };
    //id2e("addCert").onclick = function () { editRVision('new')    };
//
    //id2e("delCert").onclick = function () {
    //    let r = tabINN.getSelectedData()[0];
    //    dialogYESNO("инцидент:<br>" + "id:" + r.id + "<br>" + r.date + "»</b><br>будет удален, вы уверены?<br>")
    //        .then(ans => {
    //            if (ans == "YES") {
    //                runSQL_p(`DELETE FROM Cert WHERE id=${r.id}`)
    //                    .then((res) => {
    //                        tabINN.replaceData();
    //                    });
    //            }
    //        });
    //};

    // id2e(id_div).style.display = 'inline-block';
    // //id2e('dStart').disabled = true;
    // //id2e('dStop').disabled  = true;
    // tabINN.setFilter(customFilterRVision, '');
}


//=======================================================================================
// модальное окно редактора инцидента (mode = 'edit'/'new')
//=======================================================================================
// async function editRVision( mode ) {
//     let allow = getAllows();
//     let d ={};
//     let user   = await runSQL_p(`SELECT * FROM user WHERE id=${g_user.id}`);
//     let depart = await runSQL_p(`SELECT * FROM depart WHERE id=${g_user.id_depart}`);
//     let title_tex = JSON.parse(user)[0].title;              
//     let dep_tex = JSON.parse(depart)[0].name;
//     let id_depart = g_user.id_depart;
//     let fio_tex = g_user.name;
//     let itype = '';

//     if (mode == 'new') {          
//         d = {date: moment().format('YYYY-MM-DD'),
//              sono: g_user.sono,
//              id_RVison: 0, 
//              name: '',
//              description: '',
//              result: '',               
//              comment: '',
//             };    
//     } else {
//         d = tabINN.getSelectedData()[0];
//     }
//     console.log('d=', d);

//     let formFirDoc  = `<div id="veditRVision" class="w3-container">
//                               <br><br>

//                               <input type="date" id="date" value="${d.date}" tabindex="2"> Дата инцидента (нарушения)
//                               <br><br>

//                               <b>Краткое описание инцидента (нарушения):</b><br>
//                               <textarea id="name" rows="2" style="width:100%">${d.name}</textarea><br>
//                               <button id="b_TYPE" class="w3-button w3-border w3-hover-teal"  tabindex="6">выбрать из справочника</button><br><br>
                              
//                               <b>Краткое описание инцидента (нарушения):</b><br>
//                               <textarea id="description" rows="6" style="width:100%">${d.description}</textarea><br><br>

//                               <b>Результат проверки инцидента:</b><br>
//                               <textarea id="result" rows="6" style="width:100%">${d.result}</textarea><br><br>

//                               <b>примечание:</b><br>
//                               <textarea id="comment" rows="6" style="width:100%">${d.comment}</textarea><br><br>

//                               <button id="b_ENTER" class="w3-button w3-border w3-hover-teal"  tabindex="6">сохранить</button>
//                               <button id="b_CANCEL" class="w3-button w3-border w3-hover-teal" tabindex="7">отменить</button>
//                               <br><br>
//                   </div>`;

//     newModalWindow('editRVision', '', formFirDoc, '', '80%', '5%');
  
// //    id2e("FirDoc_ok").checked = (d.ok == 1);   
// //    id2e("FirDoc_ok").focus();
// //    id2e("FirDoc_ok").select();

//     id2e("b_TYPE"  ).onclick = function () { 
//         selectVocab('Cert_type', 'name', -1, 'виды инцидентов', allow)
//         .then(selected => {
//             d.id_RVison = selected.id;
//             d.name        = selected.name;
//             id2e('name').innerText = d.name;
//         });
// };

//     // кнопка ENTER --------------------------------------------------------------------
//     id2e("b_ENTER").onclick = function () {
//         d.date        = id2e('date').value;
//         d.description = id2e('description').value;
//         d.result      = id2e('result').value;
//         d.comment     = id2e('comment').value;
//         let name      = d.name;
//         delete d.name;

//         if (mode=='edit') {
//             updateDBRecord(d, 'Cert')
//             d.name = name;
//             tabINN.updateData([d]);
//         } else {
//             insertDBRecord_p(d, 'Cert')
//                 .then((id) => {
//                     d.id = id;
//                     //tabINN.addData([d], true);
//                     tabINN.replaceData()
//                         .then((rows)=>{
//                             tabINN.scrollToRow(id, "top", false);
//                             tabINN.deselectRow();
//                             tabINN.selectRow(id);
//                         });
//                 });
//         }

//         removeModalWindow('editRVision');
//     }; //b_ENTER -------------------------------------------------------------------------

//     // кнопка CANCEL --------------------------------------------------------------------
//     id2e("b_CANCEL").onclick = function () {
//         removeModalWindow('editRVision');
//     }; //b_CANCEL ------------------------------------------------------------------------   
// } 

export {
    mINN
}