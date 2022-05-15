import { Button, TextField, TableBody, Container, Grid, Paper, Table, TableContainer, TableHead, TableRow, TableCell, Dialog, DialogContent, DialogTitle, CircularProgress, IconButton } from "@material-ui/core"
import { Formik } from "formik"
import React from "react"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router"
import Footer from "src/components/Footer"
import { FormField } from "src/components/form/FormField"
import { PageHeader } from "src/components/pageHeader/PageHeader"
import PageTitleWrapper from "src/components/PageTitleWrapper"
import { clearAuth } from "src/utilities/auth"
import { composeValidators, required } from "src/utilities/formikValidators"
import { H5 } from "../Components/TextTypes"
import { IngredientSelector } from "../MyChefsbase/Content/Components/AddRecipe/Components/Utils/IngredientSelector"
import { IngredientIdsForm, IngredientNamesForm, IngredientsForm } from "../MyChefsbase/Recipes/AddRecipe"
import { useAddToInventory, useInventoryQuery } from "./api"
import { addToInventoryVariables } from "./types/addToInventory"
import { listInventory_listInventory } from "./types/listInventory"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { InventoryInput } from "src/globalTypes"

export const InventoryPage = () => {
    const navigate = useNavigate()
    const { data, loading, error } = useInventoryQuery()

    if (loading) return <CircularProgress/>

    if (error) return <CircularProgress/>
    
    
    
    return (
        <>
      <Helmet>
        <title>My Chefsbase</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
        title="Inventaris"
        name=""
        avatar='/static/images/avatars/SB_logo.png' />
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
         <Content ingredients={data.listInventory}/>
          </Grid>
          <Grid item lg={8} xs={12}>
            <Button onClick={() => {
              clearAuth();
              navigate(`/`)
            }

            }>Log Out</Button>         
            </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
    )
}

const Content  = ({ingredients}: {ingredients: listInventory_listInventory[]}) => {

    const [open, setOpen] = useState(false)
    const [openInventory, setOpenInventory] = useState(false)
    const [inv, setInv] = useState<listInventory_listInventory>()
    return (
        <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell><H5 title="Ingredient"/></TableCell>
                    <TableCell><H5 title="Hoeveelheid"/></TableCell>
                    <TableCell><H5 title="Bestel"/></TableCell>
                    </TableRow>
            </TableHead>
            <TableBody>
                {ingredients && ingredients.map((inventory) => (
                    <TableRow>
                        <TableCell align="center">{inventory.ingrName}</TableCell>
                        <TableCell align="center">
                            <TextField 
                            size="small"
                            style={{maxWidth: '100px'}}
                            placeholder={String(inventory.quantity.quantity)} />
                            {inventory.quantity.unit}
                            </TableCell>
                        <TableCell align="center"><Button onClick={() => {
                            setOpen(true);
                            setInv(inventory)
                            } 
                        }
                            variant="outlined">Bijbestellen</Button></TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <Order inventory={inv} open={open} onClose={() => setOpen(false)}/>
            <AddToInventory open={openInventory} onClose={() => setOpenInventory(false)}/>
        </Table>
        <Button fullWidth onClick={() => setOpenInventory(true)} variant="outlined">Ingredienten toevoegen</Button>
        </TableContainer>
    )
}

const Row = ({ingredientForm, setFieldValue, input, index}: {ingredientForm: IngredientIdsForm; setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void ; input: InventoryInput; index: number}) => {
    const [openCollapse, setOpenCollapse] = React.useState(false);
    return (
        <>
<Grid xs={10}>
                            <IngredientSelector
                            placeholder={`values.inventoryInput.${index}.ingredientName`}
                            form={ingredientForm}
                            index={index}
                            field={`inventoryInput`}
                            setFieldValue={setFieldValue}
                          />
                          </Grid>
                          <Grid xs={2}><IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => setOpenCollapse(!openCollapse)}
                        >
                          {openCollapse ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton></Grid>
                        {openCollapse && <Grid xs={12}></Grid> }
                        </>
                        )
}
const AddToInventory = ({open, onClose}: {open: boolean; onClose:  () => void;}) => {


    const form: addToInventoryVariables = {
        inventoryInput: [{
            ingrId: '',
            products: [{
                id: '',
                q: 0,
                unit: '',
            }]
        }]
    }
    const ingredientForm: IngredientIdsForm = {
        id: '',
        quantity: '',
        unit: ''
    }

    const { addToInventory, loading, error } = useAddToInventory({
        onCompleted: () => {
          window.location.reload();
        },
      });

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
            <Formik
              initialValues={form}
              onSubmit={(values) => {
                addToInventory({
                  variables: {
                    inventoryInput : values.inventoryInput
                }
            });
              }}>
              {({ values, handleChange, submitForm, setFieldValue }) => {
                return (
                  <>
                    <Grid container xs={12}>
                    <Grid xs={12}><H5 title={`Voeg ingredienten toe`}/></Grid>
                            <Grid xs={2}><H5 title="Ingredient:"/></Grid>
                            <Grid xs={2}><H5 title="Product:"/></Grid>
                            <Grid xs={2}><H5 title="Hoeveelheid:"/></Grid>
                            <Grid xs={2}><H5 title="Prijs:"/></Grid>
                            <Grid xs={2}><H5 title="Geldig tot:"/></Grid>
                            <Grid xs={2}></Grid>
                        {values.inventoryInput.map((input, index) => {
                            <Grid xs={12}>
                            <Row setFieldValue={setFieldValue} ingredientForm={ingredientForm} input={input} index={index}/>
                            </Grid>
                        }
                        )}
                </Grid>
                  </>
                )
              }
            }
            </Formik>
            </DialogTitle>
            </Dialog>
            )
        }
               

const Order = ({inventory, open, onClose}: {inventory: listInventory_listInventory, open: boolean, onClose: () => void}) => {
    const a = '';
    const [quantity, setQuantity] = useState('0')

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <H5 title={`Bestel ${inventory ? inventory.ingrName: a} bij`}/>
            </DialogTitle>
            <DialogContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><H5 title="Bestel bij:"/></TableCell>
                            <TableCell><H5 title="Prijs per hoeveelheid:"/></TableCell>
                            <TableCell><H5 title="Aantal:"/></TableCell>
                            </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventory && inventory.products && inventory.products.map((option) => (
                            <TableRow>
                        <TableCell align="center">{option.name}</TableCell> 
                        <TableCell align="center"> <Grid>{`€${((Number(option.quantity) / Number(option.quantity) ) * option.price).toFixed(2)}`} per </Grid>
                        <Grid>{option.quantity.quantity} {option.quantity.unit}</Grid></TableCell> 
                        <TableCell align="center">
                        <TextField 
                            size="small"
                            style={{maxWidth: '100px'}}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder={String(quantity)} />
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button fullWidth variant="outlined">Bestellen</Button>
            </DialogContent>
        </Dialog>
    )
}