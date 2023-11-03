async function start_app() {
    sel_STAT = await loadSelector("status");
    sel_LVST = await loadSelector("lvs_type");
    sel_TORM = await loadSelector("torm");
    g_user.ip = await get_ip();
    g_user.mask = ip2mask(g_user.ip);
    g_id_scan_last = await get_id_scan_last();

    let usr = getCookie('g_user')
    let res = ''

    if (!!usr) {
        g_user.usr = s_usr
        let r = await initUser(usr)
    } else {
        res = await identUser();
    }

    g_moduleActive = 'mNews';
    mNews();

    return res;
}

function addTabRow(table, d, top = true) {
    table.addRow(d, top)
    table.redraw()
    table.scrollToRow(d.id, "top", false)
    table.deselectRow()
    table.selectRow(d.id)
}

//=======================================================================================
// модальное окно идентификации пользователя пользователя ===============================
//=======================================================================================
async function identUser() {
    return new Promise(function (resolve, reject) {

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
                setCookie('g_user', g_user.usr, {secure: true, 'max-age': 2592000})

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
    let ht = `<p style="margin:0; padding:0; text-align:right;">` + g_user.name + `&nbsp;&nbsp;
              <a href="http://10.161.208.25">
              <i id='logout' onclick='deleteCookie("g_user")' class="fa fa-sign-out" aria-hidden="true"></i>
              </a>&nbsp;&nbsp;</p>`;
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


//=======================================================================================
function getAllows() {
    let allow_R = g_user.modules.find(module => module.name == g_moduleActive).allow_R;
    let allow_E = g_user.modules.find(module => module.name == g_moduleActive).allow_E;
    let allow_C = g_user.modules.find(module => module.name == g_moduleActive).allow_C;
    let allow_D = g_user.modules.find(module => module.name == g_moduleActive).allow_D;
    let allow_A = g_user.modules.find(module => module.name == g_moduleActive).allow_A;
    return { R: allow_R, E: allow_E, C: allow_C, D: allow_D, A: allow_A };
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