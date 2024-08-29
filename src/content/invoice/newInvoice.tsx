import { TextField, Box, Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const NewInvoice = () => {
  const [formValue, setFormValue] = useState({
    name: '',
    address: '',
    remarks: '',
    invoiceDiscountAmount: 0,
    price: 0,
    quantity: 0,
    amount: 0,
    gstAmount: 0
  });
  const handleSubmit = async () => {
    const body = formValue;

    await axios
      .post('http://localhost:5000/invoice/create', formValue)
      .then((res) => {
        console.log('success', res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = (field, value) => {
    let val = { ...formValue };
    val[`${field}`] = value;
    setFormValue(val);
  };

  useEffect(() => {
    console.log('f', formValue);
  }, [formValue]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-1/2 items-center pt-10">
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            width: '100%'
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <p>Create Invoice</p>
          </div>
          <div className="flex flex-col px-0">
            <TextField id="outlined" label="Invoice Date" defaultValue="" />
            <TextField
              id="outlined"
              label="Client Name"
              defaultValue={formValue.name}
              value={formValue.name}
              onChange={(e) => {
                handleUpdate('name', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="Client Address"
              defaultValue={formValue.address}
              value={formValue.address}
              onChange={(e) => {
                handleUpdate('address', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="Remarks"
              defaultValue={formValue.remarks}
              value={formValue.remarks}
              onChange={(e) => {
                handleUpdate('remarks', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="quantity"
              defaultValue={formValue.quantity}
              value={formValue.quantity}
              type="number"
              onChange={(e) => {
                handleUpdate('quantity', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="Invoice DiscountAmount"
              type="number"
              defaultValue={formValue.invoiceDiscountAmount}
              value={formValue.invoiceDiscountAmount}
              onChange={(e) => {
                handleUpdate('invoiceDiscountAmount', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="Invoice Subtotal"
              type="number"
              defaultValue={formValue.amount}
              value={formValue.amount}
              onChange={(e) => {
                handleUpdate('amount', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="Gst Amount"
              type="number"
              defaultValue={formValue.gstAmount}
              value={formValue.gstAmount}
              onChange={(e) => {
                handleUpdate('gstAmount', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="invoice Grand Total"
              defaultValue={formValue.amount * (formValue.gstAmount / 100)}
              disabled
            />
          </div>
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </Box>
      </div>
    </div>
  );
};

export default NewInvoice;
