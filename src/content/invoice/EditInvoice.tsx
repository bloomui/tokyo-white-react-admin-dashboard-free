import { TextField, Box, Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { InvoiceInterface } from '.';

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log('param', id);
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

  const fetchById = async (id: any) => {
    await axios
      .get('http://localhost:5000/invoice/' + id)
      .then((res) => {
        console.log('fetch by id success', res.data.data);
        // if (window) window.location.reload();
        let resData: InvoiceInterface = res.data.data;

        setFormValue(() => ({
          name: resData.clientName,
          address: resData.clientAddress,
          remarks: resData.remarks,
          invoiceDiscountAmount: resData.invoiceDiscountAmount,
          price: 0,
          quantity: 0,
          amount: resData.invoiceGrandTotal,
          gstAmount: resData.gstAmount
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async () => {
    const body = formValue;

    await axios
      .post('http://localhost:5000/invoice/edit/' + id, formValue)
      .then((res) => {
        console.log('edit success', res.data);
        navigate('/invoice');
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

  useEffect(() => {
    if (!id) return;
    fetchById(id);
  }, []);

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
            <p>Edit Invoice</p>
          </div>
          <div className="flex flex-col px-0">
            <TextField id="outlined" label="Invoice Date" defaultValue="" />
            <TextField
              id="outlined"
              label="Client Name"
              value={formValue.name}
              onChange={(e) => {
                handleUpdate('name', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="Client Address"
              value={formValue.address}
              onChange={(e) => {
                handleUpdate('address', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="Remarks"
              value={formValue.remarks}
              onChange={(e) => {
                handleUpdate('remarks', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="quantity"
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
              value={formValue.invoiceDiscountAmount}
              onChange={(e) => {
                handleUpdate('invoiceDiscountAmount', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="Invoice Subtotal"
              type="number"
              value={formValue.amount}
              onChange={(e) => {
                handleUpdate('amount', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="Gst Amount"
              type="number"
              value={formValue.gstAmount}
              onChange={(e) => {
                handleUpdate('gstAmount', e.target.value);
              }}
            />
            <TextField
              id="outlined"
              label="invoice Grand Total"
              value={formValue.amount * (formValue.gstAmount / 100)}
              disabled
            />
          </div>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default EditInvoice;
