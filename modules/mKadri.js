const w_fio = 170;
const w_tabn = 20;
const w_date = 58;
const w_numb = 58;
const w_name = 205;

function mKadri() {
    //console.log("run mKadri");

    let appHeight = appBodyHeight();
    //appHeight = appHeight - 31;

    let tSZ = '<div id="tabSZ"     style="display: inline-block; height: 100%; width:  12%;"></div>';
    let tDD = '<div id="tabDD"     style="display: inline-block; height: 100%; width:  88%;"></div>';
    let tD1 = '<div id="tabD1"     style="height:  25%; width: 100%;"></div>';
    let tD2 = '<div id="tabD2"     style="height:  25%; width: 100%;"></div>';
    let tD3 = '<div id="tabD3"     style="height:  25%; width: 100%;"></div>';
    let tD4 = '<div id="tabD4"     style="height:  25%; width: 100%;"></div>';

    $("#appBody").html(tSZ + tDD);
    $("#tabDD").html(tD1 + tD2 + tD3 + tD4);
    $("#appBody").height(appHeight);

    //document.getElementById('appBody').style.display = 'inline-block';
    tableD = [];
    createTabulatorSZ("tabSZ", appHeight);
}

//=======================================================================================
// модальное окно редактора служебки (mode = 'edit'/'new')
//=======================================================================================
async function editSZ(mode) {
    let allow = getAllows();
    let d = (mode == 'edit') ? tableSZ.getSelectedData()[0] : { ok: 0, date: moment().format('YYYY-MM-DD'), numb: '', dt_start: '0000-00-00', dt_stop: '0000-00-00' };

    let formSZ = `<div id="vEditSZ" class="w3-container">
                              <br><br>
                              <input type="checkbox" id="sz_ok" tabindex="1">
                              <label for="sz_ok">  Формирование служебной записки завершено</label>
                              <br><br>
                              <input type="date" id="sz_date" value="${d.date}" tabindex="2">
                              <label for="sz_date">  Дата служебной записки</label>
                              <br><br>
                              <input type="text" id="sz_numb" value="${d.numb}" tabindex="3">
                              <label for="sz_numb">  Номер служебной записки</label>
                              <br><br>
                              <label for="sz_dt_start">Период кадровых изменений служебной записки</label><br>
                              <input type="date" id="sz_dt_start" value="${d.dt_start}" tabindex="4"> - <input type="date" id="sz_dt_stop"  value="${d.dt_stop}" tabindex="5">
                              <br><br>
                              <button id="b_ENTER" class="w3-button w3-border w3-hover-teal"  tabindex="6">сохранить</button>
                              <button id="b_CANCEL" class="w3-button w3-border w3-hover-teal" tabindex="7">отменить</button>
                              <br><br>
                  </div>`;

    newModalWindow('editSZ', '', formSZ, '', '400px', '5%');

    document.getElementById("sz_ok").checked = (d.ok == 1);
    document.getElementById("sz_ok").focus();
    document.getElementById("sz_ok").select();

    // кнопка ENTER ---------------------------------------------------------------------
    document.getElementById("b_ENTER").onclick = function () {
        d.ok = (document.getElementById("sz_ok").checked) ? 1 : 0;
        d.date = document.getElementById("sz_date").value;
        d.numb = document.getElementById("sz_numb").value;
        d.dt_start = document.getElementById("sz_dt_start").value;
        d.dt_stop = document.getElementById("sz_dt_stop").value;

        if (mode == 'edit') {
            // корректировка записи -----------------------------------------------------
            runSQL_p(`UPDATE kadri_change SET date="${d.date}", numb="${d.numb}", ok=${d.ok}, dt_start="${d.dt_start}", dt_stop="${d.dt_stop}" WHERE id=${d.id}`);
            tableSZ.updateData([{ id: d.id, ok: d.ok, date: d.date, numb: d.numb, dt_start: d.dt_start, dt_stop: d.dt_stop }]);
            createTabulatorDD(appBodyHeight(), d.id);
        } else {
            // создание новой записи ----------------------------------------------------
            let today = moment().format('YYYY-MM-DD');
            runSQL_p(`INSERT INTO kadri_change (ok, date, numb, dt_start, dt_stop) VALUES (${d.ok}, '${d.date}', '${d.numb}', '${d.dt_start}', '${d.dt_stop}')`)
                .then((id_sz_new) => {
                    tableSZ.addData([{ id: id_sz_new, date: d.date, numb: d.numb, dt_start: d.dt_start, dt_stop: d.dt_stop, ok: d.ok }], true);
                    tableSZ.scrollToRow(id_sz_new, "top", false);
                    tableSZ.deselectRow();
                    tableSZ.selectRow(id_sz_new);
                    createTabulatorDD(appBodyHeight(), id_sz_new);
                });
        }
        removeModalWindow('editSZ');
    }

    // кнопка CANCEL --------------------------------------------------------------------
    document.getElementById("b_CANCEL").onclick = function () {
        removeModalWindow('editSZ');
    }
}


