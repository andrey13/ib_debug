//=============================================================================
function select_dionis_oper(
    sono = '6100',
    id_otdel = 0,
    sklad = 0,
    selectable = 1,
    mode = 'select',
    win_return = null,
    id_oper = 0,
    id_dionis = 0,
    id_torm = 0,
    title = ''
) {

    return new Promise(function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'selectOper' + salt
        const header = `<h4>операции Dionis: ${title}</h4>`

        if (mode == 'select') {
            newModalWindow(
                win_current, // modal
                header, // html_header
                '', // html_body
                '', // html_footer
                '90%', // width
                '5%', // marginLeft
                '3%', // marginTop
                win_return // win_return
            )
        }

        const appHeight = appBodyHeight()

        // console.log('id_dionis3 = ', id_dionis)

        table_dionis_opers = tabulator_dionis_opers(
            (mode == 'select') ? win_current + 'Body' : 'appBody', // div
            sono,
            (mode == 'select') ? appHeight * 0.9 : appHeight, // tabHeight
            resolve,
            reject,
            id_otdel,
            sklad,
            selectable,
            mode,
            win_current,
            win_return,
            id_oper,
            id_dionis,
            id_torm,
            title
        )

        // table_opers.setSort([
        //     {column: "z_date", dir: "dscr"}
        // ])

        if (mode == "select") id_2_set_focus(win_current)
    })
}
//=============================================================================
function tabulator_dionis_opers(
    div,
    sono,
    tabHeight,
    resolve,
    reject,
    id_otdel = 0,
    sklad = 0,
    selectable = true,
    mode = "select",
    win_current = null,
    win_return = null,
    id_oper = 0,
    id_dionis = 0,
    id_torm = 0,
    title = ''
) {
    const salt = randomStr(10)

    const id_button_sel = 'sel' + salt
    const id_button_mod = 'mod' + salt
    const id_button_add = 'add' + salt
    const id_button_del = 'del' + salt
    const id_button_pr1 = 'pr1' + salt
    const id_button_pr2 = 'pr2' + salt

    const msgFooter =
        `<span id="select-stats"></span>` +
        `<div style="width: 100%; text-align: left;">` +
        `<button id='${id_button_sel}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Выбрать</button>` +
        `<button id='${id_button_mod}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Изменить</button>` +
        `<button id='${id_button_add}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Добавить</button>` +
        `<button id='${id_button_del}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Удалить</button>` +
        `<button id='${id_button_pr1}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Печать журнала СКЗИ органа КЗ</button>` +
        `<button id='${id_button_pr2}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Печать журнала СКЗИ обладателя КИ</button>` +
        `</div>`

    const tabulator = new Tabulator("#" + div, {
        ajaxURL: "myphp/get_dioins_opers.php",
        ajaxParams: { d: id_dionis, t: id_torm },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: tabHeight,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Операции Dionis<h1>" + title,
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: selectable,
        selectableRangeMode: "click",
        reactiveData: true,
        footerElement: msgFooter,

        columns: [
            // { title: 'id', field: 'id', width: 60, headerFilter: true },
            {
                title: "дата-время",
                field: "date_time",
                width: 120,
                headerFilter: true,
                formatter: "datetime",
                formatterParams: {
                    inputFormat: "YYYY-MM-DD HH:ss",
                    outputFormat: "DD.MM.YYYY HH:ss",
                },
                topCalc: "count"
            },
            {
                title: 'СКЗИ', headerHozAlign: "center",
                columns: [
                    { title: 'инв №', field: 'inv_n', width: 100, headerFilter: true },
                    { title: 'SN', field: 'sn', width: 100, headerFilter: true },
                    { title: 'модель', field: 'model', width: 150, headerFilter: true },
                    { title: 'тип', field: 'model_type', width: 100, headerFilter: true },
                    { title: 'версия', field: 'ver', width: 100, headerFilter: true },
                    { title: 'поставка', field: 'gk_name', width: 90, headerFilter: true },
                ]
            },
            { title: 'операция', field: 'oper_type', width: 140, headerFilter: true, headerHozAlign: "center" },
            {
                title: 'ИСТОЧНИК', headerHozAlign: "center",
                columns: [
                    { title: 'СОНО', field: 'ifns_sono1', width: 62, headerFilter: true },
                    { title: 'СОУН', field: 'torm_sono1', width: 62, headerFilter: true },
                    { title: '', field: 'ip1', widthGrow: 2, headerFilter: true },
                ]
            },
            {
                title: 'ПРИЕМНИК', headerHozAlign: "center",
                columns: [
                    { title: 'СОНО', field: 'ifns_sono2', width: 62, headerFilter: true },
                    { title: 'СОУН', field: 'torm_sono2', width: 62, headerFilter: true },
                    { title: '', field: 'ip2', widthGrow: 2, headerFilter: true },
                ]
            },
            // { title: 'временно', field: 'temp', width: 90, headerFilter: true },
            {
                title: 'УФНС', field: 'user_ufns', width: 90, headerFilter: true, headerHozAlign: "center",
                formatter: function (cell, formatterParams) {
                    const d = cell.getData()
                    return fio2fio0(d.user_ufns)
                }
            },
            // { title: 'id', field: 'id_user_tno', width: 80, headerFilter: true, },
            {
                title: 'ТНО', field: 'user_tno', width: 90, headerFilter: true, headerHozAlign: "center",
                formatter: function (cell, formatterParams) {
                    const d = cell.getData()
                    return fio2fio0(d.user_tno)
                }
            },
            {
                title: 'ФКУ', field: 'user_fku', width: 90, headerFilter: true, headerHozAlign: "center",
                formatter: function (cell, formatterParams) {
                    const d = cell.getData()
                    return fio2fio0(d.user_fku)
                }
            },
            // { title: 'описание', field: 'dscr', widthGrow: 2, headerFilter: true },
            { title: 'комментарий', field: 'comm', widthGrow: 2, headerFilter: true },
        ],

        cellEdited: function (cell) {
            let d = cell.getRow().getData()
            runSQL_p(`UPDATE dionis_oper SET nn=${d.nn} WHERE id=${d.id}`)
            id_2_set_focus(win_current)
        },

        dataLoaded: function () {
            if (id_oper == 0) return
            tabulator.selectRow(id_oper)
            tabulator.scrollToRow(id_oper, "center", false)
        },

        rowFormatter: function (row) {
            let d = row.getData()

            // поставка оборудования -----------------------------------------------
            if (d.stock1 == 3) {
                row.getCell("ip1").getElement().style.backgroundColor = '#ccccff'
                row.getCell("ip1").getElement().style.color = '#000000'
                row.getCell("oper_type").getElement().style.backgroundColor = '#ccccff'
                row.getCell("oper_type").getElement().style.color = '#000000'
            }

            // передача оборудования -----------------------------------------------
            if (d.stock1 == 1 && d.stock2 == 1) {
                row.getCell("oper_type").getElement().style.backgroundColor = '#ffccff'
                row.getCell("oper_type").getElement().style.color = '#000000'
                row.getCell("ip1").getElement().style.backgroundColor = '#ffccff'
                row.getCell("ip1").getElement().style.color = '#000000'
                row.getCell("ip2").getElement().style.backgroundColor = '#ffccff'
                row.getCell("ip2").getElement().style.color = '#000000'
                row.getCell("ifns_sono2").getElement().style.backgroundColor = '#ffccff'
                row.getCell("ifns_sono2").getElement().style.color = '#000000'
                row.getCell("torm_sono2").getElement().style.backgroundColor = '#ffccff'
                row.getCell("torm_sono2").getElement().style.color = '#000000'
            }

            // подключение к точке доступа -----------------------------------------
            if (d.stock2 == 0) {
                row.getCell("oper_type").getElement().style.backgroundColor = '#ccffcc'
                row.getCell("oper_type").getElement().style.color = '#000000'
                row.getCell("ip2").getElement().style.backgroundColor = '#ccffcc'
                row.getCell("ip2").getElement().style.color = '#000000'
            }

            // отключение от точки доступа -----------------------------------------
            if (d.stock1 == 0) {
                row.getCell("oper_type").getElement().style.backgroundColor = '#ffcccc'
                row.getCell("oper_type").getElement().style.color = '#000000'
                row.getCell("ip1").getElement().style.backgroundColor = '#ffcccc'
                row.getCell("ip1").getElement().style.color = '#000000'
            }
            // неисправность -------------------------------------------------------
            if (d.id_oper_type == 46) {
                row.getCell("oper_type").getElement().style.backgroundColor = '#ff0000'
                row.getCell("oper_type").getElement().style.color = '#ffff00'
            }
        },

        rowSelectionChanged: function (data, rows) {
            //console.log('data.length = ', data.length)
            if (data.length == 0) {
                id2e(id_button_mod).disabled = true
                id2e(id_button_del).disabled = true
                id2e(id_button_sel).disabled = true
                id2e(id_button_pr1).disabled = true
                id2e(id_button_pr2).disabled = true
                id2e(id_button_add).disabled = !isRole("dionis") && !isRole("su")
            }

            if (data.length == 1) {
                const id_oper_type = data[0].id_oper_type
                //console.log('id_oper_type = ', id_oper_type)
                id2e(id_button_mod).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_del).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_sel).disabled = false
                id2e(id_button_pr1).disabled = id_oper_type != '37' && id_oper_type != '38'
                id2e(id_button_pr2).disabled = data[0].oper_type != "подключение"
                id2e(id_button_add).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_mod).disabled = !isRole("dionis") && !isRole("su")
            }

            if (data.length > 1) {
                id2e(id_button_mod).disabled = true
                id2e(id_button_del).disabled = true
                id2e(id_button_sel).disabled = true
                id2e(id_button_add).disabled = true
                id2e(id_button_pr1).disabled = false
                id2e(id_button_pr2).disabled = false
            }

        },

        cellDblClick: async function (e, cell) {
            const d = tabulator.getSelectedData()[0]
            const title = d.sn

            const res = await edit_dionis_oper(
                d,
                win_current, // win_return
                'mod',
                id_dionis,
                title        // title
            )
        },


    })

    id2e(id_button_pr1).onclick = async () => {
        const opers_data = tabulator.getSelectedData()

        const ans = await dialogYESNO(
            "Печатать каждое СКЗИ на отдельном листе?", // text
            win_current // win_return
        )

        if (ans == 'ESC') return

        if (ans == 'YES') print_reports1(opers_data, win_return, ans)
        if (ans == 'NO') print_reports1a(opers_data, win_return, ans)
    }

    id2e(id_button_pr2).onclick = async () => {
        const opers_data = tabulator.getSelectedData()
        print_reports2(opers_data)
    }

    id2e(id_button_add).onclick = async () => {
        const d = factory_dionis_oper()
        d.id = await save_dionis_oper(d)

        addTabRow(tabulator, d, (top = false))

        const res = await edit_dionis_oper(
            d,
            win_current, // win_return
            "new", // mode
            id_dionis,
            title  // title
        )
    }


    id2e(id_button_mod).onclick = async () => {
        const d = tabulator.getSelectedData()[0]
        const title = d.sn

        const res = await edit_dionis_oper(
            d,
            win_current, // win_return
            "mod", // mode
            id_dionis,
            title
        )
    }

    id2e(id_button_del).onclick = async () => {
        const ans = await dialogYESNO(
            "Удалить операцию", // text
            win_current // win_return
        )

        if (ans == 'YES') {
            const data = tabulator.getSelectedData()
            data.forEach((d) => {
                del_dionis_oper(d.id)
                tabulator.deleteRow(d.id)
            })
            const id_oper = getFirstID(tabulator)
            tabulator.selectRow(id_oper)
        }
    }


    return tabulator
}

