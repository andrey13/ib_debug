let table_select_dionis = null
//=======================================================================================
// модальное окно выбора Dionis
//=======================================================================================
function select_dionis(
    sono = '6100',
    id_otdel = 0,
    sklad = 0,
    id_type_oper = 0,
    selectable = 1,
    mode = 'select',
    win_return = null,
    id_dionis = 0
) {
    return new Promise(async function (resolve, reject) {
        // const result = await recalc_mts(0)
        const salt = randomStr(10)
        const win_current = 'selectDionis' + salt

        if (mode == 'select') {
            newModalWindow(
                modal = win_current,
                html_header = 'Dionis',
                html_body = '',
                html_footer = '',
                width = '90%',
                marginLeft = '5%',
                marginTop = '3%',
                win_return
            )
        }

        const appHeight = appBodyHeight()

        table_select_dionis = tabulator_select_dionis(
            div = (mode == 'select') ? win_current + 'Body' : 'appBody',
            sono,
            tabHeight = (mode == 'select') ? appHeight * 0.9 : appHeight,
            resolve,
            reject,
            id_otdel,
            sklad,
            id_type_oper,
            selectable,
            mode,
            win_current,
            win_return,
            id_dionis,
        )

        // table_select_dionis.setFilter("old", "=", 0)

        if (mode == "select") id_2_set_focus(win_current)
    })
}

