async function start_app() {
    sel_STAT = await loadSelector("status");
    sel_LVST = await loadSelector("lvs_type");
    sel_TORM = await loadSelector("torm");
    g_user.ip = await get_ip();
    g_user.mask = ip2mask(g_user.ip);
    g_id_scan_last = await get_id_scan_last();

    // console.log(g_user.ip);
    // console.log(g_user.mask);
    // console.log(g_id_scan_last);

    //    identUser()
    //        .then((res)=> {
    //            if (res=='YES') {
    //                alert('start_app');
    //                console.log('identUser -> YES');
    //                g_moduleActive = 'mNews';
    //                mNews();
    //            }
    //        });
    let res = await identUser();
    g_moduleActive = 'mNews';
    mNews();

    return res;
}


function addTabRow(table, d, top = true) {
    table.addRow(d, false)
    table.redraw()
    table.scrollToRow(d.id, "top", false)
    table.deselectRow()
    table.selectRow(d.id)
}


function fio2dat(fio) {
    return fio2fio2(fio).split(' ').map(w => fam2dat(w)).join(' ')
}

function fam2dat(wrd) {
    let out = wrd

    if (wrd.slice(-2) == 'ин')   out = wrd.slice(0,-2) + 'ину'
    if (wrd.slice(-2) == 'ва')   out = wrd.slice(0,-2) + 'вой'
    if (wrd.slice(-2) == 'ев')   out = wrd.slice(0,-2) + 'еву'

    return out
}

function txt2dat(txt) {
    return txt.split(' ').map(w => wrd2dat(w)).join(' ').toLowerCase()
}

function wrd2dat(wrd) {
    let out = wrd

    if (wrd == 'отдел') out = 'отдела'
    if (wrd == 'Отдел') out = 'отдела'
    if (wrd == 'начальник') out = 'Начальнику'
    if (wrd == 'Начальник') out = 'Начальнику'
    if (wrd.slice(-4) == 'ский')  out = wrd.slice(0,-4) + 'ского'
    if (wrd.slice(-3) == 'вой')   out = wrd.slice(0,-3) + 'вого'
    if (wrd.slice(-3) == 'вый')   out = wrd.slice(0,-3) + 'вого'
    if (wrd.slice(-3) == 'ный')   out = wrd.slice(0,-3) + 'ного'
    if (wrd.slice(-3) == 'щий')   out = wrd.slice(0,-3) + 'щего'

    return out
}

//=======================================================================================
// Иванов Петр Сидорович -> Иванов ПС
//=======================================================================================
function fio2fio0(fio) {
    if (!!!fio) return ''
    if (fio === null) return ''
    let arrayOffio = fio.split(' ');
    if (arrayOffio.length < 3) return fio
    return arrayOffio[0] + ' ' + arrayOffio[1].substring(0, 1) + arrayOffio[2].substring(0, 1);
}
//=======================================================================================
// Иванов Петр Сидорович -> Иванов П.С.
//=======================================================================================
function fio2fio(fio) {
    let arrayOffio = fio.split(' ');
    return arrayOffio[0] + ' ' + arrayOffio[1].substring(0, 1) + '.' + arrayOffio[2].substring(0, 1) + '.';
}
//=======================================================================================
// Иванов Петр Сидорович -> Иванов П. С.
//=======================================================================================
function fio2fio1(fio) {
    let arrayOffio = fio.split(' ');
    return arrayOffio[0] + ' ' + arrayOffio[1].substring(0, 1) + '. ' + arrayOffio[2].substring(0, 1);
}
///////////////////////////////////////////////////////////////////////////////////////////
// Иванов Петр Сидорович -> П.С. Иванов
///////////////////////////////////////////////////////////////////////////////////////////
function fio2fio2(fio) {
    let arrayOffio = fio.split(' ');
    return arrayOffio[1].substring(0, 1) + '.' + arrayOffio[2].substring(0, 1) + '. ' + arrayOffio[0];
}



