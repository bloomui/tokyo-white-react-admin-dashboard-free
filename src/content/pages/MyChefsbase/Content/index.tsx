import {
  Box,
  Button,
  Container,
  Grid,
  DialogContent,
  LinearProgress,
  Tab,
  TableContainer,
  Dialog,
  TableHead,
  TableRow,
  TableCell,
  Table,
  DialogTitle,
  CircularProgress,
  Card,
  Tabs,
  TextField,
  MenuItem,
} from "@material-ui/core";
import { Formik } from "formik";
import React, { ReactElement, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router";
import Footer from "src/components/Footer";
import { FormikSelect } from "src/components/form/FormikSelect";
import { CenterInScreen, LoadingScreen } from "src/components/layout";
import { PageHeader } from "src/components/pageHeader/PageHeader";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import { IngredientFilterInput, RecipeFilterInput } from "src/globalTypes";
import { clearAuth } from "src/utilities/auth";
import { H5 } from "../../Components/TextTypes";
import {
  DefaultNutritionOptions,
  NutritionOptionDropDown,
} from "../Components/NutrutitionOptions";
import { useSearchRecipeQuery } from "../Dishes/AddDish/api";
import { useFilterIngredientsQuery } from "../Ingredients/api";
import { TopPartIngredientPage } from "../Ingredients/components/IngredientPageTopPart";
import { IngredientTable } from "../Ingredients/components/IngredientTable";
import { initialIngredientValues } from "../Ingredients/filterIngredients";
import { ItemNutrition } from "../Ingredients/ingredientDialogs";
import {
  useFilterRecipesQuery,
  useGetIngredientsForRecipe,
  useGetNutritionForRecipe,
  useGetRecipeQuery,
} from "../Recipes/api";
import { RecipeTable } from "../Recipes/components/RecipeTable";
import { TopPartRecipePage } from "../Recipes/components/TopPartRecipePage";
import { initialRecipeValues } from "../Recipes/filterrecipes";
import { minimizeUnit } from "../Recipes/recipeDialogs";
import { ingredientsForRecipe_ingredientsForRecipe, ingredientsForRecipe_ingredientsForRecipe_quantity } from "../Recipes/types/ingredientsForRecipe";
import { recipe_recipe_method } from "../Recipes/types/recipe";

export const RecipesAndIngredients = ({
  content,
}: {
  content: ReactElement<any, any>;
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>My Chefsbase</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          title="MyChefsbase haalt het beste uit iedere chef!"
          name=""
          avatar="/static/images/avatars/SB_logo.png"
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid container xs={12}>
            <Grid xs={3}></Grid>
            <Grid xs={3}>
              <Button onClick={() => navigate("/mychefsbase/recipes")}>
                <Tab label={`Recepten`} />
              </Button>
            </Grid>
            <Grid xs={3}>
              <Button onClick={() => navigate("/mychefsbase/ingredients")}>
                <Tab label={`Ingrediënten`} />
              </Button>
            </Grid>
            <Grid xs={3}></Grid>
            {content}
          </Grid>
          <Grid item lg={8} xs={12}>
            <Button
              onClick={() => {
                clearAuth();
                navigate(`/`);
              }}
            >
              Log Out
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export const RecipeContent = () => {
  const [page, setPage] = useState<number>(0);

  const [input, setInput] = useState<RecipeFilterInput>(initialRecipeValues);

  const { loading, data } = useFilterRecipesQuery({
    input: input,
    page: page,
  });

  let content;
  if (loading && !data) content = <LoadingScreen />;
  else if (data) {
    content = (
      <>
        <RecipeTable data={data} page={page} setPage={setPage} />
      </>
    );
  }

  return (
    <>
      <Grid container xs={12}>
        <Grid xs={12}>
          <TopPartRecipePage setInput={(values) => setInput(values)} />
          <Box height={3}>{loading && <LinearProgress />}</Box>
          <Grid xs={12}>{content}</Grid>{" "}
        </Grid>
      </Grid>
    </>
  );
};

export const IngredientContent = () => {
  const [input, setInput] = useState<IngredientFilterInput>(
    initialIngredientValues
  );
  const [page, setPage] = useState<number>(0);

  const { loading, data } = useFilterIngredientsQuery({
    page: page,
    input: input,
  });

  let content;
  if (loading && !data) content = <LoadingScreen />;
  else if (data) {
    content = (
      <>
        <IngredientTable data={data} page={page} setPage={setPage} />
      </>
    );
  }

  return (
    <>
      <Grid container xs={12}>
        <Grid xs={12}>
          <TopPartIngredientPage setInput={(values) => setInput(values)} />
          <Box height={3}>{loading && <LinearProgress />}</Box>
          <Grid xs={12}>{content}</Grid>{" "}
        </Grid>
      </Grid>
    </>
  );
};

export const DialogHere = ({
  unitHere,
  setId,
  id,
  open,
  onClose,
}: {
  unitHere: string;
  id: string;
  setId: () => void;
  open: boolean;
  onClose: () => void;
}) => {
  const [unit, setUnitHere] = useState<string>(unitHere);
  const [quantity, setQuantityHere] = useState<number>(100);
  const [nutritionsToDisplay, setNutritionsToDisplay] = useState<string[]>(
    DefaultNutritionOptions
  );
  const initialValues = {
    quantity: quantity,
    unit: unitHere,
  };
  const [value, setValue] = useState(0);
  const { data, loading, error } = useGetRecipeQuery({
    id: id,
    onCompleted: (recipe) =>
      setUnitHere(minimizeUnit(recipe.recipe.quantity.unit)),
  });
  const {
    data: data2,
    loading: loading2,
    error: error2,
    refetch: refetch2,
  } = useGetIngredientsForRecipe({
    onCompleted: (values) => {},
    id: id,
    quantity: quantity,
    unit: unit,
  });

  if (loading)
    return (
      <CenterInScreen>
        <Dialog open={true} onClose={onClose}>
          <CircularProgress />
        </Dialog>
      </CenterInScreen>
    );
  if (error) return <CircularProgress />;
  if (loading2)
    return (
      <CenterInScreen>
        <Dialog open={true} onClose={onClose}>
          <CircularProgress />
        </Dialog>
      </CenterInScreen>
    );
  if (error2) return <CircularProgress />;

  let content;

  switch (value) {
    case 0:
      content = <IngredientsTab ingredients={data2.ingredientsForRecipe} />;
      break;

    case 1:
      content = <MethodsTab method={data.recipe.method} />;
      break;
    default:
      content = (
        <NutritionTab id={data.recipe.id} unit={unit} quantity={quantity} />
      );
      break;
  }

  return (
    <>
      <CenterInScreen>
        <Dialog open={open} onClose={onClose}>
          {data && data.recipe && (
            <>
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                  setQuantityHere(values.quantity);
                  setUnitHere(values.unit);
                  refetch2({
                    quantity: values.quantity,
                    unit: values.unit,
                  });
                }}
              >
                {({ setFieldValue, submitForm }) => {
                  return (
                    <>
                      <Grid xs={12}>
                        <H5 title="Toon hoeveelheid per:" />
                        <TextField
                          fullWidth
                          placeholder={String(quantity)}
                          onChange={(e) =>
                            setFieldValue("quantity", Number(e.target.value))
                          }
                        />
                      </Grid>
                      <Grid xs={12}>
                        <FormikSelect name={"unit"}>
                          {getUnitsForUnit(unit).map((u) => (
                            <MenuItem key={u} value={u}>
                              {u}
                            </MenuItem>
                          ))}
                        </FormikSelect>
                      </Grid>
                      <Grid xs={12}>
                        <Button fullWidth onClick={() => submitForm()}>
                          Pas toe
                        </Button>
                      </Grid>
                    </>
                  );
                }}
              </Formik>
              <DialogTitle>
                <Tabs
                  value={value}
                  onChange={(e, newValue) => setValue(newValue as number)}
                >
                  <Tab label={`Ingredienten`} />
                  <Tab label={`Methode`} />
                  <Tab label={`Voedingswaaarden`} />
                </Tabs>
              </DialogTitle>
              {content}
            </>
          )}
        </Dialog>
      </CenterInScreen>
    </>
  );
};

export const IngredientsTab = ({
  ingredients,
}: {
  ingredients: ingredientsForRecipe_ingredientsForRecipe[];
}) => {
  return (
    <DialogContent>
      <Card>
        <Grid container xs={12}>
          <Grid xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <H5 title="Ingredienten" />
                  </TableRow>
                </TableHead>
                {ingredients.map((ingredient) => {
                  const quantity = DisplayQuantity(ingredient.quantity);
                  return (
                    <TableRow>
                      <TableCell>{ingredient.ingredient.name}</TableCell>
                      <TableCell>{quantity.quantity}</TableCell>
                      <TableCell>{quantity.unit}</TableCell>
                    </TableRow>
                  );
                })}
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Card>
    </DialogContent>
  );
};

export const MethodsTab = ({ method }: { method: recipe_recipe_method[] }) => {
  return (
    <DialogContent>
      <Card>
        <Grid container xs={12}>
          <Grid xs={12}>
            <H5 title="Methode" />
            {method.map((stepToMethod) => (
              <Grid container xs={12}>
                <Grid xs={2}>{stepToMethod.step}</Grid>
                <Grid xs={10}>{stepToMethod.method}</Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Card>
    </DialogContent>
  );
};

export const NutritionTab = ({
  id,
  quantity,
  unit,
}: {
  id: string;
  quantity: number;
  unit: string;
}) => {
  const [nutritionsToDisplay, setNutritionsToDisplay] = useState<string[]>(
    DefaultNutritionOptions
  );
  const { data, loading, error, refetch } = useGetNutritionForRecipe({
    id: id,
    quantity: quantity,
    unit: unit,
  });

  if (loading) return <CircularProgress />;
  if (error) return <CircularProgress />;

  return (
    <DialogContent>
      <Card>
        <Grid container xs={12}>
          <Grid xs={12}>
            <NutritionOptionDropDown
              setFieldValue={(selected) => setNutritionsToDisplay(selected)}
            />
          </Grid>
          <Grid container xs={12}>
            <Grid xs={6}>
              <ItemNutrition
                nutritionsToDisplay={nutritionsToDisplay}
                title="Voedingswaarde"
                item={data.nutritionForRecipe}
              />
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </DialogContent>
  );
};

export const getUnitsForUnit = (u: string): string[] => {
  var result;
  switch (u) {
    case "milligram":
      result = ["milligram", "gram", "kg"];
      break;
    case "gram":
      result = ["milligram", "gram", "kg"];
      break;
    case "kg":
      result = ["milligram", "gram", "kg"];
      break;
    case "millilter":
      result = ["millilter", "liter"];
      break;
    case "liter":
      result = ["millilter", "liter"];
      break;
    default:
      result = ["stuk(s)", "person(en)"];
  }

  return result;
};

const DisplayQuantity = (
  quantity: ingredientsForRecipe_ingredientsForRecipe_quantity
): ingredientsForRecipe_ingredientsForRecipe_quantity => {
  var result;
  switch (true) {
    case quantity.unit == "kg" && quantity.quantity < 0.000001:
      result = { quantity: quantity.quantity * 1000000, unit: "milligram" };
      break;
    case quantity.unit == "kg" &&
      quantity.quantity < 1 &&
      quantity.quantity > 0.001:
      result = { quantity: quantity.quantity * 1000, unit: "gram" };
      break;
    case quantity.unit == "gram" && quantity.quantity > 1000:
      result = { quantity: quantity.quantity / 1000, unit: "kg" };
      break;
    case quantity.unit == "gram" && quantity.quantity < 1:
      result = { quantity: quantity.quantity * 1000, unit: "milligram" };
      break;
    case quantity.unit == "milligram" && quantity.quantity > 1000000:
      result = { quantity: quantity.quantity / 1000000, unit: "kg" };
      break;
    case quantity.unit == "milligram" &&
      quantity.quantity > 1000 &&
      quantity.quantity < 1000000:
      result = { quantity: quantity.quantity / 1000, unit: "gram" };
      break;
    case quantity.unit == "liter" && quantity.quantity < 1000:
      result = { quantity: quantity.quantity * 1000, unit: "milliliter" };
      break;
    case quantity.unit == "milliliter" && quantity.quantity > 1000:
      result = { quantity: quantity.quantity / 1000, unit: "liter" };
      break;
    default:
      result = { quantity: quantity.quantity, unit: quantity.unit };
  }

  return result;
};
