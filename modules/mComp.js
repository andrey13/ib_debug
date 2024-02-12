//console.log("load mComp");

async function mComp() {
    console.log("run mComp");
    let categories = await loadCategories();
    //console.log('categories=',categories);
    $("#help").html("<b>статус в реестре узлов:</b><br>0-не сканировать<br>1-сканировать в рабочее время<br>2-сканировать круглосуточно<br><br><b>категория узла:</b><br>" + categories);
    let appHeight = appBodyHeight();
    $("#appBody").html('<div id="tabComp"></div>');
    $("#appBody").height(appHeight);
    createTabulatorComp("tabComp", appHeight);
}


function customFilterComp(data, filterParams) {
    return (g_tableComp.cESK2 && data.esk_status == 2) || (g_tableComp.cESK0 && data.esk_status == 0 && ((g_tableComp.cVLN1 && data.n_vulner != 0) || (g_tableComp.cVLN0 && data.n_vulner == 0)));
}

//=======================================================================================
function tableCmpSetFilter() {
    tableComp.setFilter(customFilterComp, '');
}

function cb1_onclick(id_checkbox) {
    g_tableComp[id_checkbox] = id2e(id_checkbox).checked;
    tableComp.setFilter(customFilterComp, '');
}

//=======================================================================================
// табулятор полного списка АРМ  ========================================================
//=======================================================================================

