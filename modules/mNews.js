function mNews() {    
    $("#appBody").html('<div id="tabNews"></div>');
    createTabulatorNews("tabNews", appBodyHeight());
}

//=======================================================================================
// табулятор новостей
//=======================================================================================

function createTabulatorNews(id_div, appH) {
    let allow = getAllows();
    let ed    = (allow.E == 1) ? "input" : "";
    let ed_date = (allow.E == 1) ? datetime_Editor : "";
    let bADD  = (allow.C == 1) ? "<button id='addNews' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Добавить</button>&nbsp;" : "";
    let bEDI  = (allow.E == 1) ? "<button id='ediNews' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Изменить</button>&nbsp;" : "";
    let bDEL  = (allow.D == 1) ? "<button id='delNews' class='w3-button w3-tiny w3-padding-small w3-white w3-border w3-hover-teal'>Удалить</button>&nbsp;" : "";
    let ms    =  bADD + bEDI + bDEL  ;

    if (allow.E == 1) {
        cols = [
            {
                title: "дата", field: "dt", width: 200,  topCalc: "count",
                editor: ed_date,
                //sorter: "date",
                formatter: "datetime", formatterParams: {
                    inputFormat: "YYYY-MM-DD HH:mm:ss",
                    outputFormat: "DD.MM.YYYY HH:mm:ss",
                }
            },
            { title: "новость", field: "text",  formatter:"textarea",  editor: "textarea", },
        ];
    } else {
        cols = [
            { title: "дата", field: "dt", width: 200,  topCalc: "count", },
            { title: "новость", field: "text",  formatter:"textarea", },
        ];
    }

    tableNews = new Tabulator('#'+id_div, {
        ajaxURL: "myphp/loadData.php",
        ajaxParams: { t: "news", o: "dt DESC" },
        ajaxConfig: "GET",
        ajaxContentType: "json",
        height: appH,
        layout: "fitColumns",
        tooltipsHeader: true,
        printAsHtml: true,
        printHeader: "<h1>Новости сервиса ИБ<h1>",
        printFooter: "",
        rowContextMenu: rowMenu(),
        headerFilterPlaceholder: "",
        headerVisible: false,
        headerSort: false,
        columns: cols,

        rowFormatter: function (row) { if (ms=='') return; rowFormatterCursor(row, g_tableNews);  },
        renderStarted: function ()   { if (ms=='') return; renderStartedCursor(tableNews, g_tableNews);  },
        rowClick: function (e, row)  { if (ms=='') return; rowClickCursor(row, g_tableNews) },
        cellEdited: function (cell) {
            let o = cell.getRow().getData();
            runSQL_p(`UPDATE news SET dt="${o.dt}", text="${o.text}" WHERE id=${o.id}`);
        },
        footerElement: ms,
    });

    // кнопка добавления новой новости -------------------------------------------------
    $("#addNews").click(function () {
        let today = moment().format('YYYY-MM-DDTHH:mm:ss');
        runSQL_p(`INSERT INTO news (dt) VALUES ('${today}')`)
            .then((id) => {
                tableNews.addData([{
                    id: id,
                    dt: today
                }], true);
                let row = tableNews.searchRows('id', '=', id)[0];
                rowClickCursor(row, g_tableNews);
                tableNews.scrollToRow(id, "top", false);
            });
    });

    $("#delNews").click(function () {
        dialogYESNO("Новость:" + "<br><b>«" + g_tableNews.row_current.getData().text + "»<br><br>будет удалена, вы уверены?<br>")
            .then(() => {
                return runSQL_p(`DELETE FROM news WHERE id=${g_tableNews.id_current}`);
            })
            .then(() => {
                console.log('replaceData');
                g_tableNews.id_current = 0;
                tableNews.replaceData("myphp/loadData.php?t=news&o=dt DESC");
                g_tableNews.id_current = 0;
            });            
    });

    
    tableNews.setSort("dt", "desc");
}

