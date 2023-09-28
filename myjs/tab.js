//======================================================================================= 
function renderStartedCursor(tabulator, table) {
    if ((tabulator.rowManager.activeRowsCount > 0) && (table.id_current == 0)) {
        table.id_current = tabulator.rowManager.activeRows[0].data.id;
    }
    table.row_current = tabulator.searchRows("id", "=", table.id_current)[0];
}

//======================================================================================= 
function rowFormatterCursor(row, table) {
    // сохранение цвета фона и =рифта текущей записи---------------------------------
    table.bg_current = row.getElement().style.backgroundColor;

    if (row.getData().id == table.id_current) {
        // изменение цвета фона и =рифта текущей записи----------------------------------
        row.getElement().style.backgroundColor = "#008080";  // w3-teal
        row.getElement().style.color = "#FFFFFF";  // 
    } else {
        // изменение цвета фона и =рифта остальных записей-------------------------------
        //row.getElement().style.backgroundColor = '';
        row.getElement().style.color = "#000000";
    }
}

//======================================================================================= 
function rowClickCursor(row, table) {
    if (row.getData().id == table.id_current) {
        //console.log("rowClickCursor - row.id=id_current"); 
        return false;
    }

    // установить указатель на новую строку -----------------------------------------
    table.id_current = row.getData().id;

    if (table.row_current) {
        // вернуть цвет фона и текста быв=ей текущей строке -----------------------------
        table.row_current.getElement().style.backgroundColor = table.bg_current;
        //table.row_current.getElement().style.backgroundColor = '';
        table.row_current.getElement().style.color = "#000000";
        // переформатировать быв=ую текущей строку --------------------------------------
        table.row_current.reformat();
        // назначить новую текущую строку -----------------------------------------------
    }
    table.row_current = row;
    // переформатировать новую текущую строку ---------------------------------------
    table.row_current.reformat();

    return true;
}

//======================================================================================= 
function cellClickCursor(cell, table) {
    let v_fieldName = cell.getField();
    //if (v_fieldName != "id") return;

    // вернуть цвет фона и текста быв=ей текущей строке -----------------------------
    table.row_current.getElement().style.backgroundColor = table.bg_current;
    table.row_current.getElement().style.color = "#010101";

    // установить указатель на новую строку -----------------------------------------
    table.id_current = cell.getRow().getData().id;

    // переформатировать быв=ую текущей строку --------------------------------------
    table.row_current.reformat();

    // назначить новую текущую строку -----------------------------------------------
    table.row_current = cell.getRow();

    // переформатировать новую текущую строку ---------------------------------------
    table.row_current.reformat();
}

// контекстное меню по правой кнопке мы=и для любой таблицы--------------------------------
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