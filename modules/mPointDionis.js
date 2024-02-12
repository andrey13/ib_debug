async function mPointDionis() {
    // очистка таймера -----------------------------------------------------------------
    if (g_timerId != 0) clearInterval(g_timerId)

    // определение ролей текущего пользователя -----------------------------------------
    const tex = isRole('tex')
    const mo  = isRole('mo')
    const su  = isRole('su')
    const dionis  = isRole('dionis')

    const id_otdel = tex ? g_user.id_otdel : 0
    const sklad = 0
    const id_type_oper = 0

    // список подключений Dionis -----------------------------------------------------------------------
    select_point_dionis(
        selectable = true, 
        mode = 'edit', 
        win_return = '', 
    )
}