function createTabulatorComp(id_div, appH, msgF) {
    g_tableComp.cESK2 = true;
    g_tableComp.cESK0 = true;
    g_tableComp.cVLN1 = true;
    g_tableComp.cVLN0 = false;

    let msgFooterComp = `<div style="vertical-align: middle; margin: auto;">
                            <input type='checkbox' id='cESK2' checked style="vertical-align: middle;" onclick="cb1_onclick('cESK2')"><label for='cESK2' style="vertical-align: middle;">ЕСК</label>&nbsp;&nbsp;+&nbsp;&nbsp;
                           (<input type='checkbox' id='cESK0' checked style="vertical-align: middle;" onclick="cb1_onclick('cESK0')"><label for='cESK0' style="vertical-align: middle;">вне ЕСК</label>
                            <input type='checkbox' id='cVLN1' checked style="vertical-align: middle;" onclick="cb1_onclick('cVLN1')"><label for='cVLN1' style="vertical-align: middle;">с уязвимостями</label>
                            <input type='checkbox' id='cVLN0'         style="vertical-align: middle;" onclick="cb1_onclick('cVLN0')"><label for='cVLN0' style="vertical-align: middle;">без уязвимостей</label>)&nbsp;&nbsp;&nbsp;&nbsp;
                            <button id='bREE2' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>сформировать реестр узлов (серверы)</button>
                            <button id='bREE1' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>сформировать реестр узлов (станции)</button>
                            <button id='bHLP' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Помощь</button>
                        </div>`;

    let sono_mask = (g_user.sono == "6100") ? "" : g_user.sono;
    console.log("sono_mask:", sono_mask);
    sono_mask = g_user.sono;
    //let callerName = arguments.callee.caller.name;
    //console.log("callerName="+callerName);
    tableComp = new Tabulator('#' + id_div, {
        ajaxURL: "myphp/loadDataComp.php",
        ajaxParams: { s: sono_mask },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Компьютеры<h1>",
        printFooter: "",
        rowFormatter: function (row) {
            //if(row.getData().n_zapr > 0){row.getElement().style.backgroundColor = "#ff7575";}
            if (row.getData().n_zapr > 0) { row.getCell("n_zapr").getElement().style.backgroundColor = "#ff7575"; }
            if (row.getData().n_v3 > 0) { row.getCell("n_v3").getElement().style.backgroundColor = g_color_v3; }
            if (row.getData().n_v2 > 0) { row.getCell("n_v2").getElement().style.backgroundColor = g_color_v2; }
            if (row.getData().n_v1 > 0) { row.getCell("n_v1").getElement().style.backgroundColor = g_color_v1; }
            if (row.getData().n_v0 > 0) { row.getCell("n_v0").getElement().style.backgroundColor = g_color_v0; }
            if (row.getData().n_zapr + row.getData().n_vulner == 0) {
                row.getCell("n_zapr").getElement().style.backgroundColor = g_color_vn;
                row.getCell("n_vulner").getElement().style.backgroundColor = g_color_vn;
                row.getCell("n_v3").getElement().style.backgroundColor = g_color_vn;
                row.getCell("n_v2").getElement().style.backgroundColor = g_color_vn;
                row.getCell("n_v1").getElement().style.backgroundColor = g_color_vn;
                row.getCell("n_v0").getElement().style.backgroundColor = g_color_vn;
            }
        },
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        columns: [
            //{ title: "id", field: "id", headerFilter: true, width: 10 },
            { title: "СОНО", field: "sono", headerFilter: true, width: 60 },
            { title: "ЕСК", field: "esk_status", headerFilter: true, width: 40 },
            { title: "dns", field: "nslookup", headerFilter: true, width: 40 },
            { title: "ip", field: "ip", headerFilter: true, width: 110 },
            { title: "имя", field: "name", headerFilter: true, width: 110, topCalc: "count" },
            {
                title: "Реестр узлов", field: "maxreestr", headerFilter: true, width: 80,
                editor: "input",
                editorParams: {
                    mask: "9",
                    min: "0",
                    max: "2",
                    verticalNavigation: "table",
                }
            },
            {
                title: "Категория узла", field: "id_category", headerFilter: true, width: 100,
                editor: "number",
                editorParams: {
                    mask: "99",
                    min: 0,
                    max: 16,
                    verticalNavigation: "table",
                }
            },
            { title: "описание", field: "description", headerFilter: true, widthGrow: 4 },
            { title: "управляется", field: "user", headerFilter: true, widthGrow: 4 },
            { title: "ОС", field: "operatingSystem", headerFilter: true, widthGrow: 4 },
            { title: "АРМ АИС", field: "arm", headerFilter: true, width: 80, topCalc: "count" },
            {//create column group
                title: "Установлено программ",
                columns: [
                    { title: "ВСЕГО", field: "n_soft", topCalc: "sum", widthGrow: 1 },
                    { title: "запрещенных", field: "n_zapr", topCalc: "sum", widthGrow: 1 },
                ],
            },
            {//create column group
                title: "Обнаружено уязвимостей",
                columns: [
                    { title: "ВСЕГО", field: "n_vulner", topCalc: "sum", widthGrow: 1 },
                    { title: "критический", field: "n_v3", topCalc: "sum", widthGrow: 1 },
                    { title: "высокий", field: "n_v2", topCalc: "sum", widthGrow: 1 },
                    { title: "средний", field: "n_v1", topCalc: "sum", widthGrow: 1 },
                    { title: "низкий", field: "n_v0", topCalc: "sum", widthGrow: 1 },
                ],
            },
            { title: "дата сканирования", field: "script_ok_datetime", headerFilter: true, widthGrow: 2 },
        ],
        dataLoaded: function (data) {
            console.log("dataLoaded");
        },
        renderStarted: function () {
            if (g_moduleActive == "mSoftComp") {
                tableComp.getColumn("operatingSystem").hide()
                tableComp.getColumn("arm").hide()
                tableComp.getColumn("user").hide()
                tableComp.getColumn("script_ok_datetime").hide()
                tableComp.getColumn("maxreestr").hide()
                tableComp.getColumn("id_category").hide()
            }
        },
        cellEditing: function (cell) {
            $("#help").show();
        },
        cellEditCancelled: function (cell) {
            $("#help").hide();
        },
        cellEdited: function (cell) {
            let d = cell.getRow().getData();
            runSQL_p(`UPDATE comp SET maxreestr='${d.maxreestr}', id_category='${d.id_category}' WHERE id=${d.id}`);
            $("#help").hide();
        },
        cellClick: function (e, cell) {
            console.log("ID:" + cell.getRow().getData().id);
            console.log("H: " + cell.getField());

            let fieldName = cell.getField();
            if (["maxreestr", "id_category"].indexOf(fieldName) >= 0) {
                return;
            }
            $("#help").hide();

            let id = cell.getRow().getData().id;
            let name = cell.getRow().getData().name;
            //let appHeight   = $(".modal-content").height() - $(".modal-header").height();
            let id_div = "";
            let tabHeight = 0;
            //let tabulator   = "createTabulatorComp";

            console.log("fieldName:", fieldName);

            if (g_moduleActive == "mComp") {
                //document.getElementById("mainModal").style="";
                //document.getElementById("mainModal").className="tabulator";
                $("#mainModalFooter").html('');
                tabHeight = window.innerHeight - 200;
                activateModalWindow("mainModal");
                id_div = "mainModalBody";
            }

            if (g_moduleActive == "mSoftComp") {
                id_div = "tabCS";
                tabHeight = appH;
            }

            switch (fieldName) {
                case "n_soft":
                    createTabulatorCompSoft(id_div, id, name, tabHeight, 0); break;
                case "n_zapr":
                    createTabulatorCompSoft(id_div, id, name, tabHeight, 3); break;
                case "n_vulner":
                    createTabulatorCompVulner(id_div, id, name, tabHeight, "", g_id_scan_last); break;
                case "n_v0":
                    createTabulatorCompVulner(id_div, id, name, tabHeight, "0", g_id_scan_last); break;
                case "n_v1":
                    createTabulatorCompVulner(id_div, id, name, tabHeight, "1", g_id_scan_last); break;
                case "n_v2":
                    createTabulatorCompVulner(id_div, id, name, tabHeight, "2", g_id_scan_last); break;
                case "n_v3":
                    createTabulatorCompVulner(id_div, id, name, tabHeight, "3", g_id_scan_last); break;
                default:
                    deactivateModalWindow("mainModal")
                    editComp(cell);
            }

        },
        footerElement: msgFooterComp,
    });

    id2e("bREE1").onclick = function () { createReest(1) };
    id2e("bREE2").onclick = function () { createReest(2) };


    tableCmpSetFilter();
}