/////////////////////////////////////////////////////////////////////////////////////////
function tabulator_select_dionis(
    div,
    sono,
    tabHeight,
    resolve,
    reject,
    id_otdel = 0,
    sklad = 0,
    id_type_oper,
    selectable = 1,
    mode = "select",
    win_current = null,
    win_return = null,
    id_dionis = 0,
) {
    console.log('win_current = ', win_current)
    console.log('win_return = ', win_return)
    const cols = [
        { title: "id", field: "id", widthGrow: 1, headerFilter: true, topCalc: "count" },
        {//группа владелец
            title: "владелец (exel)",
            columns: [
                { title: "СОНО", field: "sono1", widthGrow: 1, headerFilter: true },
                { title: "ТНО", field: "ifns1", widthGrow: 3, headerFilter: true },
            ],
        },
        {//группа нахождение
            title: "нахождение (exel)",
            columns: [
                { title: "СОНО", field: "sono2", widthGrow: 1, headerFilter: true },
                { title: "ТНО", field: "ifns2", widthGrow: 3, headerFilter: true },
            ],
        },
        // { title: "id_oper", field: "id_oper", width: 70, headerFilter: true },
        // { title: "id_p1", field: "id_connect_point1", width: 70, headerFilter: true },
        // { title: "id_p2", field: "id_connect_point2", width: 70, headerFilter: true },
        { title: "temp", field: "temp", width: 70, headerFilter: true },
        {//группа владелец
            title: "владелец (операции)",
            columns: [
                {
                    title: "СОНО", field: "ifns_sono1", widthGrow: 1, headerFilter: true,
                    formatter: function (cell, formatterParams) {
                        var d = cell.getRow().getData()
                        if (d.temp == 1) return d.ifns_sono1
                        return d.ifns_sono2
                    }
                },
                {
                    title: "ТНО", field: "t1name", widthGrow: 3, headerFilter: true,
                    formatter: function (cell, formatterParams) {
                        var d = cell.getRow().getData()
                        if (d.temp == 1) return d.t1name
                        return d.t2name
                    }
                },
            ],
        },
        {//группа нахождение
            title: "нахождение (операции)",
            columns: [
                { title: "СОНО", field: "ifns_sono2", widthGrow: 1, headerFilter: true },
                { title: "ТНО", field: "t2name", widthGrow: 3, headerFilter: true },
            ],
        },
        // { title: "предыд.нахождение", field: "ifns3", widthGrow: 2, headerFilter: true },
        { title: "тип", field: "type", widthGrow: 2, headerFilter: true },
        { title: "Модель", field: "model", widthGrow: 2, headerFilter: true },
        { title: "SN", field: "sn", widthGrow: 2, headerFilter: true },
        { title: "Инв №", field: "inv_n", widthGrow: 2, headerFilter: true },
        { title: "Версия", field: "ver", widthGrow: 2, headerFilter: true },
        { title: "Сертификат", field: "date_sert", widthGrow: 2, headerFilter: true },
        { title: "Статус", field: "status", widthGrow: 2, headerFilter: true },
        {
            title: "дата установки",
            field: "date1",
            width: 80,
            headerFilter: true,
            formatter: "datetime",
            formatterParams: {
                inputFormat: "YYYY-MM-DD",
                outputFormat: "DD.MM.YYYY",
            },
        },
        { title: "комментарий", field: "comm", widthGrow: 4, headerFilter: true, },
    ]

    const group = ''

    const salt = randomStr(10)

    const id_button_sel = 'sel' + salt
    const id_button_mod = 'mod' + salt
    const id_button_add = 'add' + salt
    const id_button_del = 'del' + salt
    const id_button_his = 'his' + salt
    const id_checkb_sht = 'sht' + salt
    const id_checkb_opr = 'opr' + salt

    const msgFooter =
        `<span id="select-stats"></span>` +
        `<div style="width: 100%; text-align: left;">` +
        `<button id='${id_button_sel}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Выбрать</button>` +
        `<button id='${id_button_mod}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Изменить</button>` +
        `<button id='${id_button_add}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Добавить</button>` +
        `<button id='${id_button_del}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Удалить</button>` +
        `<button id='${id_button_his}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>История</button>` +
        `&nbsp;&nbsp;&nbsp;результат операций&nbsp;<input type='checkbox' id='${id_checkb_opr}' unchecked style="vertical-align: middle;">` +
        `&nbsp;&nbsp;&nbsp;кратко&nbsp;<input type='checkbox' id='${id_checkb_sht}' unchecked style="vertical-align: middle;">` +
        `</div>`

    // `&nbsp;&nbsp;&nbsp;группировать по SN&nbsp;<input type='checkbox' id='${id_checkb_grp}' unchecked style="vertical-align: middle;">` +
    // `<button id='${id_button_cre}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Создать недостающие обращения</button>` +
    // `&nbsp;&nbsp;&nbsp;показать дубли&nbsp;<input type='checkbox' id='${id_checkb_flt}' unchecked style="vertical-align: middle;">` +
    //`&nbsp;&nbsp;&nbsp;дополнительные данные&nbsp;<input type='checkbox' id='${id_checkb_xls}' unchecked style="vertical-align: middle;">` +

    const tabulator = new Tabulator("#" + div, {
        ajaxURL: "myphp/get_all_dionis.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { s: sono, o: id_otdel, k: sklad, t: id_type_oper },
        height: tabHeight,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Dionis<h1>",
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
            if (id_dionis == 0) return
            tabulator.selectRow(id_dionis)
            tabulator.scrollToRow(id_dionis, "center", false)
        },

        rowFormatter: function (row) {
            let d = row.getData()
            if (d.sono1 != d.sono2) {
                // место приписки не совпадает с нахождением
                row.getCell("sono2").getElement().style.backgroundColor = '#ffcccc'
                row.getCell("ifns2").getElement().style.backgroundColor = '#ffcccc'
            }
            if (d.temp == 1) {
                row.getCell("ifns_sono2").getElement().style.backgroundColor = '#ffcccc'
                row.getCell("t2name").getElement().style.backgroundColor = '#ffcccc'
            }

            let sono1 = d.sono1
            let sono2 = d.sono2
            let sono3 = (d.temp == 1) ? d.ifns_sono1 : d.ifns_sono2
            // let sono3 = d.ifns_sono1
            let sono4 = d.ifns_sono2
            let id = d.id

            // if (id == 6194) {
                console.log(`id s1 s3 s2 s4:  ${id} -> ${sono1} = ${sono3}    ${sono2} = ${sono4}`)
            // }


            if (!!sono1 && !!sono2 && !!sono3 && !!sono4) {
                sono1 = sono1.toString().trim()
                sono2 = sono2.toString().trim()
                sono3 = sono3.toString().trim()
                sono4 = sono4.toString().trim()
                if (sono1 == sono3 && sono2 == sono4) {
                    row.getCell("type").getElement().style.backgroundColor = '#ccffcc'
                    row.getCell("model").getElement().style.backgroundColor = '#ccffcc'
                    row.getCell("sn").getElement().style.backgroundColor = '#ccffcc'
                    row.getCell("inv_n").getElement().style.backgroundColor = '#ccffcc'
                    row.getCell("ver").getElement().style.backgroundColor = '#ccffcc'
                    row.getCell("date_sert").getElement().style.backgroundColor = '#ccffcc'
                    row.getCell("status").getElement().style.backgroundColor = '#ccffcc'
                    row.getCell("date1").getElement().style.backgroundColor = '#ccffcc'
                    row.getCell("comm").getElement().style.backgroundColor = '#ccffcc'
                }
            }
        },

        rowSelectionChanged: function (data, rows) {
            if (data.length == 0) {
                id2e(id_button_mod).disabled = true
                id2e(id_button_del).disabled = true
                id2e(id_button_his).disabled = true
                id2e(id_button_sel).disabled = true
                id2e(id_button_add).disabled = !isRole("dionis") && !isRole("su")
            } else {
                id2e(id_button_mod).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_del).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_his).disabled = false
                id2e(id_button_sel).disabled = false
                id2e(id_button_add).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_mod).disabled = !isRole("dionis") && !isRole("su")
            }
        },

        cellDblClick: async function (e, cell) {
            if ((mode == "select")) {
                removeModalWindow(win_current, win_return)
                resolve(cell.getRow().getData())
            } else {
                const res = await edit_dionis(
                    tabulator.getSelectedData()[0],
                    (win_return = win_current)
                )
            }
        },

    })

    id2e(id_button_sel).onclick = () => {
        removeModalWindow(win_current, win_return)
        resolve(tabulator.getSelectedData()[0])
    }

    id2e(id_button_add).onclick = async () => {
        const d = factory_dionis()
        d.id = await save_dionis(d)

        addTabRow(tabulator, d, (top = true))

        const res = await edit_dionis(
            d,
            (win_return = win_current),
            (mode = "new")
        )
    }

    id2e(id_button_mod).onclick = async () => {
        const res = await edit_dionis(
            tabulator.getSelectedData()[0],
            (win_return = win_current),
            (mode = "mod")
        )
    }

    id2e(id_button_del).onclick = async () => {
        const ans = await dialogYESNO(
            (text = "Удалить Dionis"),
            (win_return = win_current)
        )

        if (ans == 'YES') {
            const data = tabulator.getSelectedData()
            data.forEach((d) => {
                del_dionis(d.id)
                tabulator.deleteRow(d.id)
            })
            const id_dionis = getFirstID(tabulator)
            tabulator.selectRow(id_dionis)
        }
    }

    id2e(id_button_his).onclick = () => {
        console.log('id_dionis1 = ', tabulator.getSelectedData()[0].id)
        select_dionis_oper(
            sono = '6100',
            id_otdel = 0,
            sklad = 0,
            selectable = 1,
            mode = 'select',
            win_return = null,
            id_oper = 0,
            id_dionis = tabulator.getSelectedData()[0].id
        )
        // show_dionis_history(
        //     tabulator.getSelectedData()[0].id,
        //     (win_return = win_current)
        // )
    }

    // id2e(id_checkb_flt).onclick = () => {
    //     console.log('id_checkb_flt')
    //     if (id2e(id_checkb_flt).checked) {
    //         tabulator.setFilter()
    //     } else {
    //         tabulator.setFilter("old", "=", 0)
    //     }        
    // }    

    // id2e(id_checkb_grp).onclick = () => {
    //     console.log('id_checkb_grp = ', id2e(id_checkb_grp).checked)
    //     if (id2e(id_checkb_grp).checked) {
    //         tabulator.setGroupBy('SN') 
    //     } else {
    //         tabulator.setGroupBy('')
    //     }
    // }    

    id2e(id_checkb_opr).onclick = () => {
        if (id2e(id_checkb_opr).checked) {
            tabulator.showColumn('temp')
            tabulator.showColumn('ifns_sono1')
            tabulator.showColumn('ifns_sono2')
            tabulator.showColumn('t1name')
            tabulator.showColumn('t2name')
            tabulator.redraw()
        } else {
            tabulator.hideColumn('temp')
            tabulator.hideColumn('ifns_sono1')
            tabulator.hideColumn('ifns_sono2')
            tabulator.hideColumn('t1name')
            tabulator.hideColumn('t2name')
            tabulator.redraw()
        }
    }

    id2e(id_checkb_sht).onclick = () => {
        if (id2e(id_checkb_sht).checked) {
            tabulator.hideColumn('type')
            tabulator.hideColumn('model')
            tabulator.hideColumn('ver')
            tabulator.hideColumn('date_sert')
            tabulator.hideColumn('date1')
            tabulator.hideColumn('comm')
            tabulator.redraw()
        } else {
            tabulator.showColumn('type')
            tabulator.showColumn('model')
            tabulator.showColumn('ver')
            tabulator.showColumn('date_sert')
            tabulator.showColumn('date1')
            tabulator.showColumn('comm')
            tabulator.redraw()
        }
    }

    tabulator.hideColumn('temp')
    tabulator.hideColumn('ifns_sono1')
    tabulator.hideColumn('ifns_sono2')
    tabulator.hideColumn('t1name')
    tabulator.hideColumn('t2name')

    tabulator.redraw()

    return tabulator
}


