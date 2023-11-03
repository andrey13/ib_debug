//=======================================================================================
// возвращает куки с указанным name,
// или undefined, если ничего не найдено

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  
//=======================================================================================
// Пример использования:
// setCookie('user', 'John', {secure: true, 'max-age': 3600})    1 час
// setCookie('user', 'John', {secure: true, 'max-age': 2592000}) 1 месяц

function setCookie(name, value, options = {}) {

    options = {
      path: '/',
      // при необходимости добавьте другие значения по умолчанию
    };
  
    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }
  
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
      }
    }
    console.log('updatedCookie = ', updatedCookie)
    document.cookie = updatedCookie;
  }
  

//=======================================================================================
function deleteCookie(name) {
    setCookie(name, "", {
      'max-age': -1
    })
  }

//=======================================================================================
function randomStr(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }

//=======================================================================================
function nn(n) {
    return !!!n ? 0 : n
}

function ns(s) {
    return !!!s ? '' : s
}

//=======================================================================================
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

//=======================================================================================
function randomColor(brightness) {
    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | ((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length == 1) ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}



// высота экрана без заголовка, меню и футера -------------------------------------------
function appBodyHeight() {
    return (
        window.innerHeight -
        id2e('appHeader').offsetHeight -
        id2e('appMenu').offsetHeight -
        id2e('appFooter').offsetHeight
    );
}

// ширина основного экрана приложения ---------------------------------------------------
function appBodyWidth() {
    return (
        window.innerWidth
    );
}

//=======================================================================================
function showHelp(text) {
    //$("#help").html(text);
    $("#help").show();
}

//=======================================================================================
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

//=======================================================================================
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

//=======================================================================================
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

//=======================================================================================
function id2e(id) {
    return document.getElementById(id);
}