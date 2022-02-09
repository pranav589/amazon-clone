import React, { useContext, useState } from "react";
import { GlobalState } from "../../GlobalState";
import ProductItem from "../Utils/ProductItem/ProductItem";
import Spinner from "../shared/Spinner";
import axios from "axios";
import Filters from "../Filters/Filters";
import LoadMore from "../LoadMore/LoadMore";
import {toast} from 'react-toastify'


function ProductList() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [loading, setLoading] = useState(false);
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const deleteProduct = async (id, public_id) => {
    console.log({ id, public_id });
    try {
      setLoading(true);
      await axios.post(
        `/api/deleteItem`,
        { public_id },
        {
          headers: { Authorization: token },
        }
      );
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });
      setCallback(!callback);
      setLoading(false);
    } catch (err) {
      return toast.error(err.response.data.msg);
    }
  };

  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
      setProducts([...products]);
      setIsCheck(!isCheck);
    });
  };

  const handleDeleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  if (loading)
    return (
      <div>
        <Spinner />
      </div>
    );
  return (
    <>
      <Filters />
      {isAdmin && (
        <div className="delete-all">
          <span>Select All</span>
          <input
            type="checkbox"
            name=""
            id=""
            checked={isCheck}
            onChange={checkAll}
          />
          <button onClick={handleDeleteAll}>Delete All</button>
        </div>
      )}
      <div className="products">
        {products.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
      </div>
      <LoadMore />
      {products.length === 0 && <Spinner />}
    </>
  );
}

export default ProductList;