//=======================================================================================
// модальное окно реестра ресурсов
//=======================================================================================
function createReest(reestr) {
    let list_ARM = getReestr(reestr);
    let type_ARM = (reestr == 2) ? 'серверы' : 'рабочие станции';

    let formReestr = `<div id="fReestr" class="w3-container">
                         ${list_ARM}
                      </div>`;


    newModalWindow('viewReestr', `Реестр узлов ( ${type_ARM})`, formReestr, '', '600px', '5%', '5%');
}

//=======================================================================================
// формирование строки реестра ресурсов
//=======================================================================================
function getReestr(reestr) {
    let reestr_string = '';
    let data_array = tableComp.getData('active');

    data_array.forEach(element => {
        let ip = ip10(element.ip).trim();
        if (element.maxreestr == reestr && ip != '') {
            if (reestr_string == '') {
                reestr_string = reestr_string + ip;
            } else {
                reestr_string = reestr_string + ',' + ip;
            }
        }
    });

    data_array = reestr_string.split(',');
    //console.log(data_array);
    data_array.sort(ip_compare)

    //console.log(data_array);

    reestr_string = '';
    data_array.forEach(element => {
        reestr_string = reestr_string + element + ', ';
    });

    return reestr_string;
}

//=======================================================================================
// модальное окно редактора компьютера ==================================================
//=======================================================================================

function editComp(c) {
    const salt = randomStr(10)
    const win_current = 'editComp' + salt

    let v_description = c.getRow().getData().description;
    let v_distinguishedName = c.getRow().getData().distinguishedName;
    let v_dt1 = c.getRow().getData().dt1;
    let v_esk_status = c.getRow().getData().esk_status;
    let v_file_size = c.getRow().getData().file_size;
    let v_id = c.getRow().getData().id;
    let v_id_status = c.getRow().getData().id_status;
    let v_ip = c.getRow().getData().ip;
    let v_lastLogonTimestamp = c.getRow().getData().lastLogonTimestamp;
    let v_managedBy = c.getRow().getData().managedBy;
    let v_n_soft = c.getRow().getData().n_soft;
    let v_n_v0 = c.getRow().getData().n_v0;
    let v_n_v1 = c.getRow().getData().n_v1;
    let v_n_v2 = c.getRow().getData().n_v2;
    let v_n_v3 = c.getRow().getData().n_v3;
    let v_n_vulner = c.getRow().getData().n_vulner;
    let v_n_zapr = c.getRow().getData().n_zapr;
    let v_name = c.getRow().getData().name;
    let v_on_off = c.getRow().getData().on_off;
    let v_operatingSystem = c.getRow().getData().operatingSystem;
    let v_operatingSystemServicePack = c.getRow().getData().operatingSystemServicePack;
    let v_operatingSystemVersion = c.getRow().getData().operatingSystemVersion;
    let v_script_last_datetime = c.getRow().getData().script_last_datetime;
    let v_script_ok_datetime = c.getRow().getData().script_ok_datetime;
    let v_sono = c.getRow().getData().sono;
    let v_user = c.getRow().getData().user;
    let v_whenCreated = c.getRow().getData().whenCreated;


    let formComp = `<div id="fEditComp" class="w3-container">
                          <form>
                              <b>${v_name} ${v_ip}</b><br><br>
                              <b>объект ЕСК:</b><br> 
                              ${v_distinguishedName} <br><br>
                              <b>краткое описание:</b><br> 
                              ${v_description} <br><br>
                              <b>управляется:</b><br> 
                              ${v_managedBy} <br><br>
                              <b>версия ОС:</b><br> 
                              ${v_operatingSystem} ${v_operatingSystemVersion} ${v_operatingSystemServicePack}<br><br>
                              <b>создан:</b><br>
                              ${v_whenCreated}<br><br>
                              <b>последний вход:</b><br>
                              ${v_lastLogonTimestamp}<br><br>
                              <b>установлено программ - всего/запрещенных:</b><br>
                              ${v_n_soft}/${v_n_zapr}<br><br>
                              <b>уязвимости всего = критического + высокого + среднего + низкого уровня:</b><br>
                              ${v_n_vulner} = ${v_n_v3} + ${v_n_v2} + ${v_n_v1} + ${v_n_v0}<br><br>
                          </form>
                      </div>`;


    newModalWindow(
        win_current,
        '',
        formComp,
        '',
        width = '600px',
        marginLeft = '5%',
        marginTop = '5%',
        win_return = null
    )

    // id_2_set_focus(win_current)

    //$("#mainModalBody").html(formComp);

}


