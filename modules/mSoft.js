//console.log("load mSoft");
let msgFooterSoft = "<b>ЛЕВАЯ КНОПКА МЫШИ</b> - вывод списка компьютеров, на которых установлено выбранное ПО&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>ПРАВАЯ КНОПКА МЫШИ</b> - вывод на печать или в файл XLSX текущего списка ПО";

function mSoft() {
    console.log("run mSoft");
    let appHeight = appBodyHeight();
    $("#appBody").html('<div id="tabSoft"></div>');
    $("#appBody").height(appHeight);
    createTabulatorSoft("tabSoft", appHeight, msgFooterSoft);

}

//=======================================================================================
// табулятор полного списка ПО ==========================================================
//=======================================================================================

function createTabulatorSoft(id_div, appH, msgF) {
    let allow = getAllows();
    let ed_select = (allow.E=="1") ? "select" : "";
    let ss = g_user.sono.substr(2, 2);
    let ff = "n" + ss;
    console.log("ff=" + ff);
    let cols = [];
    if (g_moduleActive != "mSoftGroup") {
        if (ss == "00" || ss == "99") {
            ff = "nnn";
            cols = [
                { title: "всего", field: "nnn", widthGrow: 1, topCalc: "sum", formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "00", field: "n00", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "52", field: "n52", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "54", field: "n54", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "64", field: "n64", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "65", field: "n65", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "71", field: "n71", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "73", field: "n73", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "74", field: "n74", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "81", field: "n81", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "82", field: "n82", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "83", field: "n83", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "86", field: "n86", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "88", field: "n88", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "91", field: "n91", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "92", field: "n92", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "93", field: "n93", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "94", field: "n94", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "95", field: "n95", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
                { title: "96", field: "n96", widthGrow: 1, formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); }, },
            ];
        } else {
            cols = [{
                title: "", field: ff, widthGrow: 1, topCalc: "count",
                formatter: function (cell) { let vv = cell.getValue(); return (cell.getValue() == 0) ? "" : cell.getValue(); },
            }];
            console.log("COLS=", g_user.sono, ff);
        }
    }

    tableSoft = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataSoft.php",
        ajaxParams: { s: g_user.sono },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Программы<h1>",
        printFooter: "",
        rowFormatter: function (row) {
            if (row.getData().idstatus == 1) { row.getElement().style.backgroundColor = "#949494"; }
            //if(row.getData().idstatus == 2){row.getElement().style.backgroundColor = "#ffffff";}
            if (row.getData().idstatus == 3) { row.getElement().style.backgroundColor = "#ff7575"; }
            if (row.getData().idstatus == 4) { row.getElement().style.backgroundColor = "#00DD00"; }
        },
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        columns: [
            //{title:"id",           field:"id",        headerFilter:true, widthGrow:1, print:false},
            //{title:"id_prog",      field:"id_prog",   headerFilter:true, widthGrow:1, print:false},
            //{title:"id_status",    field:"id_status", headerFilter:true, widthGrow:1, print:false},
            { title: (g_moduleActive == "mSoftGroup") ? "ПО, не входящее в группы" : "Наименование ПО", field: "pname", headerFilter: true, topCalc: "count", widthGrow: 10 },
            {
                title: "статус", field: "sname", widthGrow: 2,
                editor: ed_select, 
                editorParams: { values: sel_STAT },
                headerFilter: true, 
                headerFilterParams: { editor: "select", values: sel_STAT },
                //validator:[{type:ifns_auth==""}],
                cellEdited: function (cell) {
                    let row = cell.getRow();
                    let t_index = row.getIndex();
                    let rowData = row.getData();

                    if (allow.E == "0") {
                        alert("Редактирование запрещено!");
                        row.update({ "sname": i2s(rowData["id_status"]) });
                        cell.getRow().reformat();
                        return;
                    }

                    row.update({ "idstatus": s2i(rowData["sname"]) });
                    rowData = row.getData();
                    console.log("t_index=", t_index, "Data=", rowData["pname"], " ", rowData["sname"]);
                    cell.getRow().reformat();
                    let id_soft = rowData["id"];
                    let id_status = rowData["idstatus"];
                    setSoftStatus(id_soft, id_status, rowData["pname"]);
                },
            },
            //{title:"Количество<br>компьютеров", field:"n_comp", widthGrow:1},
            {//create column group
                title: "Количество АРМов с ПО",
                columns: cols,
            },
        ],

        cellDblClick: function (e, cell) {
            if (g_moduleActive == "mSoftGroup" && c_user_mode == "W") {
                clickSOFT(cell, appH)
            }
        },


        cellClick: function (e, cell) {
            if (g_moduleActive == "mSoftGroup" && c_user_mode == "A") {
                clickSOFT(cell, appH)
                return;
            }

            console.log("ID:" + cell.getRow().getData().id);

            let fieldName = cell.getField();
            let firstSymbolFiedName = fieldName.substring(0, 1);
            let id_soft = cell.getRow().getData().id;
            let soft_name = cell.getRow().getData().pname;
            let appHeight = $(".modal-content").height() - $(".modal-header").height();
            let id_div = "";
            let tabHeight = 0;
            let tabulator = "createTabulatorComp";

            console.log("fieldName:", fieldName);

            if (g_moduleActive == "mSoft") {
                $("#mainModalFooter").html('');
                activateModalWindow("mainModal");
                id_div = "mainModalBody";
                tabHeight = appHeight;
                tabHeight = window.innerHeight - 200;
            }

            if (g_moduleActive == "mSoftComp") {
                id_div = "tabSC";
                tabHeight = appH;
            }

            if (firstSymbolFiedName == "n") {
                let v_sono = (fieldName == "nnn") ? "" : "61" + fieldName.slice(1, 3);
                createTabulatorSoftComp(id_div, id_soft, soft_name, tabHeight, v_sono);
            }

            if (fieldName == "sname") {
                deactivateModalWindow("mainModal");
            }

            if (fieldName == "pname") {
                editSoft(cell);
            }

        },
        footerElement: msgF,
    });

    if (g_moduleActive == "mSoftGroup") {
        tableSoft.setFilter("id_prog", "=", "0");
    }


}


