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
    console.log('id_dionis2 = ', id_dionis)
    return new Promise(function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'selectOper' + salt

        if (mode == 'select') {
            newModalWindow(
                modal = win_current,
                html_header = 'операции Dionis',
                html_body = '',
                html_footer = '',
                width = '90%',
                marginLeft = '5%',
                marginTop = '3%',
                win_return
            )
        }

        const appHeight = appBodyHeight()

        console.log('id_dionis3 = ', id_dionis)

        table_dionis_opers = tabulator_dionis_opers(
            div = (mode == 'select') ? win_current + 'Body' : 'appBody',
            sono,
            tabHeight = (mode == 'select') ? appHeight * 0.9 : appHeight,
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
/////////////////////////////////////////////////////////////////////////////////////////
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
    console.log('id_dionis4 = ', id_dionis)
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
                row.getCell("oper_type").getElement().style.backgroundColor = '#ccccff'
            }

            // передача оборудования -----------------------------------------------
            if (d.stock1 == 1 && d.stock2 == 1) {
                row.getCell("oper_type").getElement().style.backgroundColor = '#ffccff'
                row.getCell("ip1").getElement().style.backgroundColor = '#ffccff'
                row.getCell("ip2").getElement().style.backgroundColor = '#ffccff'
                row.getCell("ifns_sono2").getElement().style.backgroundColor = '#ffccff'
                row.getCell("torm_sono2").getElement().style.backgroundColor = '#ffccff'
            }

            // подключение к точке доступа -----------------------------------------
            if (d.stock2 == 0) {
                row.getCell("oper_type").getElement().style.backgroundColor = '#ccffcc'
                row.getCell("ip2").getElement().style.backgroundColor = '#ccffcc'
            }

            // отключение от точки доступа -----------------------------------------
            if (d.stock1 == 0) {
                row.getCell("oper_type").getElement().style.backgroundColor = '#ffcccc'
                row.getCell("ip1").getElement().style.backgroundColor = '#ffcccc'
            }
        },

        rowSelectionChanged: function (data, rows) {
            if (data.length == 0) {
                id2e(id_button_mod).disabled = true
                id2e(id_button_del).disabled = true
                id2e(id_button_sel).disabled = true
                id2e(id_button_pr1).disabled = true
                id2e(id_button_add).disabled = !isRole("dionis") && !isRole("su")
            } else {
                id2e(id_button_mod).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_del).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_sel).disabled = false
                id2e(id_button_pr1).disabled = false
                id2e(id_button_add).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_mod).disabled = !isRole("dionis") && !isRole("su")
            }
        },

        cellDblClick: async function (e, cell) {
            if ((mode == "select")) {
                removeModalWindow(win_current, win_return)
                resolve(cell.getRow().getData())
            } else {
                const res = await edit_dionis_oper(
                    tabulator.getSelectedData()[0],
                    (win_return = win_current)
                )
            }
        },


    })

    id2e(id_button_pr1).onclick = async () => {
        const id_dionis_oper = tabulator.getSelectedData()[0].id
        console.log('id_dionis_oper = ', id_dionis_oper)
        print_report1(id_dionis_oper)
    }

    id2e(id_button_add).onclick = async () => {
        const d = factory_dionis_oper()

        d.id = await save_dionis_oper(d)

        addTabRow(tabulator, d, (top = false))

        const res = await edit_dionis_oper(
            d,
            (win_return = win_current),
            (mode = "new"),
            id_dionis
        )
    }


    id2e(id_button_mod).onclick = async () => {
        const res = await edit_dionis_oper(
            tabulator.getSelectedData()[0],
            (win_return = win_current),
            (mode = "mod")
        )
    }

    id2e(id_button_del).onclick = async () => {
        const ans = await dialogYESNO(
            (text = "Удалить операцию"),
            (win_return = win_current)
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

/////////////////////////////////////////////////////////////////////////////////////////
function edit_dionis_oper(
    d,
    win_return = null,
    mode = "",
    id_dionis = 0
) {
    return new Promise(async function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'edit' + salt

        if (mode == 'new' && id_dionis != 0) {
            const d_dionis = await id_2_data(id_dionis, 'dionis')
            d.id_dionis = id_dionis
            d.sn = d_dionis.sn
            console.log('d_dionis = ', d_dionis)
        }

        console.log('d(dionis_oper) =', d)
        //const oper_types = (await id_taxonomy_2_types(7)).map(i => i.name)
        const oper_types = await id_taxonomy_2_types(7)
        console.log('oper_types = ', oper_types)


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
        <div style="margin: 0; padding: 1%;">
            {{dv.id_dionis}} : {{dv.id_connect_point1}} ---> {{dv.id_connect_point2}}
            <br>
            <br>
            <input class="o3-border" type="date" id="d_date" v-model="dv.date">
            <label for="d_date">  Дата операции</label>
            <br>
            <br>
            <div>
                <n-switch :rail-style="style_temp"
                    size="small"                          
                    checked-value="1"
                    unchecked-value="0"
                    v-model:value="dv.temp"
                />                                   
            </div>
            {{ (dv.temp == "0") ? "на баланс" : "на временное хранение" }}
            <br>
            <br>
            <div>
                <n-radio-group v-model:value="dv.id_oper_type" name="radiogroup">
                    <n-radio
                        v-for="otype in operTypes"
                        :key="otype.id"
                        :value="otype.id"
                        :label="otype.name"
                    />
                </n-radio-group>{{dv.id_oper_type}}
            </div>
            <br>
            <br>
            <button id=${sel_dionis} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_sn}}</button> :
            <button id=${sel_point1} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_ip1}}</button> --->
            <button id=${sel_point2} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_ip2}}</button>
            <br>
            <br>
            <div v-show="shUFNS">      
                исполнитель УФНС:<br>
                <button id=${sel_user_ufns} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{user_ufns}}</button>
            </div>
            <div v-show="shTNO">      
                исполнитель ТНО:<br>
                <button id=${sel_user_tno} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{user_tno}}</button>
            </div>
            <div v-show="shFKU">      
                исполнитель ФКУ:<br>
                <button id=${sel_user_fku} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{user_fku}}</button>
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
        </div>`


        const foot = ``
        const selType0 = "передача"

        const esc = mode == "new"
            ? () => {
                remove_selected_dionis_oper()
                vapp.unmount()
            }
            : () => {
                console.log("esc_callback")
                vapp.unmount()
            }

        newModalWindow(
            win_current,
            header,
            body,
            foot,
            (width = "60%"),
            (marginLeft = "15%"),
            (marginTop = "5%"),
            win_return,
            esc
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
                    }

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
                        // : this.dv.ifns_sono1 + '/' + this.dv.torm_sono1 + '/' + this.dv.ip1
                        : format_point(this.dv.ifns_sono1, this.dv.torm_sono1, this.dv.ip1, this.dv.stock1)
                },
                comp_ip2() {
                    return !!!this.dv.ip2
                        ? "<выбрать приемник>"
                        // : this.dv.ifns_sono2 + '/' + this.dv.torm_sono2 + '/' + this.dv.ip2
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
                    return this.dv.id_oper_type == 37
                },
                shFKU() {
                    return this.dv.id_oper_type == 39
                },

            },

        })

        const vm = vapp.use(naive).mount('#' + win_current)
        //--- View Model-------------------------------------------------------stop

        // id_2_set_focus(win_current)

        // кнопка выбора сотрудника УФНС -----------------------------------------------
        id2e(sel_user_ufns).onclick = async () => {
            const selected_user = await selectUser(
                sono = '',
                esk = '',
                id_depart = 0,
                selectable = 1,
                headerWin = 'выбор сотрудника УФНС',
                width = '400px',
                marginLeft = '50%',
                marginTop = '1%',
                win_return = win_current,
                id_user = vm.$data.dv.id_user_ufns
            )

            vm.$data.dv.id_user_ufns = selected_user[0].id
            vm.$data.dv.user_ufns = selected_user[0].name

            id2e(sel_user_ufns).innerHTML = vm.$data.dv.user_ufns
            id_2_set_focus(win_current)
        }

        // кнопка выбора сотрудника ТНО -----------------------------------------------
        id2e(sel_user_tno).onclick = async () => {
            const selected_user = await selectUser(
                sono='',
                esk='',
                id_depart = 0,
                selectable = 1,
                headerWin = 'выбор сотрудника ТНО',
                width = '400px',
                marginLeft = '50%',
                marginTop = '1%',
                win_return = win_current,
                id_user = vm.$data.dv.id_user_tno
            )

            vm.$data.dv.id_user_tno = selected_user[0].id
            vm.$data.dv.user_tno = selected_user[0].name

            id2e(sel_user_ufns).innerHTML = vm.$data.dv.user_tno
            id_2_set_focus(win_current)
        }

        // кнопка выбора сотрудника ФКУ -----------------------------------------------
        id2e(sel_user_fku).onclick = async () => {
            const selected_user = await selectUser(
                sono='',
                esk='',
                id_depart = 0,
                selectable = 1,
                headerWin = 'выбор сотрудника ФКУ',
                width = '400px',
                marginLeft = '50%',
                marginTop = '1%',
                win_return = win_current,
                id_user = vm.$data.dv.id_user_fku
            )

            vm.$data.dv.id_user_fku = selected_user[0].id
            vm.$data.dv.user_fku = selected_user[0].name

            id2e(sel_user_ufns).innerHTML = vm.$data.dv.user_fku
            id_2_set_focus(win_current)
        }

        id2e(id_button_enter).onclick = () => {
            const d = vm.$data.dv
            vapp.unmount()
            save_dionis_oper(d)
            removeModalWindow(win_current, win_return)
            table_dionis_opers.updateRow(d.id, d)
            table_dionis_opers.redraw()
            resolve("OK")
        }

        // кнопка отмены изменений --------------------------------------------------
        id2e(id_button_cancel).onclick = () => {
            vapp.unmount()
            if (mode == "new") remove_selected_dionis_oper()
            removeModalWindow(win_current, win_return)
            resolve("CANCEL")
        }

        id2e(id_button_prev).onclick = () => {
            const d = vm.$data.dv
            save_dionis_oper(d)
            table_dionis_opers.updateRow(d.id, d)
            table_dionis_opers.redraw()
            const selected_row = table_dionis_opers.getSelectedRows()[0]
            const id_curr = selected_row.id
            const id_prev = selected_row.getPrevRow().getData().id
            table_dionis_opers.deselectRow(id_curr)
            table_dionis_opers.selectRow(id_prev)
            table_dionis_opers.scrollToRow(id_prev, "center", false)
            const d_prev = table_dionis_opers.getSelectedData()[0]
            vm.$data.dv = d_prev
            vm.$data.chg = false
        }

        // кнопка перехода на следующее МТС -----------------------------------------
        id2e(id_button_next).onclick = () => {
            const d = vm.$data.dv
            save_dionis_oper(d)
            table_dionis_opers.updateRow(d.id, d)
            table_dionis_opers.redraw()
            const selected_row = table_dionis_opers.getSelectedRows()[0]
            const id_curr = selected_row.id
            const id_next = selected_row.getNextRow().getData().id
            table_dionis_opers.deselectRow(id_curr)
            table_dionis_opers.selectRow(id_next)
            table_dionis_opers.scrollToRow(id_next, "center", false)
            const d_next = table_dionis_opers.getSelectedData()[0]
            vm.$data.dv = d_next
            vm.$data.chg = false
        }

        // кнопка выбора Dionis -----------------------------------------------
        id2e(sel_dionis).onclick = async () => {
            const id_depart = isRole("tex") ? g_user.id_depart : 0

            const selected_dionis = await select_dionis(
                sono = "6100",
                id_otdel = id_depart,
                sklad = 1,
                id_type_oper = 0,
                selectable = 1,
                mode = 'select',
                win_return = win_current,
                id_dionis = vm.$data.dv.id_dionis
            )

            console.log('selected_dionis = ', selected_dionis)

            vm.$data.dv.id_dionis = selected_dionis.id
            vm.$data.dv.sn = selected_dionis.sn
            vm.$data.dv.type = selected_dionis.type
            vm.$data.dv.ver = selected_dionis.ver

            id2e(sel_dionis).innerHTML = vm.$data.dv.sn
            id_2_set_focus(win_current)
        }

        // кнопка выбора источника -----------------------------------------------
        id2e(sel_point1).onclick = async () => {
            console.log('sel_point1')
            const id_depart = isRole("tex") ? g_user.id_depart : 0

            const selected_point = await select_point(
                selectable = 1,
                mode = 'select',
                win_return = win_current,
                id_point = vm.$data.dv.id_connect_point1
            )

            console.log('selected_point = ', selected_point)

            vm.$data.dv.id_connect_point1 = selected_point.id
            vm.$data.dv.ip1 = selected_point.ip
            vm.$data.dv.ifns_sono1 = selected_point.ifns_sono
            vm.$data.dv.torm_sono1 = selected_point.torm_sono
            vm.$data.dv.stock1 = selected_point.stock

            id2e(sel_point1).innerHTML = vm.$data.dv.ip1
            id_2_set_focus(win_current)
        }

        // кнопка выбора приемника -----------------------------------------------
        id2e(sel_point2).onclick = async () => {
            console.log('sel_point2')
            const id_depart = isRole("tex") ? g_user.id_depart : 0

            const selected_point = await select_point(
                selectable = 1,
                mode = 'select',
                win_return = win_current,
                id_point = vm.$data.dv.id_connect_point2
            )

            console.log('selected_point = ', selected_point)

            vm.$data.dv.id_connect_point2 = selected_point.id
            vm.$data.dv.ip2 = selected_point.ip
            vm.$data.dv.ifns_sono2 = selected_point.ifns_sono
            vm.$data.dv.torm_sono2 = selected_point.torm_sono
            vm.$data.dv.stock2 = selected_point.stock

            id2e(sel_point2).innerHTML = vm.$data.dv.ip2
            id_2_set_focus(win_current)
        }
    })
}

/////////////////////////////////////////////////////////////////////////////////////////
function remove_selected_dionis_oper() {
    let id_oper = table_dionis_opers.getSelectedData()[0].id
    del_dionis_oper(id_oper)
    table_dionis_opers.deleteRow(id_oper)
    id_oper = getFirstID(table_dionis_opers)
    table_dionis_opers.selectRow(id_oper)
}

/////////////////////////////////////////////////////////////////////////////////////////
async function new_dionis_oper() {
    const id = await runSQL_p("INSERT INTO dionis_oper () VALUES ()")
    return id
}

/////////////////////////////////////////////////////////////////////////////////////////
async function save_dionis_oper(d) {
    console.log('d = ', d)
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
                temp
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
                ${d.temp}
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
                temp=${d.temp}
            WHERE id=${d.id}`

    return runSQL_p(sql)
}

/////////////////////////////////////////////////////////////////////////////////////////
function del_dionis_oper(id) {
    runSQL_p(`DELETE FROM dionis_oper WHERE id=${id}`)
}

/////////////////////////////////////////////////////////////////////////////////////////
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
        temp: 0
    }
}

/////////////////////////////////////////////////////////////////////////////////////////
function format_point(
    sono1 = '',
    sono2 = '',
    point = '',
    stock = 0
) {
    // console.log(`sono1, sono2, point, stock = ${sono1}, ${sono2}, ${point}, ${stock}`)

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

/////////////////////////////////////////////////////////////////////////////////////////
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


    /////////////////////////////////////////////////////////////////////////////////////////
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

        let datas = await id_oper_2_model_content(id_dionis_oper)

        let table_content = []
        let i = 0
    
        datas.forEach((d) => {
            let sn = d.sn == '{{sn}}' ? d.dionis_sn : d.sn
            table_content[i] = [
                '', 
                { text: d.name, style: 'tableCell' }, 
                { text: sn, style: 'tableV' }, 
                { text: '1', style: 'tableHV' },
                '', 
                '', 
                '', 
                '', 
                '', 
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

        console.log('table_head = ', table_head)

        return table_head
    }
}