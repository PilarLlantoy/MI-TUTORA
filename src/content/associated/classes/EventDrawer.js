import PropTypes from 'prop-types';
import { setHours, setMinutes, subDays } from 'date-fns';
import _ from 'lodash';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Divider,
  Grid,
  Alert,
  CircularProgress,
  Typography,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar
} from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import { formatNameCapitals } from 'src/utils/training';
import { useDispatch } from './../../../store';
import { updateEvent } from './slice/calendar';


const CardActionsWrapper = styled(Card)(
  ({ theme }) => `
     background: ${theme.colors.alpha.black[5]};
     box-shadow: none;
     margin: 0 ${theme.spacing(3)};
`
);

const getInitialValues = (event, range) => {
  if (event) {
    return _.merge(
      {},
      {
        allDay: false,
        color: '',
        description: '',
        end: setHours(setMinutes(subDays(new Date(), 3), 30), 10),
        start: setHours(setMinutes(subDays(new Date(), 3), 60), 8),
        title: '',
        submit: null
      },
      event
    );
  }

  if (range) {
    return _.merge(
      {},
      {
        allDay: false,
        color: '',
        description: '',
        end: new Date(range.end),
        start: new Date(range.start),
        title: '',
        submit: null
      },
      event
    );
  }

  return {
    allDay: false,
    color: '',
    description: '',
    end: setHours(setMinutes(subDays(new Date(), 1), 35), 20),
    start: setHours(setMinutes(subDays(new Date(), 1), 25), 17),
    title: '',
    submit: null
  };
};

const EventDrawer = ({
  event,
  onCancel,
  range,
  onEditComplete
}) => {
  const isCreating = !event;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <Formik
      initialValues={getInitialValues(event, range)}
      validationSchema={Yup.object().shape({
        allDay: Yup.bool(),
        description: Yup.string().max(5000),
        end: Yup.date().when(
          'start',
          (start, schema) =>
            start &&
            schema.min(start, t('The end date should be after start date'))
        ),
        start: Yup.date(),
        title: Yup.string().max(255).required(t('The title field is required'))
      })}
      onSubmit={async (
        values,
        { resetForm, setErrors, setStatus, setSubmitting }
      ) => {
        try {
          dispatch(updateEvent(event.id,values))

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          onEditComplete();
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
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        touched,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <Box p={3}>
            <Typography variant="h4">
              {isCreating
                ? t('Create new calendar event')
                : t('Detalles de la reunion')}
            </Typography>
          </Box>
          <Divider />
          <Box px={3} py={2}>
            <TextField
              disabled
              error={Boolean(touched.title && errors.title)}
              fullWidth
              helperText={touched.title && errors.title}
              label={t('Clase de:')}
              name="title"
              margin="normal"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.title}
              variant="outlined"
            />
            <Card>
                  <Fragment key={values.id}>
                    <Divider />
                    <ListItem
                      sx={{
                        justifyContent: 'space-between',
                        display: { xs: 'block', sm: 'flex' },
                        py: 2,
                        px: 2.5
                      }}
                    >
                      <ListItemAvatar
                        sx={{
                          minWidth: 'auto',
                          mr: 2,
                          mb: { xs: 2, sm: 0 }
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 42,
                            height: 42
                          }}
                          alt={values.urlPhoto}
                          src={values.urlPhoto}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        sx={{
                          flexGrow: 0,
                          maxWidth: '50%',
                          flexBasis: '50%'
                        }}
                        disableTypography
                        primary={
                          <Typography color="text.primary" variant="h5">
                            Estudiante
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography noWrap variant="subtitle2">
                              {formatNameCapitals(values.personName.replace(',', ''))}
                            </Typography>
                          </>
                        }
                      />
                      <Box pl={0.5} display="flex" flexGrow={1} alignItems="center"/>
                    </ListItem>
                  </Fragment>
            </Card>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  disabled
                  value={values.start}
                  onChange={(date) => setFieldValue('start', date)}
                  label={t('Fecha de inicio')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      name="start"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  disabled
                  value={values.end}
                  onChange={(date) => setFieldValue('end', date)}
                  label={t('Fecha fin')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      name="end"
                    />
                  )}
                />
              </Grid>
            </Grid>
            {Boolean(touched.end && errors.end) && (
              <Alert
                sx={{
                  mt: 2,
                  mb: 1
                }}
                severity="error"
              >
                {errors.end}
              </Alert>
            )}
          </Box>
          <CardActionsWrapper
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'column',
              marginTop: '10px',
              p: 2
            }}
          >
            <Box>
                <Button
                  variant="outlined"
                  sx={{
                    width: "100%",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '15px',
                  }}
                  color="secondary"
                  onClick={onCancel}
                >
                  {t('Regresar')}
                </Button>
              <div>
               <Link href={ `room/${values.reunionUrl}/${values.id}` }>
                <Button
                  variant="contained"
                  type="button"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={isSubmitting}
                  color="primary"
                >
                  Ingresar a reunion
                </Button>
               </Link> 
              

              </div>
            </Box>
          </CardActionsWrapper>
        </form>
      )}
    </Formik>
  );
};

EventDrawer.propTypes = {
  event: PropTypes.object,

  range: PropTypes.object,
  onAddComplete: PropTypes.func,
  onCancel: PropTypes.func,
  onDeleteComplete: PropTypes.func,
  onEditComplete: PropTypes.func
};

EventDrawer.defaultProps = {
  onAddComplete: () => {},
  onCancel: () => {},
  onDeleteComplete: () => {},
  onEditComplete: () => {}
};

export default EventDrawer;
