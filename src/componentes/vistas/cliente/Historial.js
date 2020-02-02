import React, { Component } from 'react';
import { Card, Row, Col, Button, Table } from 'react-bootstrap';
import { _sumarDiasFecha, _castearFechaServerToFront, _castearFechaFrontToServer } from '../functions';
import HistorialDia from '../../VentanaModal/HistorialDia';
import Api from '../../../api/Api';
import Cargando from '../../cargando/cargando';
import Chart from 'chart.js';
import Pdf from '../../pdf/PDFService';
import Excel from '../../Excel/Excel';
import '../cliente/Historial.css';


let obj = [];
let grafica = null;
let mesSeleccionado = null;
const bodyRef = React.createRef();

class Historial extends Component {

    state = {
        datosTabla: [],
        arrayNMes: ['Enero - Febrero', 'Febrero - Marzo', 'Marzo - Abril', 'Abril - Mayo', 'Mayo - Junio', 'Junio - Julio', 'Julio - Agosto', 'Agosto - Septiembe', 'Septiembre - Octubre', 'Octubre - Noviembre', 'Noviembre - Diciembre', 'Diciembre - Enero'],
        historial: [],
        mostrarGrafica: false,
        mostratDatosReporte: false,
        dataGrafica: null,
        historialDiaFecha: null,
        historialDiaEstado: false
    }

    _obtenerNombrePeriodo = (mes, diaIni, diaFin) => {
        let arrayNMes = [diaIni + ' Enero - ' + diaFin + ' Febrero', diaIni + ' Febrero - ' + diaFin + ' Marzo', diaIni + ' Marzo - ' + diaFin + ' Abril', diaIni + ' Abril - ' + diaFin + ' Mayo', diaIni + ' Mayo - ' + diaFin + ' Junio', diaIni + ' Junio - ' + diaFin + ' Julio', diaIni + ' Julio - ' + diaFin + ' Agosto', diaIni + ' Agosto - ' + diaFin + ' Septiembe', diaIni + ' Septiembre - ' + diaFin + ' Octubre', diaIni + ' Octubre - ' + diaFin + ' Noviembre', diaIni + ' Noviembre - ' + diaFin + ' Diciembre', diaIni + ' Diciembre - ' + diaFin + ' Enero'];

        return arrayNMes[mes - 1];
    }

    _generarReporte = () => {
        Pdf.createPdf(bodyRef.current);
    }

    _atras = () => {
        this.setState({ mostrarGrafica: false, mostratDatosReporte: false, dataGrafica: null });
        mesSeleccionado = null;
        grafica.destroy();
    }

