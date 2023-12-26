// протоколирование работы программы- ---------------------------------------------------------
function log_reg(comment, ppp) {
    if (g_user.name == 'Крашеница Андрей Анатольевич') return

    let dt = moment().format('YYYY-MM-DD HH:mm:ss')

    //console.log("g_user.name=", g_user.name)

    runSQL_p(`INSERT INTO logs (ip_user, seans_datetime, comment, name, account, pppp) 
              VALUES ('${g_user.ip}', 
                      '${dt}', 
                      '${comment}',
                      '${g_user.name}',
                      '${g_user.usr}',
                      '')`)
}

//=======================================================================================
function clog(text) {
    console.log(text)
}
