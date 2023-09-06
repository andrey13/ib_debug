// активация модального окна ============================================================
function newModalWindow(
    modal, 
    html_header, 
    html_body, 
    html_footer, 
    width, 
    marginLeft, 
    marginTop, 
    win_return = null
) {

    console.log('newModalWindow ==================== ')
    console.log('win_return = ', win_return)
// console.log('win_return1 = ', win_return)
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
               <div     id="${modalContent}" class="modal-content">
                   <div id="${modalHeader}"  class="modal-header w3-teal" style="display: flex; align-items: center;">${html_header}</div>
                   <div id="${modalBody}"    class="modal-body tabulator">${html_body}</div>
                   <div id="${modalFooter}"  class="modal-footer w3-teal">${html_footer}</div>
               </div>
           </div>`;

    // вставить модальное окно в конец BODY ---------------------------------------------
    const body_el = document.getElementsByTagName('body')[0];
    body_el.insertAdjacentHTML("beforeend", modal_html);

    // задать ширину и положение модального окна ----------------------------------------
    id2e(modalContent).style.width = width;
    id2e(modalContent).style.marginLeft = marginLeft;
    id2e(modalContent).style.marginTop = marginTop;
    id2e(modalMain).style.padding = 0;

    // console.log('modalMain = ', modalMain)
    const div_modal = id2e(modalMain);
    div_modal.style.display = "block";

    // при нажатии ESC удалять модальное окно -------------------------------------------
    // document.onkeyup = function (e) {
    // console.log(' div_modal1 = ', div_modal)
    div_modal.onkeyup = function (e) {
        //console.log(' div_modal2 = ', div_modal)
        if (e.key == 'Escape') {
            div_modal.style.display = "none";
            div_modal.onkeyup = function (e) { };
            div_modal.remove();
            id_2_set_focus(win_return)

            // if (!!win_return) {
            //     const e = id2e(win_return)
            //     e.focus()
            // }
        }
    }

    div_modal.oncancel = () => {
        console.log('oncancel = ', div_modal)
    }


    //});
}

// удаление модального окна ==========================================================
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

// удаление модального окна ==========================================================
function id_2_set_focus(id) {
    console.log('id_2_set_focus ====================')
    console.log('id = ', id)
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