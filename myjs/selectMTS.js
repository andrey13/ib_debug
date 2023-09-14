//=======================================================================================
// модальное окно выбора МТС
//=======================================================================================
function select_mts(
    sono = "6100",
    id_otdel = 0,
    sklad = 0,
    selectable = 1,
    mode = "select",
    win_return = null,
    id_mts = 0
) {
    return new Promise(function (resolve, reject) {
        const win_current = "selectMTS" /////////////////////////////

        // console.log("selectMTS ==================== ")
        // console.log("win_current = ", win_current)
        // console.log("win_return = ", win_return)

        if (mode == "select") {
            const formSelectMTS = `<div class="w3-container"></div>`

            newModalWindow(
                (modal = win_current),
                (html_header = ""),
                (html_body = formSelectMTS),
                (html_footer = ""),
                (width = "90%"),
                (marginLeft = "5%"),
                (marginTop = "3%"),
                win_return
            )
        }

        let msgFooter =
            `<span id="select-stats"></span>` +
            `<div style="width: 100%; text-align: left;">` +
            `<button id='btnSelMTSVocab' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Выбрать</button>` +
            `<button id='btnModMTSVocab' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Изменить</button>` +
            `<button id='btnAddMTSVocab' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Добавить</button>` +
            `<button id='btnDelMTSVocab' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Удалить</button>` +
            `<button id='btnHisMTSVocab' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>История</button>` +
            `</div>`

        appHeight = appBodyHeight() * 0.9

        tabulator_select_mts(
            (div = "selectMTSBody"),
            sono,
            appHeight,
            msgFooter,
            resolve,
            reject,
            id_otdel,
            sklad,
            selectable,
            mode,
            win_current,
            win_return,
            id_mts
        )

        if (mode == "select") id_2_set_focus("selectMTS")
    })
}

