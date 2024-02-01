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
                win_current, // modal
                'Dionis',    // html_header
                '',          // html_body
                '',          // html_footer
                '90%',       // width
                '5%',        // marginLeft
                '3%',        // marginTop
                win_return   // win_return
            )
        }

        const appHeight = appBodyHeight()

        table_select_dionis = tabulator_select_dionis(
            (mode == 'select') ? win_current + 'Body' : 'appBody', // div
            sono,
            (mode == 'select') ? appHeight * 0.9 : appHeight,      // tabHeight
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

        if (mode == "select") id_2_set_focus(win_current)
    })
}

//=======================================================================================
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
        { title: "временно", field: "temp", width: 70, headerFilter: true },
        { title: "операций", field: "n_opers", width: 70, headerFilter: true },
        { title: "SN", field: "sn", widthGrow: 2, headerFilter: true },
        // { title: "тип", field: "type", widthGrow: 2, headerFilter: true },
        { title: "тип", field: "type_name", width: 80, headerFilter: true },
        // { title: "Модель", field: "model", widthGrow: 2, headerFilter: true },
        { title: "Модель", field: "model_name", widthGrow: 2, headerFilter: true },
        { title: "Инв №", field: "inv_n", widthGrow: 2, headerFilter: true },
        { title: "Версия", field: "ver", widthGrow: 2, headerFilter: true },
        // { title: "Сертификат", field: "date_sert", widthGrow: 2, headerFilter: true },
        { title: "Статус", field: "status", widthGrow: 2, headerFilter: true },
        // { title: "Поставка", field: "postavka", width: 80, headerFilter: true },
        { title: "Поставка", field: "gk_name", width: 80, headerFilter: true },
        {//группа владелец
            title: "ВЛАДЕЛЕЦ", headerHozAlign:"center",
            columns: [
                {
                    title: "СОНО", field: "ifns_sono1", widthGrow: 1, headerFilter: true,
                    // formatter: function (cell, formatterParams) {
                    //     var d = cell.getRow().getData()
                    //     return (d.temp == 1) ? d.ifns_sono1 : d.ifns_sono2
                    // }
                },
                {
                    title: "ТНО", field: "t1name", widthGrow: 3, headerFilter: true,
                    // formatter: function (cell, formatterParams) {
                    //     var d = cell.getRow().getData()
                    //     return (d.temp == 1) ? d.t1name : d.t2name
                    // }
                },
            ],
        },
        {//группа нахождение
            title: "НАХОЖДЕНИЕ", headerHozAlign:"center",
            columns: [
                { title: "СОНО", field: "ifns_sono2", widthGrow: 1, headerFilter: true },
                { title: "ТНО", field: "t2name", widthGrow: 3, headerFilter: true },
            ],
        },
        // {
        //     title: "дата установки",
        //     field: "date2",
        //     width: 80,
        //     headerFilter: true,
        //     formatter: "datetime",
        //     formatterParams: {
        //         inputFormat: "YYYY-MM-DD",
        //         outputFormat: "DD.MM.YYYY",
        //     },
        // },
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
    const id_checkb_xls = 'xls' + salt

    const id_checkb_ust = 'ust' + salt // установлен
    const id_checkb_rez = 'rez' + salt // резерв
    const id_checkb_nei = 'nei' + salt // неисправен
    const id_checkb_spi = 'spi' + salt // на списании

    const str_ust = 'Установлен'
    const str_rez = 'Резерв'
    const str_nei = 'Неисправен'
    const str_spi = 'На списании'

    let flag_ust = true
    let flag_rez = true
    let flag_nei = true
    let flag_spi = true

    // `&nbsp;&nbsp;&nbsp;данные exel&nbsp;<input type='checkbox' id='${id_checkb_xls}' unchecked style="vertical-align: middle;">` +
    // `&nbsp;&nbsp;&nbsp;результат операций&nbsp;<input type='checkbox' id='${id_checkb_opr}' checked style="vertical-align: middle;">` +
    // `&nbsp;&nbsp;&nbsp;кратко&nbsp;<input type='checkbox' id='${id_checkb_sht}' unchecked style="vertical-align: middle;">` +
    // `&nbsp;&nbsp;&nbsp;установлен&nbsp;<input type='checkbox' id='${id_checkb_ust}' checked style="vertical-align: middle;">` +
    // `&nbsp;&nbsp;&nbsp;резерв&nbsp;<input type='checkbox' id='${id_checkb_rez}' checked style="vertical-align: middle;">` +
    // `&nbsp;&nbsp;&nbsp;неисправен&nbsp;<input type='checkbox' id='${id_checkb_nei}' checked style="vertical-align: middle;">` +
    // `&nbsp;&nbsp;&nbsp;на списании&nbsp;<input type='checkbox' id='${id_checkb_spi}' checked style="vertical-align: middle;">` +

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
        selectable: 1,
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
            let sono4 = d.ifns_sono2
            let id = d.id

            // данные exel совпадают с данными операций
            // if (!!sono1 && !!sono2 && !!sono3 && !!sono4) {
            //     sono1 = sono1.toString().trim()
            //     sono2 = sono2.toString().trim()
            //     sono3 = sono3.toString().trim()
            //     sono4 = sono4.toString().trim()
            //     if (sono1 == sono3 && sono2 == sono4) {
            //         row.getCell("id").getElement().style.backgroundColor = '#ccffcc'
            //     }
            // }
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
                console.log('dionis_select = ', cell.getRow().getData())
                resolve(cell.getRow().getData())
            } else {
                const d = tabulator.getSelectedData()[0]
                const title = d.sn

                select_dionis_oper(
                    '6100',    // sono
                    0,         // id_otdel
                    0,         // sklad
                    1,         // selectable
                    'select',  // mode
                    null,      // win_return
                    0,         // id_oper
                    d.id,      // id_dionis
                    0,         // id_torm
                    title      // title
                )
            }
        },

    })

    id2e(id_button_sel).onclick = () => {
        removeModalWindow(win_current, win_return)
        console.log('dionis_select = ', tabulator.getSelectedData()[0])
        resolve(tabulator.getSelectedData()[0])
    }

    id2e(id_button_add).onclick = async () => {
        const d = factory_dionis()
        d.id = await save_dionis(d)

        addTabRow(tabulator, d, (top = true))

        const res = await edit_dionis(
            d,           // d
            win_current, // win_return
            "new"        // mode
        )
    }

    id2e(id_button_mod).onclick = async () => {
        const res = await edit_dionis(
            tabulator.getSelectedData()[0], // d
            win_current,                    // win_return
            "mod"                           // mode
        )
    }

    id2e(id_button_del).onclick = async () => {
        const ans = await dialogYESNO(
            "Удалить Dionis", // text
            win_current       // win_return
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
        select_dionis_oper(
            '6100',      // sono
            0,           // id_otdel
            0,           // sklad
            1,           // selectable
            'select',    // mode
            null,        // win_return
            0,           // id_oper
            tabulator.getSelectedData()[0].id, // id_dionis
            0
        )
    }

    // id2e(id_checkb_ust).onclick = () => {
    //     flag_ust = id2e(id_checkb_ust).checked 
    //     set_Filter()
    // }

    // id2e(id_checkb_rez).onclick = () => {
    //     flag_rez = id2e(id_checkb_rez).checked 
    //     set_Filter()
    // }

    // id2e(id_checkb_nei).onclick = () => {
    //     flag_nei = id2e(id_checkb_nei).checked 
    //     set_Filter()
    // }

    // id2e(id_checkb_spi).onclick = () => {
    //     flag_spi = id2e(id_checkb_spi).checked 
    //     set_Filter()
    // }

    // id2e(id_checkb_xls).onclick = () => {
    //     if (id2e(id_checkb_xls).checked) {
    //         tabulator.showColumn('sono1')
    //         tabulator.showColumn('sono2')
    //         tabulator.showColumn('ifns1')
    //         tabulator.showColumn('ifns2')
    //         tabulator.redraw()
    //     } else {
    //         tabulator.hideColumn('sono1')
    //         tabulator.hideColumn('sono2')
    //         tabulator.hideColumn('ifns1')
    //         tabulator.hideColumn('ifns2')
    //         tabulator.redraw()
    //     }
    // }

    // id2e(id_checkb_opr).onclick = () => {
    //     if (id2e(id_checkb_opr).checked) {
    //         tabulator.showColumn('temp')
    //         tabulator.showColumn('ifns_sono1')
    //         tabulator.showColumn('ifns_sono2')
    //         tabulator.showColumn('t1name')
    //         tabulator.showColumn('t2name')
    //         tabulator.redraw()
    //     } else {
    //         tabulator.hideColumn('temp')
    //         tabulator.hideColumn('ifns_sono1')
    //         tabulator.hideColumn('ifns_sono2')
    //         tabulator.hideColumn('t1name')
    //         tabulator.hideColumn('t2name')
    //         tabulator.redraw()
    //     }
    // }

    // id2e(id_checkb_sht).onclick = () => {
    //     if (id2e(id_checkb_sht).checked) {
    //         tabulator.hideColumn('type')
    //         tabulator.hideColumn('model')
    //         tabulator.hideColumn('ver')
    //         // tabulator.hideColumn('date_sert')
    //         tabulator.hideColumn('date2')
    //         tabulator.hideColumn('comm')
    //         tabulator.redraw()
    //     } else {
    //         tabulator.showColumn('type')
    //         tabulator.showColumn('model')
    //         tabulator.showColumn('ver')
    //         // tabulator.showColumn('date_sert')
    //         tabulator.showColumn('date2')
    //         tabulator.showColumn('comm')
    //         tabulator.redraw()
    //     }
    // }

    tabulator.hideColumn('sono1')
    tabulator.hideColumn('sono2')
    tabulator.hideColumn('ifns1')
    tabulator.hideColumn('ifns2')

    tabulator.showColumn('temp')
    tabulator.showColumn('ifns_sono1')
    tabulator.showColumn('ifns_sono2')
    tabulator.showColumn('t1name')
    tabulator.showColumn('t2name')

    // set_Filter()

    tabulator.redraw()   

    return tabulator

    function set_Filter() {

        const str_Filter = (
            (flag_ust ? str_ust + ' ' : '') + 
            (flag_rez ? str_rez + ' ' : '') +
            (flag_nei ? str_nei + ' ' : '') +
            (flag_spi ? str_spi : '')
        ).trim()

        const arr_Filter = []
        if (flag_ust) arr_Filter.push(str_ust)
        if (flag_rez) arr_Filter.push(str_rez)
        if (flag_nei) arr_Filter.push(str_nei)
        if (flag_spi) arr_Filter.push(str_spi)

        console.log(`str_Filter = |${str_Filter}|`)
        // tabulator.setFilter('status', 'keywords', str_Filter)
        console.log('arr_Filter = ', arr_Filter)

        if (g_user.sono == '6100') {
            tabulator.setFilter([
                {field: 'status', type: 'in', value: arr_Filter},
            ])
        } else {
            tabulator.setFilter([
                {field: 'status', type: 'in', value: arr_Filter},
                [
                    {field: 'ifns_sono1', type: '=', value: g_user.sono},
                    {field: 'ifns_sono2', type: '=', value: g_user.sono},
                ]
            ])
    
        }
    }
    

}

