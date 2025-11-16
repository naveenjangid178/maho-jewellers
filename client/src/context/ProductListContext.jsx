import { createContext, useContext, useState } from "react";

const ProductListContext = createContext();

export const ProductListProvider = ({ children }) => {
  const [products, setProductsForDetail] = useState([]); // store product list globally

  return (
    <ProductListContext.Provider value={{ products, setProductsForDetail }}>
      {children}
    </ProductListContext.Provider>
  );
};

export const useProductList = () => useContext(ProductListContext);