//=======================================================================================
// табулятор справочника МТС
//=======================================================================================
function tabulator_select_mts(
    div,
    sono,
    appH,
    msgF,
    resolve,
    reject,
    id_otdel = 0,
    sklad = 0,
    selectable = 1,
    mode = "select",
    win_current = null,
    win_return = null,
    id_mts = 0
) {
    console.log('id_mts = ', id_mts)

    let cols = []

    const cols1 = [
        {
            title: "СОНО",
            field: "sono",
            widthGrow: 1,
            headerFilter: true,
            topCalc: "count",
        },
    ]

    const cols2 = [
        { title: "id", field: "id", widthGrow: 1, headerFilter: true },
        { title: "SN", field: "SN", widthGrow: 6, headerFilter: true, topCalc: "count" },
        {
            title: "ДСП", field: "dsp", widthGrow: 2, headerFilter: true, formatter: "lookup",
            formatterParams: { 0: "", 1: "дсп" },
        },
        {
            title: "", field: "bad", headerFilter: true, width: 20, formatter: "lookup",
            formatterParams: { 0: "", 1: "<i class='fa fa-times'></i>" },
        },
        { title: "Гб", field: "size_gb", widthGrow: 1, headerFilter: true, editor: "input", },
        { title: "Производитель", field: "manufacturer", widthGrow: 4, headerFilter: true, },
        { title: "описание", field: "descr", widthGrow: 6, headerFilter: true },
        { title: "комментарий", field: "comment", widthGrow: 6, headerFilter: true, },
        {
            title: "склад", field: "sklad", formatter: "lookup",
            formatterParams: { 0: "   ", 1: "на складе", 2: "выдано" },
            widthGrow: 2,
            headerFilter: true
        },
        {
            title: "ЕСК", field: "user_esk_status", formatter: "lookup",
            formatterParams: { 0: "?", 1: "отключен", 2: "Активен" },
            widthGrow: 2,
            headerFilter: true,
        },
        { title: "пользователь", field: "uname", widthGrow: 6, headerFilter: true, },

        { title: "№О", field: "id_otdel", widthGrow: 1, headerFilter: true },
        { title: "отдел", field: "dname", widthGrow: 4, headerFilter: true },
    ]

    cols = cols1.concat(cols2)

    table_select_mts = new Tabulator("#" + div, {
        ajaxURL: "myphp/get_all_mts.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { s: sono, o: id_otdel, k: sklad },
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Компьютеры<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: selectable,
        selectableRangeMode: "click",
        reactiveData: true,
        columns: cols2,

        dataLoaded: function () {
            if (id_mts == 0) return
            table_select_mts.selectRow(id_mts)
            table_select_mts.scrollToRow(id_mts, "center", false)
        },

        rowFormatter: function (row) {
            if (row.getData().user_esk_status == 1) {
                row.getCell("user_esk_status").getElement().style.backgroundColor = '#ff7575'
                row.getCell("uname").getElement().style.backgroundColor = '#ff7575'
            }
            if (row.getData().bad == 1) {
                row.getCell("bad").getElement().style.backgroundColor = '#ff0000'
            }
            if (row.getData().dsp == 1) {
                row.getCell("dsp").getElement().style.backgroundColor = '#8888ff'
            }
        },

        rowSelectionChanged: function (data, rows) {
            if (data.length == 0) {
                id2e("btnDelMTSVocab").disabled = true
                id2e("btnAddMTSVocab").disabled = isRole("tex")
                id2e("btnModMTSVocab").disabled = true
                id2e("btnSelMTSVocab").disabled = true
                id2e("btnHisMTSVocab").disabled = true
            } else {
                id2e("btnDelMTSVocab").disabled = isRole("tex")
                id2e("btnAddMTSVocab").disabled = isRole("tex")
                id2e("btnModMTSVocab").disabled = isRole("tex")
                if (mode == "select") id2e("btnSelMTSVocab").disabled = false
                id2e("btnHisMTSVocab").disabled = false
            }
        },

        cellDblClick: async function (e, cell) {
            if ((mode == "select")) {
                removeModalWindow(win_current, win_return)
                resolve(cell.getRow().getData())
            } else {
                const res = await edit_mts_vocab(
                    table_select_mts.getSelectedData()[0],
                    (win_return = win_current)
                )
            }
        },

        footerElement: msgF,
    })

    id2e("btnSelMTSVocab").onclick = () => {
        removeModalWindow(win_current, win_return)
        resolve(table_select_mts.getSelectedData()[0])
    }

    id2e("btnAddMTSVocab").onclick = async () => {
        const d = factory_MTS()
        d.id = await save_mts(d)

        addTabRow(table_select_mts, d, (top = true))

        const res = await edit_mts_vocab(
            d,
            (win_return = win_current),
            (mode = "new")
        )

        console.log("res = ", res)
    }

    id2e("btnModMTSVocab").onclick = async () => {
        const res = await edit_mts_vocab(
            table_select_mts.getSelectedData()[0],
            (win_return = win_current),
            (mode = "mod")
        )
    }

    id2e("btnDelMTSVocab").onclick = async () => {
        const ans = await dialogYESNO(
            (text = "Удалить МТС"),
            (win_return = win_current)
        )

        if (ans == 'YES') {
            const data = table_select_mts.getSelectedData()
            data.forEach((d) => {
                del_mts_vocab(d.id)
                table_select_mts.deleteRow(d.id)
            })
            const id_mts = getFirstID(table_select_mts)
            table_select_mts.selectRow(id_mts)
            // const d = table_select_mts.getSelectedData()
            // id2e("delZayavki").disabled = d.length == 0
            // id2e("modZayavki").disabled = d.length == 0
        }
    }

    id2e("btnHisMTSVocab").onclick = () => {
        show_mts_history(
            table_select_mts.getSelectedData()[0],
            (win_return = win_current)
        )
    }

    //-----------------------------------------------------------------------------------
    function show_mts_history(d, win_return = null) {

        const win_current = "historyMTS" ///////////////////////////////////////////
        const header = ''
        const body = ''
        const foot = ``

        const esc_mts_history = () => { 
            console.log("esc_callback") 
            // vapp.unmount()
        }

        newModalWindow(
            win_current,
            header,
            body,
            foot,
            (width = "90%"),
            (marginLeft = "5%"),
            (marginTop = "5%"),
            win_return,
            esc_mts_history
        )

        id_2_set_focus(win_current)
    }

    //-----------------------------------------------------------------------------------
    function edit_mts_vocab(d, win_return = null, mode = "") {
        return new Promise(function (resolve, reject) {

            const win_current = "editMTSVocab" ///////////////////////////////////////////

            const headerMTSVocab = `<h4>параметры МТС</h4>`

            const bodyMTSVocab = `<div id="modMTSVocab" style="margin: 0; padding: 1%;">

                <table class="w3-table-all">
                    <tr>
                      <td>id:{{dv.id}} id_zayavka:{{dv.id_zayavka}} id_oper:{{dv.id_oper}} id_status:{{dv.id_status}} status:{{dv.status}}</td>
                      <td></td>
                    </tr>

                    <!--
                    <tr>
                      <td>
                      <v-switch
                          v-model="dv.dsp"
                          color="blue"
                          hide-details
                          true-value="1"
                          false-value="0"
                          label="ДСП"
                        ></v-switch>
                      </td>
                      <td>
                        <v-switch 
                          v-model="dv.bad"
                          color="red"
                          hide-details
                          true-value="1"
                          false-value="0"
                          label="неисправно"
                        ></v-switch>
                      </td>
                    </tr>
                    -->

                    <tr>
                      <td>
                        ДСП
                        <n-switch  :rail-style="style_dsp"
                          size="small"
                          checked-value="1"
                          unchecked-value="0"
                          v-model:value="dv.dsp"
                        />                        
                      </td>
                      <td>
                        {{ (dv.bad == "0") ? "исправно" : "неисправно" }}
                        <n-switch :rail-style="style_bad"
                          size="small"                          
                          checked-value="1"
                          unchecked-value="0"
                          v-model:value="dv.bad"
                        />                        
                      </td>
                    </tr>

                    <tr>
                      <td>SN: <input class="o3-border" type="text" id="MTS_SN1" v-model="dv.SN" style="width: 300px;"></td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>
                      <span style="display: flex; align-items: center;">
                        <input type="radio" id="sklad-0" name="skaldSatus" value="0" v-model="dv.sklad">-неизвестно&nbsp;&nbsp;
                        <input type="radio" id="sklad-1" name="skaldSatus" value="1" v-model="dv.sklad">-склад&nbsp;&nbsp;
                        <input type="radio" id="sklad-2" name="skaldSatus" value="2" v-model="dv.sklad">-выдано&nbsp;&nbsp;
                      </span>
                      </td>
                      <td>{{dv.status1}}</td>
                    </tr>

                    <tr>
                      <td>
                        <button id="selectMtsUser" class="w3-btn w3-padding-small o3-button w3-hover-teal">{{uname}}</button>
                        id_user: {{dv.id_user}}
                      </td>
                      <td>{{dv.user}}</td>
                    </tr>

                    <tr>
                      <td>
                        <button id="selectMtsComp" class="w3-btn w3-padding-small o3-button w3-hover-teal">{{cname}}</button></button>
                        id_comp: {{dv.id_comp}}
                      </td>
                      <td></td>
                    </tr>

                    <tr>
                      <td>
                        <button id="selectMtsDepart" class="w3-btn w3-padding-small o3-button w3-hover-teal">{{dname}}</button>
                        id_depart: {{dv.id_depart}}
                      </td>
                      <td>{{dv.otdel}}</td>
                    </tr>

                    <tr>
                      <td>объем:<input class="o3-border" type="number" v-model="dv.size_gb" style="width: 100px;"></td>
                      <td>{{dv.size}}</td>
                    </tr>

                    <tr>
                      <td>
                        производитель: <input class="o3-border" type="text" v-model="dv.manufacturer">
                        модель: <input class="o3-border" type="text" v-model="dv.product_model">
                        ревизия: <input class="o3-border" type="text" v-model="dv.revision">
                      </td>
                      <td>
                        ЕКО: <input class="o3-border" type="text" v-model="dv.eko">
                      </td>
                    </tr>

                    </table>                      

                Описание: <br>
                <textarea rows="3" style="width:100%" v-model="dv.descr"></textarea>
                <br>

                Комментарии:<br>
                <textarea rows="3" style="width:100%" v-model="dv.comment"></textarea>
                <br>

                date2: ${d.date2}<br>
                date: ${d.date}<br>
                <br>
                <button id="btnEnterMTSVocab"  class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить</button>
                <button id="btnCancelMTSVocab" class="w3-btn w3-padding-small o3-border w3-hover-red">отменить</button>
                <button id="btnApplayMTSVocab" class="w3-btn w3-padding-small o3-border w3-hover-teal">применить</button>
                <button id="btnPrevMTSVocab"   class="w3-btn w3-padding-small o3-border w3-hover-teal">предыдущее МТС</button>
                <button id="btnNextMTSVocab"   class="w3-btn w3-padding-small o3-border w3-hover-teal">следующее МТС</button>
            </div>`

            const footMTSVocab = ``

            const esc_mts_vocab = mode == "new"
                ? () => { 
                    remove_selected_mts_vocab() 
                    vapp.unmount()
                }
                : () => { 
                    console.log("esc_callback") 
                    vapp.unmount()
                }

            newModalWindow(
                win_current,
                headerMTSVocab,
                bodyMTSVocab,
                footMTSVocab,
                (width = "60%"),
                (marginLeft = "5%"),
                (marginTop = "5%"),
                win_return,
                esc_mts_vocab
            )

            const vapp = Vue.createApp({
                data() {
                    return {
                        dv: d,
                        chg: false,
                        dsp: d.dsp,
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
                        }
                    }
                },
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
                    // dsp() {
                    //     if (!!!this.dsp) return ""
                    //     return this.dv.dsp == "1" ? "дсп" : ""
                    // },
                },
                watch: {
                    dv: {
                        handler(newValue, oldValue) {
                            this.chg = true
                        },
                        deep: true,
                    },
                },

            })

            // const vuetify = Vuetify.createVuetify()

            // console.log('vuetify = ', vuetify)

            // const vm = vapp.use(vuetify).mount("#modMTSVocab")
            const vm = vapp.use(naive).mount("#modMTSVocab")

            // кнопка выбора пользователя -----------------------------------------------
            id2e("selectMtsUser").onclick = async () => {
                const id_depart = isRole("tex") ? g_user.id_depart : 0

                const selectedUsers = await selectUser(
                    "6100",
                    "",
                    id_depart,
                    1,
                    (header = "Выбор ответственного лица"),
                    (width = "40%"),
                    (marginLeft = "30%"),
                    (marginTop = "5%"),
                    win_current,
                    vm.$data.dv.id_user
                )

                selectedUsers.forEach(async (u) => {
                    vm.$data.dv.id_user = u.id
                    vm.$data.dv.uname = u.name
                    vm.$data.dv.user_esk_status = u.esk_status

                    if (u.esk_status == 2) {
                        console.log('u.esk_status == 2')
                        vm.$data.dv.id_depart = u.id_depart
                        const depart_data = await id_depart_2_data(u.id_depart)
                        vm.$data.dv.id_otdel = depart_data.id_otdel
                        vm.$data.dv.dname = depart_data.name
                    } else {
                        console.log('u.esk_status != 2')
                        vm.$data.dv.id_depart = 0
                        vm.$data.dv.dname = 'отключен'
                    }

                    id2e("selectMtsUser").innerHTML = vm.$data.dv.uname
                    id_2_set_focus(win_current)
                })
            }

            // кнопка выбора отдела -----------------------------------------------------
            id2e("selectMtsDepart").onclick = async () => {
                const dep = await selectVocab(
                    (table = "depart"),
                    (sort = "id_otdel"),
                    (ok = -1),
                    (tite = "отдел"),
                    (allow = ""),
                    (width = "60%"),
                    (marginLeft = "20%"),
                    (marginTop = "5%"),
                    win_current,
                    sono = g_user.sono
                )

                console.log('dep = ', dep)

                vm.$data.dv.id_depart = dep.id
                vm.$data.dv.id_otdel = dep.id_otdel
                vm.$data.dv.dname = (await id_depart_2_data(dep.id)).name

                id_2_set_focus(win_current)
            }

            id_2_set_focus(win_current)

            // кнопка сохраниния и выхода -----------------------------------------------
            id2e("btnEnterMTSVocab").onclick = () => {
                const d = vm.$data.dv
                vapp.unmount()
                save_mts(d)
                removeModalWindow(win_current, win_return)
                table_select_mts.updateRow(d.id, d)
                table_select_mts.redraw()
                resolve("OK")
            }

            // кнопка отмены изменений --------------------------------------------------
            id2e("btnCancelMTSVocab").onclick = () => {
                vapp.unmount()
                if (mode == "new") remove_selected_mts_vocab()
                removeModalWindow(win_current, win_return)
                resolve("CANCEL")
            }

            // кнопка сохраниния без выхода ---------------------------------------------
            id2e("btnApplayMTSVocab").onclick = () => {
                const d = vm.$data.dv
                save_mts(d)
                table_select_mts.updateRow(d.id, d)
                table_select_mts.redraw()
            }

            // кнопка перехода на предыдущее МТС ----------------------------------------
            id2e("btnPrevMTSVocab").onclick = () => {
                const d = vm.$data.dv
                save_mts(d)
                table_select_mts.updateRow(d.id, d)
                table_select_mts.redraw()
                // if (vm.$data.chg) {
                //     dialogYESNO('Данные были изменены<br>сохранить изменения')
                //         .then(ans => {
                //             if (ans == "YES") {
                //                 const d = vm.$data.dv
                //                 save_mts(d)
                //                 table_select_mts.updateRow(d.id, d)
                //                 table_select_mts.redraw()
                //             } else {
                //                 return
                //             }
                //         })
                // }
                const selected_row = table_select_mts.getSelectedRows()[0]
                const id_curr = selected_row.id
                const id_prev = selected_row.getPrevRow().getData().id
                table_select_mts.deselectRow(id_curr)
                table_select_mts.selectRow(id_prev)
                table_select_mts.scrollToRow(id_prev, "center", false)
                const d_prev = table_select_mts.getSelectedData()[0]
                vm.$data.dv = d_prev
                vm.$data.chg = false
            }

            // кнопка перехода на следующее МТС -----------------------------------------
            id2e("btnNextMTSVocab").onclick = () => {
                const d = vm.$data.dv
                save_mts(d)
                table_select_mts.updateRow(d.id, d)
                table_select_mts.redraw()
                // if (vm.$data.chg) {
                //     dialogYESNO('Данные были изменены<br>сохранить изменения')
                //         .then(ans => {
                //             if (ans == "YES") {
                //                 const d = vm.$data.dv
                //                 save_mts(d)
                //                 table_select_mts.updateRow(d.id, d)
                //                 table_select_mts.redraw()
                //             } else {
                //                 return
                //             }
                //         })
                // }
                const selected_row = table_select_mts.getSelectedRows()[0]
                const id_curr = selected_row.id
                const id_next = selected_row.getNextRow().getData().id
                table_select_mts.deselectRow(id_curr)
                table_select_mts.selectRow(id_next)
                table_select_mts.scrollToRow(id_next, "center", false)
                const d_next = table_select_mts.getSelectedData()[0]
                vm.$data.dv = d_next
                vm.$data.chg = false
            }
        })
    }
}

