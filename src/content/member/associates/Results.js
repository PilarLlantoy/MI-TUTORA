import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Grid,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Typography,
  TextField
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import CallMissedOutgoingIcon from '@mui/icons-material/CallMissedOutgoing';
import Icon from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { getNameAndUrlFromBack } from 'src/utils/awsConfig';
import { formatNameCapitals } from 'src/utils/training';
import { useNavigate } from 'react-router-dom';

const applyFilters = (associated, query, filters) => {

  return associated.filter((associated) => {
    let matches = true;

    if (query) {
      const properties = ['fullName'];
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

const Results = (props) => {
  const [page, setPage] = useState(0); // current page number
  const [limit, setLimit] = useState(5); // page size
  const [query, setQuery] = useState('');

  const navigate = useNavigate();
  const [filters] = useState({
    status: null
  });
  const [openAccordion, setOpenAccordion] = useState(false);


  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const redirectToProfile = (id) => {
    console.log("Redirecting associated to profile");

    // to={`/aim/student/profile/${a.partnerId}`}
    navigate(`/aim/student/profile/${id}`);
    console.log(id);
  };
  const handlePageChange = (_event, newPage) => {

    setPage(newPage);

    const reqObj = {
      "firstResult": newPage + 1,
      "fullName": "",
      "maxResults": limit,
      // "suspended": +props.suspended - 1
    };
    props.onPageParamsChange(reqObj);
  };

  const handleLimitChange = (event) => {

    setLimit(parseInt(event.target.value));
    const reqObj = {
      "firstResult": 1,
      "fullName": "",
      "maxResults": event.target.value,
      // "suspended": +props.suspended - 1
    }
    setPage(0);
    props.onPageParamsChange(reqObj);
  };

  // useEffect(() => {
  //   console.log('Received numberOfResults: ', props.numberOfResults);
  // }, [props.numberOfResults])

  const filteredAssociated = applyFilters(props.associated, query, filters);
  const paginatedAssociated = filteredAssociated;

  return (
    <>
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

              variant="outlined"
            />
          </Box>
        </Grid>
      </Grid>

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
            <b>{paginatedAssociated.length}</b> <b>asociada(s)</b>
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
              No se encontraron asociadas
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>Foto</TableCell>
                    <TableCell>Nombre(s) / Información Académica</TableCell>
                    <TableCell>Calificación</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssociated.map((associated, idx) => {
                    return (
                      <>
                        <TableRow hover key={idx}
                          sx={{ cursor: 'pointer' }}>
                          <TableCell align='center'>
                            <img
                              alt='foto'
                              src={associated.photoUrl !== null ? (associated.photoUrl.split('#').length > 1 ? getNameAndUrlFromBack(associated.photoUrl).urlS3 : associated.photoUrl) : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'} style={{ borderRadius: '50%', width: '45px', height: '45px', objectFit: 'cover' }} />
                          </TableCell>

                          <TableCell>
                            <Typography noWrap variant="h5">
                              {formatNameCapitals(associated.fullName.replace(',', ''))}
                            </Typography>
                            <Typography
                              noWrap
                              variant="h6"
                              style={{
                                textTransform: "capitalize",
                                fontSize: "0.8rem",
                              }}
                            >
                              {associated.career !== null ? associated.career.toLowerCase() : "Sin carrera"}
                            </Typography>
                            <Typography
                              noWrap
                              style={{
                                fontSize: "0.75rem",
                              }}>
                              {associated.university !== null ? associated.university : "SIN UNIVERSIDAD"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {associated.qualification !== null ? ([...Array(parseInt(associated.qualification))].map(() => {
                              return <StarIcon color="warning" />;
                            })
                            ) : (
                              <Typography variant="h5">Sin calificación</Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            <Icon
                              aria-label="expand row"
                              size="small"
                              onClick={() => {
                                setOpenAccordion(openAccordion === idx ? -1 : idx);
                              }}
                            >
                              {openAccordion === idx ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </Icon>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell sx={{ paddingBottom: 0, paddingTop: 0, px: 5 }} colSpan={6}>
                            <Collapse in={openAccordion === idx} timeout="auto" unmountOnExit>
                              <Box
                                sx={{
                                  width: "100%",
                                  py: '1',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <Box sx={{ p: { xs: 1, sm: 2 }, display: 'flex' }}>

                                  <Box
                                    sx={{
                                      px: { xs: 1, sm: 3 },
                                      py: { xs: 1, sm: 1 }
                                    }}
                                  >
                                    <Typography
                                      noWrap
                                      variant="h5"
                                      sx={{
                                        paddingBottom: 1
                                      }}
                                    >
                                      Estadísticas de clases
                                    </Typography>

                                    &bull;&nbsp;Clases impartidas: {associated.stats.impartedClasses !== null ? associated.stats.impartedClasses : 0}<br />
                                    &bull;&nbsp;Clases postergadas: {associated.stats.postponedClasses !== null ? associated.stats.postponedClasses : 0}<br />
                                    &bull;&nbsp;Clases canceladas: {associated.stats.cancelledClasses !== null ? associated.stats.cancelledClasses : 0}
                                  </Box>

                                  <Box
                                    sx={{
                                      px: { xs: 1, sm: 3 },
                                      py: { xs: 1, sm: 1 }
                                    }}
                                  >
                                    <Typography
                                      noWrap
                                      variant="h5"
                                      sx={{
                                        paddingBottom: 1,
                                      }}
                                    >
                                      Estadísticas de cursos
                                    </Typography>
                                    &bull;&nbsp;Cursos que ofrece: {associated.stats.offeringCourses !== null ? associated.stats.offeringCourses : 0}<br />
                                    &bull;&nbsp;Clases impartidas: {associated.stats.activeBookings !== null ? associated.stats.activeBookings : 0}
                                  </Box>

                                  <Box
                                    sx={{
                                      px: { xs: 1, sm: 3 },
                                      py: { xs: 1, sm: 1 }
                                    }}
                                  >
                                    <Typography
                                      noWrap
                                      variant="h5"
                                      sx={{
                                        paddingBottom: 1,
                                      }}
                                    >
                                      Capacitaciones
                                    </Typography>
                                    &bull;&nbsp;Cursando: {associated.stats.currentCaps !== null ? associated.stats.currentCaps : 0}<br />
                                    &bull;&nbsp;Aprobadas: {associated.stats.passedCaps !== null ? associated.stats.passedCaps : 0}
                                  </Box>

                                  <Box
                                    sx={{
                                      px: { xs: 1, sm: 3 },
                                      py: { xs: 1, sm: 1 }
                                    }}
                                  >
                                    <Typography
                                      noWrap
                                      variant="h5"
                                      sx={{
                                        paddingBottom: 1,
                                      }}
                                    >
                                      Comportamiento
                                    </Typography>
                                    &bull;&nbsp;Denuncias: {associated.stats.complaints !== null ? associated.stats.complaints : 0}
                                  </Box>
                                </Box>

                                <Box
                                  sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <Button
                                    sx={{
                                      my: { xs: 1, sm: 1 },
                                      color: '#ffffff',
                                      backgroundColor: '#0077FF',
                                      ':hover': {
                                        background: '#014796',
                                      },
                                    }}
                                    onClick={() => redirectToProfile(associated.id)}
                                    variant="contained"
                                    startIcon={<CallMissedOutgoingIcon fontSize="small" />
                                    }
                                  >
                                    Ver Perfil
                                  </Button>

                                </Box>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
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

Results.propTypes = {
  associated: PropTypes.array.isRequired,
  onPageParamsChange: PropTypes.func,
  numberOfResults: PropTypes.number
};

Results.defaultProps = {
  associated: [],
  onPageParamsChange: () => { },
  numberOfResults: 555
};

export default Results;
