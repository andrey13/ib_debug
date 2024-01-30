let table_select_point_dionis = null
//=======================================================================================
// модальное окно выбора ГК
//=======================================================================================
function select_point_dionis(
    selectable = 1,
    mode = 'select',
    win_return = null,
    id_point = 0
) {
    return new Promise(async function (resolve, reject) {
        // const result = await recalc_mts(0)
        const salt = randomStr(10)
        const win_current = 'selectPD' + salt

        if (mode == 'select') {
            newModalWindow(
                win_current, // modal
                'точки подключения Dionis', // html_header
                '',          // html_body
                '',          // html_footer
                '90%',       // width
                '5%',        // marginLeft
                '3%',        // marginTop
                win_return   // win_return
            )
        }

        const appHeight = appBodyHeight()

        table_select_point_dionis = tabulator_select_point_dionis(
            (mode == 'select') ? win_current + 'Body' : 'appBody', // div
            (mode == 'select') ? appHeight * 0.9 : appHeight,      // tabHeight
            resolve,
            reject,
            selectable,
            mode,
            win_current,
            win_return,
            id_point
        )

        if (mode == "select") id_2_set_focus(win_current)
    })
}

/////////////////////////////////////////////////////////////////////////////////////////
function tabulator_select_point_dionis(
    div,
    tabHeight,
    resolve,
    reject,
    selectable = 1,
    mode = "select",
    win_current = null,
    win_return = null,
    id_point = 0,
) {
    const cols = [
        { title: "id",   field: "id", width: 50, headerFilter: true, topCalc: "count" },
        { title: "СОНО", field: "sono", width: 90, headerFilter: true },
        { title: "ТОРМ", field: "sono_torm", width: 90, headerFilter: true },
        { title: "ТНО",  field: "name", widthGrow: 4, headerFilter: true },
    ]
    

    const salt = randomStr(10)

    const id_button_sel = 'sel' + salt
    const id_button_mod = 'mod' + salt
    const id_button_add = 'add' + salt
    const id_button_del = 'del' + salt
    const id_button_opr = 'opr' + salt

    const msgFooter =
        `<span id="select-stats"></span>` +
        `<div style="width: 100%; text-align: left;">` +
        `<button id='${id_button_opr}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Операции Dionis</button>` +
        `</div>`

    const tabulator = new Tabulator("#" + div, {
        ajaxURL: "myphp/sono_2_torms.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { s: g_user.sono },
        height: tabHeight,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>ГК<h1>",
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
            if (id_point == 0) return
            tabulator.selectRow(id_point)
            tabulator.scrollToRow(id_point, "center", false)
        },

        rowFormatter: function (row) {
            // let d = row.getData()
            // if (d.sono1 != d.sono2) {
            //     row.getCell("sono2").getElement().style.backgroundColor = '#ffcccc'
            // }
        },

        rowSelectionChanged: function (data, rows) {
            if (data.length == 0) {
                id2e(id_button_opr).disabled = true
            } else {
                id2e(id_button_opr).disabled = false
            }
        },

        cellDblClick: async function (e, cell) {
            if ((mode == "select")) {
                removeModalWindow(win_current, win_return)
                resolve([cell.getRow().getData()])
            } else {
                const d = tabulator.getSelectedData()[0]
                const title = d.sono + '/' + d.sono_torm + '   ' + d.name
                
                select_dionis_oper(
                    '6100',   // sono
                    0,        // id_otdel
                    0,        // sklad
                    1,        // selectable
                    'select', // mode
                    null,     // win_return
                    0,        // id_oper
                    0,        // id_dionis
                    d.id,     // id_torm
                    title     // title
                )
        
                // const res = await edit_dionis(
                //     tabulator.getSelectedData()[0], // d
                //     win_current                     // win_return
                // )
            }
        },

    })

    id2e(id_button_opr).onclick = () => {
        const d = tabulator.getSelectedData()[0]
        const title = d.sono + '/' + d.sono_torm + '   ' + d.name
        
        select_dionis_oper(
            '6100',   // sono
            0,        // id_otdel
            0,        // sklad
            1,        // selectable
            'select', // mode
            null,     // win_return
            0,        // id_oper
            0,        // id_dionis
            d.id,     // id_torm
            title     // title
        )
}

    // id2e(id_button_sel).onclick = () => {
    //     removeModalWindow(win_current, win_return)
    //     resolve(tabulator.getSelectedData()[0])
    // }

    // id2e(id_button_add).onclick = async () => {
    //     const d = factory_gk()
    //     d.id = await save_gk(d)

    //     addTabRow(tabulator, d, (top = true))

    //     const res = await edit_point_dionis(
    //         d,           // d
    //         win_current, // win_return
    //         "new"        // mode
    //     )
    // }

    // id2e(id_button_mod).onclick = async () => {
    //     const res = await edit_point_dionis(
    //         tabulator.getSelectedData()[0], // d
    //         win_current,                    // win_return
    //         "mod"                           // mode
    //     )
    // }

    // id2e(id_button_del).onclick = async () => {
    //     const ans = await dialogYESNO(
    //         "Удалить ГК",  // text
    //         win_current    // win_return
    //     )

    //     if (ans == 'YES') {
    //         const data = tabulator.getSelectedData()
    //         data.forEach((d) => {
    //             del_gk(d.id)
    //             tabulator.deleteRow(d.id)
    //         })
    //         const id_point = getFirstID(tabulator)
    //         tabulator.selectRow(id_point)
    //     }
    // }

    // tabulator.redraw()

    return tabulator
}

