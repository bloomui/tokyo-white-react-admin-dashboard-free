import { Typography, Button, Grid } from '@mui/material';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Router, useRoutes } from 'react-router';
import { useNavigate } from "react-router-dom";

function PageHeader() {
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg'
  };
const  navigate = useNavigate()
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Invoice
        </Typography>
        {/* <Typography variant="subtitle2">
          {user.name}, these are your recent transactions
        </Typography> */}
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={() => {
            navigate("/invoice/new")
          }}
        >
          Create Invoice
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
