let table_select_dionis_model = null
//=======================================================================================
// модальное окно выбора ГК
//=======================================================================================
function select_dionis_model(
    selectable = 1,
    mode = 'select',
    win_return = null,
    id_dionis_model = 0
) {
    return new Promise(async function (resolve, reject) {
        // const result = await recalc_mts(0)
        const salt = randomStr(10)
        const win_current = 'selectdionismodel' + salt

        console.log('========================================>')
        console.log('select_dionis_model:')
        console.log('win_current = ', win_current)
        console.log('win_return = ', win_return)


        if (mode == 'select') {
            newModalWindow(
                win_current,     // modal
                'Модели Dionis', // html_header
                '',              // html_body
                '',              // html_footer
                '90%',           // width
                '5%',            // marginLeft
                '3%',            // marginTop
                win_return       // win_return
            )
        }

        const appHeight = appBodyHeight()



        table_select_dionis_model = tabulator_select_dionis_model(
            (mode == 'select') ? win_current + 'Body' : 'appBody', // div
            (mode == 'select') ? appHeight * 0.9 : appHeight, // tabHeight
            resolve,
            reject,
            selectable,
            mode,
            win_current,
            win_return,
            id_dionis_model,
        )

        if (mode == "select") id_2_set_focus(win_current)
    })
}






/////////////////////////////////////////////////////////////////////////////////////////
function tabulator_select_dionis_model(
    div,
    tabHeight,
    resolve,
    reject,
    selectable = 1,
    mode = "select",
    win_current = null,
    win_return = null,
    id_dionis_model = 0,
) {
    console.log('========================================>')
    console.log('tabulator_select_dionis_model:')
    console.log('win_current = ', win_current)
    console.log('win_return = ', win_return)

    const cols = [
        { title: "id", field: "id", widthGrow: 1, headerFilter: true, topCalc: "count" },
        { title: "модель", field: "model", widthGrow: 4, headerFilter: true },
        { title: "тип", field: "type", widthGrow: 2, headerFilter: true, },
        { title: "коментарии", field: "comm", widthGrow: 4, headerFilter: true, },
    ]

    const salt = randomStr(10)

    const id_button_sel = 'sel' + salt
    const id_button_mod = 'mod' + salt
    const id_button_add = 'add' + salt
    const id_button_del = 'del' + salt

    const msgFooter =
        `<span id="select-stats"></span>` +
        `<div style="width: 100%; text-align: left;">` +
        `<button id='${id_button_sel}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Выбрать</button>` +
        `<button id='${id_button_mod}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Изменить</button>` +
        `<button id='${id_button_add}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Добавить</button>` +
        `<button id='${id_button_del}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Удалить</button>` +
        `</div>`

    const tabulator = new Tabulator("#" + div, {
        ajaxURL: "myphp/get_all_dionis_model.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        // ajaxParams: { s: sono, o: id_otdel, k: sklad, t: id_type_oper },
        height: tabHeight,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Модели Dionis<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: 1,
        selectableRangeMode: "click",
        reactiveData: true,
        columns: cols,
        footerElement: msgFooter,

        // renderComplete: function() {
        //     if (mode == "select") id2e(id_checkb_xls).disabled = true
        // },

        dataLoaded: function () {
            if (id_dionis_model == 0) return
            tabulator.selectRow(id_dionis_model)
            tabulator.scrollToRow(id_dionis_model, "center", false)
        },

        rowFormatter: function (row) {
            // let d = row.getData()
            // if (d.sono1 != d.sono2) {
            //     row.getCell("sono2").getElement().style.backgroundColor = '#ffcccc'
            // }
        },

        rowSelectionChanged: function (data, rows) {
            if (data.length == 0) {
                id2e(id_button_mod).disabled = true
                id2e(id_button_del).disabled = true
                id2e(id_button_sel).disabled = true
                id2e(id_button_add).disabled = false
                // id2e(id_button_add).disabled = !isRole("dionismodel") && !isRole("su")
            } else {
                id2e(id_button_mod).disabled = false
                id2e(id_button_del).disabled = false
                id2e(id_button_sel).disabled = false
                id2e(id_button_add).disabled = false
            }
        },

        cellDblClick: async function (e, cell) {
            if ((mode == "select")) {
                removeModalWindow(win_current, win_return)
                resolve(cell.getRow().getData())
            } else {
                const res = await edit_dionis_model(
                    tabulator.getSelectedData()[0], // d
                    win_current                     // win_return
                )
            }
        },

    })

    id2e(id_button_sel).onclick = () => {
        removeModalWindow(win_current, win_return)
        resolve(tabulator.getSelectedData()[0])
    }

    id2e(id_button_add).onclick = async () => {
        const d = factory_dionis_model()
        d.id = await save_dionis_model(d)

        addTabRow(tabulator, d, (top = true))

        const res = await edit_dionis_model(
            d,           // d
            win_current, // win_return
            "new"        // mode
        )
    }

    id2e(id_button_mod).onclick = async () => {
        const res = await edit_dionis_model(
            tabulator.getSelectedData()[0], // d
            win_current,                    // win_return
            "mod"                           // mode
        )
    }

    id2e(id_button_del).onclick = async () => {
        const ans = await dialogYESNO(
            "Удалить модель", // text
            win_current       // win_return
        )

        if (ans == 'YES') {
            const data = tabulator.getSelectedData()
            data.forEach((d) => {
                del_dionis_model(d.id)
                tabulator.deleteRow(d.id)
            })
            const id_dionis_model = getFirstID(tabulator)
            tabulator.selectRow(id_dionis_model)
        }
    }

    // tabulator.redraw()

    return tabulator
}