//=======================================================================================
//  табулятор служебных записок кадровых изменений               
//=======================================================================================
function createTabulatorSZ(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";
    let bCFG = (allow.E == 1) ? `<button id='cfgSZ' title='Настроить поля служебной записки'           class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-cog'></i></button>` : ``;
    let bVEW = "<button id='vewSZ' title='Предварительеый просмотр служебной записки' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-eye'></i></button>";
    let bPRT = "<button id='prtSZ' title='Сохранение в файле PDF служебной записки'   class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-download'></i></button>";
    let bDEL = (allow.D == 1) ? "<button id='delSZ' title='Удаление служебной записки'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-minus'></i></button>" : "";
    let bADD = (allow.C == 1) ? "<button id='addSZ' title='Создание служебной записки'                 class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-plus'></i></button>" : "";
    let ms = bCFG + bVEW + bPRT + bDEL + bADD;

    tableSZ = new Tabulator('#' + id_div, {
        ajaxURL: "myphp/loadDataSZ.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>кадровые изменения<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,

        columns: [
            //{ title: "id", field: "id", widthGrow: 1, },
            { title: "", field: "ok", formatter: "tickCross" },
            {
                title: "дата", field: "date", width: 100, headerFilter: true, topCalc: "count",
                //sorter: "date",
                formatter: "datetime", formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD.MM.YYYY",
                }
            },
            { title: "№ служебки", field: "numb", widthGrow: 2, headerFilter: true },
        ],

        dataLoaded: function (data) {
            let id_sz = getFirstID(tableSZ);
            console.log(id_sz);
            tableSZ.selectRow(id_sz)
            createTabulatorDD(appH, id_sz);
        },

        rowClick: function (e, row) {
            let id_sz_old = getCurrentID(tableSZ);
            let id_sz_new = row.getData().id;
            if (id_sz_new == id_sz_old) return;
            tableSZ.deselectRow(id_sz_old);
            tableSZ.selectRow(id_sz_new)
            createTabulatorDD(appH, id_sz_new);
        },

        cellDblClick: function (e, cell) { editSZ('edit'); },

        footerElement: ms,
    });

    // кнопка настройки служебки из ОИБ в ИТ --------------------------------------------
    document.getElementById("cfgSZ").onclick = function () {
        configKadri(2);
    };

    // кнопка вывода в PDF-файл  служебки -----------------------------------------------
    document.getElementById("vewSZ").onclick = function () {
        let id_sz = tableSZ.getSelectedData()[0].id;
        sz_ok_oib(id_sz, 'view');
        sz_ok_oib_append(id_sz, 'view')
    };

    // кнопка вывода в PDF-файл  служебки -----------------------------------------------
    document.getElementById("prtSZ").onclick = function () {
        let id_sz = tableSZ.getSelectedData()[0].id;
        sz_ok_oib(id_sz, 'print');
        sz_ok_oib_append(id_sz, 'print')
    };

    // кнопка добавления новой служебки -------------------------------------------------
    document.getElementById("addSZ").onclick = function () { editSZ('new') };

    // кнопка удаления служебки ---------------------------------------------------------
    document.getElementById("delSZ").onclick = function () {
        let r = tableSZ.getSelectedData()[0];
        dialogYESNO("Кадровые изменения:<br>" + "id:" + r.id + "<br>" + r.numb + "<br>" + r.date + "»</b><br>будут удалены, вы уверены?<br>")
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM kadri_change_detail WHERE id_change=${r.id}`);
                    runSQL_p(`DELETE FROM kadri_change WHERE id=${r.id}`)
                        .then((res) => {
                            tableSZ.replaceData("myphp/loadDataSZ.php");
                        });
                }
            });
    };

    document.getElementById(id_div).style.display = 'inline-block';
}

//=======================================================================================
function createTabulatorDD(appH, id_sz) {
    createTabulatorD("tabD1", appH / 4, id_sz, 1);
    createTabulatorD("tabD2", appH / 4, id_sz, 2);
    createTabulatorD("tabD3", appH / 4, id_sz, 3);
    createTabulatorD("tabD4", appH / 4, id_sz, 4);
}

//=======================================================================================
function account2tabn(cell) {
    let account = cell.getRow().getData().account;
    let tabn = account.replace(/-/g, '').slice(-4);
    return tabn;
}

//=======================================================================================
function acc2tab(acc) {
    return acc.replace(/-/g, '').slice(-4);
}

//=======================================================================================
// табулятор 
//=======================================================================================
function createTabulatorD(id_div, appH, id_change, id_type) {
    let ok = tableSZ.getSelectedData()[0].ok;
    let allow = getAllows();
    let ed = (allow.E == 1 && ok == '0') ? "input" : "";
    let ed_date = (allow.E == 1 && ok == '0') ? date_Editor : "";
    let bCFG = (allow.E == 1 && id_type == 4) ? `<button id='cfgUsr' title='Настроить поля служебной записки'           class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-cog'></i></button>` : ``;
    let bVEW = (allow.C == 1) ? `<button id='vewUsr${id_type}'       title='Предварительеый просмотр служебной записки' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-eye'></i></button>` : ``;
    let bPRT = (allow.C == 1) ? `<button id='prtUsr${id_type}'       title='Сохранение в файле PDF служебной записки'   class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-download'></i></button>` : ``;
    let bDEL = (allow.D == 1) ? `<button id='delUsr${id_type}'       title='Удаление записи'                            class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class="fa fa-minus"></i></button>` : ``;
    let bADD = (allow.C == 1) ? `<button id='addUsr${id_type}'       title='Создание записи'                            class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'><i class='fa fa-plus'></i></button>` : ``;
    let ms = bCFG + bVEW + bPRT + bDEL + bADD;
    let cols = [
        { title: '№', formatter: "rownum", hozAlign: "center", width: 20 },
        //{ title: 'id', field: "id", width: 45 }
    ];

    switch (id_type) {
        case 1:
            cols.push({ title: 'ФИО принятого сотрудника', field: "fio_old", width: 200, editor: ed });
            cols.push({ title: 'таб.№', field: "tabn", width: 45, editor: ed });
            cols.push({ title: 'отдел', field: "d1name", widthGrow: 10 });
            cols.push({ title: 'должность', field: "t1name", widthGrow: 10 });
            cols.push({
                title: "дата принятия", field: "date_start", width: 130,
                editor: ed_date,
                sorter: "date",
                formatter: "datetime", formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD.MM.YYYY",
                }
            });
            break;
        case 2:
            cols.push({ title: 'ФИО отключенного сотрудника', field: "uname", width: 200 });
            //cols.push({ title: 'уч.запись', field: "account", width: 90 });
            cols.push({ title: 'таб.№', field: "tabn", width: 45, formatter: function (cell, formatterParams, onRendered) { return cell.getRow().getData().account.replace(/-/g, '').slice(-4) } });
            cols.push({ title: 'отдел', field: "d1name", widthGrow: 10 });
            cols.push({ title: 'должность', field: "t1name", widthGrow: 10 });
            cols.push({ title: 'причина', field: "rname", widthGrow: 6 });
            cols.push({
                title: "дата исключения", field: "date_start", width: 130,
                editor: ed_date,
                sorter: "date",
                formatter: "datetime", formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD.MM.YYYY",
                }
            });
            cols.push({
                title: "дата включения", field: "date_stop", width: 130,
                editor: ed_date,
                sorter: "date",
                formatter: "datetime", formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD.MM.YYYY",
                }
            });
            break;
        case 3:
            cols.push({ title: 'ФИО переведенного сотрудника', field: "uname", width: 200 });
            //cols.push({ title: 'уч.запись', field: "account", width: 90 });
            cols.push({ title: 'таб.№', field: "tabn", width: 45, formatter: function (cell, formatterParams, onRendered) { return cell.getRow().getData().account.replace(/-/g, '').slice(-4) } });
            cols.push({ title: 'старый отдел', field: "d1name", widthGrow: 10 });
            cols.push({ title: 'новый отдел', field: "d2name", widthGrow: 10 });
            cols.push({ title: 'старая должность', field: "t1name", widthGrow: 10 });
            cols.push({ title: 'новая должность', field: "t2name", widthGrow: 10 });
            cols.push({
                title: "дата перевода", field: "date_start", width: 130,
                editor: ed_date,
                sorter: "date",
                formatter: "datetime", formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD.MM.YYYY",
                }
            });
            break;
        case 4:
            cols.push({ title: 'ФИО изменившего фамилию', field: "fio_old", width: 200 });
            //cols.push({ title: 'уч.запись', field: "account", width: 90 });
            cols.push({ title: 'таб.№', field: "tabn", width: 45, formatter: function (cell, formatterParams, onRendered) { return cell.getRow().getData().account.replace(/-/g, '').slice(-4) } });
            cols.push({ title: 'отдел', field: "d1name", widthGrow: 10 });
            cols.push({ title: 'должность', field: "t1name", widthGrow: 10 });
            cols.push({ title: 'новая фамилия', field: "fio_new", widthGrow: 10, editor: ed });
            cols.push({
                title: "дата изменения", field: "date_start", width: 130,
                editor: ed_date,
                sorter: "date",
                formatter: "datetime", formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD.MM.YYYY",
                }
            });
            break;
    }

    cols.push({
        title: 'дата приказа', field: "pdate", width: 100,
        sorter: "date",
        formatter: "datetime", formatterParams: {
            inputFormat: "YYYY-MM-DD",
            outputFormat: "DD.MM.YYYY",
        }
    });
    cols.push({ title: '№ приказа', field: "pnumb", width: 100 });

    tableD[id_type] = new Tabulator('#' + id_div, {
        ajaxURL: "myphp/loadDataDetail.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { i: id_change, t: id_type },
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Принятые на работу<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        headerSortElement: "",
        headerSort: false,
        columns: cols,
        //selectable: 1,
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,

        dataLoaded: function (data) {
            let id_dd = getFirstID(tableD[id_type]);
            tableD[id_type].selectRow(id_dd)
        },

        cellClick: function (e, cell) {
            let fieldName = cell.getField();
            let row = cell.getRow();

            let id = row.getData().id;
            let id_dd_old = getCurrentID(tableD[id_type]);
            let id_dd_new = row.getData().id;

            if (id_dd_new != id_dd_old) {
                tableD[id_type].deselectRow(id_dd_old);
                tableD[id_type].selectRow(id_dd_new)
            }

            if (ok == '1') return;

            if (fieldName == 'rname') {
                selectVocab('reson', 'name', -1, 'причина блокировки')
                    .then(selected => {
                        runSQL_p(`UPDATE kadri_change_detail SET id_reson = ${selected.id} WHERE id=${id}`);
                        tableD[id_type].updateData([{ id: id, id_reson: selected.id, rname: selected.name, rtype: selected.type }]);
                    });
            }
            if (fieldName == 't1name') {
                selectVocab('user_title', 'name', 1, 'должность')
                    .then(selected => {
                        runSQL_p(`UPDATE kadri_change_detail SET id_title = ${selected.id} WHERE id=${id}`);
                        tableD[id_type].updateData([{ id: id, id_title: selected.id, t1name: selected.name }]);
                    });
            }
            if (fieldName == 't2name') {
                selectVocab('user_title', 'name', 1, 'должность')
                    .then(selected => {
                        runSQL_p(`UPDATE kadri_change_detail SET id_title_new = ${selected.id} WHERE id=${id}`);
                        tableD[id_type].updateData([{ id: id, id_title_new: selected.id, t2name: selected.name }]);
                    });
            }
            if (fieldName == 'd1name') {
                selectVocab('depart', 'name', 1, 'отдел')
                    .then(selected => {
                        runSQL_p(`UPDATE kadri_change_detail SET id_depart = ${selected.id} WHERE id=${id}`);
                        tableD[id_type].updateData([{ id: id, id_depart: selected.id, d1name: selected.name }]);
                    });
            }
            if (fieldName == 'd2name') {
                selectVocab('depart', 'name', 1, 'отдел')
                    .then(selected => {
                        runSQL_p(`UPDATE kadri_change_detail SET id_depart_new = ${selected.id} WHERE id=${id}`);
                        tableD[id_type].updateData([{ id: id, id_depart_new: selected.id, d2name: selected.name }]);
                    });
            }
            if (fieldName == 'pdate' || fieldName == 'pnumb') {
                selectVocab('kadri_prikaz', 'date DESC', -1, 'приказ')
                    .then(selected => {
                        runSQL_p(`UPDATE kadri_change_detail SET id_prikaz = ${selected.id} WHERE id=${id}`);
                        tableD[id_type].updateData([{ id: id, id_prikaz: selected.id, pdate: selected.date, pnumb: selected.numb }]);
                    });
            }
        },

        cellEdited: function (cell) {
            let row = cell.getRow().getData();
            let sql = `UPDATE kadri_change_detail 
                       SET fio_old    = "${row.fio_old}", 
                           fio_new    = "${row.fio_new}",
                           tabn       = "${row.tabn}",
                           date_start = "${row.date_start}",
                           date_stop  = "${row.date_stop}"
                        WHERE id=${row.id}`;
            runSQL(sql);
        },
        footerElement: ms,
    });

    document.getElementById('addUsr' + + id_type.toString()).disabled = (ok == '1');
    document.getElementById('delUsr' + + id_type.toString()).disabled = (ok == '1');
    document.getElementById('delSZ').disabled = (ok == '1');

    // кнопка добавление пользователя в кадровые изменеия -------------------------------
    $("#addUsr" + id_type.toString()).click(function () {
        let id_sz = getCurrentID(tableSZ);
        if (id_type == 1) {
            runSQL_p(`INSERT INTO kadri_change_detail (id_change, id_type, tabn) VALUES (${id_sz}, ${id_type}, '')`)    //*
                .then((id) => {
                    tableD[id_type].addData([{
                        id: id,
                        id_change: id_sz,
                        id_type: id_type,
                        tabn: '',
                    }], true);
                    tableD[id_type].scrollToRow(id, "top", false);
                    tableD[id_type].deselectRow();
                    tableD[id_type].selectRow(id);

                });

        } else {
            selectUser('6100', '')
                .then(selectedUsers => {
                    selectedUsers.forEach(user => {
                        let d1name = '';
                        runSQL_p(`SELECT * FROM depart WHERE id=${user.id_depart}`)
                            .then((r) => {
                                // console.log('r = ', r)
                                console.log('r.length = ', r.length)
                                d1name = (JSON.parse(r).length == 0) ? ' ' : JSON.parse(r)[0].name
                                let sql = `INSERT INTO kadri_change_detail (id_change, id_user, id_type, id_depart, id_title, fio_old) 
                                   VALUES (${id_sz}, ${user.id}, ${id_type}, ${user.id_depart}, ${user.id_title}, "${user.name}")`
                                runSQL_p(sql)
                                    .then((id) => {
                                        tableD[id_type].addData([{
                                            id: id,
                                            id_type: id_type,
                                            id_user: user.id,
                                            id_depart: user.id_depart,
                                            id_title: user.id_title,
                                            d1name: d1name,
                                            t1name: user.title,
                                            d2name: '',
                                            t2name: '',
                                            date_start: '0000-00-00',
                                            date_stop: '0000-00-00',
                                            pdate: '0000-00-00',
                                            pnumb: '',
                                            rtype: 0,
                                            rname: '',
                                            uname: user.name,
                                            account: user.Account,
                                            fio_old: user.name,
                                            id_change: id_sz,
                                        }], true);
                                        tableD[id_type].scrollToRow(id, "top", false);
                                    });
                            });
                    });

                });
        }
    });

    // кнопка настройки служебки из ОИБ в ИТ --------------------------------------------
    $("#cfgUsr").click(function () {
        configKadri(1);
    });

    // кнопка распечатки служебки из ОИБ в ИТ -------------------------------------------
    $("#vewUsr" + id_type.toString()).click(function () {
        sz_oib_it(id_type, 'view');
    });

    // кнопка распечатки служебки из ОИБ в ИТ -------------------------------------------
    $("#prtUsr" + id_type.toString()).click(function () {
        sz_oib_it(id_type, 'print');
    });

    // кнопка удаления пользователя из кадровых изменений -------------------------------
    $("#delUsr" + id_type.toString()).click(function () {
        let row_data = tableD[id_type].getSelectedData()[0];
        let fio = (id_type == 1 || id_type == 4) ? row_data.fio_old : row_data.uname;
        dialogYESNO(`Пользователь:<br>id=${row_data.id}<br>«${fio}»<br>будет удален из кадровых изменений</b><br>вы уверены?<br>`)
            .then(ans => {
                if (ans == "YES") {
                    runSQL_p(`DELETE FROM kadri_change_detail WHERE id=${row_data.id}`)
                        .then((res) => {
                            tableD[id_type].replaceData("myphp/loadDataDetail.php");
                        });
                }
            });
    });


    //document.getElementById(id_div).style.display = 'inline-block';
}