//=======================================================================================
// модальное окно идентификации пользователя пользователя ===============================
//=======================================================================================
async function identUser() {
    return new Promise(function (resolve, reject) {

        //let div_modal = '';

        // создание модального окна ----------------------------------------------------------
        let div_modal = document.createElement('div');

        div_modal.className = "w3-modal";

        div_modal.innerHTML = `<div id="smallModalWindow"class="modal-content" style="width:250px">
                                <div id="smallModalHeader" class="modal-header w3-teal" style="padding:1px 16px">
                                <p>вход в систему сервисов ИБ</p>
                                </div>
                                <div id="smallModalBody"   class="modal-body" style="text-align:center">
                                     <div class="w3-container">
                                          <form>
                                                <label for="s_usr"><b>логин:</b></label><br>
                                                <input type="text" id="s_usr" name="s_usr"><br>
                                                
                                                <label for="s_pwd"><b>пароль:</b></label><br>
                                                <input type="password" id="s_pwd" name="s_pwd"><br><br>
                                          </form>
                                                <button id="ENTER"  class="w3-button w3-border w3-hover-teal">войти</button>   
                                                <button id="CANCEL" class="w3-button w3-border w3-hover-red">отмена</button><br><br>
                                     </div>
                                </div>     
                                <div id="smallModalFooter" class="modal-footer w3-teal"></div>
                           </div>`;

        document.body.append(div_modal);

        // при наведении фокуса на поле ЛОГИН: очищать строку статуса -----------------------
        document.getElementById("s_usr").onfocus = function () {
            document.getElementById("smallModalFooter").innerHTML = "";
            document.getElementById("smallModalFooter").className = "modal-footer w3-teal";
        }

        // при наведении фокуса на поле ПАРОЛЬ: очищать строку статуса ----------------------
        document.getElementById("s_pwd").onfocus = function () {
            document.getElementById("smallModalFooter").innerHTML = "";
            document.getElementById("smallModalFooter").className = "modal-footer w3-teal";
        }

        // нажатие кнопки ВОЙТИ -------------------------------------------------------------
        document.getElementById("ENTER").onclick = async function () {
            let s_usr = $("#s_usr").val();
            let s_pwd = $("#s_pwd").val();

            s_usr = s_usr.trim();

            g_user.usr = s_usr;
            g_user.pwd = s_pwd;

            if (s_usr[0] == "@") {
                s_usr = s_usr.slice(1);
                g_user.usr = s_usr;
                g_user.result = "YES"     // отладка, пропущена проверка пароля
            } else {
                g_user.result = await autentUser(g_user);
                g_user.pwd = '';
            }

            if (g_user.result == "YES") {
                // console.log('YES');

                if (await initUser(g_user.usr)) {
                    div_modal.style.display = "none";
                    div_modal.remove();
                    div_modal.onkeyup = function (e) { };
                    log_reg("регистрация пользователя " + s_usr, s_pwd);
                    resolve('YES');
                } else {
                    document.getElementById("smallModalFooter").innerHTML = g_user.usr + " не зарегистрирован!";
                    document.getElementById("smallModalFooter").className = "modal-footer w3-red";
                    reject('REG');
                }

            } else {
                document.getElementById("smallModalFooter").innerHTML = "неверный логин или пароль!";
                document.getElementById("smallModalFooter").className = "modal-footer w3-red";
                log_reg("неверный логин или пароль " + s_usr, s_pwd);
                reject('PWD');
            }
        }

        // нажатие кнопки ОТМЕНА ------------------------------------------------------------
        document.getElementById("CANCEL").onclick = function () {
            div_modal.style.display = "none";
            div_modal.remove();
            document.onkeyup = function (e) { };
            reject('CANCEL');
        }

        div_modal.onkeyup = function (e) {
            // console.log('key=', e.key);
            if (e.key == 'Escape') {
                div_modal.remove();
                document.onkeyup = function (e) { };
                reject('CANCEL');
            }
            if (e.key == 'Enter') {
                document.getElementById("ENTER").onclick();
                //div_modal.remove();
                //div_modal.onkeyup = function (e) { };
            }
        };


        // активация модального окна --------------------------------------------------------
        div_modal.style.display = "block";
        document.getElementById("s_usr").focus();

    });
}