/////////////////////////////////////////////////////////////////////////////////////////
function edit_dionis_model(d, win_return = null, mode = "") {
    return new Promise(function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'editdionismodel' + salt

        const headerdionismodel = `<h4>Модель Dionis</h4>`

        const bodydionismodel = `
        <div style="margin: 0; padding: 1%;">
            модель:<br>
            <textarea rows="1" style="width:100%" v-model="dv.model"></textarea>
            <br>
            тип:<br>
            <textarea rows="1" style="width:100%" v-model="dv.type"></textarea>
            <br>
            комментарии:<br>
            <textarea rows="3" style="width:100%" v-model="dv.comm"></textarea>
            <br>
            <div id="modelContent" style="width:100%;"></div>
            <br>
            <button id="btnEnterdionismodel"  class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить</button>
            <button id="btnCanceldionismodel" class="w3-btn w3-padding-small o3-border w3-hover-red">отменить</button>
        </div>`

        // <button id="btnPrevdionismodel"   class="w3-btn w3-padding-small o3-border w3-hover-teal">предыдущая модель</button>
        // <button id="btnNextdionismodel"   class="w3-btn w3-padding-small o3-border w3-hover-teal">следующая модель</button>


        const footdionismodel = ``

        const esc_dionis_model = mode == "new"
            ? () => {
                remove_selected_dionis_model()
                vapp.unmount()
            }
            : () => {
                console.log("esc_callback")
                vapp.unmount()
            }

        console.log('========================================>')
        console.log('edit_dionis_model:')
        console.log('win_current = ', win_current)
        console.log('win_return = ', win_return)

        newModalWindow(
            win_current,     // model
            headerdionismodel,
            bodydionismodel,
            footdionismodel,
            "60%",           // width
            "15%",           // marginLeft
            "5%",            // marginTop
            win_return,      // win_return
            esc_dionis_model // esc_callback
        )

        //--- View Model-------------------------------------------------------start
        const vapp = Vue.createApp({
            data() {
                return {
                    dv: d,
                    chg: false,
                }
            },
        })

        const vm = vapp.use(naive).mount('#' + win_current)

        console.log('vm.$data.dv.id = ', vm.$data.dv.id)

        tab_model_content = tabulator_model_content(
            'modelContent',
            vm.$data.dv.id,
            0,
            win_current,
            win_return
        )
        //--- View Model-------------------------------------------------------stop

        // кнопка сохранения и выхода -----------------------------------------------
        id2e("btnEnterdionismodel").onclick = () => {
            const d = vm.$data.dv
            // const id_model = d.id
            // console.log('id = ', id_model)

            const dc = tab_model_content.getData()
            vapp.unmount()

            save_dionis_model(d)
            save_dionis_model_content(d.id, dc)

            removeModalWindow(win_current, win_return)
            table_select_dionis_model.updateRow(d.id, d)
            table_select_dionis_model.redraw()
            resolve("OK")
        }
        // кнопка отмены изменений --------------------------------------------------
        id2e("btnCanceldionismodel").onclick = () => {
            vapp.unmount()
            if (mode == "new") remove_selected_dionis_model()
            removeModalWindow(win_current, win_return)
            resolve("CANCEL")
        }

        // кнопка перехода на предыдущее dionismodel ----------------------------------------
        // id2e("btnPrevdionismodel").onclick = () => {
        //     const d = vm.$data.dv
        //     save_dionis_model(d)
        //     table_select_dionis_model.updateRow(d.id, d)
        //     table_select_dionis_model.redraw()
        //     const selected_row = table_select_dionis_model.getSelectedRows()[0]
        //     const id_curr = selected_row.id
        //     const id_prev = selected_row.getPrevRow().getData().id
        //     table_select_dionis_model.deselectRow(id_curr)
        //     table_select_dionis_model.selectRow(id_prev)
        //     table_select_dionis_model.scrollToRow(id_prev, "center", false)
        //     const d_prev = table_select_dionis_model.getSelectedData()[0]
        //     vm.$data.dv = d_prev
        //     vm.$data.chg = false
        // }
        // кнопка перехода на следующее dionismodel -----------------------------------------
        // id2e("btnNextdionismodel").onclick = () => {
        //     const d = vm.$data.dv
        //     save_dionis_model(d)
        //     table_select_dionis_model.updateRow(d.id, d)
        //     table_select_dionis_model.redraw()
        //     const selected_row = table_select_dionis_model.getSelectedRows()[0]
        //     const id_curr = selected_row.id
        //     const id_next = selected_row.getNextRow().getData().id
        //     table_select_dionis_model.deselectRow(id_curr)
        //     table_select_dionis_model.selectRow(id_next)
        //     table_select_dionis_model.scrollToRow(id_next, "center", false)
        //     const d_next = table_select_dionis_model.getSelectedData()[0]
        //     vm.$data.dv = d_next
        //     vm.$data.chg = false
        // }
    })
}

