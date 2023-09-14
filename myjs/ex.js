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
            (width = "90%"),
            (marginLeft = "5%"),
            (marginTop = "5%"),
            win_return,
            esc_mts_history
        )

        id_2_set_focus(win_current)
    }
