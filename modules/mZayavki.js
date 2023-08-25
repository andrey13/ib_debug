// let cENA = `<input type='checkbox' id='cENA' checked style="vertical-align: middle" onclick="cb_onclick()"><label for='cENA' style="vertical-align: middle"> действительный</label>&nbsp&nbsp&nbsp&nbsp`
// let cDIS = `<input type='checkbox' id='cDIS' checked style="vertical-align: middle" onclick="cb_onclick()"><label for='cDIS' style="vertical-align: middle"> недействительные</label>&nbsp&nbsp&nbsp&nbsp`
// let ms = bPRT + bVEW + bDEL + bMOD + bADD
// let ml = bVEW + '<br>' + bDEL + '<br>' + bMOD + '<br>' + bADD

let m_id_zayavka = 0
let m_id_MTS = 0
let m_id_ARM = 0
let m_id_empty_MTS = 0
let m_id_empty_ARM = 0
let m_ver_zayavki = 0
let m_user_it = 0
let m_user_ib = 0

// пустая заявка --------------------------------------------------------------
const empty_zayavka = {
    id: 0,
    id_type: 0,
    id_user: g_user.id,
    id_user_otd: 0,
    id_user_it: 0,
    id_user_ib: 0,
    id_user_ruk: 0,
    id_user_isp: 0,
    id_depart: g_user.id_depart,
    date: moment().format("YYYY-MM-DD"),
    type: '',
    user: g_user.name,
    user_otd: '<выбрать>',
    user_it: '<выбрать>',
    user_ib: '<выбрать>',
    user_ruk: '<выбрать>',
    user_isp: '<выбрать>',
    depart: g_user.depart,
    comment: '',
}

// пустое MTS -----------------------------------------------------------------
const empty_MTS = {
    id: '0',
    id_zayavka: '0',
    id_status: '0',
    id_user: '0',
    id_mts: '0',
    dsp: '0',
    mts_SN: '',
    size_gb: '0',
    size2: '0',
    user: '',
    reson: '',
    comment: '',
}

// пустой компьютер -----------------------------------------------------------
const empty_ARM = {
    id: -1,
    id_mts: 0,
    id_comp: 0,
    id_zayavka: 0,
    comp_name: '',
    comp_user: '',
    comment: '',
}

function mZayavki() {
    const bVEW = "<button id='vewZayavki' title='Предварительный просмотр заявки' class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-eye'></i></button>"
    const bPRT = "<button id='prtZayavki' title='Сохранение в файле PDF заявки'   class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-download'></i></button>"
    const bDEL = "<button id='delZayavki' title='Удаление заявки'                 class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
    const bADD = "<button id='addZayavki' title='Создание заявки'                 class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
    const bMOD = `<button id='modZayavki' title='Изменить заявку'                 class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`

    // верхнее меню с кнопками печати, просмотра, удаления, редактирования и изменения заявки
    const tTopMenu =
        '<div id="tabTopMenu" style="display: inline-block; margin: 2px; padding: 0; width: 100%;">' + bPRT + bVEW + bDEL + bMOD + bADD + " Список обращений</div>"

    // пустой контейнер для табулятора
    const tZayavki =
        '<div id="tabZayavki" style="display: inline-block; padding: 0; height: 100%; width: 100%; border: 1px solid black; background: powderblue"></div>'

    // шаблон экрана: меню + контейнер
    id2e("appBody").innerHTML = tTopMenu + "<br>" + tZayavki

    const appHeight = appBodyHeight() - id2e("tabTopMenu").offsetHeight - 8

    createTabZayavki("tabZayavki", appHeight)
}

//=======================================================================================
function customFilterZayavki(data, filterParams) {
    return true

    let dt = moment().format("YYYY-MM-DD")
    let cENA = id2e("cENA").checked
    let cDIS = id2e("cDIS").checked

    return (cENA && data.dt_stop >= dt) || (cDIS && data.dt_stop <= dt)
}

//=======================================================================================
function tabZayavkiSetFilter() {
    tableZayavki.setFilter(customFilterZayavki, "")
}