//=============================================================================
function edit_dionis_oper(
    d,
    win_return = null,
    mode = "",
    id_dionis = 0,
    title
) {
    return new Promise(async function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'edit' + salt
        let d_save = Object.assign({}, d)

        if (mode == 'new' && id_dionis != 0) {
            const d_dionis = await id_2_data(id_dionis, 'dionis')
            d.id_dionis = id_dionis
            d.sn = d_dionis.sn
            // console.log('d_dionis = ', d_dionis)
        }

        // console.log('d(dionis_oper) =', d)
        //const oper_types = (await id_taxonomy_2_types(7)).map(i => i.name)
        const oper_types = await id_taxonomy_2_types(7)
        // console.log('oper_types = ', oper_types)


        const id_button_enter = 'ent' + salt
        const id_button_cancel = 'cancel' + salt
        const id_button_prev = 'add' + salt
        const id_button_next = 'del' + salt

        const sel_dionis = 'select_dionis' + salt
        const sel_point1 = 'select_point1' + salt
        const sel_point2 = 'select_point2' + salt

        const sel_user_ufns = 'select_user_ufns' + salt
        const sel_user_tno = 'select_user_tno' + salt
        const sel_user_fku = 'select_user_fku' + salt

        const header = `<h4>id: ${d.id} операция Dionis: ${title}</h4>`

        // номер операции<br>
        // <input class="o3-border" type="text" v-model="dv.nn"><br><br>


        const body = `
        <div style="margin: 0; padding: 10px; height: 600px; background-color: #eeeeee; position: relative;">

            <div class="o3-card" style="display: inline-block; vertical-align: top; height: 100%; width:20%;">
                <label for="d_date">Дата операции:</label><br>
                <input class="o3-border" type="datetime-local" id="d_date" v-model="dv.date_time">
                <br>
                <br>
                Вид операции:
                <br>
                <br>
                <div>
                    <n-radio-group style="display: flex; flex-direction: column;" v-model:value="dv.id_oper_type" name="radiogroup" size="medium">
                        <n-radio
                            v-for="otype in operTypes"
                            :key="otype.id"
                            :value="otype.id"
                            :label="otype.name"
                            @change="handleRadioGroup"
                        />
                        <span style="font-size: 12px;">{{ otype.name }}</span>
                    </n-radio-group>
                </div>
            </div>

            <div class="o3-card" style="display: inline-block; vertical-align: top; height: 100%; width:80%;">
                <span>Dionis: <button id=${sel_dionis} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_sn}}</button> </span>
                &nbsp;&nbsp;заводской № на дату операции:&nbsp; <input class="o3-border o3-button-300" type="text" v-model="dv.sn_str"></span><br>
                <span v-show="shP1"> Откуда: <button id=${sel_point1} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_ip1}}</button> 
                &nbsp;&nbsp;название ТНО на дату операции: <input class="o3-border o3-button-300" type="text" v-model="dv.point1_str"></span><br>
                <span v-show="shP2"> Куда:&nbsp;&nbsp; <button id=${sel_point2} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_ip2}}</button> 
                &nbsp;&nbsp;название ТНО на дату операции: <input class="o3-border o3-button-300" type="text" v-model="dv.point2_str"></span>
                <br>
                <br>
                <div v-show="shUFNS">      
                    исполнитель УФНС:<br>
                    <button id=${sel_user_ufns} class="w3-btn w3-padding-small o3-button-300 w3-hover-teal">{{user_ufns}}</button>
                </div>
                <div v-show="shTNO">      
                    сотрудник ТНО, пользователь СКЗИ:<br>
                    <button id=${sel_user_tno} class="w3-btn w3-padding-small o3-button-300 w3-hover-teal">{{user_tno}}</button>
                </div>
                <br>
                <div v-show="shFKU">      
                    сотрудник органа КЗ произведший установку СКЗИ:<br>
                    <button id=${sel_user_fku} class="w3-btn w3-padding-small o3-button-300 w3-hover-teal">{{user_fku}}</button>
                    <br>                    
                    дата обращения на СТП:<br>
                    <input class="o3-border" type="date" v-model="dv.config_stp_date"><br>
                    номер обращения на СТП:<br>
                    <input class="o3-border o3-button-300" type="text" v-model="dv.config_stp_numb">
                </div>
                <br>
                <br>           
                Описание:<br>
                <textarea rows="3" style="width:100%" v-model="dv.dscr"></textarea>
                <br>           
                Комментарии:<br>
                <textarea rows="3" style="width:100%" v-model="dv.comm"></textarea>
                <br>
                <br>
                <button id=${id_button_enter}  class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить</button>
                <button id=${id_button_cancel} class="w3-btn w3-padding-small o3-border w3-hover-red">отменить</button>
                <button id=${id_button_prev}   class="w3-btn w3-padding-small o3-border w3-hover-teal">предыдущая операция</button>
                <button id=${id_button_next}   class="w3-btn w3-padding-small o3-border w3-hover-teal">следующая операция</button>
            </div>

        </div>`


        const foot = ``
        const selType0 = "передача"

        const esc_cb = mode == "new"
            ? () => {
                // если при создании операции нажать ESC - опреация удаляется
                remove_selected_dionis_oper()
                vapp.unmount()
            }
            : () => {
                vapp.unmount()
                table_dionis_opers.updateData([d_save])
            }

        newModalWindow(
            win_current,
            header,
            body,
            foot,
            "60%", // width
            "15%", // marginLeft
            "5%", // marginTop
            win_return, // win_return
            esc_cb // esc_callback
        )

        const { ref } = Vue

        //--- View Model-------------------------------------------------------start
        const vapp = Vue.createApp({
            data() {
                return {
                    dv: d,
                    chg: false,
                    selType: ref(d.id_oper_type),
                    operTypes: oper_types,
                    style_temp: ({ focused, checked }) => {
                        const style = {}
                        style.background = (checked) ? "red" : "green"
                        style.boxShadow = (focused) ? "0 0 0 0px #d0305040" : "0 0 0 0px #2080f040"
                        return style
                    },

                }
            },
            methods: {
                handleRadioGroup() {
                    this.dv.oper_type = oper_types.find(item => item.id == this.dv.id_oper_type).name
                }
            },
            computed: {
                comp_sn() {
                    return !!!this.dv.sn
                        ? "<выбрать Dinois>"
                        : this.dv.sn
                },
                comp_ip1() {
                    return !!!this.dv.ip1
                        ? "<выбрать источник>"
                        : format_point(this.dv.ifns_sono1, this.dv.torm_sono1, this.dv.ip1, this.dv.stock1)
                },
                comp_ip2() {
                    return !!!this.dv.ip2
                        ? "<выбрать приемник>"
                        : format_point(this.dv.ifns_sono2, this.dv.torm_sono2, this.dv.ip2, this.dv.stock2)
                },
                user_ufns() {
                    return !!!this.dv.user_ufns
                        ? "<выбрать сотрудника УФНС>"
                        : this.dv.user_ufns
                },
                user_tno() {
                    return !!!this.dv.user_tno
                        ? "<выбрать сотрудника ТНО>"
                        : this.dv.user_tno
                },
                user_fku() {
                    return !!!this.dv.user_fku
                        ? "<выбрать сотрудника органа КЗ>"
                        : this.dv.user_fku
                },
                shUFNS() {
                    return this.dv.id_oper_type == 36
                },
                shTNO() {
                    return ['37', '38', '39', '41', '45', '46', '47', '48'].includes(this.dv.id_oper_type)
                },
                shFKU() {
                    return ['39', '42', '43', '44', '45', '40', '46'].includes(this.dv.id_oper_type)
                },
                shP1() {
                    return ['36', '37', '38', '39', '41', '46'].includes(this.dv.id_oper_type)
                },
                shP2() {
                    return ['36', '37', '38', '39', '41'].includes(this.dv.id_oper_type)
                }
            },

        })

        const vm = vapp.use(naive).mount('#' + win_current)
        //--- View Model-------------------------------------------------------stop

        // id_2_set_focus(win_current)

        // кнопка выбора сотрудника УФНС -----------------------------------------------
        id2e(sel_user_ufns).onclick = async () => {
            const selected_user = await selectUser(
                '', // sono
                '', // esk
                0, // id_depart
                1, // selectable
                'выбор сотрудника УФНС<br>ЕСК=2 активная у/з,  ЕСК=0,1 отключенная у/з', // headerWin
                '400px', // width
                '50%', // marginLeft
                '1%', // marginTop
                win_current, // win_return
                vm.$data.dv.id_user_ufns // id_user
            )

            vm.$data.dv.id_user_ufns = selected_user[0].id
            vm.$data.dv.user_ufns = selected_user[0].name

            id2e(sel_user_ufns).innerHTML = vm.$data.dv.user_ufns
            id_2_set_focus(win_current)
        }

        // кнопка выбора сотрудника ТНО -----------------------------------------------
        id2e(sel_user_tno).onclick = async () => {
            const selected_user = await selectUser(
                '', // sono
                '', // esk
                0, // id_depart
                1, // selectable
                'выбор сотрудника ТНО<br>ЕСК=2 активная у/з,  ЕСК=0,1 отключенная у/з', // headerWin
                '400px', // width
                '50%', // marginLeft
                '2%', // marginTop
                win_current, // win_return
                vm.$data.dv.id_user_tno // id_user
            )

            vm.$data.dv.id_user_tno = selected_user[0].id
            vm.$data.dv.user_tno = selected_user[0].name

            id2e(sel_user_ufns).innerHTML = vm.$data.dv.user_tno
            id_2_set_focus(win_current)
        }

        // кнопка выбора сотрудника ФКУ -----------------------------------------------
        id2e(sel_user_fku).onclick = async () => {
            const selected_user = await selectUser(
                '', // sono
                '', // esk
                0, // id_depart
                1, // selectable
                'выбор сотрудника органа КЗ<br>ЕСК=2 активная у/з,  ЕСК=0,1 отключенная у/з', // headerWin
                '400px', // width
                '50%', // marginLeft
                '1%', // marginTop
                win_current, // win_return
                vm.$data.dv.id_user_fku // id_user
            )

            vm.$data.dv.id_user_fku = selected_user[0].id
            vm.$data.dv.user_fku = selected_user[0].name

            id2e(sel_user_ufns).innerHTML = vm.$data.dv.user_fku
            id_2_set_focus(win_current)
        }

        // кнопка отмены изменений --------------------------------------------------
        id2e(id_button_cancel).onclick = () => {
            vapp.unmount()
            if (mode == "new") remove_selected_dionis_oper()
            removeModalWindow(win_current, win_return)
            //console.log('d_save = ', d_save)
            table_dionis_opers.updateData([d_save])
            resolve("CANCEL")
        }

        // кнопка применения изменений --------------------------------------------------
        id2e(id_button_enter).onclick = () => {
            //console.log('SAVE')
            const d = vm.$data.dv
            d.temp = d.id_oper_type == 38 ? 1 : 0
            vapp.unmount()
            save_dionis_oper(d)
            removeModalWindow(win_current, win_return)
            table_dionis_opers.updateData([d])
            resolve("OK")
        }

        // кнопка перехода на предыдущую операцию -----------------------------------------
        id2e(id_button_prev).onclick = () => {
            const d = vm.$data.dv
            d.temp = d.id_oper_type == 38 ? 1 : 0
            save_dionis_oper(d)
            table_dionis_opers.updateData([d])
            table_dionis_opers.redraw()
            const selected_row = table_dionis_opers.getSelectedRows()[0]
            const id_curr = selected_row.id
            const id_prev = selected_row.getPrevRow().getData().id
            table_dionis_opers.deselectRow(id_curr)
            table_dionis_opers.selectRow(id_prev)
            table_dionis_opers.scrollToRow(id_prev, "center", false)
            const d_prev = table_dionis_opers.getSelectedData()[0]
            d_save = Object.assign({}, d_prev)
            vm.$data.dv = d_prev
            vm.$data.chg = false
        }

        // кнопка перехода на следующую операцию -----------------------------------------
        id2e(id_button_next).onclick = () => {
            const d = vm.$data.dv
            d.temp = d.id_oper_type == 38 ? 1 : 0
            save_dionis_oper(d)
            table_dionis_opers.updateData([d])
            table_dionis_opers.redraw()

            const selected_row = table_dionis_opers.getSelectedRows()[0]
            const id_curr = selected_row.id
            const id_next = selected_row.getNextRow().getData().id
            table_dionis_opers.deselectRow(id_curr)
            table_dionis_opers.selectRow(id_next)
            table_dionis_opers.scrollToRow(id_next, "center", false)

            const d_next = table_dionis_opers.getSelectedData()[0]
            d_save = Object.assign({}, d_next)
            vm.$data.dv = d_next
            vm.$data.chg = false
        }

        // кнопка выбора Dionis -----------------------------------------------
        id2e(sel_dionis).onclick = async () => {
            const id_depart = isRole("tex") ? g_user.id_depart : 0

            const selected_dionis = await select_dionis(
                "6100", // sono
                id_depart, // id_otdel
                1, // sklad
                0, // id_type_oper
                1, // selectable
                'select', // mode
                win_current, // win_return
                vm.$data.dv.id_dionis // id_dionis
            )

            // console.log('selected_dionis = ', selected_dionis)

            vm.$data.dv.id_dionis = selected_dionis.id
            vm.$data.dv.sn = selected_dionis.sn
            vm.$data.dv.type = selected_dionis.type
            vm.$data.dv.ver = selected_dionis.ver
            vm.$data.dv.sn_str = selected_dionis.sn

            id2e(sel_dionis).innerHTML = vm.$data.dv.sn
            id_2_set_focus(win_current)
        }

        // кнопка выбора источника -----------------------------------------------
        id2e(sel_point1).onclick = async () => {
            const id_depart = isRole("tex") ? g_user.id_depart : 0
            let stock = 0
            let header = ''
            if (vm.$data.dv.id_oper_type == '36') stock = 3 // поставка
            if (vm.$data.dv.id_oper_type == '37') stock = 1 // передача
            if (vm.$data.dv.id_oper_type == '38') stock = 1 // передача (временно)
            if (vm.$data.dv.id_oper_type == '39') stock = 1 // подключение
            if (vm.$data.dv.id_oper_type == '41') stock = 0 // отключение

            switch (vm.$data.dv.id_oper_type) {
                case '36': // поставка
                    stock = 3 // поставщик
                    header = 'Выбор поставщика'
                    break

                case '37': // передача
                    stock = 1 // склад
                    header = 'Выбор склада'
                    break

                case '38': // передача (временно)
                    stock = 1 // склад
                    header = 'Выбор склада'
                    break

                case '39': // подключение
                    stock = 1 // склад
                    header = 'Выбор склада'
                    break

                case '41': // отключение
                    stock = 0 // точка подключения
                    header = 'Выбор точки потключения'
                    break

                default:
                    break
            }


            const selected_point = await select_point(
                1,                             // selectable
                'select',                      // mode
                win_current,                   // win_return
                vm.$data.dv.id_connect_point1, // id_point
                stock,                         // stock
                header                         // заголовок окна
            )

            const ifns = await sono_2_data(selected_point.ifns_sono)

            vm.$data.dv.id_connect_point1 = selected_point.id
            vm.$data.dv.ip1 = selected_point.ip
            vm.$data.dv.ifns_sono1 = selected_point.ifns_sono
            vm.$data.dv.torm_sono1 = selected_point.torm_sono
            vm.$data.dv.stock1 = selected_point.stock
            vm.$data.dv.point1_str = ifns.name

            // id2e(sel_point1).innerHTML = vm.$data.dv.ip1
            id_2_set_focus(win_current)
        }

        // кнопка выбора приемника -----------------------------------------------
        id2e(sel_point2).onclick = async () => {
            const id_depart = isRole("tex") ? g_user.id_depart : 0
            let stock = 0
            let header = ''

            switch (vm.$data.dv.id_oper_type) {
                case '36': // поставка
                    stock = 1 // склад
                    header = 'Выбор склада'
                    break

                case '37': // передача
                    stock = 1 // склад
                    header = 'Выбор склада'
                    break

                case '38': // передача (временно)
                    stock = 1 // склад
                    header = 'Выбор склада'
                    break

                case '39': // подключение
                    stock = 0 // точка подключения
                    header = 'Выбор точки потключения'
                    break

                case '41': // отключение
                    stock = 1 // склад
                    header = 'Выбор склада'
                    break

                default:
                    break
            }

            const selected_point = await select_point(
                1,                             // selectable
                'select',                      // mode
                win_current,                   // win_return
                vm.$data.dv.id_connect_point2, // id_point
                stock,                         // stock
                header                         // заголовок окна
            )

            const ifns = await sono_2_data(selected_point.ifns_sono)

            vm.$data.dv.id_connect_point2 = selected_point.id
            vm.$data.dv.ip2 = selected_point.ip
            vm.$data.dv.ifns_sono2 = selected_point.ifns_sono
            vm.$data.dv.torm_sono2 = selected_point.torm_sono
            vm.$data.dv.stock2 = selected_point.stock
            vm.$data.dv.point2_str = ifns.name

            // id2e(sel_point2).innerHTML = vm.$data.dv.ip2
            id_2_set_focus(win_current)
        }
    })
}

