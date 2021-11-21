import { Grid, Button, CardActions, Collapse, CardContent, Card } from "@material-ui/core";
import { Formik } from "formik";
import React from "react";
import { FaFilter } from "react-icons/fa";
import { IngredientFilterInput, ProductFilterInput, RecipeFilterInput } from "src/globalTypes";
import { AutoSubmitToken, ExpandMore } from "../../Menus/filtermenus";
import { Dishes } from "../../Menus/filtermenus/components/dishes";
import { Ingredients } from "../../Menus/filtermenus/components/ingredients";
import { Menus } from "../../Menus/filtermenus/components/menus";
import { PriceRange, Prices } from "../../Menus/filtermenus/components/prices";
import { Brands } from "../../Menus/filtermenus/components/seasons";
import { Rating1 } from "../../Menus/filtermenus/components/rating";
import { Recipes } from "../../Menus/filtermenus/components/recipes";
import { Search } from "../../Menus/filtermenus/components/search";
import { Strings } from "../../Menus/filtermenus/components/strings";
import { Suppliers } from "../../Menus/filtermenus/components/suppliers";
import { Types } from "../../Menus/filtermenus/components/types";
import { initialRecipeValues } from "../../Recipes/filterrecipes";
import { Products_suppliers, Products_dishes, Products_menus, Products_recipes, Products_ingredients } from "../types/Products";
import {useNavigate} from 'react-router-dom';


export type ProductFilterFormInput = {
    dishes: string[],
    suppliers: string[],
    recipes: string[],
    ingredients: string[],
    rating: string,
    menus: string[],
    name: string,
    brands: string[],
    origins: string[],
    maxPrice: string,
    minPrice: string,
}

export const mapFormToInput = (form: ProductFilterFormInput) => {
  const mapped: ProductFilterInput = {
    dishes: form.dishes,
    suppliers: form.suppliers,
    recipes: form.recipes,
    ingredients: form.ingredients,
    rating: Number(form.rating),
    menus: form.menus,
    name: form.name,
    brands: form.brands,
    origins: form.origins,
    maxPrice: Number(form.maxPrice),
    minPrice: Number(form.minPrice),
  }
  return mapped
}

export const initialProductValues: ProductFilterFormInput = {
    dishes: [],
    suppliers: [],
    recipes: [],
    ingredients: [],
    rating: '',
    menus: [],
    name: '',
    brands: [],
    origins: [],
    maxPrice: '1000',
    minPrice: '',
  }
  
  export const ProductFilter = ({
    setOpenAddProduct,
    onClose,
    ingredients,
    origins,
    brands,
    suppliers,
    dishes,
    menus,
    recipes,
    onChange,
  }: {
    setOpenAddProduct: () => void;
    onClose: () => void;
    origins: string[] | null;
    brands: string[] | null;
    suppliers: Products_suppliers[] | null;
    dishes: Products_dishes[] | null;
    menus: Products_menus[] | null;
    recipes: Products_recipes[] | null;
    ingredients: Products_ingredients[] | null;
    onChange: (values: ProductFilterFormInput) => void;
  }) => {

    const [ openFilterInputDialog, setOpenFilterInputDialog] = React.useState(false)
    const navigate = useNavigate()

    return (
      <Card>
        <Formik
        initialValues={initialProductValues}
        onSubmit={(values) => {
         onChange(values)
        }}
        >
        {({ setFieldValue, submitForm }) => {
          return (
            <>
           <Grid container xs={12}>
            <CardActions disableSpacing>
            <Grid key={0} item>
           <Search placeholder="Zoek product" setFieldValue={setFieldValue}/>
           </Grid>
        <Grid key={1} item>
            <ExpandMore
          expand={openFilterInputDialog}
          onClick={() => setOpenFilterInputDialog(!openFilterInputDialog)}
          aria-expanded={openFilterInputDialog}
          aria-label="Geavanceerd zoeken"
        >
          <FaFilter/>
        </ExpandMore>
        </Grid>
        <Grid key={2} item>
        <Button fullWidth color="secondary" variant="contained" onClick={() => navigate("/mychefsbase/addproduct")}>
                      <span> Nieuw product</span>
                  </Button>
        </Grid>
      </CardActions>
      </Grid>
      <Collapse in={openFilterInputDialog} timeout="auto" unmountOnExit>
        <CardContent>   
                  <Grid container spacing={2} xs={12}>
             <Grid item xs={3}>
           <Rating1 
           updateField="rating"
           setFieldValue={setFieldValue}/>
           </Grid>
           <Grid key={2} item xs={3}>
              <Suppliers 
              suppliers={suppliers}
              setFieldValue={setFieldValue} />
          </Grid>
          <Grid key={3} item xs={3}>
            <Ingredients 
            ingredients={ingredients}
            setFieldValue={setFieldValue} />
            </Grid>
            <Grid key={4} item xs={3}>
            <Recipes 
            recipes={recipes}
            setFieldValue={setFieldValue} />
            </Grid>
            <Grid key={5} item xs={3}>
            <Dishes 
            dishes={dishes}
            setFieldValue={setFieldValue} />
            </Grid>
            <Grid key={6} item xs={3}>
            <Menus 
            menus={menus}
            setFieldValue={setFieldValue} />
            </Grid>
            <Grid key={7} item xs={3}>
            <Brands
            brands={brands}
            setFieldValue={setFieldValue} />
            </Grid>
            <Grid key={7} item xs={3}>
            <Strings
            title="herkomst"
            input="origins" 
            strings={origins}
            setFieldValue={setFieldValue} />
            </Grid>
            <Grid key={7} item xs={3}>
            <PriceRange
            setFieldValue={setFieldValue} />
            </Grid>
            </Grid>
              </CardContent>
              </Collapse>
              <AutoSubmitToken />
              </>
          )
        }}
      </Formik>
      </Card>
          )
        }