import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import { Modal, Button } from 'react-bootstrap';

const HistorialDia = ({ fecha, historial, estado, ocultarVentana }) => {

    const historialFecha = historial.filter(obj => obj.fecha.split(',')[0] === fecha)[0].subHistorico.historicoPorHora;

    const dataDia = [
        { hora: 12, jornada: "AM", consumo: 0 },
        { hora: 1, jornada: "AM", consumo: 0 },
        { hora: 2, jornada: "AM", consumo: 0 },
        { hora: 3, jornada: "AM", consumo: 0 },
        { hora: 4, jornada: "AM", consumo: 0 },
        { hora: 5, jornada: "AM", consumo: 0 },
        { hora: 6, jornada: "AM", consumo: 0 },
        { hora: 7, jornada: "AM", consumo: 0 },
        { hora: 8, jornada: "AM", consumo: 0 },
        { hora: 9, jornada: "AM", consumo: 0 },
        { hora: 10, jornada: "AM", consumo: 0 },
        { hora: 11, jornada: "AM", consumo: 0 },
        { hora: 12, jornada: "PM", consumo: 0 },
        { hora: 1, jornada: "PM", consumo: 0 },
        { hora: 2, jornada: "PM", consumo: 0 },
        { hora: 3, jornada: "PM", consumo: 0 },
        { hora: 4, jornada: "PM", consumo: 0 },
        { hora: 5, jornada: "PM", consumo: 0 },
        { hora: 6, jornada: "PM", consumo: 0 },
        { hora: 7, jornada: "PM", consumo: 0 },
        { hora: 8, jornada: "PM", consumo: 0 },
        { hora: 9, jornada: "PM", consumo: 0 },
        { hora: 10, jornada: "PM", consumo: 0 },
        { hora: 11, jornada: "PM", consumo: 0 },
    ];

    let labels = [];
    let data = [];

    for (let index = 0; index < historialFecha.length; index++) {
        const hora = parseInt(historialFecha[index].hora.split(' ')[1].split(':')[0]);
        const jornada = historialFecha[index].hora.split(' ')[2];
        const consumo = historialFecha[index].consumo;

        labels = [];
        data = [];

        for (let index2 = 0; index2 < dataDia.length; index2++) {
            const element = dataDia[index2];

            if (hora === element.hora && jornada === element.jornada) {
                element.consumo = element.consumo + consumo;
            }

            labels.push(`${element.hora} ${element.jornada}`);
            data.push(parseInt(element.consumo));
        }

    }

    useEffect(() => {
        const ctx = document.getElementById('myGraficaHora');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Consumo',
                    data: data,
                    backgroundColor: 'rgba(29, 233, 176, 0.2)',
                    borderColor: 'rgba(29, 233, 176, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: "Historico por hora"
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
                            labelString: 'HORAS DEL DÍA'
                        }

                    }]
                },
                responsive: true
            }
        });
    }, [labels, data]);

    const cerrarModal = () => {
        ocultarVentana();
    }

    return (
        <Modal show={estado} onHide={cerrarModal} size="lg">

            <Modal.Header closeButton>
                <Modal.Title>Historial por hora</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="chart-container-dia" >
                    <canvas id="myGraficaHora"></canvas>
                </div>
            </Modal.Body>

            <Modal.Footer>

                <Button onClick={cerrarModal} variant="secondary">
                    Cerrar
                </Button>

            </Modal.Footer>
        </Modal>
    )
}

HistorialDia.propTypes = {
    historial: PropTypes.array.isRequired,
    estado: PropTypes.bool.isRequired,
    ocultarVentana: PropTypes.func.isRequired
}

export default HistorialDia;