//=======================================================================================
// инициализация параметров пользователя
//=======================================================================================
async function initUser(account) {
    //alert('initUser-1');
    let user_data = await account2data(account);
    // console.log('user_data = ', user_data)
    if (user_data.length == 0) return false;

    g_user.id = user_data[0].id;
    g_user.sono = user_data[0].sono;
    g_user.name = user_data[0].name;
    g_user.tel = user_data[0].telephone;
    g_user.id_depart = user_data[0].id_depart;
    g_user.depart = user_data[0].depart;
    g_user.id_otdel = user_data[0].id_otdel;

    let userModules = await id2modules(user_data[0].id)
    let userRoles = await id2roles(g_user.id)
    g_user.modules = userModules
    g_user.roles = userRoles
    let ht_menu = await initMenu(userModules)
    //alert('initUser-2');
    return true
}

//=======================================================================================
// проверка роли текущего пользователя
//=======================================================================================
function isRole(role) {
    for (d of g_user.roles) {
        if (d.role == role) return true
    }
    return false
}

//=======================================================================================
// инициализация меню пользователя ======================================================
//=======================================================================================
async function initMenu(modules) {
    //alert('initMenu-1');
    if (modules.length == 0) { return ``; }
    let ht = `<p style="margin:0; padding:0; text-align:right;">` + g_user.name + `&nbsp;&nbsp;<a href="http://10.161.214.25"><i class="fa fa-sign-out" aria-hidden="true"></i></a>&nbsp;&nbsp;</p>`;
    let script;

    // цикл по всем модулям, доступным пользователю -------------------------------------
    modules.forEach(module => {
        // создание кнопки вызова модуля ------------------------------------------------
        ht += `<button id="${module.name}" class="button_main_menu w3-button w3-padding-small w3-border w3-hover-teal">${module.title}</button> `;
        // загрузка модуля --------------------------------------------------------------
        if (module.name != 'mNews') {
            script = document.createElement('script');
            //script.type = "module";
            script.src = "modules/" + module.name + ".js";
            document.head.append(script);
        }
    });
    document.getElementById("appMenu").innerHTML = ht + "<br>";

    // при нажатии кнопки вызвать главную функцию модуля, ее имя совпадает с id кнопки --
    $(".button_main_menu").mousedown(function () {
        if (g_moduleActive) {
            document.getElementById(g_moduleActive).className = "button_main_menu w3-padding-small w3-button w3-border w3-hover-teal";
        }
        let module = this.id;
        //if (g_moduleActive != module) {
        g_moduleActive = module;
        eval(module + '();');
        log_reg('вход в систему ' + g_moduleActive);
        //}
        //this.style.backgroundColor = "#D94A38";
        this.className = "button_main_menu w3-button w3-padding-small w3-border w3-hover-teal w3-teal";
    });

    //alert('initMenu-2');
    return '<div>' + ht + '</div>';
}





function date2date(date) {
    return (!date || date == '0000-00-00') ? '' : moment(date, "YYYY-MM-DD").format("DD.MM.YYYY");
}

let date_Editor = function (cell, onRendered, success, cancel) {
    var cellValue = moment(cell.getValue(), "YYYY-MM-DD").format("YYYY-MM-DD");
    var input = document.createElement("input");

    input.setAttribute("type", "date");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    input.value = cellValue;

    onRendered(function () {
        input.focus();
        input.style.height = "100%";
    });

    function onChange() {
        if (input.value != cellValue) {
            // console.log('input.value=', input.value);
            //console.log(moment(input.value, "DD.MM.YYYY").format("YYYY-MM-DD"));
            success(moment(input.value, "YYYY-MM-DD").format("YYYY-MM-DD"));
        } else {
            cancel();
        }
    }

    //submit new value on blur or change
    input.addEventListener("blur", onChange);

    //submit new value on enter
    input.addEventListener("keydown", function (e) {
        if (e.key == 'Enter') onChange();
        if (e.key == 'Escape') cancel();
    });

    return input;
};

