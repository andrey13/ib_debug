function select_oper(
    sono = '6100',
    id_otdel = 0,
    sklad = 0,
    selectable = 1,
    mode = 'select',
    win_return = null,
    id_oper = 0
) {
    return new Promise(function (resolve, reject) {
        const salt = randomStr(10)
        const win_current = 'selectOper' + salt

        if (mode == 'select') {
            newModalWindow(
                win_current, // modal
                '',          // html_header
                '',          // html_body
                '',          // html_footer
                '90%',       // width
                '5%',        // marginLeft
                '3%',        // marginTop
                win_return   // win_return
            )
        }

        const appHeight = appBodyHeight()

        table_opers = tabulator_opers(
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
        )

        // table_opers.setSort([
        //     {column: "z_date", dir: "desc"}
        // ])

        if (mode == "select") id_2_set_focus(win_current)
    })
}
/////////////////////////////////////////////////////////////////////////////////////////
function tabulator_opers(
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
) {
    const tabulator = new Tabulator("#" + div, {
        ajaxURL: "myphp/get_mts_history.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { i: 0 },
        height: tabHeight,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Операции МТС<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: selectable,
        selectableRangeMode: "click",
        reactiveData: true,
        footerElement: '',
        columns: [
            { title: 'id', field: 'zm_id', width: 60, headerFilter: true },
            { title: 'обращение', field: 'z_id', widthGrow: 1, headerFilter: true, topCalc: 'count' },
            { title: 'id_mts', field: 'zm_id_mts', widthGrow: 1, headerFilter: true },
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
            { title: 'статус', field: 'status', widthGrow: 1, headerFilter: true },
            // { title: 'тип', field: 'z_id_type', widthGrow: 1, headerFilter: true },
            // { title: 'тип', field: 'type', widthGrow: 2, headerFilter: true },
            // { title: 'статус', field: 'z_id_status', widthGrow: 1, headerFilter: true },
            // { title: 'операция', field: 'zm_id_oper', widthGrow: 1, headerFilter: true },
            { title: 'операция', field: 'oper', widthGrow: 1, headerFilter: true },
            { title: 'SN', field: 'm_SN', widthGrow: 5, headerFilter: true },
            { title: 'дсп', field: 'zm_dsp', width: 60, headerFilter: true },
            // { title: 'ответственный', field: 'zm_id_user', widthGrow: 1, headerFilter: true },
            { title: 'ответственный', field: 'user_mts_name', widthGrow: 3, headerFilter: true },
            // { title: 'заявитель', field: 'z_id_user', widthGrow: 1, headerFilter: true },
            { title: 'заявитель', field: 'user_name', widthGrow: 3, headerFilter: true },
            // { title: 'исполнитель', field: 'z_id_user_isp', widthGrow: 1, headerFilter: true },
            { title: 'исполнитель', field: 'user_isp_name', widthGrow: 3, headerFilter: true },
        ],
        rowFormatter: function (row) {
            if (ns(row.getData().m_SN) == '' || nn(row.getData().zm_id_mts) == 0) {
                row.getCell("m_SN").getElement().style.backgroundColor = '#ff8888'
            }
            if (row.getData().status == 'черновик') {
                row.getCell("status").getElement().style.backgroundColor = '#999999'
            }
            if (row.getData().status == 'отклонено') {
                row.getCell("status").getElement().style.backgroundColor = '#ff8888'
            }
            // if (row.getData().status == 'выполнено') {
            //     row.getCell("status").getElement().style.backgroundColor = '#88ff88'
            //     row.getCell("status").getElement().style.backgroundColor = '#ffffff'
            // }
            if (row.getData().status == 'на выполнении') {
                row.getCell("status").getElement().style.backgroundColor = '#8888ff'
            }
        },

        cellClick: async function (e, cell) {
            const fieldName = cell.getField()
            // console.log('fieldName = ', fieldName)
            if (fieldName == 'm_SN') {
                const id_mts = cell.getRow().getData().zm_id_mts
                console.log('id_mts = ', id_mts)
                const d = await id_2_data(id_mts, 'mts')
                console.log('d = ', d)
                const res = await edit_mts_vocab(
                    d,           // d
                    win_current, // win_return
                    "mod"        // mode
                )
            }
        }        

    })
    return tabulator
}