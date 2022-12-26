/* eslint-disable */
//No modificar
export const S3_BUCKET = process.env.REACT_APP_AWS_BUCKET_NAME;
export const REGION = process.env.REACT_APP_AWS_REGION;
export const ACCESS_KEY_ID = process.env.REACT_APP_AWS_ACCESS_KEY;
export const SECRET_ACCES_KEY = process.env.REACT_APP_AWS_SECRET_KEY;
//No modificar
export const configS3 = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCES_KEY
}

//No modificar, cualquier cosa hablar con Gabriela HR xd
export function renameFile(originalFile, newName) {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}

//No modificar, cualquier cosa hablar con Gabriela HR xd
export function getNewNameWithExtension(newName, filename){
    if(filename !== null && filename !==undefined && filename !== ""){
        const extension = filename.substring(filename.lastIndexOf('.')+1, filename.length) || ""
        if(extension === ""){
            return newName
        } else {
            return newName + "." + extension
        }
    }
    return newName
}

//No modificar, cualquier cosa hablar con Gabriela HR xd
export function getFileNameFromUrlS3(url){
    if(url && url !== ""){
        const urlArr = url.split(/[/]/)
        return urlArr[urlArr.length - 1]
    }
    return null
}

//No modificar, cualquier cosa hablar con Gabriela HR xd
export function createBackUrl(fileName, url){
    if(fileName && url && url !== ""){
        // console.log("filename :", fileName, url)
        if(fileName !== ""){
            return fileName.concat("#").concat(url)
        } else {
            const fileNameS3 = getFileNameFromUrlS3(url)
            return fileNameS3.concat("#").concat(url)
        }
    }
}

//No modificar, cualquier cosa hablar con Gabriela HR xd
export function getNameAndUrlFromBack(urlBack){
    if(urlBack && urlBack !== ""){
        const urlArr = urlBack.split(/#/)
        if(urlArr && urlArr.length > 1){
            let urlFront = {nombreOriginal: urlArr[0], nombreEnS3:"", urlS3: urlArr[1]} // [nombreOriginal, urlS3 para ver o descargar]
            // console.log(urlArr);
            const nuevoNombre = urlFront.urlS3.split("https://"+ S3_BUCKET + ".s3.amazonaws.com/")
            if(nuevoNombre && nuevoNombre.length>1){
                const extension = nuevoNombre[1].substring(nuevoNombre[1].lastIndexOf('.') + 1, nuevoNombre[1].length) || ""
                urlFront.nombreEnS3 = nuevoNombre[1].substring(0, nuevoNombre[1].length - extension.length - 1)
            }
            // console.log("urlBack;", urlBack, urlArr, urlFront, nuevoNombre)
            return urlFront
        }
    }
    return {nombreOriginal: "", nombreEnS3:"", urlS3: ""}
}

//No modificar, cualquier cosa hablar con Gabriela HR xd
export const MAXIMO_TAMANIO_BYTES = 1000000
export function validSize(file, maxSize=MAXIMO_TAMANIO_BYTES) {
    if(file){
        const fileSize = file.size
        if(fileSize > maxSize){
            return false
        }
        return true
    }
    return false
}