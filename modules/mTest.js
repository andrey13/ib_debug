const empty_d = {
    id: "-1",
    name: "name",
}

let m_id = 0

function mTest() {
    const bDEL =
        "<button id='delTest' title='Удаление заявки'                 class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
    const bADD =
        "<button id='addTest' title='Создание заявки'                 class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
    const bMOD = `<button id='modTest' title='Изменить заявку'                 class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`

    // верхнее меню с кнопками печати, просмотра, удаления, редактирования и изменения заявки
    const tTopMenu =
        '<div id="tabTopMenu" style="display: inline-block; margin: 2px; padding: 0; width: 100%;">' +
        bDEL +
        bMOD +
        bADD +
        "</div>"

    // пустой контейнер для табулятора
    const tTest =
        '<div id="tabTest" style="display: inline-block; padding: 0; height: 100%; width: 100%; border: 1px solid black; background: powderblue"></div>'

    // шаблон экрана: меню + контейнер
    id2e("appBody").innerHTML = tTopMenu + "<br>" + tTest

    const appHeight = appBodyHeight() - id2e("tabTopMenu").offsetHeight - 8

    createTabTest("tabTest", appHeight)
}

//ШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШ
function createTabTest(id_div, appH) {
    const tableTest = new Tabulator("#" + id_div, {
        ajaxURL: "myphp/loadDataTest.php",
        // ajaxParams: { z: id_zayavka },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Test-устройства<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,

        columns: [
            { title: "id", field: "id" },
            { title: "name", field: "name" },
        ],

        renderStarted: function () {},

        dataLoaded: function (data) {
            //return
            let id_Test = getFirstID(tableTest)
            tableTest.selectRow(id_Test)
        },

        rowClick: function (e, row) {
            console.log("row = ", row.getData())
            return

            const id_Test_old = getCurrentID(tableTest)
            console.log("id_Test_old = ", id_Test_old)

            const id_Test_new = row.getData().id
            console.log("id_Test_new = ", id_Test_new)

            if (id_Test_new == id_Test_old) return
            tableTest.deselectRow(id_Test_old)
            tableTest.selectRow(id_Test_new)
            m_id_usb = id_Test_new
        },

        cellDblClick: function (e, cell) { editTest("edit") },
    })

    id2e("delTest").onclick = function () { delTest()}
    id2e("modTest").onclick = function () { editTest("edit") }
    id2e("addTest").onclick = function () { editTest("new")  }

    id2e(id_div).style.display = "inline-block"

    //=======================================================================================
    // удаление Test
    //=======================================================================================
    function delTest() {
        const d = tableTest.getSelectedData()[0]
        dialogYESNO(
            "запись: " +
                "id:" +
                d.id +
                "<br>" +
                "будет удалена, вы уверены?<br>"
        ).then((ans) => {
            if (ans == "YES") {
                runSQL_p(`DELETE FROM test WHERE id=${d.id}`)
                tableTest.deleteRow(d.id)
                console.log("YES id: ", d.id)
            } else {
                console.log("NO")
            }
        })
    }

    //=======================================================================================
    // модальное окно редактора МТС (mode = 'edit'/'new')
    //=======================================================================================
    function editTest(mode) {
        let d = mode == "edit" ? tableTest.getSelectedData()[0] : Object.assign({}, empty_d)

        if (mode == "new") {
            m_id++
            d.id = m_id
            tableTest.addRow(d, false)
        }
    }
}
