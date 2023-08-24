//=======================================================================================
// модальное окно выбора МТС
//=======================================================================================
function selectMTS(sono, id_otdel, selectable) {
    return new Promise(function (resolve, reject) {
        let formSelectMTS  = `<div id="selectMTS" class="w3-container"></div>`;
        newModalWindow('selectMTS', '', formSelectMTS, '', '900px', '20%', '5%');

        let msgFooterSelecttUser = `<span id="select-stats"></span>
                                    <button id='addSel' class='w3-button w3-white w3-border w3-hover-teal'>Выбрать помеченные записи</button>`

        appHeight = appBodyHeight() * 0.7;
        createTabulatorSelectMTS(sono, id_otdel, "#selectMTSBody", appHeight, msgFooterSelecttUser, resolve, reject, selectable);
    });
}

//=======================================================================================
// табулятор справочника компьютеров
//=======================================================================================
function createTabulatorSelectMTS(sono, id_otdel, id_div, appH, msgF, resolve, reject, selectable) {
    let cols = [];
    let cols1 = [
        { title: "СОНО",         field: "sono",       widthGrow: 1, headerFilter: true, topCalc: "count" },
    ];
    let cols2 = [
            { title: "SN",           field: "SN",          widthGrow: 6, headerFilter: true },
            { title: "Производитель",field: "manufacturer",widthGrow: 4, headerFilter: true },
            { title: "описание",     field: "desc",        widthGrow: 4, headerFilter: true },
    ];
    cols = cols1.concat(cols2)

    tableSelectUser = new Tabulator(id_div, {
        ajaxURL: "myphp/loadDataSelectMTS.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { s: sono, o: id_otdel },
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
            document.getElementById("select-stats").innerHTML = 'Выбрано: ' + data.length;
            if (data.length==0) {
                $("#addSel").prop('disabled', true);                
            } else {
                $("#addSel").prop('disabled', false);
            }
        },

        footerElement: msgF,
    });

    $("#onoffSel").click(function () {
        if ($("#onoffSel").text()=="Показать помеченные записи") {
            tableSelectUser.setFilter(filterSelect);        
            $("#onoffSel").text("Показать все записи");
        } else {
            tableSelectUser.setFilter();        
            $("#onoffSel").text("Показать помеченные записи");
        }
        
    });

    $("#addSel").click(function () {
        let div_modal = id2e('selectMTSMain');
        console.log(tableSelectUser.getSelectedData())

        div_modal.style.display = "none";
        div_modal.remove();
        resolve(tableSelectUser.getSelectedData());
    });


}

function filterSelect(data, filterParams) {
    let id = data.id;
    let row = tableSelectMTS.searchRows("id", "=", data.id)[0];
    return row.isSelected();
}