//=======================================================================================
// создание PDF-файла служебной записки из ОК в ОИБ
//=======================================================================================
function sz_ok_oib(id_sz, mode) {
    runSQL_p('SELECT * FROM doc_user WHERE on_off=1 AND id_doc_type=2 ORDER BY position')
        .then((r) => {
            let users = JSON.parse(r);
            let row_data = tableSZ.getSelectedData()[0];
            let sz_date = moment(row_data.date).format('DD-MM-YYYY');
            let sz_numb = row_data.numb;
            let sz_start = moment(row_data.dt_start).format('DD-MM-YYYY');
            let sz_stop = moment(row_data.dt_stop).format('DD-MM-YYYY');
            let pdf_name1 = `кадровые изменения с ${sz_start} по ${sz_stop} (Служебка).pdf`;

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
                pageSize: 'A4',
                pageOrientation: 'portrait',
                pageMargins: [80, 40, 40, 40],

                defaultStyle: {
                    font: 'times',
                    fontSize: 13,
                },

                styles: {
                    header1: { font: 'times', fontSize: 12, alignment: 'right', },
                    header0: { font: 'times', fontSize: 13, alignment: 'right', },
                    header: { font: 'times', fontSize: 13, alignment: 'center', },
                    header6: { font: 'times', fontSize: 12, alignment: 'left', },
                    body0: { font: 'times', fontSize: 13, alignment: 'left', margin: [40, 0, 0, 0], },
                    body: { font: 'times', fontSize: 13, alignment: 'left', },
                    subject: { font: 'times', fontSize: 13, decoration: 'underline', alignment: 'left', },
                    footer6: { font: 'times', fontSize: 8, alignment: 'left', italics: true, margin: [20, 0, 0, 0] },
                },
                footer: {
                    columns: [
                        { text: g_user.name + '\n' + g_user.tel, style: ['footer6'] },
                    ]
                },

            };

            let content = [
                { text: users[0].title_1.replace(/\\n/g, '\n') + '\n\n', style: ['header1'] },
                { text: users[1].title_1.replace(/\\n/g, '\n') + '\n\n', style: ['header1'] },
                { text: users[2].title_1.replace(/\\n/g, '\n') + '\n\n\n\n', style: ['header1'] },
                { text: `${sz_date} № ${sz_numb}@` + '\n\n', style: ['subject'] },
                { text: `Служебная записка` + '\n\n', style: ['header'] },
                { text: `Отдел кадров сообщает о кадровых изменениях аппарата Управления`, style: ['body0'] },
                { text: `за период с ${sz_start} по ${sz_stop} г.` + '\n\n', style: ['body'] },
                { text: `Приложение на  1  л.` + '\n\n', style: ['body0'] },
                { text: '\n\n' + users[3].title_1.replace(/\\n/g, '\n').replace(/\\t/g, '\t'), style: ['header6'] },
            ];

            let doc = Object.assign(doc_head, { content: content });

            if (mode == 'view') {
                pdfMake.createPdf(doc).open();
            } else {
                pdfMake.createPdf(doc).download(pdf_name1);
            }
        });
}

