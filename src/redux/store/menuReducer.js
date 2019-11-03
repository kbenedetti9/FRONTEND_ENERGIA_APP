const initState = {
    className_menu_defecto: "pcoded-navbar menu-light navbar-default brand-default drp-icon-style1 menu-item-icon-style1 active-default title-default",
    className_menu_añadido: "",
    className_menu_icon: "mobile-menu",
    className_dropdown: "nav-item pcoded-hasmenu"
}

const menuReducer = (state = initState, action) => {
    switch (action.type) {
        case 'ACCIONAR_MENU_NAVBAR':
            return {
                ...state,
                className_menu_añadido: action.accion,
                className_menu_icon: "mobile-menu on"
            }

        case 'ACCIONAR_MENU_MENU':
            if (action.accion === "") {
                return {
                    ...state,
                    className_menu_añadido: action.accion,
                    className_menu_icon: "mobile-menu"
                }
            } else {
                return {
                    ...state,
                    className_menu_añadido: action.accion,
                    className_menu_icon: "mobile-menu on"
                }
            }

        case 'ACCIONAR_MENU_APP':
            return {
                ...state,
                className_menu_añadido: action.accion,
                className_menu_icon: "mobile-menu"
            }

        case 'ACCIONAR_DROPDOWN':
            return {
                ...state,
                className_dropdown: action.action
            }

        case 'REINICIAR_ESTADOS':
            return {
                className_menu_defecto: "pcoded-navbar menu-light navbar-default brand-default drp-icon-style1 menu-item-icon-style1 active-default title-default",
                className_menu_añadido: "",
                className_menu_icon: "mobile-menu",
                className_dropdown: "nav-item pcoded-hasmenu"
            };

        default:
            return state;
    }
}

export default menuReducer;