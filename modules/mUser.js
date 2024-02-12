//console.log("load mUser");
let msgFooterUser   = "<input type='checkbox' id='cUsr' name='cUsr' value='No'><label for='cUsr'>Показывать отключенные</label>               <b>ЛЕВАЯ КНОПКА МЫШИ</b> - подробная информация&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>ПРАВАЯ КНОПКА МЫШИ</b> - вывод на печать или в файл XLSX текущего списка ПО";

function mUser(){
    console.log("run mUser");
    let appHeight = appBodyHeight();
    $("#appBody").html('<div id="tabUser"></div>');
    $("#appBody").height(appHeight);
    createTabulatorUser("tabUser", appHeight, msgFooterUser);
}

//=======================================================================================
// табулятор справочника пользователей ==================================================
//=======================================================================================

function createTabulatorUser(id_div, appH, msgF) {
    //  let ed = (c_user_mode=="W" || c_user_mode=="A") ? "input" : "";
    //  let ms = (c_user_mode=="W" || c_user_mode=="A") ? msgF : "";
        let sono_mask = (g_user.sono=="6100") ? "":g_user.sono;
      tableUser = new Tabulator('#'+id_div, {
        ajaxURL:"myphp/loadDataUser.php",
        ajaxParams:{s:sono_mask},
        ajaxConfig:"GET",
        ajaxContentType:"json",
        height:appH,    
        layout:"fitColumns",
        tooltipsHeader:true,
        printAsHtml:true,
        printHeader:"<h1>Пользователи<h1>",
        printFooter:"",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder:"",
        columns:[ 
            {title:'id',       field:'id'},
            {title:"СОНО",     field:"sono",       widthGrow:1, headerFilter:true, topCalc:"count"},
            {title:"логин",    field:"Account",    widthGrow:2, headerFilter:true},
            {title:"ФИО",      field:"name",       widthGrow:4, headerFilter:true},
            {title:"телефон",  field:"telephone",  widthGrow:2, headerFilter:true},
            {title:"комната",  field:"room",       widthGrow:1, headerFilter:true},
            {title:"описание", field:"description",widthGrow:8, headerFilter:true},
            {title:"flag",     field:"mail_flag",  width:40,    headerFilter:true},
            {title:"e-mail",   field:"mail",       widthGrow:4, headerFilter:true},
            {title:"ЕСК",      field:"esk_status", widthGrow:1, headerFilter:true},
        ],
        rowClick:function(e, row){ 
        },
        footerElement:msgF,
      });
      
      tableUser.setFilter("esk_status", "=", "2");
      // вкл/выкл фильтра по актуальным уязвимостям -------------------------------------------
      $("#cUsr").click( function () { 
          let cc = document.getElementById('cUsr')
          console.log("cUsr:", cc.checked); 
          if (cc.checked) {
              tableUser.setFilter("esk_status", ">=", 0);
          } else {
              tableUser.setFilter("esk_status", "=", 2);
          }
          tableUser.refreshFilter();
      });  
    
    }
    