//=======================================================================================
// создание PDF-файла приложения к служебной записки из ОК в ОИБ
//=======================================================================================
function sz_ok_oib_append(id_sz, mode) {
    let row_data = tableSZ.getSelectedData()[0];
    let sz_date = moment(row_data.date).format('DD-MM-YYYY');
    let sz_numb = row_data.numb;
    let sz_start = moment(row_data.dt_start).format('DD-MM-YYYY');
    let sz_stop = moment(row_data.dt_stop).format('DD-MM-YYYY');
    let pdf_name2 = `кадровые изменения с ${sz_start} по ${sz_stop} (Приложение).pdf`;

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
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [10, 5, 5, 5],

        defaultStyle: {
            font: 'times',
            fontSize: 8,
        },

        styles: {
            header0: {
                font: 'times',
                fontSize: 9,
                italics: true,
                alignment: 'right',
            },
            header: {
                font: 'times',
                fontSize: 10,
                bold: true,
                alignment: 'center',
            },
            table: {
                margin: [0, 0, 0, 0]
            },
            tableHeader: {
                bold: true,
                fontSize: 8,
                alignment: 'center',
            }
        },
    };

    let content0 = [
        { text: 'Приложение к служебной записке отдела кадров', style: ['header0'] },
        { text: 'УФНС России по Ростовской области', style: ['header0'] },
        { text: `от ${sz_date} № ${sz_numb}`, style: ['header0'] },
        { text: `Кадровые изменения за период с ${sz_start} по ${sz_stop}`, style: ['header'] },
    ];
    let content1 = create2pdf();
    let content2 = delete2pdf(0);
    let content3 = delete2pdf(1);
    let content4 = delete2pdf(2);
    let content5 = moving2pdf();
    let content6 = rename2pdf();

    let content = content0.concat(content1).concat(content2).concat(content3).concat(content4).concat(content5).concat(content6);

    let doc = Object.assign(doc_head, { content: content });

    pdfMake.tableLayouts = {
        szLayout: {
            hLineWidth: function (i, node) {
                return 0.5;
                if (i === 0 || i === node.table.body.length) {
                    return 0;
                }
                return (i === node.table.headerRows) ? 2 : 1;
            },
            vLineWidth: function (i) {
                return 0.5;
                return 0;
            },
            hLineColor: function (i) {
                return 'black';
                return i === 1 ? 'black' : '#aaa';
            },
            paddingLeft: function (i) {
                return 3;
                return i === 0 ? 0 : 8;
            },
            paddingRight: function (i, node) {
                return 3;
                return (i === node.table.widths.length - 1) ? 0 : 8;
            }
        }
    };

    if (mode == 'view') {
        pdfMake.createPdf(doc).open();
    } else {
        pdfMake.createPdf(doc).download(pdf_name2);
    }
}

