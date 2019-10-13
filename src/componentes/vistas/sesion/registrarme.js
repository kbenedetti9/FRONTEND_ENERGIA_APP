import React, { Component } from 'react';
import { connect } from 'react-redux';

export class IniciarSesion extends Component {
    render() {
        console.log("render Registrarme")
        this.props.cambiarTitulo("Registrarme");

        return (
            <div>
                
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        cambiarTitulo: (titulo) => {
            dispatch({ type: "CAMBIAR_TITULO_APP", titulo })
        }
    }
}


export default  connect(null, mapDispatchToProps)(IniciarSesion);