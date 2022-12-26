import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Card,  Divider, Table, TableBody, TableCell, TableHead, TablePagination,
  TableContainer, TableRow, Typography, IconButton, Button, Menu, MenuItem
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
// import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import certifyAxios from 'src/utils/aimAxios';
import { formatNameCapitals } from 'src/utils/training';
import ResultModal from './ResultModal';

const periods = [
  {
    value: 'asociada_terminado',
    text: 'Prueba terminada'
  },
  {
    value: 'asiacada_falta',
    text: 'Prueba sin rendir'
  }
];

const Results = (props) => {
  const [limit, setLimit] = useState(10); // page size
  const [open, setOpen] = useState(false)
  const [prueba, setPrueba] = useState({})
  const [selectedName, setSelectedName] = useState("")
  const actionRef1 = useRef(null);
  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [period, setPeriod] = useState(periods[0].text); // 0: prueba terminada, 1: no han rendido la prueba

  const handlePageChange = (_event, newPage) => {
    props.setPageNumber(newPage);

    const reqObj = {
      "firstResult": newPage + 1,
      "maxResults": limit,
      "levelId": props.selectedLevel.levelId,
      "type": 0
    };

    props.onPageParamsChange(reqObj)
  };

  const handleLimitChange = (event) => {    
    setLimit(parseInt(event.target.value));
    props.setPageNumber(0) // Retorna a la pagina 1 cuando cambia de limit

    const reqObj = {
      "firstResult": 1,
      "maxResults": event.target.value,
      "levelId": props.selectedLevel.levelId,
      "type": 0
    } 

    props.onPageParamsChange(reqObj);
  };

  const handleTipoChange = (value) => {
    const defaultObj = {
      "firstResult": 1,
      "maxResults": limit,
      "levelId": props.selectedLevel.levelId,
      "type": value === periods[1].value? 1: 0
    }
    props.getTrainings(defaultObj)
  }


  const respuestasOpen = (partnerId, name) => {
    setSelectedName(name)
    const request = {
      "levelId": props.selectedLevel.levelId,
      partnerId
    }
    obtenerRespuestaAsociada(request)
    setOpen(true)
  }

  const respuestasClose = () => {
    setSelectedName("")
    setPrueba({})
    setOpen(false)
  }

  const obtenerRespuestaAsociada = async (request) => {
    try {
      const response = await certifyAxios.post(`/trainingModule/admin/quiz/results/find`, request);
      if(response.data && response.data.message==="OK"){
        setPrueba(response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }


  const paginatedTraining = props.trainings;

  return (
    <>
      <Card elevation={0} sx={{border:"solid 1px lightgrey"}}>
        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography component="span" variant="subtitle1">
              Mostrando:
            </Typography>{' '}
            <b>{paginatedTraining.length}</b> <b>asociada(s) {period === periods[0].text? "con pruebas terminadas": "sin rendir prueba"}</b>
          </Box>
          <Box>
            <Button
              size="small"
              variant="outlined"
              ref={actionRef1}
              onClick={() => setOpenMenuPeriod(true)}
              endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
            >
              {period}
            </Button>
          </Box>
          <Menu
          disableScrollLock
          anchorEl={actionRef1.current}
          onClose={() => setOpenMenuPeriod(false)}
          open={openPeriod}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          {periods.map((_period) => (
            <MenuItem
              key={_period.value}
              onClick={() => {
                handleTipoChange(_period.value)
                setPeriod(_period.text);
                setOpenMenuPeriod(false);
              }}
            >
              {_period.text}
            </MenuItem>
          ))}
        </Menu>
        </Box>
        <Divider />

        {paginatedTraining.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              No se encontraron resultados de asociadas
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre de asociada</TableCell>
                    {period === periods[0].text &&
                      <>
                        <TableCell align='center'>Calificación final</TableCell> 
                        <TableCell align='center'>Intentos</TableCell> 
                        <TableCell align='center'>Respuestas</TableCell>
                      </>
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTraining.map((training, idx) => {
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {training && formatNameCapitals(training.name) || ""}
                          </Typography>
                        </TableCell>
                        {period === periods[0].text &&
                          <>
                            <TableCell align='center'>
                            <Typography noWrap variant="h5" sx={{color:training.passed?"#00d100":"red"}}>
                              {training && training.score ||"0"}
                            </Typography>
                          </TableCell>
                          <TableCell align='center'>
                            <Typography noWrap variant="h5">
                              {training && training.attempt || "0"}
                            </Typography>
                          </TableCell>
                          <TableCell align='center'>
                            <IconButton  
                              onClick={() => respuestasOpen(training.partnerId || -1, training.name)}
                              disabled={training && (training.attempt === 0 || training.attempt === null)}
                              sx={{
                                borderRadius:30, 
                                marginRight:"15px"
                              }}>
                                <VisibilityIcon sx={{color: training && training.attempt === 0?'darkgrey':'dimgrey'}}/>
                            </IconButton>
                          </TableCell>
                        </>
                      }
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                count={props.numberOfResults}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={props.pageNumber}
                rowsPerPage={limit}
                rowsPerPageOptions={[5,10,15]}
              />
          </Box>
          </>
        )}
      </Card>
      {/* Resultados Modal */}
      <ResultModal
        openConfirmDelete={open}
        closeConfirmDelete={respuestasClose}
        title="Cuestionario"
        prueba = {prueba}
        selectedName = {selectedName}
      />
    </>
  );
};

Results.propTypes = {
  trainings: PropTypes.array.isRequired
};

Results.defaultProps = {
  trainings: []
};

export default Results;
