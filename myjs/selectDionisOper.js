//=============================================================================
function select_dionis_oper(
    sono = '6100',
    id_otdel = 0,
    sklad = 0,
    selectable = 1,
    mode = 'select',
    win_return = null,
    id_oper = 0,
    id_dionis = 0
) {
    // console.log('id_dionis2 = ', id_dionis)
    return new Promise(function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'selectOper' + salt

        if (mode == 'select') {
            newModalWindow(
                win_current, // modal
                'операции Dionis', // html_header
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
            id_dionis
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
    selectable = 1,
    mode = "select",
    win_current = null,
    win_return = null,
    id_oper = 0,
    id_dionis = 0
) {
    // console.log('id_dionis4 = ', id_dionis)
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
        ajaxParams: { d: id_dionis },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: tabHeight,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Операции Dionis<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: selectable,
        selectableRangeMode: "click",
        reactiveData: true,
        footerElement: msgFooter,

        columns: [
            { title: 'id', field: 'id', width: 60, headerFilter: true, topCalc: "count" },
            {
                title: "дата",
                field: "date",
                width: 75,
                headerFilter: true,
                formatter: "datetime",
                formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD.MM.YYYY",
                },
            },
            // { title: 'p1', field: 'id_connect_point1', width: 60, headerFilter: true },
            // { title: 'p2', field: 'id_connect_point2', width: 60, headerFilter: true },    
            {
                title: 'Dinois',
                columns: [
                    { title: 'инв№', field: 'inv_n', width: 100, headerFilter: true },
                    { title: 'SN', field: 'sn', width: 100, headerFilter: true },
                    { title: 'модель', field: 'model', width: 150, headerFilter: true },
                    { title: 'тип', field: 'type', width: 100, headerFilter: true },
                    { title: 'версия', field: 'ver', width: 100, headerFilter: true },
                    { title: 'поставка', field: 'gk_name', width: 90, headerFilter: true },
                ]
            },
            { title: 'операция', field: 'oper_type', width: 100, headerFilter: true },        
            {
                title: 'источник',
                columns: [
                    { title: 'ТНО', field: 'ifns_sono1', width: 60, headerFilter: true },
                    { title: 'ТОРМ', field: 'torm_sono1', width: 62, headerFilter: true },
                    // { 
                    //     title: 'ТОРМ', 
                    //     field: 'torm_sono1', 
                    //     width: 60, 
                    //     headerFilter: true,
                    //     formatter:function(cell, formatterParams, onRendered){
                    //         let d = cell.getRow().getData()
                    //         if (d.ifns_sono1 == d.torm_sono1) return ''
                    //         return cell.getValue()
                    //     }
                    // },
                    { title: '', field: 'ip1', widthGrow: 2, headerFilter: true },
                ]
            },
            {
                title: 'приемник',
                columns: [
                    { title: 'ТНО', field: 'ifns_sono2', width: 60, headerFilter: true },
                    { title: 'ТОРМ', field: 'torm_sono2', width: 62, headerFilter: true },
                    // { 
                    //     title: 'ТОРМ', 
                    //     field: 'torm_sono2', 
                    //     width: 60, 
                    //     headerFilter: true,
                    //     formatter:function(cell, formatterParams, onRendered){
                    //         let d = cell.getRow().getData()
                    //         if (d.ifns_sono2 == d.torm_sono2) return ''
                    //         return cell.getValue()
                    //     }
                    // },
                    { title: '', field: 'ip2', widthGrow: 2, headerFilter: true },
                ]
            },
            { title: 'временно', field: 'temp', width: 90, headerFilter: true },
            { title: 'описание', field: 'dscr', widthGrow: 2, headerFilter: true },
            { title: 'комментарий', field: 'comm', widthGrow: 2, headerFilter: true },
        ],

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
        },

        rowSelectionChanged: function (data, rows) {
            if (data.length == 0) {
                id2e(id_button_mod).disabled = true
                id2e(id_button_del).disabled = true
                id2e(id_button_sel).disabled = true
                id2e(id_button_pr1).disabled = true
                id2e(id_button_pr2).disabled = true
                id2e(id_button_add).disabled = !isRole("dionis") && !isRole("su")
            } else {
                id2e(id_button_mod).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_del).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_sel).disabled = false
                id2e(id_button_pr1).disabled = data[0].oper_type != "передача"
                id2e(id_button_pr2).disabled = data[0].oper_type != "подключение"
                id2e(id_button_add).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_mod).disabled = !isRole("dionis") && !isRole("su")
            }
        },

        cellDblClick: async function (e, cell) {
            // if ((mode == "select")) {
            //     removeModalWindow(win_current, win_return)
            //     resolve(cell.getRow().getData())
            // } else {
            //     const res = await edit_dionis_oper(
            //         tabulator.getSelectedData()[0],
            //         win_current // win_return
            //     )
            // }
            const res = await edit_dionis_oper(
                tabulator.getSelectedData()[0],
                win_current // win_return
            )
    },


    })

    id2e(id_button_pr1).onclick = async () => {
        const id_dionis_oper = tabulator.getSelectedData()[0].id
        // console.log('id_dionis_oper = ', id_dionis_oper)
        print_report1(id_dionis_oper)
    }

    id2e(id_button_pr2).onclick = async () => {
        const id_dionis_oper = tabulator.getSelectedData()[0].id
        // console.log('id_dionis_oper = ', id_dionis_oper)
        print_report2(id_dionis_oper)
    }

    id2e(id_button_add).onclick = async () => {
        const d = factory_dionis_oper()

        d.id = await save_dionis_oper(d)

        addTabRow(tabulator, d, (top = false))

        const res = await edit_dionis_oper(
            d,
            win_current, // win_return
            "new", // mode
            id_dionis
        )
    }


    id2e(id_button_mod).onclick = async () => {
        const res = await edit_dionis_oper(
            tabulator.getSelectedData()[0],
            win_current, // win_return
            "mod" // mode
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
    id_dionis = 0
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
        const sel_user_tno  = 'select_user_tno' + salt
        const sel_user_fku  = 'select_user_fku' + salt

        const header = `<h4>id: ${d.id} операция Dionis</h4>`

        const body = `
        <div style="margin: 0; padding: 10px; height: 600px; background-color: #eeeeee; position: relative;">

            <div class="o3-card" style="display: inline-block; vertical-align: top; height: 100%; width:20%;">
                <label for="d_date">Дата операции:</label><br>
                <input class="o3-border" type="date" id="d_date" v-model="dv.date">
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
                <span>Dionis: <button id=${sel_dionis} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_sn}}</button> </span><br>
                <span v-show="shP1"> Откуда: <button id=${sel_point1} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_ip1}}</button> <input class="o3-border o3-button-300" type="text" v-model="dv.point1_str"></span><br>
                <span v-show="shP2"> Куда:&nbsp;&nbsp; <button id=${sel_point2} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_ip2}}</button> <input class="o3-border o3-button-300" type="text" v-model="dv.point2_str"></span>
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
                        ? "<выбрать сотрудника ФКУ>"
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
                    return ['36', '37', '38', '39', '41'].includes(this.dv.id_oper_type)
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
                'выбор сотрудника УФНС', // headerWin
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
                'выбор сотрудника ТНО', // headerWin
                '400px', // width
                '50%', // marginLeft
                '1%', // marginTop
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
                'выбор сотрудника ФКУ', // headerWin
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
            console.log('d_save = ', d_save)
            table_dionis_opers.updateData([d_save])
            resolve("CANCEL")
        }

        // кнопка применения изменений --------------------------------------------------
        id2e(id_button_enter).onclick = () => {
            console.log('SAVE')
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

            id2e(sel_dionis).innerHTML = vm.$data.dv.sn
            id_2_set_focus(win_current)
        }

        // кнопка выбора источника -----------------------------------------------
        id2e(sel_point1).onclick = async () => {
            const id_depart = isRole("tex") ? g_user.id_depart : 0

            const selected_point = await select_point(
                1,                            // selectable
                'select',                     // mode
                win_current,                  // win_return
                vm.$data.dv.id_connect_point1 // id_point
            )

            const ifns = await sono_2_data(selected_point.ifns_sono)

            vm.$data.dv.id_connect_point1 = selected_point.id
            vm.$data.dv.ip1               = selected_point.ip
            vm.$data.dv.ifns_sono1        = selected_point.ifns_sono
            vm.$data.dv.torm_sono1        = selected_point.torm_sono
            vm.$data.dv.stock1            = selected_point.stock
            vm.$data.dv.point1_str        = ifns.name

            // id2e(sel_point1).innerHTML = vm.$data.dv.ip1
            id_2_set_focus(win_current)
        }

        // кнопка выбора приемника -----------------------------------------------
        id2e(sel_point2).onclick = async () => {
            const id_depart = isRole("tex") ? g_user.id_depart : 0

            const selected_point = await select_point(
                1,                            // selectable
                'select',                     // mode
                win_current,                  // win_return
                vm.$data.dv.id_connect_point2 // id_point
            )

            const ifns = await sono_2_data(selected_point.ifns_sono)

            vm.$data.dv.id_connect_point2 = selected_point.id
            vm.$data.dv.ip2               = selected_point.ip
            vm.$data.dv.ifns_sono2        = selected_point.ifns_sono
            vm.$data.dv.torm_sono2        = selected_point.torm_sono
            vm.$data.dv.stock2            = selected_point.stock
            vm.$data.dv.point2_str        = ifns.name

            // id2e(sel_point2).innerHTML = vm.$data.dv.ip2
            id_2_set_focus(win_current)
        }
    })
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
                point2_str

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
               '${d.point2_str}'
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
                point2_str='${d.point2_str}'
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
        point2_str: ''
    }
}

//=============================================================================
function format_point(
    sono1 = '',
    sono2 = '',
    point = '',
    stock = 0
) {
    console.log(`sono1, sono2, point, stock = ${sono1}, ${sono2}, ${point}, ${stock}`)

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

//=============================================================================
async function print_report1(id_dionis_oper) {
    // параметры шрифта pdf-документа ---------------------------------------------------
    pdfMake.fonts = {
        times: {
            normal: 'times.ttf',
            bold: 'timesbd.ttf',
            italics: 'timesi.ttf',
            bolditalics: 'timesbi.ttf'
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

    let content0 = [
        { text: 'Приложение 1', style: ['header0'] },
        { text: 'к Инструкции (пункт 26), утвержденной', style: ['header0'] },
        { text: 'Приказом Федерального агенства', style: ['header0'] },
        { text: 'правительственной связи и информации', style: ['header0'] },
        { text: 'при Президенте Российской Федерации', style: ['header0'] },
        { text: 'от 13 июня 2001 г. №152', style: ['header0'] },

        { text: `Журнал поэкземплярного учета СКЗИ, эксплуатационной`, style: ['header'] },
        { text: `и технической документации к ним, ключевых документов`, style: ['header'] },
        { text: `(для органа криптографической защиты)`, style: ['header'] },
    ]

    let content1 = await report1_body(id_dionis_oper)

    let content = content0.concat(content1)

    let doc = Object.assign(doc_head, { content: content })

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

    pdfMake.createPdf(doc).open()

    async function report1_body(id_dionis_oper) {
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
                            { text: '1', style: 'tableHeader'},
                            { text: '2', style: 'tableHeader'},
                            { text: '3', style: 'tableHeader'},
                            { text: '4', style: 'tableHeader'},
                            { text: '5', style: 'tableHeader'},
                            { text: '6', style: 'tableHeader'},
                            { text: '7', style: 'tableHeader'},
                            { text: '8', style: 'tableHeader'},
                            { text: '9', style: 'tableHeader'},
                            { text: '10', style: 'tableHeader'},
                            { text: '11', style: 'tableHeader'},
                            { text: '12', style: 'tableHeader'},
                            { text: '13', style: 'tableHeader'},
                            { text: '14', style: 'tableHeader'},
                            { text: '15', style: 'tableHeader'},
                            { text: '16', style: 'tableHeader'},
                        ]

                    ]
                },
                layout: 'szLayout'
            },
        ]

        let model_content_d = await id_oper_2_model_content(id_dionis_oper)
        
        // let sql =
        // `SELECT 
        // do.date,
        // do.id_dionis,
        // d.id_gk,
        // g.date_fns,
        // g.numb_fns,
        // g.date_ufns,
        // g.numb_ufns,
        // v.name as vendor,
        // do.id_user_tno,
        // u.name as user,
        // do.id_connect_point2,
        // cp.id_torm,
        // t.name as tno, 
        // do.date as oper_date
        // FROM dionis_oper as do 
        // left join dionis as d on d.id=do.id_dionis 
        // left join goskontrakt as g on g.id=d.id_gk 
        // left join vendor v on v.id=g.id_vendor 
        // left join user as u on u.id=do.id_user_tno 
        // left join connect_point as cp on cp.id=do.id_connect_point2 
        // left join torm as t on t.id=cp.id_torm 
        // WHERE do.id = ${id_dionis_oper}`

        // let res = await runSQL_p(sql)
        // let data = await JSON.parse(res)[0]

        let data   = await id_oper_2_date(id_dionis_oper)
        let d36    = await dionis_oper_2_dionis_oper(id_dionis_oper, 37, 36)
        let data36 = await id_oper_2_date(d36.id)



        console.log('data = ', data)


        let table_content = []
        let i = 0
    
        model_content_d.forEach((d) => {
            let sn = d.sn == '{{sn}}' ? d.dionis_sn : d.sn
            table_content[i] = [
                '', 
                { text: d.name, style: 'tableCell' }, 
                { text: sn, style: 'tableV' }, 
                { text: '1', style: 'tableHV' },
                { text: data.vendor, style: 'tableCell' },
                { text: date2date(data.date_fns) + '\n' + data.numb_fns, style: 'tableCell' },
                // { text: data.ifns2, style: 'tableCell' }, 
                { text: data.point2_str, style: 'tableCell' }, 
                { text: date2date(data.date_ufns) + '\n' + data.numb_ufns, style: 'tableCell' }, 
                { text: date2date(data.date) + '\n' + fio2fio0(data.user_tno), style: 'tableCell' }, 
                '', 
                '', 
                '', 
                '', 
                '', 
                '', 
                '', 
            ]
            i += 1
        })



        table_head[1].table.body = table_head[1].table.body.concat(table_content)

        // console.log('table_head = ', table_head)

        return table_head
    }
}

