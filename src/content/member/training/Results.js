import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Card, Grid, Divider, InputAdornment, Table, TableBody, TableCell, TableHead, TablePagination,
  TableContainer, TableRow, Typography, TextField, IconButton, Button, Menu, MenuItem
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { cortarTexto } from 'src/utils/training';
import DeleteModal from './DeleteModal';

const periods = [
  {
    value: 'publicadas',
    text: 'Publicadas'
  },
  {
    value: 'no_publicadas',
    text: 'Sin publicar'
  }
];

const Results = (props) => {
  const [limit, setLimit] = useState(10); // page size
  const [query, setQuery] = useState('');
  const [openDelete, setOpenDelete] = useState(false)
  const [currentModule, setCurrentModule] = useState({})
  const actionRef2 = useRef(null);
  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [period, setPeriod] = useState(periods[0].text);

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
    if(event && event.target && event.target.value === ""){
      props.setPageNumber(0);
      const reqObj = {
        "firstResult": 1,
        "description": "",
        "maxResults": limit,
        "isOptional": props.isOptional,
        "isVisible": props.publicado
      };
      props.onPageParamsChange(reqObj);
    } else if(event?.target?.value && event.target.value.length >= 3){
      props.setPageNumber(0);
      const reqObj = {
        "firstResult": 1,
        "description": event.target.value,
        "maxResults": limit,
        "isOptional": props.isOptional,
        "isVisible": props.publicado
      };
      props.onPageParamsChange(reqObj);
    } 
  };

  const handlePageChange = (_event, newPage) => {
    props.setPageNumber(newPage);

    const reqObj = {
      "firstResult": newPage + 1,
      "description": "",
      "maxResults": limit,
      "isOptional": props.isOptional,
      "isVisible": props.publicado
    };

    props.onPageParamsChange(reqObj)
  };

  const handleLimitChange = (event) => {    
    setLimit(parseInt(event.target.value));
    props.setPageNumber(0) // Retorna a la pagina 1 cuando cambia de limit

    const reqObj = {
      "firstResult": 1,
      "description": "",
      "maxResults": event.target.value,
      "isOptional": props.isOptional,
      "isVisible": props.publicado
    } 

    props.onPageParamsChange(reqObj);
  };


  const deleteModuleOpen = (module) => {
    setCurrentModule(module)
    setOpenDelete(true)
  }

  const deleteModuleClose = () => {
    setCurrentModule({})
    setOpenDelete(false)
  }

  const deleteModule = () => {
    props.deleteModuleById(currentModule.moduleId, () => {
      deleteModuleClose()
      props.setPublicado(0)
      setPeriod(periods[0].text)
    })

  }

  const handleChangePublicado = (value) => {
    let publicado = 0
    if(value === periods[0].value){
      publicado = 1
    }

    const reqObj = {
      "firstResult": 1,
      "description": "",
      "maxResults": limit,
      "isOptional": props.isOptional,
      "isVisible": publicado
    }
    props.setPublicado(publicado)
    props.getTrainings(reqObj)
  }

  const paginatedTraining = props.trainings;

  const navigate = useNavigate();
  const navigateToResults = (id) => {
    navigate('/aim/member/module-asociated-results', {state:{moduleId: id}});
  };

  return (
    <>
      <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box p={1}>
              <TextField
                sx={{
                  m: 0
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleQueryChange}
                placeholder="Busque por nombre o descripción"
                value={query}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Card>
        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mr={2}
        >
          <Box>
            <Typography component="span" variant="subtitle1">
              Mostrando:
            </Typography>{' '}
            <b>{paginatedTraining.length}</b> <b>capacitacion(es) {!props.publicado? "no pubicadas" : "publicadas"}</b>
          </Box>
          <Box>
            <Button
              size="small"
              variant="outlined"
              ref={actionRef2}
              onClick={() => setOpenMenuPeriod(true)}
              endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
            >
              {period}
            </Button>
          </Box>
          <Menu
            disableScrollLock
            anchorEl={actionRef2.current}
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
                  handleChangePublicado(_period.value)
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
              No se encontraron capacitaciones
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre del módulo</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align='center'> Niveles</TableCell>
                    <TableCell align='center'> Publicado </TableCell>
                    <TableCell align='center'>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTraining.map((training, idx) => {
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {training && training.name || ""}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h5" sx={{maxWidth:"15rem"}}>
                            {training && cortarTexto(training.description)|| ""}
                          </Typography>
                        </TableCell>
                        <TableCell align='center'>
                          <Typography noWrap variant="h5">
                            {training && training.nlevels || ""}
                          </Typography>
                        </TableCell>
                        <TableCell align='center'>
                          {training && training.visible? 
                            <VisibilityIcon sx={{color: 'dimgrey'}}/>
                            :<VisibilityOffIcon sx={{color:'darkgrey'}}/>
                          }
                        </TableCell>
                        <TableCell align='center'>
                          <IconButton  
                            onClick={()=> navigateToResults(training.moduleId)}
                            sx={{
                                borderRadius:30, 
                                marginRight:"15px"
                            }}>
                              <QuizIcon/>
                          </IconButton>
                          <IconButton 
                          color="secondary" 
                          onClick={()=> props.navigateToModules(training.moduleId, props.isOptional)}
                          sx={{
                              borderRadius:30, 
                              marginRight:"15px"
                          }}>
                            <CreateRoundedIcon/>
                          </IconButton>
                          <IconButton color="error" sx={{borderRadius:30}}>
                            <DeleteRoundedIcon
                              onClick={()=> deleteModuleOpen(training)}
                            />                          
                          </IconButton>
                        </TableCell>
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
      {/* Eliminar module */}
      <DeleteModal
        openConfirmDelete={openDelete}
        closeConfirmDelete={deleteModuleClose}
        title="Eliminar capacitación"
        itemName={` la capacitación ${currentModule?.name || "" }`}
        handleDeleteCompleted={deleteModule}
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
