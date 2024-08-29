import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';
import { useNavigate } from 'react-router-dom';

import RecentOrders from './RecentOrders';
import { useEffect, useState } from 'react';
import axios from 'axios';
export interface InvoiceInterface {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  clientName: string;
  clientAddress: string;
  remarks: string;
  invoiceDiscountAmount: number;
  invoiceSubtotal: number;
  gstAmount: number;
  invoiceGrandTotal: number;
}
function InvoiceDashboard() {
  
  const [invoices, setInvoices] = useState<InvoiceInterface[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get('http://localhost:5000/invoice')
        .then((res) => setInvoices(res.data?.data))
        .catch((err) => console.error(err));
    };

    fetchData();
  }, []);

  return (
    <>
      {console.log(invoices)}
      <Helmet>
        <title>Transactions - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
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
            <RecentOrders invoices={invoices} />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default InvoiceDashboard;