//=======================================================================================
function edit_dionis(d, win_return = null, mode = "") {

    return new Promise(function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'editdionis' + salt

        const headerdionis = `<h4>параметры СКЗИ</h4>`

        const sel_gk = 'select_gk' + salt
        const sel_model = 'select_model' + salt

        // <div style="display: inline-block; width:50%; padding: 1px;">
        // По данным таблицы XLS (Буримов):<br><br>
        // ТНО приписки:<br>
        // <input class="o3-border" type="text" v-model="dv.sono1"><br>
        // <textarea rows="3" style="width:100%" v-model="dv.ifns1"></textarea><br><br>
        // ТНО нахождения:<br>
        // <input class="o3-border" type="text" v-model="dv.sono2"><br>
        // <textarea rows="3" style="width:100%" v-model="dv.ifns2"></textarea><br><br>
        // </div>
        // По данным операций Dionis:<br><br>
        // <div style="display: inline-block; width:50%; padding: 1px;">
        // </div>

        // <input class="o3-border" type="text" v-model="dv.date2"> - дата установки<br>


        const bodydionis = `

        <div style="margin: 0; padding: 1%;">
                ТНО приписки:<br>
                <input class="o3-border" type="text" disabled v-model="calc_sono1"><br>
                <textarea rows="3" style="width:100%" disabled v-model="calc_torm1"></textarea><br><br>
                ТНО нахождения:<br>
                <input class="o3-border" type="text" disabled v-model="dv.ifns_sono2"><br>
                <textarea rows="3" style="width:100%" disabled v-model="dv.t2name"></textarea><br><br>

            <input class="o3-border" type="text" v-model="dv.status"> - статус<br>
            <input class="o3-border" type="text" v-model="dv.inv_n"> - инвентарный номер<br>
            <input class="o3-border" type="text" v-model="dv.sn"> - заводской номер<br>
            <input class="o3-border" type="text" v-model="dv.sn1"> - заводской номер 1<br>
            <input class="o3-border" type="text" v-model="dv.sn2"> - заводской номер 2<br>
            <input class="o3-border" type="text" v-model="dv.ver"> - версия<br>
            <br>      
            модель/тип:<br>
            <button id=${sel_model} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{model_type}}</button>
            <br>
            <br>     
            поставка:<br>
            <button id=${sel_gk} class="w3-btn w3-padding-small o3-button-200 w3-hover-teal">{{goskontrakt}}</button>
            <br>
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

        const footdionis = ``

        const esc_dionis = mode == "new"
            ? () => {
                remove_selected_dionis()
                vapp.unmount()
            }
            : () => {
                // console.log("esc_callback")
                vapp.unmount()
            }

        newModalWindow(
            win_current,
            headerdionis,
            bodydionis,
            footdionis,
            "60%", // width
            "15%", // marginLeft
            "5%",  // marginTop
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
            computed: {
                calc_sono1() {return this.dv.temp == 1 ? this.dv.ifns_sono1 : this.dv.ifns_sono2},
                calc_torm1() {return this.dv.temp == 1 ? this.dv.t1name : this.dv.t2name},
                goskontrakt() {
                    return !!!this.dv.gk_name
                        ? "<выбрать ГК>"
                        : this.dv.gk_name
                },
                model_type() {
                    return !!!this.dv.model_name
                        ? "<выбрать модель>"
                        : this.dv.model_name + '/' + this.dv.type_name
                },
            },
        })

        const vm = vapp.use(naive).mount('#' + win_current)
        //--- View Model-------------------------------------------------------stop

        // кнопка выбора модели -----------------------------------------------
        id2e(sel_model).onclick = async () => {
            // console.log('sel_gk')

            const selected_model = await select_dionis_model(
                1,                   // selectable
                'select',            // mode
                win_current,         // win_return
                vm.$data.dv.id_model // id_model
            )

            vm.$data.dv.id_model = selected_model.id
            vm.$data.dv.model_name = selected_model.model
            vm.$data.dv.type_name = selected_model.type

            id2e(sel_model).innerHTML = vm.$data.dv.model_name + '/' + vm.$data.dv.type_name
            id_2_set_focus(win_current)
        }
        
        // кнопка выбора ГК -----------------------------------------------
        id2e(sel_gk).onclick = async () => {
            // console.log('sel_gk')

            const selected_gk = await select_gk(
                1,                // selectable
                'select',         // mode
                win_current,      // win_return
                vm.$data.dv.id_gk // id_gk
            )

            // console.log('selected_gk = ', selected_gk)

            vm.$data.dv.id_gk = selected_gk.id
            vm.$data.dv.gk_name = selected_gk.name

            id2e(sel_gk).innerHTML = vm.$data.dv.gk_name
            id_2_set_focus(win_current)
        }

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

//=======================================================================================
async function show_dionis_history(id_dionis, win_return = null) {
    const data_dionis = await id_2_data(id_dionis, 'dionis')
    const win_current = 'historydionis' + randomStr(10)
    const header = `<h4>история Dionis id: ${data_dionis.id}, SN: ${data_dionis.SN}</h4>`
    const body = `<div class="w3-container"></div>`
    const foot = ``

    const esc_dionis_history = () => {
        // console.log("esc_callback")
    }

    newModalWindow(
        win_current, 
        header, 
        body, 
        foot,
        "59%", // width
        "40%", // marginLeft
        "1%",  // marginTop
        win_return, 
        esc_dionis_history
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


//=======================================================================================
function remove_selected_dionis() {
    let id_dionis = table_select_dionis.getSelectedData()[0].id
    del_dionis(id_dionis)
    table_select_dionis.deleteRow(id_dionis)
    id_dionis = getFirstID(table_select_dionis)
    table_select_dionis.selectRow(id_dionis)
}

//=======================================================================================
async function new_dionis() {
    const id = await runSQL_p("INSERT INTO dionis () VALUES ()")
    return id
}

//=======================================================================================
async function save_dionis(d) {
    const sql =
        d.id == 0
            ? `INSERT INTO dionis ( 
            id,
            id_gk,
            id_model,
            sono1,
            sono2,
            ifns1,
            ifns2,
            type,
            model,
            sn,
            sn1,
            sn2,
            inv_n,
            ver,
            date_sert,
            status,
            postavka,
            date2,
            ifns3,
            comm
        ) VALUES (
            ${d.id},
            ${d.id_gk},
            ${d.id_model},
            ${d.sono1},
            ${d.sono2},
            '${d.ifns1}',
            '${d.ifns2}',
            '${d.type}',
            '${d.model}',
            '${d.sn}',
            '${d.sn1}',
            '${d.sn2}',
            '${d.inv_n}',
            '${d.ver}',
            '${d.date_sert}',
            '${d.status}',
            '${d.postavka}',
            '${d.date2}',
            '${d.ifns3}',
            '${d.comm}'
    )`
            : `UPDATE dionis SET 
            id=${d.id},
            id_gk=${d.id_gk},
            id_model=${d.id_model},
            sono1=${d.sono1},
            sono2=${d.sono2},
            ifns1='${d.ifns1}',
            ifns2='${d.ifns2}',
            type='${d.type}',
            model='${d.model}',
            sn='${d.sn}',
            sn1='${d.sn1}',
            sn2='${d.sn2}',
            inv_n='${d.inv_n}',
            ver='${d.ver}',
            date_sert='${d.date_sert}',
            status='${d.status}',
            postavka='${d.postavka}',
            date2='${d.date2}',
            ifns3='${d.ifns3}',
            comm='${d.comm}'
        WHERE id=${d.id}`

    return runSQL_p(sql)
}

//=======================================================================================
function del_dionis(id) {
    runSQL_p(`DELETE FROM dionis WHERE id=${id}`)
    runSQL_p(`DELETE FROM dionis_oper WHERE id_dionis=${id}`)
}

//=======================================================================================
function factory_dionis() {
    return {
        id: 0,
        id_gk: 0,
        id_model: 0,
        sono1: 0,
        sono2: 0,
        ifns1: '',
        ifns2: '',
        type: '',
        model: '',
        sn: '',
        sn1: '',
        sn2: '',
        inv_n: '',
        ver: '',
        date_sert: '',
        status: '',
        postavka: '',
        date2: '',
        ifns3: '',
        comm: ''
    }
}
























// function filterSelect(data, filterParams) {
//     let id = data.id
//     let row = table_select_dionis.searchRows("id", "=", data.id)[0]
//     return row.isSelected()
// }