//=============================================================================
async function print_reports1a(opers_data, win_return, new_page) {
    const salt = randomStr(10)
    const win_current = 'indexLoading' + salt

    // модальное окно прогресса печати ----------------------------------------
    const body = `<div style="margin: 10px; padding: 10px">
        <n-progress
            type="line"
            :percentage=value
            :height="24"
            :indicator-placement="'inside'"
            processing
        />
        </div>`

    newModalWindow(
        win_current, // modal
        'печать журнала...', // html_header
        body, // html_body
        '', // html_footer
        '90%', // width
        '5%', // marginLeft
        '3%', // marginTop
        win_return // win_return
    )

    const { ref } = Vue
    const { defineComponent } = Vue

    const vapp = Vue.createApp({
        data() {
            return {
                txt: "000",
                value: 0,
            }
        }
    })

    const vm = vapp.use(naive).mount('#' + win_current)

    // параметры шрифта pdf-документа -----------------------------------------
    pdfMake.fonts = {
        times: {
            normal: 'times.ttf',
            bold: 'timesbd.ttf',
            italics: 'timesi.ttf',
            bolditalics: 'timesbi.ttf'
        }
    }
    pdfMake.tableLayouts = {
        szLayout: {
            hLineWidth: function (i, node) {
                return 0.5
                if (i === 0 || i === node.table.body.length) {
                    return 0
                }
                return (i === node.table.headerRows) ? 2 : 1
            },
            vLineWidth: function (i) {
                return 0.5
                return 0
            },
            hLineColor: function (i) {
                return 'black'
                return i === 1 ? 'black' : '#aaa'
            },
            paddingLeft: function (i) {
                return 3
                return i === 0 ? 0 : 8
            },
            paddingRight: function (i, node) {
                return 3
                return (i === node.table.widths.length - 1) ? 0 : 8
            }
        }
    }

    // параметры заголовка pdf-документа --------------------------------------
    let doc_head = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [10, 5, 5, 5],

        defaultStyle: {
            font: 'times',
            fontSize: 8,
        },

        styles: {
            tableStyle: {
                border: '1px solid black', // толщина границы
                borderWidth: [1, 1, 1, 1] // толщина границы для каждой стороны (верх, право, низ, лево)
            },
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
                font: 'times',
                bold: false,
                fontSize: 6,
                margin: [0, 0, 0, 0]
            },
            tableHeader: {
                font: 'times',
                bold: false,
                fontSize: 6,
                alignment: 'center',
            },
            tableCell: {
                fontSize: 6,
                // alignment: 'center',
                heights: 100
            },
            tableV: {
                fontSize: 6,
                alignment: 'center',
                heights: 100
            },
            tableHV: {
                fontSize: 6,
                alignment: 'center',
                verticalAlign: 'middle',
                heights: 100
            },
            tableV: {
                fontSize: 6,
                verticalAlign: 'middle',
                heights: 100
            }

        },
    }

    let content = []

    // разрыв страницы --------------------------------------------------------
    const page_break = [{ text: ' ', pageBreak: 'after' }]

    // заголовок страницы -----------------------------------------------------
    const head_page = [
        { text: 'Приложение 1', style: ['header0'] },
        { text: 'к Инструкции (пункт 26), утвержденной', style: ['header0'] },
        { text: 'Приказом Федерального агенства', style: ['header0'] },
        { text: 'правительственной связи и информации', style: ['header0'] },
        { text: 'при Президенте Российской Федерации', style: ['header0'] },
        { text: 'от 13 июня 2001 г. №152', style: ['header0'] },
        { text: `Журнал поэкземплярного учета СКЗИ, эксплуатационной`, style: ['header'] },
        { text: `и технической документации к ним, ключевых документов`, style: ['header'] },
        { text: `(для органа криптографической защиты)`, style: ['header'] },
        { text: `\n`, style: ['header'] }
    ]

    const blank_table = [
        {
            style: 'table',
            table: {
                //       1  2   3   4   5   6   7   8   9   10  11  12  13  14  15  16
                widths: [8, 90, 90, 30, 50, 40, 60, 40, 40, 40, 40, 40, 40, 40, 40, 32],
                heights: [6, 40, 6, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
                headerRows: 3,
                // keepWithHeaderRows: 1,
                body: [
                    [
                        { text: '№ п/п', style: 'tableHeader', rowSpan: 2 },
                        { text: 'Наименование СКЗИ, эксплуатационной и технической документации к ним, ключевых документов', style: 'tableHeader', rowSpan: 2 },
                        { text: 'Серийные номера СКЗИ, эксплуатационной и технической документации к ним, номера серий ключевых документов', style: 'tableHeader', rowSpan: 2 },
                        { text: 'Номера экземпляров (криптографические номера) ключевых документов', style: 'tableHeader', rowSpan: 2 },
                        { text: 'Отметка о получении', style: 'tableHeader', colSpan: 2 },
                        {},
                        { text: 'Отметка о рассылке (передаче)', style: 'tableHeader', colSpan: 3 },
                        {},
                        {},
                        { text: 'Отметка о возврате', style: 'tableHeader', colSpan: 2 },
                        {},
                        { text: 'Дата ввода в действие', style: 'tableHeader', rowSpan: 2 },
                        { text: 'Дата вывода из действия', style: 'tableHeader', rowSpan: 2 },
                        { text: 'Отметка об уничтожении СКЗИ, ключевых документов', style: 'tableHeader', colSpan: 2 },
                        {},
                        { text: 'Примечание', style: 'tableHeader', rowSpan: 2 },
                    ],
                    [
                        {}, {}, {}, {},
                        { text: 'От кого получены или Ф.И.О. сотрудника органа криптографической защиты, изготовившего ключевые документы', style: 'tableHeader' },
                        { text: 'Дата и номер сопроводительного письма или дата изготовления ключевых документов и расписка в изготовлении ', style: 'tableHeader' },
                        { text: 'Кому разосланы (переданы)', style: 'tableHeader' },
                        { text: 'Дата и номер сопроводительного письма', style: 'tableHeader' },
                        { text: 'Дата и номер подтверждения или расписка в получении', style: 'tableHeader' },
                        { text: 'Дата и номер сопроводительного письма', style: 'tableHeader' },
                        { text: 'Дата и номер подтверждения', style: 'tableHeader' },
                        {}, {},
                        { text: 'Дата уничтожения', style: 'tableHeader' },
                        { text: 'Номер акта или расписка об уничтожении', style: 'tableHeader' },
                        {},
                    ],
                    [
                        { text: '1', style: 'tableHeader' },
                        { text: '2', style: 'tableHeader' },
                        { text: '3', style: 'tableHeader' },
                        { text: '4', style: 'tableHeader' },
                        { text: '5', style: 'tableHeader' },
                        { text: '6', style: 'tableHeader' },
                        { text: '7', style: 'tableHeader' },
                        { text: '8', style: 'tableHeader' },
                        { text: '9', style: 'tableHeader' },
                        { text: '10', style: 'tableHeader' },
                        { text: '11', style: 'tableHeader' },
                        { text: '12', style: 'tableHeader' },
                        { text: '13', style: 'tableHeader' },
                        { text: '14', style: 'tableHeader' },
                        { text: '15', style: 'tableHeader' },
                        { text: '16', style: 'tableHeader' },
                    ]

                ]
            },
            layout: 'szLayout'
        },
    ]

    let table_content = []

    // цикл по выбранным операциям и сборкам, формирования массива строк отчета
    let i = 0
    let n = opers_data.length

    for (const oper_data of opers_data) {
        vm.$data.value = Math.floor(i / n * 100)
        if (oper_data.id_oper_type != '37' && oper_data.id_oper_type != '38') continue
        let table_content_oper = await reports_body1a(oper_data.id)
        table_content = table_content.concat(table_content_oper)
        i++
    }

    // цикл по массиву строк отчета, формирование отчета ----------------------
    i = 0
    n = table_content.length
    let table_temp = []
    for (const line of table_content) {
        if (!(i % 11)) {
            if (i > 0) {
                content = content.concat(table_temp)
            }
            table_temp = [
                {
                    style: 'table',
                    table: {
                        //       1  2   3   4   5   6   7   8   9   10  11  12  13  14  15  16
                        widths: [8, 90, 90, 30, 50, 40, 60, 40, 40, 40, 40, 40, 40, 40, 40, 32],
                        heights: [6, 40, 6, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
                        headerRows: 3,
                        // keepWithHeaderRows: 1,
                        body: [
                            [
                                { text: '№ п/п', style: 'tableHeader', rowSpan: 2 },
                                { text: 'Наименование СКЗИ, эксплуатационной и технической документации к ним, ключевых документов', style: 'tableHeader', rowSpan: 2 },
                                { text: 'Серийные номера СКЗИ, эксплуатационной и технической документации к ним, номера серий ключевых документов', style: 'tableHeader', rowSpan: 2 },
                                { text: 'Номера экземпляров (криптографические номера) ключевых документов', style: 'tableHeader', rowSpan: 2 },
                                { text: 'Отметка о получении', style: 'tableHeader', colSpan: 2 },
                                {},
                                { text: 'Отметка о рассылке (передаче)', style: 'tableHeader', colSpan: 3 },
                                {},
                                {},
                                { text: 'Отметка о возврате', style: 'tableHeader', colSpan: 2 },
                                {},
                                { text: 'Дата ввода в действие', style: 'tableHeader', rowSpan: 2 },
                                { text: 'Дата вывода из действия', style: 'tableHeader', rowSpan: 2 },
                                { text: 'Отметка об уничтожении СКЗИ, ключевых документов', style: 'tableHeader', colSpan: 2 },
                                {},
                                { text: 'Примечание', style: 'tableHeader', rowSpan: 2 },
                            ],
                            [
                                {}, {}, {}, {},
                                { text: 'От кого получены или Ф.И.О. сотрудника органа криптографической защиты, изготовившего ключевые документы', style: 'tableHeader' },
                                { text: 'Дата и номер сопроводительного письма или дата изготовления ключевых документов и расписка в изготовлении ', style: 'tableHeader' },
                                { text: 'Кому разосланы (переданы)', style: 'tableHeader' },
                                { text: 'Дата и номер сопроводительного письма', style: 'tableHeader' },
                                { text: 'Дата и номер подтверждения или расписка в получении', style: 'tableHeader' },
                                { text: 'Дата и номер сопроводительного письма', style: 'tableHeader' },
                                { text: 'Дата и номер подтверждения', style: 'tableHeader' },
                                {}, {},
                                { text: 'Дата уничтожения', style: 'tableHeader' },
                                { text: 'Номер акта или расписка об уничтожении', style: 'tableHeader' },
                                {},
                            ],
                            [
                                { text: '1', style: 'tableHeader' },
                                { text: '2', style: 'tableHeader' },
                                { text: '3', style: 'tableHeader' },
                                { text: '4', style: 'tableHeader' },
                                { text: '5', style: 'tableHeader' },
                                { text: '6', style: 'tableHeader' },
                                { text: '7', style: 'tableHeader' },
                                { text: '8', style: 'tableHeader' },
                                { text: '9', style: 'tableHeader' },
                                { text: '10', style: 'tableHeader' },
                                { text: '11', style: 'tableHeader' },
                                { text: '12', style: 'tableHeader' },
                                { text: '13', style: 'tableHeader' },
                                { text: '14', style: 'tableHeader' },
                                { text: '15', style: 'tableHeader' },
                                { text: '16', style: 'tableHeader' },
                            ]

                        ]
                    },
                    layout: 'szLayout'
                },
            ]

            content = content.concat([
                { text: 'Приложение 1', style: ['header0'] },
                { text: 'к Инструкции (пункт 26), утвержденной', style: ['header0'] },
                { text: 'Приказом Федерального агенства', style: ['header0'] },
                { text: 'правительственной связи и информации', style: ['header0'] },
                { text: 'при Президенте Российской Федерации', style: ['header0'] },
                { text: 'от 13 июня 2001 г. №152', style: ['header0'] },
                { text: `Журнал поэкземплярного учета СКЗИ, эксплуатационной`, style: ['header'] },
                { text: `и технической документации к ним, ключевых документов`, style: ['header'] },
                { text: `(для органа криптографической защиты)`, style: ['header'] },
                { text: `\n`, style: ['header'] }
            ])
        }

        table_temp[0].table.body = await table_temp[0].table.body.concat([line])
        i++
    }

    content = content.concat(table_temp)

    let doc = Object.assign(doc_head, { content: content })
    vapp.unmount()

    removeModalWindow(win_current, win_return)
    pdfMake.createPdf(doc).open()

    async function reports_body1a(id_dionis_oper) {
        let model_content_d = await id_oper_2_model_content(id_dionis_oper)
        let data = await id_oper_2_date(id_dionis_oper)
        let table_content = []
        let i = 0

        model_content_d.forEach((d) => {
            let sn_str = !!!data.sn_str ? d.dionis_sn : data.sn_str
            let sn = ''
            switch (d.sn) {
                case '{{sn}}':
                    sn = sn_str
                    break;
                case '{{sn1}}':
                    sn = d.sn1
                    break;
                case '{{sn2}}':
                    sn = d.sn2
                    break;
                default:
                    sn = d.sn
                    break;
            }

            table_content[i] = [
                '',
                { text: d.name, style: 'tableCell' },
                { text: sn, style: 'tableV' },
                { text: '1', style: 'tableHV' },
                { text: data.vendor, style: 'tableCell' },
                { text: date2date(data.date_vendor) + '\n' + data.numb_vendor, style: 'tableCell' },
                // { text: data.ifns2, style: 'tableCell' }, 
                { text: data.point2_str, style: 'tableCell' },
                { text: date2date(data.date_ufns) + '\n' + data.numb_ufns, style: 'tableCell' },
                { text: date2date(data.date_time) + '\n' + fio2fio0(data.user_tno), style: 'tableCell' },
                '', '', '', '', '', '', '',
            ]
            i += 1
        })
        return table_content
    }
}

//=============================================================================
async function print_reports1(opers_data, win_return, new_page) {
    const salt = randomStr(10)
    const win_current = 'indexLoading' + salt

    // модальное окно прогресса печати ----------------------------------------
    const body = `<div style="margin: 10px; padding: 10px">
        <n-progress
            type="line"
            :percentage=value
            :height="24"
            :indicator-placement="'inside'"
            processing
        />
        </div>`

    newModalWindow(
        win_current, // modal
        'печать журнала...', // html_header
        body, // html_body
        '', // html_footer
        '90%', // width
        '5%', // marginLeft
        '3%', // marginTop
        win_return // win_return
    )

    const { ref } = Vue
    const { defineComponent } = Vue

    const vapp = Vue.createApp({
        data() {
            return {
                txt: "000",
                value: 0,
            }
        }
    })

    const vm = vapp.use(naive).mount('#' + win_current)

    // параметры шрифта pdf-документа -----------------------------------------
    pdfMake.fonts = {
        times: {
            normal: 'times.ttf',
            bold: 'timesbd.ttf',
            italics: 'timesi.ttf',
            bolditalics: 'timesbi.ttf'
        }
    }
    pdfMake.tableLayouts = {
        szLayout: {
            hLineWidth: function (i, node) {
                return 0.5
                if (i === 0 || i === node.table.body.length) {
                    return 0
                }
                return (i === node.table.headerRows) ? 2 : 1
            },
            vLineWidth: function (i) {
                return 0.5
                return 0
            },
            hLineColor: function (i) {
                return 'black'
                return i === 1 ? 'black' : '#aaa'
            },
            paddingLeft: function (i) {
                return 3
                return i === 0 ? 0 : 8
            },
            paddingRight: function (i, node) {
                return 3
                return (i === node.table.widths.length - 1) ? 0 : 8
            }
        }
    }

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
            tableStyle: {
                border: '1px solid black', // толщина границы
                borderWidth: [1, 1, 1, 1] // толщина границы для каждой стороны (верх, право, низ, лево)
            },
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
                font: 'times',
                bold: false,
                fontSize: 6,
                margin: [0, 0, 0, 0]
            },
            tableHeader: {
                font: 'times',
                bold: false,
                fontSize: 6,
                alignment: 'center',
            },
            tableCell: {
                fontSize: 6,
                // alignment: 'center',
                heights: 100
            },
            tableV: {
                fontSize: 6,
                alignment: 'center',
                heights: 100
            },
            tableHV: {
                fontSize: 6,
                alignment: 'center',
                verticalAlign: 'middle',
                heights: 100
            },
            tableV: {
                fontSize: 6,
                verticalAlign: 'middle',
                heights: 100
            }

        },
    }

    let content = []
    let i = 1
    let n = opers_data.length

    for (const oper_data of opers_data) {
        vm.$data.txt = i.toString() + "/" + n.toString()
        vm.$data.value = Math.floor(i / n * 100)
        if (oper_data.id_oper_type != '37' && oper_data.id_oper_type != '38') continue

        let content1 = await reports_body1(oper_data.id)

        content = content
            .concat([
                { text: 'Приложение 1', style: ['header0'] },
                { text: 'к Инструкции (пункт 26), утвержденной', style: ['header0'] },
                { text: 'Приказом Федерального агенства', style: ['header0'] },
                { text: 'правительственной связи и информации', style: ['header0'] },
                { text: 'при Президенте Российской Федерации', style: ['header0'] },
                { text: 'от 13 июня 2001 г. №152', style: ['header0'] },
                { text: `Журнал поэкземплярного учета СКЗИ, эксплуатационной`, style: ['header'] },
                { text: `и технической документации к ним, ключевых документов`, style: ['header'] },
                { text: `(для органа криптографической защиты)`, style: ['header'] }
            ])
            .concat(content1)

        if (i < n) content = content.concat([{ text: ' ', pageBreak: 'after' }])
        i++
    }

    let doc = Object.assign(doc_head, { content: content })
    vapp.unmount()
    removeModalWindow(win_current, win_return)
    pdfMake.createPdf(doc).open()

    async function reports_body1(id_dionis_oper) {
        const hh = 30

        let table_head = [
            { text: '\n', style: ['header'] },
            {
                style: 'table',
                table: {
                    //       1  2   3   4   5   6   7   8   9   10  11  12  13  14  15  16
                    widths: [8, 90, 90, 30, 50, 40, 60, 40, 40, 40, 40, 40, 40, 40, 40, 32],
                    heights: [6, 40, 6, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh],
                    headerRows: 3,
                    // keepWithHeaderRows: 1,
                    body: [
                        [
                            { text: '№ п/п', style: 'tableHeader', rowSpan: 2 },
                            { text: 'Наименование СКЗИ, эксплуатационной и технической документации к ним, ключевых документов', style: 'tableHeader', rowSpan: 2 },
                            { text: 'Серийные номера СКЗИ, эксплуатационной и технической документации к ним, номера серий ключевых документов', style: 'tableHeader', rowSpan: 2 },
                            { text: 'Номера экземпляров (криптографические номера) ключевых документов', style: 'tableHeader', rowSpan: 2 },
                            { text: 'Отметка о получении', style: 'tableHeader', colSpan: 2 },
                            {},
                            { text: 'Отметка о рассылке (передаче)', style: 'tableHeader', colSpan: 3 },
                            {},
                            {},
                            { text: 'Отметка о возврате', style: 'tableHeader', colSpan: 2 },
                            {},
                            { text: 'Дата ввода в действие', style: 'tableHeader', rowSpan: 2 },
                            { text: 'Дата вывода из действия', style: 'tableHeader', rowSpan: 2 },
                            { text: 'Отметка об уничтожении СКЗИ, ключевых документов', style: 'tableHeader', colSpan: 2 },
                            {},
                            { text: 'Примечание', style: 'tableHeader', rowSpan: 2 },
                        ],
                        [
                            {}, {}, {}, {},
                            { text: 'От кого получены или Ф.И.О. сотрудника органа криптографической защиты, изготовившего ключевые документы', style: 'tableHeader' },
                            { text: 'Дата и номер сопроводительного письма или дата изготовления ключевых документов и расписка в изготовлении ', style: 'tableHeader' },
                            { text: 'Кому разосланы (переданы)', style: 'tableHeader' },
                            { text: 'Дата и номер сопроводительного письма', style: 'tableHeader' },
                            { text: 'Дата и номер подтверждения или расписка в получении', style: 'tableHeader' },
                            { text: 'Дата и номер сопроводительного письма', style: 'tableHeader' },
                            { text: 'Дата и номер подтверждения', style: 'tableHeader' },
                            {}, {},
                            { text: 'Дата уничтожения', style: 'tableHeader' },
                            { text: 'Номер акта или расписка об уничтожении', style: 'tableHeader' },
                            {},
                        ],
                        [
                            { text: '1', style: 'tableHeader' },
                            { text: '2', style: 'tableHeader' },
                            { text: '3', style: 'tableHeader' },
                            { text: '4', style: 'tableHeader' },
                            { text: '5', style: 'tableHeader' },
                            { text: '6', style: 'tableHeader' },
                            { text: '7', style: 'tableHeader' },
                            { text: '8', style: 'tableHeader' },
                            { text: '9', style: 'tableHeader' },
                            { text: '10', style: 'tableHeader' },
                            { text: '11', style: 'tableHeader' },
                            { text: '12', style: 'tableHeader' },
                            { text: '13', style: 'tableHeader' },
                            { text: '14', style: 'tableHeader' },
                            { text: '15', style: 'tableHeader' },
                            { text: '16', style: 'tableHeader' },
                        ]

                    ]
                },
                layout: 'szLayout'
            },
        ]

        let model_content_d = await id_oper_2_model_content(id_dionis_oper)
        let data = await id_oper_2_date(id_dionis_oper)
        let d36 = await dionis_oper_2_dionis_oper(id_dionis_oper, 37, 36)
        let table_content = []
        let i = 0

        model_content_d.forEach((d) => {
            let sn_str = !!!data.sn_str ? d.dionis_sn : data.sn_str

            let sn = ''
            switch (d.sn) {
                case '{{sn}}':
                    sn = sn_str
                    break;
                case '{{sn1}}':
                    sn = d.sn1
                    break;
                case '{{sn2}}':
                    sn = d.sn2
                    break;
                default:
                    sn = d.sn
                    break;
            }

            table_content[i] = [
                '',
                { text: d.name, style: 'tableCell' },
                { text: sn, style: 'tableV' },
                { text: '1', style: 'tableHV' },
                { text: data.vendor, style: 'tableCell' },
                { text: date2date(data.date_vendor) + '\n' + data.numb_vendor, style: 'tableCell' },
                // { text: data.ifns2, style: 'tableCell' }, 
                { text: data.point2_str, style: 'tableCell' },
                { text: date2date(data.date_ufns) + '\n' + data.numb_ufns, style: 'tableCell' },
                { text: date2date(data.date_time) + '\n' + fio2fio0(data.user_tno), style: 'tableCell' },
                '', '', '', '', '', '', '',
            ]
            i += 1
        })

        table_head[1].table.body = table_head[1].table.body.concat(table_content)
        return table_head
    }
}

