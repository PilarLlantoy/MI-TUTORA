import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box, Card, Divider, Table, TableBody, TableCell, TablePagination,
  TableContainer, TableRow, Typography, LinearProgress, Menu, MenuItem, Button
} from '@mui/material';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import CourseCard from './CourseCard'
// import useAuth from 'src/hooks/useAuth';

const periods = [
  {
    value: 'pendientes',
    text: 'Pendientes'
  },
  {
    value: 'finalizadas',
    text: 'Finalizadas'
  }
];


const Results = ({ isOptional = false , ...props}) => {
  const [limit, setLimit] = useState(5); // page size
  const [finalizadas, setFinalizadas] = useState(0);
  const actionRef3 = useRef(null);
  const [openPeriod, setOpenMenuPeriod] = useState(false);
  const [period, setPeriod] = useState(periods[0].text);

  const handlePageChange = (_event, newPage) => {
    props.setPageNumber(newPage);

    const reqObj = {
      "firstResult": newPage + 1,
      "maxResults": limit,
      "partnerId": props.userInfo,
      "isFinished": 0,
      "isOptional": isOptional,
    };

    props.onPageParamsChange(reqObj)
  };

  const handleLimitChange = (event) => {    
    setLimit(parseInt(event.target.value));
    props.setPageNumber(0) // Retorna a la pagina 1 cuando cambia de limit

    const reqObj = {
      "firstResult": 1,
      "maxResults": event.target.value,
      "partnerId": props.userInfo,
      "isFinished": finalizadas,
      "isOptional": isOptional,
    } 

    props.onPageParamsChange(reqObj);
  };

  const handleChangeFinalizadas = (value) => {
    let finalizada = 0
    if(value === periods[1].value){
      finalizada = 1
    }
    const reqObj = {
      "firstResult": 1,
      "maxResults": limit,
      "partnerId": props.userInfo,
      "isFinished": finalizada,
      "isOptional": isOptional,
    }
    setFinalizadas(finalizada)
    props.finalizadasParamsChange(reqObj)
  }

  const paginatedTraining = props.trainings;

  return (
    <>
      <Card>
        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mr={3}
        >
          <Box>
            <Typography component="span" variant="subtitle1">
              Mostrando:
            </Typography>{' '}
            <b>{paginatedTraining.length}</b> <b>capacitacion(es) {!finalizadas?" pendientes" : "finalizadas"}</b> 
          </Box>
          <Box>
            <Button
              size="small"
              variant="outlined"
              ref={actionRef3}
              onClick={() => setOpenMenuPeriod(true)}
              endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
            >
              {period}
            </Button>
          </Box>
          <Menu
            disableScrollLock
            anchorEl={actionRef3.current}
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
                  handleChangeFinalizadas(_period.value)
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
        {props.loading &&
              <LinearProgress color="secondary" sx={{width:"90%", mx:"2rem", my:"2rem"}}/>
        }
        {!props.loading && (paginatedTraining.length === 0 ? (
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
                <TableBody>
                  {paginatedTraining.map((training, idx) => {
                    return (
                      <TableRow key={idx} >
                        <TableCell sx={{borderBottom: "none",paddingY:"5px"}}>
                          <CourseCard module={training} finalizada={training.progress ===  1 || false} finalizadaSelected ={finalizadas}/>
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
        ))}
      </Card>
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
