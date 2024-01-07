//=======================================================================================
// модальное окно справочника оснований
//=======================================================================================
function selectReson(sono, id_depart) {
    return new Promise(function (resolve, reject) {
        const formReson = `<div id="selectReson" class="w3-container"></div>`
        
        newModalWindow(
            "selectReson", 
            "", 
            formReson, 
            "", 
            "600px", 
            "20%", 
            "5%"
        )

        appHeight = appBodyHeight() * 0.7

        tabulator_select_reson(
            "#selectResonBody",
            appHeight,
            sono,
            id_deaprt,
            resolve,
            reject
        )
    })
}

//=======================================================================================
// табулятор справочника
// id_div - блок DIV, в которм показывать табулятор
// appH   - высота блока DIV
//=======================================================================================

function tabulator_select_reson(
    id_div,
    appH,
    sono,
    id_deaprt,
    resolve,
    reject
) {
    const div_modal = id2e("selectResonMain")
    const allow = getAllows()
    const ed = allow.A == 1 ? "input" : ""
    const ed_date = allow.A == 1 ? date_Editor : ""
    const bSel = (allow.E == 1)
            ? `<button id='bSel' class='w3-button w3-white w3-border w3-hover-teal'>Выбрать</button>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp`
            : ``
    const bDel = (allow.A == 1)
            ? `<button id='bDel' class='w3-button w3-white w3-border w3-hover-teal'>Удалить</button>`
            : ``
    const bAdd = (allow.A == 1)
            ? `<button id='bAdd' class='w3-button w3-white w3-border w3-hover-teal'>Добавить</button>`
            : ``

    const msgFooter = bSel + bDel + bAdd

    const cols = [
        { title: "id", field: "id", widthGrow: 1, headerFilter: true },
        { title: "sono", field: "sono", widthGrow: 1, headerFilter: true },
        {
            title: "id_depart",
            field: "id_depart",
            widthGrow: 1,
            headerFilter: true,
        },
        {
            title: "название",
            field: "name",
            editor: ed,
            widthGrow: 10,
            headerFilter: true,
            topCalc: "count",
        },
        {
            title: "текст обоснования",
            field: "text",
            editor: ed,
            widthGrow: 10,
            headerFilter: true,
        },
    ]

    tabReson = new Tabulator(id_div, {
        ajaxURL: "myphp/loadDataReson.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { s: sono, d: id_depart },
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        columns: cols,
        footerElement: msgFooter,

        dataLoaded: function (data) {
            const id = getFirstID(tabReson)
            tabReson.selectRow(id)
        },

        cellClick: function (e, cell) {
            const row = cell.getRow()
            const id_dd_old = getCurrentID(tabReson)
            const id_dd_new = row.getData().id

            if (id_dd_new != id_dd_old) {
                tabReson.deselectRow(id_dd_old)
                tabReson.selectRow(id_dd_new)
            }
        },

        cellEdited: function (cell) {
            const o = cell.getRow().getData()
            if (table == "kadri_prikaz") {
                runSQL(`UPDATE ${table} SET date="${o.date}", numb="${o.numb}" WHERE id=${o.id}`)
            } else {
                runSQL(`UPDATE ${table} SET name="${o.name}" WHERE id=${o.id}`)
            }
        },
        cellDblClick: function (e, cell) {
            const id = getCurrentID(tabReson)
            div_modal.style.display = "none"
            div_modal.remove()
            const r = tabReson.searchRows("id", "=", id)[0].getData()
            resolve(r)
        },
    })

    $("#bSel").click(function () {
        const id = getCurrentID(tabReson)
        div_modal.style.display = "none"
        div_modal.remove()
        const r = tabReson.searchRows("id", "=", id)[0].getData()
        resolve(r)
    })

    $("#bAdd").click(async () => {
        const id = await runSQL_p(`INSERT INTO ${table} VALUES ()`)
        //tabReson.replaceData();
        tabReson.addData([{ id: id }], true)
        //g_tabReson.id_current = parseInt(id);
        tabReson.scrollToRow(id, "top", false)
        tabReson.deselectRow()
        tabReson.selectRow(id)
    })

    $("#bDel").click(async () => {
        const r = tabReson.getSelectedData()[0]
        const ans = await dialogYESNO(
            `запись:<br>id:${r.id}<br>«${r.name}»</b><br>будет удалена, вы уверены?<br>`
        )

        if (ans == "YES") {
            runSQL_p(`DELETE FROM ${table} WHERE id=${r.id}`).then((id) => {
                tabReson.replaceData()
                //.then((rows)=>{
                //    tabReson.scrollToRow(id, "top", false);
                //    tabReson.deselectRow();
                //    tabReson.selectRow(id);
                //});
            })
        }
    })
}