//=============================================================================
async function print_reports2(opers_data) {
    // параметры шрифта pdf-документа ---------------------------------------------------
    pdfMake.fonts = {
        times: {
            normal: 'times.ttf',
            bold: 'timesbd.ttf',
            italics: 'timesi.ttf',
            bolditalics: 'timesbi.ttf'
        }
    }
    pdfMake.tableLayouts = {
        szLayout: {
            hLineWidth: function (i, node) {
                return 0.5
                if (i === 0 || i === node.table.body.length) {
                    return 0
                }
                return (i === node.table.headerRows) ? 2 : 1
            },
            vLineWidth: function (i) {
                return 0.5
                return 0
            },
            hLineColor: function (i) {
                return 'black'
                return i === 1 ? 'black' : '#aaa'
            },
            paddingLeft: function (i) {
                return 3
                return i === 0 ? 0 : 8
            },
            paddingRight: function (i, node) {
                return 3
                return (i === node.table.widths.length - 1) ? 0 : 8
            }
        }
    }

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
            tableStyle: {
                border: '1px solid black', // толщина границы
                borderWidth: [1, 1, 1, 1] // толщина границы для каждой стороны (верх, право, низ, лево)
            },
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
                font: 'times',
                bold: false,
                fontSize: 6,
                margin: [0, 0, 0, 0]
            },
            tableHeader: {
                font: 'times',
                bold: false,
                fontSize: 6,
                alignment: 'center',
            },
            tableCell: {
                fontSize: 6,
                // alignment: 'center',
                heights: 100
            },
            tableV: {
                fontSize: 6,
                alignment: 'center',
                heights: 100
            },
            tableHV: {
                fontSize: 6,
                alignment: 'center',
                verticalAlign: 'middle',
                heights: 100
            },
            tableV: {
                fontSize: 6,
                verticalAlign: 'middle',
                heights: 100
            }

        },
    }

    let content = []
    let i = 1
    let n = opers_data.length

    for (const oper_data of opers_data) {
        if (oper_data.id_oper_type != '39') continue

        let content1 = await reports_body2(oper_data.id)

        content = content
            .concat([
                { text: 'Приложение 1', style: ['header0'] },
                { text: 'к Инструкции (пункт 26), утвержденной', style: ['header0'] },
                { text: 'Приказом Федерального агенства', style: ['header0'] },
                { text: 'правительственной связи и информации', style: ['header0'] },
                { text: 'при Президенте Российской Федерации', style: ['header0'] },
                { text: 'от 13 июня 2001 г. №152', style: ['header0'] },
                { text: `Журнал поэкземплярного учета СКЗИ, эксплуатационной`, style: ['header'] },
                { text: `и технической документации к ним, ключевых документов`, style: ['header'] },
                { text: `(для обладателя криптографической информации)`, style: ['header'] },
            ])
            .concat(content1)

        if (i < n) content = content.concat([{ text: ' ', pageBreak: 'after' }])
        i++
    }

    let doc = Object.assign(doc_head, { content: content })
    pdfMake.createPdf(doc).open()

    // ---------------------------------------------------------
    async function reports_body2(id_dionis_oper) {
        const hh = 30

        let table_head = [
            { text: '\n', style: ['header'] },
            {
                style: 'table',
                table: {
                    //       1  2   3   4   5   6   7   8   9   10  11  12  13  14  15
                    widths: [8, 120, 90, 30, 50, 40, 60, 40, 40, 40, 40, 40, 40, 40, 40],
                    heights: [6, 40, 6, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh, hh],
                    headerRows: 3,
                    // keepWithHeaderRows: 1,
                    body: [
                        [
                            { text: '№ п/п', style: 'tableHeader', rowSpan: 2 },
                            { text: 'Наименование СКЗИ, эксплуатационной и технической документации к ним, ключевых документов', style: 'tableHeader', rowSpan: 2 },
                            { text: 'Серийные номера СКЗИ, эксплуатационной и технической документации к ним, номера серий ключевых документов', style: 'tableHeader', rowSpan: 2 },
                            { text: 'Номера экземпляров (криптографические номера) ключевых документов', style: 'tableHeader', rowSpan: 2 },
                            { text: 'Отметка о получении', style: 'tableHeader', colSpan: 2 },
                            {},
                            { text: 'Отметка о выдаче', style: 'tableHeader', colSpan: 2 },
                            {},
                            { text: 'Отметка о подключении (установке) СКЗИ', style: 'tableHeader', colSpan: 3 },
                            {},
                            {},
                            { text: 'Отметка об зъятии СКЗИ из аппаратных средств, уничтожении ключевых документов', style: 'tableHeader', colSpan: 3 },
                            {},
                            {},
                            { text: 'Примечание', style: 'tableHeader', rowSpan: 2 },
                            // {},
                        ],
                        [
                            {},
                            {},
                            {},
                            {},
                            { text: 'От кого получены', style: 'tableHeader' },
                            { text: 'Дата и номер сопроводительного письма', style: 'tableHeader' },
                            { text: 'ФИО пользователя СКЗИ', style: 'tableHeader' },
                            { text: 'Дата и расписка в получении', style: 'tableHeader' },
                            { text: 'ФИО сотрудников органа криптокрафической защиты, пользователя СКЗИ, произведших подключение (установку)', style: 'tableHeader' },
                            { text: 'Дата подключения (установки) и подписи лиц, произведших подключение (установку)', style: 'tableHeader' },
                            { text: 'Номера аппаратных средств, в которые установлены или к которым подключены СКЗИ', style: 'tableHeader' },
                            { text: 'Дата изъятия (уничтожения)', style: 'tableHeader' },
                            { text: 'ФИО сотрудников органа криптокрафической защиты, пользователя СКЗИ, производивших изъятие (уничтожение)', style: 'tableHeader' },
                            { text: 'Номер акта или расписка об инчтожении', style: 'tableHeader' },
                            {},
                            // {},
                        ],
                        [
                            { text: '1', style: 'tableHeader' },
                            { text: '2', style: 'tableHeader' },
                            { text: '3', style: 'tableHeader' },
                            { text: '4', style: 'tableHeader' },
                            { text: '5', style: 'tableHeader' },
                            { text: '6', style: 'tableHeader' },
                            { text: '7', style: 'tableHeader' },
                            { text: '8', style: 'tableHeader' },
                            { text: '9', style: 'tableHeader' },
                            { text: '10', style: 'tableHeader' },
                            { text: '11', style: 'tableHeader' },
                            { text: '12', style: 'tableHeader' },
                            { text: '13', style: 'tableHeader' },
                            { text: '14', style: 'tableHeader' },
                            { text: '15', style: 'tableHeader' },
                            // {},
                        ]

                    ]
                },
                layout: 'szLayout'
            },
        ]

        let model_content_d = await id_oper_2_model_content(id_dionis_oper)
        let data39 = await id_oper_2_date(id_dionis_oper)
        let d36 = await dionis_oper_2_dionis_oper(id_dionis_oper, 39, 36)
        let data36 = await id_oper_2_date(d36.id)

        let table_content = []
        let i = 0

        model_content_d.forEach((d) => {
            let sn_str = !!!data39.sn_str ? d.dionis_sn : data39.sn_str
            let sn = d.sn == '{{sn}}' ? sn_str : d.sn
            let user_fku = d.sn == '{{sn}}' ? data39.user_fku : ''
            let date_fku = d.sn == '{{sn}}' ? date2date(data39.date_time) : ''

            table_content[i] = [
                '',
                { text: d.name, style: 'tableCell' },
                { text: sn, style: 'tableV' },
                { text: '1', style: 'tableHV' },
                { text: data36.ifns1, style: 'tableCell' },
                { text: date2date(data36.date_ufns) + '\n' + data36.numb_ufns, style: 'tableCell' },
                { text: data39.user_tno, style: 'tableCell' },
                { text: date2date(data39.date_time), style: 'tableCell' },
                { text: user_fku, style: 'tableCell' },
                { text: date_fku, style: 'tableCell' },
                '',
                '',
                '',
                '',
                '',
                // '', 
            ]
            i += 1
        })

        table_head[1].table.body = table_head[1].table.body.concat(table_content)
        return table_head
    }
}

