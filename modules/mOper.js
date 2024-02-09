import { getAllows, isRole } from '../myjs/start.js'
import { select_oper } from '../myjs/selectOper.js'

async function mOper() {
    // очистка таймера -----------------------------------------------------------------
    if (g_timerId != 0) clearInterval(g_timerId)

    // определение ролей текущего пользователя -----------------------------------------
    const tex = isRole('tex')
    const mo  = isRole('mo')
    const su  = isRole('su')

    const id_otdel = tex ? g_user.id_otdel : 0
    const sklad = 0

    // список МТС -----------------------------------------------------------------------
    select_oper(
        '6100', 
        id_otdel, 
        sklad, 
        true, 
        'edit', 
        '',  // win_return
    )
}

export {
    mOper
}