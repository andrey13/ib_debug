// let cENA = `<input type='checkbox' id='cENA' checked style="vertical-align: middle" onclick="cb_onclick()"><label for='cENA' style="vertical-align: middle"> действительный</label>&nbsp&nbsp&nbsp&nbsp`
// let cDIS = `<input type='checkbox' id='cDIS' checked style="vertical-align: middle" onclick="cb_onclick()"><label for='cDIS' style="vertical-align: middle"> недействительные</label>&nbsp&nbsp&nbsp&nbsp`
// let ms = bPRT + bVEW + bDEL + bMOD + bADD
// let ml = bVEW + '<br>' + bDEL + '<br>' + bMOD + '<br>' + bADD

let v1 = null
let m_id_zayavka = 0
let m_id_MTS = 0
let m_id_ARM = 0
let m_id_empty_MTS = 0
let m_id_empty_ARM = 0
let m_ver_zayavki = 0
let m_user_it = 0
let m_user_ib = 0

// виды операций с МТС---------------------------------------------------------
let m_operTypes = []

// статусы заявок--------------------------------------------------------------
let m_statusTypes = []

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
    id_status: 0,
    status: '',
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
    io_it: '0',
    io_ib: '0',
    io_otd: '0',
    io_ruk: '0',
    user_title: '',
    user_isp_title: '',
}