/////////////////////////////////////////////////////////////////////////////////////////
function edit_dionis(d, win_return = null, mode = "") {
    return new Promise(function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'editdionis' + salt

        const headerdionis = `<h4>параметры Dionis</h4>`

        const bodydionis = `
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
            <button id="btnEnterdionis"  class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить</button>
            <button id="btnCanceldionis" class="w3-btn w3-padding-small o3-border w3-hover-red">отменить</button>
            <button id="btnPrevdionis"   class="w3-btn w3-padding-small o3-border w3-hover-teal">предыдущий Dionis</button>
            <button id="btnNextdionis"   class="w3-btn w3-padding-small o3-border w3-hover-teal">следующий Dionis</button>
        </div>`

        // <tr>
        //   <td>
        //     <button id="selectdionisComp" class="w3-btn w3-padding-small o3-button w3-hover-teal">{{cname}}</button></button>
        //     <span v-show="shExl">id_comp: {{dv.id_comp}}</span>
        //   </td>
        //   <td></td>
        // </tr>


        const footdionis = ``

        const esc_dionis = mode == "new"
            ? () => {
                remove_selected_dionis()
                vapp.unmount()
            }
            : () => {
                console.log("esc_callback")
                vapp.unmount()
            }

        newModalWindow(
            win_current,
            headerdionis,
            bodydionis,
            footdionis,
            (width = "60%"),
            (marginLeft = "15%"),
            (marginTop = "5%"),
            win_return,
            esc_dionis
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
        // id2e("selectdionisUser").onclick = async () => {
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
        //         id2e("selectdionisUser").innerHTML = vm.$data.dv.uname
        //         id_2_set_focus(win_current)
        //     })
        // }
        // кнопка выбора отдела -----------------------------------------------------
        // id2e("selectdionisDepart").onclick = async () => {
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
        id2e("btnEnterdionis").onclick = () => {
            const d = vm.$data.dv
            vapp.unmount()
            save_dionis(d)
            removeModalWindow(win_current, win_return)
            table_select_dionis.updateRow(d.id, d)
            table_select_dionis.redraw()
            resolve("OK")
        }
        // кнопка отмены изменений --------------------------------------------------
        id2e("btnCanceldionis").onclick = () => {
            vapp.unmount()
            if (mode == "new") remove_selected_dionis()
            removeModalWindow(win_current, win_return)
            resolve("CANCEL")
        }
        // кнопка сохранения без выхода ---------------------------------------------
        // id2e("btnApplaydionis").onclick = () => {
        //     const d = vm.$data.dv
        //     save_dionis(d)
        //     table_select_dionis.updateRow(d.id, d)
        //     table_select_dionis.redraw()
        // }
        // кнопка перехода на предыдущее Dionis ----------------------------------------
        id2e("btnPrevdionis").onclick = () => {
            const d = vm.$data.dv
            save_dionis(d)
            table_select_dionis.updateRow(d.id, d)
            table_select_dionis.redraw()
            // if (vm.$data.chg) {
            //     dialogYESNO('Данные были изменены<br>сохранить изменения')
            //         .then(ans => {
            //             if (ans == "YES") {
            //                 const d = vm.$data.dv
            //                 save_dionis(d)
            //                 table_select_dionis.updateRow(d.id, d)
            //                 table_select_dionis.redraw()
            //             } else {
            //                 return
            //             }
            //         })
            // }
            const selected_row = table_select_dionis.getSelectedRows()[0]
            const id_curr = selected_row.id
            const id_prev = selected_row.getPrevRow().getData().id
            table_select_dionis.deselectRow(id_curr)
            table_select_dionis.selectRow(id_prev)
            table_select_dionis.scrollToRow(id_prev, "center", false)
            const d_prev = table_select_dionis.getSelectedData()[0]
            vm.$data.dv = d_prev
            vm.$data.chg = false
        }
        // кнопка перехода на следующее Dionis -----------------------------------------
        id2e("btnNextdionis").onclick = () => {
            const d = vm.$data.dv
            save_dionis(d)
            table_select_dionis.updateRow(d.id, d)
            table_select_dionis.redraw()
            // if (vm.$data.chg) {
            //     dialogYESNO('Данные были изменены<br>сохранить изменения')
            //         .then(ans => {
            //             if (ans == "YES") {
            //                 const d = vm.$data.dv
            //                 save_dionis(d)
            //                 table_select_dionis.updateRow(d.id, d)
            //                 table_select_dionis.redraw()
            //             } else {
            //                 return
            //             }
            //         })
            // }
            const selected_row = table_select_dionis.getSelectedRows()[0]
            const id_curr = selected_row.id
            const id_next = selected_row.getNextRow().getData().id
            table_select_dionis.deselectRow(id_curr)
            table_select_dionis.selectRow(id_next)
            table_select_dionis.scrollToRow(id_next, "center", false)
            const d_next = table_select_dionis.getSelectedData()[0]
            vm.$data.dv = d_next
            vm.$data.chg = false
        }
    })
}

