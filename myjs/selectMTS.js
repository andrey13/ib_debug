//=======================================================================================
// модальное окно выбора МТС
//=======================================================================================
function selectMTS(sono, id_otdel = 0, sklad = 0, selectable = 1, mode = 'select', win_return = null) {
    return new Promise(function (resolve, reject) {
        let formSelectMTS = `<div id="selectMTS" class="w3-container"></div>`;
        newModalWindow('selectMTS', '', formSelectMTS, '', width = "80%", marginLeft = "10%", marginTop = "10%", win_return)

        let msgFooterSelecttUser = `<span id="select-stats"></span>
                                    <button id='btnDelMTSVocab' class='w3-button w3-white w3-border w3-hover-teal' disabled>Удалить</button>
                                    <button id='btnAddMTSVocab' class='w3-button w3-white w3-border w3-hover-teal' disabled>Добавить</button>
                                    <button id='btnModMTSVocab' class='w3-button w3-white w3-border w3-hover-teal' disabled>Изменить</button>
                                    <button id='btnSelMTSVocab' class='w3-button w3-white w3-border w3-hover-teal' disabled>Выбрать</button>`

        appHeight = appBodyHeight() * 0.7;
        createTabulatorSelectMTS(sono, "#selectMTSBody", appHeight, msgFooterSelecttUser, resolve, reject, id_otdel, sklad, selectable, mode);
        id2e('selectMTSMain').focus()
    });
}

//=======================================================================================
// табулятор справочника МТС
//=======================================================================================
function createTabulatorSelectMTS(sono, id_div, appH, msgF, resolve, reject, id_otdel = 0, sklad = 0, selectable = 1, mode = 'select') {
    let cols = []

    let cols1 = [
        { title: "СОНО", field: "sono", widthGrow: 1, headerFilter: true, topCalc: "count" },
    ]

    let cols2 = [
        { title: "id", field: "id", widthGrow: 1, headerFilter: true },
        { title: "SN", field: "SN", widthGrow: 6, headerFilter: true },
        { title: "пользователь", field: "uname", widthGrow: 6, headerFilter: true },
        { title: "Производитель", field: "manufacturer", widthGrow: 4, headerFilter: true },
        { title: "описание", field: "desc", widthGrow: 6, headerFilter: true },
        { title: "склад", field: "sklad", widthGrow: 1, headerFilter: true },
        { title: "отдел", field: "id_otdel", widthGrow: 1, headerFilter: true },
    ]

    cols = cols1.concat(cols2)

    const tableMTSVocab = new Tabulator(id_div, {
        ajaxURL: "myphp/getAllMTS.php",
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
        columns: cols2,

        rowSelectionChanged: function (data, rows) {
            // document.getElementById("select-stats").innerHTML = 'Выбрано: ' + data.length
            if (data.length == 0) {
                // console.log('OFF')
                id2e('btnDelMTSVocab').disabled = true
                id2e('btnAddMTSVocab').disabled = true
                id2e('btnModMTSVocab').disabled = true
                id2e('btnSelMTSVocab').disabled = true
            } else {
                // console.log('ON')
                id2e('btnDelMTSVocab').disabled = false
                id2e('btnAddMTSVocab').disabled = false
                id2e('btnModMTSVocab').disabled = false
                id2e('btnSelMTSVocab').disabled = false
            }
        },

        cellDblClick: function (e, cell) {
            const div_modal = id2e('selectMTSMain')
            div_modal.style.display = "none"
            div_modal.remove()

            // resolve(tableMTSVocab.getSelectedData())
            resolve(cell.getRow().getData())
        },


        footerElement: msgF,
    });

    // $("#onoffSel").click(function () {
    //     if ($("#onoffSel").text() == "Показать помеченные записи") {
    //         tableMTSVocab.setFilter(filterSelect)
    //         $("#onoffSel").text("Показать все записи")
    //     } else {
    //         tableMTSVocab.setFilter()
    //         $("#onoffSel").text("Показать помеченные записи")
    //     }

    // });

    id2e("btnSelMTSVocab").onclick = () => {
        const div_modal = id2e('selectMTSMain')
        div_modal.style.display = "none"
        div_modal.remove()
        resolve(tableMTSVocab.getSelectedData()[0])
    }

    id2e('btnAddMTSVocab').onclick = () => { }

    id2e('btnModMTSVocab').onclick = async () => {
        const res = await modMTSVocab(tableMTSVocab.getSelectedData()[0])
        console.log('res = ', res)
    }

    id2e('btnDelMTSVocab').onclick = () => { }

    //-----------------------------------------------------------------------------------
    function modMTSVocab(d) {
        return new Promise(function (resolve, reject) {
            const headerMTSVocab = `<h4>параметры МТС</h4>`

            const bodyMTSVocab =
                `<div id="modMTSVocab" style="margin: 0; padding: 1%;" class="w3-container">
                id: ${d.id}<br>
                SN: ${d.SN}<br>
                id_user: ${d.id_user}<br>
                user: ${d.user}<br>

                id_comp: ${d.id_comp}<br>
                id_depart: ${d.id_depart}<br>
                id_otdel: ${d.id_otdel}<br>
                otdel: ${d.otdel}<br>

                id_status: ${d.id_status}<br>
                id_oper: ${d.id_oper}<br>
                id_zayavka: ${d.id_zayavka}<br>
                id_vendor: ${d.id_vendor}<br>
                sono: ${d.sono}<br>
                dsp: ${d.dsp}<br>
                sklad: ${d.sklad}<br>
                status1: ${d.status1}<br>

                comment: ${d.comment}<br>
                size_gb: ${d.size_gb}<br>
                size: ${d.size}<br>

                date_status: ${d.date_status}<br>
                eko: ${d.eko}<br>
                date2: ${d.date2}<br>
                date: ${d.date}<br>
                manufacturer: ${d.manufacturer}<br>
                product_model: ${d.product_model}<br>
                revision: ${d.revision}<br>
                desc: ${d.desc}<br>
                status: ${d.status}<br>
                <br>
                <button id="btnEnterMTSVocab"  class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить</button>
                <button id="btnCancelMTSVocab" class="w3-btn w3-padding-small o3-border w3-hover-red">отменить</button>                            
            </div>`

            const footMTSVocab = ``

            newModalWindow(
                "editMTSVocab", 
                headerMTSVocab, 
                bodyMTSVocab, 
                footMTSVocab, 
                width = "60%", 
                marginLeft = "5%", 
                marginTop = "10%", 
                "selectMTSMain"
            )

            id2e('editMTSVocabMain').focus()

            id2e('btnEnterMTSVocab').onclick = () => {
                removeModalWindow("editMTSVocab", "selectMTSMain")
                resolve('OK')
            }

            id2e('btnCancelMTSVocab').onclick = () => {
                removeModalWindow("editMTSVocab", "selectMTSMain")
                resolve('CANCEL')
            }
        })
    }










}








// function filterSelect(data, filterParams) {
//     let id = data.id
//     let row = tableMTSVocab.searchRows("id", "=", data.id)[0]
//     return row.isSelected()
// }