//=======================================================================================
function cb_onclick() {
    tableZayavki.setFilter(customFilterZayavki, "")
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                            ТАБУЛЯТОР ОБРАЩЕНИЙ                                        ///
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createTabZayavki(id_div, appH) {
    // // очистка таймера -----------------------------------------------------------------
    // if (g_timerId != 0) {
    //     clearInterval(g_timerId)
    // }

    // // установка таймера ---------------------------------------------------------------
    // g_timerId = setInterval(async () => {
    //     const ver_zayavki = await verGet('zayavki', g_user.id_depart, 'id_depart')
    //     if (m_ver_zayavki != ver_zayavki) {
    //         m_ver_zayavki = ver_zayavki
    //         // console.log(`ver = ${m_ver_zayavki}`)
    //         tableZayavki.replaceData()
    //     }
    // }, 2000)

    let allow = getAllows()
    let ed = allow.E == 1 ? "input" : ""
    let ed_date = allow.E == 1 ? date_Editor : ""
    //let dt_now = moment().format('YYYY-MM-DDTHH:mm')
    let dt_now = new Date(moment().format("YYYY-MM-DD"))
    dt_now = dt_now.getTime()

    const tableZayavki = new Tabulator("#" + id_div, {
        ajaxURL: "myphp/loadDataZayavki.php",
        ajaxParams: { d: g_user.id_depart },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Обращения<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,
        selectable: true,
        selectableRangeMode: "click",
        reactiveData: true,

        columns: [
            { title: "id", field: "id", width: 50, print: false },
            {
                title: "дата", field: "date", width: 80, headerFilter: true,
                formatter: "datetime",
                formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD.MM.YYYY",
                },
            },
            { title: "тема обращения", field: "type", widthGrow: 2, headerFilter: true },
            // { title: "i_user", field: "id_user", width: 50 },
            { title: "заявитель", field: "user", widthGrow: 2, headerFilter: true },
            // { title: "i_depart", field: "id_depart", width: 50 },
            { title: "отдел", field: "depart", widthGrow: 2, headerFilter: true },
            // { title: "i_user_it", field: "id_user_it", width: 50 },
            // { title: "начальник ОИТ", field: "user_it", widthGrow: 2, headerFilter: true },
            // { title: "i_user_ib", field: "id_user_ib", width: 50 },
            // { title: "начальник ОИБ", field: "user_ib", widthGrow: 2, headerFilter: true },
            { title: "комментарий", field: "comment", widthGrow: 2, headerFilter: true },
        ],

        renderStarted: function () { },

        dataLoaded: function (data) {
            let id_zayavki = getFirstID(tableZayavki)
            m_id_zayavka = id_zayavki
            tableZayavki.selectRow(id_zayavki)
        },

        rowSelectionChanged: function (data, rows) {
            id2e("delZayavki").disabled = data.length == 0
            id2e("modZayavki").disabled = data.length != 1
        },

        rowClick: function (e, row) {
            m_id_zayavka = row.getData().id
        },

        cellDblClick: function (e, cell) {
            editZayavka(tableZayavki.getSelectedData()[0])
        },
    })

    id2e("prtZayavki").onclick = function () {
        printZayavka("print")
    }
    id2e("vewZayavki").onclick = function () {
        printZayavka("view")
    }
    id2e("delZayavki").onclick = function () {
        delZayavkaYESNO()
    }
    id2e("modZayavki").onclick = function () {
        editZayavka(tableZayavki.getSelectedData()[0])
    }
    id2e("addZayavki").onclick = async function () {
        createZayavka()
    }

    id2e(id_div).style.display = "inline-block"
    // tableZayavki.setFilter(customFilterZayavki, "")

    //=======================================================================================
    // выбор типа обращения и вызов функции создания соответствующей заявки
    //=======================================================================================
    function createZayavka() {

        // выбор типа обращения -------------------------------------------------------------
        selectTypes(
            id_taxonomy = 1,
            ok = -1,
            title = "тема обращения",
            width = "50%",
            marginLeft = "25%",
            marginTop = "10%"
        ).then((selected) => {

            // вызов функции создания соответствующей заявки --------------------------------
            switch (selected.id) {
                case '1':
                    createZayavkaMTS(type = selected.name, id_type = '1')
                    break
                case '2':
                    createZayavkaMTS(type = selected.name, id_type = '2')
                    break
            }
        })
    }

    //=======================================================================================
    // создание пустой заявки с последующим редактированием
    //=======================================================================================
    async function createZayavkaMTS(type, id_type) {
        let d = Object.assign({}, empty_zayavka)
        d.id_type = id_type
        d.type = type
        
        // начальник ОИТ ----------------------------------------------------------------
        const depart_it = await getDepart('Отдел информационных технологий')
        const user_it = await getBoss(depart_it.id)
        d.id_user_it = user_it.id
        d.user_it = fio2fio(user_it.name)

        // начальник ОИБ ----------------------------------------------------------------
        const depart_ib = await getDepart('Отдел информационной безопасности')
        const user_ib = await getBoss(depart_ib.id)
        d.id_user_ib = user_ib.id
        d.user_ib = fio2fio(user_ib.name)

        // начальник отдела  ------------------------------------------------------------
        const user_otd = await getBoss(d.id_depart)
        d.id_user_otd = user_otd.id
        d.user_otd = fio2fio(user_otd.name)

        // руководитель -----------------------------------------------------------------
        d.id_user_ruk = 0
        d.user_ruk = 'Мосиенко А.В.'

        console.log('depart_it = ', depart_it)
        console.log('d.id_user_it = ', d.id_user_it)

        const sql = `INSERT INTO zayavka (
                        id_user, 
                        id_type,
                        date, 
                        comment, 
                        id_depart
                    ) 
                    VALUES (
                        ${d.id_user}, 
                        ${d.id_type},
                       '${d.date}', 
                       '${d.comment}', 
                        ${d.id_depart}
                    )`

        runSQL_p(sql).then((id_zayavka) => {
            d.id = id_zayavka
            m_id_zayavka = d.id

            tableZayavki.addRow(d, true)
            tableZayavki.scrollToRow(id_zayavka, "top", false)
            tableZayavki.deselectRow()
            tableZayavki.selectRow(id_zayavka)

            // вызов функции создания соответствующей заявки --------------------------------
            switch (id_type) {
                case '1':
                    editZayavkaMTS1(id_zayavka, 'new', type, id_type)
                    break
                case '2':
                    editZayavkaMTS2(id_zayavka, 'new', type, id_type)
                    break
            }

            // editZayavkaMTS(id_zayavka, 'new', type, id_type)
        })
    }

    //=======================================================================================
    // редактирование заявки
    //=======================================================================================
    function editZayavka(d) {
        switch (d.id_type) {
            case '1':
                editZayavkaMTS1(d.id, 'edit', d.type, d.id_type)
                break
            case '2':
                editZayavkaMTS2(d.id, 'edit', d.type, d.id_type)
                break
        }
    }

    //=======================================================================================
    // модальное окно редактора заявки на получение МТС
    //=======================================================================================

    function editZayavkaMTS1(id_zayavka, mode, type = '', id_type) {
        let allow = getAllows()
        let d = tableZayavki.getSelectedData()[0]

        m_id_zayavka = d.id

        const appH = window.innerHeight - 420
        const headerZayavka = `<h4>Обращение № ${d.id} (${type})</h4>`

        const bDELMTS = "<button id='delMTS' title='Удаление устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
        const bADDMTS = "<button id='addMTS' title='Создание устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
        const bMODMTS = `<button id='modMTS' title='Изменить устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`
        const menuMTS = `<div id="tabMTSmenu" style="display: inline-block; margin: 0px; padding: 0; width: 50%;">${bDELMTS + bMODMTS + bADDMTS} Список МТС</div>`

        const bDELARM = "<button id='delARM' title='Удаление компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
        const bADDARM = "<button id='addARM' title='Создание компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
        const bMODARM = `<button id='modARM' title='Изменить компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`
        const menuARM = `<div id="tabARMmenu" style="display: inline-block; margin: 0px; padding: 0; width: 50%;">${bDELARM + bADDARM} Список рабочих станций</div>`

        const tabMTS = `<div id="tabMTS" style="display: inline-block; margin: 0; padding: 0; height: 100%; width: 50%; border: 1px solid black; background: powderblue""></div>`
        const tabARM = `<div id="tabARM" style="display: inline-block; margin: 0 0 0 -1px; padding: 0; height: 100%; width: 50%; border: 1px solid black; background: powderblue""></div>`

        const bodyZayavka =`<div id="vEditZayavka" style="margin: 0; padding: 1%;" class="w3-container">
                            <div id="userIT" style="position: absolute; right: 0;width: 300px;">
                            Начальнику отдела<br>
                            информационных техногий<br>
                            <button id="selIT" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${d.user_it}</button>
                            </div>
                            <br>
                            <input class="o3-border" type="date" id="z_date" value="${d.date}" tabindex="1">
                            <label for="z_date">  Дата обращения</label>
                            <br>
                            <input class="o3-border" type="text" id="z_comm" value="${d.comment}" tabindex="2">
                            <label for="z_comm">  Комментарии</label>
                            <br>
                            заявитель: <button id="selAuthor" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${d.user}</button>
                            <span id="author-name"></span>
                            <br>
                            начальник отдела: <button id="selOtd" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${d.user_otd}</button>
                            <span id="otd-name"></span>
                            <br>
                            начальник ОИБ: <button id="selIB" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${d.user_ib}</button>
                            <span id="ib-name"></span>
                            <br>
                            руководитель: <button id="selRuk" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${d.user_ruk}</button>
                            <span id="ruk-name"></span>
                            <br>
                            исполнитель: <button id="selIsp" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${d.user_isp}</button>
                            <span id="isp-name"></span>
                            <br>
                            ${menuMTS}${menuARM}
                            ${tabMTS}${tabARM}
                            <br><br>
                            <button id="b_ENTER" class="w3-btn o3-border w3-hover-teal"  tabindex="6">сохранить</button>
                            <button id="b_CANCEL" class="w3-btn o3-border w3-hover-red" tabindex="7">отменить</button>                            
                            <button id="b_PRINT1" class="w3-btn o3-border w3-hover-teal" tabindex="8">печать СЗ на получение</button>
                            <button id="b_PRINT2" class="w3-btn o3-border w3-hover-teal" tabindex="9">печать заявки на подключение</button>
                            </div>`

        footZayavka = ``

        newModalWindow("editZayavka", headerZayavka, bodyZayavka, footZayavka, width = "98%", marginLeft = "1%", marginTop = "1%")

        createTabZMTS("tabMTS", appH, (id_zayavka = d.id))
        createTabComp("tabARM", appH, (id_zayavka = d.id))

        id2e("z_date").focus()
        id2e("z_date").select()

        // кнопка ENTER ---------------------------------------------------------------------
        id2e("b_ENTER").onclick = function () {
            d.date = id2e("z_date").value
            d.comment = id2e("z_comm").value
            runSQL_p(
                `UPDATE zayavka SET date="${d.date}", comment="${d.comment}"} WHERE id=${d.id}`
            )
            verInc('zayavki', g_user.id_depart, 'id_depart')
            removeModalWindow("editZayavka")
            tableZayavki.updateRow(d.id, d)
        }

        // кнопка CANCEL --------------------------------------------------------------------
        id2e("b_CANCEL").onclick = function () {
            if (mode == "new") {
                let id_zayavka = tableZayavki.getSelectedData()[0].id
                delZayavka(id_zayavka)
                tableZayavki.deleteRow(id_zayavka)
                id_zayavka = getFirstID(tableZayavki)
                tableZayavki.selectRow(id_zayavka)
            }
            removeModalWindow("editZayavka")
        }
    } // editZayavkaMTS


    //=======================================================================================
    // печать заявки
    //=======================================================================================
    function printZayavka(mode) { }

    //=======================================================================================
    // модальное окно редактора заявки (mode = 'edit'/'new')
    //=======================================================================================
    function editZayavkaMTS2(id_zayavka, mode, type = '', id_type) {
        let allow = getAllows()
        let d = tableZayavki.getSelectedData()[0]

        m_id_zayavka = d.id

        const appH = window.innerHeight - 420
        const headerZayavka = `<h4>Обращение № ${d.id} (${type})</h4>`

        const bDELMTS = "<button id='delMTS' title='Удаление устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
        const bADDMTS = "<button id='addMTS' title='Создание устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
        const bMODMTS = `<button id='modMTS' title='Изменить устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`
        const menuMTS = `<div id="tabMTSmenu" style="display: inline-block; margin: 0px; padding: 0; width: 50%;">${bDELMTS + bMODMTS + bADDMTS} Список МТС</div>`

        const bDELARM = "<button id='delARM' title='Удаление компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
        const bADDARM = "<button id='addARM' title='Создание компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
        const bMODARM = `<button id='modARM' title='Изменить компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`
        const menuARM = `<div id="tabARMmenu" style="display: inline-block; margin: 0px; padding: 0; width: 50%;">${bDELARM + bADDARM} Список рабочих станций</div>`

        const tabMTS = `<div id="tabMTS" style="display: inline-block; margin: 0; padding: 0; height: 100%; width: 50%; border: 1px solid black; background: powderblue""></div>`
        const tabARM = `<div id="tabARM" style="display: inline-block; margin: 0 0 0 -1px; padding: 0; height: 100%; width: 50%; border: 1px solid black; background: powderblue""></div>`

        const bodyZayavka = `<div id="vEditZayavka" style="margin: 0; padding: 1%;" class="w3-container">
                            <input class="o3-border" type="date" id="z_date" value="${d.date}" tabindex="1">
                            <label for="z_date">  Дата обращения</label>
                            <br>
                            <input class="o3-border" type="text" id="z_comm" value="${d.comment}" tabindex="2">
                            <label for="z_comm">  Комментарии</label>
                            <br>
                            <button id="selAuthor" class="w3-btn w3-padding-small o3-button-fix w3-hover-teal disabled">составил  </button>
                            <span id="author-name">${d.user}</span>
                            <br>
                            <button id="selOtd" class="w3-btn w3-padding-small o3-button-fix w3-hover-teal disabled">подписал  </button>
                            <span id="otd-name">${d.user_otd}</span>
                            <br>
                            <button id="selIB" class="w3-btn w3-padding-small o3-button-fix w3-hover-teal disabled">согласовал</button>
                            <span id="ib-name">${d.user_ib}</span>
                            <br>
                            <button id="selRuk" class="w3-btn w3-padding-small o3-button-fix w3-hover-teal disabled">утвердил</button>
                            <span id="ruk-name">${d.user_ruk}</span>
                            <br>
                            <button id="selIsp" class="w3-btn w3-padding-small o3-button-fix w3-hover-teal disabled">исполнил</button>
                            <span id="isp-name">${d.user_isp}</span>
                            <br>
                            ${menuMTS}${menuARM}
                            ${tabMTS}${tabARM}
                            <br><br>
                            <button id="b_ENTER" class="w3-btn o3-border w3-hover-teal"  tabindex="6">сохранить</button>
                            <button id="b_CANCEL" class="w3-btn o3-border w3-hover-red" tabindex="7">отменить</button>                            
                            <button id="b_PRINT1" class="w3-btn o3-border w3-hover-teal" tabindex="8">печать СЗ на получение</button>
                            <button id="b_PRINT2" class="w3-btn o3-border w3-hover-teal" tabindex="9">печать заявки на подключение</button>
                            </div>`

        footZayavka = ``

        newModalWindow("editZayavka", headerZayavka, bodyZayavka, footZayavka, width = "98%", marginLeft = "1%", marginTop = "1%")

        createTabZMTS("tabMTS", appH, (id_zayavka = d.id))
        createTabComp("tabARM", appH, (id_zayavka = d.id))

        id2e("z_date").focus()
        id2e("z_date").select()

        // кнопка ENTER ---------------------------------------------------------------------
        id2e("b_ENTER").onclick = function () {
            d.date = id2e("z_date").value
            d.comment = id2e("z_comm").value
            runSQL_p(
                `UPDATE zayavka SET date="${d.date}", comment="${d.comment}"} WHERE id=${d.id}`
            )
            verInc('zayavki', g_user.id_depart, 'id_depart')
            removeModalWindow("editZayavka")
            tableZayavki.updateRow(d.id, d)
        }

        // кнопка CANCEL --------------------------------------------------------------------
        id2e("b_CANCEL").onclick = function () {
            if (mode == "new") {
                let id_zayavka = tableZayavki.getSelectedData()[0].id
                delZayavka(id_zayavka)
                tableZayavki.deleteRow(id_zayavka)
                id_zayavka = getFirstID(tableZayavki)
                tableZayavki.selectRow(id_zayavka)
            }
            removeModalWindow("editZayavka")
        }
    } // editZayavkaMTS

    //=======================================================================================
    // модальное окно удаления заявки
    //=======================================================================================
    function delZayavkaYESNO() {
        const data = tableZayavki.getSelectedData()
        dialogYESNO(
            "Выбранные обращения<br><br>будут удалены, вы уверены?<br>"
        ).then((ans) => {
            if (ans == "YES") {
                data.forEach((d) => {
                    delZayavka(d.id)
                    tableZayavki.deleteRow(d.id)
                })
                let id_zayavka = getFirstID(tableZayavki)
                tableZayavki.selectRow(id_zayavka)
                const d = tableZayavki.getSelectedData()
                id2e("delZayavki").disabled = d.length == 0
                id2e("modZayavki").disabled = d.length == 0
            }
        })
    }

    //=======================================================================================
    // удаления заявки
    //=======================================================================================
    function delZayavka(id_zayavka) {
        runSQL_p(`DELETE FROM zayavka WHERE id=${id_zayavka}`)
        runSQL_p(`DELETE FROM zayavka2mts WHERE id_zayavka=${id_zayavka}`)
        runSQL_p(`DELETE FROM mts2comp WHERE id_zayavka=${id_zayavka}`)
        runSQL_p(
            `DELETE FROM mts WHERE id_zayavka=${id_zayavka} AND status="заказ"`
        )
    }

} // createTabZayavki


