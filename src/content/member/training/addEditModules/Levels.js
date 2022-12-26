import {useState} from 'react';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
  useTheme,
  Zoom,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDropzone } from 'react-dropzone';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import DropzoneAIM from 'src/components/DropzoneAIM';
import certifyAxios from 'src/utils/aimAxios';
import Scrollbar from 'src/components/Scrollbar';
import { createBackUrl, getNameAndUrlFromBack } from 'src/utils/awsConfig';
import { generateTrainingUrlS3 } from 'src/utils/training';
import { downloadFileHandle, uploadFileHandle } from 'src/content/awstest';
import DragHandle from './DragHandle';
import LevelPopper from './LevelPopper';
import AddEditExam from '../addEditExam';
import DeleteModal from '../DeleteModal';



function arraymove(arr, fromIndex, toIndex) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

const nivelPlantilla = {
  order: 0,
  questions: [],
  steps: []
}

const nivelPlantillaLleno = {
  order: 0,
  questions: [{
      alternativeA: '',
      alternativeB: '',
      alternativeC: '',
      alternativeD: '',
      correctAnswer: 0,
      statement: ''
  }],
  steps: [{
      description: "",
      name: "Taller Plantilla",
      order: 0,
      urlVideo: "",
      urlVideoS3: "",
      resource1: "",
      resource2: "",
      resource3: ""
  }]
}

const videoPlantillaNivel = {
  steps:[{ 
    file: {},
    fileName: "",
    urlS3: "",
    fileRec1:{},
    fileName1: "",
    urlS31: "",
    fileRec2:{},
    fileName2: "",
    urlS32: "",
    fileRec3:{},
    fileName3: "",
    urlS33: ""
  }]
}

const videoPlantillaStep = {
  file: {},
  fileName: "",
  urlS3: "",
  fileRec1:{},
  fileName1: "",
  urlS31: "",
  fileRec2:{},
  fileName2: "",
  urlS32: "",
  fileRec3:{},
  fileName3: "",
  urlS33: ""
}

