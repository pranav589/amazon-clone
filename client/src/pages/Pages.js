import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import NotFound from "../components/Utils/NotFound/NotFound";
import { GlobalState } from "../GlobalState";

import LoginPage from "./LoginPage/LoginPage";
import SignupPage from "./SignupPage/SignupPage";
import CartPage from "./CartPage/CartPage";
import CategoriesPage from "./CategoriesPage/CategoriesPage";
import CreateProductPage from "./CreateProductPage/CreateProductPage";
import DetailProductPage from "./DetailProductPage/DetailProductPage";
import OrderHistoryPage from "./OrderHistoryPage/OrderHistoryPage";
import OrderHistoryDetailsPage from "./OrderHistoryDetailsPage/OrderHistoryDetailsPage";
import ProductsPage from "./ProductsPage/ProductsPage";

function Pages() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  return (
    <Routes>
      <Route path="/" element={<ProductsPage />} />
      <Route path="/detail/:id" element={<DetailProductPage />} />
      <Route
        path="/login"
        element={isLogged ? <ProductsPage /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isLogged ? <ProductsPage /> : <SignupPage />}
      />
      <Route
        path="/history"
        element={isLogged ? <OrderHistoryPage /> : <NotFound />}
      />
      <Route
        path="/history/:id"
        element={isLogged ? <OrderHistoryDetailsPage /> : <NotFound />}
      />
      <Route
        path="/category"
        element={isAdmin ? <CategoriesPage /> : <NotFound />}
      />
      <Route
        path="/create_product"
        element={isAdmin ? <CreateProductPage /> : <NotFound />}
      />
      <Route
        path="/edit_product/:id"
        element={isAdmin ? <CreateProductPage /> : <NotFound />}
      />
      <Route path="/cart" element={<CartPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Pages;