/////////////////////////////////////////////////////////////////////////////////////////
function remove_selected_mts_vocab() {
    let id_mts = table_select_mts.getSelectedData()[0].id
    del_mts_vocab(id_mts)
    table_select_mts.deleteRow(id_mts)
    id_mts = getFirstID(table_select_mts)
    table_select_mts.selectRow(id_mts)
}

/////////////////////////////////////////////////////////////////////////////////////////
async function new_mts() {
    const id = await runSQL_p("INSERT INTO mts () VALUES ()")
    return id
}

/////////////////////////////////////////////////////////////////////////////////////////
async function save_mts(d) {
    const sql =
        d.id == 0
            ? `INSERT INTO mts ( 
            SN, 
            id_user,
            id_comp,
            id_otdel,
            id_depart,
            id_status,
            id_oper,
            id_zayavka,
            id_vendor,
            size_gb,
            dsp,
            sono,
            sklad,
            descr,
            comment,
            status,
            manufacturer,
            product_model,
            revision,
            usb_device_id,
            eko,
            bad
        ) VALUES (
           "${d.SN}", 
            ${nn(d.id_user)},
            ${nn(d.id_comp)},
            ${nn(d.id_otdel)},
            ${nn(d.id_depart)},
            ${nn(d.id_status)},
            ${nn(d.id_oper)},
            ${nn(d.id_zayavka)},
            ${nn(d.id_vendor)},
            ${nn(d.size_gb)},
            ${nn(d.dsp)},
           '${d.sono}',
            ${nn(d.sklad)},
           '${d.descr}',
           '${d.comment}',
           '${d.status}',
           '${d.manufacturer}',
           '${d.product_model}',
           '${d.revision}',
           '${d.usb_device_id}',
           '${d.eko}',
            ${d.bad}
        )`
            : `UPDATE mts SET 
            SN="${d.SN}", 
            id_user=${nn(d.id_user)},
            id_comp=${nn(d.id_comp)},
            id_otdel=${nn(d.id_otdel)},
            id_depart=${nn(d.id_depart)},
            id_status=${nn(d.id_status)},
            id_oper=${nn(d.id_oper)},
            id_zayavka=${nn(d.id_zayavka)},
            id_vendor=${nn(d.id_vendor)},
            size_gb=${nn(d.size_gb)},
            dsp=${nn(d.dsp)},
            sono='${d.sono}',
            sklad=${nn(d.sklad)},
            descr='${d.descr}',
            comment='${d.comment}',
            status='${d.status}',
            manufacturer='${d.manufacturer}',
            product_model='${d.product_model}',
            revision='${d.revision}',
            usb_device_id='${d.usb_device_id}',
            eko='${d.eko}',
            bad=${d.bad}
        WHERE id=${d.id}`

    return runSQL_p(sql)
}

function nn(n) {
    return !!!n ? 0 : n
}

//=======================================================================================
// удаление MTS
//=======================================================================================
function del_mts_vocab(id) {
    runSQL_p(`DELETE FROM mts WHERE id=${id}`)
    runSQL_p(`DELETE FROM mts2comp WHERE id_mts=${id}`)
}

//=======================================================================================
// фабрика МТС
//=======================================================================================
function factory_MTS() {
    return {
        id: 0,
        SN: '',
        id_user: 0,
        id_comp: 0,
        id_otdel: 0,
        id_depart: 0,
        id_status: 0,
        id_oper: 0,
        id_zayavka: 0,
        id_vendor: 0,
        date_status: '',
        otdel: '',
        sono: '',
        eko: '',
        date2: '',
        date: '',
        user: '',
        manufacturer: '',
        product_model: '',
        revision: '',
        size: '',
        usb_device_id: '',
        descr: '',
        sklad: 0,
        status1: '',
        comment: '',
        dsp: '',
        size_gb: 0,
        status: '',
        bad: 0
    }
}

// function filterSelect(data, filterParams) {
//     let id = data.id
//     let row = table_select_mts.searchRows("id", "=", data.id)[0]
//     return row.isSelected()
// }
