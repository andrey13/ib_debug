// активация модального окна ============================================================
/***
 * @param modal - элемент div, в котором создавать модальное окно
 * @param win_return - элемент div, которому передать фокус после закрытия модального окна
 * @param esc_collback - действие, которое назначено на нажание клавиши ESC, после выполнения этого действия, все назначенные действия на ESC - очищаются
 * @returns none
 */
function newModalWindow(
    modal, 
    html_header, 
    html_body, 
    html_footer, 
    width, 
    marginLeft, 
    marginTop, 
    win_return = null,
    esc_callback = null
) {

    //return new Promise(function (resolve, reject) {
    // создание элементов модального окна -----------------------------------------------      
    // const modalMain = modal + "Main"

    const modalMain = modal
    const modalContent = modal + "Content"
    const modalHeader = modal + "Header"
    const modalBody = modal + "Body"
    const modalFooter = modal + "Footer"

    const modal_html = `
           <div         id="${modalMain}"    class="modal" style="display:none;" tabindex="0">
               <div     id="${modalContent}" class="modal-content" >
                   <div id="${modalHeader}"  class="modal-header w3-teal" style="display: flex; align-items: center;">${html_header}</div>
                   <div id="${modalBody}"    class="modal-body">${html_body}</div>
               </div>
           </div>`;
//           <div id="${modalFooter}"  class="modal-footer w3-teal">${html_footer}</div>

    // вставить модальное окно в конец BODY ---------------------------------------------
    const body_el = document.getElementsByTagName('body')[0]
    body_el.insertAdjacentHTML("beforeend", modal_html)

    // задать ширину и положение модального окна ----------------------------------------
    id2e(modalContent).style.width = width;
    id2e(modalContent).style.marginLeft = marginLeft;
    id2e(modalContent).style.marginTop = marginTop;
    id2e(modalMain).style.padding = 0;

    const div_modal = id2e(modalMain);
    div_modal.style.display = "block";

    // при нажатии ESC удалять модальное окно -------------------------------------------
    div_modal.onkeyup = function (e) {
        if (e.key == 'Escape') {
            // console.log('esc_callback = ', esc_callback)
            if (!!esc_callback) esc_callback()
            div_modal.style.display = "none";
            div_modal.onkeyup = function (e) { };
            div_modal.remove();
            id_2_set_focus(win_return)
        }
    }

    div_modal.oncancel = () => {
        // console.log('oncancel = ', div_modal)
    }

    id_2_set_focus(modal)
}

// удаление модального окна ==========================================================
/***
 * удаление модального окна
 * @param modal - элемент div, в котором находится модальное окно
 * @param win_return - элемент div, которому передать фокус после закрытия модального окна
 */
function removeModalWindow(modal, win_return = null) {
    // const modalMain = modal + "Main"
    const modalMain = modal
    // console.log('modalMain = ', modalMain)
    const div_modal = id2e(modalMain)
    // console.log('div_modal = ', div_modal)
    div_modal.style.display = "none"
    div_modal.onkeyup = function (e) { }
    div_modal.remove()
    id_2_set_focus(win_return)

    // if (!!win_return) {
    //     const e = id2e(win_return)
    //     e.focus()
    // }
}

// установить фокус на элемент с id =====================================================
function id_2_set_focus(id) {
    // console.log('id_2_set_focus ====================')
    // console.log('id = ', id)
    const e = id2e(id)
    if (!!id && id != '' && !!e) e.focus()
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

// удаление любого элемента =============================================================
function removeElement(element, win_return = null) {
    element.style.display = "none"
    element.remove()
    element.onkeyup = function (e) { }
    id_2_set_focus(win_return)
}


//=======================================================================================
function dialogYESNO(text, win_return = '') {
    return new Promise(function (resolve, reject) {
        // создание модального окна ----------------------------------------------------------
        let div_modal = ""

        div_modal = document.createElement('div')

        div_modal.className = "w3-modal"

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
                               </div>`

        document.body.append(div_modal)
        div_modal.style.display = "block"
        document.getElementById("YES").focus()

        div_modal.onkeyup = function (e) {
            // console.log('key=', e.key)
            if (e.key == 'Escape') {
                removeElement(div_modal, win_return)
                resolve("ESC")
            }
            if (e.key == 'Enter') {
                removeElement(div_modal, win_return)
                resolve("YES")
            }
        };
        // нажатие кнопки ОТМЕНА ------------------------------------------------------------
        document.getElementById("NO").onclick = function () {
            removeElement(div_modal, win_return)
            resolve("NO")
        }
        // нажатие кнопки ДА ---------------------------------------------------------------
        document.getElementById("YES").onclick = function () {
            removeElement(div_modal, win_return)
            resolve("YES")
        }

    })
}
