let table_select_mts = null
//=======================================================================================
// модальное окно выбора МТС
//=======================================================================================
function select_mts(
    sono = '6100',
    id_otdel = 0,
    sklad = 0,
    id_type_oper = 0,
    selectable = 1,
    mode = 'select',
    win_return = null,
    id_mts = 0
) {
    return new Promise(async function (resolve, reject) {
        const result = await recalc_mts(0)
        const salt = randomStr(10)
        const win_current = 'selectMTS' + salt

        if (mode == 'select') {
            newModalWindow(
                win_current, // modal
                '',          // html_header
                '',          // html_body
                '',          // html_footer
                '90%',      // width
                '5%',       // marginLeft
                '3%',       // marginTop
                win_return  // win_return
            )
        }

        const appHeight = appBodyHeight()

        table_select_mts = tabulator_select_mts(
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
            id_mts,
        )

        table_select_mts.setFilter("old", "=", 0)

        if (mode == "select") id_2_set_focus(win_current)
    })
}

/////////////////////////////////////////////////////////////////////////////////////////
function tabulator_select_mts(
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
    id_mts = 0,
) {
    console.log('win_current = ', win_current)
    console.log('win_return = ', win_return)

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
        { title: "обращение", field: "id_zayavka", widthGrow: 1, headerFilter: true },
        // { title: "w", field: "old", widthGrow: 1, headerFilter: true },
        { title: "№", field: "numb", widthGrow: 1, headerFilter: true },
        { title: "операций", field: "z_count", width: 50, print: false, headerFilter: true },
        // { title: "дата", field: "date", width: 80, print: false },
        {
            title: "дата",
            field: "date",
            width: 80,
            headerFilter: true,
            formatter: "datetime",
            formatterParams: {
                inputFormat: "YYYY-MM-DD",
                outputFormat: "DD.MM.YYYY",
            },
        },
        { title: "Гб", field: "size_gb", widthGrow: 1, headerFilter: true, editor: "input", },
        { title: "SN", field: "SN", widthGrow: 6, headerFilter: true, topCalc: "count" },
        {
            title: "ДСП", field: "dsp", widthGrow: 1, headerFilter: true, formatter: "lookup",
            formatterParams: { 0: "", 1: "дсп" },
        },
        {
            title: "", field: "bad", headerFilter: true, width: 20, formatter: "lookup",
            formatterParams: { 0: "", 1: "<i class='fa fa-times'></i>" },
        },
        { title: "последний пользователь", field: "uname", widthGrow: 6, headerFilter: true, },
        { title: "операция", field: "oname", widthGrow: 2, headerFilter: true, },
        {
            title: "дата",
            field: "zdate",
            width: 80,
            headerFilter: true,
            formatter: "datetime",
            formatterParams: {
                inputFormat: "YYYY-MM-DD",
                outputFormat: "DD.MM.YYYY",
            },
        },
        {
            title: "склад", field: "sklad", formatter: "lookup",
            formatterParams: { 0: "   ", 1: "на складе", 2: "выдано" },
            widthGrow: 2,
            headerFilter: true
        },
        { title: "exel", field: "status1", widthGrow: 2, headerFilter: true, },
        // { title: "пользователь (сервис)", field: "uname", widthGrow: 6, headerFilter: true, },
        { title: "пользователь (exel)", field: "user", widthGrow: 6, headerFilter: true, },
        { title: "№О", field: "id_otdel", widthGrow: 1, headerFilter: true },
        { title: "отдел (сервис)", field: "dname", widthGrow: 4, headerFilter: true },
        { title: "отдел (exel)", field: "otdel", widthGrow: 4, headerFilter: true },
        { title: "Производитель", field: "manufacturer", widthGrow: 4, headerFilter: true, },
        { title: "описание", field: "descr", widthGrow: 6, headerFilter: true },
        { title: "комментарий", field: "comment", widthGrow: 6, headerFilter: true, },
        // {
        //     title: "ЕСК", field: "user_esk_status", formatter: "lookup",
        //     formatterParams: { 0: "?", 1: "отключен", 2: "Активен" },
        //     widthGrow: 2,
        //     headerFilter: true,
        // },
    ]

    cols = cols1.concat(cols2)

    // const group = (mode == 'select') ? '' : 'SN'
    const group = ''

    const salt = randomStr(10)

    const id_button_sel = 'sel' + salt
    const id_button_mod = 'mod' + salt
    const id_button_add = 'add' + salt
    const id_button_del = 'del' + salt
    const id_button_his = 'his' + salt
    // const id_button_cre = 'cre' + salt
    // const id_checkb_flt = 'flt' + salt
    // const id_checkb_grp = 'grp' + salt
    const id_checkb_xls = 'xls' + salt

    const msgFooter =
    `<span id="select-stats"></span>` +
    `<div style="width: 100%; text-align: left;">` +
    `<button id='${id_button_sel}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Выбрать</button>` +
    `<button id='${id_button_mod}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Изменить</button>` +
    `<button id='${id_button_add}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Добавить</button>` +
    `<button id='${id_button_del}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Удалить</button>` +
    `<button id='${id_button_his}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>История</button>` +
    `&nbsp;&nbsp;&nbsp;дополнительные данные&nbsp;<input type='checkbox' id='${id_checkb_xls}' unchecked style="vertical-align: middle;">` +
    `</div>`

    // `&nbsp;&nbsp;&nbsp;группировать по SN&nbsp;<input type='checkbox' id='${id_checkb_grp}' unchecked style="vertical-align: middle;">` +
    // `<button id='${id_button_cre}' class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal' disabled>Создать недостающие обращения</button>` +
    // `&nbsp;&nbsp;&nbsp;показать дубли&nbsp;<input type='checkbox' id='${id_checkb_flt}' unchecked style="vertical-align: middle;">` +


    const tabulator = new Tabulator("#" + div, {
        ajaxURL: "myphp/get_all_mts.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { s: sono, o: id_otdel, k: sklad, t: id_type_oper },
        height: tabHeight,
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
        groupBy: group,
        footerElement: msgFooter,
        // movableRows: true,

        renderComplete: function() {
            if (mode == "select") id2e(id_checkb_xls).disabled = true
        },

        dataLoaded: function () {
            if (id_mts == 0) return
            tabulator.selectRow(id_mts)
            tabulator.scrollToRow(id_mts, "center", false)
        },

        rowFormatter: function (row) {
            if (row.getData().user1_esk_status == 1) {
                // пользователь отключен -------------------------------------------
                row.getCell("uname").getElement().style.backgroundColor = '#cccccc'
            }
            if (row.getData().bad == 1) {
                // неисправное МТС  ------------------------------------------------
                row.getCell("bad").getElement().style.backgroundColor = '#ff0000'
            }
            if (row.getData().dsp == 1) {
                // ДСП  ------------------------------------------------------------
                row.getCell("dsp").getElement().style.backgroundColor = '#8888ff'
            }
            if (ns(row.getData().SN) == '') {
                // не указан SN  ---------------------------------------------------
                row.getCell("SN").getElement().style.backgroundColor = '#ffcccc'
            }
            if (row.getData().z_count == 0) {
                // нет операций  ---------------------------------------------------
                row.getCell("z_count").getElement().style.backgroundColor = '#ffcccc'
            }
        },

        rowSelectionChanged: function (data, rows) {            
            if (data.length == 0) {
                id2e(id_button_del).disabled = true
                id2e(id_button_add).disabled = isRole("tex")
                id2e(id_button_mod).disabled = true
                id2e(id_button_sel).disabled = true
                id2e(id_button_his).disabled = true
                // id2e(id_button_cre).disabled = !isRole('su')

            } else {
                id2e(id_button_del).disabled = isRole("tex")
                id2e(id_button_add).disabled = isRole("tex")
                id2e(id_button_mod).disabled = isRole("tex")
                if (mode == "select") id2e(id_button_sel).disabled = false
                id2e(id_button_his).disabled = false
                // id2e(id_button_cre).disabled = !isRole('su')
            }
        },

        cellDblClick: async function (e, cell) {
            if ((mode == "select")) {
                removeModalWindow(win_current, win_return)
                resolve(cell.getRow().getData())
            } else {
                const res = await edit_mts_vocab(
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
        const d = factory_MTS()
        d.id = await save_mts(d)

        addTabRow(tabulator, d, (top = true))

        const res = await edit_mts_vocab(
            d,           // d
            win_current, // win_return
            "new"        // mode
        )

        console.log("res = ", res)
    }

    id2e(id_button_mod).onclick = async () => {
        const res = await edit_mts_vocab(
            tabulator.getSelectedData()[0], // d
            win_current,                    // win_return
            "mod"                           // mode
        )
    }

    id2e(id_button_del).onclick = async () => {
        const ans = await dialogYESNO(
            "Удалить МТС", // text
            win_current    // win_return
        )

        if (ans == 'YES') {
            const data = tabulator.getSelectedData()
            data.forEach((d) => {
                del_mts_vocab(d.id)
                tabulator.deleteRow(d.id)
            })
            const id_mts = getFirstID(tabulator)
            tabulator.selectRow(id_mts)
        }
    }

    id2e(id_button_his).onclick = () => {
        show_mts_history(
            tabulator.getSelectedData()[0].id, // d
            win_current                        // win_return
        )
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

    id2e(id_checkb_xls).onclick = () => {
        console.log('id_checkb_xls = ', id2e(id_checkb_xls).checked)
        if (id2e(id_checkb_xls).checked) {
            tabulator.showColumn('date')
            tabulator.showColumn('status1')
            tabulator.showColumn('user')
            tabulator.showColumn('otdel')
            tabulator.showColumn('sklad')
            // tabulator.showColumn('uname')
            tabulator.showColumn('user')
            tabulator.setGroupBy('SN')
            tabulator.setFilter()
            tabulator.redraw()
        } else {
            tabulator.hideColumn('date')
            tabulator.hideColumn('status1')
            tabulator.hideColumn('user')
            tabulator.hideColumn('otdel')
            tabulator.hideColumn('sklad')
            // tabulator.hideColumn('uname')
            tabulator.hideColumn('user')
            tabulator.setFilter("old", "=", 0)
            tabulator.setGroupBy('')
            tabulator.redraw()
        }
    }

    tabulator.hideColumn('date')
    tabulator.hideColumn('status1')
    tabulator.hideColumn('user')
    tabulator.hideColumn('otdel')
    tabulator.hideColumn('sklad')
    // tabulator.hideColumn('uname')
    tabulator.hideColumn('user')

    tabulator.redraw()

    return tabulator
}

/////////////////////////////////////////////////////////////////////////////////////////
function create_absent_zayavki(win_return = null) {
    
    const win_current = "createAbsentZayavki" ///////////////////////////////////////////   
    const header = `<h4>Создание недостающих заявок</h4>`
    
    const body = `
    <div class="w3-container" v-html="body">
    </div>`

    const foot = ``

    const esc_create_absent_zayavki = () => { 
        console.log("esc_callback") 
        // vapp.unmount()
    }

    newModalWindow( 
        win_current, 
        header, 
        body, 
        foot,
        "75%",                    // width
        "20%",                    // marginLeft
        "1%",                     // marginTop
        win_return,               // win_return
        esc_create_absent_zayavki // esc_callback
    )
    // viewModel -------------------------------------------------------------------->
    const vapp = Vue.createApp({
        data() {
            return {
                dv: table_select_mts.getData(),
                body: '',
            }
        },
    })

    const vm = vapp.use(naive).mount("#createAbsentZayavki")
    // viewModel --------------------------------------------------------------------<
    let SN_prev = ''
    let SN_next = ''
    vm.$data.dv.forEach((d) => {            
        SN_next = d.SN
        
        if (SN_next != SN_prev) { // новая группа операций с SN_next
            vm.$data.body = vm.$data.body + '<br>' + d.id + ' ' + SN_next
        } else { // продолжение старой группы операций с SN_next
            vm.$data.body = vm.$data.body + '<br>' + d.id
        }
        SN_prev = SN_next            
    })
    id_2_set_focus(win_current)
}

/////////////////////////////////////////////////////////////////////////////////////////
async function show_mts_history(id_mts, win_return = null) {
    const data_mts = await id_2_data(id_mts, 'mts')
    const win_current = 'historyMTS' + randomStr(10)
    const header = `<h4>история МТС id: ${data_mts.id}, SN: ${data_mts.SN}</h4>`
    const body = `<div class="w3-container"></div>`
    const foot = ``
    
    const esc_mts_history = () => { 
        console.log("esc_callback") 
    }

    newModalWindow( 
        win_current, 
        header, 
        body, 
        foot,
        "59%",          // width
        "40%",          // marginLeft
        "1%",           // marginTop
        win_return,     // win_return
        esc_mts_history // esc_callback
    )
    
    const table_histoty = new Tabulator('#' + win_current + 'Body', {
        ajaxURL: "myphp/get_mts_history.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { i: data_mts.id },
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
            { title: 'ответственный', field: 'user_mts_name', widthGrow: 4, headerFilter: true },
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
function edit_mts_vocab(d, win_return = null, mode = "") {
    return new Promise(function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'editMTSVocab' + salt

        const headerMTSVocab = `<h4>параметры МТС</h4>`

        const bodyMTSVocab = `<div style="margin: 0; padding: 1%;">
            <table class="w3-table-all">
                <tr>
                  <td>id:{{dv.id}} id_zayavka:{{dv.id_zayavka}} id_oper:{{dv.id_oper}} id_status:{{dv.id_status}} status:{{dv.status}}</td>
                  <td>
                    <button id="btnShowExl" style="border: 0; background-color: white;" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
                  </td>
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
                  <td>№: <input class="o3-border" type="text" id="MTS_Numb" v-model="dv.numb" style="width: 300px;"></td>
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
                  <td><span v-show="shExl">{{dv.status1}}</span></td>
                </tr>
                <tr>
                  <td>
                    <button id="selectMtsUser" class="w3-btn w3-padding-small o3-button w3-hover-teal">{{uname}}</button>
                    <span v-show="shExl">id_user: {{dv.id_user}}</span>
                  </td>
                  <td><span v-show="shExl">{{dv.user}}</span></td>
                </tr>
                <tr>
                  <td>
                    <button id="selectMtsDepart" class="w3-btn w3-padding-small o3-button w3-hover-teal">{{dname}}</button>
                    <span v-show="shExl">id_depart: {{dv.id_depart}}</span>
                  </td>
                  <td><span v-show="shExl">{{dv.otdel}}</span></td>
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
            дата операции {{dv.date}}<br>
            <br>
            <button id="btnEnterMTSVocab"  class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить</button>
            <button id="btnCancelMTSVocab" class="w3-btn w3-padding-small o3-border w3-hover-red">отменить</button>
            <button id="btnApplayMTSVocab" class="w3-btn w3-padding-small o3-border w3-hover-teal">применить</button>
            <button id="btnPrevMTSVocab"   class="w3-btn w3-padding-small o3-border w3-hover-teal">предыдущее МТС</button>
            <button id="btnNextMTSVocab"   class="w3-btn w3-padding-small o3-border w3-hover-teal">следующее МТС</button>
            Дубль
            <n-switch  :rail-style="style_old"
              size="small"
              checked-value="1"
              unchecked-value="0"
              v-model:value="dv.old"
            />
        </div>`

        // <tr>
        //   <td>
        //     <button id="selectMtsComp" class="w3-btn w3-padding-small o3-button w3-hover-teal">{{cname}}</button></button>
        //     <span v-show="shExl">id_comp: {{dv.id_comp}}</span>
        //   </td>
        //   <td></td>
        // </tr>


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
            (marginLeft = "15%"),
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
        const vm = vapp.use(naive).mount('#' + win_current)

        id_2_set_focus(win_current)

        // кнопка выбора пользователя -----------------------------------------------
        id2e('btnShowExl').onclick = () => {
            vm.$data.shExl = !vm.$data.shExl
        }

        // кнопка выбора пользователя -----------------------------------------------
        id2e("selectMtsUser").onclick = async () => {
            const id_depart = isRole("tex") ? g_user.id_depart : 0
            const selectedUsers = await selectUser(
                "6100",
                "",
                id_depart,
                1,
                "Выбор ответственного лица", // header
                "40%",                       // width
                "30%",                       // marginLeft
                "5%",                        // marginTop
                win_current,                 // win_return
                vm.$data.dv.id_user          // id_user
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
                "depart",          // table
                "id_otdel",        // sort
                -1,                // ok
                "отдел",           // tite
                "",                // allow
                "60%",             // width
                "20%",             // marginLeft
                "5%",              // marginTop
                win_current,       // win_return
                sono = g_user.sono // sono
            )
            console.log('dep = ', dep)
            vm.$data.dv.id_depart = dep.id
            vm.$data.dv.id_otdel = dep.id_otdel
            vm.$data.dv.dname = (await id_depart_2_data(dep.id)).name
            id_2_set_focus(win_current)
        }
        // кнопка сохранения и выхода -----------------------------------------------
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
        // кнопка сохранения без выхода ---------------------------------------------
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
            numb,
            SN, 
            id_user,
            id_comp,
            id_otdel,
            id_depart,
            id_status,
            id_oper,
            id_type_oper,
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
            bad,
            old
        ) VALUES (
           "${d.numb}", 
           "${d.SN}", 
            ${nn(d.id_user)},
            ${nn(d.id_comp)},
            ${nn(d.id_otdel)},
            ${nn(d.id_depart)},
            ${nn(d.id_status)},
            ${nn(d.id_oper)},
            ${nn(d.id_type_oper)},
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
            ${d.bad},
            ${d.old}
        )`
            : `UPDATE mts SET 
            numb="${d.numb}",
            SN="${d.SN}", 
            id_user=${nn(d.id_user)},
            id_comp=${nn(d.id_comp)},
            id_otdel=${nn(d.id_otdel)},
            id_depart=${nn(d.id_depart)},
            id_status=${nn(d.id_status)},
            id_oper=${nn(d.id_oper)},
            id_type_oper=${nn(d.id_type_oper)},
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
            bad=${d.bad},
            old=${d.old}
        WHERE id=${d.id}`

    return runSQL_p(sql)
}

/////////////////////////////////////////////////////////////////////////////////////////
function del_mts_vocab(id) {
    runSQL_p(`DELETE FROM mts WHERE id=${id}`)
    runSQL_p(`DELETE FROM mts2comp WHERE id_mts=${id}`)
}

/////////////////////////////////////////////////////////////////////////////////////////
function factory_MTS() {
    return {
        id: 0,
        numb: '',
        SN: '',
        id_user: 0,
        id_comp: 0,
        id_otdel: 0,
        id_depart: 0,
        id_status: 0,
        id_oper: 0,
        id_type_oper: 0,
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
        bad: 0,
        old: 0
    }
}
























// function filterSelect(data, filterParams) {
//     let id = data.id
//     let row = table_select_mts.searchRows("id", "=", data.id)[0]
//     return row.isSelected()
// }