//=======================================================================================
// табулятор ПО, установленного на данном компьютере ====================================
//=======================================================================================

function createTabulatorCompSoft(id_div, comp_id, comp_name, appH, id_status_filter) {
    console.log("COMP:", id_div, comp_id, comp_name);
    tableCompSoft = new Tabulator('#' + id_div, {
        ajaxURL: "myphp/loadDataCompSoft.php",
        ajaxParams: { с: comp_id.toString() },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>ПО, установленное на компьютере:<br>" + comp_name + "<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        rowFormatter: function (row) {
            if (row.getData().id_status == 3) {
                row.getElement().style.backgroundColor = "#ff7575";
            }
        },
        headerFilterPlaceholder: "",
        columns: [
            //{title:"id_soft", field:"id_soft" , width:10, print:false},
            { title: comp_name.toString(), field: "name", headerFilter: true, topCalc: "count", widthGrow: 10 },
            //{title:"установлено", field:"on_off", width:5, headerFilter:true},
            { title: "дата", field: "upd_dt", headerFilter: true, widthGrow: 2 },
        ],
        rowClick: function (e, row) {
            let v_sono = (g_user.sono == "6100") ? "" : g_user.sono;
            createTabulatorSoftComp("tabSC", row.getData().id_soft, row.getData().name, appH, v_sono)
        },
        //cellContext:function(e, cell){tableCompSoft.print(false, false);e.preventDefault();},
    });
    if (id_status_filter == 0) { } else {
        tableCompSoft.setFilter("id_status", "=", id_status_filter);
    }

}

//=======================================================================================
// табулятор уязвимостей, обнаруженных на данном компьютере =============================
//=======================================================================================

function createTabulatorCompVulner(id_div, comp_id, comp_name, appH, id_level_filter, id_scan) {
    console.log("comp_id:", comp_id);
    tableCompVulner = new Tabulator('#' + id_div, {
        ajaxURL: "myphp/loadDataCompVulner.php",
        ajaxParams: { c: comp_id.toString(), sc: id_scan },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Уязвимости, обнаруженные на компьютере:<br>" + comp_name + "<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        rowFormatter: function (row) {
            if (row.getData().id_level == 0) { row.getElement().style.backgroundColor = g_color_v0; }
            if (row.getData().id_level == 1) { row.getElement().style.backgroundColor = g_color_v1; }
            if (row.getData().id_level == 2) { row.getElement().style.backgroundColor = g_color_v2; }
            if (row.getData().id_level == 3) { row.getElement().style.backgroundColor = g_color_v3; }
        },
        headerFilterPlaceholder: "",
        columns: [
            { title: "ID", field: "id_vulner", width: 100, print: false },
            { title: "уровень", field: "id_level", width: 100, print: false },
            { title: comp_name.toString(), field: "name", widthGrow: 10, headerFilter: true, topCalc: "count" },
        ],
        //rowClick:function(e, row){ createTabulatorSoftComp("#tabSC",row.getData().id_soft,row.getData().name, appH) },
        //cellContext:function(e, cell){tableCompSoft.print(false, false);e.preventDefault();},
    });
    if (id_level_filter == "") { } else {
        tableCompVulner.setFilter("id_level", "=", id_level_filter);
    }
}
