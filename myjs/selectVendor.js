let table_select_vendor = null
//=======================================================================================
// модальное окно выбора ГК
//=======================================================================================
function select_vendor(
    selectable = 1,
    mode = 'select',
    win_return = null,
    id_vendor = 0
) {   
    return new Promise(async function (resolve, reject) {
        // const result = await recalc_mts(0)
        const salt = randomStr(10)
        const win_current = 'selectvendor' + salt

        if (mode == 'select') {
            newModalWindow(
                win_current,  // modal
                'Поставщики', // html_header
                '',           // html_body
                '',           // html_footer
                '90%',        // width
                '5%',         // marginLeft
                '3%',         // marginTop
                win_return    // win_return
            )
        }

        const appHeight = appBodyHeight()

        table_select_vendor = tabulator_select_vendor(
            (mode == 'select') ? win_current + 'Body' : 'appBody', // div
            (mode == 'select') ? appHeight * 0.9 : appHeight,      // tabHeight
            resolve,
            reject,
            selectable,
            mode,
            win_current,
            win_return,
            id_vendor,
        )

        if (mode == "select") id_2_set_focus(win_current)
    })
}

/////////////////////////////////////////////////////////////////////////////////////////
function tabulator_select_vendor(
    div,
    tabHeight,
    resolve,
    reject,
    selectable = 1,
    mode = "select",
    win_current = null,
    win_return = null,
    id_vendor = 0,
) {
    const cols = [
        { title: "id", field: "id", widthGrow: 1, headerFilter: true, topCalc: "count" },
        { title: "название", field: "name", widthGrow: 2, headerFilter: true },
        { title: "комментарий", field: "comm", widthGrow: 4, headerFilter: true, },
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
        ajaxURL: "myphp/get_all_vendor.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        // ajaxParams: { s: sono, o: id_otdel, k: sklad, t: id_type_oper },
        height: tabHeight,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Поставщики<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: selectable,
        selectableRangeMode: "click",
        reactiveData: true,
        columns: cols,
        footerElement: msgFooter,

        // renderComplete: function() {
        //     if (mode == "select") id2e(id_checkb_xls).disabled = true
        // },

        dataLoaded: function () {
            if (id_vendor == 0) return
            tabulator.selectRow(id_vendor)
            tabulator.scrollToRow(id_vendor, "center", false)
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
                // id2e(id_button_add).disabled = !isRole("vendor") && !isRole("su")
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
                const res = await edit_vendor(
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
        const d = factory_vendor()
        d.id = await save_vendor(d)

        addTabRow(tabulator, d, (top = true))

        const res = await edit_vendor(
            d,            // d
            win_current , // win_return
            "new"         // mode
        )
    }

    id2e(id_button_mod).onclick = async () => {
        const res = await edit_vendor(
            tabulator.getSelectedData()[0], // d
            win_current,                    // win_return
            "mod"                           // mode
        )
    }

    id2e(id_button_del).onclick = async () => {
        const ans = await dialogYESNO(
            "Удалить поставщика", // text
            win_current           // win_return
        )

        if (ans == 'YES') {
            const data = tabulator.getSelectedData()
            data.forEach((d) => {
                del_vendor(d.id)
                tabulator.deleteRow(d.id)
            })
            const id_vendor = getFirstID(tabulator)
            tabulator.selectRow(id_vendor)
        }
    }

    // tabulator.redraw()

    return tabulator
}


/////////////////////////////////////////////////////////////////////////////////////////
function edit_vendor(d, win_return = null, mode = "") {
    return new Promise(function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'editvendor' + salt

        const headervendor = `<h4>Поставщик</h4>`

        const bodyvendor = `
        <div style="margin: 0; padding: 1%;">
            <b>наименование поставщика:</b><br>
            <textarea rows="1" style="width:100%" v-model="dv.name"></textarea>
            <br>
            комментарии:<br>
            <textarea rows="3" style="width:100%" v-model="dv.comm"></textarea>
            <br>
            <br>
            <button id="btnEntervendor"  class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить</button>
            <button id="btnCancelvendor" class="w3-btn w3-padding-small o3-border w3-hover-red">отменить</button>
            <button id="btnPrevvendor"   class="w3-btn w3-padding-small o3-border w3-hover-teal">предыдущий поствщик</button>
            <button id="btnNextvendor"   class="w3-btn w3-padding-small o3-border w3-hover-teal">следующий поставщик</button>
        </div>`

        const footvendor = ``

        const esc_vendor = mode == "new"
            ? () => {
                remove_selected_vendor()
                vapp.unmount()
            }
            : () => {
                vapp.unmount()
            }

        newModalWindow(
            win_current,
            headervendor,
            bodyvendor,
            footvendor,
            "60%",      // width
            "15%",      // marginLeft
            "5%",       // marginTop
            win_return, // win_return
            esc_vendor  // esc_callback
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
        //--- View Model-------------------------------------------------------stop

        // кнопка сохранения и выхода -----------------------------------------------
        id2e("btnEntervendor").onclick = () => {
            const d = vm.$data.dv
            vapp.unmount()
            save_vendor(d)
            removeModalWindow(win_current, win_return)
            table_select_vendor.updateRow(d.id, d)
            table_select_vendor.redraw()
            resolve("OK")
        }
        // кнопка отмены изменений --------------------------------------------------
        id2e("btnCancelvendor").onclick = () => {
            vapp.unmount()
            if (mode == "new") remove_selected_vendor()
            removeModalWindow(win_current, win_return)
            resolve("CANCEL")
        }
        // кнопка сохранения без выхода ---------------------------------------------
        // id2e("btnApplayvendor").onclick = () => {
        //     const d = vm.$data.dv
        //     save_vendor(d)
        //     table_select_vendor.updateRow(d.id, d)
        //     table_select_vendor.redraw()
        // }
        // кнопка перехода на предыдущее vendor ----------------------------------------
        id2e("btnPrevvendor").onclick = () => {
            const d = vm.$data.dv
            save_vendor(d)
            table_select_vendor.updateRow(d.id, d)
            table_select_vendor.redraw()
            const selected_row = table_select_vendor.getSelectedRows()[0]
            const id_curr = selected_row.id
            const id_prev = selected_row.getPrevRow().getData().id
            table_select_vendor.deselectRow(id_curr)
            table_select_vendor.selectRow(id_prev)
            table_select_vendor.scrollToRow(id_prev, "center", false)
            const d_prev = table_select_vendor.getSelectedData()[0]
            vm.$data.dv = d_prev
            vm.$data.chg = false
        }
        // кнопка перехода на следующее vendor -----------------------------------------
        id2e("btnNextvendor").onclick = () => {
            const d = vm.$data.dv
            save_vendor(d)
            table_select_vendor.updateRow(d.id, d)
            table_select_vendor.redraw()
            const selected_row = table_select_vendor.getSelectedRows()[0]
            const id_curr = selected_row.id
            const id_next = selected_row.getNextRow().getData().id
            table_select_vendor.deselectRow(id_curr)
            table_select_vendor.selectRow(id_next)
            table_select_vendor.scrollToRow(id_next, "center", false)
            const d_next = table_select_vendor.getSelectedData()[0]
            vm.$data.dv = d_next
            vm.$data.chg = false
        }
    })
}

/////////////////////////////////////////////////////////////////////////////////////////
function remove_selected_vendor() {
    let id_vendor = table_select_vendor.getSelectedData()[0].id
    del_vendor(id_vendor)
    table_select_vendor.deleteRow(id_vendor)
    id_vendor = getFirstID(table_select_vendor)
    table_select_vendor.selectRow(id_vendor)
}

/////////////////////////////////////////////////////////////////////////////////////////
async function new_vendor() {
    const id = await runSQL_p("INSERT INTO vendor () VALUES ()")
    return id
}

/////////////////////////////////////////////////////////////////////////////////////////
async function save_vendor(d) {
    const sql =
        d.id == 0
            ? `INSERT INTO vendor (id,name,comm) VALUES (${d.id},'${d.name}','${d.comm}')`
            : `UPDATE vendor SET id=${d.id}, name='${d.name}', comm='${d.comm}' WHERE id=${d.id}`

    return runSQL_p(sql)
}

/////////////////////////////////////////////////////////////////////////////////////////
function del_vendor(id) {
    runSQL_p(`DELETE FROM vendor WHERE id=${id}`)
}

/////////////////////////////////////////////////////////////////////////////////////////
function factory_vendor() {
    return {
        id: 0,
        name: '',
        comm: ''
    }
}
























// function filterSelect(data, filterParams) {
//     let id = data.id
//     let row = table_select_gk.searchRows("id", "=", data.id)[0]
//     return row.isSelected()
// }
