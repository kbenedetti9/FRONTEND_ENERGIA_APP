import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';

export class Navbar extends Component {

    state = {
        className: "mobile-menu"
    }

    mostrarMenu = () => {
        if (this.state.className === "mobile-menu") {
            this.props.accionarMenu("mob-open");
        }
    }

    render() {

        const { className_icon, correo, admin, nombre } = this.props;
        return (
            <header className="navbar pcoded-header navbar-expand-lg header-default" onClick={this.props.ocultarMenu} >
                <div className="m-header">
                    <Link to="#" className={className_icon} id="mobile-collapse1" onClick={this.mostrarMenu}><span /></Link>
                    <Link to="#" className="b-brand">
                        <div className="b-bg">
                            <i className="icon fa fa-lightbulb-o" />
                        </div>
                        <span className="b-title">Menu</span>
                    </Link>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ml-auto">
                        <li>
                            <Dropdown className="drp-user">
                                <Dropdown.Toggle variant='link' id='dropdown-basic'>
                                    <i className='icon feather icon-settings' />
                                </Dropdown.Toggle>
                                <Dropdown.Menu alignRight className='profile-notification'>
                                    <div className="pro-head">
                                        <span>{nombre}</span>
                                        <Link to='#' className='dud-logout' tittle='Salir' onClick={()=> this.props.cerrarSesion(correo, admin)}>
                                            <i className='feather icon-log-out' />
                                        </Link>
                                    </div>
                                    <ul className="pro-body">
                                        <li><Link to="/App/ajustes" className='dropdown-item' ><i className='feather icon-settings' /> Ajustes </Link></li>
                                    </ul>
                                </Dropdown.Menu>
                            </Dropdown>
                        </li>
                    </ul>
                </div>
            </header>


        )
    }
}

const mapStateToProps = (state) => {
    return {
        className_icon: state.menu.className_menu_icon
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        accionarMenu: (accion) => {
            dispatch({ type: "ACCIONAR_MENU_NAVBAR", accion })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
