import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
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
  // styled,
  // useTheme,
  TextField
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import Icon from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
// const IconButtonWrapper = styled(IconButton)(
//   ({ theme }) => `
//     transition: ${theme.transitions.create(['transform', 'background'])};
//     transform: scale(1);
//     transform-origin: center;

//     &:hover {
//         transform: scale(1.1);
//     }
//   `
// );

const applyFilters = (associated, query, filters) => {
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

const applyPagination = (associated, page, limit) => {
  return associated.slice(page * limit, page * limit + limit);
};

const Results = ({ associated }) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    status: null
  });
  const [openAccordion, setOpenAccordion] = useState(false);

  // const { user } = useAuth();

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredAssociated = applyFilters(associated, query, filters);
  const paginatedAssociated = applyPagination(filteredAssociated, page, limit);

  return (
    <>
      {/* <Card
        sx={{
          p: 1,
          mb: 3
        }}
      > */}
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
      {/* </Card> */}

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
            <b>{paginatedAssociated.length}</b> <b>cliente(s)</b>
          </Box>
          <TablePagination
            component="div"
            count={filteredAssociated.length}
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
                    <TableCell>Nombre(s)</TableCell>
                    <TableCell>Apellido Paterno</TableCell>
                    <TableCell>Apellido Materno</TableCell>
                    <TableCell>``</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssociated.map((associated, idx) => {
                    return (
                      <>
                        <TableRow hover key={idx} onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)} sx={{cursor: 'pointer'}}>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {associated.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {associated.fatherLastName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography noWrap variant="h5">
                              {associated.motherLastName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Icon
                              aria-label="expand row"
                              size="small"
                              onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)}
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
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <img
                                  src={`${associated.photo}`}
                                  alt={associated.name}
                                  styles={{ minWidth: '1rem', minHeight: '1rem', aspectRatio: '1/1'}}
                                />
                                <Box sx={{p: { xs: 1, sm: 2 }, display: 'flex'}}>
                                  <Box sx={{p: { xs: 1, sm: 2 }}}>
                                    <Typography noWrap variant="h5">Estadísticas de clases </Typography>
                                    <ul>
                                      <li>Clases tomadas: {associated.stats.takenClasses}</li>
                                      <li>Clases canceladas: {associated.stats.canceledClasses}</li>
                                    </ul>
                                  </Box>

                                  <Box sx={{p: { xs: 1, sm: 2 }}}>
                                    <Typography noWrap variant="h5">Estadísticas de cursos </Typography>
                                    <ul>
                                      <li>Cursos elegidos {associated.stats.chosenCourses}</li>
                                      <li>Profesoras elegidas: {associated.stats.chosenTeachers}</li>
                                    </ul>
                                  </Box>

                                  <Box sx={{p: { xs: 1, sm: 2 }}}>
                                    <Typography noWrap variant="h5">Comportamiento</Typography>
                                    <ul>
                                      <li>Denuncias: {associated.stats.complaints}</li>
                                    </ul>
                                  </Box>                                  
                                </Box>

                                <Box sx={{p: 2, display: 'flex', flexDirection: 'column'}}>
                                  <Button
                                    sx={{
                                      my: { xs: 1, sm: 1 },
                                    }}
                                    onClick={() => console.log('Redirecting to Monitoreo...')}
                                    variant="contained"
                                    startIcon={<VisibilityIcon fontSize="small" />}
                                  >
                                    Monitorear
                                  </Button>
                                  <Button
                                    sx={{
                                      my: { xs: 1, sm: 1 },
                                    }}
                                    onClick={() => console.log('Redirecting to Perfil Asociada...')}
                                    variant="contained"
                                    startIcon={<BlockIcon fontSize="small" />}
                                  >
                                    Bloquear
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
                count={filteredAssociated.length}
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
  associated: PropTypes.array.isRequired
};

Results.defaultProps = {
  associated: []
};

export default Results;
