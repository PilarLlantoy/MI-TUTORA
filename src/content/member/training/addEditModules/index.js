import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useCallback, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { DefaultTraining } from 'src/utils/assets';
import { useDropzone } from 'react-dropzone';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    TextField,
    CircularProgress,
    Button,
    Card,
    Zoom,
    useTheme,
    IconButton,
    Paper,
    useMediaQuery,
    Alert,
    FormGroup,
    FormControlLabel,
    Switch,
    Tooltip,
} from '@mui/material';

import { useSnackbar } from 'notistack';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import certifyAxios from 'src/utils/aimAxios';
import DropzoneAIM from 'src/components/DropzoneAIM';
import certifyAxios from 'src/utils/aimAxios';
import useRefMounted from 'src/hooks/useRefMounted';
import { uploadFileHandle } from 'src/content/awstest';
import { generateTrainingUrlS3 } from 'src/utils/training';
import { createBackUrl, getNameAndUrlFromBack } from 'src/utils/awsConfig';
import Levels from './Levels';

/* const nuevoNivel = {
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
        urlVideo: ""
    }]
} */

function addEditModules() {

    const [module, setModule] = useState(undefined);
    const [niveles, setNiveles] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editInfo, setEditInfo] = useState(false);
    const [urlImage, setUrlImage] = useState({nombreOriginal: "", nombreEnS3: "", urlS3: ""})
    const [videosRegister, setVideosRegister] = useState([])

    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const isMountedRef = useRefMounted();
    const { enqueueSnackbar } = useSnackbar();
    const isRowBased = useMediaQuery('(min-width: 500px)');

    const getModuleById  = useCallback(async (reqObj) => {
        try {
            const response = await certifyAxios.post(`/trainingModule/find`, reqObj);
            if (isMountedRef.current) {
                if(response.data){
                    setModule(response.data)
                    setNiveles(response.data.levels)
                    const urlBack = response.data.urlImage
                    setUrlImage(getNameAndUrlFromBack(urlBack))
                }
            }
        }catch (err) {
            console.error(err);
            setModule({})
            
            if (err.response) {
                console.log(err.response);
            } else if (err.request) {
                console.error(err.request);
            } else {
                console.error('Servicio encontró un error');
            }
            enqueueSnackbar("El servicio ha encontrado un error", {variant:"error"})
        }

    }, [isMountedRef])

    useEffect(()=>{
        // console.log("STATE LOCATION - ", location.state)
        if(location.state.moduleId !== -1){
            setEditMode(true);
            const request = {
                "id": location.state.moduleId
            }
            getModuleById(request);
        } else {
            setModule({})
            setNiveles([{
                order: 0,
                questions: [{
                    alternativeA: '',
                    alternativeB: '',
                    alternativeC: '',
                    alternativeD: '',
                    correctAnswer: 0,
                    statement: '', 
                    score: 0,
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
            }])
            setVideosRegister([{
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
            }])
        }
        
    }, [getModuleById])

    useEffect(()=>{
        console.log("AIM")
        
    }, [setModule, setNiveles])
    
    const returnToCapacitations = () => {
        setModule({})        
        navigate('/aim/member/capacitations');
    };
    
    // Upload files
    const [portada, setPortada] = useState({}); 

    const {
        isDragActive: isDragActivePortada,
        isDragAccept: isDragAcceptPortada,
        isDragReject: isDragRejectPortada,
        getRootProps: getRootPortada,
        getInputProps: getInputPortada
    } = useDropzone({
        accept: 'image/jpeg, image/png',
        maxFiles: 1,
        onDrop: (acceptedFile) => {
            if(acceptedFile[0]!== undefined){
                setUrlImage({nombreOriginal: "NULO", nombreEnS3: urlImage.nombreEnS3, urlS3: urlImage.urlS3})
                setPortada(
                  Object.assign(acceptedFile[0], {
                    preview: URL.createObjectURL(acceptedFile[0]),
                  }),
                );
            }
        },
    });

    const handleModuleSuccess = (message) => {
        enqueueSnackbar(message, {
            variant: 'success',
            TransitionComponent: Zoom
        });
    };

    const handleModuleError = (message) => {
        enqueueSnackbar(message, {
            variant: 'error',
            TransitionComponent: Zoom
        });
    };

    // DATOS PARA LA IMAGEN
    const [openI, setOpenI] = useState(false);
    const handleImageOpen = () => {
        setOpenI(true);
    };
    const handleImageClose = () => {
        setOpenI(false);
    };


    const removePortada = () => {
        setPortada({})
        setUrlImage({nombreOriginal: "NULO", nombreEnS3: urlImage.nombreEnS3, urlS3: urlImage.urlS3})
    }

    const validateModuleRegister = () =>{
        let valid = true;
        let validExams = true;
        let validTalleres = true;
        let nivelesTallerError = []
        let nivelesExamError = []
        niveles.forEach((nivel, index) => {
            const examen = nivel.questions;
            const talleres = nivel.steps;
            // Validar talleres
            talleres.forEach( t => {
                if(t.name.length===0 || t.description.length===0 || (t.urlVideo.length===0 && t.urlVideoS3.length===0)){
                    validTalleres = false
                    nivelesTallerError.push(index)
                    valid = false
                }
            })
            // Validar preguntas
            examen.forEach( q =>{
                if(q.statement.length===0 || q.alternativeA.length===0 || q.alternativeB.length===0 ||
                    q.alternativeC.length===0 || q.alternativeD.length===0){
                    validExams = false
                    nivelesExamError.push(index)
                    valid = false
                }
            })
        })

        if(!validExams && !validTalleres){
            enqueueSnackbar("Debe completar talleres y pruebas de los niveles", {variant:"error"})
        } else if(!validExams){
            enqueueSnackbar("Debe completar la prueba de los niveles", {variant:"error"})
        } else if (!validTalleres){
            enqueueSnackbar("Debe completar todos los talleres de los niveles", {variant:"error"})
        }
        return valid;
    }

    const uploadVideos = async () => {
        const temp = [...niveles]
        await Promise.all(videosRegister.map( async (level, index) => {
            if(level.steps  && level.steps.length > 0){
                await Promise.all(level.steps.map(async (step, indexStep) => {
                    if(step && step.fileName && step.fileName !== "" && step.file.name !== undefined){
                        let nombreEnS3 = generateTrainingUrlS3("tallerVideo")
                        // llamada al S3
                        const urlToSave = await uploadFileHandle(step.file, nombreEnS3)
                        temp[index].steps[indexStep].urlVideoS3 = urlToSave
                    }
                    if(step && step.fileName1 && step.fileName1 !== "" && step.fileRec1.name !== undefined){
                        let nombreEnS3 = generateTrainingUrlS3("recurso")
                        // llamada al S3
                        const urlToSave = await uploadFileHandle(step.fileRec1, nombreEnS3)
                        temp[index].steps[indexStep].resource1 = urlToSave
                    }
                    if(step && step.fileName2 && step.fileName2 !== "" && step.fileRec2.name !== undefined){
                        let nombreEnS3 = generateTrainingUrlS3("recurso")
                        // llamada al S3
                        const urlToSave = await uploadFileHandle(step.fileRec2, nombreEnS3)
                        temp[index].steps[indexStep].resource2 = urlToSave
                    }
                    if(step && step.fileName3 && step.fileName3 !== "" && step.fileRec3.name !== undefined){
                        let nombreEnS3 = generateTrainingUrlS3("recurso")
                        // llamada al S3
                        const urlToSave = await uploadFileHandle(step.fileRec3, nombreEnS3)
                        temp[index].steps[indexStep].resource3 = urlToSave
                    }
                }) ) 
            }
        }))
        return temp
    }
    
    const handleFormSubmit = async (values) => {
        try {
            if (validateModuleRegister()){
                const tempLevels = await uploadVideos()
                // upload file
                let urlBack = ""
                if(portada && portada.name !== undefined && portada.name !== null){
                    urlBack = await uploadPortada()
                }
                if(portada && portada.name === undefined && urlImage.nombreOriginal === "NULO"){
                    urlBack = createBackUrl("NULO", urlImage.urlS3)
                }
                const {
                    nombre,
                    descripcion,
                    visible,
                    isOptional
                } = values;
                
                const request = {
                    "description": descripcion,
                    "levels": tempLevels,
                    "name": nombre,
                    "visible": visible? 1:0,
                    "isOptional": isOptional? 0:1,
                    "urlImage": urlBack || ""
                }
                
                // console.log("REQUEST ADD MODULE: ", request);
                const response = await certifyAxios.post('/trainingModule/register', request)
                console.log("BACK ADD MODULE: ", response)
                handleModuleSuccess('Se ha registrado el módulo satisfactoriamente');
                returnToCapacitations();
            }

        } catch (err) {
            if(err.resultCode === "1001"){
                enqueueSnackbar("Debe completar talleres y pruebas de los niveles", {variant:"error"})
            } else{
                enqueueSnackbar("Ha ocurrido un error", {variant:"error"})
            }
            console.error(err);
        }
    }
 
    const enableEditModule = () => {
        setEditInfo(true)
    }

    const disableEditModule = () => {
        setEditInfo(false);
    }

    const uploadPortada = async () => {

        // "nombreEnS3" debe ser unico en S3
        let nombreEnS3 = null
        // let nombreEnS3 = "capacitaciones-portada6NERrLv"
        if(editMode && urlImage && urlImage.nombreEnS3 !== ""){
            nombreEnS3 = urlImage.nombreEnS3
        } else {
            nombreEnS3 = generateTrainingUrlS3("portada")
        }
        // llamada al S3
        if(nombreEnS3 !== null){
            const urlToSave = await uploadFileHandle(portada, nombreEnS3)
            return urlToSave;
        }
        
        return ""
    }

    const editarModuleInfo = async (values, resetForm) => {
        try {
            // upload file
            let urlBack = module.urlImage
            if(portada && portada.name !== undefined && portada.name !== null){
                urlBack = await uploadPortada()
            }
            if(portada && portada.name === undefined && urlImage.nombreOriginal === "NULO"){
                urlBack = createBackUrl("NULO", urlImage.urlS3)
            }
            const {
                nombre,
                descripcion,
                visible,
                isOptional
            } = values;
            
            const request = {
                "description": descripcion,
                "name": nombre,
                "visible": visible? 1:0,
                "isOptional": isOptional? 0:1,
                "urlImage": urlBack || "",
                "moduleId": module.moduleId
            }
            // call back
            // console.log("REQUEST EDIT MODULE: ", request);
            const response = await certifyAxios.post('/trainingModule/update', request)
            console.log("Back editar: ", response)
            const requestFind = {
                "id": module.moduleId
            }
            await getModuleById(requestFind);
            disableEditModule()
            handleModuleSuccess('Se ha modificado el módulo satisfactoriamente');


        } catch (err) {
            if(err.resultCode === "1001"){
                enqueueSnackbar("Debe completar los datos", {variant:"error"})
            } else{
                enqueueSnackbar("Ha ocurrido un error", {variant:"error"})
                resetForm()
                disableEditModule()
            }
            console.error(err);
        }
    }
    
    return (
        <>
            <Helmet>
                <title>Module</title>
            </Helmet>

            { module !== undefined &&
                <Formik
                initialValues={{
                    nombre: module?.name || '',
                    descripcion: module?.description || '',
                    visible: module && module.visible === 1,
                    isOptional: module && module.isOptional===0,
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    nombre: Yup.string().required('El nombre es obligatorio'),
                    descripcion: Yup.string().required('La descripción es obligatorio')
                })}
                onSubmit={async (
                    values,
                    { resetForm, setErrors, setStatus, setSubmitting }
                ) => {
                    try {
                        if(editMode){
                            await editarModuleInfo(values, resetForm);
                        } else {
                            await handleFormSubmit(values);
                        }
                        setStatus({ success: true });
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
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values, 
                    resetForm
                }) => (
                    <form onSubmit={handleSubmit}>
                        <PageTitleWrapper>
                            <Grid container alignItems="center">
                                <Grid item xs={2} md={.5} sm = {.5}>
                                    <IconButton size="small" onClick={returnToCapacitations}>
                                        <KeyboardArrowLeftRoundedIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={10} md={6} sm={6} alignItems="left">
                                    <Typography variant="h3" component="h3" gutterBottom>
                                        {!editMode? "Crear módulo de capacitación": "Editar módulo de capacitación" }
                                    </Typography>
                                </Grid>
                                { (!editMode) && <Grid item
                                    xs={12} 
                                    sm={5} 
                                    md={5.5} 
                                    sx={{
                                        display: "flex", 
                                        [theme.breakpoints.up('sm')]:{justifyContent:"flex-end"},
                                        [theme.breakpoints.down('sm')]:{justifyContent:"center"}
                                    }}
                                >
                                    <Button
                                        sx={{
                                        mr: 2,
                                        }}
                                        type="submit"
                                        startIcon={
                                        isSubmitting ? <CircularProgress size="1rem" /> : null
                                        }
                                        disabled={Boolean(errors.submit) || isSubmitting}
                                        variant="outlined"
                                        size="small"
                                        color="secondary"
                                        
                                    >
                                        Añadir
                                    </Button>
                                    <Button
                                        color="error"
                                        size="small"
                                        variant="outlined"
                                        onClick={returnToCapacitations}
                                    >
                                        Cancelar
                                    </Button>
                                </Grid>}
                            </Grid>
                        </PageTitleWrapper>
                        <DialogContent
                            sx={{
                                p: 3
                            }}
                        >
                            
                            <Grid container
                            spacing={1}
                            paddingLeft={2}
                            paddingRight={0}
                            >
                                <Grid item xs={12} sm={12} md={8} sx={{pr:`${theme.spacing(2)}`}}>
                                    <Paper sx={{height:"100%"}}>
                                        <Grid
                                            container
                                            spacing={0}
                                            direction="column"
                                            paddingLeft={2}
                                            alignContent="stretch"
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                sm={4}
                                                md={3}
                                                wrap="nowrap"
                                                justifyContent="flex-end"
                                                textAlign={{ sm: 'left' }}
                                            >
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        pt: `${theme.spacing(2)}`,
                                                        pb: { xs: 1, md: 0 },
                                                        mt: `${theme.spacing(1)}`,
                                                        mb: `${theme.spacing(1)}`,
                                                        [theme.breakpoints.up('sm')]:{display:"flex"},
                                                        [theme.breakpoints.down('sm')]:{display:"inherit"}
                                                    }}
                                                    alignSelf="center"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                >
                                                    <b>Información General</b>
                                                    <div>
                                                        {(editMode && !editInfo) && <IconButton
                                                        color="primary"
                                                        sx={{ borderRadius: 30 }}
                                                        onClick={enableEditModule}
                                                        >
                                                            <CreateRoundedIcon/>
                                                        </IconButton>}
                                                        {editMode && editInfo && 
                                                            <div>
                                                                <Button
                                                                    sx={{
                                                                    mr: 2,
                                                                    }}
                                                                    type="submit"
                                                                    startIcon={
                                                                    isSubmitting ? <CircularProgress size="1rem" /> : null
                                                                    }
                                                                    disabled={Boolean(errors.submit) || isSubmitting}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    color="secondary"
                                                                >
                                                                    Guardar
                                                                </Button>
                                                                <Button
                                                                    color="error"
                                                                    size="small"
                                                                    variant="outlined"
                                                                    onClick={() => {
                                                                        disableEditModule(resetForm)
                                                                        resetForm({values:{
                                                                            nombre: module.name || "",
                                                                            descripcion: module.description || "",
                                                                            visible: module && module.visible === 1,
                                                                            isOptional: module && module.isOptional === 0,
                                                                            submit: null
                                                                        }})
                                                                    }}
                                                                >
                                                                    Cancelar
                                                                </Button>
                                                            </div>
                                                        }
                                                    </div>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    my: `${theme.spacing(1)}`,
                                                    paddingRight: 3
                                                }}
                                                item
                                                xs={12}
                                                sm={12}
                                                md={8}
                                            >
                                                <div style={{marginTop:1, paddingRight:2, justifyContent:"center", display:"flex", alignItems:"center"}}>
                                                <Alert
                                                    sx={{mr: 3}}
                                                    severity="primary"
                                                    >
                                                    {editMode? "La capacitación se encontrará disponible para las asociadas en caso habilite su publicación.":
                                                    "Esta capacitación se encuentra por defecto no publicada para las asociadas. Luego de crearla, podrá publicarla."}
                                                </Alert>
                                                {editMode && <FormGroup>
                                                    <FormControlLabel 
                                                    control={
                                                        <Switch 
                                                            onChange={handleChange}
                                                            name='visible'
                                                            checked={values.visible}
                                                            disabled={editMode && !editInfo} 
                                                        />
                                                    } 
                                                    label="Publicado" 
                                                    />
                                                </FormGroup>}
                                                </div>
                                            </Grid>
                                            {/* Nombre */}
                                            <Grid
                                                sx={{
                                                    my: `${theme.spacing(2)}`,
                                                    mr:`${theme.spacing(1)}`,
                                                    paddingRight: 3
                                                }}
                                                item
                                                xs={12}
                                                sm={12}
                                                md={8}
                                            >
                                                <TextField
                                                    error={Boolean(touched.nombre && errors.nombre)}
                                                    fullWidth
                                                    size='small'
                                                    helperText={touched.nombre && errors.nombre}
                                                    name="nombre"
                                                    placeholder="Nombre"
                                                    label="Nombre"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.nombre}
                                                    variant="outlined"
                                                    disabled={editMode && !editInfo}
                                                />
                                            </Grid>
                                            {/* Descripcion */}
                                            <Grid
                                                sx={{
                                                    my: `${theme.spacing(1)}`,
                                                    mr:`${theme.spacing(1)}`,
                                                    paddingRight: 3
                                                }}
                                                item
                                                xs={12}
                                                sm={8}
                                                md={8}
                                            > 
                                                <TextField
                                                    error={Boolean(touched.descripcion && errors.descripcion)}
                                                    fullWidth
                                                    helperText={touched.descripcion && errors.descripcion}
                                                    name="descripcion"
                                                    placeholder="Descripcion"
                                                    label="Descripcion"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.descripcion}
                                                    variant="outlined"
                                                    multiline
                                                    minRows={3}
                                                    disabled={editMode && !editInfo}
                                                />
                                            </Grid>
                                            {/* Obligatorio */}
                                            <Grid
                                                item
                                                xs={12}
                                                sm={4}
                                                md={3}
                                                paddingLeft={1}
                                                marginY={2}
                                                justifyContent="flex-end"
                                                textAlign={{ sm: 'left' }}
                                            >
                                                <div style={{display:"flex", alignItems:"center", justifyContent:"left"}}>
                                                    <FormGroup sx={{marginRight:3}}>
                                                        <FormControlLabel 
                                                        control={
                                                            <Switch 
                                                            onChange={handleChange}
                                                            name='isOptional'
                                                            checked={values.isOptional}
                                                            disabled={editMode && !editInfo} 
                                                            />
                                                        } 
                                                        label="Capacitación obligatoria" 
                                                        />
                                                    </FormGroup>
                                                    <Tooltip placement="right" title="La asociada debe aprobar la capacitación obligatoria para poder iniciar sus actividades de dictado" arrow key={3}>
                                                        <InfoOutlinedIcon sx={{color:"#fe7201a8"}}/>
                                                    </Tooltip>
                                                </div>
                                            </Grid>
                                            {/* Portada */}
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
                                                    <span>Foto de portada</span>
                                                </Box>
                                            </Grid>
                                            <Grid
                                                sx={{
                                                    mt: `${theme.spacing(0)}`,
                                                    mb: `${theme.spacing(3)}`,
                                                    mr:`${theme.spacing(1)}`
                                                }}
                                                item
                                                xs={8}
                                                sm={8}
                                                md={8}
                                            >
                                                
                                                <div style={{display: "flex", flexDirection: isRowBased? "row": "column", marginTop:`${theme.spacing(1)}`, alignContent:"center"}}>
                                                    <div style={{position:"relative"}}>
                                                        <img
                                                            style={{ width: isRowBased?"250px":"90%", height: "145px", margin: "0", display: "block" }}
                                                            src={urlImage && urlImage.nombreOriginal !== "NULO" && urlImage.urlS3 !== ""? urlImage.urlS3 : portada.preview? portada.preview : DefaultTraining}
                                                            alt="Portada"
                                                        /> 
                                                    </div>
                                                    {((editMode && editInfo) || !editMode) && <div style={{alignItems:"flex-start", paddingLeft:`${theme.spacing(2)}`}}>
                                                        <div style={{marginBottom:`${theme.spacing(1)}`}}>
                                                            <Button size="small" color="secondary" onClick={handleImageOpen} startIcon={<CreateRoundedIcon/>}>
                                                                Cambiar imagen
                                                            </Button>
                                                        </div>
                                                        {(portada.preview || (urlImage.urlS3 && urlImage.urlS3 !== "")) && <div>
                                                            <Button size="small" color="error" onClick={removePortada} startIcon={<DeleteRoundedIcon/>}>
                                                                Eliminar imagen
                                                            </Button>
                                                        </div>}
                                                    </div>}
                                                </div>
                                            </Grid>

                                        </Grid>
                                    </Paper>
                                </Grid>
                                <Grid
                                    item
                                    xs={11.5}
                                    sm={11.5}
                                    md={4}
                                    >
                                <Paper sx={{
                                    height:"100%",
                                    minHeight:"75vh",
                                    overflow:"hidden",
                                    mb: `${theme.spacing(1)}`
                                }}>
                                        <Grid
                                            container
                                            spacing={0}
                                            direction="column"
                                            justifyContent="flex-start"
                                            alignItems="center"
                                            paddingLeft={0}
                                            paddingRight={1}
                                            minHeight="75vh"
                                            >
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(2)}`,
                                                    pl:`${theme.spacing(2)}`,
                                                    alignSelf:"normal"
                                                }}
                                                item
                                                xs={12}
                                                sm={12}
                                                md={12}
                                            >
                                                <Levels 
                                                    niveles ={niveles} 
                                                    setNiveles={setNiveles}
                                                    editMode={editMode}
                                                    moduleId = {location?.state?.moduleId || -1}
                                                    getModuleById = {getModuleById}
                                                    erroMessage={handleModuleError}
                                                    successMessage={handleModuleSuccess}
                                                    videosRegister={videosRegister}
                                                    setVideosRegister={setVideosRegister}
                                                />
                                            </Grid>

                                        </Grid>                      
                                    </Paper>
                                </Grid>
                            </Grid>
                           
                        </DialogContent>
                    </form>
                )}
                </Formik>
            }
            {/* Modal foto */}
            <Dialog
                fullWidth
                maxWidth="md"
                open={openI}
                onClose={handleImageClose}
            >
                <DialogTitle
                    sx={{ p: 3 }}
                >
                    <Typography variant="h4" gutterBottom>
                        Subir foto de portada
                    </Typography>
                </DialogTitle>
                <Formik
                    initialValues={{
                        imageFiles: ''
                    }}
                    validationSchema={Yup.object().shape({
                        imageFiles: Yup.number().required('La foto es obligatoria')
                    })}
                    onSubmit={async (
                        _values,
                        { resetForm, setErrors, setStatus, setSubmitting }
                    ) => {
                        try {
                            resetForm();
                            setStatus({ success: true });
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
                        handleSubmit,
                        isSubmitting,
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
                                            
                                            <Grid
                                                sx={{
                                                    mt: `${theme.spacing(3)}`,
                                                    mb: `${theme.spacing(3)}`
                                                }}
                                                item
                                                xs={12}
                                                sm={8}
                                                md={9}
                                            >
                                            <DropzoneAIM
                                                isDragAccept={isDragAcceptPortada}
                                                isDragActive = {isDragActivePortada}
                                                isDragReject = {isDragRejectPortada}
                                                getInputProps={getInputPortada}
                                                getRootProps = {getRootPortada}
                                                acceptText = ".png .jpg"
                                                files={portada}
                                                setNewFiles={setPortada}
                                            />
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
                                        onClick={handleImageClose}
                                        startIcon={
                                            isSubmitting ? <CircularProgress size="1rem" /> : null
                                        }
                                        disabled={Boolean(errors.submit) || isSubmitting}
                                        variant="contained"
                                        size="large"
                                        color="secondary"
                                    >
                                        Registrar
                                    </Button>
                                    <Button
                                        color="secondary"
                                        size="large"
                                        variant="outlined"
                                        onClick={handleImageClose}
                                    >
                                        Cancelar
                                    </Button>
                                </Grid>
                            </DialogContent>
                        </form>
                    )}
                </Formik>
            </Dialog>


            <Footer />
        </>
    )
};

export default addEditModules;