function clickSOFT(cell, appH) {
    let id_soft = cell.getRow().getData().id;
    let idstatus = cell.getRow().getData().idstatus;
    let name_soft = cell.getRow().getData().pname;
    console.log("ID:" + cell.getRow().getData().id);
    console.log("idstatus=", idstatus);
    console.log("g_name_prog=", g_name_prog);
    addSoft2Group(id_soft, g_id_prog, name_soft);
    tableGS.addData([{ id: id_soft, id_prog: g_id_prog, name: name_soft, id_status: idstatus }], true);
    tableSoft.deleteRow(id_soft);
    if (g_name_prog == "") {
        console.log("g_name_prog=", g_name_prog);
        createTabulatorGS("tabGS2", appH, "", g_name_prog, g_id_prog);
        tableGroups.updateData([{ id: g_id_prog, name: name_soft }]);
        g_name_prog = name_soft
    }
}


// добавление ПО в группу ---------------------------------------------------------------
function addSoft2Group(id_soft, id_prog, name_soft) {
    let xhttp;
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("addSoft2Group");
            console.log(this.responseText);
        }
    };
    xhttp.open("GET", "myphp/addSoft2Group.php?id_soft=" + id_soft + "&id_prog=" + id_prog + "&name_soft=" + name_soft, true);
    xhttp.send();
}


//=======================================================================================
// табулятор компьютеров с установленным ПО с id=soft_id ================================
//=======================================================================================

function createTabulatorSoftComp(id_div, soft_id, soft_name, appH, sono) {
    console.log("SONO=" + sono);
    tableSoftComp = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadDataSoftComp.php",
        ajaxParams: { s: soft_id.toString(), i: sono },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        layout: "fitColumns",
        height: appH,
        rowContextMenu: rowMenu(),
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Компьютеры, на которых установлено ПО:<br>" + soft_name + "<h1>",
        printFooter: "",
        headerFilterPlaceholder: "",
        columns: [
            //{title:"id_comp", field:"id_comp" , width:10, print:false},
            {title:"соно", field:"sono" , width:60, headerFilter: true},
            { title: soft_name.toString(), field: "name", headerFilter: true, topCalc: "count", widthGrow: 6 },
            //{title:"АРМ АИС", field:"arm", headerFilter:true, topCalc:"count", width:100},
            { title: "Имя пользователя", field: "user", headerFilter: true, widthGrow: 10 },
            //{title:"комната", field:"room", headerFilter:true, widthGrow:2},
            { title: "обновлено", field: "script_ok_datetime", headerFilter: true, widthGrow: 6 },
        ],
        rowClick: function (e, row) {
            if (g_moduleActive == "mSoftComp") {
                createTabulatorCompSoft("tabCS", row.getData().id_comp, row.getData().name, appH, 0)
            }
        },
        //cellContext:function(e, cell){tableSoftComp.print(false, false);e.preventDefault();},
    });

}


//=======================================================================================
// модальное окно редактора программы ===================================================
//=======================================================================================
function editSoft(c) {
    let allow = getAllows();
    let r     = c.getRow().getData();

    let formSoft = `<div id="sEdit" class="w3-container">
                          <form>
                              <b>ID:</b> ${r.id} <b>статус:</b> ${r.sname} <br><br>
                              <b>название:</b><br> 
                              ${r.pname} <br><br>
                              <label for="license"><b>лицензия:</b></label><br>
                              <textarea id="license" rows="6" style="width:100%">${r.license}</textarea><br>
                              <label for="comment"><b>примечание:</b></label><br>
                              <textarea id="comment" rows="6" style="width:100%">${r.comment}</textarea><br>
                          </form>
                              <button id="ENTER" class="w3-button w3-white w3-border w3-hover-teal"><b>записать</b></button>
                              <button id="CANCEL" class="w3-button w3-white w3-border w3-hover-teal"><b>отмена</b></button>
                              <br><br>
                      </div>`;                    

    $("#mainModalBody").html(formSoft);
    
    let ENTER  = document.getElementById("ENTER");
    let CANCEL = document.getElementById("CANCEL");

    if (allow.E=="0") {
        $("#ENTER").prop('disabled', true);    
        $("#comment").prop('disabled', true);
        $("#license").prop('disabled', true);
    }

    ENTER.onclick =  function() {
        let id      = r.id;
        let license = $("#license").val();
        let comment = $("#comment").val();

        c.getRow().update({"comment":comment,"license":license});    
        c.getRow().reformat();

        runSQL_p(`UPDATE soft SET license='${license}', comment='${comment}' WHERE id=${id}`);
        deactivateModalWindow("mainModal");
    }

    CANCEL.onclick = function() {
        deactivateModalWindow("mainModal");
    }

    activateModalWindow("mainModal");
}
