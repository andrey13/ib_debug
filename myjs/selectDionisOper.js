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

    const msgFooter =
        `<span id="select-stats"></span>` +
        `<div style="width: 100%; text-align: left;">` +
        `<button id='${id_button_sel}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Выбрать</button>` +
        `<button id='${id_button_mod}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Изменить</button>` +
        `<button id='${id_button_add}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Добавить</button>` +
        `<button id='${id_button_del}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Удалить</button>` +
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
            }

            // подключение к точке доступа -----------------------------------------
            if (d.stock2 == 0) {
                row.getCell("ip2").getElement().style.backgroundColor = '#ccffcc'
            }

            // отключение от точки доступа -----------------------------------------
            if (d.stock1 == 0) {
                row.getCell("ip1").getElement().style.backgroundColor = '#ffcccc'
            }
        },

        rowSelectionChanged: function (data, rows) {
            if (data.length == 0) {
                id2e(id_button_mod).disabled = true
                id2e(id_button_del).disabled = true
                id2e(id_button_sel).disabled = true
                id2e(id_button_add).disabled = !isRole("dionis") && !isRole("su")
            } else {
                id2e(id_button_mod).disabled = !isRole("dionis") && !isRole("su")
                id2e(id_button_del).disabled = !isRole("dionis") && !isRole("su")
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
                const res = await edit_dionis_oper(
                    tabulator.getSelectedData()[0],
                    (win_return = win_current)
                )
            }
        },


    })

    id2e(id_button_add).onclick = async () => {
        const d = factory_dionis_oper()
        d.id = await save_dionis_oper(d)

        addTabRow(tabulator, d, (top = false))

        const res = await edit_dionis_oper(
            d,
            (win_return = win_current),
            (mode = "new")
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
function edit_dionis_oper(d, win_return = null, mode = "") {
    return new Promise(function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'edit' + salt

        const id_button_enter = 'ent' + salt
        const id_button_cancel = 'cancel' + salt
        const id_button_prev = 'add' + salt
        const id_button_next = 'del' + salt

        const sel_dionis = 'select_dionis' + salt
        const sel_point1 = 'select_point1' + salt
        const sel_point2 = 'select_point2' + salt

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
            <button id=${sel_dionis} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_sn}}</button> :
            <button id=${sel_point1} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_ip1}}</button> --->
            <button id=${sel_point2} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{comp_ip2}}</button>
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

        //--- View Model-------------------------------------------------------start
        const vapp = Vue.createApp({
            data() {
                return {
                    dv: d,
                    chg: false,
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
            },

        })

        const vm = vapp.use(naive).mount('#' + win_current)
        //--- View Model-------------------------------------------------------stop

        // id_2_set_focus(win_current)

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
    const sql =
        d.id == 0
            ? `INSERT INTO dionis_oper ( 
                id,
                id_dionis,
                id_connect_point1,
                id_connect_point2,
                date,
                dscr,
                comm,
                temp
            ) VALUES (
                ${d.id},
                ${d.id_dionis},
                ${d.id_connect_point1},
                ${d.id_connect_point1},
               '${d.date}',
               '${d.dscr}',
               '${d.comm}',
                ${d.temp}
            )`
            : `UPDATE dionis_oper SET 
                id=${d.id},
                id_dionis=${d.id_dionis},
                id_connect_point1=${d.id_connect_point1},
                id_connect_point2=${d.id_connect_point2},
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
function factory_dionis_oper() {
    return {
        id: 0,
        id_dionis: 0,
        id_connect_point1: 0,
        id_connect_point2: 0,
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
