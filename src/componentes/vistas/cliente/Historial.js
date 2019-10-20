import React, { Component } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Api from '../../../api/Api';
import Cargando from '../../cargando/cargando';
import Chart from 'chart.js';
import Pdf from '../../pdf/PDFService';

let obj = [];
let grafica = null;
const bodyRef = React.createRef();

class Historial extends Component {

    state = {
        datosTabla: [],
        arrayNMes: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        historial: [],
        mostrarGrafica: false,
        mostratDatosReporte: false
    }

    _generarReporte = () => {
        Pdf.createPdf(bodyRef.current);
    }

    _atras = () => {
        this.setState({ mostrarGrafica: false, mostratDatosReporte: false });
        console.log(grafica)
        grafica.destroy();
    }

    _graficar = (data, reporte) => {
        this.setState({ mostrarGrafica: true, mostratDatosReporte: reporte });
        console.log(this.state.mostrarGrafica)
        var ctx = document.getElementById('myChart');
        grafica = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Madrugada',
                    data: data.consumoMadrugada,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }, {
                    label: 'Mañana',
                    data: data.consumoManana,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1

                }, {
                    label: 'Tarde',
                    data: data.consumoTarde,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1

                }, {
                    label: 'Noche',
                    data: data.consumoNoche,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1

                }]
            },
            options: {
                scales: {
                    yAxes: [{

                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    xAxes: [{

                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    _obtenerHistorialMes = (evento, reporte) => {
        evento.preventDefault();
        const mes = evento.target.value;
        const { historial } = this.state;

        //Objeto a devolver
        let data = {
            consumoMadrugada: [],
            consumoManana: [],
            consumoTarde: [],
            consumoNoche: [],
            labels: []
        }

        let arrayConsumoManana = [];
        let arrayConsumoMadrugada = [];
        let arrayconsumoTarde = [];
        let arrayconsumoNoche = [];

        let labels = [];

        //Llenar arrays
        for (var i = 0; i < 31; i++) {
            arrayConsumoManana.push(0);
            arrayConsumoMadrugada.push(0);
            arrayconsumoTarde.push(0);
            arrayconsumoNoche.push(0);
        }
        for (var t = 1; t <= 31; t++) {
            labels.push(t);
        }

        data.labels = labels;

        for (i = 0; i < historial.length; i++) {
            var fecha = historial[i].fecha;
            const arrayFecha = fecha.split("/");
            let diaConsumido = +arrayFecha[1];
            console.log(mes);
            if (arrayFecha[0] === mes) {

                console.log(mes);

                if (historial[i].consumoTarde !== undefined) {
                    console.log("tiene consumoTarde");
                    for (var h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayconsumoTarde[h] = historial[i].consumoTarde;
                        }
                    }
                    data.consumoTarde = arrayconsumoTarde;
                } else {
                    console.log("No tiene consumoTarde");
                    data.consumoTarde = arrayconsumoTarde;
                }

                if (historial[i].consumoMañana !== undefined) {
                    console.log("tiene consumoMañana");
                    for (h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayConsumoManana[h] = historial[i].consumoMañana;
                        }
                    }
                    data.consumoManana = arrayConsumoManana;
                } else {
                    console.log("No tiene consumoMañana");
                    data.consumoManana = arrayConsumoManana;
                }

                if (historial[i].consumoMadrugada !== undefined) {
                    console.log("tiene consumoMadrugada");
                    for (h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayConsumoMadrugada[h] = historial[i].consumoMadrugada;
                        }
                    }
                    data.consumoMadrugada = arrayConsumoMadrugada;
                } else {
                    console.log("No tiene consumoMadrugada");
                    data.consumoMadrugada = arrayConsumoMadrugada;
                }

                if (historial[i].consumoNoche !== undefined) {
                    console.log("tiene consumoNoche");
                    for (h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayconsumoNoche[h] = historial[i].consumoNoche;
                        }
                    }
                    data.consumoNoche = arrayconsumoNoche;
                } else {
                    console.log("No tiene consumoNoche");
                    data.consumoNoche = arrayconsumoNoche;
                }

            }
        }
        console.log(data);

        this._graficar(data, reporte);
    }

    _obtenerDatosTabla = (historial) => {
        let mes = 0;
        let objMes = [];
        for (let index = 0; index < historial.length; index++) {
            const element = historial[index];
            const arrayFecha = element.fecha.split("/");
            if (mes.toString() !== arrayFecha[0]) {
                objMes.push(arrayFecha[0]);
                mes = arrayFecha[0];
            }
        }
        obj = [];
        for (let index = 0; index < objMes.length; index++) {
            let consumoTotal = 0;
            let costoU = 0;
            for (let index2 = 0; index2 < historial.length; index2++) {
                const element = historial[index2];
                const arrayFecha = element.fecha.split("/");
                if (objMes[index] === arrayFecha[0]) {
                    costoU = element.costoUnitarioKwh;
                    consumoTotal = consumoTotal + element.totalConsumoDia;
                }
            }
            obj.push({ mes: objMes[index], consumoTotal: consumoTotal, consumoCosto: (consumoTotal * costoU) });
            console.log(obj)
        }

        if (obj.length > 0) {
            this.setState({ datosTabla: obj, historial });
        } else {
            this.setState({ datosTabla: null });
        }
    }

    componentDidMount = async () => {
        const { usuario } = this.props;
        const historial = await Api.consultarHistorial(usuario.correo);
        console.log(historial);
        if (historial) {
            this._obtenerDatosTabla(historial);
        }
    }

    render() {
        const { datosTabla, arrayNMes, mostrarGrafica, mostratDatosReporte } = this.state;

        if (datosTabla.length === 0) {
            return <Cargando />
        }

        if (datosTabla === null) {
            return <div>No hay historial</div>
        }

        return (

            <Row>
                <Col lg={10}>
                    <Card>
                        <Card.Header>
                            <Card.Title>
                                <h5>Mi Historial</h5>
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {!mostrarGrafica ?
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Mes</th>
                                            <th scope="col">Kwh</th>
                                            <th scope="col">$</th>
                                            <th scope="col">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datosTabla.map((mes, id) =>
                                            <tr key={id}>
                                                <td>{arrayNMes[(+mes.mes) - 1]}</td>
                                                <td>{mes.consumoTotal}</td>
                                                <td>{mes.consumoCosto}</td>
                                                <td style={{ width: '10px' }} >
                                                    <Button size='sm' value={+mes.mes} onClick={(e) => this._obtenerHistorialMes(e, false)}> mostrar </Button>
                                                    <Button size='sm' value={+mes.mes} onClick={(e) => this._obtenerHistorialMes(e, true)}> reporte </Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                : null}

                            <div className="grafica">
                                <div ref={bodyRef}>
                                    {mostratDatosReporte ?
                                        <div>
                                            datos de reporte
                                        </div>
                                        : null
                                    }
                                    <canvas id="myChart"></canvas>
                                </div>

                                {mostrarGrafica ?
                                    <Button size="sm" onClick={this._atras} > Atras </Button>
                                    : null
                                }
                                {mostratDatosReporte ?
                                    <Button size="sm" onClick={this._generarReporte} > Descargar </Button>
                                    : null
                                }
                            </div>

                        </Card.Body>

                    </Card>
                </Col>
                <Col lg={2}>
                </Col>
            </Row>

        )
    }
}

export default Historial
