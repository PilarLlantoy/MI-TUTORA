import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { useSnackbar } from 'notistack';
import {
  Box,
  // Button,
  Card,
  Grid,
  Divider,
  // Tooltip,
  // IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  // Zoom,
  Typography,
  TextField,
  // Tooltip,
  // IconButton,
  // TextareaAutosize,
  // ThemeProvider
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Chip from '@mui/material/Chip';

/*
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import certifyAxios from 'src/utils/aimAxios';
import useRefMounted from 'src/hooks/useRefMounted';
import InfoIcon from '@mui/icons-material/Info';

// import { createTheme } from '@mui/material/styles';
// import StarIcon from '@mui/icons-material/Star';
/*
const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
    transition: ${theme.transitions.create(['transform', 'background'])};
    transform: scale(1);
    transform-origin: center;

    &:hover {
        transform: scale(1.1);
    }
  `
);
*/

const applyFilters = (associated, query, filters) => {
  // console.log(associated);
  return associated.filter((associated) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (associated[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && associated.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && associated[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};
/*
const applyPagination = (requests, page, limit) => {
  return requests.slice(page * limit, page * limit + limit);
};
*/

const ResultsProcessed = (props) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  // const theme = useTheme();
  // const [openDialogDetailsReport, setOpenDialogDetailsReport] = useState(false);
  // const [openDialogDetailsTopicRequest, setOpenDialogDetailsTopicRequest] = useState(false);
  // const { enqueueSnackbar } = useSnackbar();
  const [filters] = useState({
    status: null
  });

  // Cambio de Tema


  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  // Manejaremos las solicitudes de reporte de clientes
  // requestType: 2
  const handlePageChange = (_event, newPage) => {
    setPage(newPage);

    const reqObj = {
      "firstResult": newPage + 1,
      "maxResults": limit,
      "partnerName": "",
      "requestType": 2,
      "state": 12
    };
    props.onPageParamsChange(reqObj);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));

    const reqObj = {
      "firstResult": page + 1,
      "maxResults": event.target.value,
      "partnerName": "",
      "requestType": 2,
      "state": 12
    }
    props.onPageParamsChange(reqObj);
  };

  useEffect(() => {
    console.log('Received numberOfResults: ', props.numberOfResults);
    // console.log('requestId actualizados: ', requestId);
    // setRequestId(requestId);

  }, [props.numberOfResults]);

  const filteredAssociated = applyFilters(props.requests, query, filters);
  // const paginatedAssociated = applyPagination(filteredAssociated, page, limit);
  const paginatedAssociated = filteredAssociated;

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
                placeholder="Busque por nombres"
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
        >
          <Box>
            <Typography component="span" variant="subtitle1">
              Mostrando:
            </Typography>{' '}
            <b>{paginatedAssociated.length}</b> <b>solicitudes</b>
          </Box>
          <TablePagination
            component="div"
            count={props.numberOfResults}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </Box>
        <Divider />

        {paginatedAssociated.length === 0 ? (
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
              No se encontraron solicitudes
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Solicitante</TableCell>
                    <TableCell>Nro. de Solicitud</TableCell>
                    <TableCell>Fecha de Solicitud</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssociated.map((associated, idx) => {
                    let formattedDate = new Date(associated.requestDate);
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {associated.partnerName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            RP - 00{associated.requestId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {`${formattedDate.toLocaleDateString('es-ES')} ${formattedDate.toLocaleTimeString('es-ES')} hrs.`}
                          </Typography>
                        </TableCell>
                        {associated.state === 1 ? (
                          <>
                            <TableCell>
                              <Chip icon={<CheckCircleOutlineIcon />} label="Aceptada" variant="outlined" color="success" sx={{ color: "green" }} />
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>
                              <Chip icon={<HighlightOffIcon />} label="Rechazada" color="error" variant="outlined" />
                            </TableCell>
                          </>
                        )}

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
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          </>
        )}
      </Card>
    </>
  );
};

ResultsProcessed.propTypes = {
  requests: PropTypes.array.isRequired,
  onPageParamsChange: PropTypes.func,
  numberOfResults: PropTypes.number,
};

ResultsProcessed.defaultProps = {
  requests: [],
  onPageParamsChange: () => { },
  numberOfResults: 0
};

export default ResultsProcessed;
