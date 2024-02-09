import { getAllows, isRole } from '../myjs/start.js'
import { select_dionis_model } from '../myjs/selectDionisModel.js'

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
        true,    // selectable
        'edit',  // mode
        '',      // win_return
    )
}

export {
    mDionisModel
}