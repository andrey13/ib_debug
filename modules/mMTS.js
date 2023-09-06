async function mMTS() {
    // очистка таймера -----------------------------------------------------------------
    if (g_timerId != 0) clearInterval(g_timerId)
    const tex = isRole('tex')
    const mo  = isRole('mo')
    const su  = isRole('su')

    const id_otdel = tex ? g_user.id_otdel : 0
    const sklad = 0

    const tMTS = '<div id="selectMTSBody" style="display: inline-block; padding: 0; height: 100%; width: 100%; border: 1px solid black;"></div>'
    const appHeight = appBodyHeight()

    id2e('appBody').innerHTML = tMTS;
    id2e('appBody').style.height = appHeight;

    const mts = await selectMTS(
        sono = '6100', 
        id_otdel, 
        sklad, 
        selectable = 1, 
        mode = 'edit', 
        win_return = '', 
    )
}