//=============================================================================
function remove_selected_dionis_oper() {
    let id_oper = table_dionis_opers.getSelectedData()[0].id
    del_dionis_oper(id_oper)
    table_dionis_opers.deleteRow(id_oper)
    id_oper = getFirstID(table_dionis_opers)
    table_dionis_opers.selectRow(id_oper)
}

//=============================================================================
async function new_dionis_oper() {
    const id = await runSQL_p("INSERT INTO dionis_oper () VALUES ()")
    return id
}

//=============================================================================
async function save_dionis_oper(d) {

    switch (d.id_oper_type) {
        case '36':    // поставка
            d.id_user_tno = 0
            d.id_user_fku = 0
            break
        case '37':    // передача
            d.id_user_ufns = 0
            d.id_user_fku = 0
            break
        case '38':    // передача (временно)
            d.id_user_ufns = 0
            d.id_user_fku = 0
            break
        case '39':    // подключение
            d.id_user_ufns = 0
            break
        case '40':    // обновление ОС
            d.id_user_ufns = 0
            d.id_user_tno = 0
            break
        case '41':    // отключение
            d.id_user_ufns = 0
            d.id_user_fku = 0
            break
        case '42':    // загрузка ключей
            d.id_user_ufns = 0
            d.id_user_tno = 0
            break
        case '43':    // активация ключей
            d.id_user_ufns = 0
            d.id_user_tno = 0
            break
        case '44':    // удаление ключей
            d.id_user_ufns = 0
            d.id_user_tno = 0
            break
        case '45':    // конфигурирование
            break
        case '46':    // неисправность
            break
        case '47':    // уничтожение
            break
        case '48':    // списание
            break
        default:
            break
    }


    const sql =
        d.id == 0
            ? `INSERT INTO dionis_oper ( 
                id,
                id_dionis,
                id_oper_type,
                id_connect_point1,
                id_connect_point2,
                id_user_ufns,
                id_user_tno,
                id_user_fku,
                date,
                date_time,
                dscr,
                comm,
                temp,
                key_serial,
                key_numb,
                os_version,
                config_request,
                config_stp_date,
                config_stp_numb,
                point1_str,
                point2_str,
                nn,
                sn_str

            ) VALUES (
                ${d.id},
                ${d.id_dionis},
                ${d.id_oper_type},
                ${d.id_connect_point1},
                ${d.id_connect_point1},
                ${d.id_user_ufns},
                ${d.id_user_tno},
                ${d.id_user_fku},
               '${d.date}',
               '${d.date_time}',
               '${d.dscr}',
               '${d.comm}',
               '${d.temp}',
               '${d.key_serial}',
               '${d.key_numb}',
               '${d.os_version}',
               '${d.config_request}',
               '${d.config_stp_date}',
               '${d.config_stp_numb}',
               '${d.point1_str}',
               '${d.point2_str}',
                ${d.nn},
               '${d.sn_str}'
           )`
            : `UPDATE dionis_oper SET 
                id=${d.id},
                id_dionis=${d.id_dionis},
                id_oper_type=${d.id_oper_type},
                id_connect_point1=${d.id_connect_point1},
                id_connect_point2=${d.id_connect_point2},
                id_user_ufns=${d.id_user_ufns},
                id_user_tno=${d.id_user_tno},
                id_user_fku=${d.id_user_fku},
                date='${d.date}',
                date_time='${d.date_time}',
                dscr='${d.dscr}',
                comm='${d.comm}',
                temp=${d.temp},
                key_serial='${d.key_serial}',
                key_numb='${d.key_numb}',
                os_version='${d.os_version}',
                config_request='${d.config_request}',
                config_stp_date='${d.config_stp_date}',
                config_stp_numb='${d.config_stp_numb}',
                point1_str='${d.point1_str}',
                point2_str='${d.point2_str}',
                nn=${d.nn},
                sn_str='${d.sn_str}'
            WHERE id=${d.id}`

    return runSQL_p(sql)
}