// пустое MTS -----------------------------------------------------------------
const empty_MTS = {
    id: '0',
    id_zayavka: '0',
    id_status: '0',
    id_user: '0',
    id_mts: '0',
    id_oper: '',
    dsp: '0',
    mts_SN: '',
    size_gb: '0',
    size2: '0',
    user: '<выбрать>',
    oper: '',
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

async function mZayavki() {
    m_operTypes = await getTypes('операции с МТС')
    m_statusTypes = await getTypes('статус обращения')

    const bVEW = "<button id='vewZayavki' title='Предварительный просмотр заявки' class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-eye'></i></button>"
    const bPRT = "<button id='prtZayavki' title='Сохранение в файле PDF заявки'   class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-download'></i></button>"
    const bDEL = "<button id='delZayavki' title='Удаление заявки'                 class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
    const bADD = "<button id='addZayavki' title='Создание заявки'                 class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
    const bMOD = `<button id='modZayavki' title='Изменить заявку'                 class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`

    // верхнее меню с кнопками печати, просмотра, удаления, редактирования и изменения заявки
    const tTopMenu =
        '<div id="tabTopMenu" style="display: inline-block; margin: 2px; padding: 0; width: 100%;">' + bDEL + bMOD + bADD + "</div>"

    // пустой контейнер для табулятора
    const tZayavki =
        '<div id="tabZayavki" style="display: inline-block; padding: 0; height: 100%; width: 100%; border: 1px solid black;"></div>'

    // шаблон экрана: меню + контейнер
    id2e("appBody").innerHTML = tTopMenu + "<br>" + tZayavki

    const appHeight = appBodyHeight() - id2e("tabTopMenu").offsetHeight - 8

    createTabZayavki("tabZayavki", appHeight)
}


//=======================================================================================
function getStatusName(id_status) {
    return m_statusTypes.find(t => t.id == id_status).name
}

//=======================================================================================
function getOperName(id_oper) {
    return m_operTypes.find(t => t.id == id_oper).name
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
    // let d = {}

    tableZayavki = new Tabulator("#" + id_div, {
        ajaxURL: "myphp/getZayavki.php",
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
            { title: "состояние", field: "status", width: 100, headerFilter: true },
            { title: "тема обращения", field: "type", widthGrow: 2, headerFilter: true },
            // { title: "i_user", field: "id_user", width: 50 },
            { title: "заявитель", field: "user", widthGrow: 2, headerFilter: true },
            // { title: "i_depart", field: "id_depart", width: 50 },
            { title: "отдел", field: "depart", widthGrow: 2, headerFilter: true },
            // { title: "ruk", field: "id_user_ruk", width: 80 },
            // { title: "it", field: "id_user_it", width: 80 },
            // { title: "ib", field: "id_user_ib", width: 80 },
            // { title: "otd", field: "id_user_otd", width: 80 },
            // { title: "isp", field: "id_user_isp", width: 80 },
            // { title: "начальник ОИТ", field: "user_it", widthGrow: 2, headerFilter: true },
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

    function mutFio(v) {
        return fio2fio0(v)
    }

    // id2e("prtZayavki").onclick = function () {
    //     printZayavka("print")
    // }
    // id2e("vewZayavki").onclick = function () {
    //     printZayavka("view")
    // }
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
        // начальник ОИТ ----------------------------------------------------------------
        const depart_it = await getDepart('Отдел информационных технологий')
        const user_it = await getBoss(depart_it.id)

        // начальник ОИБ ----------------------------------------------------------------
        const depart_ib = await getDepart('Отдел информационной безопасности')
        const user_ib = await getBoss(depart_ib.id)

        // начальник отдела  ------------------------------------------------------------
        const user_otd = await getBoss(g_user.id_depart)

        // руководитель -----------------------------------------------------------------

        // данные для пустой заявки -----------------------------------------------------
        const d = {
            // поля таблицы Zayavka ---
            id: 0,
            date: moment().format("YYYY-MM-DD"),
            id_type: id_type,
            id_status: m_statusTypes[0].id,
            id_depart: g_user.id_depart,
            id_user_ruk: 0,
            id_user_it: user_it.id,
            id_user_ib: user_ib.id,
            id_user_otd: user_otd.id,
            id_user: g_user.id,
            id_user_isp: 0,
            io_ruk: '0',
            io_it: '0',
            io_ib: '0',
            io_otd: '0',
            user_title: '',
            user_isp_title: '',
            status: '',
            comment: '',
            // вычисляемые поля для табулятора ---
            type: type,
            user_ruk: 'Мосиенко А.В.',
            user_it: user_it.name,
            user_ib: user_ib.name,
            user_otd: user_otd.name,
            user: g_user.name,
            user_isp: '<выбрать>',
            depart: g_user.depart,
        }


        console.log('depart_it = ', depart_it)
        console.log('d.id_user_it = ', d.id_user_it)

        const sql = `INSERT INTO zayavka (
                        date, 
                        id_type,
                        id_status,
                        id_depart,
                        id_user_ruk,
                        id_user_it,
                        id_user_ib,
                        id_user_otd,
                        id_user, 
                        id_user_isp,
                        io_ruk,
                        io_it,
                        io_ib,
                        io_otd,
                        user_title,
                        user_isp_title,
                        status,                                                                   
                        comment                        
                    ) 
                    VALUES (
                       '${d.date}', 
                        ${d.id_type},
                        ${d.id_status},
                        ${d.id_depart},
                        ${d.id_user_ruk}, 
                        ${d.id_user_it}, 
                        ${d.id_user_ib}, 
                        ${d.id_user_otd},
                        ${d.id_user},
                        ${d.id_user_isp}, 
                       '${d.io_ruk}', 
                       '${d.io_it}', 
                       '${d.io_ib}', 
                       '${d.io_otd}', 
                       '${d.user_title}',
                       '${d.user_isp_title}',
                       '${d.status}',                                              
                       '${d.comment}'
                    )`

        runSQL_p(sql).then((id_zayavka) => {
            d.id = id_zayavka
            m_id_zayavka = d.id
            addTabRow(tableZayavki, d, top = true)

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
    // модальное окно редактора заявки на получение/возврат/замену МТС
    //=======================================================================================

    async function editZayavkaMTS1(id_zayavka, mode, type = '', id_type) {
        let allow = getAllows()
        let d = tableZayavki.getSelectedData()[0]

        m_id_zayavka = d.id

        // подготовка полей формы ---------------------------------------------------------
        const title_ruk = (d.io_ruk == '0') ? 'Руководитель' : 'И.о. руководителя'
        const title_it = (d.io_it == '0') ? 'Начальнику отдела информационных технологий' : 'И.о. начальника отдела информационных технологий'
        const title_ib = (d.io_ib == '0') ? 'Начальник отдела информационной безопасности' : 'И.о. начальника отдела информационной безопасности'
        const title_usr = ((await id_user_2_data(d.id_user)).title.toLowerCase()) + ' ' + txt2dat(d.depart.toLowerCase())
        const title_otd = ((d.io_otd == '0') ? 'Начальник ' : 'И.о. начальника ') + txt2dat(d.depart.toLowerCase())
        const title_isp = ''

        const appH = window.innerHeight - 600
        const headerZayavka = `<h4>Обращение № ${d.id} (${type})</h4>`

        const bDELMTS = "<button id='delMTS' title='Удаление устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
        const bADDMTS = "<button id='addMTS' title='Создание устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
        const bMODMTS = `<button id='modMTS' title='Изменить устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`
        const menuMTS = `<div id="tabMTSmenu" style="display: inline-block; margin: 0px; padding: 0; width: 100%;">${bDELMTS + bMODMTS + bADDMTS}</div>`

        // const bDELARM = "<button id='delARM' title='Удаление компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
        // const bADDARM = "<button id='addARM' title='Создание компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
        // const bMODARM = `<button id='modARM' title='Изменить компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`
        // const menuARM = `<div id="tabARMmenu" style="display: inline-block; margin: 0px; padding: 0; width: 50%;">${bDELARM + bADDARM} Список рабочих станций</div>`

        const tabMTS = `<div id="tabMTS" style="display: inline-block; margin: 0; padding: 0; height: 100%; width: 100%; border: 1px solid black; background: white"></div>`
        // const tabARM = `<div id="tabARM" style="display: inline-block; margin: 0 0 0 -1px; padding: 0; height: 100%; width: 50%; border: 1px solid black; background: powderblue"></div>`

        const bodyZayavka = `<div id="" style="margin: 0; padding: 1%;" class="w3-container">
                            <div id="userIT" style="position: absolute; right: 0;width: 400px;">
                                <span id="title-it">${title_it}</span>
                                <br>
                                <button id="selIT" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${fio2dat(d.user_it)}</button>
                            </div>
                            <br>
                            <br>

                            <input class="o3-border" type="date" id="z_date" value="${d.date}">
                            <label for="z_date">  Дата обращения</label>
                            <br>

                            <center><h4>Прошу осуществить выдачу/возврат/замену МТС следующим сотрудникам:</h4></center>
                            <br>

                            ${menuMTS}
                            ${tabMTS}
                            <label for="z_comm">Комментарии</label><br>
                            <textarea id="z_comm" rows="3" style="width:100%" class="o3-border" value="${d.comment}"></textarea>                            
                            <br>

                            <span id="title-otd">${title_otd}:</span>
                            <br> 
                            <button id="selOtd" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${d.user_otd}</button>
                            <br>

                            Заявитель: ${title_usr}:<br>
                            <button id="selAuthor" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${d.user}</button>
                            <br>

                            Исполнитель: ${title_isp}:<br>
                            <button id="selIsp" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${d.user_isp}</button>
                            <br>
                            
                            <button id="b_ENTER" class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить как черновик</button>
                            <button id="b_ACTION" class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить и отправить на выполнение</button>
                            <button id="b_CANCEL" class="w3-btn w3-padding-small o3-border w3-hover-red">отменить</button>                            
                            <button id="b_PRINT1" class="w3-btn w3-padding-small o3-border w3-hover-teal">печать служебной записки</button>
                            </div>`

        footZayavka = ``

        newModalWindow("editZayavka", headerZayavka, bodyZayavka, footZayavka, width = "98%", marginLeft = "1%", marginTop = "1%")

        createTabZMTS("tabMTS", appH, (id_zayavka = d.id))
        // createTabComp("tabARM", appH, (id_zayavka = d.id))

        id2e("z_date").focus()
        id2e("z_date").select()

        // кнопка выбора начальника ОИТ -------------------------------------------------------
        id2e("selIT").onclick = async function () {
            const depart_it = (await getDepart('Отдел информационных технологий'))
            const id_depart_it = depart_it.id
            const id_boss = (await getBoss(id_depart_it)).id

            selectUser('6100', '', id_depart_it, 1, header = 'Выбор начальника (и.о. начальника) ОИТ', width = '40%', marginLeft = '40%', marginTop = '5%')
                .then(selectedUsers => {
                    selectedUsers.forEach((u) => {
                        d.id_user_it = u.id
                        d.user_it = u.name
                        id2e('selIT').innerHTML = fio2dat(d.user_it)
                        id2e('title-it').innerHTML = (id_boss != u.id) ? 'И.о. начальника отдела информационных технологий' : 'Начальнику отдела информационных технологий'
                        d.io_it = (id_boss != u.id) ? '1' : '0'
                    })
                })
        }

        // кнопка выбора начальника отдела -------------------------------------------------------
        id2e("selOtd").onclick = async function () {
            const depart_name = (await id_depart_2_data(d.id_depart)).name
            const deaprt_name_dat = txt2dat(depart_name)
            const header_otd = 'Выбор начальника (и.о. начальника) ' + txt2dat(depart_name)
            const id_boss = (await getBoss(d.id_depart)).id

            selectUser('6100', '', d.id_depart, 1, header = header_otd, width = '40%', marginLeft = '20%', marginTop = '5%')
                .then(selectedUsers => {
                    selectedUsers.forEach((u) => {
                        d.id_user_ib = u.id
                        d.user_ib = u.name
                        id2e('selOtd').innerHTML = d.user_ib
                        id2e('title-otd').innerHTML = ((id_boss != u.id) ? 'И.о. начальника ' : 'Начальник ') + deaprt_name_dat
                        d.io_otd = (id_boss != u.id) ? '1' : '0'
                    })
                })
        }

        // кнопка ENTER ---------------------------------------------------------------------
        id2e("b_ENTER").onclick = function () {
            d.date = id2e("z_date").value
            d.comment = id2e("z_comm").value
            d.status = getStatusName(d.id_status)
            console.log(`d2 = `, d)
            runSQL_p(
                `UPDATE zayavka SET 
                    date="${d.date}", 
                    id_type=${d.id_type},
                    id_status=${d.id_status},
                    id_depart=${d.id_depart},
                    id_user_ruk=${d.id_user_ruk},
                    id_user_it=${d.id_user_it},
                    id_user_ib=${d.id_user_ib},
                    id_user_otd=${d.id_user_otd},
                    id_user=${d.id_user},
                    id_user_isp=${d.id_user_isp},
                    io_ruk="${d.io_ruk}",
                    io_it="${d.io_it}",
                    io_ib="${d.io_ib}",
                    io_otd="${d.io_otd}",
                    user_title="${d.user_title}",
                    user_isp_title="${d.user_isp_title}",
                    status="${d.status}",             
                    comment="${d.comment}"
                WHERE id=${d.id}`
            )
            verInc('zayavki', g_user.id_depart, 'id_depart')
            removeModalWindow("editZayavka")
            tableZayavki.updateRow(d.id, d)
        }

        // кнопка ACTION ---------------------------------------------------------------------
        id2e("b_ACTION").onclick = function () {
            d.date = id2e("z_date").value
            d.comment = id2e("z_comm").value
            d.id_status++
            d.status = getStatusName(d.id_status)
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

        // кнопка PRINT1 --------------------------------------------------------------------
        id2e("b_PRINT1").onclick = function () {
            const id_zayavka = tableZayavki.getSelectedData()[0].id
            printZayavka(id_zayavka, 'view')
        }


    } // editZayavkaMTS


    //=======================================================================================
    // печать заявки
    //=======================================================================================
    function printZayavka(id_zayavka, mode) {
        const zay_data = tableZayavki.getSelectedData()[0]
        const mts_data = tableMTS.getData()
        const title_it = ((zay_data.io_it == '0') ? 'Начальнику\n' : 'И.о. начальника\n') + 'отдела информационных технологий\n' + 'УФНС России по Ростовской области\n'
        console.log('zay_data = ', zay_data)
        console.log('mts_data = ', mts_data)

        let table = []
        let table_content = []
        let i = 0

        // предварительная подготовка страницы ------------------------------------------
        pdfMake.fonts = {
            times: {
                normal: 'times.ttf',
                bold: 'timesbd.ttf',
                italics: 'timesi.ttf',
                bolditalics: 'timesbi.ttf'
            }
        }

        let doc_head = {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pageMargins: [30, 30, 30, 30],
            defaultStyle: { font: 'times', fontSize: 9, },
            styles: {
                header1: { font: 'times', fontSize: 12, alignment: 'right', },
                header2: { font: 'times', fontSize: 12, alignment: 'center', bold: true, },
                header3: { font: 'times', fontSize: 12, alignment: 'justify', margin: [20, 0, 0, 0] },
                header4: { font: 'times', fontSize: 12, alignment: 'justify', margin: [0, 0, 0, 0] },
                header5: { font: 'times', fontSize: 12, alignment: 'center', margin: [10, 0, 10, 0] },
                header6: { font: 'times', fontSize: 12, alignment: 'left', },
                header7: { font: 'times', fontSize: 12, alignment: 'left', margin: [300, 0, 10, 0] },
                footer6: { font: 'times', fontSize: 8, alignment: 'left', italics: true, margin: [20, 0, 0, 0] },
                table: { margin: [0, 0, 0, 0] },
                tableHeader: { bold: true, fontSize: 8, alignment: 'center', }
            },
            footer: {
                columns: [
                    { text: g_user.name + '\n' + g_user.tel, style: ['footer6'] },
                ]
            },
        }

        let content0 = [
            { text: title_it + fio2dat(zay_data.user_it) + '\n\n\n', style: ['header1'] },
            { text: 'СЛУЖЕБНАЯ ЗАПИСКА\n\n', style: ['header2'] },
        ]

        pdf_file_name = 'Служебная записка МТС.pdf'
        content0.push({ text: 'Прошу осуществить выдачу/возврат/замену МТС следующим сотрудникам:\n\n', style: ['header5'] })

        table = [{
            style: 'table',
            table: {
                widths: [35, 14, 14, 100, 100, 100, 100], headerRows: 1,
                body: [[{ text: 'операция', style: 'tableHeader' },
                { text: 'дсп', style: 'tableHeader' },
                { text: 'Гб', style: 'tableHeader' },
                { text: 'ответственных', style: 'tableHeader' },
                { text: 'заводской номер', style: 'tableHeader' },
                { text: 'обоснование', style: 'tableHeader' },
                { text: 'комментарий', style: 'tableHeader' },
                ]]
            }
        }]

        mts_data.forEach((d) => {
            const dsp = (d.dsp == '1') ? 'дсп' : ''
            table_content[i] = [d.oper, dsp, d.size_gb, d.user, d.mts_SN, d.reson, d.comment]
            i += 1
        })

        table[0].table.body = table[0].table.body.concat(table_content)

        const content = content0.concat(table)

        let doc = Object.assign(doc_head, { content: content })

        if (mode == 'view') {
            pdfMake.createPdf(doc).open()
        } else {
            pdfMake.createPdf(doc).download(pdf_file_name)
        }
    }


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

        const bodyZayavka = `<div id="" style="margin: 0; padding: 1%;" class="w3-container">
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
                `UPDATE zayavka SET 
                    date="${d.date}", 
                    id_type=${d.id_type},
                    id_status=${d.id_status},
                    id_depart=${d.id_depart},
                    id_user_ruk=${d.id_user_ruk},
                    id_user_it=${d.id_user_it},
                    id_user_ib=${d.id_user_ib},
                    id_user_otd=${d.id_user_otd},
                    id_user=${d.id_user},
                    id_user_isp=${d.id_user_isp},
                    io_ruk='${d.io_ruk}',
                    io_it='${d.io_it}',
                    io_ib='${d.io_ib}',
                    io_otd='${d.io_otd}',
                    user_title='${d.user_title}',
                    user_isp_title='${d.user_isp_title}',
                    status='${d.status}',             
                    comment="${d.comment}"} 
                WHERE id=${d.id}`
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
//                                  ТАБУЛЯТОР МТС                                      //
/////////////////////////////////////////////////////////////////////////////////////////

function createTabZMTS(id_div, appH, id_zayavka = 0, syncWithARM = false) {
    let allow = getAllows()
    let ed = allow.E == 1 ? "input" : ""
    let ed_date = allow.E == 1 ? date_Editor : ""
    //let dt_now = moment().format('YYYY-MM-DDTHH:mm')
    let dt_now = new Date(moment().format("YYYY-MM-DD"))
    dt_now = dt_now.getTime()
    console.log('id_zayavka = ', id_zayavka)

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
            // { title: "id_zayavka", field: "id_zayavka", width: 90 },
            { title: "id", field: "id", width: 50, print: false },
            { title: "id_mts", field: "id_mts", width: 50 },
            { title: "дсп", field: "dsp", formatter: "lookup", formatterParams: { 0: "   ", 1: "дсп" }, width: 30 },
            { title: "ответственный", field: "user", widthGrow: 2, formatter: "textarea" },
            { title: "операция", field: "oper", width: 90 },
            {//create column group
                title: "Запрошено",
                columns: [
                    { title: "Гб", field: "size_gb", width: 30 },
                    { title: "обоснование", field: "reson", widthGrow: 2, formatter: "textarea" },
                ],
            },
            {//create column group
                title: "Фактически выдано",
                columns: [
                    { title: "Гб", field: "mts_size1", width: 30 },
                    { title: "SN1", field: "mts_SN1", widthGrow: 1 },
                ],
            },
            {//create column group
                title: "Выдано в качестве замены",
                columns: [
                    { title: "Гб", field: "mts_size2", width: 30 },
                    { title: "SN2", field: "mts_SN2", widthGrow: 1 },
                ],
            },
            { title: "выполнено", field: "date_vidano", width: 100 },
            { title: "подключено", field: "date_podkl", width: 100 },
            { title: "комментарии", field: "comment", widthGrow: 2, formatter: "textarea" },
        ],

        renderStarted: function () { },

        dataLoaded: function (data) {
            const id = getFirstID(tableMTS)
            tableMTS.selectRow(id)
            m_id_MTS = tableMTS.getRow(id).getData().id_mts
            if (syncWithARM) tableARM.setFilter("id_mts", "=", m_id_MTS)
        },

        rowSelectionChanged: function (data, rows) {
            id2e("delMTS").disabled = data.length == 0
            id2e("modMTS").disabled = data.length != 1
            if (syncWithARM) id2e("addARM").disabled = data.length != 1
        },

        rowClick: function (e, row) {
            m_id_MTS = row.getData().id_mts
            if (syncWithARM) tableARM.setFilter("id_mts", "=", m_id_MTS)
        },

        cellDblClick: function (e, cell) {
            editMTS(tableMTS.getSelectedData()[0].id, "edit")
        },
    })

    id2e("delMTS").onclick = function () {
        delMTSYESNO()
    }
    id2e("modMTS").onclick = function () {
        editMTS(tableMTS.getSelectedData()[0].id, "edit", syncWithARM)
    }
    id2e("addMTS").onclick = () => {
        // createMTS(id_zayavka)
        createMTS(id_zayavka)
    }

    id2e(id_div).style.display = "inline-block"
    //tableMTS.setFilter(customFilterZayavki, '')

    //=======================================================================================
    // создание пустого МТС
    //=======================================================================================
    function createMTS(id_zayavka) {
        const d = {
            // поля таблицы Zayavka2mts------------------
            id: '0',
            id_zayavka: id_zayavka,
            id_status: '0',
            id_user: '0',
            id_mts: '0',
            id_mts2: '0',
            id_oper: m_operTypes[0].id,
            size_gb: 0,
            dsp: '0',
            reson: '',
            comment: '',
            date_zakaz: '',
            date_vdano: '',
            date_podkl: '',

            // поля SN и size_gb из таблицы mts ----------------------
            mts_SN1: '',
            mts_SN2: '',
            mts_size1: '0',
            mts_size2: '0',

            // поле name из таблицы user (расшифровка id_user)---
            user: '<выбрать>',

            // поле name из таблицы types (расшифровка id_oper) -
            oper: '',

            // ???????????????
            // mts_SN: '',
        }

        runSQL_p(
            `INSERT INTO zayavka2mts (
                id_zayavka, 
                id_status,
                id_oper,                
                size_gb,
                reson,
                comment
            ) VALUES (
                ${d.id_zayavka}, 
                0,
                ${d.id_oper}, 
                ${d.size_gb},
               "${d.reson}",
               "${d.comment}"
            )`
        )
            .then((id) => {
                d.id = id
                d.id_zayavka = id_zayavka
                addTabRow(tableMTS, d, false)
                editMTS(id, "new")
            })
    }


    //=======================================================================================
    // модальное окно редактора МТС (mode = 'edit'/'new')
    //=======================================================================================
    async function editMTS(id_mts, mode, syncWithARM = false) {
        const allow = getAllows()
        const d = tableMTS.getSelectedData()[0]

        d.mts_size1 = (!!!d.mts_size1) ? '' : d.mts_size1
        d.mts_size2 = (!!!d.mts_size2) ? '' : d.mts_size2
        d.mts_SN1 = (!!!d.mts_SN1) ? '' : d.mts_SN1
        d.mts_SN2 = (!!!d.mts_SN2) ? '' : d.mts_SN2

        console.log('d = ', d)

        if (d.user === null) d.user = '<выбрать>'

        const headerZayavkaMTS = `<h4>параметры МТС</h4>`

        const bodyZayavkaMTS =
            `<div id="vEditMTS" style="margin: 0; padding: 1%;" class="w3-container">
                <center>Ответственное лицо:<button id="selectUser" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${d.user}</button></center>
                <br>                                    

                <span style="display: flex; align-items: center;" v-for="o in operTypes">
                    <input type="radio" :id="'oper'+o.id" name="operTypes" v-bind:value="o.id" v-model="id_oper">
                    <label v-bind:for="'oper'+o.id">&nbsp;{{ o.name }}</label>
                </span>                
                
                <br>
                
                <input type="checkbox" id="MTS_dsp" disabled>
                <label for="MTS_dsp"> ДСП</label>
                <br><br>
                &nbsp;Запрошено:<br>
                <input class="o3-border" type="text" id="MTS_size" value="${d.size_gb}" disabled>
                <label for="MTS_size">  Объем (Гб)</label>
                <br><br>

                <button id="selectMTS1" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal" style="text-align: left;" disabled>Фактически выдано:       </button><br>
                <input class="o3-border" type="text" id="MTS_size1" value="${d.mts_size1}" style="width: 100px;" disabled>
                <label for="MTS_size1">  Объем (Гб)</label>
                <br>
                
                <input class="o3-border" type="text" id="MTS_SN1" value="${d.mts_SN1}" style="width: 400px;" disabled>
                <label for="MTS_SN1">  Серийный номер</label>
                <br><br>
                
                <button id="selectMTS2" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal" style="text-align: left;" disabled>Выдано в качестве замены:</button><br>
                <input class="o3-border" type="text" id="MTS_size2" value="${d.mts_size2}" style="width: 100px;" disabled>
                <label for="MTS_size2">  Объем (Гб)</label>
                <br>
                
                <input class="o3-border" type="text" id="MTS_SN2" value="${d.mts_SN2}" style="width: 400px;" disabled>
                <label for="MTS_SN2">  Серийный номер</label>
                <br><br>
                
                <label for="MTS_reson"><b>Обоснование:</b></label><br>
                <textarea id="MTS_reson" rows="3" style="width:100%" disabled>${d.reson}</textarea>
                <br>
                
                <label for="MTS_comm"><b>Комментарии:</b></label><br>
                <textarea id="MTS_comm" rows="3" style="width:100%" disabled>${d.comment}</textarea>
                <br>
                <br>
                <button id="enterMTS" class="w3-btn w3-padding-small o3-border w3-hover-teal"  >сохранить</button>
                <button id="cancelMTS" class="w3-btn w3-padding-small o3-border w3-hover-red" >отменить</button>                            
            </div>`

        footZayavkaMTS = ``

        newModalWindow("editMTS", headerZayavkaMTS, bodyZayavkaMTS, footZayavkaMTS, width = "60%", marginLeft = "5%", marginTop = "10%")

        v1 = Vue.createApp({
            data() {
                return {
                    operTypes: m_operTypes,
                    text: 'ABC',
                    id_oper: d.id_oper,
                    oper: d.oper,
                }
            }
        }).mount('#vEditMTS');

        const e_selectUser = id2e("selectUser")
        const e_selectMTS1 = id2e("selectMTS1")
        const e_selectMTS2 = id2e("selectMTS2")
        const e_MTS_dsp = id2e('MTS_dsp')
        const e_MTS_size = id2e('MTS_size')
        const e_MTS_size1 = id2e('MTS_size1')
        const e_MTS_size2 = id2e('MTS_size2')
        const e_MTS_SN1 = id2e('MTS_SN1')
        const e_MTS_SN2 = id2e('MTS_SN2')
        const e_MTS_reson = id2e('MTS_reson')
        const e_MTS_comm = id2e('MTS_comm')


        e_MTS_dsp.focus()
        e_MTS_dsp.select()
        e_MTS_dsp.checked = d.dsp == "1"


        // кнопка selectUser ---------------------------------------------------------------------
        e_selectUser.onclick = function () {
            selectUser('6100', '', g_user.id_depart, 1, header = 'Выбор ответственного лица', width = '40%', marginLeft = '30%', marginTop = '5%')
                .then(selectedUsers => {
                    selectedUsers.forEach((u) => {
                        d.id_user = u.id
                        d.user = u.name
                        e_selectUser.innerHTML = d.user
                    })
                })
        }

        // включение/отключение элементов управления согласно роли текущего пользователя ----

        if (isRole('tex')) {
            e_MTS_dsp.disabled = false
            e_MTS_size.disabled = false
            e_selectUser.disabled = false
            e_MTS_reson.disabled = false
        }

        if (isRole('su')) {
            e_MTS_dsp.disabled = false
            e_MTS_size.disabled = false
            e_selectUser.disabled = false
            e_selectMTS1.disabled = false
            e_selectMTS2.disabled = false
            e_MTS_reson.disabled = false
            e_MTS_comm.disabled = false
        }

        // кнопка выбора фактически выданного МТС -------------------------------------------
        e_selectMTS1.onclick = async () => {
            const id_otdel = (isRole('su') || isRole('tex')) ? 0 : g_user.id_otdel
            const mts = await selectMTS("6100", id_otdel, selectable = 1)
            d.id_mts = mts.id
            d.mts_size1 = mts.size_gb
            d.mts_SN1 = mts.SN
            e_MTS_size1.value = mts.size_gb
            e_MTS_SN1.value = mts.SN
        }

        // кнопка выбора МТС выданного в качестве замены ------------------------------------
        e_selectMTS2.onclick = async () => {
            // const mts = await selectMTS("6100", g_user.id_otdel, selectable = 1)
            const id_otdel = (isRole('su') || isRole('tex')) ? 0 : g_user.id_otdel
            const mts = await selectMTS("6100", id_otdel, selectable = 1)
            d.id_mts2 = mts.id
            d.mts_size2 = mts.size_gb
            d.mts_SN2 = mts.SN
            e_MTS_size2.value = mts.size_gb
            e_MTS_SN2.value = mts.SN
        }

        // кнопка ENTER ---------------------------------------------------------------------
        id2e("enterMTS").onclick = () => {
            d.dsp = e_MTS_dsp.checked ? "1" : "0"
            d.size_gb = e_MTS_size.value
            d.mts_SN1 = e_MTS_SN1.value
            d.mts_SN2 = e_MTS_SN2.value
            d.comment = e_MTS_comm.value
            d.reson = e_MTS_reson.value
            d.id_oper = v1.$data.id_oper
            d.oper = getOperName(d.id_oper)

            runSQL_p(
                `UPDATE zayavka2mts SET 
                    dsp=${d.dsp}, 
                    size_gb=${d.size_gb}, 
                    id_user=${d.id_user}, 
                    id_oper=${d.id_oper},
                    id_mts=${d.id_mts},
                    id_mts2=${d.id_mts2},
                    reson='${d.reson}', 
                    comment='${d.comment}' 
                WHERE id=${d.id}`
            )

            removeModalWindow("editMTS")
            tableMTS.updateRow(d.id, d)
        }

        // кнопка CANCEL --------------------------------------------------------------------
        id2e("cancelMTS").onclick = () => {
            if (mode == "new") {
                let id = tableMTS.getSelectedData()[0].id
                delMTS(d)
                tableMTS.deleteRow(id)
                id = getFirstID(tableMTS)
                tableMTS.selectRow(id)
                m_id_MTS = tableMTS.getSelectedData().id_mts
                if (syncWithARM) tableARM.setFilter("id_mts", "=", m_id_MTS)
            }
            removeModalWindow("editMTS")
        }
    }

    //=======================================================================================
    // модальное окно удаления MTS
    //=======================================================================================
    function delMTSYESNO(syncWithARM = false) {
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
                    if (syncWithARM) id2e("addARM").disabled = d.length == 0
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
        // runSQL_p(`DELETE FROM mts WHERE id=${d.id_mts} AND status="заказ"`)
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

            // tableARM.addRow(d, true)
            // tableARM.scrollToRow(id, "top", false)
            // tableARM.deselectRow()
            // tableARM.selectRow(id)

            addTabRow(tableARM, d, top = true)
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

                // tableARM.addRow(d, false)
                // tableARM.scrollToRow(id_arm, "bottom", false)
                // tableARM.deselectRow()
                // tableARM.selectRow(id_arm)
                // tableARM.redraw()

                addTabRow(tableARM, d, top = false)
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






//==================================================================
    // //=======================================================================================
    // // добавление или изменение МТС выбором из существуующих
    // //=======================================================================================
    // async function createMTS(id_zayavka) {
    //     let id_mts = 0

    //     const listMTS = await selectMTS("6100", g_user.id_otdel, true)

    //     return

    //     listComp.forEach((comp) => {
    //         const d = Object.assign({}, empty_ARM)
    //         d.id = 0
    //         d.id_zayavka = id_zayavka
    //         d.id_mts = d_MTS.id_mts
    //         d.id_comp = comp.id_comp
    //         d.comp_name = comp.name
    //         d.comp_user = comp.user

    //         runSQL_p(
    //             `INSERT INTO mts2comp (id_zayavka,id_mts,id_comp) VALUES (${d.id_zayavka}, ${d.id_mts}, ${d.id_comp})`
    //         ).then((id) => {
    //             id_arm = id
    //             d.id = id
    //             addTabRow(tableMTS, d, top = false)
    //         })
    //     })
    // }

    // //=======================================================================================
    // // создание пустого МТС
    // //=======================================================================================
    // function createMTS1(id_zayavka) {
    //     let v_id_mts = 0
    //     let d = Object.assign({}, empty_MTS)
    //     d.id_oper = m_operTypes[0].id

    //     runSQL_p(
    //         `INSERT INTO mts (id_zayavka, id_status, status, dsp, size_gb, SN) VALUES (${id_zayavka}, 0, "заказ", 0, 0, '${d.mts_SN}')`
    //     )
    //         .then((id_mts) => {
    //             v_id_mts = id_mts
    //             return runSQL_p(
    //                 `INSERT INTO zayavka2mts (id_zayavka, id_status, id_mts, size_gb) VALUES (${id_zayavka}, 0, ${id_mts}, 0)`
    //             )
    //         })
    //         .then((id) => {
    //             d.id = id
    //             d.id_zayavka = id_zayavka
    //             d.id_mts = v_id_mts
    //             addTabRow(tableMTS, d, top = false)
    //             editMTS(id, "new")
    //         })
    // }
