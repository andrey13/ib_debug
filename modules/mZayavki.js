let v1 = null
let m_id_zayavka = 0
let m_id_MTS = 0
let m_id_ARM = 0
let m_id_empty_MTS = 0
let m_id_empty_ARM = 0
let m_ver_zayavki = 0
let m_id_user = 0
let m_user_it = 0
let m_user_ib = 0
let m_user = ''

// виды операций с МТС---------------------------------------------------------
let m_operTypes = []

// статусы заявок--------------------------------------------------------------
let m_statusTypes = []

// пустой компьютер -----------------------------------------------------------
const empty_ARM = {
    id: -1,
    id_mts: 0,
    id_comp: 0,
    id_zayavka: 0,
    comp_name: "",
    comp_user: "",
    comment: "",
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                            МОДУЛЬ mZayavki                                            ///
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function mZayavki() {
    m_operTypes = await getTypes("операции с МТС")
    m_statusTypes = await getTypes("статус обращения")

    const bVEW = "<button id='vewZayavki' title='Предварительный просмотр заявки' class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-eye'></i></button>"
    const bPRT = "<button id='prtZayavki' title='Сохранение в файле PDF заявки'   class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-download'></i></button>"
    const bDEL = "<button id='delZayavki' title='Удаление заявки'                 class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
    const bADD = "<button id='addZayavki' title='Создание заявки'                 class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
    const bMOD = `<button id='modZayavki' title='Изменить заявку'                 class='w3-btn w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`

    // верхнее меню с кнопками печати, просмотра, удаления, редактирования и изменения заявки
    const tTopMenu =
        '<div id="tabTopMenu" style="display: inline-block; margin: 0px; padding: 0; width: 100%;">' +
        bDEL + bMOD + bADD +
        "</div>"

    // пустой контейнер для табулятора
    const tZayavki = '<div id="tabZayavki" style="display: inline-block; padding: 0; height: 100%; width: 100%; border: 1px solid black;"></div>'

    // шаблон экрана: меню + контейнер
    id2e("appBody").innerHTML = tTopMenu + "<br>" + tZayavki

    const appHeight = appBodyHeight() - id2e("tabTopMenu").offsetHeight - 8

    tabulator_zayavki("tabZayavki", appHeight)
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                            ТАБУЛЯТОР ОБРАЩЕНИЙ                                        ///
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function tabulator_zayavki(id_div, appH) {
    const win_current = "tabZayavki" /////////////////////////////////////

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
    //         table_zayavki.replaceData()
    //     }
    // }, 2000)

    let allow = getAllows()
    let ed = allow.E == 1 ? "input" : ""
    let ed_date = allow.E == 1 ? date_Editor : ""
    //let dt_now = moment().format('YYYY-MM-DDTHH:mm')
    let dt_now = new Date(moment().format("YYYY-MM-DD"))
    dt_now = dt_now.getTime()
    // let d = {}

    const id_depart = isRole("tex") ? g_user.id_depart : 0

    table_zayavki = new Tabulator("#" + id_div, {
        ajaxURL: "myphp/get_all_zayavki.php",
        ajaxParams: { d: id_depart },
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
            { title: "id", field: "id", width: 50, headerFilter: true, print: false },
            // { title: "id_dep", field: "id_depart", width: 50, headerFilter: true, print: false },
            {
                title: "дата",
                field: "date",
                width: 80,
                headerFilter: true,
                formatter: "datetime",
                formatterParams: {
                    inputFormat: "YYYY-MM-DD",
                    outputFormat: "DD.MM.YYYY",
                },
            },
            {
                title: "состояние",
                field: "status",
                width: 100,
                headerFilter: true,
            },
            {
                title: "тема обращения",
                field: "type",
                widthGrow: 2,
                headerFilter: true,
            },
            // { title: "i_user", field: "id_user", width: 50 },
            {
                title: "заявитель",
                field: "user",
                widthGrow: 2,
                headerFilter: true,
            },
            // { title: "i_depart", field: "id_depart", width: 50 },
            {
                title: "отдел",
                field: "depart",
                widthGrow: 2,
                headerFilter: true,
            },
            // { title: "ruk", field: "id_user_ruk", width: 80 },
            // { title: "it", field: "id_user_it", width: 80 },
            // { title: "ib", field: "id_user_ib", width: 80 },
            // { title: "otd", field: "id_user_otd", width: 80 },
            // { title: "isp", field: "id_user_isp", width: 80 },
            // { title: "начальник ОИТ", field: "user_it", widthGrow: 2, headerFilter: true },
            // { title: "начальник ОИБ", field: "user_ib", widthGrow: 2, headerFilter: true },
            {
                title: "комментарий",
                field: "comment",
                widthGrow: 2,
                headerFilter: true,
            },
        ],

        rowFormatter: function (row) {
            if (row.getData().status == 'черновик') {
                row.getCell("status").getElement().style.backgroundColor = '#999999'
            }
            if (row.getData().status == 'отклонено') {
                row.getCell("status").getElement().style.backgroundColor = '#ff8888'
            }
            // if (row.getData().status == 'выполнено') {
            //     row.getCell("status").getElement().style.backgroundColor = '#88ff88'
            //     row.getCell("status").getElement().style.backgroundColor = '#ffffff'
            // }
            if (row.getData().status == 'на выполнении') {
                row.getCell("status").getElement().style.backgroundColor = '#8888ff'
            }
        },

        renderStarted: function () { },

        dataLoaded: function (data) {
            let id_zayavki = getFirstID(table_zayavki)
            m_id_zayavka = id_zayavki
            table_zayavki.selectRow(id_zayavki)
        },

        rowSelectionChanged: function (data, rows) {
            id2e("delZayavki").disabled = data.length == 0
            id2e("modZayavki").disabled = data.length != 1
        },

        rowClick: function (e, row) {
            m_id_zayavka = row.getData().id
        },

        cellDblClick: function (e, cell) {
            edit_zayavka(
                table_zayavki.getSelectedData()[0],
                (win_return = win_current)
            )
        },
    })

    id2e("delZayavki").onclick = () => {
        dialog_del_zayavka()
    }
    id2e("modZayavki").onclick = () => {
        edit_zayavka(
            table_zayavki.getSelectedData()[0],
            (win_return = win_current)
        )
    }
    id2e("addZayavki").onclick = async function () {
        create_zayavka((win_return = win_current))
    }

    id2e(id_div).style.display = "inline-block"

    //=======================================================================================
    // выбор типа обращения и вызов функции создания соответствующей заявки
    //=======================================================================================
    async function create_zayavka(win_return = null) {
        // выбор типа обращения -------------------------------------------------------------
        const selected = await selectTypes(
            (id_taxonomy = 1),
            (ok = -1),
            (title = "тема обращения"),
            (width = "50%"),
            (marginLeft = "25%"),
            (marginTop = "10%")
        )

        // вызов функции создания соответствующей заявки --------------------------------
        switch (selected.id) {
            case "1":
                create_zayavka_1(
                    (type = selected.name),
                    (id_type = "1"),
                    win_return
                )
                break
            case "2":
                create_zayavka_1(
                    (type = selected.name),
                    (id_type = "2"),
                    win_return
                )
                break
        }
    }

    //=======================================================================================
    // создание пустой заявки с последующим редактированием
    //=======================================================================================
    async function create_zayavka_1(type, id_type, win_return = null) {
        m_id_user = 0
        m_user = ''
        // начальник ОИТ ----------------------------------------------------------------
        const depart_it = await getDepart("Отдел информационных технологий")
        const user_it = await getBoss(depart_it.id)

        // начальник ОИБ ----------------------------------------------------------------
        const depart_ib = await getDepart("Отдел информационной безопасности")
        const user_ib = await getBoss(depart_ib.id)

        // данные для пустой заявки -----------------------------------------------------
        const d = {
            // поля таблицы Zayavka ---
            id: 0,
            date: moment().format("YYYY-MM-DD"),
            id_type: id_type,
            id_status: m_statusTypes[0].id,
            id_depart: 0,
            id_user_ruk: 0,
            id_user_it: user_it.id,
            id_user_ib: user_ib.id,
            id_user_otd: 0,
            id_user: 0,
            id_user_isp: 723,
            io_ruk: "0",
            io_it: "0",
            io_ib: "0",
            io_otd: "0",
            user_title: "",
            user_isp_title: "",
            status: "",
            comment: "",
            // вычисляемые поля для табулятора ---
            type: type,
            user_ruk: "Мосиенко А.В.",
            user_it: user_it.name,
            user_ib: user_ib.name,
            user_otd: '<выбрать>',
            user: '<выбрать>',
            user_isp: 'Котов Вадим Витальевич',
            depart: '',
        }

        if (isRole('tex')) {
            // начальник отдела  ------------------------------------------------------------
            const user_otd = await getBoss(g_user.id_depart)
            d.id_depart = g_user.id_depart
            d.id_user_ib = user_ib.id
            d.id_user_otd = user_otd.id
            d.id_user = g_user.id
            d.user_otd = user_otd.name
            d.user = g_user.name
            d.depart = g_user.depart
        }

        const id_zayavka = await new_zayavka(d)

        d.id = id_zayavka
        m_id_zayavka = d.id
        addTabRow(table_zayavki, d, (top = true))

        // вызов функции создания соответствующей заявки --------------------------------
        switch (id_type) {
            case "1":
                edit_zayavka_1(id_zayavka, "new", type, id_type, win_return)
                break
            case "2":
                edit_zayavka_2(id_zayavka, "new", type, id_type, win_return)
                break
        }
    }

    //=======================================================================================
    // редактирование заявки
    //=======================================================================================
    function edit_zayavka(d, win_return = null) {
        switch (d.id_type) {
            case "1":
                edit_zayavka_1(d.id, "edit", d.type, d.id_type, win_return)
                break
            case "2":
                edit_zayavka_2(d.id, "edit", d.type, d.id_type, win_return)
                break
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///                                   модальное окно редактора заявки 1                                   ///
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async function edit_zayavka_1(
        id_zayavka,
        mode,
        type = "",
        id_type,
        win_return = null
    ) {
        const win_current = "editZayavka" /////////////////////////////////////
        const allow = getAllows()
        const d = table_zayavki.getSelectedData()[0]
        console.log('d = ', d)

        m_id_zayavka = d.id

        d.user_isp = (!!!d.user_isp) ? '<выбрать>' : d.user_isp
        m_id_user = (!!!d.id_user) ? 0 : d.id_user
        m_user = (!!!d.user) ? 0 : d.user

        const id_depart_user = (await id_user_2_data(d.id_user)).id_depart
        const id_depart_user_otd = (await id_user_2_data(d.id_user_otd)).id_depart

        console.log('d.id_user = ', d.id_user)
        console.log('d.id_user_otd = ', d.id_user_otd)
        console.log('id_depart_user = ', id_depart_user)
        console.log('id_depart_user_otd = ', id_depart_user_otd)
        
        d.depart = (id_depart_user_otd != 0) ? (await id_depart_2_data(id_depart_user_otd)).name : (await id_depart_2_data(id_depart_user)).name

        // подготовка полей формы ---------------------------------------------------------
        const title_ruk = d.io_ruk == "0" ? "Руководитель" : "И.о. руководителя"

        const title_it = d.io_it == "0"
            ? "Начальнику отдела информационных технологий"
            : "И.о. начальника отдела информационных технологий"

        const title_ib = d.io_ib == "0"
            ? "Начальник отдела информационной безопасности"
            : "И.о. начальника отдела информационной безопасности"

        const title_usr =
            (await id_user_2_data(d.id_user)).title.toLowerCase() +
            " " +
            txt2dat(d.depart.toLowerCase())

        const title_otd =
            (d.io_otd == "0" ? "Начальник " : "И.о. начальника ") +
            txt2dat(d.depart.toLowerCase())

        // const depart_name_isp = await idUser2TitleDepart(d.id_user_isp)

        const title_depart_isp = await id_user_2_title_depart(d.id_user_isp)

        const appH = window.innerHeight - 600

        const status = (await id_2_data(d.id_status, 'types')).name
        const headerZayavka = `<h4>Обращение № ${d.id}: ${type} (${status})</h4>`

        const bodyZayavka = `<div id="" style="margin: 0; padding: 1%;" class="w3-container">
                            <div id="userIT" style="position: absolute; right: 0;width: 400px;">
                                <span id="title-it">${title_it}</span>
                                <br>
                                <button id="selIT" :disabled="disIt" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">${fio2dat(d.user_it)}</button>
                            </div>
                            <br>
                            <br>

                            <input :disabled="disDate" class="o3-border" type="date" id="z_date" v-model="dv.date">
                            <label for="z_date">  Дата обращения</label>
                            <br>

                            <center><h4>Прошу осуществить выдачу/возврат МТС следующим сотрудникам:</h4></center>
                            <br>

                            <div id="tabMTSmenu" style="display: inline-block; margin: 0px; padding: 0px; width: 100%;">
                                <button id='delMTS' :disabled="disDel" class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal'>удалить</i></button>
                                <button id='addMTS' :disabled="disAdd" class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal'>добавить</i></button>
                                <button id='modMTS' :disabled="disMod" class='w3-btn w3-padding-small w3-white o3-border w3-hover-teal'>изменить</i></button>
                            </div>

                            <div id="tabMTS" style="display: inline-block; margin: 0; padding: 0; height: 100%; width: 100%; border: 1px solid black; background: white"></div>

                            <label for="z_comm">Комментарии</label><br>
                            <textarea id="z_comm" :disabled="disComm" rows="3" style="width:100%" class="o3-border" v-model="dv.comment"></textarea>                            
                            <br>

                            <span id="title-otd">${title_otd}:</span>
                            <br> 
                            <button id="selOtd" :disabled="disOtd" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">{{dv.user_otd}}</button>
                            <br>

                            Заявитель:  <span id="title-usr">${title_usr}</span>
                            <br>
                            <button id="selAuthor" :disabled="disAut" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">{{dv.user}}</button>
                            <br>

                            Исполнитель: <span id="title-isp">${title_depart_isp}</span>
                            <br>
                            <button id="selIsp" :disabled="disIsp" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal disabled">{{dv.user_isp}}</button>
                            <br>
                            
                            <button id="b_ENTER"  :disabled="disEnter"  v-show="shEnter"  class="w3-btn w3-padding-small o3-border w3-hover-teal">сохранить</button>
                            <button id="b_CANCEL" :disabled="disCancel" v-show="shCancel" class="w3-btn w3-padding-small o3-border w3-hover-red">отменить</button>                            
                            <button id="b_PRINT1" :disabled="disPrint1" v-show="shPrint1" class="w3-btn w3-padding-small o3-border w3-hover-teal">печать служебной записки</button>
                            <button id="b_START"  :disabled="disStart"  v-show="shStart"  class="w3-btn w3-padding-small o3-border w3-hover-teal">отправить на выполнение</button>
                            <button id="b_STOP"   :disabled="disStop"   v-show="shStop"   class="w3-btn w3-padding-small o3-border w3-hover-red">снять с выполнения</button>
                            <button id="b_ACCEPT" :disabled="disAccept" v-show="shAccept" class="w3-btn w3-padding-small o3-border w3-hover-teal">закрыть заявку</button>
                            <button id="b_REJECT" :disabled="disReject" v-show="shReject" class="w3-btn w3-padding-small o3-border w3-hover-red">отклонить заявку</button>

                            </div>`

        footZayavka = ``

        const esc_zayavka = mode == 'new'
            ? () => { 
                remove_selected_zayavka() 
                vapp.unmount()
            }
            : () => { 
                vapp.unmount() 
            }

        newModalWindow(win_current, headerZayavka, bodyZayavka, footZayavka,
            (width = "98%"),
            (marginLeft = "1%"),
            (marginTop = "1%"),
            win_return,
            esc_zayavka
        )

        // ViewModel ------------------------------------------------------------------------
        const vapp = Vue.createApp({
            data() {
                return {
                    dv: d,
                    su: isRole('su'),
                    mo: isRole('mo'),
                    tex: isRole('tex'),
                    is: d.id_status,
                }
            },
            computed: {
                disAdd()    { return !(this.su || this.mo || this.is == 31) },
                disDel()    { return !(this.su || this.mo || this.is == 31) },
                disMod()    { return !(this.su || this.mo || this.is == 31 || (this.mo && this.is == 32)) },
                disIt()     { return !(this.su || this.mo || this.is == 31) },
                disOtd()    { return !(this.su || this.mo || this.is == 31) },
                disAut()    { return !(this.su || this.mo || this.is == 31) },
                disIsp()    { return !(this.su || this.mo || this.is == 32 || (this.mo && this.is == 32)) },
                disDate()   { return !(this.su || this.mo || this.is == 31) },
                disComm()   { return !(this.su || this.mo || this.is == 31 || (this.mo && this.is == 32)) },
                disEnter()  { return !(this.su || this.mo || this.is == 31) },
                disCancel() { return !(this.su || this.mo || this.is == 31) },
                disStart()  { return !(this.su || this.mo || this.is == 31) },
                disStop()   { return !(this.su || this.mo || this.is == 32) },
                disPrint1() { return !(this.su || this.mo || false) },
                disAccept() { return !(this.su || this.mo || this.is == 32) },
                disReject() { return !(this.su || this.mo || this.is == 32) },
                shEnter()   { return   this.su || this.mo || true},
                shCancel()  { return   this.su || this.mo || true},
                shStart()   { return   this.su || this.mo || this.tex || this.mo},
                shStop()    { return   this.su || this.mo || this.tex || this.mo},
                shPrint1()  { return   this.su || this.mo || this.tex || this.mo},
                shAccept()  { return   this.su || this.mo || this.mo },
                shReject()  { return   this.su || this.mo || this.mo },
            },
        })
        
        const vm = vapp.use(naive).mount('#' + win_current)
        // ViewModel ------------------------------------------------------------------------

        tabulator_oper(status, 'tabMTS', appH,
            (id_zayavka = d.id),
            (win_return = win_current),
        )

        id_2_set_focus(win_current)

        // кнопка выбора начальника ОИТ -------------------------------------------------------
        id2e("selIT").onclick = async function () {
            const depart_it = await getDepart("Отдел информационных технологий")
            const id_depart_it = depart_it.id
            const id_boss = (await getBoss(id_depart_it)).id

            const selectedUsers = await selectUser(
                "6100",
                "",
                id_depart_it,
                1,
                (header = "Выбор начальника (и.о. начальника) ОИТ"),
                (width = "40%"),
                (marginLeft = "40%"),
                (marginTop = "5%"),
                (win_return = win_current),
                id_boss
            )
            selectedUsers.forEach((u) => {
                d.id_user_it = u.id
                d.user_it = u.name
                id2e("selIT").innerHTML = fio2dat(d.user_it)
                id2e("title-it").innerHTML =
                    id_boss != u.id
                        ? "И.о. начальника отдела информационных технологий"
                        : "Начальнику отдела информационных технологий"
                d.io_it = id_boss != u.id ? "1" : "0"
            })
        }

        // кнопка выбора начальника отдела -------------------------------------------------------
        id2e("selOtd").onclick = async function () {
            const depart_name = (await id_depart_2_data(d.id_depart)).name
            const depart_name_dat = txt2dat(depart_name)
            const header_otd = "Выбор начальника (и.о. начальника) " + txt2dat(depart_name)   
            const id_boss = (await getBoss(d.id_depart)).id         

            const selectedUsers = await selectUser(
                "6100",
                "",
                isRole('su') ? 0 : d.id_depart,
                1,
                (header = header_otd),
                (width = "40%"),
                (marginLeft = "20%"),
                (marginTop = "5%"),
                (win_return = win_current),
                id_boss
            )

            selectedUsers.forEach(async (u) => {
                d.id_user_otd = u.id
                d.user_otd = u.name
                if (d.id_depart == '0') d.id_depart = u.id_depart
                const id_boss = (await getBoss(u.id_depart)).id

                id2e("selOtd").innerHTML = d.user_otd
                id2e("title-otd").innerHTML =
                    (id_boss != u.id ? "И.о. начальника " : "Начальник ") +
                    depart_name_dat
                d.io_otd = id_boss != u.id ? "1" : "0"
            })
        }

        // кнопка выбора автора обращения (заявителя) -----------------------------------
        id2e("selAuthor").onclick = async function () {
            const depart_name = (await id_depart_2_data(d.id_depart)).name
            const depart_name_dat = txt2dat(depart_name)

            const selectedUsers = await selectUser(
                (sono = "6100"),
                (esk = ""),
                "0", // id_depart
                (selectable = 1),
                (header = "Выбор заявителя (автора обращения)"),
                (width = "40%"),
                (marginLeft = "20%"),
                (marginTop = "5%"),
                (win_return = win_current),
                d.id_user
            )

            selectedUsers.forEach((u) => {
                m_id_user = u.id
                d.id_user = u.id
                d.user = u.name
                m_user = u.name
                d.id_depart = u.id_depart
                id2e("selAuthor").innerHTML = u.name
                id2e("title-usr").innerHTML = u.title + " " + depart_name_dat
            })
        }

        // кнопка выбора исполнителя обращения (м/о лицо ОИТ) ---------------------------
        id2e("selIsp").onclick = async function () {
            const selectedUsers = await selectUser(
                (sono = "6100"),
                (esk = ""),
                "0", // id_depart
                (selectable = 1),
                (header = "Выбор исполнителя обращения (м/о лицо ОИТ)"),
                (width = "40%"),
                (marginLeft = "20%"),
                (marginTop = "5%"),
                (win_return = win_current),
                d.id_user_isp
            )

            selectedUsers.forEach(async (u) => {
                d.id_user_isp = u.id
                d.user_isp = u.name

                const depart_name = (await id_depart_2_data(u.id_depart)).name
                // const depart_name_dat = txt2dat(depart_name)
                const title_depart_isp = await id_user_2_title_depart(
                    d.id_user_isp
                )

                id2e("selIsp").innerHTML = u.name
                id2e("title-isp").innerHTML = title_depart_isp
            })
        }

        // кнопка ENTER (сохранение изменений)-------------------------------------------
        id2e("b_ENTER").onclick = () => {
            const d = vm.$data.dv
            d.status = id_status_2_name(d.id_status)
            vapp.unmount()
            save_zayavka(d)
            verInc("zayavki", g_user.id_depart, "id_depart")
            removeModalWindow(win_current, win_return)
            table_zayavki.updateRow(d.id, d)
        }

        // кнопка CANCEL (отмена изменений) ---------------------------------------------
        id2e("b_CANCEL").onclick = () => {
            if (mode == "new") remove_selected_zayavka()
            vapp.unmount()
            removeModalWindow(win_current, win_return)
        }

        // кнопка START (отправить на выполнение) ---------------------------------------
        id2e("b_START").onclick = () => {
            const d = vm.$data.dv
            d.id_status = 32 // на выполнении
            d.status = id_status_2_name(d.id_status)
            vapp.unmount()
            save_zayavka(d)
            verInc("zayavki", g_user.id_depart, "id_depart")
            removeModalWindow(win_current, win_return)
            table_zayavki.updateRow(d.id, d)
        }

        // кнопка STOP (снять с выполнения) ---------------------------------------------
        id2e("b_STOP").onclick = () => {
            const d = vm.$data.dv
            d.id_status = 31 // черновик
            d.status = id_status_2_name(d.id_status)
            vapp.unmount()
            save_zayavka(d)
            verInc("zayavki", g_user.id_depart, "id_depart")
            removeModalWindow(win_current, win_return)
            table_zayavki.updateRow(d.id, d)
        }

        // кнопка PRINT1 (печать служебной записки) -------------------------------------
        id2e("b_PRINT1").onclick = () => {
            const id_zayavka = table_zayavki.getSelectedData()[0].id
            // const zay_data = table_zayavki.getSelectedData()[0]
            // const mts_data = table_oper.getData()
            print_zayavka(id_zayavka, "view")
        }

        // кнопка b_ACCEPT (закрытие заявки) --------------------------------------------
        id2e("b_ACCEPT").onclick = () => {
            const d = vm.$data.dv
            d.id_status = 33 // выполнено
            d.status = id_status_2_name(d.id_status)
            vapp.unmount()
            save_zayavka(d)
            verInc("zayavki", g_user.id_depart, "id_depart")
            removeModalWindow(win_current, win_return)
            table_zayavki.updateRow(d.id, d)
        }
        
        // кнопка b_REJECT (отклонение заявки) ------------------------------------------
        id2e("b_REJECT").onclick = () => {
            const d = vm.$data.dv
            d.id_status = 34 // отклонено
            d.status = id_status_2_name(d.id_status)
            vapp.unmount()
            save_zayavka(d)
            verInc("zayavki", g_user.id_depart, "id_depart")
            removeModalWindow(win_current, win_return)
            table_zayavki.updateRow(d.id, d)
        }
        
    } // edit_zayavka_1

    //=======================================================================================
    function remove_selected_zayavka() {
        let id_zayavka = table_zayavki.getSelectedData()[0].id
        del_zayavka(id_zayavka)
        table_zayavki.deleteRow(id_zayavka)
        id_zayavka = getFirstID(table_zayavki)
        table_zayavki.selectRow(id_zayavka)
    }

    //=======================================================================================
    // печать заявки
    //=======================================================================================
    function print_zayavka(id_zayavka, mode) {
        const pdf_file_name = "Служебная записка МТС.pdf"
        const zay_data = table_zayavki.getSelectedData()[0]
        const mts_data = table_oper.getData()
        const table_content = []

        const title_it =
            (zay_data.io_it == "0" ? "Начальнику\n" : "И.о. начальника\n") +
            "отдела информационных технологий\n" +
            "УФНС России по Ростовской области\n"

        const title_otd =
            (zay_data.io_otd == "0" ? "Начальник\n" : "И.о. начальник\n") +
            txt2dat(zay_data.depart.toLowerCase())

        
        let i = 0

        // предварительная подготовка страницы ------------------------------------------
        pdfMake.fonts = {
            times: {
                normal: "times.ttf",
                bold: "timesbd.ttf",
                italics: "timesi.ttf",
                bolditalics: "timesbi.ttf",
            },
        }

        const doc_head = {
            pageSize: "A4",
            pageOrientation: "landscape",
            pageMargins: [30, 30, 30, 30],
            defaultStyle: { font: "times", fontSize: 9 },
            styles: {
                header1: { font: "times", fontSize: 12, alignment: "right" },
                header2: { font: "times", fontSize: 12, alignment: "center", bold: true, },
                header3: { font: "times", fontSize: 12, alignment: "justify", margin: [20, 0, 0, 0], },
                header4: { font: "times", fontSize: 12, alignment: "justify", margin: [0, 0, 0, 0], },
                header5: { font: "times", fontSize: 12, alignment: "center", margin: [10, 0, 10, 0], },
                header6: { font: "times", fontSize: 12, alignment: "left" },
                header7: { font: "times", fontSize: 12, alignment: "left", margin: [300, 0, 10, 0], },
                footer6: { font: "times", fontSize: 8, alignment: "left", italics: true, margin: [20, 0, 0, 0], },
                table: { margin: [0, 0, 0, 0] },
                tableHeader: { bold: true, fontSize: 8, alignment: "center" },
            },
            footer: {
                columns: [
                    {
                        text: zay_data.user + "\n" + g_user.tel,
                        style: ["footer6"],
                    },
                ],
            },
        }

        // шапка и заголовок СЗ ---------------------------------------------------------
        const content0 = [
            {
                text: title_it + fio2dat(zay_data.user_it) + "\n\n\n",
                style: ["header1"],
            },
            { text: "СЛУЖЕБНАЯ ЗАПИСКА\n\n", style: ["header2"] },
        ]

        // ФИО и подпись начальника отдела  ---------------------------------------------
        const content1 = [
            {
                text: "\n\n\n" + title_otd,
                style: ["header6"],
            },
            {
                text: fio2fio2(zay_data.user_otd),
                style: ["header1"],
            },
        ]

        

        content0.push({
            text: "Прошу осуществить выдачу/возврат МТС следующим сотрудникам:\n\n",
            style: ["header5"],
        })

        const table = [
            {
                style: "table",
                table: {
                    widths: [100, 35, 14, 14, 100, 100, 100, 160, 80],
                    headerRows: 1,
                    body: [
                        [
                            { text: "ответственный", style: "tableHeader" },
                            { text: "операция", style: "tableHeader" },
                            { text: "дсп", style: "tableHeader" },
                            { text: "Гб", style: "tableHeader" },
                            { text: "обоснование", style: "tableHeader" },
                            { text: "заводской номер", style: "tableHeader" },
                            { text: "комментарий", style: "tableHeader" },
                            { text: "отметка о выполнении", style: "tableHeader" },
                            { text: "подпись исполнителя", style: "tableHeader" },
                        ],
                    ],
                },
            },
        ]

        mts_data.forEach((d) => {
            const dsp = d.dsp == "1" ? "дсп" : ""
            table_content[i] = [
                d.user,
                d.oper,
                dsp,
                d.size_gb,
                d.reson,
                d.mts_SN1,
                d.comment,
                "\n\n\n",
                " "
            ]
            i += 1
        })

        table[0].table.body = table[0].table.body.concat(table_content)

        const content = content0.concat(table).concat(content1)

        const doc = Object.assign(doc_head, { content: content })

        if (mode == "view") {
            pdfMake.createPdf(doc).open()
        } else {
            pdfMake.createPdf(doc).download(pdf_file_name)
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///                                   модальное окно редактора заявки 2                                   ///
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function edit_zayavka_2(id_zayavka, mode, type = "", id_type) {
        let allow = getAllows()
        let d = table_zayavki.getSelectedData()[0]

        m_id_zayavka = d.id

        const appH = window.innerHeight - 420
        const headerZayavka = `<h4>Обращение № ${d.id} (${type})</h4>`

        const bDELMTS =
            "<button id='delMTS' title='Удаление устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
        const bADDMTS =
            "<button id='addMTS' title='Создание устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
        const bMODMTS = `<button id='modMTS' title='Изменить устройства' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`
        const menuMTS = `<div id="tabMTSmenu" style="display: inline-block; margin: 0px; padding: 0; width: 50%;">${bDELMTS + bMODMTS + bADDMTS
            } Список МТС</div>`

        const bDELARM =
            "<button id='delARM' title='Удаление компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-minus'></i></button>"
        const bADDARM =
            "<button id='addARM' title='Создание компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-plus'></i></button>"
        const bMODARM = `<button id='modARM' title='Изменить компьютера' class='w3-button w3-tiny w3-padding-small w3-white o3-border w3-hover-teal'><i class='fa fa-pencil fa-fw'></i></button>`
        const menuARM = `<div id="tabARMmenu" style="display: inline-block; margin: 0px; padding: 0; width: 50%;">${bDELARM + bADDARM
            } Список рабочих станций</div>`

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
                            <button id="b_ENTER"  class="w3-btn o3-border w3-hover-teal" tabindex="6">сохранить</button>
                            <button id="b_CANCEL" class="w3-btn o3-border w3-hover-red"  tabindex="7">отменить</button>                            
                            <button id="b_PRINT1" class="w3-btn o3-border w3-hover-teal" tabindex="8">печать СЗ на получение</button>
                            <button id="b_PRINT2" class="w3-btn o3-border w3-hover-teal" tabindex="9">печать заявки на подключение</button>
                            <button id="b_ACCEPT" class="w3-btn o3-border w3-hover-teal" tabindex="10">закрыть заявку</button>
                            <button id="b_REJECT" class="w3-btn o3-border w3-hover-teal" tabindex="11">отклонить заявку</button>
                            </div>`

        footZayavka = ``

        newModalWindow(
            "editZayavka",
            headerZayavka,
            bodyZayavka,
            footZayavka,
            (width = "98%"),
            (marginLeft = "1%"),
            (marginTop = "1%"),
            (win_return = win_current)
        )

        tabulator_oper("tabMTS", appH, (id_zayavka = d.id))
        tabulator_mts_arm("tabARM", appH, (id_zayavka = d.id))

        // id2e("z_date").focus()
        // id2e("z_date").select()
        id_2_set_focus(win_current)

        // кнопка ENTER ---------------------------------------------------------------------
        id2e("b_ENTER").onclick = () => {
            d.date = id2e("z_date").value
            d.comment = id2e("z_comm").value
            save_zayavka(d)
            verInc("zayavki", g_user.id_depart, "id_depart")
            removeModalWindow("editZayavka")
            table_zayavki.updateRow(d.id, d)
        }

        // кнопка CANCEL --------------------------------------------------------------------
        id2e("b_CANCEL").onclick = () => {
            if (mode == "new") {
                let id_zayavka = table_zayavki.getSelectedData()[0].id
                del_zayavka(id_zayavka)
                table_zayavki.deleteRow(id_zayavka)
                id_zayavka = getFirstID(table_zayavki)
                table_zayavki.selectRow(id_zayavka)
            }
            removeModalWindow("editZayavka")
        }
    } // edit_Zayavka_MTS2

    //=======================================================================================
    // модальное окно удаления заявки
    //=======================================================================================
    async function dialog_del_zayavka() {
        const data = table_zayavki.getSelectedData()

        const ans = await dialogYESNO(
            (text =
                "Выбранные обращения<br><br>будут удалены, вы уверены?<br>"),
            (win_return = null)
        )

        if (ans == "YES") {
            data.forEach((d) => {
                del_zayavka(d.id)
                table_zayavki.deleteRow(d.id)
            })
            const id_zayavka = getFirstID(table_zayavki)
            table_zayavki.selectRow(id_zayavka)
            const d = table_zayavki.getSelectedData()
            id2e("delZayavki").disabled = d.length == 0
            id2e("modZayavki").disabled = d.length == 0
        }
    }

    //=======================================================================================
    // удаления заявки
    //=======================================================================================
    function del_zayavka(id_zayavka) {
        runSQL_p(`DELETE FROM zayavka WHERE id=${id_zayavka}`)
        runSQL_p(`DELETE FROM zayavka2mts WHERE id_zayavka=${id_zayavka}`)
        runSQL_p(`DELETE FROM mts2comp WHERE id_zayavka=${id_zayavka}`)
        // runSQL_p(
        //     `DELETE FROM mts WHERE id_zayavka=${id_zayavka} AND status="заказ"`
        // )
    }
} ///////// tabulator_zayavki

/////////////////////////////////////////////////////////////////////////////////////////
//                           ТАБУЛЯТОР ОПЕРАЦИЙ С МТС                                  //
/////////////////////////////////////////////////////////////////////////////////////////

function tabulator_oper(
    status,
    id_div,
    appH,
    id_zayavka = 0,
    win_current = null,
    syncWithARM = false    
) {
    let allow = getAllows()
    let ed = allow.E == 1 ? "input" : ""
    let ed_date = allow.E == 1 ? date_Editor : ""
    //let dt_now = moment().format('YYYY-MM-DDTHH:mm')
    let dt_now = new Date(moment().format("YYYY-MM-DD"))
    dt_now = dt_now.getTime()

    table_oper = new Tabulator("#" + id_div, {
        ajaxURL: "myphp/get_all_zay2mts.php",
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
            {
                title: "дсп",
                field: "dsp",
                formatter: "lookup",
                formatterParams: { 0: "   ", 1: "дсп" },
                width: 30,
            },
            {
                title: "ответственный",
                field: "user",
                widthGrow: 2,
                formatter: "textarea",
            },
            { title: "операция", field: "oper", width: 90 },
            {
                //create column group
                title: "Запрошено",
                columns: [
                    { title: "Гб", field: "size_gb", width: 30 },
                    {
                        title: "обоснование",
                        field: "reson",
                        widthGrow: 2,
                        formatter: "textarea",
                    },
                ],
            },
            {
                //create column group
                title: "Фактически выдано",
                columns: [
                    { title: "Гб", field: "mts_size1", width: 30 },
                    { title: "SN", field: "mts_SN1", widthGrow: 2 },
                ],
            },
            { title: "выполнено", field: "date_vidano", width: 100 },
            { title: "подключено", field: "date_podkl", width: 100 },
            {
                title: "комментарии",
                field: "comment",
                widthGrow: 2,
                formatter: "textarea",
            },
        ],

        renderStarted: function () { },

        dataLoaded: function (data) {
            const id = getFirstID(table_oper)
            table_oper.selectRow(id)
            m_id_MTS = table_oper.getRow(id).getData().id_mts
            if (syncWithARM) table_arm.setFilter("id_mts", "=", m_id_MTS)
        },

        rowSelectionChanged: function (data, rows) {
            if (status == 'на выполнении') return
            if (status == 'выполнено') return
            if (status == 'отклонено') return
            id2e("delMTS").disabled = data.length == 0
            id2e("modMTS").disabled = data.length != 1
            // if (syncWithARM) id2e("addARM").disabled = data.length != 1
        },

        rowClick: function (e, row) {
            m_id_MTS = row.getData().id_mts
            // if (syncWithARM) table_arm.setFilter("id_mts", "=", m_id_MTS)
        },

        cellDblClick: function (e, cell) {
            edit_oper(
                table_oper.getSelectedData()[0].id,
                (mode = "edit"),
                (win_return = win_current)
            )
        },
    })

    id2e("delMTS").onclick = () => {
        dialog_del_mts((win_return = win_current))
    }
    id2e("modMTS").onclick = () => {
        edit_oper(
            table_oper.getSelectedData()[0].id,
            (mode = "edit"),
            (win_return = win_current),
            syncWithARM
        )
    }
    id2e("addMTS").onclick = () => {
        // create_oper(id_zayavka)
        create_oper(
            id_zayavka, 
            m_id_user,
            (win_return = win_current)
        )
    }

    id2e(id_div).style.display = "inline-block"

    //=======================================================================================
    // создание пустой операции
    //=======================================================================================
    async function create_oper(
        id_zayavka, 
        id_user = 0,
        win_return = null
    ) {
        console.log('m_id_user = ', m_id_user)
        console.log('id_user = ', id_user)
        const d = {
            // поля таблицы Zayavka2mts------------------
            id: "0",
            id_zayavka: id_zayavka,
            id_status: "0",
            id_user: id_user,
            id_mts: "0",
            id_mts2: "0",
            id_oper: m_operTypes[0].id,
            size_gb: 0,
            dsp: "0",
            reson: "",
            comment: "",
            date_zakaz: "",
            date_vdano: "",
            date_podkl: "",
            user: m_user,

            // поля SN и size_gb из таблицы mts ----------------------
            mts_SN1: "",
            mts_SN2: "",
            mts_size1: "0",
            mts_size2: "0",

            // поле name из таблицы user (расшифровка id_user)---
            // user: "<выбрать>",

            // поле name из таблицы types (расшифровка id_oper) -
            oper: "",

            // ???????????????
            // mts_SN: '',
        }

        const id = await runSQL_p(
            `INSERT INTO zayavka2mts (
                id_zayavka, 
                id_status,
                id_oper,                
                size_gb,
                reson,
                comment,
                id_user
            ) VALUES (
                ${d.id_zayavka}, 
                0,
                ${d.id_oper}, 
                ${d.size_gb},
               "${d.reson}",
               "${d.comment}",
                ${d.id_user}
            )`
        )

        d.id = id
        d.id_zayavka = id_zayavka
        addTabRow(table_oper, d, false)
        edit_oper(id, "new", win_return)
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///                                   модальное окно редактора операции с МТС                             ///
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    async function edit_oper(
        id_mts,
        mode,
        win_return = null,
        syncWithARM = false
    ) {
        const win_current = "editMTS" /////////////////////////////////////

        const allow = getAllows()
        const d = table_oper.getSelectedData()[0]

        d.mts_size1 = !!!d.mts_size1 ? "" : d.mts_size1
        d.mts_size2 = !!!d.mts_size2 ? "" : d.mts_size2
        d.mts_SN1 = !!!d.mts_SN1 ? "" : d.mts_SN1
        d.mts_SN2 = !!!d.mts_SN2 ? "" : d.mts_SN2

        if (d.user === null) d.user = "<выбрать>"
        if (d.user1 === null) d.user1 = "<выбрать>"

        const headerZayavkaMTS = `<h4>операция с МТС</h4>`

        const bodyZayavkaMTS = `<div id="vEditMTS" style="margin: 0; padding: 1%;" class="w3-container">
                <center>Ответственное лицо:<button id="selectUser" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal" :disabled="disUser">{{ dv.user }}</button></center>
                <br>                                    

                <span style="display: flex; align-items: center;" v-for="o in operTypes">
                    <input type="radio" :id="'oper'+o.id" name="operTypes" v-bind:value="o.id" v-model="dv.id_oper" :disabled="disOper">
                    <label v-bind:for="'oper'+o.id">&nbsp;{{ o.name }}</label>
                </span>                
                
                <br>
                
                <span>
                ДСП
                <n-switch  :rail-style="style_dsp"
                    size="small"
                    checked-value="1"
                    unchecked-value="0"
                    v-model:value="dv.dsp"
                />  
                </span>
                <br>
                <br>                   

                <!--
                <input type="checkbox" id="MTS_dsp" :disabled="disDsp"> ДСП&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                -->

                <input v-show="showSize" class="o3-border" type="number" id="MTS_size" v-model="dv.size_gb" :disabled="disSize">
                <label v-show="showSize" for="MTS_size"> Гб запрошено</label>
                <br>

                <label for="MTS_reson"><b>Обоснование:</b></label><br>
                <textarea id="MTS_reson" rows="3" style="width:100%" :disabled="disReson" v-model="dv.reson"></textarea>
                <br>
                <br>

                <button id="selectMTS1" class="w3-btn w3-padding-small o3-border w3-hover-teal" style="text-align: left;" :disabled="disMTS1">{{ txtBtnMTS1 }}</button>
                <span v-show="showUser1">&nbsp;&nbsp;&nbsp;Кому передается МТС:<button id="selectUser1" class="w3-btn w3-padding-small o3-button-0 w3-hover-teal" v-show="showUser1">${d.user1}</button></span><br>
                id: {{ dv.id_mts }}<br>
                <input class="o3-border" type="text" id="MTS_size1" v-model="dv.mts_size1" style="width: 100px;" disabled>
                <label for="MTS_size1">  Объем (Гб)</label>
                <br>
                
                <input class="o3-border" type="text" id="MTS_SN1" v-model="dv.mts_SN1" style="width: 400px;" disabled>
                <label for="MTS_SN1">  Серийный номер</label>
                <br><br>
                
                <label for="MTS_comm"><b>Комментарии:</b></label><br>
                <textarea id="MTS_comm"  rows="3" style="width:100%" :disabled="disComm"  v-model="dv.comment"></textarea>
                <br><br>
                <button id="enterMTS" class="w3-btn w3-padding-small o3-border w3-hover-teal"  >сохранить</button>
                <button id="cancelMTS" class="w3-btn w3-padding-small o3-border w3-hover-red" >отменить</button>                            
            </div>`

        footZayavkaMTS = ``

        const esc_zay2mts = mode == "new"
            ? () => { 
                remove_selected_mts() 
                vapp.unmount()
            }
            : () => { 
                console.log("esc_fun") 
                vapp.unmount()
            }

        newModalWindow(
            win_current,
            headerZayavkaMTS,
            bodyZayavkaMTS,
            footZayavkaMTS,
            (width = "60%"),
            (marginLeft = "5%"),
            (marginTop = "10%"),
            win_return,
            esc_zay2mts
        )

        // ViewModel ------------------------------------------------------------------------
        const vapp = Vue.createApp({
            data() {
                return {
                    dv: d,
                    operTypes: m_operTypes,
                    tex: isRole("tex"),
                    su: isRole("su"),
                    mo: isRole("mo"),

                    style_dsp: ({ focused, checked }) => {
                        const style = {}
                        style.background = (checked) ? "#8888ff" : "grey"
                        style.boxShadow = (focused) ? "0 0 0 0px #d0305040" : "0 0 0 0px #2080f040"
                        return style
                    },
                }
            },
            computed: {
                oper() {
                    return id_oper_2_name(this.dv.id_oper)
                },
                txtBtnMTS1() {
                    let text = ''
                    // console.log('this.oper = ', this.oper)
                    switch (this.dv.id_oper) {
                        case '28':
                            text = 'Взять со склада'
                            break
                        case '29':
                            text = 'Выбрать из выданных'
                            break
                        case '35':
                            text = 'Зарегистрировать'
                            break
                        case '36':
                            text = 'Выбрать из выданных'
                            break
                        default:
                            text = '???'
                    }
                    return text
                },
                txtBtnMTS2() { return "Взять со склада" },
                
                showSize() { return this.dv.id_oper == '28' }, // выдача
                showUser1() { return this.dv.id_oper == '36'}, // передача другму лицу

                disUser()  { return false && this.mo },
                disOper()  { return false && this.mo },
                disDsp()   { return false && this.mo },
                disReson() { return false && this.mo },
                disSize()  { return false && this.mo },
                disMTS1()  { return false && ['28', '35'].includes(this.dv.id_oper) && this.tex }, // выдача
                disComm()  { return false && this.tex },
            },
        })

        const vm = vapp.use(naive).mount("#vEditMTS")

        const e_selectUser = id2e("selectUser")
        const e_selectUser1 = id2e("selectUser1")
        const e_selectMTS1 = id2e("selectMTS1")

        id_2_set_focus(win_current)

        // кнопка selectUser ---------------------------------------------------------------------
        e_selectUser.onclick = async () => {
            // if (d.oper == 'возврат') return
            const id_depart = isRole('tex') ? g_user.id_depart : 0

            const selectedUsers = await selectUser(
                "6100",
                "",
                id_depart,
                1,
                (header = "Выбор ответственного лица"),
                (width = "40%"),
                (marginLeft = "30%"),
                (marginTop = "5%"),
                (win_return = win_current),
                d.id_user
            )

            selectedUsers.forEach((u) => {
                vm.$data.dv.id_user = u.id
                vm.$data.dv.user = u.name
            })
        }

        // кнопка selectUser1 ---------------------------------------------------------------------
        e_selectUser1.onclick = async () => {            
            if (d.oper == 'возврат') return
            const id_depart = isRole('su') ? 0 : g_user.id_depart

            const selectedUsers = await selectUser(
                "6100",
                "",
                id_depart,
                1,
                (header = "Кому передается МТС"),
                (width = "40%"),
                (marginLeft = "30%"),
                (marginTop = "5%"),
                (win_return = win_current),
                d.id_user1
            )

            selectedUsers.forEach((u) => {
                vm.$data.dv.id_user = u.id
                vm.$data.dv.user = u.name
            })
        }

        // кнопка выбора  МТС ---------------------------------------------------------------------
        e_selectMTS1.onclick = async () => {
            let id_otdel = 0
            let sklad = 0
            let id_oper = 0 // последняя операция МТС

            switch(d.id_oper) {
                case '28': // выдача
                    sklad = 1
                    id_oper = 29 // выдать из возвращенных
                    break
                case '29': // возврат
                    sklad = 2
                    id_oper = 28 // вернуть из выданных
                    break
            }



            // для технолога показывать выданные отделу (id_otdel) МТС (sklad=2)
            // if (isRole("tex")) {
            //     id_otdel = g_user.id_otdel
            //     sklad = 2
            // }

            // для м/о показывать МТС на складе (sklad=1)
            // if (isRole("mo")) {
            //     sklad = 1
            // }

            d.id_mts_old = d.id_mts

            // выбор МТС ------------------------------
            const mts_selected = await select_mts(
                "6100",
                id_otdel,
                sklad,
                id_oper,
                (selectable = 1),
                (mode = "select"),
                (win_return = win_current)
                // d.id_mts
            )

            switch(d.id_oper) {
                case '28': // выдача
                    vm.$data.dv.id_mts = mts_selected.id
                    vm.$data.dv.mts_size1 = mts_selected.size_gb
                    vm.$data.dv.mts_SN1 = mts_selected.SN
                    break
                case '29': // возврат
                    vm.$data.dv.id_user = mts_selected.id_user
                    vm.$data.dv.user = (await id_user_2_data(mts_selected.id_user)).name
                    vm.$data.dv.id_mts = mts_selected.id
                    vm.$data.dv.mts_size1 = mts_selected.size_gb
                    vm.$data.dv.mts_SN1 = mts_selected.SN
                    vm.$data.dv.size_gb = mts_selected.size_gb
                    break
                case '35': // регистрация
                    vm.$data.dv.id_mts = mts_selected.id
                    vm.$data.dv.mts_size1 = mts_selected.size_gb
                    vm.$data.dv.mts_SN1 = mts_selected.SN
                    break
                case '36': // передача
                    break
            }
        }

        // кнопка ENTER -----------------------------------------------------------------
        id2e("enterMTS").onclick = () => {
            const d = vm.$data.dv
            d.oper = id_oper_2_name(vm.$data.dv.id_oper)

            // если выдача или регистрация, привязать MTS к пользователю ----------------
            if (d.oper != 'возврат' && d.id_mts_old != d.id_mts) {
                console.log('привязка МТС: ', d.id_mts, ' ', d.id_user)
                // mts_4_user(d.id_mts_old, d.id_user, false)
                // mts_4_user(d.id_mts, d.id_user, true)
                // mts_2_sklad(d.id_mts_old, true)
                mts_2_sklad(d.id_mts, false)
            }

            save_zay2mts(d)
            vapp.unmount()
            removeModalWindow(win_current, win_return)
            table_oper.updateRow(d.id, d)
        }

        // кнопка CANCEL ----------------------------------------------------------------
        id2e("cancelMTS").onclick = () => {
            if (mode == "new") {
                remove_selected_mts()
            }
            vapp.unmount()
            removeModalWindow(win_current, win_return)
        }
    } /// edit_mts

    function remove_selected_mts() {
        let id = table_oper.getSelectedData()[0].id
        del_zay2mts(d)
        table_oper.deleteRow(id)
        id = getFirstID(table_oper)
        table_oper.selectRow(id)
        m_id_MTS = table_oper.getSelectedData().id_mts
        if (syncWithARM) table_arm.setFilter("id_mts", "=", m_id_MTS)
    }

    //=======================================================================================
    // модальное окно удаления MTS
    //=======================================================================================
    async function dialog_del_mts(win_return = null, syncWithARM = false) {
        const data = table_oper.getSelectedData()

        const ans = await dialogYESNO(
            (text = "Устройства: <br><br>будут удалены, вы уверены?<br>"),
            win_return
        )
        if (ans == "YES") {
            data.forEach((d) => {
                del_zay2mts(d)
                table_oper.deleteRow(d.id)
            })
            let id_mts = getFirstID(table_oper)
            table_oper.selectRow(id_mts)
            m_id_MTS = table_oper.getSelectedData().id_mts
            // table_arm.setFilter("id_mts", "=", m_id_MTS)
            const d = table_oper.getSelectedData()
            if (syncWithARM) id2e("addARM").disabled = d.length == 0
            if (status == 'на выполнении') return
            if (status == 'выполнено') return
            if (status == 'отклонено') return
            id2e("delMTS").disabled = d.length == 0
            id2e("modMTS").disabled = d.length == 0
        }
    }

    //=======================================================================================
    // удаление MTS
    //=======================================================================================
    function del_zay2mts(d) {
        runSQL_p(`DELETE FROM zayavka2mts WHERE id=${d.id}`)
        runSQL_p(`DELETE FROM mts2comp WHERE id_mts=${d.id_mts}`)
        // runSQL_p(`DELETE FROM mts WHERE id=${d.id_mts} AND status="заказ"`)
    }
} // tabulator_Zayavka_MTS

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                      ТАБУЛЯТОР РАБОЧИХ СТАНЦИЙ                                          /
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function tabulator_mts_arm(id_div, appH, id_zayavka = 0) {
    let allow = getAllows()
    let ed = allow.E == 1 ? "input" : ""
    let ed_date = allow.E == 1 ? date_Editor : ""
    //let dt_now = moment().format('YYYY-MM-DDTHH:mm')
    let dt_now = new Date(moment().format("YYYY-MM-DD"))
    dt_now = dt_now.getTime()

    table_arm = new Tabulator("#" + id_div, {
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
            const id = getFirstID(table_arm)
            table_arm.selectRow(id)
        },

        rowSelectionChanged: function (data, rows) {
            id2e("delARM").disabled = data.length == 0
            const d = table_oper.getSelectedData()
            id2e("addARM").disabled = d.length == 0
        },

        rowClick: function (e, row) {
            m_id_ARM = row.getData().id
        },

        cellDblClick: function (e, cell) {
            // edit_arm(table_arm.getSelectedData()[0].id, id_zayavka, 'edit')
        },
    })

    id2e("delARM").onclick = () => {
        dialog_del_arm()
    }

    // id2e("modARM").onclick = () => {
    //     //edit_arm(table_arm.getSelectedData()[0].id, id_zayavka, 'edit')
    // }

    id2e("addARM").onclick = () => {
        edit_arm(id_zayavka, "new")
    }

    id2e(id_div).style.display = "inline-block"
    //table_arm.setFilter(customFilterZayavki, '')

    //=======================================================================================
    // создание пустого ARM
    //=======================================================================================
    async function create_arm(id_zayavka) {
        let d = Object.assign({}, empty_ARM)
        const id = await runSQL_p(`INSERT INTO mts2comp () VALUES ()`)
        d.id = id
        d.id_zayavka = id_zayavka
        d.id_mts = table_oper.getSelectedData()[0].id

        // table_arm.addRow(d, true)
        // table_arm.scrollToRow(id, "top", false)
        // table_arm.deselectRow()
        // table_arm.selectRow(id)

        addTabRow(table_arm, d, (top = true))
        edit_oper(id, "new")
    }

    //=======================================================================================
    // добавление или изменение компьютера
    //=======================================================================================
    async function edit_arm(id_zayavka, mode) {
        // let d = table_arm.getSelectedData()[0]
        let d_MTS = table_oper.getSelectedData()[0]
        let id_arm = 0

        const listComp = await selectComp("6100", 2, g_user.id_depart, true)

        listComp.forEach(async (comp) => {
            const d = Object.assign({}, empty_ARM)
            d.id = 0
            d.id_zayavka = id_zayavka
            d.id_mts = d_MTS.id_mts
            d.id_comp = comp.id_comp
            d.comp_name = comp.name
            d.comp_user = comp.user

            const id = await runSQL_p(
                `INSERT INTO mts2comp (id_zayavka,id_mts,id_comp) VALUES (${d.id_zayavka}, ${d.id_mts}, ${d.id_comp})`
            )
            id_arm = id
            d.id = id

            // table_arm.addRow(d, false)
            // table_arm.scrollToRow(id_arm, "bottom", false)
            // table_arm.deselectRow()
            // table_arm.selectRow(id_arm)
            // table_arm.redraw()

            addTabRow(table_arm, d, (top = false))
        })
    }

    //=======================================================================================
    // модаальное окно удаления компьютера
    //=======================================================================================
    async function dialog_del_arm() {
        const data = table_arm.getSelectedData()

        const ans = await dialogYESNO(
            "Выбранные рабочие станции<br><br>будут удалены, вы уверены?<br>"
        )

        if (ans == "YES") {
            data.forEach((d) => {
                del_arm(d)
                table_arm.deleteRow(d.id)
            })
            let id_arm = getFirstID(table_arm)
            table_arm.selectRow(id_arm)
            const d = table_arm.getSelectedData()
            id2e("delARM").disabled = d.length == 0
        }
    }

    //=======================================================================================
    // удаление MTS
    //=======================================================================================
    function del_arm(d) {
        runSQL_p(`DELETE FROM mts2comp WHERE id_comp=${d.id_comp}`)
    }
}

/////////////////////////////////////////////////////////////////////////////////////////
///                          ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ                                  ///
/////////////////////////////////////////////////////////////////////////////////////////

///////////////////// привязать/отвязать (on_off=true/false) МТС (id_mts) к пользователю (id_user)
async function mts_4_user(id_mts, id_user, on_off) {
    const user_data = await id_2_data(id_user, 'user')
    const id_depart = user_data.id_depart
    const depart_data = await id_2_data(id_depart, 'depart')
    const id_otdel = depart_data.id_otdel
    
    if (on_off) {
        return runSQL_p(
            `UPDATE mts SET
                id_user=${id_user},
                id_depart=${id_depart},
                id_otdel=${id_otdel}
            WHERE id=${id_mts}`
        )
    } else {
        return runSQL_p(
            `UPDATE mts SET
                id_user=0,
                id_depart=0,
                id_otdel=0
            WHERE id=${id_mts}`
        )
    }
}

///////////////////// склад/выдано (on_off=true/false) МТС (id_mts)
function mts_2_sklad(id_mts, on_off) {
    if (on_off) {
        return runSQL_p(
            `UPDATE mts SET
                sklad=1
            WHERE id=${id_mts}`
        )
    } else {
        return runSQL_p(
            `UPDATE mts SET
                sklad=2
            WHERE id=${id_mts}`
        )
    }
}


/////////////////////////////////////////////////////////////////////////////////////////
function save_zayavka(d) {
    return runSQL_p(
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
}

/////////////////////////////////////////////////////////////////////////////////////////
function save_zay2mts(d) {
    return runSQL_p(
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
}

/////////////////////////////////////////////////////////////////////////////////////////
function new_zayavka(d) {
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

    return runSQL_p(sql)
}

/////////////////////////////////////////////////////////////////////////////////////////
function id_status_2_name(id_status) {
    return m_statusTypes.find((t) => t.id == id_status).name
}

/////////////////////////////////////////////////////////////////////////////////////////
function id_oper_2_name(id_oper) {
    return m_operTypes.find((t) => t.id == id_oper).name
}

/////////////////////////////////////////////////////////////////////////////////////////
function customFilterZayavki(data, filterParams) {
    return true

    let dt = moment().format("YYYY-MM-DD")
    let cENA = id2e("cENA").checked
    let cDIS = id2e("cDIS").checked

    return (cENA && data.dt_stop >= dt) || (cDIS && data.dt_stop <= dt)
}

/////////////////////////////////////////////////////////////////////////////////////////
function tabZayavkiSetFilter() {
    table_zayavki.setFilter(customFilterZayavki, "")
}

/////////////////////////////////////////////////////////////////////////////////////////
function cb_onclick() {
    table_zayavki.setFilter(customFilterZayavki, "")
}

function factory_zayavka() {
    return {
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
        io_ruk: "0",
        io_it: "0",
        io_ib: "0",
        io_otd: "0",
        user_title: "",
        user_isp_title: "",
        status: "",
        comment: "",
        // вычисляемые поля для табулятора ---
        type: type,
        user_ruk: "Мосиенко А.В.",
        user_it: user_it.name,
        user_ib: user_ib.name,
        user_otd: user_otd.name,
        user: g_user.name,
        user_isp: "<выбрать>",
        depart: g_user.depart,
    }
}
