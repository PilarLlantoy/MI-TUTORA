import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
import { formatNameCapitals } from 'src/utils/training';

import axios from 'src/utils/aimAxios';
// import certifyAxios from 'src/utils/aimAxios';
import * as Yup from 'yup';
import { Formik } from 'formik';
import wait from 'src/utils/wait';
import { styled } from '@mui/material/styles';
import 'react-quill/dist/quill.snow.css';
import useAuth from 'src/hooks/useAuth';
import ReactQuill from 'react-quill';

import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Dialog,
  DialogTitle,
  createFilterOptions,
  DialogContent,
  Box,
  Typography,
  TextField,
  Zoom,
  CircularProgress,
  Autocomplete,
  Button,
  useTheme
} from '@mui/material';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useTranslation } from 'react-i18next';

import PageHeader from './PageHeader';

import Results from './Results';

const EditorWrapper = styled(Box)(
  ({ theme }) => `

    .ql-editor {
      min-height: 100px;
    }

    .ql-toolbar.ql-snow {
      border-top-left-radius: ${theme.general.borderRadius};
      border-top-right-radius: ${theme.general.borderRadius};
    }

    .ql-toolbar.ql-snow,
    .ql-container.ql-snow {
      border-color: ${theme.colors.alpha.black[30]};
    }

    .ql-container.ql-snow {
      border-bottom-left-radius: ${theme.general.borderRadius};
      border-bottom-right-radius: ${theme.general.borderRadius};
    }

    &:hover {
      .ql-toolbar.ql-snow,
      .ql-container.ql-snow {
        border-color: ${theme.colors.alpha.black[50]};
      }
    }
`
);