//=============================================================================
function del_dionis_oper(id) {
    runSQL_p(`DELETE FROM dionis_oper WHERE id=${id}`)
}

//=============================================================================
function factory_dionis_oper(id_dionis = 0) {
    return {
        id: 0,
        id_dionis: id_dionis,
        id_oper_type: 0,
        id_connect_point1: 0,
        id_connect_point2: 0,
        id_user_ufns: 0,
        id_user_tno: 0,
        id_user_fku: 0,
        date: '',
        date_time: '',
        dscr: '',
        comm: '',
        temp: 0,
        key_serial: '',
        key_numb: '',
        os_version: '',
        config_request: '',
        config_stp_date: '',
        config_stp_numb: '',
        point1_str: '',
        point2_str: '',
        nn: 0,
        sn_str: ''
    }
}

//=============================================================================
function format_point(
    sono1 = '',
    sono2 = '',
    point = '',
    stock = 0
) {
    //console.log(`sono1, sono2, point, stock = ${sono1}, ${sono2}, ${point}, ${stock}`)

    // -------------- ДНР ----------------------------------
    if (stock == 2) return point

    // -------------- поставщик ----------------------------
    if (stock == 3) return point

    // -------------- ц.о. ТНО -----------------------------
    if (sono1 == sono2) {
        return sono1 + '/' + point
    }

    // -------------- ТОРМ ТНО -----------------------------
    return sono1 + '/' + sono2 + '/' + point
}