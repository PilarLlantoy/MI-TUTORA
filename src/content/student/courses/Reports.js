/* eslint-disable */
import { useState, useCallback } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import certifyAxios from 'src/utils/aimAxios';
import { formatNameCapitals } from 'src/utils/training';

const Reports = ({ userName, clientId, partnerId, partnerName }) => {
  const [open, setOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const { t } = useTranslation();

  /* descomentado para ver el boton */
  /* no tengo idea por que lo comentaron antes,  tengo miedo 🤨 */
  /* aim/student/courses */
  const handleReportOpen = () => {
    setOpen(true);
  };
  
  const handleReportClose = () => {
    setOpen(false);
  };
  
  const handleReportSuccess = useCallback(async () => {
    const reqObj = {
      "clientId": clientId,
      "description": reportReason,
      "partnerId": partnerId
    }

    await certifyAxios.post('/request/complaint/register', reqObj);

    setReportReason("");

    setOpen(false);
  });

  return (
    <>
     {/* Por que comentaron esto?? */}
      <Button
        sx={{
          mt: { xs: 2, sm: 0 },
          color: 'red',
          backgroundColor: 'white',
          borderColor: 'red',
          ':hover': {
            color: 'white',
            background: '#FE7201',
            borderColor: 'white',
          },
        }}
        style={{marginRight: '10px'}}
        size='small'
        onClick={handleReportOpen}
        variant="outlined"
      >
        {t('Denunciar')}
      </Button>

      <Dialog
          fullWidth
          maxWidth="sm"
          open={open}
          onClose={handleReportClose}
      >
        <DialogTitle>
          <Typography
            variant="h3"
            gutterBottom
          >
            {t('Denunciar')}
          </Typography>
        </DialogTitle>

        <DialogContent
          style={{ paddingBottom: "0em" }}
        >
          <Typography
            variant="subtitle2"
            style={{ padding: "1em" }}
            sx={{
              pb: { xs: 1, md: 0 },
              backgroundSize: "auto",
              backgroundColor: "#FFD6D6",
            }}
          >
            <Grid container>
              <Grid item
                xs={1} /* Dentro del container la suma del xs debe ser igual a 12 para que se mantenga en la misma fila */
                alignSelf="center"
                style={{ paddingLeft: "0.5em" }}
                sx={{
                  pb: { xs: 1, md: 0 }
                }}
              >
                <WarningAmberRoundedIcon
                  style={{ color: "#FF7575" }}
                  fontSize="large"
                />
              </Grid>
              <Grid item
                xs={11} /* Dentro del container la suma del xs debe ser igual a 12 para que se mantenga en la misma fila */
                style={{ paddingLeft: "1em" }}
                sx={{
                  pb: { xs: 1, md: 0 }
                }}
              >
                {t('Esta acción bloqueará al usuario y enviará el reporte a un miembro AIM para que pueda revisar el caso y determinar si se procede con la expulsión del usuario denunciado.')}
              </Grid>
            </Grid>
          </Typography>
        </DialogContent>

        <DialogContent
          style={{
            paddingTop: "0em",
            paddingBottom: "0.75em"
          }}
        >
          <Typography variant="subtitle2"
            sx={{
              pb: { xs: 1, md: 0 },
              marginTop: "1em",
              marginBottom: "1.25em"
            }}
          >
            {t('Asociada denunciante: ') + formatNameCapitals(partnerName).replace(',', '')}
          </Typography>
          <Typography variant="subtitle2"
            sx={{
              pb: { xs: 1, md: 0 },
              marginTop: "1em",
              marginBottom: "1.25em"
            }}
          >
            {'Cliente denunciado: ' + formatNameCapitals(userName ? userName : '').replace(',', '')}
          </Typography>
          <Box
            sx={{
              pb: { xs: 1, md: 0 }
            }}
          >
            <b>{t('Cuéntanos lo que sucedió:')}</b>
          </Box>
          <TextField multiline
            sx={{
              width: "100%",
              marginTop: "0.75em"
            }}
            value={reportReason}
            onChange={e => setReportReason(e.target.value)}
            rows={7}
            autoComplete="off"
            variant="outlined"
            placeholder={t('Escriba el motivo de su denuncia...')}
          />
        </DialogContent>

        <DialogActions
          sx={{ justifyContent: "space-around" }}
        >
          <Grid container
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems:"center"
            }}
          >
            <Grid item>
              <Button
                sx={{
                  width: "10%",
                  float: "right",
                  marginRight: "5px",
                  color: 'red',
                  backgroundColor: 'white',
                  borderColor: 'red',
                  ':hover': {
                    color: 'white',
                    background: '#FE7201',
                    borderColor: 'white',
                  },
                }}
                size='small'
                onClick={handleReportClose}
                variant="outlined"
              >
                {t('Cancelar')}
              </Button>
            </Grid>
            <Grid item>
              <Button
                sx={{
                  width: "10%",
                  float: "left",
                  marginLeft: "5px",
                  color: 'blue',
                  backgroundColor: 'white',
                  borderColor: 'blue',
                  ':hover': {
                    color: 'white',
                    background: '#FE7201',
                    borderColor: 'white',
                  },
                }}
                size='small'

                onClick={handleReportSuccess}
                variant="outlined"
              >
                {t('Enviar')}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
};


export default Reports;