//=============================================================================
async function print_report2(id_dionis_oper) {
    // параметры шрифта pdf-документа ---------------------------------------------------
    pdfMake.fonts = {
        times: {
            normal: 'times.ttf',
            bold: 'timesbd.ttf',
            italics: 'timesi.ttf',
            bolditalics: 'timesbi.ttf'
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

    let content0 = [
        { text: 'Приложение 1', style: ['header0'] },
        { text: 'к Инструкции (пункт 26), утвержденной', style: ['header0'] },
        { text: 'Приказом Федерального агенства', style: ['header0'] },
        { text: 'правительственной связи и информации', style: ['header0'] },
        { text: 'при Президенте Российской Федерации', style: ['header0'] },
        { text: 'от 13 июня 2001 г. №152', style: ['header0'] },

        { text: `Журнал поэкземплярного учета СКЗИ, эксплуатационной`, style: ['header'] },
        { text: `и технической документации к ним, ключевых документов`, style: ['header'] },
        { text: `(для обладателя криптографической информации)`, style: ['header'] },
    ]

    let content1 = await report2_body(id_dionis_oper)

    let content = content0.concat(content1)

    let doc = Object.assign(doc_head, { content: content })

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

    pdfMake.createPdf(doc).open()

    async function report2_body(id_dionis_oper) {
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
                            { text: '1', style: 'tableHeader'},
                            { text: '2', style: 'tableHeader'},
                            { text: '3', style: 'tableHeader'},
                            { text: '4', style: 'tableHeader'},
                            { text: '5', style: 'tableHeader'},
                            { text: '6', style: 'tableHeader'},
                            { text: '7', style: 'tableHeader'},
                            { text: '8', style: 'tableHeader'},
                            { text: '9', style: 'tableHeader'},
                            { text: '10', style: 'tableHeader'},
                            { text: '11', style: 'tableHeader'},
                            { text: '12', style: 'tableHeader'},
                            { text: '13', style: 'tableHeader'},
                            { text: '14', style: 'tableHeader'},
                            { text: '15', style: 'tableHeader'},
                            // {},
                        ]

                    ]
                },
                layout: 'szLayout'
            },
        ]

        let model_content_d = await id_oper_2_model_content(id_dionis_oper)      
        let data39          = await id_oper_2_date(id_dionis_oper)
        let d36             = await dionis_oper_2_dionis_oper(id_dionis_oper, 39, 36)
        let data36          = await id_oper_2_date(d36.id)

        let table_content = []
        let i = 0
    
        model_content_d.forEach((d) => {
            let sn = d.sn == '{{sn}}' ? d.dionis_sn : d.sn
            let user_fku = d.sn == '{{sn}}' ? data39.user_fku : ''
            let date_fku = d.sn == '{{sn}}' ? date2date(data39.date) : ''
            table_content[i] = [
                '', 
                { text: d.name, style: 'tableCell' }, 
                { text: sn, style: 'tableV' }, 
                { text: '1', style: 'tableHV' },
                { text: data36.ifns1, style: 'tableCell' },
                { text: date2date(data36.date_ufns) + '\n' + data36.numb_ufns, style: 'tableCell' },
                { text: data39.user_tno, style: 'tableCell' }, 
                { text: date2date(data39.date), style: 'tableCell' }, 
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

        // console.log('table_head = ', table_head)

        return table_head
    }
}