//=================================================================================================
  function doSSO() {
    requestCsrf('https://10.252.42.143/sso');
  }

//=================================================================================================
  /**
   * Запрашивает токен csrf и отправляет его вместе с данными для авторизации.
   * @param {String} [url] Адрес запроса.
   */
  function requestCsrf(url) {
    var httpRequest = createHttpRequest();
    url = url || '';

    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === httpRequest.DONE) {
        if (httpRequest.status === 200) {
          var csrf = JSON.parse(httpRequest.responseText);
          var csrfToken = csrf._csrf;

          doLogin(url, csrfToken);
        } else {
          var error;
          if (httpRequest.status === 0) {
              error = "Сервис недоступен";
          } else {
            try {
              var result = JSON.parse(httpRequest.responseText);
              error = result.message;
            } catch (err) {
              error = err.toString();
            }
          }

          showError(error);
        }
      }
    };

    httpRequest.open('GET', 'https://10.252.42.143/csrfToken?' + (new Date()).getTime(), true);
    httpRequest.send();
  }


//=================================================================================================
  /**
   * Вход по логину / паролю
   * @param {String} url адрес входа
   * @param {String} csrf Токен.
   */
  function doLogin(url, csrf) {
    var xmlhttp = createHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === xmlhttp.DONE) {
        if (xmlhttp.status === 200) {
          var hash = window.location.hash ? window.location.hash : '';
          window.location = '/' + hash;
        } else {
          var error;
          if (xmlhttp.status === 0) {
              error = "Сервис недоступен";
          } else {
            try {
              var result = JSON.parse(xmlhttp.responseText);
              error = result.message;
            } catch (err) {
              error = err.toString();
            }
          }

          showError(error);
        }
      }
    };

    xmlhttp.open("POST", url, true);

    var params = "username=" + encodeURIComponent(usernameField.value) +
            "&password=" + encodeURIComponent(passwordField.value) +
            "&tz=" + encodeURIComponent( getTz() ) +
            "&_csrf=" + csrf;

    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    console.log("param = " + params)
    xmlhttp.send(params);
  }

  function doLogin() {
    if (moment && moment.tz) {
      return moment.tz.guess();
    }

    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

//=================================================================================================
  /**
   * Создает и возвращает объект запроса.
   * @Return {XMLHttpRequest}
   */
  function createHttpRequest() {
    var httpRequest;

    if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
    } else {
      httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
    }

    return httpRequest;
  }


//=================================================================================================
  /**
   * Показывает ошибку.
   * @param {String} error Текст ошибки.
   */
  function showError(error) {
    submit.className = 'btn btn-default';
    submit.disabled = false;
    loader.className = 'hide';

    alert.innerHTML = error;
    alert.className = 'alert alert-danger';
  }

//=================================================================================================
