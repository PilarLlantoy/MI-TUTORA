import { Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

const PageHeader = () => {
  const { t } = useTranslation();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t('Calendario')}
        </Typography>
        <Typography variant="subtitle2">
          {t('Revise las reuniones de esta semana')}
        </Typography>
      </Grid>
    </Grid>
  );
};


export default PageHeader;
