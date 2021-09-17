import { Button, Dialog, DialogContent, Grid } from "@material-ui/core";
import React from "react";
import { KitchenType } from "src/globalTypes";
import { useDelete } from "../../api";

  export const AreYouSureDelete = ({
    id,
    kitchenType,
    open,
    onClose,
  }: {
    id: string;
    kitchenType: KitchenType;
    open: boolean;
    onClose: () => void;
  }) => {
    const {remove, error, loading} = useDelete({
      onCompleted: () => {}
    });
    return (
      <Dialog open={open}>
        <DialogContent>
          Weet u zeker dat u dit item wilt verwijderen?
        </DialogContent>
        <Grid container xs={12}>
          <Grid item xs={6}>
          <Button
          onClick={() => remove({
            variables: {
              id: id,
              kitchenType: kitchenType
            }
          })}>
          Ja
        </Button>
          </Grid>
          <Grid item xs={6}>
          <Button 
          onClick={onClose}>
          Nee, ga terug
        </Button>
          </Grid>
        </Grid>
      </Dialog>
    )
  }