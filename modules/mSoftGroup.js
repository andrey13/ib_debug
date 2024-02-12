//console.log("load mSoftGroup");
let msgFooterGroups = "<button  id='b_OTSS'>отчет ОТСС</button>  <button id='baddGroup'>Добавить</button>";

function mSoftGroup(){
    console.log("run mSoftGroup");
    let appHeight = appBodyHeight();
    $("#appBody").html(
        '<div id="tabGS"><div id="tabGS1"></div><div id="tabGS2"></div><div id="tabGS3"></div></div>'
    );
    $("#appBody").height(appHeight);
    createTabulatorGroups("tabGS1", appHeight, msgFooterGroups);
    createTabulatorSoft("tabGS3", appHeight, "");
}

//=======================================================================================
//  табулятор групп ПО ==================================================================
//=======================================================================================

function createTabulatorGroups(id_div, appH, msgF) {
    let id_prog = 0;
    let ed = (c_user_mode=="W" || c_user_mode=="A") ? "input" : "";
    let ms = (c_user_mode=="W" || c_user_mode=="A") ? msgF : "";
    tableGroups = new Tabulator('#'+id_div, {
      ajaxURL:"myphp/loadDataGroups.php",
      ajaxConfig:"GET",
      ajaxContentType:"json",
      height:appH,    
      layout:"fitColumns",
      tooltipsHeader:true,
      printAsHtml:true,
      printHeader:"<h1>группы ПО<h1>",
      printFooter:"",
      rowContextMenu: rowMenu(),
      headerFilterPlaceholder:"",
  
      rowFormatter:function(row){      
        g_row_goups_bg = row.getElement().style.backgroundColor;
        if (row.getData().id == g_id_prog){   
            row.getElement().style.backgroundColor = "#949494";
        }
        //if (row.getData().id != g_id_prog){   row.getElement().style.backgroundColor = "#ffffff";}
      },
  
      columns:[ 
        {title:"id",           field:"id",                  headerFilter:true, widthGrow:1, print:false},
        {title:"группа ПО",    field:"name",    editor:ed,  headerFilter:true, widthGrow:6, topCalc:"count",},
        {title:"лицензия",     field:"license", editor:ed,  headerFilter:true, widthGrow:6},
        {title:"ОТСС",         field:"otss",    editor:ed,  headerFilter:true, widthGrow:1},
      ],
      
      renderStarted:function(){
        if ((tableGroups.rowManager.activeRowsCount>0) && (g_id_prog==0)) {
            g_id_prog       = tableGroups.rowManager.activeRows[0].data.id;
            g_name_prog     = tableGroups.rowManager.activeRows[0].data.name;
            //g_row_goups_goups           = tableGroups.getRow(1);
        }
        g_row_goups = tableGroups.searchRows("id", "=", g_id_prog)[0];
        
        createTabulatorGS("tabGS2", appH, "", g_name_prog, g_id_prog);
      },
  
      renderComplete:function(){
        tableGroups.scrollToRow(g_id_prog, "center", false);
      },
      
      cellEdited:function(cell){
        g_id_prog       = cell.getRow().getData().id;
        g_name_prog     = cell.getRow().getData().name;
        updateREC(cell.getRow().getData(),"myphp/updateGroups.php");
      },
  
      cellClick:function(e, cell) {
        let v_fieldName = cell.getField();
        if (v_fieldName!="id") return
        g_id_prog       = cell.getRow().getData().id;
        g_name_prog     = cell.getRow().getData().name;
  
        g_row_goups.getElement().style.backgroundColor = g_row_goups_bg;
        g_row_goups.reformat();
        cell.getRow().reformat();
        g_row_goups=cell.getRow();
        console.log("g_id_prog="+g_id_prog);
  
        createTabulatorGS("tabGS2",appH,"",g_name_prog,g_id_prog);
        //tableGS.setData('myphp/loadDataGS.php?p=14');
        //tableGS.redraw();
      },              
  
      footerElement:ms,
    });
    
    button_init("#b_OTSS");
    button_init("#baddGroup");
  
    // кнопка формирования отчета ОТСС---
    $("#b_OTSS").click(function() { 
      document.getElementById("tabModal").style="";
      document.getElementById("tabModal").className="tabulator";
      modal.style.display = "block";                  
      let id_div = "#tabModal";
      let appHeight   = $(".modal-content").height() - $(".modal-header").height();
      createTabulatorOTSS(id_div,appHeight,g_user.sono);
    });
  
  
    // кнопка добавление новой группы ПО---
    $("#baddGroup").click( function () { 
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {        
            //tableGroups.replaceData("myphp/loadDataGroups.php");
            let id_prog = this.responseText
            console.log("id_prog=",id_prog)
            g_id_prog = id_prog
            g_row_goups.getElement().style.backgroundColor = g_row_goups_bg;
            g_row_goups.reformat()
            g_name_prog = ""
            createTabulatorGS("tabGS2",appH,"",g_name_prog,g_id_prog);
            tableGroups.addRow([{id:id_prog}], true)
            g_row_goups = tableGroups.getRow(id_prog)
            tableGroups.scrollToRow(g_id_prog, "center", false);
        }  
      }
      xhr.open("GET", "myphp/addRec.php?t=prog")
      xhr.send()
      })
  }
  
  
  // добавление новой группы ПО -----------------------------------------------------------
  function addGroup () {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {        
          //tableGroups.replaceData("myphp/loadDataGroups.php");
          let id_prog = this.responseText
          console.log("id_prog=",id_prog)
          g_id_prog = id_prog;
          g_name_prog = "";
          createTabulatorGS("#tabGS2",appH,"",g_name_prog,g_id_prog);
          tableGroups.addData([{id:id_prog}], true)
      }  
    }
    xhr.open("GET", "myphp/addRec.php?t=prog")
    xhr.send()
  }
  
  //=======================================================================================