function create2pdf() {
    if (tableD[1].getData().length == 0) return [];

    let table_head = [
        { text: 'Сведения о принятых сотрудниках', style: ['header'] },
        {
            style: 'table',
            table: {
                widths: [w_fio, w_tabn, w_name, w_name, w_date, w_date, w_numb],
                headerRows: 2,
                // keepWithHeaderRows: 1,
                body: [
                    [
                        { text: 'ФИО', style: 'tableHeader', rowSpan: 2 },
                        { text: 'таб.№', style: 'tableHeader', rowSpan: 2 },
                        { text: 'наименование подразделения', style: 'tableHeader', rowSpan: 2 },
                        { text: 'должность', style: 'tableHeader', rowSpan: 2 },
                        { text: 'дата назначения', style: 'tableHeader', rowSpan: 2 },
                        { text: 'приказ о назначении', style: 'tableHeader', colSpan: 2 },
                        {},
                    ],
                    [
                        {}, {}, {}, {}, {},
                        { text: 'дата приказа', style: 'tableHeader' },
                        { text: '№ приказа', style: 'tableHeader' },
                    ],
                ]
            },
            layout: 'szLayout'
        },
    ];

    let datas = tableD[1].getData();
    let table_content = [];
    let i = 0;

    datas.forEach((d) => {
        let v_date_start = date2date(d.date_start);
        let v_date_stop = date2date(d.date_stop);
        let v_pdate = date2date(d.pdate);
        table_content[i] = [d.fio_old, d.tabn, d.d1name, d.t1name, v_date_start, v_pdate, d.pnumb];
        i += 1;
    });

    table_head[1].table.body = table_head[1].table.body.concat(table_content);

    return table_head;
}

