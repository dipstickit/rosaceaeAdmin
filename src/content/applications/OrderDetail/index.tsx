import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';

import RecentOrders from './RecentOrders';
import { useEffect, useState } from 'react';

function ApplicationsTransactions() {
  const [selectedItemType, setSelectedItemType] = useState<any>(1);
  return (
    <>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader selectedItemType={selectedItemType} setSelectedItemType={setSelectedItemType} />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <RecentOrders selectedItemType={selectedItemType} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ApplicationsTransactions;
