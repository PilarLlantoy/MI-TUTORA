import { useState, useEffect, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Button,
  IconButton,
  Tooltip,
  Card,
  Box,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  // Link,
  Divider,
  // List,
  // ListItem,
  // ListItemAvatar,
  // ListItemText,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  // Avatar,
  // useTheme,
  InputAdornment,
  // Pagination,
  // CardActions,
  Typography,
  Grid,
  TextField,
  Zoom
  // styled
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import axios from 'axios';
import axios from 'src/utils/aimAxios';
// import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { formatNameCapitals } from 'src/utils/training';
// import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone';
// import StarIcon from '@mui/icons-material/Star';
// import { SettingsAccessibility } from '@mui/icons-material';
// import associatedData from './associated.json';

// const AvatarInfo = styled(Avatar)(
//   ({ theme }) => `
//       background-color: ${theme.colors.info.lighter};
//       color: ${theme.colors.info.main};
//       width: ${theme.spacing(4)};
//       height: ${theme.spacing(4)};
//       margin-right: ${theme.spacing(1)};
// `
// );

function Results(props) {
  // const theme = useTheme();
  const idCategoryRef = useRef(null);
  const [currQuery, setCurrQuery] = useState("");
  const { t } = useTranslation();
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [subjectName, setSubjectName] = useState("");
  // const [associated] = useState(associatedData);
  // const [associated, setAssociated] = useState([]);
  // const [totalAssociated, setTotalAssociated] = useState(0);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(0); // current page number
  const [limit, setLimit] = useState(5);
  const [idSubject, setIdSubject] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // pagesize
  // const [query, setQuery] = useState('');
  const { enqueueSnackbar } = useSnackbar();


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
    setOpenDeleteModal(false);
  };

  const handleDeleteError = (message) => {
    enqueueSnackbar(`Hubo un error en la eliminación. Error ${message}`,
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
      // let idx = localStorage.getItem('memberId');
      // console.log(idx);
      const idObj = {
        id: idSubject
      }
      // console.log(idx);
      const response = await axios.post("/preference/delete/", idObj);
      // console.log('Server response: ', response.data);
      console.log('Server: ', response);
      handleDeleteSuccess();

      getAssociatedPreference(null, "", 1).then((res) => {
        console.log(res);
        setCourses(res);
        console.log(courses);
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
    setOpenDeleteModal(false);
  }
  const handleOpenModal = (course) => {
    setOpenDeleteModal(true);
    console.log("Open Modal");
    console.log(course);
    setSubjectName(course.subject);
    setIdSubject(course.preferenceId);
    /*
    
    localStorage.setItem('memberId', member.userId);
    localStorage.setItem('memberName', member.fullName);
    let memberId = localStorage.getItem('memberId');
    console.log(memberId);
    */
  }


  const handleCloseModal = () => {
    setOpenDeleteModal(false);
  }

  const handleQueryChange = (event) => {
    event.persist();
    setCurrQuery(event.target.value);
    // setQuery(event.target.value);
    getAssociatedPreference(idCategoryRef.current, event.target.value, 1).then((res) => {
      setCourses(res);
    });
  };

  const getAssociatedPreference = async (categoryId = null, name = "", _page = 1) => {
    console.log("Limit Preference", limit);
    try {
      const response = await axios.post('/preference/query',
        {
          categoryId,
          firstResult: _page,
          maxResults: limit,
          name,
          partnerId: props.user.id
        });
      console.log(response.data);
      setNumberOfResults(response.data.total);
      return response.data.list;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  const handleChangeCategory = (e, value) => {
    idCategoryRef.current = value !== null ? value.categoryId : null;
    getAssociatedPreference(idCategoryRef.current, currQuery, 1).then((res) => {
      setCourses(res);
    });
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
    console.log("newPage: ", newPage);
    const reqObj = {
      "categoryId": idCategoryRef.current,
      "firstResult": newPage + 1,
      "maxResults": limit,
      "name": currQuery,
      "partnerId": props.user.id

    }
    console.log(reqObj);
    getAssociatedPreference(null, "", newPage + 1).then((res) => {
      console.log(res);
      setCourses(res);
      console.log(courses);
    });
  };

  const handleLimitChange = (event) => {
    console.log("Limit ", limit);
    setLimit(parseInt(event.target.value));
    console.log("Limit Change", limit);
    console.log("handleLimitChange");
    const reqObj = {
      "categoryId": idCategoryRef.current,
      "firstResult": page + 1,
      "maxResults": event.target.value,
      "name": currQuery,
      "partnerId": props.user.id
    }
    console.log("Limit Change reqObj: ", reqObj);

    getAssociatedPreference(null, "", page + 1).then((res) => {
      console.log(res);
      setCourses(res);
      console.log(courses);
    });

  };

  /*
    const onPageParamsChange = (reqObj) => {
  
      console.log("onPageParamsChange ", reqObj);
      getAssociatedPreference(null, "", 1).then((res) => {
        console.log(res);
        setCourses(res);
        console.log(courses);
      });
    }
    */

  useEffect(() => {
    // getAssociated();
    console.log(courses);
    console.log("Received numberOfResults: ", numberOfResults);
    console.log("Número de Resultados: ", numberOfResults);
    getAssociatedPreference(null, "", 1).then((res) => {
      console.log(res);
      setCourses(res);
      console.log(courses);
    });

  }, [limit]);

  return (
    <Card>
      <CardHeader title="Cursos" />
      <Divider />
      <Grid container spacing={2} pl={1} pt={1} pb={0}>
        <Grid item xs={3}>
          <Box p={1}>
            <TextField
              value={currQuery}
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
              onChange={(e) => handleQueryChange(e)}
              placeholder={t('Busca tu tema')}
              fullWidth
              variant="outlined"
            />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box p={1}>
            <Autocomplete
              multiple={false}
              disableClearable={false}
              sx={{
                m: 0
              }}
              limitTags={4}
              onChange={(e, value) => handleChangeCategory(e, value)}
              options={props.categories}
              getOptionLabel={(option) => formatNameCapitals(option.name)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  label={t('Filtra por categoría')}
                  placeholder={t('Puedes seleccionar una categoría...')}
                />
              )}
            />
          </Box>
        </Grid>
      </Grid>

      <Divider />

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
            <b>{courses.length}</b> <b>temas</b>
          </Box>
          <TablePagination
            component="div"
            count={numberOfResults}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Box>
        <Divider />
        {courses.length === 0 ? (
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
              No hay temas disponibles
            </Typography>

          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      width="75%"
                      sx={{
                        pl: 5
                      }}> Tema </TableCell>
                    <TableCell width="25%" align="center"> Acciones </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course, idx) => {
                    return (

                      <TableRow
                        hover
                        key={idx}
                        xs={12}
                        md={12}
                        lg={12}

                      >
                        <TableCell
                          width="75%"
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            p={3}
                          >
                            <img
                              src={course.subject_url}
                              alt={course.subject}
                              style={{
                                minWidth: '1rem',
                                minHeight: '1rem',
                                maxWidth: '2.75rem',
                                maxHeight: '2.75rem',
                                objectFit: 'cover',
                                borderRadius: '15%'
                              }}
                            />
                            <Box
                              sx={{
                                pl: '3rem'
                              }}
                            >
                              <Typography
                                noWrap
                                variant="h4"
                                fontSize="1.5rem"
                              >{formatNameCapitals(course.subject)}
                              </Typography>
                              <Typography
                                noWrap
                                color="textSecondary"
                                variant="body2"
                                fontSize="0.8rem"
                                py={0.5}
                              >
                                {formatNameCapitals(course.category)}
                              </Typography>
                              <Typography>
                                {course.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell
                          width="25%"
                          align="center"
                        >
                          <Box
                            md={4}
                            // display="flex"
                            alignItems="center"
                            justifyContent="right"
                          >
                            <Tooltip title="Eliminar tema">
                              <IconButton onClick={() => handleOpenModal(courses[idx])}>
                                <DeleteIcon
                                  color="error"
                                >  </DeleteIcon>
                              </IconButton>
                            </Tooltip>
                          </Box>
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
                count={numberOfResults}
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
      {/*
      <Divider />

      {
        courses != null && courses !== undefined ? <>
          <List disablePadding>
            {courses.length === 0
              ?
              <Typography
                sx={{
                  py: 10
                }}
                variant="h3"
                fontWeight="normal"
                color="text.secondary"
                align="center"
              >
                No se pudo encontrar cursos de la socia
              </Typography>
              : courses.map((a) => (
                <Fragment key={a.id}>
                  <ListItem
                    sx={{
                      display: { xs: 'block', md: 'flex' },
                      py: 3
                    }}
                    key={a.id}
                  >
                    <ListItemText
                      primary={a.subject}
                      primaryTypographyProps={{ variant: 'h3' }}
                      secondary={
                        <>
                          {a.subject || ''}
                          <Box
                            display="flex"
                            alignItems="center"
                            sx={{
                              pt: 1
                            }}
                          >
                            
                          </Box>
                        </>
                      }
                      secondaryTypographyProps={{
                        variant: 'subtitle2',
                        sx: {
                          pt: 1
                        }
                      }}
                    />
                    <Box
                      sx={{
                        my: { xs: 2, md: 0 }
                      }}
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-right"
                    >
                      <Button
                        sx={{
                          mx: 2
                        }}
                        variant="contained"
                        size="large"
                        color="secondary"
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </ListItem>
                  <Divider component="li" />
                </Fragment>
              ))}
          </List>
          <CardActions
            disableSpacing
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Pagination
              size="large"
              count={Math.ceil(courses.length / 2)}
              color="primary"
              page={page}
              onChange={(e, v) => {
                setPage(v);
              }}
            />
          </CardActions>
        </> : <></>
      }
    

    */}
      <Dialog
        open={openDeleteModal}
        onClose={handleCloseModal}
      >
        <DialogTitle>Eliminar Tema de Preferencia</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar el tema <b>{subjectName}</b> de la lista ?
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
    </Card >


  );

};

Results.propTypes = {
  courses: PropTypes.array.isRequired,

};

Results.defaultProps = {
  courses: [],
};
export default Results;
