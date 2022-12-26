/* eslint-disable */
import { useState } from "react";
import { ACCESS_KEY_ID, configS3, createBackUrl, getFileNameFromUrlS3, getNameAndUrlFromBack, getNewNameWithExtension, MAXIMO_TAMANIO_BYTES, renameFile, S3_BUCKET, SECRET_ACCES_KEY, validSize } from 'src/utils/awsConfig';
import AWS from 'aws-sdk'
import { uploadFile } from 'react-s3';

export const uploadFileHandle = async (file, newFileName) => {
    if(file !== null){
        // Renombrar el archivo para que sea unico pls y guardalo en el s3
        const nombreOriginal = file.name
        const nuevoNombre = getNewNameWithExtension(newFileName, nombreOriginal)
        const nuevoArchivoRenombrado = renameFile(file, nuevoNombre)
        console.log("archivo renombrado: ", nuevoArchivoRenombrado)
        try {
            const response = await uploadFile(nuevoArchivoRenombrado, configS3)
            if(response){
                console.log("UPLOAD RESPONSE: ", response)
                return createBackUrl(nombreOriginal, response.location) 
            }
        } catch (err) {
            console.error("UPLOAD ERROR", err)
            return ""    
        }
    } else {
        return ""
    }
}

export const downloadFileHandle = (url, nombreOriginal) => {
    if(url && url !== ""){
        AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCES_KEY});
        let s3 = new AWS.S3();
        const fileName = getFileNameFromUrlS3(url) // el nombre del archivo con el que se subio a S3
        console.log("DATA TO DOWNLOAD: ", url, fileName)
        let params = {Bucket: S3_BUCKET, Key: fileName}
        s3.getObject(params, (err, data) => {
            if(err !== undefined) {
                console.log("DOWNLOAD RESPONSE: ", data)
                let blob= new Blob([data.Body], {type: data.ContentType})
                let link=document.createElement('a');
                link.href=window.URL.createObjectURL(blob);
                link.download=nombreOriginal && nombreOriginal !== ""? nombreOriginal : fileName
                link.click();
            } else {
                console.log("error", err, data)
            }
        })
    }
  }

function AwsTest (){
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('https://aim-files-dp2.s3.amazonaws.com/nuevoNombrePaGuardar.jpg');
    const [fileUrl, setFileUrl] = useState("nombreoriginal.txt#https://aim-files-dp2.s3.amazonaws.com/test.txt");
    const [backImagenUrl, setBackImagenUrl] = useState('');

    const handleFileInput = (e) => {
        if(e.target.files[0]){
            // Validar tamaño del archivo 2 MB por defecto
            if(validSize(e.target.files[0])){
                console.log("archivo subido: ", e.target.files[0])           
                setSelectedFile(e.target.files[0]);
            } else {
                setSelectedFile(null)
                const tamanioEnMb = MAXIMO_TAMANIO_BYTES / 1000000
                alert(`El tamaño máximo es ${tamanioEnMb} MB`)
            }
        } else {
            setSelectedFile(null)
        }
    }
   
    // upload file
    const uploadFile = async () => {

        // "nombreEnS3" debe ser unico en S3 por lo que deben generar un nombre para su modulo -> "capacitacion-KF3&2DK"
        const nombreEnS3 = "nuevoNombrePaGuardar2"
        // llamada al S3
        const urlToSave = await uploadFileHandle(selectedFile, nombreEnS3)
        // "urlToSave" tiene el formato {nombre Original del archivo subido}#{url en S3}
        // puede ser utilizado para guarlado en el back
        alert("Subido todo OK")
        console.log("urlToSave: ", urlToSave)
    }
    
    // download file
    const downloadFile = () => {
        // Para la descarga, se obtiene el nombre original y la url de 
        // lo que se guardo en back ("urlToSave")
        const url = getNameAndUrlFromBack(fileUrl)
        console.log("nombre original y url: ", url.nombreOriginal, url.urlS3)
        downloadFileHandle(url.urlS3, url.nombreOriginal)
    }

    // Extras para inputs de prueba
    const handleChange = event => {
        setImageUrl(event.target.value);
    };

    const handleChangeFile = event => {
        setFileUrl(event.target.value);
    };

    const showImage = () => {
        setBackImagenUrl(imageUrl)
    };
    

    return (
        <div style={{marginTop: "50px", marginLeft: "50px"}}>
            {/* Subir archivo */}
            <input type="file" onChange={handleFileInput}/>
            <button onClick={() => {uploadFile()}}> Upload to S3</button>

            {/* Descargar archivo */}
            <div style={{marginTop: "20px"}}>Formato <b>{"{nombreCualquiera.ext}#{urlS3}"}</b> para descargar</div>
            <input
                type="text"
                id="fileUrl"
                name="fileUrl"
                onChange={handleChangeFile}
                value={fileUrl || ""}
                style={{width:"600px"}}
            />
            <button onClick={() => {downloadFile()}}> Download S3</button>

            {/* Mostrar imagenes */}
            <div style={{marginTop: "20px"}}>Formato <b>{"{urlS3}"}</b> de imagen para mostrar</div>
            <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                onChange={handleChange}
                value={imageUrl}
                style={{width:"600px"}}
            />
            <button onClick={() => showImage()}> Mostrar imagen de S3</button>
            {/* Para mostrar la imagen solo se pone en el src */}
            <img
                style={{ width: "50px", height: "50px", marginTop: "10px", display: "block",  marginBottom: "10px" }}
                src={backImagenUrl || ""}
                alt=""
            />
            {/* Verificar en producción la configuración del S3 */}
            <div style={{marginTop: "20px"}}>Verificar variables en producción </div>
            <button onClick={() => {alert("Variables .env: " + S3_BUCKET + " " + process.env.REACT_APP_AWS_BUCKET_NAME)}}> Check env</button>
        </div>
    )

}

export default AwsTest;