let datetime_Editor = function (cell, onRendered, success, cancel) {
    var cellValue = moment(cell.getValue(), "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
    var input = document.createElement("input");

    input.setAttribute("type", "datetime-local");

    input.style.padding = "4px";
    input.style.width = "100%";
    input.style.boxSizing = "border-box";

    input.value = cellValue;

    onRendered(function () {
        input.focus();
        input.style.height = "100%";
    });

    function onChange() {
        if (input.value != cellValue) {
            // console.log('input.value=', input.value);
            //console.log(moment(input.value, "DD.MM.YYYY").format("YYYY-MM-DD"));
            success(moment(input.value, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));
        } else {
            cancel();
        }
    }

    //submit new value on blur or change
    input.addEventListener("blur", onChange);

    //submit new value on enter
    input.addEventListener("keydown", function (e) {
        if (e.key == 'Enter') onChange();
        if (e.key == 'Escape') cancel();
    });

    return input;
};


function Export2Word(element, filename = '') {
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    var postHtml = "</body></html>";
    var html = preHtml + document.getElementById(element).innerHTML + postHtml;

    var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });

    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

    // Specify file name
    filename = filename ? filename + '.doc' : 'document.doc';

    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = url;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
    }

    document.body.removeChild(downloadLink);
}


function randomColor(brightness) {
    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | ((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length == 1) ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}


//=======================================================================================
function dialogYESNO(text) {
    return new Promise(function (resolve, reject) {
        // создание модального окна ----------------------------------------------------------
        let div_modal = "";

        div_modal = document.createElement('div');

        div_modal.className = "w3-modal";

        div_modal.innerHTML = `<div id="modalWindow" class="modal-content" style="width:250px">
                                    <div id="modalHeader" class="modal-header w3-red" style="padding:1px 16px">
                                    </div>
                                    <div id="modalBody"   class="modal-body" style="text-align:center">
                                         ${text}<br><br>
                                         <div class="w3-container">
                                              <button id="YES" class="w3-button w3-border w3-hover-red"  style="width:70px">ДА</button>   
                                              <button id="NO"  class="w3-button w3-border w3-hover-red"  style="width:70px">НЕТ</button><br><br>
                                         </div>
                                    </div>     
                                    <div id="modalFooter" class="modal-footer w3-red"></div>
                               </div>`;

        document.body.append(div_modal);
        div_modal.style.display = "block";
        document.getElementById("YES").focus();

        div_modal.onkeyup = function (e) {
            // console.log('key=', e.key);
            if (e.key == 'Escape') {
                div_modal.remove();
                div_modal.onkeyup = function (e) { };
                reject("ESC");
            }
            if (e.key == 'Enter') {
                div_modal.remove();
                div_modal.onkeyup = function (e) { };
                resolve("YES");
            }
        };
        // нажатие кнопки ОТМЕНА ------------------------------------------------------------
        document.getElementById("NO").onclick = function () {
            div_modal.style.display = "none";
            div_modal.remove();
            div_modal.onkeyup = function (e) { };
            reject("NO");
        }
        // нажатие кнопки ДА ---------------------------------------------------------------
        document.getElementById("YES").onclick = function () {
            div_modal.style.display = "none";
            div_modal.remove();
            div_modal.onkeyup = function (e) { };
            resolve("YES");
        }

    });
}

function getAllows() {
    let allow_R = g_user.modules.find(module => module.name == g_moduleActive).allow_R;
    let allow_E = g_user.modules.find(module => module.name == g_moduleActive).allow_E;
    let allow_C = g_user.modules.find(module => module.name == g_moduleActive).allow_C;
    let allow_D = g_user.modules.find(module => module.name == g_moduleActive).allow_D;
    let allow_A = g_user.modules.find(module => module.name == g_moduleActive).allow_A;
    return { R: allow_R, E: allow_E, C: allow_C, D: allow_D, A: allow_A };
}

// активация модального окна ============================================================
function newModalWindow(modal, html_header, html_body, html_footer, width, marginLeft, marginTop) {
    //return new Promise(function (resolve, reject) {
    // создание элементов модального окна -----------------------------------------------   
    let modalMain = modal + "Main";
    let modalContent = modal + "Content";
    let modalHeader = modal + "Header";
    let modalBody = modal + "Body";
    let modalFooter = modal + "Footer";
    let modal_html = `
           <div         id="${modalMain}"    class="modal" style="display:none;">
               <div     id="${modalContent}" class="modal-content">
                   <div id="${modalHeader}"  class="modal-header w3-teal" style="display: flex; align-items: center;">${html_header}</div>
                   <div id="${modalBody}"    class="modal-body tabulator">${html_body}</div>
                   <div id="${modalFooter}"  class="modal-footer w3-teal">${html_footer}</div>
               </div>
           </div>`;

    // вставить модальное окно в конец BODY ---------------------------------------------
    let body_el = document.getElementsByTagName('body')[0];
    body_el.insertAdjacentHTML("beforeend", modal_html);

    // задать ширину и положение модального окна ----------------------------------------
    document.getElementById(modalContent).style.width = width;
    document.getElementById(modalContent).style.marginLeft = marginLeft;
    document.getElementById(modalContent).style.marginTop = marginTop;
    id2e(modalMain).style.padding = 0;

    let div_modal = document.getElementById(modalMain);
    div_modal.style.display = "block";

    // при нажатии ESC удалять модальное окно -------------------------------------------
    document.onkeyup = function (e) {
        if (e.key == 'Escape') {
            div_modal.style.display = "none";
            div_modal.onkeyup = function (e) { };
            div_modal.remove();
        }
    };
    //});
}

// удаление модального окна ==========================================================
function removeModalWindow(modal) {
    let modalMain = modal + "Main";
    let div_modal = document.getElementById(modalMain);
    div_modal.style.display = "none";
    div_modal.onkeyup = function (e) { };
    div_modal.remove();
}



// активация модального окна ============================================================
function activateModalWindow(modal) {
    let modal_object = document.getElementById(modal);
    let modal_body = document.getElementById(modal + "Body");
    document.getElementById(modal + "Body").style.height = null;
    modal_object.style.display = "block";
    document.onkeyup = function (e) {
        // console.log('onkeyup');
        if (e.key == 'Escape') {
            modal_object.style.display = "none";
            modal_object.onkeyup = function (e) { };
        }
    };
}
// деактивация модального окна ==========================================================
function deactivateModalWindow(modal) {
    document.getElementById(modal).style.display = "none";
    document.onkeyup = function (e) { };
}





//ШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШ 
function renderStartedCursor(tabulator, table) {
    //console.log("renderStarted");
    if ((tabulator.rowManager.activeRowsCount > 0) && (table.id_current == 0)) {
        table.id_current = tabulator.rowManager.activeRows[0].data.id;
    }
    //console.log("renderStarted table.id_current=", table.id_current);
    table.row_current = tabulator.searchRows("id", "=", table.id_current)[0];
}
//ШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШ 
function rowFormatterCursor(row, table) {
    //console.log("rowFormatterCursor");
    // сохранение цвета фона и шрифта текущей записи---------------------------------
    table.bg_current = row.getElement().style.backgroundColor;
    //console.log('row.getElement().style.backgroundColor1=',row.getElement().style.backgroundColor)
    //console.log("rowFormatterCursor -> table.bg_current1=", table.bg_current);

    if (row.getData().id == table.id_current) {
        // изменение цвета фона и шрифта текущей записи----------------------------------
        row.getElement().style.backgroundColor = "#008080";  // w3-teal
        row.getElement().style.color = "#FFFFFF";  // 
    } else {
        // изменение цвета фона и шрифта остальных записей-------------------------------
        //row.getElement().style.backgroundColor = '';
        row.getElement().style.color = "#000000";
    }
}
//ШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШ 
function rowClickCursor(row, table) {
    //console.log("rowClickCursor---------------------------------------------------------------------------");
    //console.log("rowClickCursor -> row.id", row.getData().id);
    //console.log("rowClickCursor -> id_current", table.id_current);

    if (row.getData().id == table.id_current) {
        //console.log("rowClickCursor - row.id=id_current"); 
        return false;
    }

    // установить указатель на новую строку -----------------------------------------
    table.id_current = row.getData().id;

    if (table.row_current) {
        //console.log("rowClickCursor -> row_current", table.row_current.getData().id);
        // вернуть цвет фона и текста бывшей текущей строке -----------------------------
        table.row_current.getElement().style.backgroundColor = table.bg_current;
        //table.row_current.getElement().style.backgroundColor = '';
        table.row_current.getElement().style.color = "#000000";
        // переформатировать бывшую текущей строку --------------------------------------
        table.row_current.reformat();
        // назначить новую текущую строку -----------------------------------------------
    }
    table.row_current = row;
    // переформатировать новую текущую строку ---------------------------------------
    table.row_current.reformat();

    return true;
}

//ШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШШ 
function cellClickCursor(cell, table) {
    //console.log("cellClickCursor");
    let v_fieldName = cell.getField();
    //if (v_fieldName != "id") return;

    // вернуть цвет фона и текста бывшей текущей строке -----------------------------
    table.row_current.getElement().style.backgroundColor = table.bg_current;
    table.row_current.getElement().style.color = "#010101";

    // установить указатель на новую строку -----------------------------------------
    table.id_current = cell.getRow().getData().id;

    // переформатировать бывшую текущей строку --------------------------------------
    table.row_current.reformat();

    // назначить новую текущую строку -----------------------------------------------
    table.row_current = cell.getRow();

    // переформатировать новую текущую строку ---------------------------------------
    table.row_current.reformat();
}


function appBodyHeight() {
    // console.log(`${window.innerHeight} - ${$("#appHeader").height()} - ${$("#appMenu").height()} - ${$("#appFooter").height()} = ${window.innerHeight - $("#appHeader").height() - $("#appMenu").height() - $("#appFooter").height()}`);
    return (
        window.innerHeight -
        $("#appHeader").height() -
        $("#appMenu").height() -
        $("#appFooter").height()
    );
}

function appBodyWidth() {
    return (
        window.innerWidth
    );
}


function showHelp(text) {
    //$("#help").html(text);
    $("#help").show();
}

function button_init(id_button) {
    $(id_button).mousedown(function () {
        this.style.backgroundColor = "#FF0000";
    });
    $(id_button).mouseenter(function () {
        this.style.backgroundColor = "#999999";
    });
    $(id_button).mouseleave(function () {
        this.style.backgroundColor = "#FFFFFF";
    });
}

function id2done(id) {
    switch (id) {
        case "0":
            return "не устранено";
        case "1":
            return "устранено собственными силами";
        case "2":
            return "устранено ФКУ";
        case "3":
            return "устранено ЦОД";
    }
}

function id2level(id) {
    switch (id) {
        case "0":
            return "низкий";
        case "1":
            return "средний";
        case "2":
            return "высокий";
        case "3":
            return "критический";
    }
}

// контекстное меню по правой кнопке мыши для любой таблицы--------------------------------
function rowMenu() {
    return [
        {
            label: "Печать",
            action: function (e, row) {
                row.getTable().print(false, true);
            },
        },
        {
            label: "Экспорт в XLXS",
            action: function (e, row) {
                row.getTable().download("xlsx", "data.xlsx");
            },
        },
        {
            label: "Экспорт в WORD",
            action: function (e, row) {
                Export2Word('appBody');
            },
        },
    ];
}

// перевод из символьного выражения статуса программы в числовое-------------------------
function s2i(status) {
    switch (status) {
        case "не определено":
            return 1;
        case "разрешено":
            return 2;
        case "запрещено":
            return 3;
        case "реестр":
            return 4;
        default:
            return 1;
    }
}

// перевод из числового  выражения статуса программы в символьное-------------------------
function i2s(id) {
    switch (status) {
        case 1:
            return "не определено";
        case 2:
            return "разрешено";
        case 3:
            return "запрещено";
        default:
            return "не определено";
    }
}

// определение ip адреса пользователя ---------------------------------------------------
function ip2mask(ip) {
    return ip.slice(0, ip.lastIndexOf(".")) + ".0";
}

// протоколирование работы программы- ---------------------------------------------------------
function log_reg(comment, ppp) {
    // if (g_user.usr == '6100-02-708' || g_user.ip == '10.161.214.3') { return; }
    let dt = moment().format('YYYY-MM-DD HH:mm:ss');

    //console.log("g_user.name=", g_user.name)

    runSQL_p(`INSERT INTO logs (ip_user, seans_datetime, comment, name, account, pppp) 
              VALUES ('${g_user.ip}', 
                      '${dt}', 
                      '${comment}',
                      '${g_user.name}',
                      '${g_user.usr}',
                      '')`);
}





// вычисление маски подсети =============================================================
function bit2mask(nb) {
    let mask = "";
    //console.log(" nb:", nb, " type:", typeof nb);
    switch (nb) {
        case 32:
            mask = "255.255.255.255";
            break;
        case 31:
            mask = "255.255.255.254";
            break;
        case 30:
            mask = "255.255.255.252";
            break;
        case 29:
            mask = "255.255.255.248";
            break;
        case 28:
            mask = "255.255.255.240";
            break;
        case 27:
            mask = "255.255.255.224";
            break;
        case 26:
            mask = "255.255.255.192";
            break;
        case 25:
            mask = "255.255.255.128";
            break;
        case 24:
            mask = "255.255.255.0";
            break;
        case 23:
            mask = "255.255.254.0";
            break;
        case 22:
            mask = "255.255.252.0";
            break;
        case 21:
            mask = "255.255.248.0";
            break;
        case 20:
            mask = "255.255.240.0";
            break;
        case 19:
            mask = "255.255.224.0";
            break;
        case 18:
            mask = "255.255.192.0";
            break;
        case 17:
            mask = "255.255.128.0";
            break;
        case 16:
            mask = "255.255.0.0";
            break;
        case 15:
            mask = "255.254.0.0";
            break;
        case 14:
            mask = "255.252.0.0";
            break;
        case 13:
            mask = "255.248.0.0";
            break;
        case 12:
            mask = "255.240.0.0";
            break;
        case 11:
            mask = "255.224.0.0";
            break;
        case 10:
            mask = "255.192.0.0";
            break;
        case 9:
            mask = "255.128.0.0";
            break;
        case 8:
            mask = "255.0.0.0";
            break;
        case 7:
            mask = "254.0.0.0";
            break;
        case 6:
            mask = "252.0.0.0";
            break;
        case 5:
            mask = "248.0.0.0";
            break;
        case 4:
            mask = "240.0.0.0";
            break;
        case 3:
            mask = "224.0.0.0";
            break;
        case 2:
            mask = "192.0.0.0";
            break;
        case 1:
            mask = "128.0.0.0";
            break;
        case 0:
            mask = "0.0.0.0";
            break;
        default:
            mask = "";
    }
    //console.log("mask:", mask);
    return mask;
}

// определение полномочий пользователя ==================================================
function get_mode(ip) {
    user_mode = "R";
    //if (ip=="127.0.0.1")     {user_mode = "A"} // Крашеница
    //if (ip == "10.197.61.2") {
    //    user_mode = "L";
    //} // Салеев
    if (ip == "10.161.214.3") {
        user_mode = "A";
    } // Крашеница
    if (ip == "10.161.214.12") {
        user_mode = "W";
    } // Черкашин
    if (ip == "10.161.214.27") {
        user_mode = "W";
    } // Голубенко
    if (ip == "10.161.214.28") {
        user_mode = "W";
    } // Корскова
    if (ip == "10.161.214.25") {
        user_mode = "W";
    } // Переверзев
    if (ip == "10.161.214.16") {
        user_mode = "W";
    } // Демина
    if (ip == "10.161.214.55") {
        user_mode = "W";
    } // Котов
}

// ======================================================================================
//function regUser() {
//    let ht = '<div id="reguser">';
//    ht += '<form action="">';
//    ht += '<label for="username">имя в REGIONS:</label><br>';
//    ht += '<input type="text" id="username" name="username"><br>';
//    ht += '<label for="pwd">пароль:</label><br>';
//    ht += '<input type="password" id="pwd" name="pwd"><br><br>';
//    ht += '<input type="submit" value="OK">';
//    ht += "</form>";
//    ht += "</div>";
//    //console.log("ht:", ht);
//    log_reg("регистрация в домене");
//    $("#appBody").html(ht);
//    $("form").submit(function (event) {
//        event.preventDefault();
//        //console.log("username:",$("#username").val());
//        usrCheck($("#username").val(), $("#pwd").val());
//    });
//}



//=======================================================================================
function id2e(id) {
    return document.getElementById(id);
}

//=======================================================================================
function txt2txt(text) {
    return text.toLowerCase()
        .replace('общий', 'общего')
        .replace('аналитический', 'аналитического')
        .replace('контрольный', 'контрольного')
        .replace('правовой', 'правового')
        .replace('финансовый', 'финансового')
        .replace('хозяйственный', 'хозяйственного')
        .replace('финансовый', 'финансового')
        .replace('руководство', 'УФНС России по Ростовской области')
        .replace('начальник отдела', 'Начальник')
        .replace('заместитель начальника отдела', 'И.о. начальника')
        .replace('отдел', 'отдела')
        .replace('руководитель управления', 'Руководитель')
        .replace('заместитель руководителя управления', 'И.о. руководителя');
}

//=======================================================================================
function txt4txt(text) {
    return text.toLowerCase()
        .replace('И.о. руководителя', 'заместитель руководителя управления')
        .replace('Руководитель', 'руководитель управления')
        .replace('И.о. начальника', 'заместитель начальника отдела')
        .replace('отдела', 'отдел')
        .replace('общего', 'общий')
        .replace('аналитического', 'аналитический')
        .replace('контрольного', 'контрольный')
        .replace('правового', 'правовой')
        .replace('финансового', 'финансовый')
        .replace('хозяйственного', 'хозяйственный')
        .replace('финансового', 'финансовый')
        .replace('УФНС России по Ростовской области', 'руководство')
        .replace('Начальник', 'начальник отдела')
}

//=======================================================================================
function getCurrentID(table) {
    if (table.getSelectedData().length == 0) return 0;
    return table.getSelectedData()[0].id;
}

//=======================================================================================
function getFirstID(table) {
    if (table.rowManager.activeRows.length == 0) return 0;
    return table.rowManager.activeRows[0].getData().id;
}

//=======================================================================================
function ip10(ip_string) {
    let ip = '';
    let ip_array = ip_string.split(',');
    ip_array.every(element => {
        ip = element.trim();
        if (ip.slice(0, 2) == '10') {
            return false;
        } else {
            return true;
        }
    });
    return ip;
}

//=======================================================================================
function ip_compare(ip1, ip2) {
    if (ip1 == ip2) return 0;
    let ip1_array = ip1.split('.');
    let ip2_array = ip2.split('.');
    let ip1_nnnn = ip1_array[0] * 16777216 + ip1_array[1] * 65536 + ip1_array[2] * 256 + ip1_array[3] * 1;
    let ip2_nnnn = ip2_array[0] * 16777216 + ip2_array[1] * 65536 + ip2_array[2] * 256 + ip2_array[3] * 1;
    //console.log(ip1_nnnn, '    ', ip2_nnnn);
    if (+ip1_nnnn > +ip2_nnnn) return 1;
    if (+ip1_nnnn < +ip2_nnnn) return -1;
}

//=======================================================================================
function clog(text) {
    console.log(text);
}
