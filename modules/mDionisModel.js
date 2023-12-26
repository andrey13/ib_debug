async function mDionisModel() {
    // очистка таймера -----------------------------------------------------------------
    if (g_timerId != 0) clearInterval(g_timerId)

    // определение ролей текущего пользователя -----------------------------------------
    const tex = isRole('tex')
    const mo  = isRole('mo')
    const su  = isRole('su')
    const vendor  = isRole('vendor')

    // список МТС -----------------------------------------------------------------------
    select_dionis_model(
        selectable = true, 
        mode = 'edit', 
        win_return = '', 
    )
}