/////////////////////////////////////////////////////////////////////////////////////////
async function show_dionis_history(id_dionis, win_return = null) {
    const data_dionis = await id_2_data(id_dionis, 'dionis')
    const win_current = 'historydionis' + randomStr(10)
    const header = `<h4>история Dionis id: ${data_dionis.id}, SN: ${data_dionis.SN}</h4>`
    const body = `<div class="w3-container"></div>`
    const foot = ``

    const esc_dionis_history = () => {
        console.log("esc_callback")
    }

    newModalWindow(
        win_current, header, body, foot,
        width = "59%", marginLeft = "40%", marginTop = "1%",
        win_return, esc_dionis_history
    )

    const table_histoty = new Tabulator('#' + win_current + 'Body', {
        ajaxURL: "myphp/get_dionis_history.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { i: data_dionis.id },
        height: appBodyHeight() - 100,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>история Dionis<h1>",
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
            { title: 'ответственный', field: 'user_dionis_name', widthGrow: 4, headerFilter: true },
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
function remove_selected_dionis() {
    let id_dionis = table_select_dionis.getSelectedData()[0].id
    del_dionis(id_dionis)
    table_select_dionis.deleteRow(id_dionis)
    id_dionis = getFirstID(table_select_dionis)
    table_select_dionis.selectRow(id_dionis)
}

/////////////////////////////////////////////////////////////////////////////////////////
async function new_dionis() {
    const id = await runSQL_p("INSERT INTO dionis () VALUES ()")
    return id
}

/////////////////////////////////////////////////////////////////////////////////////////
async function save_dionis(d) {
    const sql =
        d.id == 0
            ? `INSERT INTO dionis ( 
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
            : `UPDATE dionis SET 
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
function del_dionis(id) {
    runSQL_p(`DELETE FROM dionis WHERE id=${id}`)
    runSQL_p(`DELETE FROM dionis_oper WHERE id_dionis=${id}`)
}

/////////////////////////////////////////////////////////////////////////////////////////
function factory_dionis() {
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
























// function filterSelect(data, filterParams) {
//     let id = data.id
//     let row = table_select_dionis.searchRows("id", "=", data.id)[0]
//     return row.isSelected()
// }