/////////////////////////////////////////////////////////////////////////////////////////
// function edit_point_dionis(d, win_return = null, mode = "") {
//     return new Promise(async function (resolve, reject) {
//         const salt = randomStr(10)
//         const win_current = 'editpd' + salt

//         const headerpd = `<h4>параметры ГК</h4>`
//         const sel_vendor = 'select_vendor' + salt
//         const sel_executor = 'select_executor' + salt

//         const bodypd = `
//         <div style="margin: 0; padding: 1%;">
//             краткое наименование ГК:<br>
//             <input class="o3-border" type="text" v-model="dv.name">
//             <br>
//             <br>
//             дата ГК:<br>
//             <input class="o3-border" type="date" id="gk_date" v-model="dv.date_gk">
//             <br>
//             <br>
//             номер ГК:<br>
//             <textarea rows="1" style="width:100%" v-model="dv.numb_gk"></textarea>
//             <br>
//             <br>
//             наименование ГК:<br>
//             <textarea rows="1" style="width:100%" v-model="dv.name_gk"></textarea>
//             <br>
//             <br>
//             поставщик:<br>
//             <button id=${sel_vendor} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{vendor}}</button>
//             <br>
//             <br>
//             дата и номер письма ФНС:<br>
//             <input class="o3-border" type="date" id="gk_date" v-model="dv.date_fns">
//             <input class="o3-border" type="text" v-model="dv.numb_fns">
//             <br>
//             <br>
//             дата и номер сопроводительного письма поставщика:<br>
//             <input class="o3-border" type="date" id="gk_date" v-model="dv.date_vendor">
//             <input class="o3-border" type="text" v-model="dv.numb_vendor">
//             <br>
//             <br>
//             дата фактического прибытия:<br>
//             <input class="o3-border" type="date" id="gk_date" v-model="dv.date_in">
//             <br>
//             <br>
//             дата и номер письма УФНС в ТНО:<br>
//             <input class="o3-border" type="date" id="gk_date" v-model="dv.date_ufns">
//             <input class="o3-border" type="text" v-model="dv.numb_ufns">
//             <br>
//             <br>
//             даты выдачи:<br>
//             <input class="o3-border" type="date" id="gk_date" v-model="dv.date_out1">
//             <input class="o3-border" type="date" id="gk_date" v-model="dv.date_out2">
//             <br>
//             <br>
//             комментарии:<br>
//             <textarea rows="3" style="width:100%" v-model="dv.comm"></textarea>
//             <br>
//             <br>
//             исполнитель УФНС:<br>
//             <button id=${sel_executor} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{executor}}</button>
//             <br>
//             <br>
//             <button id="btnEnterGK"  class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить</button>
//             <button id="btnCancelGK" class="w3-btn w3-padding-small o3-border w3-hover-red">отменить</button>
//             <button id="btnPrevGK"   class="w3-btn w3-padding-small o3-border w3-hover-teal">предыдущий ГК</button>
//             <button id="btnNextGK"   class="w3-btn w3-padding-small o3-border w3-hover-teal">следующий ГК</button>
//         </div>`

