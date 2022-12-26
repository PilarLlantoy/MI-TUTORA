import { formatNameCapitals } from "./training"

export const obtenerNombreCortado = (nombre = "", length = 20, puntos = false) => {
    let nuevoNombre = ""
    const maxLen = length
    if(nombre && nombre.length>0){
        if(nombre.length>maxLen){
            nuevoNombre = nombre.substring(0, maxLen)
            if(puntos){
                nuevoNombre = nuevoNombre.concat("...")
            }
        } else {
            nuevoNombre = nombre
        }
    }
    return formatNameCapitals(nuevoNombre).replace(',', '');
}

export const fechaFormato = (tipo , date) => {
    const newDate = new Date(date)
    const now = new Date()
    // console.log(newDate)
    switch(tipo){
        case "fecha":
            return newDate.toLocaleDateString();
        case "hora":
            if(now.getDay() > newDate.getDay() || (now.getMonth() < newDate.getMonth())){
                return newDate.toLocaleString()
            }
            return newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        case "todo":
        default:
            return newDate.toLocaleString()
    }
}

