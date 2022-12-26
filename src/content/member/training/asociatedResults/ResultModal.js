import { Box, CircularProgress, Dialog } from "@mui/material";
import { styled } from "@mui/system";
import { ExamenResultado } from "src/content/associated/capacitations/addEditExam";

const DialogWrapper = styled(Dialog)(
    () => `
        
  `
);

function ResultModal ({
    openConfirmDelete, 
    closeConfirmDelete,
    prueba,
    selectedName
}){

    const getPuntajeTotal = () => {
        let puntajeTotal = 0;
        if(prueba.questions !== undefined && prueba.questions.length > 0){
            prueba.questions.forEach((item) => {
            if(item && item.score > 0){
              puntajeTotal += item.score
            }
          })
        }
        return puntajeTotal;
    }

    const getEstadistica = () => {
        let correctas = 0;
        let errores = 0;
        if(prueba.questions !== undefined && prueba.questions.length > 0){
            prueba.questions.forEach((item) => {
            if(item && item.isCorrect !== undefined){
              if(item.isCorrect){
               correctas += 1
              } else {
                errores += 1
              }
            }
          })
        }
        return {correctas, errores};
      }

    return (
        <DialogWrapper
            open={openConfirmDelete}
            keepMounted
            onClose={closeConfirmDelete}
            maxWidth="md"
        >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={3}
        >
            {prueba !== undefined && prueba.questions !== undefined?
            <ExamenResultado
                examen={prueba.questions || []}
                miembro
                selectedName={selectedName}
                continuar={false}
                partnerScore={prueba.partnerScore || 0}
                puntajeTotal={getPuntajeTotal()}
                estaditica={getEstadistica()}
                nuevoIntento={prueba.passed !== null && prueba.passed===0}
                continuarNivel ={() => {}}
                lastLevel={-1}
                />
              :<div style={{ display: 'grid', justifyContent: 'center', paddingTop:"6rem" }}>
                <CircularProgress color="secondary" sx={{mb: "1rem", mx:"10rem"}}/>
              </div>
            }
        </Box>
      </DialogWrapper>
    )
}

export default ResultModal;