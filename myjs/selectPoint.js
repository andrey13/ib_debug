let table_select_point = null
//=======================================================================================
// модальное окно выбора МТС
//=======================================================================================
function select_point(
    selectable = 1,
    mode = 'select',
    win_return = null,
    id_point = 0,
    stock = 0,
    header = ''
) {
    return new Promise(async function (resolve, reject) {
        // const result = await recalc_mts(0)
        const salt = randomStr(10)
        const win_current = 'selectpoint' + salt

        if (mode == 'select') {
            newModalWindow(
                win_current,           // modal
                header, // html_header
                '',                    // html_body
                '',                    // html_footer
                '40%',                 // width
                '40%',                  // marginLeft
                '3%',                  // marginTop
                win_return             // win_return
            )
        }

        const appHeight = appBodyHeight()

        table_select_point = tabulator_select_point(
            (mode == 'select') ? win_current + 'Body' : 'appBody', // div
            (mode == 'select') ? appHeight * 0.9 : appHeight,      // tabHeight
            resolve,
            reject,
            selectable,
            mode,
            win_current,
            win_return,
            id_point,
            stock
        )

        // table_select_point.setFilter("old", "=", 0)

        if (mode == "select") id_2_set_focus(win_current)
    })
}

/////////////////////////////////////////////////////////////////////////////////////////
function tabulator_select_point(
    div,
    tabHeight,
    resolve,
    reject,
    selectable = 1,
    mode = "select",
    win_current = null,
    win_return = null,
    id_point = 0,
    stock = 0
) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";

    const salt = randomStr(10)

    const id_button_sel = 'sel' + salt
    const id_button_mod = 'mod' + salt
    const id_button_add = 'add' + salt
    const id_button_del = 'del' + salt
    const id_button_his = 'his' + salt

    const msgFooter =
    `<span id="select-stats"></span>` +
    `<div style="width: 100%; text-align: left;">` +
    `<button id='${id_button_sel}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Выбрать</button>` +
    `<button id='${id_button_mod}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Изменить</button>` +
    `<button id='${id_button_add}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Добавить</button>` +
    `<button id='${id_button_del}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Удалить</button>` +
    `<button id='${id_button_his}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>История</button>` +
    `</div>`

    const tabulator = new Tabulator("#" + div, {
        ajaxURL: "myphp/get_all_point.php",
        ajaxParams: { s: stock },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: tabHeight,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>point<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: selectable,
        selectableRangeMode: "click",
        reactiveData: true,
        columns: [
            { title: "id", field: "id", width: 60, print: false, topCalc: "count" },
            { title: "СОНО", field: "ifns_sono", headerFilter: true, width: 80, editor: ed },
            { title: "СОУН", field: "torm_sono", headerFilter: true, width: 80, editor: ed },
            { title: "", field: "ip", headerFilter: true, widthGrow: 3, editor: ed },
            { title: "", field: "torm_name", headerFilter: true, widthGrow: 3, editor: ed },
            // { title: "mask", field: "mask", headerFilter: true, widthGrow: 2, topCalc: "count", editor: ed },
            // { title: "sklad",       field: "stock",  headerFilter: true, widthGrow: 2, editor: ed },
        ],
        footerElement: msgFooter,

        // renderComplete: function() {
        //     if (mode == "select") id2e(id_checkb_xls).disabled = true
        // },

        dataLoaded: function () {
            console.log('id_point = ', id_point)
            if (id_point == 0) return
            
            // var row = tabulator.findRow(function(data){
            //     return data.id == id_point;
            // }).first()
            // if (!!!row) return

            const d = table_select_point.searchData("id", "=", id_point.toString())
            if (d.length == 0) return

            tabulator.selectRow(id_point)
            tabulator.scrollToRow(id_point, "center", false)
        },

        rowFormatter: function (row) {
            let d = row.getData()
            // if (d.sono1 != d.sono2) {
            //     // место приписки не совпадает с нахождением
            //     row.getCell("sono2").getElement().style.backgroundColor = '#ffcccc'
            //     row.getCell("ifns2").getElement().style.backgroundColor = '#ffcccc'
            // }
        },

        rowSelectionChanged: function (data, rows) {      
            // if (data.length == 0) {
            //     id2e(id_button_mod).disabled = true
            //     id2e(id_button_del).disabled = true
            //     id2e(id_button_his).disabled = true
            //     id2e(id_button_sel).disabled = true
            //     id2e(id_button_add).disabled = !isRole("dionis") && !isRole("su")
            // } else {
            //     id2e(id_button_mod).disabled = !isRole("dionis") && !isRole("su")
            //     id2e(id_button_del).disabled = !isRole("dionis") && !isRole("su")
            //     id2e(id_button_his).disabled = false
            //     id2e(id_button_sel).disabled = false
            //     id2e(id_button_add).disabled = !isRole("dionis") && !isRole("su")
            //     id2e(id_button_mod).disabled = !isRole("dionis") && !isRole("su")
            // }
        },

        cellDblClick: async function (e, cell) {
            if ((mode == "select")) {
                removeModalWindow(win_current, win_return)
                resolve(cell.getRow().getData())
            } else {
                const res = await edit_point(
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
        // const d = factory_point()
        // d.id = await save_point(d)

        // addTabRow(tabulator, d, (top = true))

        // const res = await edit_point(
        //     d,
        //     (win_return = win_current),
        //     (mode = "new")
        // )
    }

    id2e(id_button_mod).onclick = async () => {
        // const res = await edit_point(
        //     tabulator.getSelectedData()[0],
        //     (win_return = win_current),
        //     (mode = "mod")
        // )
    }

    id2e(id_button_del).onclick = async () => {
        // const ans = await dialogYESNO(
        //     (text = "Удалить point"),
        //     (win_return = win_current)
        // )

        // if (ans == 'YES') {
        //     const data = tabulator.getSelectedData()
        //     data.forEach((d) => {
        //         del_point(d.id)
        //         tabulator.deleteRow(d.id)
        //     })
        //     const id_point = getFirstID(tabulator)
        //     tabulator.selectRow(id_point)
        // }
    }

    return tabulator
}


/////////////////////////////////////////////////////////////////////////////////////////
function edit_point(d, win_return = null, mode = "") {
    return new Promise(function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'editpoint' + salt

        const headerpoint = `<h4>параметры point</h4>`

        const bodypoint = `
        <div style="margin: 0; padding: 1%;">
            <b>ТНО приписки:</b><br>
            <input class="o3-border" type="text" v-model="dv.sono1"><br>
            <textarea rows="3" style="width:100%" v-model="dv.ifns1"></textarea><br><br>
            <b>ТНО нахождения:</b><br>
            <input class="o3-border" type="text" v-model="dv.sono2"><br>
            <textarea rows="3" style="width:100%" v-model="dv.ifns2"></textarea><br><br>
            <input class="o3-border" type="text" v-model="dv.status"> - статус<br>
            <input class="o3-border" type="text" v-model="dv.inv_n"> - инвентарный номер<br>
            <input class="o3-border" type="text" v-model="dv.sn"> - заводской номер<br>
            <input class="o3-border" type="text" v-model="dv.type"> - тип<br>
            <input class="o3-border" type="text" v-model="dv.model"> - модель<br>
            <input class="o3-border" type="text" v-model="dv.ver"> - версия<br>
            <input class="o3-border" type="text" v-model="dv.date1"> - дата установки<br>
            <br>           
            Комментарии:<br>
            <textarea rows="3" style="width:100%" v-model="dv.comm"></textarea>
            <br>
            <br>
            <button id="btnEnterpoint"  class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить</button>
            <button id="btnCancelpoint" class="w3-btn w3-padding-small o3-border w3-hover-red">отменить</button>
            <button id="btnPrevpoint"   class="w3-btn w3-padding-small o3-border w3-hover-teal">предыдущий point</button>
            <button id="btnNextpoint"   class="w3-btn w3-padding-small o3-border w3-hover-teal">следующий point</button>
        </div>`

        // <tr>
        //   <td>
        //     <button id="selectpointComp" class="w3-btn w3-padding-small o3-button w3-hover-teal">{{cname}}</button></button>
        //     <span v-show="shExl">id_comp: {{dv.id_comp}}</span>
        //   </td>
        //   <td></td>
        // </tr>


        const footpoint = ``

        const esc_point = mode == "new"
            ? () => { 
                remove_selected_point() 
                vapp.unmount()
            }
            : () => { 
                console.log("esc_callback") 
                vapp.unmount()
            }

        newModalWindow(
            win_current,
            headerpoint,
            bodypoint,
            footpoint,
            "60%",      // width
            "15%",      // marginLeft
            "5%",       // marginTop
            win_return, // win_return
            esc_point   // esc_callback
        )

        //--- View Model-------------------------------------------------------start
        const vapp = Vue.createApp({
            data() {
                return {
                    dv: d,
                    chg: false,
                    /*
                    chg: false,
                    dsp: d.dsp,
                    shExl: false,
                    style_dsp: ({ focused, checked }) => {
                        const style = {}
                        style.background = (checked) ? "#8888ff" : "grey"
                        style.boxShadow = (focused) ? "0 0 0 0px #d0305040" : "0 0 0 0px #2080f040"
                        return style
                    },
                    style_bad: ({ focused, checked }) => {
                        const style = {}
                        style.background = (checked) ? "red" : "green"
                        style.boxShadow = (focused) ? "0 0 0 0px #d0305040" : "0 0 0 0px #2080f040"
                        return style
                    },
                    style_old: ({ focused, checked }) => {
                        const style = {}
                        style.background = (checked) ? "red" : "green"
                        style.boxShadow = (focused) ? "0 0 0 0px #d0305040" : "0 0 0 0px #2080f040"
                        return style
                    }
                    */
                }
            },
            /*
            computed: {
                uname() {
                    return !!!this.dv.uname
                        ? "<выбрать пользователя>"
                        : this.dv.uname
                },
                cname() {
                    return !!!this.dv.cname
                        ? "<выбрать компьютер>"
                        : this.dv.cname
                },
                dname() {
                    return !!!this.dv.dname
                        ? "<выбрать отдел>"
                        : this.dv.dname
                },
                dsp() {
                    if (!!!this.dsp) return ""
                    return this.dv.dsp == "1" ? "дсп" : ""
                },
            },
            watch: {
                dv: {
                    handler(newValue, oldValue) {
                        this.chg = true
                    },
                    deep: true,
                },
            },
            */
        })

        const vm = vapp.use(naive).mount('#' + win_current)
        //--- View Model-------------------------------------------------------stop

        // id_2_set_focus(win_current)

        // кнопка выбора пользователя -----------------------------------------------
        // id2e('btnShowExl').onclick = () => {
        //     vm.$data.shExl = !vm.$data.shExl
        // }
        // кнопка выбора пользователя -----------------------------------------------
        // id2e("selectpointUser").onclick = async () => {
        //     const id_depart = isRole("tex") ? g_user.id_depart : 0
        //     const selectedUsers = await selectUser(
        //         "6100",
        //         "",
        //         id_depart,
        //         1,
        //         (header = "Выбор ответственного лица"),
        //         (width = "40%"),
        //         (marginLeft = "30%"),
        //         (marginTop = "5%"),
        //         win_current,
        //         vm.$data.dv.id_user
        //     )
        //     selectedUsers.forEach(async (u) => {
        //         vm.$data.dv.id_user = u.id
        //         vm.$data.dv.uname = u.name
        //         vm.$data.dv.user_esk_status = u.esk_status
        //         if (u.esk_status == 2) {
        //             console.log('u.esk_status == 2')
        //             vm.$data.dv.id_depart = u.id_depart
        //             const depart_data = await id_depart_2_data(u.id_depart)
        //             vm.$data.dv.id_otdel = depart_data.id_otdel
        //             vm.$data.dv.dname = depart_data.name
        //         } else {
        //             console.log('u.esk_status != 2')
        //             vm.$data.dv.id_depart = 0
        //             vm.$data.dv.dname = 'отключен'
        //         }
        //         id2e("selectpointUser").innerHTML = vm.$data.dv.uname
        //         id_2_set_focus(win_current)
        //     })
        // }
        // кнопка выбора отдела -----------------------------------------------------
        // id2e("selectpointDepart").onclick = async () => {
        //     const dep = await selectVocab(
        //         (table = "depart"),
        //         (sort = "id_otdel"),
        //         (ok = -1),
        //         (tite = "отдел"),
        //         (allow = ""),
        //         (width = "60%"),
        //         (marginLeft = "20%"),
        //         (marginTop = "5%"),
        //         win_current,
        //         sono = g_user.sono
        //     )
        //     console.log('dep = ', dep)
        //     vm.$data.dv.id_depart = dep.id
        //     vm.$data.dv.id_otdel = dep.id_otdel
        //     vm.$data.dv.dname = (await id_depart_2_data(dep.id)).name
        //     id_2_set_focus(win_current)
        // }
        // кнопка сохранения и выхода -----------------------------------------------
        id2e("btnEnterpoint").onclick = () => {
            const d = vm.$data.dv
            vapp.unmount()
            save_point(d)
            removeModalWindow(win_current, win_return)
            table_select_point.updateRow(d.id, d)
            table_select_point.redraw()
            resolve("OK")
        }
        // кнопка отмены изменений --------------------------------------------------
        id2e("btnCancelpoint").onclick = () => {
            vapp.unmount()
            if (mode == "new") remove_selected_point()
            removeModalWindow(win_current, win_return)
            resolve("CANCEL")
        }
        // кнопка сохранения без выхода ---------------------------------------------
        // id2e("btnApplaypoint").onclick = () => {
        //     const d = vm.$data.dv
        //     save_point(d)
        //     table_select_point.updateRow(d.id, d)
        //     table_select_point.redraw()
        // }
        // кнопка перехода на предыдущее МТС ----------------------------------------
        id2e("btnPrevpoint").onclick = () => {
            const d = vm.$data.dv
            save_point(d)
            table_select_point.updateRow(d.id, d)
            table_select_point.redraw()
            // if (vm.$data.chg) {
            //     dialogYESNO('Данные были изменены<br>сохранить изменения')
            //         .then(ans => {
            //             if (ans == "YES") {
            //                 const d = vm.$data.dv
            //                 save_point(d)
            //                 table_select_point.updateRow(d.id, d)
            //                 table_select_point.redraw()
            //             } else {
            //                 return
            //             }
            //         })
            // }
            const selected_row = table_select_point.getSelectedRows()[0]
            const id_curr = selected_row.id
            const id_prev = selected_row.getPrevRow().getData().id
            table_select_point.deselectRow(id_curr)
            table_select_point.selectRow(id_prev)
            table_select_point.scrollToRow(id_prev, "center", false)
            const d_prev = table_select_point.getSelectedData()[0]
            vm.$data.dv = d_prev
            vm.$data.chg = false
        }
        // кнопка перехода на следующее МТС -----------------------------------------
        id2e("btnNextpoint").onclick = () => {
            const d = vm.$data.dv
            save_point(d)
            table_select_point.updateRow(d.id, d)
            table_select_point.redraw()
            // if (vm.$data.chg) {
            //     dialogYESNO('Данные были изменены<br>сохранить изменения')
            //         .then(ans => {
            //             if (ans == "YES") {
            //                 const d = vm.$data.dv
            //                 save_point(d)
            //                 table_select_point.updateRow(d.id, d)
            //                 table_select_point.redraw()
            //             } else {
            //                 return
            //             }
            //         })
            // }
            const selected_row = table_select_point.getSelectedRows()[0]
            const id_curr = selected_row.id
            const id_next = selected_row.getNextRow().getData().id
            table_select_point.deselectRow(id_curr)
            table_select_point.selectRow(id_next)
            table_select_point.scrollToRow(id_next, "center", false)
            const d_next = table_select_point.getSelectedData()[0]
            vm.$data.dv = d_next
            vm.$data.chg = false
        }
    })
}

/////////////////////////////////////////////////////////////////////////////////
async function show_point_history(id_point, win_return = null) {
    const data_point = await id_2_data(id_point, 'point')
    const win_current = 'historypoint' + randomStr(10)
    const header = `<h4>история МТС id: ${data_point.id}, SN: ${data_point.SN}</h4>`
    const body = `<div class="w3-container"></div>`
    const foot = ``
    
    const esc_point_history = () => { 
        console.log("esc_callback") 
    }

    newModalWindow( 
        win_current, 
        header, 
        body, 
        foot,
        "59%",            // width
        "40%",            // marginLeft
        "1%",             // marginTop
        win_return,       // win_return
        esc_point_history // esc_callback
    )
    
    const table_histoty = new Tabulator('#' + win_current + 'Body', {
        ajaxURL: "myphp/get_point_history.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { i: data_point.id },
        height: appBodyHeight()-100,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>история МТС<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: selectable,
        selectableRangeMode: "click",
        reactiveData: true,
        columns: [
            { title: 'обращение', field: 'z_id', widthGrow: 1, headerFilter: true, topCalc: 'count' },
            // { title: 'дата', field: 'z_date', width: 75, headerFilter: true },
            {
                title: "дата",
                field: "z_date",
                width: 75,
                headerFilter: true,
                formatter: "datetime",
                formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD.MM.YYYY",
                },
            }, 
            { title: 'статус', field: 'status', widthGrow: 2, headerFilter: true },
            // { title: 'тип', field: 'z_id_type', widthGrow: 1, headerFilter: true },
            // { title: 'тип', field: 'type', widthGrow: 4, headerFilter: true },
            // { title: 'статус', field: 'z_id_status', widthGrow: 1, headerFilter: true },
            // { title: 'операция', field: 'zm_id_oper', widthGrow: 1, headerFilter: true },
            { title: 'операция', field: 'oper', widthGrow: 2, headerFilter: true },
            { title: 'дсп', field: 'zm_dsp', widthGrow: 1, headerFilter: true },
            // { title: 'ответственный', field: 'zm_id_user', widthGrow: 1, headerFilter: true },
            { title: 'ответственный', field: 'user_point_name', widthGrow: 4, headerFilter: true },
            // { title: 'заявитель', field: 'z_id_user', widthGrow: 1, headerFilter: true },
            { title: 'заявитель', field: 'user_name', widthGrow: 4, headerFilter: true },
            // { title: 'исполнитель', field: 'z_id_user_isp', widthGrow: 1, headerFilter: true },
            { title: 'исполнитель', field: 'user_isp_name', widthGrow: 4, headerFilter: true },
        ],
        footerElement: '',
    })
    id_2_set_focus(win_current)
}


/////////////////////////////////////////////////////////////////////////////////////////
function remove_selected_point() {
    let id_point = table_select_point.getSelectedData()[0].id
    del_point(id_point)
    table_select_point.deleteRow(id_point)
    id_point = getFirstID(table_select_point)
    table_select_point.selectRow(id_point)
}

/////////////////////////////////////////////////////////////////////////////////////////
async function new_point() {
    const id = await runSQL_p("INSERT INTO point () VALUES ()")
    return id
}

/////////////////////////////////////////////////////////////////////////////////////////
async function save_point(d) {
    const sql =
        d.id == 0
            ? `INSERT INTO point ( 
            id,
            sono1,
            sono2,
            ifns1,
            ifns2,
            type,
            model,
            sn,
            inv_n,
            ver,
            date_sert,
            status,
            date1,
            ifns3,
            comm
        ) VALUES (
            ${d.id},
            ${d.sono1},
            ${d.sono2},
            '${d.ifns1}',
            '${d.ifns2}',
            '${d.type}',
            '${d.model}',
            '${d.sn}',
            '${d.inv_n}',
            '${d.ver}',
            '${d.date_sert}',
            '${d.status}',
            '${d.date1}',
            '${d.ifns3}',
            '${d.comm}'
    )`
            : `UPDATE point SET 
            id=${d.id},
            sono1=${d.sono1},
            sono2=${d.sono2},
            ifns1='${d.ifns1}',
            ifns2='${d.ifns2}',
            type='${d.type}',
            model='${d.model}',
            sn='${d.sn}',
            inv_n='${d.inv_n}',
            ver='${d.ver}',
            date_sert='${d.date_sert}',
            status='${d.status}',
            date1='${d.date1}',
            ifns3='${d.ifns3}',
            comm='${d.comm}'
        WHERE id=${d.id}`

    return runSQL_p(sql)
}

/////////////////////////////////////////////////////////////////////////////////////////
function del_point(id) {
    runSQL_p(`DELETE FROM point WHERE id=${id}`)
    runSQL_p(`DELETE FROM point_oper WHERE id_point=${id}`)
}

/////////////////////////////////////////////////////////////////////////////////////////
function factory_point() {
    return {
        id: 0,
        sono1: 0,
        sono2: 0,
        ifns1: '',
        ifns2: '',
        type: '',
        model: '',
        sn: '',
        inv_n: '',
        ver: '',
        date_sert: '',
        status: '',
        date1: '',
        ifns3: '',
        comm: ''
    }
}