function ManagementProjects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const idSubjectRef = useRef(null);
  const selectedGradesRef = useRef([]);
  // const descriptionRef = useRef("");
  // const [description, setDescription] = useState("");
  const descriptionRef = useRef();
  const [grades, setGrades] = useState([]);
  const { user } = useAuth();

  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [subjectDisabled, setSubjectDisabled] = useState(true);
  const theme = useTheme();
  // const [numberOfResults, setNumberOfResults] = useState(0);

  /*
  const getCourses = async () => {

    try {
      const response = await axios.get('/courses');
*/
  const getCategories = async () => {
    try {
      const response = await axios.post('/category/query', {
        firstResult: 1,
        maxResults: 10,
        name: ""
      });
      console.log(response.data);
      // setNumberOfResults(response.data.total);
      return response.data.list;
    } catch (err) {
      console.error(err);
      setProjects(categories);
      return null;
    }
  };

  const getSubjects = async (categoryId, name) => {
    try {
      console.log("categoryId: ", categoryId);
      console.log("name: ", name);
      const response = await axios.post('/category/subject/query', {
        categoryId,
        firstResult: 1,
        maxResults: 10,
        name
      });
      // console.log(response.data.list);
      setCourses(response.data.list);
      return response.data.list;



    } catch (err) {
      console.error(err);
      setProjects(subjects);
      return null;
    }
  };

  const getGrades = async () => {
    try {
      const response = await axios.post('/common/classGrade/query');
      console.log(response.data.list);
      return response.data.list;

    } catch (err) {
      console.error(err);
      setGrades(grades);
      return null;
    }
  };

  const handleChangeCategory = (e, value) => {
    setSubjectDisabled(false);
    getSubjects(value.categoryId, "").then((res) => {
      setSubjects(res);
      console.log(res);
    });
  };

  const handleChangeSubject = (e, value) => {
    idSubjectRef.current = value.subjectId;
  };

  const handleChangeGrade = (e, value) => {
    selectedGradesRef.current = value;
  };
  /*
  const handleChangeDesc = (e) => {
    descriptionRef.current = e.target.value;
  };
  */
  useEffect(() => {
    console.log("useEffect");
    getCategories().then((res) => {
      setCategories(res);
    });
    getSubjects(null, "").then((res) => {
      setSubjects(res);
    });
    getGrades().then((res) => {
      setGrades(res);
    });

  }, []);

  const registerAssociatedPreference = async () => {
    const editor = descriptionRef.current.getEditor();
    const unprivilegedEditor = descriptionRef.current.makeUnprivilegedEditor(editor);
    try {
      let desc = unprivilegedEditor.getText().replace(/[\r\n]/gm, '')
      const reqObj = {
        classSubjectId: idSubjectRef.current,
        description: desc,
        gradeIds: selectedGradesRef.current.map((obj) => obj.key),
        keywords: "",
        partnerId: user.id
      }
      const response = await axios.post('/request/subject/register', reqObj);
      console.log(reqObj);
      // console.log(response.data);
      if (response.status === 200) handleCreateProjectSuccess();
      return response.status;
    } catch (err) {
      console.error(err);
      console.log(err.response);
      console.log(err.status);
      console.log(err.message);
      console.log(err.resultCode);
      if (err.resultCode === 1006) {
        console.log(err.response);
        handleCreateSubjectError(err.message);
      } else {
        console.error('Error desconocido');
      }
      return null;
    }
  }

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);
  };

  const handleCreateSubjectError = (message) => {
    enqueueSnackbar(message, {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };



  const handleCreateProjectSuccess = () => {
    enqueueSnackbar(t('Se registro la solicitud satisfactoriamente'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpen(false);
  };

  // Para cambios que pueda enviar los componentes hijos como cambio de limit o página

  /*
  const onPageParamsChange = (reqObj) => {
    console.log("onPageParamsPage called index");
    console.log(reqObj);
    getCategories().then((res) => {
      setCategories(res);
    });
    getSubjects(null, "").then((res) => {
      setSubjects(res);
    });
    getGrades().then((res) => {
      setGrades(res);
    });
  };
*/

  return (
    <>
      <Helmet>
        <title>Projects - Management</title>
      </Helmet>
      <PageTitleWrapper>
        {categories !== [] ? (<PageHeader categories={categories} />) : (<></>)}
      </PageTitleWrapper>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <Results
            // onPageParamsPage={onPageParamsChange}
            // numberOfResults={numberOfResults}
            categories={categories}
            categories2={projects}
            courses={courses}
            user={user}
          />
        </Grid>

        <Grid item xs={12} />

        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            {t('¿Quieres añadir cursos a tu repertorio?')}
          </Grid>
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={handleCreateProjectOpen}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {t('Añade un curso')}
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateProjectClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
          align="center"
        >
          <Typography
            variant="h3"
            gutterBottom
          >
            {t('¿Quieres enseñar algo más?')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Para poder añadir algún tema a tu repertorio, tu solicitud debe ser ' +
              'primero revisada por AIM.')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required(t('The title field is required'))
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              await wait(1000);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              handleCreateProjectSuccess();
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
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    item
                    xs={6}
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Categoría')}</b>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>{t('Tema')}</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={6}
                  >
                    <Autocomplete
                      multiple={false}
                      disableClearable
                      filterOptions={createFilterOptions({
                        limit: 4
                      })}
                      sx={{
                        m: 0
                      }}
                      onChange={(e, value) => handleChangeCategory(e, value)}
                      limitTags={4}
                      options={categories}
                      getOptionLabel={(option) => formatNameCapitals(option.name)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          placeholder={t('Selecciona una categoría...')}
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={6}
                  >
                    <Autocomplete
                      multiple={false}
                      disableClearable
                      filterOptions={createFilterOptions({
                        limit: 10
                      })}
                      sx={{
                        m: 0
                      }}
                      onChange={(e, value) => handleChangeSubject(e, value)}
                      disabled={subjectDisabled}
                      limitTags={10}
                      options={subjects}
                      getOptionLabel={(option) => formatNameCapitals(option.name)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          placeholder={t('Selecciona un tema...')}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} textAlign={{ sm: 'left' }}>
                    <Box
                      pr={3}
                      sx={{
                        pb: { xs: 1, md: 0 }
                      }}
                    >
                      <b>{t('Descripción de lo que vas a enseñar')}</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={12}
                  >
                    <EditorWrapper>
                      <ReactQuill ref={descriptionRef} />
                    </EditorWrapper>
                  </Grid>
                  <Grid
                    item
                    xs={12}
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
                      <b>{t('Grado(s)')}:</b>
                    </Box>
                  </Grid>
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
                    item
                    xs={8}
                  >
                    <Autocomplete
                      multiple
                      filterOptions={createFilterOptions({
                        limit: 4
                      })}
                      sx={{
                        m: 0
                      }}
                      onChange={(e, value) => handleChangeGrade(e, value)}
                      limitTags={4}
                      options={grades}
                      getOptionLabel={(option) => option.value}

                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          placeholder={t('Selecciona los grados...')}
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Button
                      sx={{
                        mr: 2
                      }}
                      color="secondary"
                      size="large"
                      variant="outlined"
                      onClick={handleCreateProjectClose}
                    >
                      {t('Cancelar')}
                    </Button>
                    <Button
                      type="submit"
                      onClick={() => registerAssociatedPreference()}
                      startIcon={
                        isSubmitting ? <CircularProgress size="1rem" /> : null
                      }
                      disabled={Boolean(errors.submit) || isSubmitting}
                      variant="contained"
                      size="large"
                    >
                      {t('Enviar')}
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </form>
          )}
        </Formik>
      </Dialog>
      <Footer />
    </>
  );
}

export default ManagementProjects;
