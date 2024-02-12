function mDionis() {
    let appHeight = appBodyHeight();

    let tDionis = '<div id="tabDionis"     style="display: inline-block; height: 100%; width: 100%;"></div>';

    document.getElementById('appBody').innerHTML    = tDionis;
    document.getElementById('appBody').style.height = appHeight;

    createTabulatorDionis("tabDionis", appHeight);
}

//=======================================================================================
//  табулятор конфигураций Дионисов              
//=======================================================================================
function createTabulatorDionis(id_div, appH) {
    let allow = getAllows();
    let ed = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? date_Editor : "";
    let dt_config = moment().format('YYYY-MM-DDTHH:mm');

    let msgFooter = `<span>Конфигурация DioNIS на момент времени: </span>
                     <input  id="date" type="datetime-local" value="${dt_config}">
                     <span id="select-stats"></span>
                     <button id='bOff'   class='w3-button w3-white w3-border w3-hover-teal'>Отменить выделение</button> 
                     <button id='bPrt' class='w3-button w3-white w3-border w3-hover-teal'>сгенерировать текст заявки СТП на удаление помеченных записей</button>`;

    tableDionis = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataDionis.php",
        ajaxParams: { s: g_user.sono },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Конфигурации DioNIS<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: true,

        columns: [
          //{ title: "id", field: "id", width: 50, },
            { title: "СОНО",               field: "sono",        width: 70,    headerFilter: true, topCalc: "count", },
            { title: "ТОРМ",               field: "torm",        width: 70,    headerFilter: true, },
            { title: "тип",                field: "type",        width: 70,    headerFilter: true, },
            { title: "фильтр/туннель",     field: "name",        widthGrow: 2, headerFilter: true, },
            { title: "имя источника",      field: "cname",       widthGrow: 3, headerFilter: true, },
            { title: "описание источника", field: "description", widthGrow: 3, headerFilter: true, },
            { title: "ip источника",       field: "src_ip",      widthGrow: 2, headerFilter: true, },
            { title: "ip назначения",      field: "dst_ip",      widthGrow: 2, headerFilter: true, },
            { title: "примечание",         field: "remark",      widthGrow: 4, headerFilter: true, },
            { title: "дата создания",      field: "dt_on",       widthGrow: 2, headerFilter: true, },
            { title: "дата удаления",      field: "dt_off",      widthGrow: 2, headerFilter: true, },
        ],
        
        rowSelectionChanged: function (data, rows) {
            let disabled = (data.length==0) ? true : false;
            document.getElementById("bOff").disabled = disabled;
            document.getElementById("bPrt").disabled = disabled;
            document.getElementById("select-stats").innerHTML = 'выбрано: ' + data.length;
        },

        //rowFormatter: function (row) { rowFormatterCursor(row, g_tableDionis); },
        //renderStarted: function ()   { renderStartedCursor(tableDionis, g_tableDionis); },
        //rowClick: function (e, row)  { rowClickCursor(row, g_tableDionis); },
        //dataLoaded: function (data)  { createTabulatorDD(appH); },
        //cellEdited: function (cell) {
        //    let o = cell.getRow().getData();
        //    runSQL_p(`UPDATE kadri_change SET date="${o.date}", numb="${o.numb}" WHERE id=${o.id}`);
        //},

        footerElement: msgFooter,
    });

    // изменить фильтр по дате конфигурации ---------------------------------------------
    document.getElementById("date").onchange = function () {
        dt_config = this.value;
        let dt = dt_config.replace('T',' ');
        tableDionis.setFilter([
            {field:"dt_on",  type:"<=", value:dt},
            {field:"dt_off", type:">",  value:dt},
        ]);    
    };

    // отменить выделение записей -------------------------------------------------------
    document.getElementById("bOff").onclick = function () {
        tableDionis.deselectRow();
    };

    // сформировать запрос на удаление фильтров -----------------------------------------
    document.getElementById("bPrt").onclick = function () {
        printDeleteRequest( tableDionis.getSelectedData() );
    };

    // включиь фильтр по дате конфигурации ----------------------------------------------
    tableDionis.setFilter([
        {field:"dt_on",  type:"<=", value:dt_config.replace('T',' ')},
        {field:"dt_off", type:">",  value:dt_config.replace('T',' ')},
    ]);    
}



//=======================================================================================
function printDeleteRequest(data) {

    div_modal = document.createElement('div');
    div_modal.className = "modal";

    div_modal.innerHTML = `<div id="modalWindow"class="modal-content" style="width:90%;height:1px">
                            <div id="modalHeader" class="modal-header w3-teal" style="padding:1px 16px"><p>заявка на удаление фильтров из списка доступа</p></div>
                            <div id="modalBody"   class="modal-body tabulator"  style="padding:10px 10px"></div>     
                            <div id="modalFooter" class="modal-footer w3-teal"></div>
                           </div>`;


    let data_sort = data.sort((a, b) => (a.torm + a.name + a.config_prefix + a.config > b.torm + b.name + b.config_prefix + b.config) ? 1 : -1);

    let table    = '';
    let torm_old = '';
    let name_old = '';

    data_sort.forEach(d => {
        torm_new = d.torm;
        name_new = d.name;

        if (torm_new!=torm_old) table = table + 'на DioNIS СОНО: '   + torm_new + '<br>';
        if (name_new!=name_old) table = table + '&nbsp;&nbsp;&nbsp;в списке доступа: ' + name_new + ' ' + 'удалить записи: <br>';

        table = table + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + d.config + '<br>';

        torm_old = torm_new;
        name_old = name_new;
    });


    document.body.append(div_modal);
    modal_body = document.getElementById('modalBody');
    modal_body.innerHTML = table;

    document.onkeyup = function (e) {
        if (e.key == 'Escape') {
            div_modal.style.display = "none";
            div_modal.remove();
            document.onkeyup = function (e) { };
        }
    };

    div_modal.style.display = "block";
}