//         const footgk = ``

//         const esc_gk = mode == "new"
//             ? () => {
//                 remove_selected_gk()
//                 vapp.unmount()
//             }
//             : () => {
//                 vapp.unmount()
//             }

//         newModalWindow(
//             win_current,
//             headerpd,
//             bodypd,
//             footgk,
//             "60%",      // width
//             "15%",      // marginLeft
//             "1%",       // marginTop
//             win_return, // win_return
//             esc_gk      // esc_callback
//         )

//         //--- View Model-------------------------------------------------------start
//         const vapp = Vue.createApp({
//             data() {
//                 return {
//                     dv: d,
//                     chg: false,
//                 }
//             },
//             computed: {
//                 vendor() {
//                     return !!!this.dv.vendor_name
//                         ? "<выбрать поставщика>"
//                         : this.dv.vendor_name
//                 },
//                 executor() {
//                     return !!!this.dv.executor_name
//                         ? "<выбрать исполнителя>"
//                         : this.dv.executor_name
//                 },
//             },

//         })

//         const vm = vapp.use(naive).mount('#' + win_current)
//         //--- View Model-------------------------------------------------------stop

//         // кнопка выбора поставщика -----------------------------------------------
//         id2e(sel_vendor).onclick = async () => {
//             const selected_vendor = await select_vendor(
//                 1,                    // selectable
//                 'select',             // mode
//                 win_current,          // win_return
//                 vm.$data.dv.id_vendor // id_vendor
//             )

//             vm.$data.dv.id_vendor = selected_vendor.id
//             vm.$data.dv.vendor_name = selected_vendor.name

//             id2e(sel_vendor).innerHTML = vm.$data.dv.vendor_name
//             id_2_set_focus(win_current)
//         }

//         // кнопка выбора исполнителя -----------------------------------------------
//         id2e(sel_executor).onclick = async () => {
//             const selected_user = await selectUser(
//                 '',                          // sono
//                 '',                          // esk
//                 0,                           //id_depart
//                 1,                           // selectable
//                 'выбор исполнителя УФНС',    // headerWin
//                 '600px',                     // width
//                 '5%',                        // marginLeft
//                 '5%',                        // marginTop
//                 win_current,                 // win_return
//                 vm.$data.dv.id_user_executor // id_user
//             )

//             vm.$data.dv.id_user_executor = selected_user[0].id
//             vm.$data.dv.executor_name = selected_user[0].name

//             id2e(sel_executor).innerHTML = vm.$data.dv.executor_name
//             id_2_set_focus(win_current)
//         }


//         // кнопка сохранения и выхода -----------------------------------------------
//         id2e("btnEnterGK").onclick = () => {
//             const d = vm.$data.dv
//             vapp.unmount()
//             save_gk(d)
//             removeModalWindow(win_current, win_return)
//             table_select_point_dionis.updateRow(d.id, d)
//             table_select_point_dionis.redraw()
//             resolve("OK")
//         }
//         // кнопка отмены изменений --------------------------------------------------
//         id2e("btnCancelGK").onclick = () => {
//             vapp.unmount()
//             if (mode == "new") remove_selected_gk()
//             removeModalWindow(win_current, win_return)
//             resolve("CANCEL")
//         }
//         // кнопка сохранения без выхода ---------------------------------------------
//         // id2e("btnApplaygk").onclick = () => {
//         //     const d = vm.$data.dv
//         //     save_gk(d)
//         //     table_select_point_dionis.updateRow(d.id, d)
//         //     table_select_point_dionis.redraw()
//         // }
//         // кнопка перехода на предыдущее gk ----------------------------------------
//         id2e("btnPrevGK").onclick = () => {
//             const d = vm.$data.dv
//             save_gk(d)
//             table_select_point_dionis.updateRow(d.id, d)
//             table_select_point_dionis.redraw()
//             const selected_row = table_select_point_dionis.getSelectedRows()[0]
//             const id_curr = selected_row.id
//             const id_prev = selected_row.getPrevRow().getData().id
//             table_select_point_dionis.deselectRow(id_curr)
//             table_select_point_dionis.selectRow(id_prev)
//             table_select_point_dionis.scrollToRow(id_prev, "center", false)
//             const d_prev = table_select_point_dionis.getSelectedData()[0]
//             vm.$data.dv = d_prev
//             vm.$data.chg = false
//         }
//         // кнопка перехода на следующее gk -----------------------------------------
//         id2e("btnNextGK").onclick = () => {
//             const d = vm.$data.dv
//             save_gk(d)
//             table_select_point_dionis.updateRow(d.id, d)
//             table_select_point_dionis.redraw()
//             const selected_row = table_select_point_dionis.getSelectedRows()[0]
//             const id_curr = selected_row.id
//             const id_next = selected_row.getNextRow().getData().id
//             table_select_point_dionis.deselectRow(id_curr)
//             table_select_point_dionis.selectRow(id_next)
//             table_select_point_dionis.scrollToRow(id_next, "center", false)
//             const d_next = table_select_point_dionis.getSelectedData()[0]
//             vm.$data.dv = d_next
//             vm.$data.chg = false
//         }
//     })
// }

