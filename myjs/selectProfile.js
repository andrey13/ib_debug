//=======================================================================================
// модальное окно выбора профиля ФИР
//=======================================================================================
function selectProfile(selectable) {
    return new Promise(function (resolve, reject) {
        let formselectProfile  = `<div id="selectProfile" class="w3-container"></div>`;
        newModalWindow(
            'selectProfile', 
            '', 
            formselectProfile, 
            '', 
            '900px', 
            '5%', 
            '5%'
        )


        //let appHeight = $(".modal-content").height() - $(".modal-header").height();
        appHeight = appBodyHeight() * 0.7;
        createTabulatorSelectProfile(
            "#selectProfileBody", 
            appHeight, 
            resolve, 
            reject, 
            selectable
        )
    });
}

//=======================================================================================
// табулятор справочника профилей ФИР
//=======================================================================================
function createTabulatorSelectProfile(id_div, appH, resolve, reject, selectable) {
    let msgF = `<span id="select-stats"></span>
                <button id='offSel'   class='w3-button w3-white w3-border w3-hover-teal'>Отменить выделение записей</button> 
                <button id='onoffSel' class='w3-button w3-white w3-border w3-hover-teal'>Показать помеченные записи</button> 
                <button id='addSel'   class='w3-button w3-white w3-border w3-hover-teal'>Выбрать помеченные записи</button>`;

    tableSelectProfile = new Tabulator(id_div, {
        ajaxURL: "myphp/loadDataSelectProfile.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Профили ФИР<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: selectable,
        columns: [
            { title: "профиль",    field: "name",   widthGrow: 1, headerFilter: true },
            { title: "описание",   field: "title",  widthGrow: 4, headerFilter: true },
            
        ],

        rowSelectionChanged: function (data, rows) {
            document.getElementById("select-stats").innerHTML = `Выбрано: ${data.length}`;
            if (data.length==0) {
                $("#offSel").prop('disabled', true);
                $("#onoffSel").prop('disabled', true);
                $("#addSel").prop('disabled', true);                
            } else {
                $("#offSel").prop('disabled', false);
                $("#onoffSel").prop('disabled', false);
                $("#addSel").prop('disabled', false);
            }
        },

        footerElement: msgF,
    });

    document.getElementById("offSel").onclick = function () {
        tableSelectProfile.deselectRow();
    };

    document.getElementById("onoffSel").onclick = function () {
        if ($("#onoffSel").text()=="Показать помеченные записи") {
            tableSelectProfile.setFilter(filterSelect);        
            $("#onoffSel").text("Показать все записи");
        } else {
            tableSelectProfile.setFilter();        
            $("#onoffSel").text("Показать помеченные записи");
        }       
    };

    document.getElementById("addSel").onclick = function () {
        let div_modal = id2e('selectProfileMain');
        div_modal.style.display = "none";
        div_modal.remove();
        resolve(tableSelectProfile.getSelectedData());
    };


}

function filterSelect(data, filterParams) {
    let id = data.id;
    let row = tableSelectProfile.searchRows("id", "=", data.id)[0];
    return row.isSelected();
}
