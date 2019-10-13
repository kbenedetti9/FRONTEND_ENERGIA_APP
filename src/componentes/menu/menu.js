import React, { Component } from 'react';
import PerfectScrollabar from 'react-perfect-scrollbar';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

export class Menu extends Component {

    cambiarEstadoMenu = () => {
        if (this.props.className_icon === "mobile-menu") {
            this.props.accionarMenu("navbar-collapsed");
        } else {
            this.props.accionarMenu("");
        }
    }

    cambairEstadoDropdown = () => {

        if (this.props.estadoDropdown === "nav-item pcoded-hasmenu") {
            this.props.accionarDropdown("nav-item pcoded-hasmenu active pcoded-trigger");
        } else {
            this.props.accionarDropdown("nav-item pcoded-hasmenu");
        }
    }

    render() {

        const { className, accion, className_icon, admin, usuario } = this.props;
        const nuevoClassName = className + " " + accion;

        return (

            <nav className={nuevoClassName}>
                <div className="navbar-wrapper">
                    {/* Logo menu - Inicio */}
                    <div className="navbar-brand header-logo">
                        <a href="index.html" className="b-brand">
                            <div className="b-bg">
                                <i className="icon feather icon-paperclip"></i>
                            </div>
                            <span className="b-title">Energía App</span>
                        </a>
                        <a className={className_icon} id="mobile-collapse" onClick={this.cambiarEstadoMenu} href="#!"><span></span></a>
                    </div>
                    {/* Logo menu - Fin */}

                    {/* Lista de opciones del menu - Inicio */}
                    <div className="navbar-content datta-scroll">
                        <PerfectScrollabar>
                            {admin ?
                                <ul className="nav pcoded-inner-navbar">
                                    <li className="nav-item pcoded-menu-caption">
                                        <label>Hola Administrador!</label>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/administrar" className="nav-link" exact={true} target="">
                                            <span className="pcoded-micon">
                                                <i className="icon feather icon-home"></i>
                                            </span>
                                            <span className="pcoded-mtext">Administrar</span>
                                        </NavLink>
                                    </li>
                                </ul>
                                :
                                <ul className="nav pcoded-inner-navbar">
                                    {/* Item normal - inicio */}
                                    <li className="nav-item pcoded-menu-caption">
                                        <label>Hola {usuario.nombre + ' ' + usuario.apellidos}</label>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/App/consumoReal" className="nav-link" exact={true} target="">
                                            <span className="pcoded-micon">
                                                <i className="icon feather icon-home"></i>
                                            </span>
                                            <span className="pcoded-mtext">Mi consumo Real</span>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/App/historial" className="nav-link" exact={true} target="">
                                            <span className="pcoded-micon">
                                                <i className="icon feather icon-home"></i>
                                            </span>
                                            <span className="pcoded-mtext">Mi historial de consumo</span>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/App/ajustes" className="nav-link" exact={true} target="">
                                            <span className="pcoded-micon">
                                                <i className="icon feather icon-home"></i>
                                            </span>
                                            <span className="pcoded-mtext">Mis ajustes</span>
                                        </NavLink>
                                    </li>
                                </ul>
                            }
                        </PerfectScrollabar>
                    </div>
                    {/* Lista de opciones del menu - Fin */}

                </div>
            </nav>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        state: state.menu,
        className: state.menu.className_menu_defecto,
        accion: state.menu.className_menu_añadido,
        className_icon: state.menu.className_menu_icon,
        estadoDropdown: state.menu.className_dropdown
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        accionarMenu: (accion) => {
            dispatch({ type: "ACCIONAR_MENU_MENU", accion })
        },
        accionarDropdown: (action) => {
            dispatch({ type: "ACCIONAR_DROPDOWN", action })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