function delete2pdf(type) {
    let datas = tableD[2].searchData("rtype", "=", type);
    if (datas.length == 0) return [];
    let table_head = [];

    switch (type) {
        case 0:
            table_head = [
                { text: '\nСведения об уволенных сотрудниках', style: ['header'] },
                {
                    style: 'table',
                    table: {
                        widths: [w_fio, w_tabn, w_name * 0.65, w_name * 0.65, w_name * 0.65, w_date, w_date, w_date, w_numb], headerRows: 2,
                        body: [
                            [
                                { text: 'Фамилия имя отчество', style: 'tableHeader', rowSpan: 2 },
                                { text: 'таб.№', style: 'tableHeader', rowSpan: 2 },
                                { text: 'наименование подразделения', style: 'tableHeader', rowSpan: 2 },
                                { text: 'должность', style: 'tableHeader', rowSpan: 2 },
                                { text: 'причина', style: 'tableHeader', rowSpan: 2 },
                                { text: 'дата увольнения', style: 'tableHeader', rowSpan: 2 },
                                { text: 'приказ об увольнении', style: 'tableHeader', colSpan: 2 },
                                {},
                            ],
                            [
                                {}, {}, {}, {}, {}, {},
                                { text: 'дата приказа', style: 'tableHeader' },
                                { text: '№ приказа', style: 'tableHeader' },
                            ],
                        ]
                    },
                    layout: 'szLayout'
                },
            ];
            break;
        case 1:
            table_head = [
                { text: '\nСведения о сотрудниках, которым предоставлен отпуск по беременности и родам', style: ['header'] },
                {
                    style: 'table',
                    table: {
                        widths: [w_fio, w_tabn, w_name * 0.83, w_name * 0.83, w_date, w_date, w_date, w_numb], headerRows: 2,
                        body: [
                            [
                                { text: 'Фамилия имя отчество', style: 'tableHeader', rowSpan: 2 },
                                { text: 'таб.№', style: 'tableHeader', rowSpan: 2 },
                                { text: 'наименование подразделения', style: 'tableHeader', rowSpan: 2 },
                                { text: 'должность', style: 'tableHeader', rowSpan: 2 },
                                { text: 'предоставлен отпуск', style: 'tableHeader', colSpan: 2 },
                                {},
                                { text: 'приказ о предоставлении отпуска', style: 'tableHeader', colSpan: 2 },
                                {},
                            ],
                            [
                                {}, {}, {}, {},
                                { text: 'с', style: 'tableHeader' },
                                { text: 'по', style: 'tableHeader' },
                                { text: 'дата приказа', style: 'tableHeader' },
                                { text: '№ приказа', style: 'tableHeader' },
                            ],
                        ]
                    },
                    layout: 'szLayout'
                },
            ];
            break;
        case 2:
            table_head = [
                { text: '\nСведения о сотрудниках, которым предоставлен дополнительный отпуск по уходу за ребенком', style: ['header'] },
                {
                    style: 'table',
                    table: {
                        widths: [w_fio, w_tabn, w_name * 0.83, w_name * 0.83, w_date, w_date, w_date, w_numb], headerRows: 2,
                        body: [
                            [
                                { text: 'Фамилия имя отчество', style: 'tableHeader', rowSpan: 2 },
                                { text: 'таб.№', style: 'tableHeader', rowSpan: 2 },
                                { text: 'наименование подразделения', style: 'tableHeader', rowSpan: 2 },
                                { text: 'должность', style: 'tableHeader', rowSpan: 2 },
                                { text: 'предоставлен отпуск', style: 'tableHeader', colSpan: 2 },
                                {},
                                { text: 'приказ о предоставлении отпуска', style: 'tableHeader', colSpan: 2 },
                                {},
                            ],
                            [
                                {}, {}, {}, {},
                                { text: 'с', style: 'tableHeader' },
                                { text: 'по', style: 'tableHeader' },
                                { text: 'дата приказа', style: 'tableHeader' },
                                { text: '№ приказа', style: 'tableHeader' },
                            ],
                        ]
                    },
                    layout: 'szLayout'
                },
            ];
            break;

    }

    let table_content = [];
    let i = 0;

    datas.forEach((d) => {
        let v_date_start = date2date(d.date_start);
        let v_date_stop = date2date(d.date_stop);
        let v_pdate = date2date(d.pdate);
        switch (type) {
            case 0:
                table_content[i] = [d.uname, acc2tab(d.account), d.d1name, d.t1name, d.rname, v_date_start, v_pdate, d.pnumb];
                break;
            case 1:
                table_content[i] = [d.uname, acc2tab(d.account), d.d1name, d.t1name, v_date_start, v_date_stop, v_pdate, d.pnumb];
                break;
            case 2:
                table_content[i] = [d.uname, acc2tab(d.account), d.d1name, d.t1name, v_date_start, v_date_stop, v_pdate, d.pnumb];
                break;
        }
        i += 1;
    });

    table_head[1].table.body = table_head[1].table.body.concat(table_content);

    return table_head;
}

function moving2pdf(doc, n_str) {
    if (tableD[3].getData().length == 0) return [];

    let table_head = [
        { text: '\nСведения о переведенных сотрудниках', style: ['header'] },
        {
            style: 'table',
            table: {
                widths: [w_fio, w_tabn, w_name * 0.48, w_name * 0.48, w_name * 0.48, w_name * 0.48, w_date, w_date, w_numb],
                headerRows: 2,
                // keepWithHeaderRows: 1,
                body: [
                    [
                        { text: 'ФИО', style: 'tableHeader', rowSpan: 2 },
                        { text: 'таб.№', style: 'tableHeader', rowSpan: 2 },
                        { text: 'старое подразделение', style: 'tableHeader', rowSpan: 2 },
                        { text: 'старая должность', style: 'tableHeader', rowSpan: 2 },
                        { text: 'новое подразделение', style: 'tableHeader', rowSpan: 2 },
                        { text: 'новая должность', style: 'tableHeader', rowSpan: 2 },
                        { text: 'дата перевода', style: 'tableHeader', rowSpan: 2 },
                        { text: 'приказ о переводе', style: 'tableHeader', colSpan: 2 },
                        {},
                    ],
                    [
                        {}, {}, {}, {}, {}, {}, {},
                        { text: 'дата приказа', style: 'tableHeader' },
                        { text: '№ приказа', style: 'tableHeader' },
                    ],
                ]
            },
            layout: 'szLayout'
        },
    ];

    let datas = tableD[3].getData();
    let table_content = [];
    let i = 0;

    datas.forEach((d) => {
        let v_date_start = date2date(d.date_start);
        let v_date_stop = date2date(d.date_stop);
        let v_pdate = date2date(d.pdate);
        table_content[i] = [d.uname, acc2tab(d.account), d.d1name, d.t1name, d.d2name, d.t2name, v_date_start, v_pdate, d.pnumb];
        i += 1;
    });

    table_head[1].table.body = table_head[1].table.body.concat(table_content);

    return table_head;

}