/////////////////////////////////////////////////////////////////////////////////////////
// function remove_selected_gk() {
//     let id_point = table_select_point_dionis.getSelectedData()[0].id
//     del_gk(id_point)
//     table_select_point_dionis.deleteRow(id_point)
//     id_point = getFirstID(table_select_point_dionis)
//     table_select_point_dionis.selectRow(id_point)
// }

/////////////////////////////////////////////////////////////////////////////////////////
// async function new_gk() {
//     const id = await runSQL_p("INSERT INTO goskontrakt () VALUES ()")
//     return id
// }

/////////////////////////////////////////////////////////////////////////////////////////
// async function save_gk(d) {
//     const sql =
//         d.id == 0
//             ? `INSERT INTO goskontrakt (id,name,date_gk,numb_gk,name_gk,date_fns,numb_fns,date_vendor,numb_vendor,date_in,date_out1,date_out2,date_ufns,numb_ufns,id_user_executor,id_vendor,comm) VALUES (
//             ${d.id},'${d.name}','${d.date_gk}','${d.numb_gk}','${d.name_gk}','${d.date_fns}','${d.numb_fns}','${d.date_vendor}','${d.numb_vendor}','${d.date_in}','${d.date_out1}','${d.date_out2}','${d.date_ufns}','${d.numb_ufns}',${d.id_user_executor},${d.id_vendor},'${d.comm}'
//     )`
//         : `UPDATE goskontrakt SET 
//             id=${d.id},
//             name='${d.name}',
//             date_gk='${d.date_gk}',
//             numb_gk='${d.numb_gk}',
//             name_gk='${d.name_gk}',
//             date_fns='${d.date_fns}',
//             numb_fns='${d.numb_fns}',
//             date_vendor='${d.date_vendor}',
//             numb_vendor='${d.numb_vendor}',
//             date_in='${d.date_in}',
//             date_out1='${d.date_out1}',
//             date_out2='${d.date_out2}',
//             date_ufns='${d.date_ufns}',
//             numb_ufns='${d.numb_ufns}',
//             id_user_executor=${d.id_user_executor},
//             id_vendor=${d.id_vendor},
//             comm='${d.comm}'
//        WHERE id=${d.id}`

//     return runSQL_p(sql)
// }

/////////////////////////////////////////////////////////////////////////////////////////
// function del_gk(id) {
//     runSQL_p(`DELETE FROM goskontrakt WHERE id=${id}`)
// }

/////////////////////////////////////////////////////////////////////////////////////////
// function factory_gk() {
//     return {
//         id: 0,
//         name: '',
//         date_gk: '',
//         numb_gk: '',
//         name_gk: '',
//         date_fns: '',
//         numb_fns: '',
//         date_vendor: '',
//         numb_vendor: '',
//         date_in: '',
//         date_out1: '',
//         date_out2: '',
//         date_ufns: '',
//         numb_ufns: '',
//         id_user_executor: 0,
//         id_vendor: 0,
//         comm: ''
//     }
// }
























// function filterSelect(data, filterParams) {
//     let id = data.id
//     let row = table_select_point_dionis.searchRows("id", "=", data.id)[0]
//     return row.isSelected()
// }
