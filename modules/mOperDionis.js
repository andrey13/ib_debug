async function mOperDionis() {
    // очистка таймера -----------------------------------------------------------------
    if (g_timerId != 0) clearInterval(g_timerId)

    // определение ролей текущего пользователя -----------------------------------------
    const tex = isRole('tex')
    const mo  = isRole('mo')
    const su  = isRole('su')

    const id_otdel = tex ? g_user.id_otdel : 0
    const sklad = 0

    // список МТС -----------------------------------------------------------------------
    select_dionis_oper(
        '6100', 
        id_otdel, 
        sklad, 
        true,  // selectable
        'edit', 
        '',  // win_return
    )
}

// export {
//     mOperDionis
// }