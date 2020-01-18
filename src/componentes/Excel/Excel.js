import React from "react";
import ReactExport from "react-export-excel";
import { Button } from 'react-bootstrap';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Download extends React.Component {

    _sumarDiasFecha = (fecha, Ndia) => {
        let nuevaFecha = new Date(fecha);
        nuevaFecha.setDate(nuevaFecha.getDate() + Ndia);
        let mes = parseInt((nuevaFecha.getMonth() + 1));
        let dia = parseInt(nuevaFecha.getDate());
        
        return `${mes}/${dia}/${nuevaFecha.getFullYear()}`;
    }

    render() {

        const {data} = this.props;
        const dataSet2 = [];

        for(let i=0; i<data.labels.length; i++){
            let itemObjeto = {Madrugada: data.consumoMadrugada[i], Mañana: data.consumoManana[i], Tarde: data.consumoTarde[i], Noche: data.consumoNoche[i], fecha: i === 0 ? data.fechaInicio : this._sumarDiasFecha(data.fechaInicio, i)};
            dataSet2.push(itemObjeto);
        }

        return (
            <ExcelFile filename="DatosGrafica" element={<Button size='sm' title="Descargar en formato excel" className="botonFondo2 mt-3 shadow-2 btnDescargar" ><i className="fa fa-file-excel-o" /></Button>}>
                <ExcelSheet data={dataSet2} name="CONSUMO DEL PERÍODO">
                    <ExcelColumn label="FECHA DE CONSUMO" value="fecha"/>
                    <ExcelColumn label="MADRUGADA (kw/h)" value="Madrugada"/>
                    <ExcelColumn label="MAÑANA (kw/h)" value="Mañana"/>
                    <ExcelColumn label="TARDE (kw/h)" value="Tarde"/>
                    <ExcelColumn label="NOCHE (kw/h)" value="Noche"/>
                    {/* <ExcelColumn label="Marital Status" value={(col) => col.is_married ? "Married" : "Single"}/> */}
                </ExcelSheet>
                {/* <ExcelSheet data={dataSet2} name="Leaves">
                    <ExcelColumn label="Name" value="name"/>
                    <ExcelColumn label="Total Leaves" value="total"/>
                    <ExcelColumn label="Remaining Leaves" value="remaining"/>
                </ExcelSheet> */}
            </ExcelFile>
        );
    }
}

export default Download;