/////////////////////////////////////////////////////////////////////////////////////////
function save_dionis_model_content(id_model, dc) {
    console.log('id_model = ', id_model)
    console.log('dc = ', dc)


    dc.forEach(async (d, index) => {
        console.log('d = ', d)

        const sql_insert = `INSERT INTO dionis_model_content (id_dionis_model, name, sn, comm) VALUES (${id_model}, '${d.name}', '${d.sn}', '${d.comm}')`
        const sql_update = `UPDATE dionis_model_content SET name='${d.name}', sn='${d.sn}',comm='${d.comm}' WHERE id=${d.id}`
        const sql_delete = `DELETE FROM dionis_model_content WHERE id=${d.id}`

        if (d.id == 0) {
            console.log('insert name = ', d.name)
            runSQL_p(sql_insert)
        } else {
            if (d.del == 1) {
                console.log('delete id = ', d.id)
                runSQL_p(sql_delete)
            } else {
                console.log('update id = ', d.id)
                runSQL_p(sql_update)
            }            
        }

    })
}

/////////////////////////////////////////////////////////////////////////////////////////
function remove_selected_dionis_model() {
    let id_dionis_model = table_select_dionis_model.getSelectedData()[0].id
    del_dionis_model(id_dionis_model)
    table_select_dionis_model.deleteRow(id_dionis_model)
    id_dionis_model = getFirstID(table_select_dionis_model)
    table_select_dionis_model.selectRow(id_dionis_model)
}

/////////////////////////////////////////////////////////////////////////////////////////
async function new_dionis_model() {
    const id = await runSQL_p("INSERT INTO dionis_model () VALUES ()")
    return id
}

/////////////////////////////////////////////////////////////////////////////////////////
async function save_dionis_model(d) {
    console.log('d = ', d)
    const sql =
        d.id == 0
            ? `INSERT INTO dionis_model (id,model,type,comm) VALUES (${d.id},'${d.model}','${d.type}', '${d.comm}')`
            : `UPDATE dionis_model SET id=${d.id}, model='${d.model}', type='${d.type}', comm='${d.comm}' WHERE id=${d.id}`

    return runSQL_p(sql)
}

/////////////////////////////////////////////////////////////////////////////////////////
function del_dionis_model(id) {
    runSQL_p(`DELETE FROM dionis_model WHERE id=${id}`)
}

/////////////////////////////////////////////////////////////////////////////////////////
function factory_dionis_model() {
    return {
        id: 0,
        model: '',
        type: '',
        comm: ''
    }
}
























// function filterSelect(data, filterParams) {
//     let id = data.id
//     let row = table_select_gk.searchRows("id", "=", data.id)[0]
//     return row.isSelected()
// }