function rename2pdf(doc, n_str) {
    if (tableD[4].getData().length == 0) return [];

    let table_head = [
        { text: '\nСведения об изменении фамилии', style: ['header'] },
        {
            style: 'table',
            table: {
                widths: [w_fio, w_tabn, w_name * 0.48, w_name * 0.48, w_name, w_date, w_date, w_numb],

                headerRows: 2,
                // keepWithHeaderRows: 1,
                body: [
                    [
                        { text: 'ФИО', style: 'tableHeader', rowSpan: 2 },
                        { text: 'таб.№', style: 'tableHeader', rowSpan: 2 },
                        { text: 'наименование подразделения', style: 'tableHeader', rowSpan: 2 },
                        { text: 'должность', style: 'tableHeader', rowSpan: 2 },
                        { text: 'новая фамилия', style: 'tableHeader', rowSpan: 2 },
                        { text: 'дата смены', style: 'tableHeader', rowSpan: 2 },
                        { text: 'приказ о смене фамилии', style: 'tableHeader', colSpan: 2 },
                        {},
                    ],
                    [
                        {}, {}, {}, {}, {}, {},
                        { text: 'дата приказа', style: 'tableHeader' },
                        { text: '№ приказа', style: 'tableHeader' },
                    ],
                ]
            },
            layout: 'szLayout'
        },
    ];

    let datas = tableD[4].getData();
    let table_content = [];
    let i = 0;

    datas.forEach((d) => {
        let v_date_start = date2date(d.date_start);
        let v_date_stop = date2date(d.date_stop);
        let v_pdate = date2date(d.pdate);
        table_content[i] = [d.uname, acc2tab(d.account), d.d1name, d.t1name, d.fio_new, v_date_start, v_pdate, d.pnumb];
        i += 1;
    });

    table_head[1].table.body = table_head[1].table.body.concat(table_content);

    return table_head;

}

