let id_select = 0

//=======================================================================================
// модальное окно словаяря            ===================================================
//=======================================================================================
function selectVocab(
    table,
    sort,
    ok,
    title,
    allow = '',
    width = '600px',
    marginLeft = '50%',
    marginTop = '5%',
    win_return = '',
    sono = ''
) {
    return new Promise(function (resolve, reject) {
        let formVocab = `<div id="selectVocab" class="w3-container"></div>`

        newModalWindow(
            "selectVocab",
            title,
            formVocab,
            "",
            width,
            marginLeft,
            marginTop,
            win_return
        )

        appHeight = appBodyHeight() * 0.7

        createTabulatorSelectVocab(
            "#selectVocabBody",
            table,
            sort,
            ok,
            appHeight,
            allow,
            resolve,
            reject,
            sono
        )
        id2e("selectVocab").focus()
    })
}

//=======================================================================================
// табулятор справочника
// id_div - блок DIV, в которм показывать табулятор
// sort   - сортировка в SQL-операторе, напирмер: "name DESC"
// ok     - фильтр по полю OK, если ok= -1, показывать все записи
// appH   - высота блока DIV
//=======================================================================================

function createTabulatorSelectVocab(
    id_div,
    table,
    sort,
    ok,
    appH,
    allow,
    resolve,
    reject,
    sono = ''
) {
    let div_modal = id2e("selectVocab")
    allow = getAllows()
    console.log('allow = ', allow)

    let ed = allow.A == 1 ? "input" : ""
    let ed_date = allow.A == 1 ? date_Editor : ""

    let bSel = allow.E == 1
        ? `<button id='bSel' class='w3-button w3-white w3-border w3-hover-teal'>Выбрать</button>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp`
        : ``

    let bDel = allow.A == 1
        ? `<button id='bDel' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>`
        : ``

    let bAdd = allow.A == 1
        ? `<button id='bAdd' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>`
        : ``

    let msgFooter = bSel + bDel + bAdd

    let cols = [
        //{ title: "id", field: "id",   widthGrow: 1,  headerFilter: true, },
        {
            title: "",
            field: "name",
            editor: ed,
            widthGrow: 10,
            headerFilter: true,
            topCalc: "count",
        },
    ]   

    if (table == 'depart') {
        cols = [
            {
                title: '№',
                field: 'id_otdel',
                editor: ed,
                width: 50,
                headerFilter: true,
                topCalc: "count",
            },
            {
                title: "",
                field: "name",
                editor: ed,
                widthGrow: 10,
                headerFilter: true,
                topCalc: "count",
            },
        ]
    }

    if (table == "kadri_prikaz") {
        cols = [
            //{ title: "id", field: "id",   widthGrow: 1,  headerFilter: true, },
            {
                title: "дата",
                field: "date",
                widthGrow: 1,
                headerFilter: true,
                editor: ed_date,
                sorter: "date",
                formatter: "datetime",
                formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD.MM.YYYY",
                },
            },
            {
                title: "номер",
                field: "numb",
                editor: ed,
                widthGrow: 1,
                headerFilter: true,
                topCalc: "count",
            },
        ]
    }

    tableVocab = new Tabulator(id_div, {
        ajaxURL: "myphp/get_all_vocab.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { t: table, s: sort, o: ok, n: sono },
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
            let id = getFirstID(tableVocab)
            tableVocab.selectRow(id)
        },

        cellClick: function (e, cell) {
            let row = cell.getRow()
            let id_dd_old = getCurrentID(tableVocab)
            let id_dd_new = row.getData().id

            if (id_dd_new != id_dd_old) {
                tableVocab.deselectRow(id_dd_old)
                tableVocab.selectRow(id_dd_new)
            }
        },

        cellEdited: function (cell) {
            let o = cell.getRow().getData()
            if (table == "kadri_prikaz") {
                runSQL(
                    `UPDATE ${table} SET date="${o.date}", numb="${o.numb}" WHERE id=${o.id}`
                )
            } else {
                runSQL(`UPDATE ${table} SET name="${o.name}" WHERE id=${o.id}`)
            }
        },
        cellDblClick: function (e, cell) {
            let id = getCurrentID(tableVocab)
            div_modal.style.display = "none"
            div_modal.remove()
            let r = tableVocab.searchRows("id", "=", id)[0].getData()
            resolve(r)
        },
    })

    $("#bSel").click(function () {
        let id = getCurrentID(tableVocab)
        div_modal.style.display = "none"
        div_modal.remove()
        let r = tableVocab.searchRows("id", "=", id)[0].getData()
        resolve(r)
    })

    $("#bAdd").click(async () => {
        const id = await runSQL_p(`INSERT INTO ${table} VALUES ()`)
        //tableVocab.replaceData();
        tableVocab.addData([{ id: id }], true)
        //g_tableVocab.id_current = parseInt(id);
        tableVocab.scrollToRow(id, "top", false)
        tableVocab.deselectRow()
        tableVocab.selectRow(id)
    })

    $("#bDel").click(async () => {
        const r = tableVocab.getSelectedData()[0]
        const ans = await dialogYESNO(`запись:<br>id:${r.id}<br>«${r.name}»</b><br>будет удалена, вы уверены?<br>`)

        if (ans == "YES") {
            runSQL_p(`DELETE FROM ${table} WHERE id=${r.id}`).then((id) => {
                tableVocab.replaceData()
                //.then((rows)=>{
                //    tableVocab.scrollToRow(id, "top", false);
                //    tableVocab.deselectRow();
                //    tableVocab.selectRow(id);
                //});
            })
        }
    })
}