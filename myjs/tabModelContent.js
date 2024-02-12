/////////////////////////////////////////////////////////////////////////////////////////
function tabulator_model_content(
    div,
    id_dionis_model = 0,
    tabHeight,
    win_current = null,
    win_return = null
) {
    const cols = [
        { title: "id", field: "id", width: 60, headerFilter: true },
        { title: "наименование", field: "name", widthGrow: 6, headerFilter: true, editor: "input" },
        { title: "номер", field: "sn", widthGrow: 4, headerFilter: true, editor: "input" },
        { title: "коментарии", field: "comm", widthGrow: 4, headerFilter: true, editor: "input" },
        // { title: "del", field: "del", width: 40, headerFilter: true },
    ]

    // console.log('========================================>')
    // console.log('tabulator_model_content:')
    // console.log('win_current = ', win_current)
    // console.log('win_return = ', win_return)

    const salt = randomStr(10)

    const id_button_mod = 'mod' + salt
    const id_button_add = 'add' + salt
    const id_button_del = 'del' + salt

    const msgFooter =
        `<span id="select-stats"></span>` +
        `<div style="width: 100%; text-align: left;">` +
        `<button id='${id_button_mod}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Изменить</button>` +
        `<button id='${id_button_add}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Добавить</button>` +
        `<button id='${id_button_del}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Удалить</button>` +
        `</div>`

    const tabulator = new Tabulator("#" + div, {
        ajaxURL: "myphp/get_all_dionis_model_content.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { m: id_dionis_model },
        height: tabHeight,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Модели Dionis<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: selectable,
        selectableRangeMode: "click",
        reactiveData: true,
        columns: cols,
        footerElement: msgFooter,

        rowSelectionChanged: function (data, rows) {
            if (data.length == 0) {
                id2e(id_button_mod).disabled = true
                id2e(id_button_del).disabled = true
                id2e(id_button_add).disabled = false
            } else {
                id2e(id_button_mod).disabled = false
                id2e(id_button_del).disabled = false
                id2e(id_button_add).disabled = false
            }
        },

        rowFormatter: function (row) {
            let d = row.getData()
            if (d.del == 1) {
                // row.getCell("del").getElement().style.backgroundColor = '#ff0000'
                row.getElement().style.backgroundColor = '#ff0000'
            } else {
                row.getElement().style.backgroundColor = ''
            }
        }

    })

    id2e(id_button_add).onclick = async () => {
        const d = factory_dionis_model_content(id_dionis_model)
        // d.id = await save_dionis_model_content(d)

        addTabRow(tabulator, d, (top = true))

        // const res = await edit_dionis_model(
        //     d,
        //     (win_return = win_current),
        //     (mode = "new")
        // )
    }

    id2e(id_button_del).onclick = async () => {
        // const ans = await dialogYESNO(
        //     (text = "Удалить элемент комплекта"),
        //     (win_return = win_current)
        // )

        // if (ans == 'YES') {
            const data = tabulator.getSelectedData()
            data.forEach((d) => {
                const del = tab_model_content.getSelectedRows()[0].getData().del
                console.log('del = ', del)
                console.log('del = ', del == 1 ? 0 : 1)
                tab_model_content.getSelectedRows()[0].getData().del = (del == 1 ? 0 : 1)
                // tabulator.redraw()
            })
            // const id_dionis_model = getFirstID(tabulator)
            // tabulator.selectRow(id_dionis_model)
        // }
    }

    // tabulator.redraw()

    return tabulator
}



/////////////////////////////////////////////////////////////////////////////////////////
function remove_selected_dionis_model_content() {
    let id_dionis_model = table_select_dionis_model.getSelectedData()[0].id
    del_dionis_model_content(id_dionis_model)
    table_select_dionis_model.deleteRow(id_dionis_model)
    id_dionis_model = getFirstID(table_select_dionis_model)
    table_select_dionis_model.selectRow(id_dionis_model)
}

/////////////////////////////////////////////////////////////////////////////////////////
async function new_dionis_model_content() {
    const id = await runSQL_p("INSERT INTO dionis_model_content () VALUES ()")
    return id
}

/////////////////////////////////////////////////////////////////////////////////////////
// async function save_dionis_model_content(d) {
//     console.log('d = ', d)
//     const sql =
//         d.id == 0
//             ? `INSERT INTO dionis_model_content (id,model,id_dionis_model,type,comm) VALUES (${d.id}, ${d.id_dionis_model}, '${d.model}', '${d.type}', '${d.comm}')`
//             : `UPDATE dionis_model_content SET id=${d.id}, id_dionis_model=${d.id_dionis_model}, model='${d.model}', type='${d.type}', comm='${d.comm}' WHERE id=${d.id}`

//     return runSQL_p(sql)
// }

/////////////////////////////////////////////////////////////////////////////////////////
function del_dionis_model_content(id) {
    runSQL_p(`DELETE FROM dionis_model_content WHERE id=${id}`)
}

/////////////////////////////////////////////////////////////////////////////////////////
function factory_dionis_model_content(id_dionis_model) {
    return {
        id: 0,
        id_dionis_model: id_dionis_model,
        name: '',
        sn: '',
        comm: ''
    }
}