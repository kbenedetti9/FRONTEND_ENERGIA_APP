import React, { Component } from 'react';
//Redux
import { connect } from 'react-redux';

class consumoReal extends Component {


    render() {

        const { consumoMes } = this.props;

        return (
            <div>
                Mi consumo actual {consumoMes} Kwh
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      consumoMes: state.consumo.consumoMes
    }
  }

export default connect(mapStateToProps)(consumoReal);
