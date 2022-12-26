// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Grid,
  Typography
  // CardContent,
} from '@mui/material';


function PageHeader() {

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Clientes
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default PageHeader;
