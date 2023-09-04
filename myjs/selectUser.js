let id_user_select = 0
let account_user_select = ""
let name_select = ""
let sono_select = ""

let s_usr = ""
let s_pwd = ""

//=======================================================================================
// модальное окно выбора пользователя   =================================================
//=======================================================================================
function selectUser(sono, esk, id_depart = 0, selectable = true, header = '', width = '600px', marginLeft = '50%', marginTop = '5%', win_return = null) {
    return new Promise(function (resolve, reject) {
        console.log('id_depart=', id_depart)
        // создание модального окна ----------------------------------------------------------
        const formSelectUser  = `<div id="selectUser" class="w3-container"></div>`
        newModalWindow('selectUser', header, formSelectUser, '', width, marginLeft, marginTop, win_return)

        // const msgFooterSelecttUser = `<span id="select-stats"></span>
        //                             <button id='onoffSel' class='w3-btn w3-white o3-border w3-hover-teal'>Показать помеченные записи</button> 
        //                             <button id='addSel' class='w3-btn w3-white o3-border w3-hover-teal'>Выбрать помеченные записи</button>`

        const msgFooterSelecttUser = `<button id='addSel' class='w3-btn w3-white o3-border w3-hover-teal'>Выбрать помеченные записи</button>`


        appHeight = appBodyHeight() * 0.7
        createTabulatorSelectUser(sono, esk, id_depart, "#selectUserBody", appHeight, msgFooterSelecttUser, resolve, reject, selectable)
        id2e('selectUserMain').focus()
    })
}

//=======================================================================================
// табулятор справочника пользователей ==================================================
//=======================================================================================
function createTabulatorSelectUser(sono, esk, id_depart, id_div, appH, msgF, resolve, reject, selectable) {
    let sono_mask = (g_user.sono == "6100") ? "" : g_user.sono
    let str_depart = id_depart.toString()
    // console.log('str_depart=', str_depart)

    const tableSelectUser = new Tabulator(id_div, {
        ajaxURL: "myphp/loadDataSelectUser.php",
        ajaxConfig: "GET",
        ajaxContentType: "json",
        ajaxParams: { s: sono, e: esk, d:str_depart },
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Пользователи<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        selectable: selectable,

        columns: [
            //{ title: "id", field: "id", widthGrow: 1, headerFilter: true, },
            // { title: "СОНО", field: "sono", widthGrow: 1, headerFilter: true, topCalc: "count" },
            { title: "логин", field: "Account", widthGrow: 2, headerFilter: true },
            { title: "ФИО", field: "name", widthGrow: 4, headerFilter: true },
        ],

        rowSelectionChanged: function (data, rows) {
            // id2e('select-stats').innerHTML = data.length
            id2e('addSel').disabled = (data.length == 0)
        },

        footerElement: msgF,
    })

    // id2e('onoffSel').onclick = function () {
    //     if ($("#onoffSel").text()=="Показать помеченные записи") {
    //         tableSelectUser.setFilter(filterSelect)        
    //         $("#onoffSel").text("Показать все записи")
    //     } else {
    //         tableSelectUser.setFilter()        
    //         $("#onoffSel").text("Показать помеченные записи")
    //     }
        
    // }

    id2e('addSel').onclick = function () {
        let div_modal = id2e('selectUserMain')
        // console.log(tableSelectUser.getSelectedData())
        div_modal.style.display = "none"
        div_modal.remove()
        resolve(tableSelectUser.getSelectedData())
    }


}

function filterSelect(data, filterParams) {
    let id = data.id
    let row = tableSelectUser.searchRows("id", "=", data.id)[0]
    return row.isSelected()
}

