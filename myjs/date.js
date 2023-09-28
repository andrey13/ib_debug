//=======================================================================================
function date2date(date) {
    return (!date || date == '0000-00-00') ? '' : moment(date, "YYYY-MM-DD").format("DD.MM.YYYY");
}

//=======================================================================================
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

//=======================================================================================
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