function Levels({ niveles = [], setNiveles, editMode, moduleId, getModuleById, erroMessage, successMessage,
    setVideosRegister, videosRegister=[]
  }) {
  const theme = useTheme();
  const youtubeType = "yt"
  const s3Type = "s3"
  const [openExamen, setOpenExamen] = useState(false)
  const [openTaller, setOpenTaller] = useState(false);
  const [openDeleteTaller, setOpenDeleteTaller] = useState(false);
  const [openDeleteNivel, setOpenDeleteNivel] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(-1); // index nivel
  const [selectedTaller, setSelectedTaller] = useState(-1); // index taller
  const [currentTaller, setCurrentTaller] = useState({});
  const [currentExamen, setCurrentExamen] = useState({});
  const [video, setVideo] = useState({}); 
  const [recursos, setRecursos] = useState([]); 
  const [videoType, setVideoType] = useState(1)
  const [selectedVideoType, setSelectedVideoType] = useState(1)
  const [s3Data, setS3Data] = useState({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
  const [rec1, setRec1] = useState({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
  const [rec2, setRec2] = useState({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
  const [rec3, setRec3] = useState({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
  

  const handleChangeVideoType = (event) => {
    setSelectedVideoType(event.target.value);
  };


  const { enqueueSnackbar } = useSnackbar();
  
  const {
    isDragActive: isDragActiveVideo,
    isDragAccept: isDragAcceptVideo,
    isDragReject: isDragRejectVideo,
    getRootProps: getRootVideo,
    getInputProps: getInputVideo
  } = useDropzone({
      maxFiles: 1,
      accept: 'video/mp4',
      onDrop: (acceptedFile) => {
          if(acceptedFile[0]!== undefined)
          setVideo(
            Object.assign(acceptedFile[0], {
              preview: URL.createObjectURL(acceptedFile[0]),
            }),
          );
      },
  });
  
  const {
    isDragActive: isDragActiveResource,
    isDragAccept: isDragAcceptResource,
    isDragReject: isDragRejectResource,
    getRootProps: getRootRecursos,
    getInputProps: getInputRecursos
  } = useDropzone({ 
    maxFiles: 3,
    onDrop: (acceptedFile) => {
        setRecursos(acceptedFile);
    },
  });     

  const handleEditMode = () => {
    // TODO: call back to edit
    const objModuleFind = {
      id: moduleId
    }
    getModuleById(objModuleFind)
  }
  
  const addLevelGeneral = () =>{
    const temp = [...niveles];
    let tempVideo = [... videosRegister]
    if(editMode){
      let template = {...nivelPlantilla}
      template.order = temp.length
      temp.push(template);
    } else {
      let nivelLleno = {...nivelPlantillaLleno};
      nivelLleno.order = temp.length
      temp.push(nivelLleno);
      // video
      let videoLevel = {...videoPlantillaNivel};
      tempVideo.push(videoLevel)
    }
    setVideosRegister(tempVideo)
    setNiveles(temp);
  }

  const agregarNivel = async () => {
    
    if(editMode){
      try {
        const objRegisterLevel = {
          id: moduleId 
        }
        const response = await certifyAxios.post('/trainingModule/level/register', objRegisterLevel)
        console.log("ADD LEVEL: ", response)
        if(response?.data?.message === "OK"){
          addLevelGeneral()
        }
        successMessage("Nivel agregado")
        handleEditMode()
      } catch (error) {
        erroMessage("Error al inserta nivel. Intentelo de nuevo")
        console.error(error)
      }
    } else {
      addLevelGeneral()
      successMessage("Nivel agregado")
    }
  }
  const removerNivel = async ()=> {
    if(editMode){
      try {
        const objDeleteLevel = {
          id: niveles[selectedLevel].levelId 
        }
        const response = await certifyAxios.post('/trainingModule/level/delete', objDeleteLevel)
        console.log("ADD LEVEL: ", objDeleteLevel, response)
        if(response?.data?.message === "OK"){
          handleEditMode()
          successMessage("Nivel eliminado satisfactoriamente")
        }
      } catch (error) {
        erroMessage("Error al inserta nivel. Intentelo de nuevo")
        console.error(error)
      }
    } else {
      const temp = [...niveles];
      let tempVideo = [...videosRegister]
      temp.splice(selectedLevel, 1);
      tempVideo.splice(selectedLevel, 1);
      setNiveles(temp);
      setVideosRegister(tempVideo)
    }
    deleteNivelClose()
  };

  const deleteNivelOpen = (index, afterSave) => {
    setSelectedLevel(index)
    setOpenDeleteNivel(true)
    afterSave()
  }

  const deleteNivelClose = () => {
    setOpenDeleteNivel(false)
  };

  const handleCreateTallerSuccess = (message) => {
    enqueueSnackbar(message, {
        variant: 'success',
        TransitionComponent: Zoom
    });
    setOpenTaller(false);
  };

  /* const getVideoUrlf2b = (urlVideo) => {
    if(videoType === 1){ // link youtube
      return youtubePrefix + urlVideo
    } 
    return s3Prefix + urlVideo
  } */

  const getVideoUrlb2f = (urlVideo, type) => {
    switch(type) {
      case youtubeType:
        if(videoType === 1){
          return urlVideo
        }
        return ""

      case s3Type:{
        if(videoType === 1) return ""
        if(editMode){
          const urlInfo = getNameAndUrlFromBack(urlVideo)
          return urlInfo.nombreOriginal
        }
        return urlVideo
      }
      case "recurso": {
        if(editMode){
          const urlInfo = getNameAndUrlFromBack(urlVideo)
          return urlInfo.nombreOriginal
        } 
        return urlVideo
      }
      default:
        return ""
    }
  }

  const getTipoArchivoVideo = (urlVideo, urlVideoS3) => {
    if((urlVideo !== null && urlVideo !== undefined && urlVideo !== "") ||
          (urlVideo !== null && urlVideo !== undefined && (urlVideoS3 === "" || (urlVideoS3.length>0 && urlVideoS3.substring(0,4) === "NULO") ))){
        setVideoType(1) // link de youtube
        setSelectedVideoType(1)
      } else {
        setVideoType(2) // video m4 -> s3
        setSelectedVideoType(2)
    }
  }

  const downloadFile = (url) => {
    // const url = getNameAndUrlFromBack(urlVideo)
    downloadFileHandle(url.urlS3, url.nombreOriginal)
  }

  const uploadVideo = async () => {

    // "nombreEnS3" debe ser unico en S3
    let nombreEnS3 = null
    // let nombreEnS3 = "capacitaciones-portada6NERrLv"
    if(editMode && s3Data && s3Data.nombreEnS3 !== ""){
        nombreEnS3 = s3Data.nombreEnS3
    } else {
        nombreEnS3 = generateTrainingUrlS3("tallerVideo")
    }
    // llamada al S3
    if(nombreEnS3 !== null){
        const urlToSave = await uploadFileHandle(video, nombreEnS3)
        return urlToSave;
    }
    
    return ""
  }

  const uploadRecursos = async () => {
    let recursosObj = {
      r1:"",
      r2:"",
      r3:"",
    }
    if(recursos.length > 0){
      await Promise.all(recursos.map(async (recurso, index) => {
        let nombreEnS3 = null
        if(recurso && recurso.name !== undefined){
          if(editMode) {
            if(index === 0 && rec1 && rec1.nombreEnS3 !== ""){
              nombreEnS3 = rec1.nombreEnS3
            } else if(index === 1 && rec2 && rec2.nombreEnS3 !== ""){
              nombreEnS3 = rec2.nombreEnS3
            } else if(index === 2 && rec3 && rec3.nombreEnS3 !== ""){
              nombreEnS3 = rec3.nombreEnS3
            } else {
              nombreEnS3 = generateTrainingUrlS3("recurso")
            }
          } else {
              nombreEnS3 = generateTrainingUrlS3("recurso")
          }

          if(nombreEnS3 !== null){
            const urlToSave = await uploadFileHandle(recurso, nombreEnS3)
            if(index===0){
              recursosObj.r1 = urlToSave
            }else if(index===1){
              recursosObj.r2 = urlToSave
            } else {
              recursosObj.r3 = urlToSave
            }
          }
        }
      }))
    }
    
    return recursosObj
  }

  // Registro general
  const saveVideos = async (selectedLevel, selectedTaller, file) => {
    let tempVideos = [...videosRegister]
    let template = {...videoPlantillaStep}
    template.file = file
    template.fileName = file.name    
    console.log("guarda video", template)
    if(selectedTaller !== -1){  // edita un taller del nivel
      tempVideos[selectedLevel].steps[selectedTaller] = template;
    } else { // agregar un taller al nivel
      tempVideos[selectedLevel].steps.push(template);
    }
    console.log("saveVideos", tempVideos)
    setVideosRegister(tempVideos)
  }

  // Registro general
  const deleteVideos = async (selectedLevel, selectedTaller) => {
    let tempVideos = [...videosRegister]

    if(selectedTaller !== -1){  // edita un taller del nivel
    
      if(tempVideos[selectedLevel].steps[selectedTaller] &&
        tempVideos[selectedLevel].steps[selectedTaller].file){
        tempVideos[selectedLevel].steps[selectedTaller].file = {};
      }
      
      if(tempVideos[selectedLevel].steps[selectedTaller] &&
        tempVideos[selectedLevel].steps[selectedTaller].fileName){
        tempVideos[selectedLevel].steps[selectedTaller].fileName = "";
      }

      if(tempVideos[selectedLevel].steps[selectedTaller] &&
        tempVideos[selectedLevel].steps[selectedTaller].urlS3){
        tempVideos[selectedLevel].steps[selectedTaller].urlS3 = "";
      }

      console.log("deleteVideos", tempVideos)

      setVideosRegister(tempVideos)
    }
  }

  const saveRecursos = async (selectedLevel, selectedTaller, file1, file2, file3) => {
    let tempVideos = [...videosRegister]
    let template = {...videoPlantillaStep}

    if(file1 && file1.name !== undefined){
      template.fileRec1 = file1
      template.fileName1 = file1.name 
    }
    if(file2 && file2.name !== undefined){
      template.fileRec2 = file2
      template.fileName2 = file2.name 
      
    }
    if(file3 && file3.name !== undefined){
      template.fileRec3 = file3
      template.fileName3 = file3.name 
    }   
    
    if((file1 && file1.name !== undefined) || (file2 && file2.name !== undefined)  || (file3 && file3.name !== undefined) ) {
      const stepLenght = tempVideos[selectedLevel].steps.length
      if(selectedTaller !== -1){  // edita un taller del nivel
        if(tempVideos[selectedLevel].steps[selectedTaller].file &&
            tempVideos[selectedLevel].steps[selectedTaller].file.name){
          template.file = tempVideos[selectedLevel].steps[selectedTaller].file
          template.fileName = tempVideos[selectedLevel].steps[selectedTaller].fileName
        }
        tempVideos[selectedLevel].steps[selectedTaller] = template;
  
      } else if(tempVideos[selectedLevel].steps[stepLenght - 1].file &&
          tempVideos[selectedLevel].steps[stepLenght - 1].file.name){ // agregar un taller al nivel
          
          template.file = tempVideos[selectedLevel].steps[stepLenght - 1].file
          template.fileName = tempVideos[selectedLevel].steps[stepLenght - 1].fileName
          tempVideos[selectedLevel].steps[stepLenght - 1] = template;
  
      } else {
        tempVideos[selectedLevel].steps.push(template);
      }
      console.log("saveRecursos", tempVideos)
      setVideosRegister(tempVideos)
    }
  }

  // Registro general y edición
  const registerEditTaller = async (_values) => {
    try {
      const { titulo, descripcion, videoName } = _values;
      // crear taller
      if(selectedLevel !== -1){
        // const totalTalleres = niveles[selectedLevel].steps.length || 0
        let tempNiveles = [...niveles]
        let tallerObj = {
            description: descripcion,
            name: titulo,
            urlVideo: "",
            urlVideoS3: "",
            resource1: "",
            resource2: "",
            resource3: ""
        }
        
        if(selectedTaller !== -1){ 
          // Editar
          if(editMode){
            // verificar tipo de subida
            if(selectedVideoType === 1){ // video de youtube
              tallerObj.urlVideo = videoName || ""
              tallerObj.urlVideoS3 = s3Data.urlS3 !== "" && createBackUrl("NULO", s3Data.urlS3) || ""
            } else if (selectedVideoType === 2){
              // *upload file
              let urlBack = ""
              if(video && video.name !== undefined && video.name !== null){ // se agrego un nuevo video
                urlBack = await uploadVideo()
              }
              if(video && video.name === undefined && s3Data.nombreOriginal === "NULO"){ // se elimino el video
                urlBack = createBackUrl("NULO", s3Data.urlS3)
              }
              tallerObj.urlVideo = ""
              tallerObj.urlVideoS3 = urlBack
            }
            
            const recObj = await uploadRecursos()
            
            // rc1
            if(recObj.r1 && recObj.r1 !== "") {
              tallerObj.resource1 = recObj.r1
            } else if (rec1.urlS3 !== "" && rec1.nombreOriginal === "NULO"){
              tallerObj.resource1 = createBackUrl("NULO", rec1.urlS3)
            } else if (rec1.urlS3 !== "" && rec1.nombreEnS3 !== "NULO"){
              tallerObj.resource1 = currentTaller.resource1
            } else {
              tallerObj.resource1 = ""
            }

            // rc2
            if(recObj.r2 && recObj.r2 !== "") {
              tallerObj.resource2 = recObj.r2
            } else if (rec2.urlS3 !== "" && rec2.nombreOriginal === "NULO"){
              tallerObj.resource2 = createBackUrl("NULO", rec2.urlS3)
            } else if (rec2.urlS3 !== "" && rec2.nombreEnS3 !== "NULO"){
              tallerObj.resource2 = currentTaller.resource2
            } else {
              tallerObj.resource2 = ""
            }

            // rc3
            if(recObj.r3 && recObj.r3 !== "") {
              tallerObj.resource3 = recObj.r3
            } else if (rec3.urlS3 !== "" && rec3.nombreOriginal === "NULO"){
              tallerObj.resource3 = createBackUrl("NULO", rec3.urlS3)
            } else if (rec3.urlS3 !== "" && rec3.nombreEnS3 !== "NULO"){
              tallerObj.resource3 = currentTaller.resource3
            } else {
              tallerObj.resource3 = ""
            }

            tallerObj = {...tallerObj, stepId: currentTaller.idStep}
            const response = await certifyAxios.post('/trainingModule/step/update', tallerObj)
            if(response){
              handleEditMode()
            }
            handleCreateTallerSuccess('Taller modificado satisfactoriamente');
            handleCreateTallerClose()
          } else{ // editando un taller en registro general
            // verificar tipo de subida
            if(selectedVideoType === 1){ // video de youtube
              tallerObj.urlVideo = videoName || ""
              tallerObj.urlVideoS3 = ""
              deleteVideos(selectedLevel, selectedTaller)
            } else if (selectedVideoType === 2){
              // TODO upload file
              if(video.name !== undefined){
                saveVideos(selectedLevel, selectedTaller, video)  
              } else {
                enqueueSnackbar("Seleccione un archivo", {
                  variant: 'error',
                  TransitionComponent: Zoom
                });
                return
              }
              tallerObj.urlVideo = ""
              tallerObj.urlVideoS3 = video.name
            }
            saveRecursos(selectedLevel, selectedTaller, recursos[0], recursos[1], recursos[2])

            tempNiveles[selectedLevel].steps[selectedTaller] = tallerObj;
          }
        } else if(editMode){
            // Crear en un modulo existente
            if(selectedVideoType === 1){ // video de youtube
              tallerObj.urlVideo = videoName || ""
              tallerObj.urlVideoS3 = ""
            } else if (selectedVideoType === 2){
              // *upload file
              let urlBack = ""
              if(video && video.name !== undefined && video.name !== null){ // se agrego un nuevo video
                urlBack = await uploadVideo()
              }
              tallerObj.urlVideo = ""
              tallerObj.urlVideoS3 = urlBack
            }

            const recObj = await uploadRecursos()
            
            // rc1
            if(recObj.r1 && recObj.r1 !== "") {
              tallerObj.resource1 = recObj.r1
            } else if (rec1.urlS3 !== ""){
              tallerObj.resource1 = createBackUrl("NULO", rec1.urlS3)
            } else {
              tallerObj.resource1 = ""
            }

            // rc2
            if(recObj.r2 && recObj.r2 !== "") {
              tallerObj.resource2 = recObj.r2
            } else if (rec2.urlS3 !== ""){
              tallerObj.resource2 = createBackUrl("NULO", rec2.urlS3)
            } else {
              tallerObj.resource2 = ""
            }

            // rc3
            if(recObj.r3 && recObj.r3 !== "") {
              tallerObj.resource3 = recObj.r3
            } else if (rec3.urlS3 !== ""){
              tallerObj.resource3 = createBackUrl("NULO", rec3.urlS3)
            } else {
              tallerObj.resource3 = ""
            }

            tallerObj = {...tallerObj, levelId: tempNiveles[selectedLevel].levelId}
            console.log("REQUEST REGISTER TALLER: ", tallerObj)
            const response = await certifyAxios.post('/trainingModule/step/register', tallerObj)
            if(response){
              handleEditMode()
            }
            handleCreateTallerSuccess('Taller agregado satisfactoriamente');
          } else {
            // Crear registro general (modulo no existe)
            // verificar tipo de subida
            if(selectedVideoType === 1){ // video de youtube
              tallerObj.urlVideo = videoName || ""
              tallerObj.urlVideoS3 = ""
              deleteVideos(selectedLevel, -1)
            } else if (selectedVideoType === 2){
              // TODO upload file
              if(video.name !== undefined){
                saveVideos(selectedLevel, -1, video)  
              } else {
                enqueueSnackbar("Seleccione un archivo", {
                  variant: 'error',
                  TransitionComponent: Zoom
                });
                return
              }
              saveRecursos(selectedLevel, -1, recursos[0], recursos[1], recursos[2])
              tallerObj.urlVideo = ""
              tallerObj.urlVideoS3 = "s3-".concat(video.name)
            }
            console.log("aaquiiiiiiiiiiiiiiiiiiiii", tallerObj)
            tempNiveles[selectedLevel].steps.push(tallerObj);
            handleCreateTallerSuccess('Taller agregado satisfactoriamente');
          }
          setNiveles(tempNiveles);
        } 
      handleCreateTallerClose()
    } catch (error) {
      console.error(error)
    }
  };

  // Registro general
  const registerExamen = async (examen) => {
    if(selectedLevel !== -1){
      let tempNiveles = [...niveles]
      if(tempNiveles[selectedLevel]?.questions?.length > 0){
        // Editar
        handleCreateTallerSuccess('Examen modificado satisfactoriamente');
      } else {
        // Crear
        handleCreateTallerSuccess('Nuevo examen agregado satisfactoriamente');
      }
      tempNiveles[selectedLevel].questions = examen
      setNiveles(tempNiveles);
      handleCloseExam();
    }
  }

  const deleteTaller = async () => {
    if(editMode){
      if(currentTaller?.stepId !== undefined || currentTaller?.stepId !== null){
        try {
          const obj = {
            id: currentTaller.stepId
          }
          // console.log("REQUEST DELETE TALLER: ", obj)
          const response = await certifyAxios.post('/trainingModule/step/delete', obj)
          console.log("Back ... ", response)
          if(response?.data?.message === "OK"){
            handleEditMode()
          }
          successMessage("Taller eliminado satisfactoriamente")
        } catch (error) {
          console.error(error)
          erroMessage("No ha podido eliminar el taller. Inténtelo de nuevo.")
        }
      }
    } else {
      const temp = [...niveles];
      temp[selectedLevel].steps.splice(selectedTaller, 1);
      setNiveles(temp);
    }
    deleteTallerClose()
  }

  const changeOrderStep = async (newOrder, taller) => {
    try {
      const obj = {
        name: taller.name,
        order: newOrder,
        stepId: taller.stepId
      }
      // console.log("REQUEST ORDER TALLER: ", obj)
      const response = await certifyAxios.post('/trainingModule/step/order/update', obj)
      console.log("REQ", response)
      if(response?.data?.message === "OK"){
        handleEditMode()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCreateTallerOpen = async (nivelIndex, tallerIndex, taller = {}, afterOpen) => { 
    if(tallerIndex !== -1){ // Editar
      if(editMode){
        try {
          const objTallerFind = {
            id: taller.stepId 
          }
          const response = await certifyAxios.post('/trainingModule/step/find', objTallerFind)
          console.log("FIND STEP: ", response)
          if(response?.data){
            setCurrentTaller(response.data)
            getTipoArchivoVideo(response.data.urlVideo, response.data.urlVideoS3)
            if(response.data.urlVideoS3 && response.data.urlVideoS3!== ""){
              setS3Data(getNameAndUrlFromBack(response.data.urlVideoS3))
            } else {
              setS3Data({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
            }
            
            if(response.data.resource1 && response.data.resource1 !== ""){
              setRec1(getNameAndUrlFromBack(response.data.resource1))
            }else{
              setRec1({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
            }
            if(response.data.resource2 && response.data.resource2 !== ""){
              setRec2(getNameAndUrlFromBack(response.data.resource2))
            }else{
              setRec2({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
            }
            if(response.data.resource3 && response.data.resource3 !== ""){
              setRec3(getNameAndUrlFromBack(response.data.resource3))
            }else{
              setRec3({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
            }
          }
          
        } catch (error) {
          setCurrentTaller(taller)
          getTipoArchivoVideo(taller.urlVideo)
          console.error(error)
        }
      } else {
        setCurrentTaller(taller)
        console.log("aaa edit", taller)
        getTipoArchivoVideo(taller.urlVideo, taller.urlVideoS3)
        setS3Data({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
      }
      setSelectedTaller(tallerIndex)
    } else{ // Nuevo taller
      setCurrentTaller({})
      setS3Data({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
      setSelectedTaller(-1)
      setVideoType(1)
      setSelectedVideoType(1)
    }
    setVideo({})
    setRecursos([])
    setSelectedLevel(nivelIndex)
    setOpenTaller(true);
    afterOpen()
  };
  
  const handleCreateTallerClose = () => {
    setOpenTaller(false);
    setCurrentTaller({})
    setRec1({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
    setRec2({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
    setRec3({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
    setRecursos([])
  };

  const deleteTallerOpen = (taller) => {
    setCurrentTaller(taller)
    setOpenDeleteTaller(true)
  }

  const deleteTallerClose = () => {
    setCurrentTaller({})
    setOpenDeleteTaller(false)
  }

  const handleOpenExamen = (afterClose) => {
    setOpenExamen(true)
    afterClose()
  }

  const handleOpenEditExamen = async (nivelIndex, nivelId, refresh=false) => {
    if(editMode && nivelId !== -1){
      try {
        const reqObj = {
          id: nivelId
        }
        const response = await certifyAxios.post('/trainingModule/question/query', reqObj)
        console.log("FIND QUESTION: ", response)
        if(response?.data?.list.length >0){
          setSelectedLevel(nivelIndex)
          setCurrentExamen(response.data.list)
        } else {
          setSelectedLevel(nivelIndex)
          setCurrentExamen([])
          
        }
      } catch (error) {
        console.error(error)
        selectedLevel(-1)
        setCurrentExamen([])
      }

    } else {
      setSelectedLevel(nivelIndex)
      setCurrentExamen(niveles[nivelIndex].questions || [])
    }
    if(!refresh){
      setOpenExamen(true)
    }
  }

  const handleCloseExam = () => {
    setOpenExamen(false)
  }

  return (
    <div>
      <Grid container>
        <Grid 
          item 
          xs={12}
          sm={12}
          md={12}
          sx={{
            px: `${theme.spacing(1)}`
          }}
        >
          <Box
            pr={0.5}
            sx={{
              pt: `${theme.spacing(2)}`,
              pb: { xs: 1, md: 0 }
            }}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            >
            <b>Niveles del módulo</b>
            <IconButton
              color="primary"
              sx={{ borderRadius: 30 }}
              onClick={agregarNivel}
              >
              <AddCircleOutlineRoundedIcon fontSize="inherit" />
            </IconButton>
            
          </Box>
        </Grid>
        
        <Grid 
          item 
          xs={12}
          sm={12}
          md={12}
          sx={{minHeight:"75vh"}}
        >
        <Scrollbar autoHide={false}>
        <Grid
          container
          spacing={0}
          paddingLeft={0}
          paddingRight={1.5}
          minHeight="75vh"
          >
          <Grid
              item
              xs={12}
              sm={12}
              md={12}
          >
        <div>
          {niveles && niveles.map((nivel, index) => (
            <Accordion key={index} sx={{ background: '#F9F9F9' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id={index}
                key={index}
                sx={{ 
                  background: '#F9F9F9', 
                  marginTop: '10px', 
                  '.css-o4b71y-MuiAccordionSummary-content': {
                    display:"flex", 
                    justifyContent:"space-between"
                  }
                }}
              >
                <div style={{display:"flex", alignItems:"center"}}>
                    Nivel {index + 1}
                </div>
                <div>
                  <LevelPopper 
                    index={index}
                    cantidadNiveles = {niveles?.length || 0}
                    setSelectedLevel={setSelectedLevel}
                    removerNivel={deleteNivelOpen} 
                    handleCreateTallerOpen={handleCreateTallerOpen}
                    examLength={nivel?.questions?.length || 0}
                    handleOpenExamen={handleOpenExamen}
                  />
                </div>
              </AccordionSummary>
              <AccordionDetails
                sx={{ background: '#F9F9F9', marginBottom: '10px', p:0 }}
              >
                <DragDropContext
                  onDragEnd={(param) => {
                    const srcI = param.source.index;
                    const desI = param.destination?.index;
                    if (desI !== null && desI !== undefined) {
                      // setTalleres(talleres);
                      changeOrderStep(desI, nivel.steps[srcI])
                      arraymove(nivel.steps, srcI, desI);
                    }
                  }}
                >
                  <List sx={{padding:"1px"}}>
                    <Droppable droppableId={`droppable-${index}`}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {nivel?.steps && nivel.steps.map((item, indexTaller) => (
                            <Draggable
                              key={indexTaller}
                              draggableId={`draggable-${indexTaller}`}
                              index={indexTaller}
                            >
                              {(provided, snapshot) => (
                                <ListItem
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    display:"flex", 
                                    justifyContent:"space-between",
                                    boxShadow: snapshot.isDragging
                                      ? '0 0 .4rem #666'
                                      : 'none'
                                  }}
                                  key={indexTaller}
                                >
                                  <div style={{display: "flex", alignItems:"center"}}>
                                    <DragHandle {...provided.dragHandleProps} />
                                    <span>{item.name}</span>
                                  </div>
                                  <div style={{display: "flex", alignItems:"center"}}>
                                    <IconButton 
                                        color="secondary" 
                                        size="small"
                                        sx={{
                                          borderRadius:30, 
                                          marginRight:"5px",
                                          marginLeft:"20px"
                                        }}
                                        onClick={()=>{handleCreateTallerOpen(index, indexTaller, item, ()=>{})}}
                                    >
                                      <CreateRoundedIcon/>
                                    </IconButton>
                                    {nivel.steps && nivel.steps.length > 1 && <IconButton color="error" size="small" sx={{borderRadius:30}}>
                                      <DeleteRoundedIcon onClick={() => {deleteTallerOpen(item)}}/>                          
                                  </IconButton>}
                                  </div>
                                </ListItem>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </List>
                  <List sx={{p:0, m:0}}>
                      <ListItem key={index}
                        sx={{
                          pl:"58px",
                          pr:"48px",
                          display:"flex", 
                          justifyContent:"space-between",
                        }}
                      >
                        <div>
                          <span>Prueba Final del Nivel</span>
                        </div>
                        <div>
                          <IconButton 
                              color="secondary" 
                              size="small"
                              sx={{
                                borderRadius:30, 
                                marginRight:"5px",
                                marginLeft:"20px"
                              }}
                              onClick={()=>{handleOpenEditExamen(index, nivel.levelId || -1)}}
                          >
                            <CreateRoundedIcon/>
                          </IconButton>
                        </div>
                      </ListItem>
                    </List>
                </DragDropContext>
              </AccordionDetails>
            </Accordion>
          ))}
          {niveles?.length === 0 &&
            <div style={{
              display:"flex", 
              justifyContent:"center",
              color:"gray",
              paddingTop:`${theme.spacing(15)}`
            }}> 
              Sin niveles 
            </div>
          }
        </div>
        
        </Grid>
        </Grid>
        </Scrollbar>
        </Grid>
      </Grid>
      {/* Taller */}
      <Dialog
          fullWidth
          maxWidth="md"
          open={openTaller}
          onClose={handleCreateTallerClose}
      >
          <DialogTitle
              sx={{
                  p: 3
              }}
          >
              <Typography variant="h4" gutterBottom>
                  {currentTaller.name? "Editar Taller" : "Nuevo Taller"}
              </Typography>
          </DialogTitle>
          <Formik
              initialValues={{
                  titulo: currentTaller.name? currentTaller.name : '',
                  videoName: currentTaller.urlVideo? getVideoUrlb2f(currentTaller.urlVideo, youtubeType) : '',
                  videoNameS3: currentTaller.urlVideoS3? getVideoUrlb2f(currentTaller.urlVideoS3, s3Type) : '',
                  recurso1: currentTaller.resource1? getVideoUrlb2f(currentTaller.resource1, "recurso") : '',
                  recurso2: currentTaller.resource2? getVideoUrlb2f(currentTaller.resource2, "recurso") : '',
                  recurso3: currentTaller.resource3? getVideoUrlb2f(currentTaller.resource3, "recurso") : '',
                  descripcion: currentTaller.description? currentTaller.description :'',
                  submit: null
              }}
              validationSchema={Yup.object().shape({
                  titulo: Yup.string().required('El titulo es obligatorio'),
                  descripcion: Yup.string().required('La descripción es obligatoria')
              })}
              onSubmit={async (
                  values,
                  { resetForm, setErrors, setStatus, setSubmitting }
              ) => {
                  try {
                      // validar video YT o Archivo S3
                      if(selectedVideoType === 1 && values.videoName === "") {
                        return
                      } else if (selectedVideoType === 2 && video && (video.name === undefined || video.name === null)){
                        return
                      }

                      await registerEditTaller(values);
                      resetForm();
                      setStatus({ success: true });
                      setCurrentTaller({})
                  } catch (err) {
                      console.error(err);
                      setStatus({ success: false });
                      setErrors({ submit: err.message });
                      setSubmitting(false);
                  }
              }}
          >
              {({
                  errors,
                  handleChange,
                  handleSubmit,
                  handleBlur,
                  isSubmitting,
                  touched,
                  values
              }) => (
                  <form onSubmit={handleSubmit}>
                      <DialogContent
                          dividers
                          sx={{
                              p: 3
                          }}
                      >
                          <Card sx={{ display: 'flex', flexDirection: 'row', mb: 4 }}>
                              <Grid xs={12} sm={12} md={12}>
                                  <Grid
                                      container
                                      spacing={0}
                                      direction="column"
                                      justifyContent="center"
                                      paddingLeft={2}
                                      paddingRight={2}
                                  >

                                      {/* TITULO */}
                                      <Grid
                                          sx={{
                                              mb: `${theme.spacing(1)}`,
                                              mt: `${theme.spacing(2)}`
                                          }}
                                          item
                                          xs={12}
                                          sm={8}
                                          md={9}
                                      >
                                          <TextField
                                              error={Boolean(touched.titulo && errors.titulo)}
                                              fullWidth
                                              helperText={touched.titulo && errors.titulo}
                                              name="titulo"
                                              placeholder="Título"
                                              label="Título"
                                              onBlur={handleBlur}
                                              onChange={handleChange}
                                              value={values.titulo}
                                              variant="outlined"
                                          />
                                      </Grid>

                                      {/* DESCRIPCION */}
                                      <Grid
                                          sx={{
                                              my: `${theme.spacing(1)}`
                                          }}
                                          item
                                          xs={12}
                                          sm={8}
                                          md={9}
                                      >
                                          <TextField
                                              error={Boolean(touched.descripcion && errors.descripcion)}
                                              fullWidth
                                              helperText={touched.descripcion && errors.descripcion}
                                              name="descripcion"
                                              placeholder="Descripción"
                                              label="Descripción"
                                              onBlur={handleBlur}
                                              onChange={handleChange}
                                              value={values.descripcion}
                                              variant="outlined"
                                              multiline
                                              minRows={6}
                                          />
                                      </Grid>

                                      {/* VIDEO */}
                                      <Grid
                                          item
                                          xs={12}
                                          sm={4}
                                          md={3}
                                          justifyContent="flex-end"
                                          textAlign={{ sm: 'left' }}
                                      >
                                          <Box
                                              pr={3}
                                              sx={{
                                                  pt: `${theme.spacing(2)}`,
                                                  pb: { xs: 1, md: 0 }
                                              }}
                                              alignSelf="center"
                                          >
                                              <span>Video:</span>
                                          </Box>
                                          <FormControl sx={{width:"20%", my:2}}>
                                            <InputLabel id="demo-simple-select-label">Origen de video</InputLabel>
                                            <Select
                                              labelId="demo-simple-select-label"
                                              value={selectedVideoType}
                                              label="Origen de video"
                                              onChange={handleChangeVideoType}
                                            >
                                              <MenuItem value={1}>Link de Youtube</MenuItem>
                                              <MenuItem value={2}>Archivo .mp4</MenuItem>
                                            </Select>
                                          </FormControl>
                                      </Grid>
                                      { selectedVideoType === 1 && <Grid
                                          sx={{
                                              mt: `${theme.spacing(1)}`,
                                              mb: `${theme.spacing(3)}`
                                          }}
                                          item
                                          xs={12}
                                          sm={8}
                                          md={9}
                                      >
                                        <TextField
                                          error={Boolean(selectedVideoType === 1 && touched.videoName && values.videoName === "")}
                                          fullWidth
                                          helperText={touched.videoName &&  values.videoName === "" && "El link del video es obligatorio"}
                                          name="videoName"
                                          placeholder="Url"
                                          label="Url"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.videoName}
                                          variant="outlined"
                                          />
                                      
                                      </Grid>}
                                      {selectedVideoType === 2 && <Grid
                                          sx={{
                                              mt: `${theme.spacing(1)}`,
                                              mb: `${theme.spacing(3)}`
                                          }}
                                          item
                                          xs={12}
                                          sm={8}
                                          md={9}
                                      >
                                        <div>
                                      <DropzoneAIM
                                          isDragAccept={isDragAcceptVideo}
                                          isDragActive = {isDragActiveVideo}
                                          isDragReject = {isDragRejectVideo}
                                          getInputProps={getInputVideo}
                                          getRootProps = {getRootVideo}
                                          acceptText = "Máximo un archivo .mp4"
                                          files={video || {}}
                                          setNewFiles={setVideo}
                                          />
                                      </div>
                                      {/* Error */}
                                      {((editMode && ((s3Data.nombreOriginal === "" || values.videoNameS3 === "" || s3Data.nombreOriginal === "NULO") &&
                                        (video && (video.name === undefined || video.name === null)) ) ) 
                                        || (!editMode && (values.videoNameS3 === "" && (video && (video.name === undefined || video.name === null))))) &&
                                        <span style={{fontSize: "13px", color:"#FF1943", marginTop:"8px", marginLeft:"8px"}}>
                                        <b>El archivo de video es obligatorio</b>
                                      </span>}
                                      {/* Videos */}
                                      {!editMode && values.videoNameS3 !== "" && video && (video.name === undefined || video.name === null)&& 
                                        <Alert
                                          sx={{
                                              py: 0,
                                              mt: 2,
                                              color: "#000"
                                          }}
                                          icon={<InsertDriveFileOutlinedIcon fontSize="inherit" />}
                                          severity="info"
                                          variant="outlined"
                                        >
                                          <div style={{display:"flex"}}>
                                            <div>
                                              {values.videoNameS3}
                                            </div>
                                          </div>
                                        </Alert>
                                      }
                                      {editMode && video.name === undefined && (s3Data.nombreOriginal !== "" || values.videoNameS3 !== "")&& s3Data.nombreOriginal !== "NULO" && 
                                        <Alert
                                          sx={{
                                              py: 0,
                                              mt: 2,
                                              color: "#000"
                                          }}
                                          onClose={() => {setS3Data({nombreOriginal: "NULO", nombreEnS3: s3Data.nombreEnS3, urlS3: s3Data.urlS3})}}
                                          closeText = "Eliminar"
                                          icon={<InsertDriveFileOutlinedIcon fontSize="inherit" />}
                                          severity="info"
                                          variant="outlined"
                                        >
                                          <div style={{display:"flex"}}>
                                            <div>
                                              {values.videoNameS3}
                                            </div>
                                            {editMode && <IconButton onClick={() => {downloadFile(s3Data)}} sx={{padding: 0, color: "rgb(98 94 135)", ml: "1rem"}}>
                                              <FileDownloadRoundedIcon/> 
                                            </IconButton>}
                                          </div>
                                        </Alert>
                                      }
                                      </Grid>}

                                      {/* RESOURCES */}
                                      <Grid
                                          item
                                          xs={12}
                                          sm={4}
                                          md={3}
                                          justifyContent="flex-end"
                                          textAlign={{ sm: 'left' }}
                                      >
                                          <Box
                                              pr={3}
                                              sx={{
                                                  pt: `${theme.spacing(2)}`,
                                                  pb: { xs: 1, md: 0 }
                                              }}
                                              alignSelf="center"
                                          >
                                              <span>Recursos (opcional):</span>
                                          </Box>
                                      </Grid>
                                      <Grid
                                          sx={{
                                              mt: `${theme.spacing(1)}`,
                                              mb: `${theme.spacing(3)}`
                                          }}
                                          item
                                          xs={12}
                                          sm={8}
                                          md={9}
                                      >
                                          <DropzoneAIM
                                              isDragAccept={isDragAcceptResource}
                                              isDragActive = {isDragActiveResource}
                                              isDragReject = {isDragRejectResource}
                                              getInputProps={getInputRecursos}
                                              getRootProps = {getRootRecursos}
                                              acceptText = "Máximo 3 archivos .pdf .docx .doc .pptx .ppt .xls"
                                              files={recursos || []}
                                              setNewFiles={setRecursos}
                                              multiple
                                          />
                                          {editMode && (recursos[0] === undefined ||  recursos[0].name === undefined) && (rec1.nombreOriginal !== "" || values.recurso1 !== "")&& rec1.nombreOriginal !== "NULO" && 
                                            <Alert
                                              sx={{
                                                  py: 0,
                                                  mt: 2,
                                                  color: "#000"
                                              }}
                                              onClose={() => {setRec1({nombreOriginal: "NULO", nombreEnS3: rec1.nombreEnS3, urlS3: rec1.urlS3})}}
                                              closeText = "Eliminar"
                                              icon={<InsertDriveFileOutlinedIcon fontSize="inherit" />}
                                              severity="info"
                                              variant="outlined"
                                            >
                                              <div style={{display:"flex"}}>
                                                <div>
                                                  {values.recurso1}
                                                </div>
                                                <IconButton onClick={() => {downloadFile(rec1)}} sx={{padding: 0, color: "rgb(98 94 135)", ml: "1rem"}}>
                                                  <FileDownloadRoundedIcon/> 
                                                </IconButton>
                                              </div>
                                            </Alert>
                                          }
                                          {editMode && (recursos[1] === undefined ||  recursos[1].name === undefined) && (rec2.nombreOriginal !== "" || values.recurso2 !== "")&& rec2.nombreOriginal !== "NULO" && 
                                            <Alert
                                              sx={{
                                                  py: 0,
                                                  mt: 2,
                                                  color: "#000"
                                              }}
                                              onClose={() => {setRec2({nombreOriginal: "NULO", nombreEnS3: rec2.nombreEnS3, urlS3: rec2.urlS3})}}
                                              closeText = "Eliminar"
                                              icon={<InsertDriveFileOutlinedIcon fontSize="inherit" />}
                                              severity="info"
                                              variant="outlined"
                                            >
                                              <div style={{display:"flex"}}>
                                                <div>
                                                  {values.recurso2}
                                                </div>
                                                <IconButton onClick={() => {downloadFile(rec2)}} sx={{padding: 0, color: "rgb(98 94 135)", ml: "1rem"}}>
                                                  <FileDownloadRoundedIcon/> 
                                                </IconButton>
                                              </div>
                                            </Alert>
                                          }
                                          {editMode && (recursos[2] === undefined || recursos[2].name === undefined) && (rec3.nombreOriginal !== "" || values.recurso3 !== "")&& rec3.nombreOriginal !== "NULO" && 
                                            <Alert
                                              sx={{
                                                  py: 0,
                                                  mt: 2,
                                                  color: "#000"
                                              }}
                                              onClose={() => {setRec3({nombreOriginal: "NULO", nombreEnS3: rec3.nombreEnS3, urlS3: rec3.urlS3})}}
                                              closeText = "Eliminar"
                                              icon={<InsertDriveFileOutlinedIcon fontSize="inherit" />}
                                              severity="info"
                                              variant="outlined"
                                            >
                                              <div style={{display:"flex"}}>
                                                <div>
                                                  {values.recurso3}
                                                </div>
                                                <IconButton onClick={() => {downloadFile(rec3)}} sx={{padding: 0, color: "rgb(98 94 135)", ml: "1rem"}}>
                                                  <FileDownloadRoundedIcon/> 
                                                </IconButton>
                                              </div>
                                            </Alert>
                                          }
                                      </Grid>

                                  </Grid>
                              </Grid>
                          </Card>

                          <Grid
                              sx={{
                                  mb: `${theme.spacing(3)}`
                              }}
                              container
                              justifyContent="center"
                              margin="auto"
                              item
                              xs={12}
                              sm={8}
                              md={9}
                          >
                              <Button
                                  sx={{
                                      mr: 2
                                  }}
                                  type="submit"
                                  startIcon={
                                      isSubmitting ? <CircularProgress size="1rem" /> : null
                                  }
                                  disabled={Boolean(errors.submit) || isSubmitting}
                                  variant="contained"
                                  size="small"
                                  color="secondary"
                              >
                                  {currentTaller.name? "Guardar Cambios": "Aceptar"}
                              </Button>
                              <Button
                                  color="secondary"
                                  size="small"
                                  variant="outlined"
                                  onClick={handleCreateTallerClose}
                              >
                                  Cancelar
                              </Button>
                          </Grid>
                      </DialogContent>
                  </form>
              )}
          </Formik>
      </Dialog>

      {/* Prueba Final */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openExamen}
        onClose={handleCloseExam}
      >
          <DialogTitle
              sx={{ p: 3 }}
          >
              <Typography variant="h4" gutterBottom>
                  Prueba Final del Nivel {selectedLevel && selectedLevel + 1 || ""}
              </Typography>
          </DialogTitle>
          <DialogContent
              dividers
              sx={{
                  p: 3,
                  background:"#F9F9F9"
              }}
          >
            <AddEditExam 
              indexNivel = {selectedLevel}
              nivelId = {niveles[selectedLevel]?.levelId || -1}
              currentExamen={currentExamen}
              registerExamen={registerExamen}
              handleCloseExam={handleCloseExam}
              handleOpenEditExamen={handleOpenEditExamen}
              editMode={editMode}
              successMessage = {successMessage}
              errorMessage={erroMessage}
            /> 
          </DialogContent>
      </Dialog>
      
      {/* Eliminar Taller */}
      <DeleteModal
        openConfirmDelete={openDeleteTaller}
        closeConfirmDelete={deleteTallerClose}
        title="Eliminar taller"
        itemName={` el taller ${currentTaller?.name || "" }`}
        handleDeleteCompleted={deleteTaller}
      />

       {/* Eliminar Nivel */}
      <DeleteModal
        openConfirmDelete={openDeleteNivel}
        closeConfirmDelete={deleteNivelClose}
        title="Eliminar nivel"
        itemName={` el Nivel ${selectedLevel + 1 || "" }`}
        handleDeleteCompleted={removerNivel}
      >
        {selectedLevel !== -1 && niveles[selectedLevel]?.steps.length>0?
            (<div>
            Contiene los talleres:
            <ul>
            {niveles[selectedLevel].steps.map( (e, index) => {
              return <li key={index}>
                {e.name}
              </li>
            })}
            </ul>
          </div>) :
          (
            <div>
              No contiene talleres
            </div>
          )
        }
      </DeleteModal>

    </div>

    
  );
}

export default Levels;