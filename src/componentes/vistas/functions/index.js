const _sumarDiasFecha = (fecha, Ndia) => {
    let nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(nuevaFecha.getDate() + Ndia);
    let mes = parseInt((nuevaFecha.getMonth() + 1));
    let dia = parseInt(nuevaFecha.getDate());
    let mesString = "" + mes;
    let diaString = "" + dia;
    if (mes < 10) {
        mesString = "0" + mes;
    }
    if (dia < 10) {
        diaString = "0" + diaString;
    }

    return nuevaFecha.getFullYear() + '-' + mesString + '-' + diaString;
}

const _castearFechaServerToFront = (fecha) => {
    let arrayFecha = fecha.split("/");
    let dia = parseInt(arrayFecha[1]);
    let mes = parseInt(arrayFecha[0]);
    let año = arrayFecha[2];

    if (dia < 10) {
        dia = "0" + dia;
    }

    if (mes < 10) {
        mes = "0" + mes;
    }

    return año + "-" + mes + "-" + dia;
}

const _castearFechaFrontToServer = (fecha) => {
    let arrayFecha = fecha.split("-");
    let dia = parseInt(arrayFecha[2]);
    let mes = parseInt(arrayFecha[1]);
    let año = arrayFecha[0];

    return `${mes}/${dia}/${año}`;
}

const _destructuringFechaServer = fecha => {
    let arrayFecha = fecha.split("/");
    let dia = parseInt(arrayFecha[1]);
    let mes = parseInt(arrayFecha[0]);
    let año = arrayFecha[2];

    return {
        dia, mes, año
    };
}

const _destructuringFechaFront = fecha => {
    let arrayFecha = fecha.split("-");
    let dia = parseInt(arrayFecha[2]);
    let mes = parseInt(arrayFecha[1]);
    let año = arrayFecha[0];

    return {
        dia, mes, año
    };
}

const _getDiferenciaFechas = (fecha_1, fecha_2) => {
    let fechaInicio = new Date(fecha_1).getTime();
    let fechaFin = new Date(fecha_2).getTime();

    let diff = fechaInicio - fechaFin;

    return diff / (1000 * 60 * 60 * 24);
}

const _getLabelsHistorial = (fechaIni, fechaFin, diaInicial) => {
    
    let arrayModelo = [];
    let arrayModelo2 = [];
    let parar = false;
    let contador = parseInt(diaInicial);
    let fechaAux = fechaIni;

    while (parar === false) {
        if ((contador + 1) > 31) {
            contador = contador - 31;
            if (contador === 0) {
                contador = 1;
            }
        } else if (arrayModelo.length !== 0) {
            contador++;
            fechaAux = _castearFechaFrontToServer(_sumarDiasFecha(fechaAux, 1));
        }
        
        arrayModelo.push(contador);
        arrayModelo2.push({contador, fecha: fechaAux, consumo: 0 });

        if (arrayModelo.length === _getDiferenciaFechas(fechaFin, fechaIni)) {
            parar = true;
        }
    }

    return {arrayModelo, arrayModelo2};
}

export {
    _sumarDiasFecha,
    _castearFechaServerToFront,
    _castearFechaFrontToServer,
    _destructuringFechaServer,
    _destructuringFechaFront,
    _getDiferenciaFechas,
    _getLabelsHistorial
};