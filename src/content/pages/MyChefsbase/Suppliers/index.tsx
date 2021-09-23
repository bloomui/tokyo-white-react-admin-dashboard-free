import { useQuery } from "@apollo/client";
import {
    Box,
    LinearProgress,
  } from "@material-ui/core";
import React, { useState } from "react";
import { LoadingScreen } from "src/components/layout";
import { MenuFilterInput, ProductFilterInput } from "src/globalTypes";
import { useFilterSuppliersQuery } from "./api";
import { TopPartSupplierPage } from "./components/SupplierPageTopPart";
import { SupplierTable } from "./components/SupplierTable";
import { initialSupplierValues } from "./filtersuppliers";
import { AddSupplierDialog } from "./supplierDialogs/AddProductDialog";
  export const SupplierPage = ({
    page,
    setPage,
  }: {
    page: number;
    setPage: (newPage: number) => void;
  }) => {

    const [openAddMenu, setOpenAddSupplier] = useState(false)
    const [ input, setInput] = useState<ProductFilterInput>(initialSupplierValues);
    const { loading, data } = useFilterSuppliersQuery({
        input: input
    })
    
    let content;
    if (loading && !data) content = <LoadingScreen />;
    else if (data) {
      content = (
        <>
        <SupplierTable
        data={data}
        page={page}
        setPage={setPage}
        />
        </>
      );
    }
  
    return (
      <>
      <TopPartSupplierPage 
      setOpenAddSupplier={() => setOpenAddSupplier(true)} 
      setInput={(values) => setInput(values)}/>
          <Box height={3}>{loading && <LinearProgress />}</Box>
        {content}
        <AddSupplierDialog 
                  open={openAddMenu}
                  onClose={() => setOpenAddSupplier(false)}
                  />
      </>
    );
  };