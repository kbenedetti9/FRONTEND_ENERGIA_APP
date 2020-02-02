import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { _getLabelsHistorial, _destructuringFechaServer, _castearFechaFrontToServer, _sumarDiasFecha, _castearFechaServerToFront } from '../functions';
import Chart from 'chart.js';
import 'chartjs-plugin-annotation';
import HistorialDia from '../../VentanaModal/HistorialDia';

const GraficaPromedio = ({ historial, fechaConsumoInicial, fechaConsumoFinal }) => {
    
    // Filtramos solo los historiales excepto los que pertenecen al periodo actual
    const historialPromedio = historial.filter(obj => obj.fechaIniCorte !== fechaConsumoInicial);
    let totalConsumo = 0;

    // Sumamos todo los totales de cada dia por historial y se calcula su historico
    historialPromedio.forEach(element => {
        totalConsumo = totalConsumo + parseInt(element.totalConsumoDia);
    });
    //Aproximamos el promedio para obtener un valor exacto
    const promedio = Math.round(totalConsumo / historialPromedio.length);

    //Ahora obtenemos los historiales del periodo actual
    const historialesPeriodo = historial.filter(obj => obj.fechaIniCorte === fechaConsumoInicial);

    //Calculamos el labels para la grafica
    const diaInicial = _destructuringFechaServer(fechaConsumoInicial).dia;
    const data = _getLabelsHistorial(fechaConsumoInicial, fechaConsumoFinal, diaInicial).arrayModelo2;

    //label y data de la grafica
    let labels = [];
    let data2 = [];

    //Ahora se llena la data de la grafica (consumo del data)
    for (let index = 0; index < data.length; index++) {
        const fecha = data[index].fecha;
        for (let index2 = 0; index2 < historialesPeriodo.length; index2++) {
            const fecha2 = historialesPeriodo[index2].fecha.split(',')[0];
            if (fecha2 === fecha) {
                data[index].consumo = historialesPeriodo[index2].totalConsumoDia;
                break;
            }
        }
        labels.push(data[index].contador);
        data2.push(data[index].consumo);
    }

    const [fechaBuscar, setFecha] = useState(null);
    const [historialDiaEstado, setHistorialEstado] = useState(false);

    const _ocultarHistorialDia = () => {
        setHistorialEstado(false);
    }

    useEffect(() => {
        const ctx = document.getElementById('myGraficaPromedio');
        let grafica = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Consumo',
                    data: data2,
                    backgroundColor: 'rgba(29, 233, 176, 0.2)',
                    borderColor: 'rgba(29, 233, 176, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                title: {
                    display: false,
                    text: "Historico del período"
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
                responsive: true,
                annotation: {
                    drawTime: "afterDraw",
                    annotations: [{
                        id: "line1",
                        type: "line",
                        mode: "horizontal",
                        scaleID: "y-axis-0",
                        value: promedio,
                        borderWidth: 2,
                        borderColor: "red",
                        label: {
                            content: `Promedio de ${promedio} kw/h`,
                            enabled: true,
                            position: "right"
                        }
                    }
                    ]
                }
            }
        });

        ctx.onclick = evento => {

            const activePoints = grafica.getElementsAtEvent(evento);
            if (activePoints && activePoints.length > 0) {
                // const barra = activePoints[0]._model;
                // const diaHistorial = barra.label;
                const fechaHistorial = fechaConsumoInicial;
                const indexHistorial = activePoints[0]._index;
                const fechaBuscar = _castearFechaFrontToServer(_sumarDiasFecha(_castearFechaServerToFront(fechaHistorial), indexHistorial + 1));
                setFecha(fechaBuscar);
                setHistorialEstado(true);
            }
        }

    }, [labels, data2, promedio, fechaConsumoInicial]);

    return (
        <div>
            {historialDiaEstado && <HistorialDia fecha={fechaBuscar} historial={historial} estado={historialDiaEstado} ocultarVentana={_ocultarHistorialDia} />}

            <div className="chart-container" >
                <canvas id="myGraficaPromedio"></canvas>
            </div>
        </div>

    )
};

GraficaPromedio.propTypes = {
    fechaConsumoInicial: PropTypes.string.isRequired,
    fechaConsumoFinal: PropTypes.string.isRequired,
};

export default GraficaPromedio;

