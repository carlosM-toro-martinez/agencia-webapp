import React, { useState } from "react";
import { Autocomplete, TextField, FormControl } from "@mui/material";

const ProductoAutocompleteComponent = ({
  productosUnicosFiltrados,
  handleProductoChange,
  setCantidad,
  setCantidadPorUnidad,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null); // Controla el valor seleccionado

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);

    // Busca si el código de barras coincide exactamente con algún producto
    const matchedProduct = productosUnicosFiltrados.find(
      (producto) =>
        producto.codigo_barra &&
        producto.codigo_barra.toLowerCase() === newInputValue.toLowerCase()
    );

    if (matchedProduct) {
      handleProductoChange(matchedProduct.id_producto, matchedProduct);
      setCantidad();
      setCantidadPorUnidad();
      setInputValue(""); // Limpia el campo de entrada
      setSelectedValue(null); // Restablece el valor seleccionado
    }
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        options={productosUnicosFiltrados || []}
        getOptionLabel={(producto) => producto.nombre || ""}
        value={selectedValue} // Usa el estado para controlar el valor seleccionado
        onChange={(event, newValue) => {
          if (newValue) {
            handleProductoChange(newValue.id_producto, newValue);
            setCantidad();
            setCantidadPorUnidad();
          }
          setInputValue(""); // Limpia el campo de entrada
          setSelectedValue(null); // Restablece el valor seleccionado
        }}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        isOptionEqualToValue={(option, value) =>
          option?.id_producto === value?.id_producto
        }
        filterOptions={(options, { inputValue }) =>
          options.filter(
            (option) =>
              option.nombre.toLowerCase().includes(inputValue.toLowerCase()) ||
              option.codigo_barra
                ?.toLowerCase()
                .includes(inputValue.toLowerCase())
          )
        }
        renderInput={(params) => <TextField {...params} label="Producto" />}
      />
    </FormControl>
  );
};

export default ProductoAutocompleteComponent;
