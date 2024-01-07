    //-----------------------------------------------------------------------------------
    function show_mts_history(d, win_return = null) {

        const win_current = "historyMTS" ///////////////////////////////////////////
        const header = ''
        const body = ''
        const foot = ``

        const esc_mts_history = () => { 
            console.log("esc_callback") 
            // vapp.unmount()
        }

        newModalWindow(
            win_current,
            header,
            body,
            foot,
            "90%",          // width
            "5%",           // marginLeft
            "5%",           //marginTop
            win_return,     // win_return
            esc_mts_history // esc_callback
        )

        id_2_set_focus(win_current)
    }