//  табулятор членов группы ПО ==================================================================
//=======================================================================================

function createTabulatorGS(id_div, appH, msgF, name_prog, id_prog) {
    let ed = (c_user_mode=="W" || c_user_mode=="A") ? "input" : "";
    let ms = (c_user_mode=="W" || c_user_mode=="A") ? msgF : "";
    tableGS = new Tabulator('#'+id_div, {
      ajaxURL:"myphp/loadDataGS.php",
      ajaxParams:{p:id_prog},
      ajaxConfig:"GET",
      ajaxContentType:"json",
      height:appH,    
      layout:"fitColumns",
      tooltipsHeader:true,
      printAsHtml:true,
      printHeader:"<h1>члены группы"+name_prog+"<h1>",
      printFooter:"",
      rowContextMenu: rowMenu(),
      headerFilterPlaceholder:"",
  
      rowFormatter:function(row){
        if(row.getData().id_status == 1){row.getElement().style.backgroundColor = "#949494";}
        if(row.getData().id_status == 2){row.getElement().style.backgroundColor = "#ffffff";}
        if(row.getData().id_status == 3){row.getElement().style.backgroundColor = "#ff7575";}
        if(row.getData().id_status == 4){row.getElement().style.backgroundColor = "#00DD00";}
      },
  
      columns:[ 
        //{title:"id",           field:"id",        headerFilter:true, widthGrow:1, print:false},
        //{title:"id_prog",      field:"id_prog",   headerFilter:true, widthGrow:1, print:false},
        //{title:"id_status",    field:"id_status", headerFilter:true, widthGrow:1, print:false},
        {title:"члены группы ПО", field:"name",   headerFilter:true, widthGrow:6},
      ],
      //cellEdited:function(cell){updateREC(cell.getRow().getData(),"myphp/updateGroups.php");},
  
  
      cellDblClick:function(e, cell) {
        if (b0_id=="b9" && c_user_mode=="W") {
            clickGS(cell,appH)
        }      
      },
  
      cellClick:function(e, cell) {
        if (b0_id=="b9" && c_user_mode=="A") {
            clickGS(cell,appH)
        }      
      },
  
      //footerElement:ms,
    });
    
  }
  
  
  function clickGS(cell,appH) {
    let id_soft     = cell.getRow().getData().id;
    let id_prog     = cell.getRow().getData().id_prog;
    let idstatus    = cell.getRow().getData().id_status;
    let name_soft   = cell.getRow().getData().name;
    delSoft4Group(id_soft,g_id_prog,name_soft);
  
    tableGS.deleteRow(id_soft);
    tableSoft.addData([{id:id_soft, id_prog:0, pname:name_soft, idstatus:idstatus}], true);
  
    //createTabulatorGS("tabGS2",appH,"",g_name_prog,g_id_prog);
    //createTabulatorSoft("tabGS3",appH,"");
  }
  
  
  
  // удаление ПО из группы ----------------------------------------------------------------
  function delSoft4Group (id_soft,id_prog,name_soft) {
    let xhttp;  
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          console.log("delSoft4Group");
          console.log(this.responseText);
          //tableGroups.setData();
          //tableGroups.redraw();
      }
    };  
    xhttp.open("GET", "myphp/delSoft4Group.php?id_soft="+id_soft+"&id_prog="+id_prog+"&name_soft="+name_soft, true);  
    xhttp.send();
  }
  