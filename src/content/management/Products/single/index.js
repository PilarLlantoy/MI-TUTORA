import { useState, useCallback, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import useRefMounted from 'src/hooks/useRefMounted';

import Footer from 'src/components/Footer';
import axios from 'src/utils/axios';
import PageHeader from './PageHeader';
import ProductBody from './ProductBody';

function ManagementProductSingle() {
  const isMountedRef = useRefMounted();
  const [product, setProduct] = useState(null);

  const { productId } = useParams();

  const getProduct = useCallback(async () => {
    try {
      const response = await axios.get('/api/product', {
        params: {
          productId
        }
      });
      if (isMountedRef.current) {
        setProduct(response.data.product);
      }
    } catch (err) {
      console.error(err);
    }
  }, [productId, isMountedRef]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  if (!product) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Products Management`}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader product={product} />
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
          <ProductBody product={product} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementProductSingle;
