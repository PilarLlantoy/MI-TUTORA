import { useState } from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useSnackbar } from 'notistack';
import {
  Box,
  Card,
  Grid,
  Divider,
  Tooltip,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Zoom,
  Typography,
  // styled,
  // useTheme,
  TextField,
  // /*
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  // */
} from '@mui/material';

// import useAuth from 'src/hooks/useAuth';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import certifyAxios from 'src/utils/aimAxios';
import { formatNameCapitals } from 'src/utils/training';

const applyFilters = (member, query, filters) => {
  return member.filter((member) => {
    let matches = true;

    if (query) {
      const properties = ['fullName'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (member[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && member.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && member[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};



// const applyPagination = (member, page, limit) => {
//  return member.slice(page * limit, page * limit + limit);
// };

const Results = (props) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [personId, setPersonId] = useState('');
  const [filters] = useState({
    status: null
  });
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // let memberId;

  // const [openAccordion, setOpenAccordion] = useState(false);
  // const { user } = useAuth();

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
    const reqObj = {
      "firstResult": newPage + 1,
      "fullName": "",
      "maxResults": limit,
      "suspended": 0
    }
    props.onPageParamsChange(reqObj);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));

    const reqObj = {
      "firstResult": 1,
      "fullName": "",
      "maxResults": event.target.value,
      "suspended": 0
    }
    setPage(0);
    props.onPageParamsChange(reqObj);

  };

  const handleDeleteSuccess = () => {
    console.log("Delete Success");

    // props.onDeleteSuccess();
    enqueueSnackbar('Miembro eliminado', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    setOpen(false);
  };

  const handleDeleteError = (message) => {
    enqueueSnackbar(`Hubo un error en el registro. Error ${message}`,
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
  };

  const handleDeleteClick = async () => {
    console.log("Delete");
    try {
      let idx = localStorage.getItem('memberId');
      console.log(idx);
      console.log("Person: ", personId);
      const response = await certifyAxios.post(`/person/member/delete/${personId}`);
      console.log('Server response: ', response.data);
      console.log('Server: ', response);
      handleDeleteSuccess();

      props.getMembers({
        "firstResult": 1,
        "fullName": "",
        "maxResults": 5,
        "suspended": 0
      });
      console.log("Success Delete");
    } catch (err) {
      handleDeleteError(err.status);
      console.log(err);

      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Error desconocido');
      }
    }
  }

  // Para modal
  const handleOpenModal = (member) => {
    setOpen(true);
    // console.log("Open Modal");
    console.log(member);
    setPersonId(member.personId);
    localStorage.setItem('memberId', member.userId);
    localStorage.setItem('personID', member.personId);
    localStorage.setItem('memberName', member.fullName);
    let memberId = localStorage.getItem('memberId');
    let personID = localStorage.getItem('personID');
    console.log(memberId);
    console.log("Person1: ", personId);
    console.log("Person2: ", personID);
  }

  const handleCloseModal = () => {
    setOpen(false);
  }

  const filteredMember = applyFilters(props.member, query, filters);
  const paginatedMember = filteredMember;
  // const filteredMember = applyFilters(member, query, filters);
  // const paginatedMember = applyPagination(filteredMember, page, limit);

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
            <b>{paginatedMember.length}</b> <b>miembros AIM</b>
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

        {paginatedMember.length === 0 ? (
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
              No se encontraron Miembros AIM
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre Completo</TableCell>
                    <TableCell>Correo</TableCell>
                    <TableCell>Celular</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedMember.map((member, idx) => {
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {formatNameCapitals(member.fullName.replace(',', ''))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {member.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {member.phoneNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Eliminar usuario">
                            <IconButton onClick={() => handleOpenModal(paginatedMember[idx])}>
                              <DeleteIcon
                                color="error"
                              >  </DeleteIcon>
                            </IconButton>
                          </Tooltip>
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
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          </>
        )}
      </Card>

      <Dialog
        open={open}
        onClose={handleCloseModal}
      >
        <DialogTitle>Eliminar Miembro AIM</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar al miembro AIM: <b>{localStorage.getItem('memberName')}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteClick} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

Results.propTypes = {
  member: PropTypes.array.isRequired,
  onPageParamsChange: PropTypes.func,
  numberOfResults: PropTypes.number
};

Results.defaultProps = {
  member: [],
  onPageParamsChange: () => { },
  numberOfResults: 0
};

export default Results;
