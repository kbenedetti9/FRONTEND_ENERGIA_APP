import React, { Component } from 'react';
import { Card, Row, Col, Button, Table } from 'react-bootstrap';
import Api from '../../../api/Api';
import Cargando from '../../cargando/cargando';
import Chart from 'chart.js';
import Pdf from '../../pdf/PDFService';
import '../cliente/Historial.css';
let obj = [];
let grafica = null;
let mesSeleccionado = null;
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
        mesSeleccionado = null;
        grafica.destroy();
    }

    _graficar = (data, reporte) => {
        this.setState({ mostrarGrafica: true, mostratDatosReporte: reporte });
        var ctx = document.getElementById('myChart');
        grafica = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Madrugada',
                    data: data.consumoMadrugada,
                    backgroundColor: 'rgba(29, 233, 176, 0.2)',
                    borderColor: 'rgba(29, 233, 176, 1)',
                    borderWidth: 1
                }, {
                    label: 'Mañana',
                    data: data.consumoManana,
                    backgroundColor: 'rgba(163, 137, 212, 0.2)',
                    borderColor: 'rgba(163, 137, 212, 1)',
                    borderWidth: 1

                }, {
                    label: 'Tarde',
                    data: data.consumoTarde,
                    backgroundColor: 'rgba(29, 228, 233,  0.2)',
                    borderColor: 'rgba(29, 228, 233, 1)',
                    borderWidth: 1

                }, {
                    label: 'Noche',
                    data: data.consumoNoche,
                    backgroundColor: 'rgba(233, 29, 211 ,0.2)',
                    borderColor: 'rgba(233, 29, 211 , 1)',
                    borderWidth: 1

                }]
            },
            options: {
                maintainAspectRatio: false,
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
                },
                responsive: true
            }
        });
    }

    _obtenerHistorialMes = (evento, reporte, mes, objMes) => {
        evento.preventDefault();
        mesSeleccionado = objMes;
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
            if (+arrayFecha[0] === mes) {

                if (historial[i].consumoTarde !== undefined) {
                    for (var h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayconsumoTarde[h] = historial[i].consumoTarde;
                        }
                    }
                    data.consumoTarde = arrayconsumoTarde;
                } else {
                    data.consumoTarde = arrayconsumoTarde;
                }

                if (historial[i].consumoMañana !== undefined) {
                    for (h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayConsumoManana[h] = historial[i].consumoMañana;
                        }
                    }
                    data.consumoManana = arrayConsumoManana;
                } else {
                    data.consumoManana = arrayConsumoManana;
                }

                if (historial[i].consumoMadrugada !== undefined) {
                    for (h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayConsumoMadrugada[h] = historial[i].consumoMadrugada;
                        }
                    }
                    data.consumoMadrugada = arrayConsumoMadrugada;
                } else {
                    data.consumoMadrugada = arrayConsumoMadrugada;
                }

                if (historial[i].consumoNoche !== undefined) {
                    for (h = 0; h < labels.length; h++) {
                        if (labels[h] === diaConsumido) {
                            arrayconsumoNoche[h] = historial[i].consumoNoche;
                        }
                    }
                    data.consumoNoche = arrayconsumoNoche;
                } else {
                    data.consumoNoche = arrayconsumoNoche;
                }

            }
        }
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
        if (historial) {
            this._obtenerDatosTabla(historial);
        }
    }

    render() {
        const { datosTabla, arrayNMes, mostrarGrafica, mostratDatosReporte } = this.state;
        const { usuario } = this.props;

        if (datosTabla && datosTabla.length === 0) {
            return <Cargando />
        }

        if (datosTabla === null) {
            return <div>No hay historial</div>
        }

        return (

            <Card>
                <Card.Header id="historialTitulo" className="textoHistorial">

                    Mi historial
                          <i id="calendarIcono" className="feather icon-calendar ml-1" />

                </Card.Header>
                <Card.Body className="container">
                    {!mostrarGrafica ?
                        <Table responsive hover width="100%">
                            <thead id="encabezadoTabla" style={{ textAlign: 'center' }}>
                                <tr>
                                    <th scope="col" className="textoHistorial encabezado">Mes</th>
                                    <th scope="col" className="textoHistorial encabezado">Kwh</th>
                                    <th scope="col" className="textoHistorial encabezado">$</th>
                                    <th scope="col" className="textoHistorial encabezado">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datosTabla.map((mes, id) =>
                                    <tr key={id} id="contenidoTabla" style={{ textAlign: 'center' }} >
                                        <td className="textoHistorial">{arrayNMes[(+mes.mes) - 1]}</td>
                                        <td className="textoHistorial">{mes.consumoTotal}</td>
                                        <td className="textoHistorial">{mes.consumoCosto.toLocaleString('de-DE', { style: 'decimal' })}</td>
                                        <td>
                                            <Button size='sm' className="botonFondo shadow-1" onClick={(e) => this._obtenerHistorialMes(e, false, +mes.mes, mes)}>
                                                <i className="feather icon-eye" />
                                            </Button>
                                            <Button size='sm' className="botonFondo shadow-1 btnDescargar" onClick={(e) => this._obtenerHistorialMes(e, true, +mes.mes, mes)}>
                                                <i className="feather icon-file" />
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        : null}

                    <div className="grafica">
                        <div ref={bodyRef}>
                            {mostratDatosReporte ?
                                <div>
                                    <div style={{ marginBottom: '70px' }}>
                                        <Row>
                                            <Col >
                                                <div>Energia App </div>
                                            </Col>
                                            <Col className="ml-auto text-right">
                                                {new Date().toLocaleDateString()}
                                            </Col>
                                        </Row>
                                        <hr />
                                    </div>
                                    <div style={{ marginBottom: '50px' }}>
                                        Datos personales del usuario
                                                <hr />
                                        <div><strong>Nombre: </strong>{usuario.apellidos + " " + usuario.nombre}</div>
                                        <div><strong>Cedula: </strong>{usuario.cedula}</div>
                                        <div><strong>Correo: </strong>{usuario.correo}</div>
                                        <div><strong>Id del medidor: </strong>{usuario.id_medidor}</div>
                                    </div>
                                </div>

                                : null
                            }
                            <div className="chart-container" >
                                <canvas id="myChart"></canvas>
                            </div>
                            {mostratDatosReporte ?
                                <div style={{ marginTop: '50px', marginBottom: '50px' }}>
                                    Datos del mes
                                            <hr />
                                    <div><strong>Nombre: </strong>{arrayNMes[(+mesSeleccionado.mes) - 1]}</div>
                                    <div><strong>Consumo total: </strong>{mesSeleccionado.consumoTotal + 'kwh'}</div>
                                    <div><strong>Costo Total: </strong>{'$' + mesSeleccionado.consumoCosto.toLocaleString('de-DE', { style: 'decimal' })}</div>
                                </div>
                                : null
                            }
                        </div>

                        {mostrarGrafica ?
                            <Button size="sm" onClick={this._atras} className="botonFondo2 mt-3 shadow-2">
                                <i className="feather icon-arrow-left" />
                            </Button>
                            : null
                        }
                        {mostratDatosReporte ?
                            <Button size="sm" onClick={this._generarReporte} className="botonFondo2 mt-3 shadow-2 btnDescargar" >
                                <i className="feather icon-download" />
                            </Button>
                            : null
                        }
                    </div>

                </Card.Body>

            </Card>
        )
    }
}

export default Historial