    _graficar = (data, reporte, nombrePeriodo) => {
        this.setState({ mostrarGrafica: true, mostratDatosReporte: reporte, dataGrafica: data });
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
                title: {
                    display: true,
                    text: nombrePeriodo
                },
                scales: {
                    yAxes: [{

                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'CONSUMO EN KW/H'
                        }
                    }],
                    xAxes: [{

                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'DÍAS DEL PERÍODO'
                        }

                    }]
                },
                responsive: true
            }
        });

        ctx.onclick = evento => {

            const activePoints = grafica.getElementsAtEvent(evento);
            if (activePoints && activePoints.length > 0) {
                // const barra = activePoints[0]._model;
                // const diaHistorial = barra.label;
                const fechaHistorial = data.fechaInicio;
                const indexHistorial = activePoints[0]._index;
                const fechaBuscar = _castearFechaFrontToServer(_sumarDiasFecha(_castearFechaServerToFront(fechaHistorial), indexHistorial + 1));
                this.setState({
                    historialDiaFecha: fechaBuscar,
                    historialDiaEstado: true
                });
            }
        }
    }

    _ocultarHistorialDia = () => {
        this.setState({
            historialDiaFecha: null,
            historialDiaEstado: false
        });
    }

    _getDiferenciaFechas = (fecha_1, fecha_2) => {
        let fechaInicio = new Date(fecha_1).getTime();
        let fechaFin = new Date(fecha_2).getTime();

        let diff = fechaInicio - fechaFin;

        return diff / (1000 * 60 * 60 * 24);
    }

    _obtenerHistorialMes = (evento, reporte, periodo, objMes) => {
        evento.preventDefault();
        mesSeleccionado = objMes;
        const { historial } = this.state;

        //Objeto a devolver
        let data = {
            consumoMadrugada: [],
            consumoManana: [],
            consumoTarde: [],
            consumoNoche: [],
            labels: [],
            fechaInicio: objMes.fechaIni
        }

        let arrayConsumoManana = [];
        let arrayConsumoMadrugada = [];
        let arrayconsumoTarde = [];
        let arrayconsumoNoche = [];
        let arrayModelo = [];

        let labels = [];
        let contador = parseInt(objMes.diaIni);//objMes.diaIni  diaFin
        let nombrePeriodo = this.state.arrayNMes[objMes.fechaIni.split("/")[0] - 1];
        nombrePeriodo = nombrePeriodo.toUpperCase();
        let parar = false;
        while (parar === false) {
            if ((contador + 1) > 31) {
                contador = contador - 31;
                if (contador === 0) {
                    contador = 1;
                }
            } else if (arrayModelo.length !== 0) {
                contador++;
            }
            arrayModelo.push(contador);
            if (arrayModelo.length === this._getDiferenciaFechas(objMes.fechaFin, objMes.fechaIni)) {
                parar = true;
            }
        }
        //Llenar arrays
        for (var i = 0; i < 31; i++) {
            arrayConsumoManana.push(0);
            arrayConsumoMadrugada.push(0);
            arrayconsumoTarde.push(0);
            arrayconsumoNoche.push(0);
        }

        labels = arrayModelo;

        data.labels = arrayModelo;

        for (i = 0; i < historial.length; i++) {
            var fecha = historial[i].fecha;
            const arrayFecha = fecha.split("/");
            const arrayFechaIni = historial[i].fechaIniCorte.split(",");
            let diaConsumido = +arrayFecha[1];
            if (arrayFechaIni[0] === periodo) {

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
        this._graficar(data, reporte, nombrePeriodo);
    }

    _obtenerDatosTabla = (historial) => {
        let objPeriodo = [];
        let auxPeriodo = null;
        for (let index = 0; index < historial.length; index++) {
            const element = historial[index];
            const arrayFechaIni = element.fechaIniCorte.split(",");
            const arrayFechaFin = element.fechaFinalCorte.split(",");
            if (auxPeriodo !== arrayFechaIni[0]) {
                objPeriodo.push({ fechaIni: arrayFechaIni[0], fechaFin: arrayFechaFin[0] });
                auxPeriodo = arrayFechaIni[0];
            }
        }
        obj = [];
        for (let index = 0; index < objPeriodo.length; index++) {
            let consumoTotal = 0;
            let costoU = 0;
            for (let index2 = 0; index2 < historial.length; index2++) {
                const element = historial[index2];
                const arrayFecha = element.fechaIniCorte.split(",");
                if (objPeriodo[index].fechaIni === arrayFecha[0]) {
                    costoU = element.costoUnitarioKwh;
                    consumoTotal = consumoTotal + element.totalConsumoDia;
                }
            }
            obj.push({ mes: objPeriodo[index].fechaIni.split("/")[0], consumoTotal: consumoTotal, consumoCosto: (consumoTotal * costoU), diaIni: objPeriodo[index].fechaIni.split("/")[1], diaFin: objPeriodo[index].fechaFin.split("/")[1], idPeriodo: objPeriodo[index].fechaIni, fechaIni: objPeriodo[index].fechaIni, fechaFin: objPeriodo[index].fechaFin, costoU });
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
            let historialAux = [];
            for (let index = 0; index < historial.length; index++) {
                const element = historial[index];
                historialAux.unshift(element);
            }
            this._obtenerDatosTabla(historialAux);
        }
    }

    render() {
        const { datosTabla, arrayNMes, mostrarGrafica, mostratDatosReporte, dataGrafica, historialDiaFecha, historial, historialDiaEstado } = this.state;
        const { usuario } = this.props;

        if (datosTabla && datosTabla.length === 0) {
            return <Cargando />
        }

        if (datosTabla === null) {
            return <div>No hay historial</div>
        }

        return (

            <Card>
                {historialDiaFecha && <HistorialDia fecha={historialDiaFecha} historial={historial} estado={historialDiaEstado} ocultarVentana={this._ocultarHistorialDia} /> }
                
                <Card.Header id="historialTitulo" className="textoHistorial">

                    Mi historial
                          <i id="calendarIcono" className="feather icon-calendar ml-1" />

                </Card.Header>
                <Card.Body className="container">

                    {!mostrarGrafica ?
                        <Table responsive hover width="100%">
                            <thead id="encabezadoTabla" style={{ textAlign: 'center' }}>
                                <tr>
                                    <th scope="col" className="textoHistorial encabezado">Periodo</th>
                                    <th scope="col" className="textoHistorial encabezado">Kwh</th>
                                    <th scope="col" className="textoHistorial encabezado">Costo unitario (kw/h)</th>
                                    <th scope="col" className="textoHistorial encabezado">Total ($)</th>
                                    <th scope="col" className="textoHistorial encabezado">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datosTabla.map((mes, id) =>
                                    <tr key={id} id="contenidoTabla" style={{ textAlign: 'center' }} >
                                        <td className="textoHistorial">{this._obtenerNombrePeriodo(mes.mes, mes.diaIni, mes.diaFin)}</td>
                                        <td className="textoHistorial">{mes.consumoTotal}</td>
                                        <td className="textoHistorial">{mes.costoU}</td>
                                        <td className="textoHistorial">{mes.consumoCosto.toLocaleString('de-DE', { style: 'decimal' })}</td>
                                        <td>
                                            <Button size='sm' title="Ver gráfica" className="botonFondo shadow-1" onClick={(e) => this._obtenerHistorialMes(e, false, mes.idPeriodo, mes)}>
                                                <i className="feather icon-eye" />
                                            </Button>
                                            <Button size='sm' title="Ver reporte" className="botonFondo shadow-1 btnDescargar" onClick={(e) => this._obtenerHistorialMes(e, true, mes.idPeriodo, mes)}>
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
                            <Button size="sm" onClick={this._atras} title="Volver" className="botonFondo2 mt-3 shadow-2">
                                <i className="feather icon-arrow-left" />
                            </Button>
                            : null
                        }
                        {mostratDatosReporte ?
                            <Button size="sm" onClick={this._generarReporte} title="Descargar reporte" className="botonFondo2 mt-3 shadow-2 btnDescargar" >
                                <i className="fa fa-file-pdf-o" />
                            </Button>
                            : null
                        }
                        {mostratDatosReporte ?
                            <Excel data={dataGrafica} />
                            : null
                        }
                    </div>

                </Card.Body>

            </Card>
        )
    }
}

export default Historial