//=======================================================================================
// создание PDF-файла служебной записики ИБ -> ИТ
//=======================================================================================
function sz_oib_it(id_type, mode) {
    runSQL_p('SELECT * FROM doc_user WHERE on_off=1 AND id_doc_type=1 ORDER BY position')
        .then((r) => {
            let users = JSON.parse(r);
            let pdf_file_name = '';
            pdfMake.fonts = {
                times: {
                    normal: 'times.ttf',
                    bold: 'timesbd.ttf',
                    italics: 'timesi.ttf',
                    bolditalics: 'timesbi.ttf'
                }
            };

            let doc_head = {
                pageSize: 'A4',
                pageOrientation: 'portrait',
                pageMargins: [30, 30, 30, 30],
                defaultStyle: { font: 'times', fontSize: 9, },
                styles: {
                    header1: { font: 'times', fontSize: 12, alignment: 'right', },
                    header2: { font: 'times', fontSize: 12, alignment: 'center', bold: true, },
                    header3: { font: 'times', fontSize: 12, alignment: 'justify', margin: [20, 0, 0, 0] },
                    header4: { font: 'times', fontSize: 12, alignment: 'justify', margin: [0, 0, 0, 0] },
                    header5: { font: 'times', fontSize: 12, alignment: 'center', margin: [10, 0, 10, 0] },
                    header6: { font: 'times', fontSize: 12, alignment: 'left', },
                    header7: { font: 'times', fontSize: 12, alignment: 'left', margin: [300, 0, 10, 0] },
                    footer6: { font: 'times', fontSize: 8, alignment: 'left', italics: true, margin: [20, 0, 0, 0] },
                    table: { margin: [0, 0, 0, 0] },
                    tableHeader: { bold: true, fontSize: 8, alignment: 'center', }
                },
                footer: {
                    columns: [
                        { text: g_user.name + '\n' + g_user.tel, style: ['footer6'] },
                    ]
                },
            };

            let row_data = tableSZ.getSelectedData()[0];
            let sz_date = date2date(row_data.date);
            let sz_numb = row_data.numb;
            let datas = tableD[id_type].getData();
            let table = [];
            let table_content = [];
            let i = 0;

            content0 = [
                { text: users[0].title_1.replace(/\\n/g, '\n') + '\n\n\n', style: ['header1'] },
                { text: 'СЛУЖЕБНАЯ ЗАПИСКА\n\n', style: ['header2'] },
            ];

            switch (id_type) {
                case 1:
                    return;
                    break;
                case 2:
                    pdf_file_name = 'СЗ на блокировку.pdf'
                    content0.push({ text: 'Прошу заблокировать право доступа пользователей к ЛВС Управления, соответствующим группам', style: ['header3'] });
                    content0.push({ text: 'пользователей, информационным, программным и аппаратным ресурсам следующим сотрудникам:\n\n', style: ['header4'] });
                    table = [{
                        style: 'table',
                        table: {
                            widths: [w_fio / 2, w_tabn, w_name * 0.50, w_fio * 0.45, w_date * 0.8, w_date * 0.8, w_date * 0.7, w_numb], headerRows: 1,
                            body: [[{ text: 'ФИО', style: 'tableHeader' },
                            { text: 'таб.№', style: 'tableHeader' },
                            { text: 'должность (отдел)', style: 'tableHeader' },
                            { text: 'основание', style: 'tableHeader' },
                            { text: 'дата отключения', style: 'tableHeader' },
                            { text: 'дата включения', style: 'tableHeader' },
                            { text: 'дата и № приказа', style: 'tableHeader' },
                            { text: 'служебная записка отдела кадров', style: 'tableHeader' },
                            ]]
                        }
                    }];
                    datas.forEach((d) => {
                        let v_date_start = date2date(d.date_start);
                        let v_date_stop = date2date(d.date_stop);
                        let v_pdate = date2date(d.pdate);
                        let v_prikaz = v_pdate + ' ' + ((!d.pnumb) ? '' : d.pnumb);
                        table_content[i] = [d.uname, acc2tab(d.account), d.t1name + ' (' + d.d1name + ')', d.rname, v_date_start, v_date_stop, v_prikaz, sz_date + ' ' + sz_numb];
                        i += 1;
                    });
                    break;
                case 3:
                    pdf_file_name = 'СЗ на изменение.pdf'
                    content0.push({ text: 'Прошу изменить установочные данные следующим сотрудникам:\n\n', style: ['header5'] });
                    table = [{
                        style: 'table',
                        table: {
                            widths: [w_fio * 0.6, w_tabn, w_name / 2, w_name / 2, w_date - 10, w_date - 5, w_numb - 5], headerRows: 1,
                            body: [[{ text: 'ФИО', style: 'tableHeader' },
                            { text: 'таб.№', style: 'tableHeader' },
                            { text: 'прежняя должность (отдел)', style: 'tableHeader' },
                            { text: 'новая должность (отдел)', style: 'tableHeader' },
                            { text: 'дата перевода', style: 'tableHeader' },
                            { text: 'дата и № приказа', style: 'tableHeader' },
                            { text: 'служебная записка отдела кадров', style: 'tableHeader' },
                            ]]
                        }
                    }];

                    datas.forEach((d) => {
                        let v_date_start = date2date(d.date_start);
                        let v_date_stop = date2date(d.date_stop);
                        let v_pdate = date2date(d.pdate);
                        let v_prikaz = v_pdate + ' ' + ((!d.pnumb) ? '' : d.pnumb);

                        table_content[i] = [d.uname, acc2tab(d.account), d.t1name + ' (' + d.d1name + ')', d.t2name + ' (' + d.d2name + ')', v_date_start, v_prikaz, sz_date + ' ' + sz_numb];
                        i += 1;
                    });
                    break;
                case 4:
                    pdf_file_name = 'СЗ на изменение ФИО.pdf'
                    content0.push({ text: 'Прошу изменить установочные следующим сотрудникам:\n\n', style: ['header5'] });
                    table = [{
                        style: 'table',
                        table: {
                            widths: [w_fio * 0.8, w_tabn, w_name * 0.5, w_fio * 0.35, w_date, w_date, w_numb], headerRows: 1,
                            body: [[{ text: 'ФИО', style: 'tableHeader' },
                            { text: 'таб.№', style: 'tableHeader' },
                            { text: 'должность (отдел)', style: 'tableHeader' },
                            { text: 'новая фамилия', style: 'tableHeader' },
                            { text: 'дата изменения', style: 'tableHeader' },
                            { text: 'дата и № приказа', style: 'tableHeader' },
                            { text: 'служебная записка отдела кадров', style: 'tableHeader' },
                            ]]
                        }
                    }];
                    datas.forEach((d) => {
                        let v_date_start = date2date(d.date_start);
                        let v_date_stop = date2date(d.date_stop);
                        let v_pdate = date2date(d.pdate);
                        let v_prikaz = v_pdate + ' ' + ((!d.pnumb) ? '' : d.pnumb);
                        table_content[i] = [d.uname, acc2tab(d.account), d.t1name + ' (' + d.d1name + ')', d.fio_new, v_date_start, v_prikaz, sz_date + ' ' + sz_numb];
                        i += 1;
                    });
                    break;
            }

            let content1 = [
                { text: '\n\n' + users[1].title_1.replace(/\\n/g, '\n').replace(/\\t/g, '\t'), style: ['header6'], pageBreak: 'after' },
            ];



            table[0].table.body = table[0].table.body.concat(table_content);

            let content = content0.concat(table).concat(content1);


            users.forEach((u) => {
                if (u.position > 2) {
                    content = content.concat({ text: u.title_1 + '\n' + u.title_2 + '\n\n', style: ['header7'] });
                }
            });


            let doc = Object.assign(doc_head, { content: content });

            if (mode == 'view') {
                pdfMake.createPdf(doc).open();
            } else {
                pdfMake.createPdf(doc).download(pdf_file_name);
            }
        });
}


//=======================================================================================
//  табулятор настройки кадровых изменений               
//=======================================================================================
function configKadri(id_doc_type) {

    let div_modal = document.createElement('div');

    div_modal.className = "modal";
    div_modal.innerHTML = `<div id="modalWindow"class="modal-content" style="width:50%;height:70%">
                                <div id="modalHeader" class="modal-header w3-teal" style="padding:1px 16px">
                                    <p>Нстройка полей служебной записки о кадровых изменениях</p>
                                </div>
                                <div id="modalBody"   class="modal-body"  style="padding:0px 0px"></div>     
                                <div id="modalFooter" class="modal-footer w3-teal"></div>
                           </div>`;

    document.body.append(div_modal);

    document.onkeyup = function (e) {
        if (e.key == 'Escape') {
            div_modal.style.display = "none";
            div_modal.remove();
            document.onkeyup = function (e) { };
            console.log("ESC");
        }
    };

    // активация модального окна --------------------------------------------------------
    div_modal.style.display = "block";
    let appHeight = $(".modal-content").height() - $(".modal-header").height();


    let msgFooter = '';

    tableCfgKadri = new Tabulator("#modalBody", {
        ajaxURL: "myphp/loadDataCfgKadri.php",
        ajaxParams: { d: id_doc_type },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appHeight,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        headerSort: false,
        selectable: 1,
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,
        columns: [
            { title: "поле 1", field: "title_1", editor: "textarea", widthGrow: 3, formatter: "textarea", },
            { title: "поле 2", field: "title_2", editor: "input", widthGrow: 1, },
            { title: "вкл", field: "on_off", editor: "input", width: 50, },
            { title: "примечание", field: "comment", editor: "input", widthGrow: 1, },
        ],
        footerElement: msgFooter,
        cellEdited: function (cell) {
            let o = cell.getRow().getData();
            runSQL_p(`UPDATE doc_user SET title_1="${o.title_1}", title_2="${o.title_2}", comment="${o.comment}", on_off=${o.on_off} WHERE id=${o.id}`);
        },
    });

}