/////////////////////////////////////////////////////////////////////////////////////////
//                                   ТАБУЛЯТОР МТС                                     //
/////////////////////////////////////////////////////////////////////////////////////////
function createTabZMTS(id_div, appH, id_zayavka = 0) {
    let allow = getAllows()
    let ed = allow.E == 1 ? "input" : ""
    let ed_date = allow.E == 1 ? date_Editor : ""
    //let dt_now = moment().format('YYYY-MM-DDTHH:mm')
    let dt_now = new Date(moment().format("YYYY-MM-DD"))
    dt_now = dt_now.getTime()

    tableMTS = new Tabulator("#" + id_div, {
        ajaxURL: "myphp/loadDataZayavkaMTS.php",
        ajaxParams: { z: id_zayavka },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>MTC-устройства<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,
        selectable: true,
        selectableRangeMode: "click",
        variableHeight: false,
        headerSort: false,

        columns: [
            { title: "id", field: "id", width: 30, print: false },
            // { title: "id_zayavka", field: "id_zayavka", width: 90 },
            // { title: "id_mts", field: "id_mts", width: 90 },
            { title: "дсп", field: "dsp", formatter: "lookup", formatterParams: { 0: "   ", 1: "дсп" }, width: 30 },
            { title: "Гб", field: "size_gb", width: 30 },
            { title: "ответственный", field: "user", widthGrow: 2, formatter: "textarea" },
            { title: "обоснование", field: "reson", widthGrow: 2, formatter: "textarea" },
            { title: "заводской номер", field: "mts_SN", widthGrow: 1 },
            { title: "выдано", field: "date_vidano", width: 100 },
            { title: "подключено", field: "date_podkl", width: 100 },
            { title: "комментарии", field: "comment", widthGrow: 2, formatter: "textarea" },
        ],

        renderStarted: function () { },

        dataLoaded: function (data) {
            const id = getFirstID(tableMTS)
            tableMTS.selectRow(id)
            m_id_MTS = tableMTS.getRow(id).getData().id_mts
            tableARM.setFilter("id_mts", "=", m_id_MTS)
        },

        rowSelectionChanged: function (data, rows) {
            id2e("delMTS").disabled = data.length == 0
            id2e("modMTS").disabled = data.length != 1
            id2e("addARM").disabled = data.length != 1
        },

        rowClick: function (e, row) {
            m_id_MTS = row.getData().id_mts
            tableARM.setFilter("id_mts", "=", m_id_MTS)
        },

        cellDblClick: function (e, cell) {
            editMTS(tableMTS.getSelectedData()[0].id, "edit")
        },
    })

    id2e("delMTS").onclick = function () {
        delMTSYESNO()
    }
    id2e("modMTS").onclick = function () {
        editMTS(tableMTS.getSelectedData()[0].id, "edit")
    }
    id2e("addMTS").onclick = () => {
        // createMTS(id_zayavka)
        createMTS1(id_zayavka)
    }

    id2e(id_div).style.display = "inline-block"
    //tableMTS.setFilter(customFilterZayavki, '')

    //=======================================================================================
    // добавление или изменение МТС
    //=======================================================================================
    async function createMTS(id_zayavka) {
        let id_mts = 0

        const listMTS = await selectMTS("6100", g_user.id_otdel, true)

        return

        listComp.forEach((comp) => {
            const d = Object.assign({}, empty_ARM)
            d.id = 0
            d.id_zayavka = id_zayavka
            d.id_mts = d_MTS.id_mts
            d.id_comp = comp.id_comp
            d.comp_name = comp.name
            d.comp_user = comp.user

            runSQL_p(
                `INSERT INTO mts2comp (id_zayavka,id_mts,id_comp) VALUES (${d.id_zayavka}, ${d.id_mts}, ${d.id_comp})`
            ).then((id) => {
                id_arm = id
                d.id = id
                tableARM.addRow(d, false)
                tableARM.scrollToRow(id_arm, "bottom", false)
                tableARM.deselectRow()
                tableARM.selectRow(id_arm)
                tableARM.redraw()
            })
        })
    }

    //=======================================================================================
    // создание пустого МТС
    //=======================================================================================
    function createMTS1(id_zayavka) {
        let v_id_mts = 0
        let d = Object.assign({}, empty_MTS)
        // console.log("id_zayavka3 = ", id_zayavka)

        runSQL_p(
            `INSERT INTO mts (id_zayavka, status, dsp, size_gb, SN) VALUES (${id_zayavka}, "заказ", 0, 0, '${d.mts_SN}')`
        )
            .then((id_mts) => {
                v_id_mts = id_mts
                return runSQL_p(
                    `INSERT INTO zayavka2mts (id_zayavka, id_mts, size_gb) VALUES (${id_zayavka}, ${id_mts}, 0)`
                )
            })
            .then((id) => {
                d.id = id
                d.id_zayavka = id_zayavka
                d.id_mts = v_id_mts
                tableMTS.addRow(d, true)
                tableMTS.scrollToRow(id, "top", false)
                tableMTS.deselectRow()
                tableMTS.selectRow(id)
                editMTS(id, "new")
            })
    }

    //=======================================================================================
    // модальное окно редактора МТС (mode = 'edit'/'new')
    //=======================================================================================
    async function editMTS(id_mts, mode) {
        let allow = getAllows()
        let d = tableMTS.getSelectedData()[0]
        if (d.user === null) d.user = ''

        const headerZayavkaMTS = `<h4>Параметры МТС №${d.id}</h4>`

        const bodyZayavkaMTS = `<div id="vEditZayavka" style="margin: 0; padding: 1%;" class="w3-container">
                                    <input type="checkbox" id="MTS_dsp" disabled>
                                    <label for="MTS_dsp"> ДСП</label>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <button id="selectUser" class="w3-btn w3-padding-small w3-border w3-border-black w3-hover-teal disabled">ответственное лицо</button>
                                    <span id="user-name">${d.user}</span>
                                    <br>
                                    <input class="o3-border" type="text" id="MTS_size" value="${d.size_gb}" disabled>
                                    <label for="MTS_size">  Объем (Гб) запрошено</label>
                                    <br>
                                    <input class="o3-border" type="text" id="MTS_size2" value="${d.size2}" disabled>
                                    <label for="MTS_size2">  Объем (Гб) фактически выдано</label>
                                    <br>
                                    <input class="o3-border" type="text" id="MTS_SN" value="${d.mts_SN}" disabled>
                                    <label for="MTS_SN">  Серийный номер</label>
                                    <br>
                                    <label for="MTS_reson"><b>Обоснование:</b></label><br>
                                    <textarea id="MTS_reson" rows="3" style="width:100%" disabled>${d.reson}</textarea>
                                    <br>
                                    <label for="MTS_comm"><b>Комментарии:</b></label><br>
                                    <textarea id="MTS_comm" rows="3" style="width:100%" disabled>${d.comment}</textarea>
                                    <br>
                                    <br>
                                    <button id="enterMTS" class="w3-btn o3-border w3-hover-teal"  >сохранить</button>
                                    <button id="cancelMTS" class="w3-btn o3-border w3-hover-red" >отменить</button>                            
                              </div>`

        footZayavkaMTS = ``

        newModalWindow("editMTS", headerZayavkaMTS, bodyZayavkaMTS, footZayavkaMTS, width = "60%", marginLeft = "5%", marginTop = "10%")

        id2e("MTS_dsp").focus()
        id2e("MTS_dsp").select()
        id2e("MTS_dsp").checked = d.dsp == "1"

        // кнопка selectUser ---------------------------------------------------------------------
        id2e("selectUser").onclick = function () {
            selectUser('6100', '', g_user.id_depart, 1, header = 'Выбор ответственного лица', width = '40%', marginLeft = '30%', marginTop = '5%')
                .then(selectedUsers => {
                    selectedUsers.forEach((u) => {
                        d.id_user = u.id
                        d.user = u.name
                        id2e('user-name').innerHTML = d.user
                        console.log(`id_user, user = ${d.id_user} ${d.user}`)
                    })
                })
        }

        // включение/отключение элементов управления согласно роли текущего пользователя ----
        id2e('MTS_dsp').disabled = true
        id2e('MTS_size').disabled = true
        id2e('MTS_SN').disabled = true
        id2e('selectUser').disabled = true
        id2e('MTS_reson').disabled = true
        id2e('MTS_comm').disabled = true

        if (isRole('tex')) {
            id2e('MTS_dsp').disabled = false
            id2e('MTS_size').disabled = false
            id2e('selectUser').disabled = false
            id2e('MTS_reson').disabled = false
        }

        // кнопка ENTER ---------------------------------------------------------------------
        id2e("enterMTS").onclick = function () {
            d.dsp = id2e("MTS_dsp").checked ? "1" : "0"
            d.size_gb = id2e("MTS_size").value
            d.mts_SN = id2e("MTS_SN").value
            d.comment = id2e("MTS_comm").value
            d.reson = id2e("MTS_reson").value

            runSQL_p(`UPDATE zayavka2mts SET 
                        dsp=${d.dsp}, 
                        size_gb=${d.size_gb}, 
                        id_user=${d.id_user}, 
                        reson='${d.reson}', 
                        comment='${d.comment}' WHERE id=${d.id}`)

            runSQL_p(`UPDATE mts SET SN=${d.mts_SN} WHERE id=${d.id_mts}`)

            removeModalWindow("editMTS")
            tableMTS.updateRow(d.id, d)
        }

        // кнопка CANCEL --------------------------------------------------------------------
        id2e("cancelMTS").onclick = function () {
            if (mode == "new") {
                let id = tableMTS.getSelectedData()[0].id
                delMTS(d)
                tableMTS.deleteRow(id)
                id = getFirstID(tableMTS)
                tableMTS.selectRow(id)
                m_id_MTS = tableMTS.getSelectedData().id_mts
                tableARM.setFilter("id_mts", "=", m_id_MTS)
            }
            removeModalWindow("editMTS")
        }
    }

    //=======================================================================================
    // модальное окно удаления MTS
    //=======================================================================================
    function delMTSYESNO() {
        const data = tableMTS.getSelectedData()
        dialogYESNO("Устройства: <br><br>будут удалены, вы уверены?<br>").then(
            (ans) => {
                if (ans == "YES") {
                    data.forEach((d) => {
                        delMTS(d)
                        tableMTS.deleteRow(d.id)
                    })
                    let id_mts = getFirstID(tableMTS)
                    tableMTS.selectRow(id_mts)
                    m_id_MTS = tableMTS.getSelectedData().id_mts
                    tableARM.setFilter("id_mts", "=", m_id_MTS)
                    const d = tableMTS.getSelectedData()
                    id2e("delMTS").disabled = d.length == 0
                    id2e("modMTS").disabled = d.length == 0
                    id2e("addARM").disabled = d.length == 0
                }
            }
        )
    }

    //=======================================================================================
    // удаление MTS
    //=======================================================================================
    function delMTS(d) {
        runSQL_p(`DELETE FROM zayavka2mts WHERE id=${d.id}`)
        runSQL_p(`DELETE FROM mts2comp WHERE id_mts=${d.id_mts}`)
        runSQL_p(`DELETE FROM mts WHERE id=${d.id_mts} AND status="заказ"`)
    }


}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                      ТАБУЛЯТОР РАБОЧИХ СТАНЦИЙ                                          /
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createTabComp(id_div, appH, id_zayavka = 0) {
    let allow = getAllows()
    let ed = allow.E == 1 ? "input" : ""
    let ed_date = allow.E == 1 ? date_Editor : ""
    //let dt_now = moment().format('YYYY-MM-DDTHH:mm')
    let dt_now = new Date(moment().format("YYYY-MM-DD"))
    dt_now = dt_now.getTime()

    tableARM = new Tabulator("#" + id_div, {
        ajaxURL: "myphp/loadDataZayavkaARM.php",
        ajaxParams: { z: id_zayavka },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Рабочие станции<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        scrollToRowPosition: "center",
        scrollToRowIfVisible: false,
        selectable: true,
        selectableRangeMode: "click",
        variableHeight: false,
        headerSort: false,

        columns: [
            { title: "id", field: "id", width: 30, print: false },
            // { title: "id_zayavka", field: "id_zayavka", width: 90 },
            // { title: "id_mts", field: "id_mts", width: 90 },
            // { title: "id_comp", field: "id_comp", width: 90 },
            { title: "название", field: "comp_name", widthGrow: 1 },
            { title: "пользователь", field: "comp_user", widthGrow: 2 },
            { title: "комментарии", field: "comment", widthGrow: 2 },
        ],

        renderStarted: function () { },

        dataLoaded: function (data) {
            const id = getFirstID(tableARM)
            tableARM.selectRow(id)
        },

        rowSelectionChanged: function (data, rows) {
            id2e("delARM").disabled = data.length == 0
            const d = tableMTS.getSelectedData()
            id2e("addARM").disabled = d.length == 0
        },

        rowClick: function (e, row) {
            m_id_ARM = row.getData().id
        },

        cellDblClick: function (e, cell) {
            // editARM(tableARM.getSelectedData()[0].id, id_zayavka, 'edit')
        },
    })

    id2e("delARM").onclick = function () {
        delARMYESNO()
    }

    // id2e("modARM").onclick = function () {
    //     //editARM(tableARM.getSelectedData()[0].id, id_zayavka, 'edit')
    // }

    id2e("addARM").onclick = function () {
        editARM(id_zayavka, "new")
    }

    id2e(id_div).style.display = "inline-block"
    //tableARM.setFilter(customFilterZayavki, '')

    //=======================================================================================
    // создание пустого ARM
    //=======================================================================================
    function createARM(id_zayavka) {
        let d = Object.assign({}, empty_ARM)
        runSQL_p(`INSERT INTO mts2comp () VALUES ()`).then((id) => {
            d.id = id
            d.id_zayavka = id_zayavka
            d.id_mts = tableMTS.getSelectedData()[0].id
            tableARM.addRow(d, true)
            tableARM.scrollToRow(id, "top", false)
            tableARM.deselectRow()
            tableARM.selectRow(id)
            editMTS(id, "new")
        })
    }

    //=======================================================================================
    // добавление или изменение компьютера
    //=======================================================================================
    async function editARM(id_zayavka, mode) {
        // let d = tableARM.getSelectedData()[0]
        let d_MTS = tableMTS.getSelectedData()[0]
        let id_arm = 0

        const listComp = await selectComp("6100", 2, g_user.id_depart, true)

        listComp.forEach((comp) => {
            const d = Object.assign({}, empty_ARM)
            d.id = 0
            d.id_zayavka = id_zayavka
            d.id_mts = d_MTS.id_mts
            d.id_comp = comp.id_comp
            d.comp_name = comp.name
            d.comp_user = comp.user

            runSQL_p(
                `INSERT INTO mts2comp (id_zayavka,id_mts,id_comp) VALUES (${d.id_zayavka}, ${d.id_mts}, ${d.id_comp})`
            ).then((id) => {
                id_arm = id
                d.id = id
                tableARM.addRow(d, false)
                tableARM.scrollToRow(id_arm, "bottom", false)
                tableARM.deselectRow()
                tableARM.selectRow(id_arm)
                tableARM.redraw()
            })
        })
    }

    //=======================================================================================
    // модаальное окно удаления компьютера
    //=======================================================================================
    function delARMYESNO() {
        const data = tableARM.getSelectedData()
        dialogYESNO(
            "Выбранные рабочие станции<br><br>будут удалены, вы уверены?<br>"
        ).then((ans) => {
            if (ans == "YES") {
                data.forEach((d) => {
                    delARM(d)
                    tableARM.deleteRow(d.id)
                })
                let id_arm = getFirstID(tableARM)
                tableARM.selectRow(id_arm)
                const d = tableARM.getSelectedData()
                id2e("delARM").disabled = d.length == 0
            }
        })
    }

    //=======================================================================================
    // удаление MTS
    //=======================================================================================
    function delARM(d) {
        runSQL_p(`DELETE FROM mts2comp WHERE id_comp=${d.id_comp}`)
    }
}
