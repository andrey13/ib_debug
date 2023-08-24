// let Types = 0;

//=======================================================================================
// модальное окно списка типов для таксонимии id_taxonomy
//=======================================================================================
function selectTypes(id_taxonomy, ok, title, width, marginLeft, marginTop) {
    return new Promise(function (resolve, reject) {
        const formTypes  = `<div id="selectTypes" class="w3-container"></div>`

        newModalWindow(
            modal = 'selectTypes', 
            html_header = title, 
            html_body = formTypes, 
            html_footer= '', 
            width = width, 
            marginLeft = marginLeft, 
            marginTop = marginTop
        )

        appHeight = appBodyHeight() * 0.7

        createTabulatorSelectTypes("#selectTypesBody", id_taxonomy, ok, appHeight, resolve, reject)
    })
}

//=======================================================================================
// табулятор справочника 
// id_div - блок DIV, в которм показывать табулятор
// ok     - фильтр по полю OK, если ok= -1, показывать все записи
// appH   - высота блока DIV
//=======================================================================================

function createTabulatorSelectTypes(id_div, id_taxonomy, ok, appH, resolve, reject) {
    const div_modal = id2e('selectTypesMain')
    
    const allow = getAllows()
    const ed = (allow.A == 1) ? "input" : ""
    const ed_date = (allow.A == 1) ? date_Editor : ""
    const bSel = (allow.R == 1) ? `<button id='bSel' class='w3-button w3-white o3-border w3-hover-teal'>Выбрать</button>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp` : ``
    const bDel = (allow.A == 1) ? `<button id='bDel' class='w3-button w3-white o3-border w3-hover-teal'>Удалить</button>` : ``
    const bAdd = (allow.A == 1) ? `<button id='bAdd' class='w3-button w3-white o3-border w3-hover-teal'>Добавить</button>` : ``

    //const msgFooter = bSel + bDel + bAdd
    const msgFooter = bSel

    const cols = [
        { title: "код", field: "code", editor: ed, width: 90, headerFilter: true },
        { title: "тема обращения", field: "name", editor: ed, widthGrow: 10, headerFilter: true },
        { title: "описание", field: "comment", editor: ed, widthGrow: 10, headerFilter: true },
    ]

    const tableTypes = new Tabulator(id_div, {
        ajaxURL: "myphp/loadDataTypes.php",
        ajaxParams: { t: id_taxonomy, o: ok },
        ajaxConfig: "GET",
        ajaxContentType: "json",
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
        selectable: true,
        selectableRangeMode: "click",

        dataLoaded: function (data) {
            let id = getFirstID( tableTypes );
            tableTypes.selectRow( id )
        },

        cellClick: function (e, cell) {
            // let row       = cell.getRow();
            // let id_dd_old = getCurrentID( tableTypes );
            // let id_dd_new = row.getData().id;

            // if (id_dd_new!=id_dd_old) {
            //     tableTypes.deselectRow(id_dd_old);
            //     tableTypes.selectRow(  id_dd_new )
            // }
        },
     
        cellEdited: function (cell) {
            // let o = cell.getRow().getData();
            // if (table == 'kadri_prikaz') {
            //     runSQL(`UPDATE ${table} SET date="${o.date}", numb="${o.numb}" WHERE id=${o.id}`);
            // } else {
            //     runSQL(`UPDATE ${table} SET name="${o.name}" WHERE id=${o.id}`);
            // }
        },

        cellDblClick: function (e, cell) {
            const id = getCurrentID( tableTypes )
            const r = tableTypes.searchRows("id", "=", id)[0].getData()
            div_modal.style.display = "none"
            div_modal.remove()
            resolve(r)
        },

    });

    id2e('bSel').onclick = () => {
        const id = getCurrentID( tableTypes )
        const r = tableTypes.searchRows("id", "=", id)[0].getData()
        div_modal.style.display = "none"
        div_modal.remove()
        resolve(r)
    }

    // id2e('bAdd').onclick  = () => {
        // runSQL_p(`INSERT INTO ${table} VALUES ()`)
        //     .then((id) => {
        //         //tableTypes.replaceData()
        //         tableTypes.addData([{ id: id }], true)
        //         //g_tableTypes.id_current = parseInt(id)
        //         tableTypes.scrollToRow(id, "top", false)
        //         tableTypes.deselectRow()
        //         tableTypes.selectRow(id)
        //     })
    // }


    // id2e('bDel').onclick = () => {
        // const r = tableTypes.getSelectedData()[0];
        // dialogYESNO(`запись:<br>id:${r.id}<br>«${r.name}»</b><br>будет удалена, вы уверены?<br>`)
        //     .then(ans => {
        //         if (ans == "YES") {
        //             runSQL_p(`DELETE FROM ${table} WHERE id=${r.id}`)
        //             .then((id) => {                
        //                 tableTypes.replaceData()
        //                         //.then((rows)=>{
        //                         //    tableTypes.scrollToRow(id, "top", false)
        //                         //    tableTypes.deselectRow()
        //                         //    tableTypes.selectRow(id)
        //                         //})
        //             })
        //         }
        //     })
    // }


}

