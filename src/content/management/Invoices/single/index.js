import { useState, useCallback, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import useRefMounted from 'src/hooks/useRefMounted';
import axios from 'src/utils/axios';

import InvoiceBody from './InvoiceBody';
import PageHeader from './PageHeader';

function ManagementInvoicesView() {
  const isMountedRef = useRefMounted();
  const [invoice, setInvoice] = useState(null);

  const { invoiceId } = useParams();

  const getInvoice = useCallback(async () => {
    try {
      const response = await axios.get('/api/invoice', {
        params: {
          invoiceId
        }
      });
      if (isMountedRef.current) {
        setInvoice(response.data.invoice);
      }
    } catch (err) {
      console.error(err);
    }
  }, [invoiceId, isMountedRef]);

  useEffect(() => {
    getInvoice();
  }, [getInvoice]);

  if (!invoice) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Invoice Details - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader invoice={invoice} />
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
          <InvoiceBody invoice={invoice} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementInvoicesView;
