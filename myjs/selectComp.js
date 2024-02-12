//=======================================================================================
// модальное окно выбора компьютера
//=======================================================================================
function selectComp(
    sono, 
    esk, 
    id_depart, 
    selectable
) {
    return new Promise(function (resolve, reject) {
        let formSelectComp  = `<div id="selectComp" class="w3-container"></div>`;
        
        newModalWindow(
            'selectComp',   // modal
            '',             // html_header
            formSelectComp, // html_body
            '',             // html_footer
            '900px',        // width
            '20%',          // marginLeft
            '5%'            // marginTop
        )

        // let msgFooterSelecttUser = `<span id="select-stats"></span>
        //                             <button id='onoffSel' class='w3-button w3-white w3-border w3-hover-teal'>Показать помеченные записи</button> 
        //                             <button id='addSel' class='w3-button w3-white w3-border w3-hover-teal'>Выбрать помеченные записи</button>`

        let msgFooterSelecttUser = `<span id="select-stats"></span>
                                    <button id='addSel' class='w3-button w3-white w3-border w3-hover-teal'>Выбрать помеченные записи</button>`

                                    //let appHeight = $(".modal-content").height() - $(".modal-header").height();
        appHeight = appBodyHeight() * 0.7;
        createTabulatorSelectComp(sono, esk, id_depart, "#selectCompBody", appHeight, msgFooterSelecttUser, resolve, reject, selectable);
    });
}

//=======================================================================================
// табулятор справочника компьютеров
//=======================================================================================
function createTabulatorSelectComp(sono, esk, id_depart, id_div, appH, msgF, resolve, reject, selectable) {
    let cols = [];
    let cols1 = [
        { title: "ЕСК",          field: "esk_status", widthGrow: 1, headerFilter: true, },
        { title: "СОНО",         field: "sono",       widthGrow: 1, headerFilter: true, topCalc: "count" },
    ];
    let cols2 = [
            { title: "ip",           field: "ip",         widthGrow: 2, headerFilter: true },
            { title: "Компьютер",    field: "name",       widthGrow: 4, headerFilter: true },
            { title: "описание",     field: "description",widthGrow: 4, headerFilter: true },
            { title: "управляется",  field: "user",       widthGrow: 4, headerFilter: true },
    ];
    cols = (id_depart == 0) ? cols1.concat(cols2) : cols2;


    tableSelectUser = new Tabulator(id_div, {
        ajaxURL: "myphp/loadDataSelectComp.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { s: sono, e: esk, d: id_depart },
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Компьютеры<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: selectable,
        columns: cols,
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
        let div_modal = id2e('selectCompMain');
        console.log(tableSelectUser.getSelectedData())

        div_modal.style.display = "none";
        div_modal.remove();
        resolve(tableSelectUser.getSelectedData());
    });


}

function filterSelect(data, filterParams) {
    let id = data.id;
    let row = tableSelectComp.searchRows("id", "=", data.id)[0];
    return row.isSelected();
}
