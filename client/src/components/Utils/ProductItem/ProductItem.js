import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductItem.css";
import { GlobalState } from "../../../GlobalState";

import Spinner from "../../shared/Spinner";

function ProductItem({ product, deleteProduct, handleCheck }) {
  const state = useContext(GlobalState);

  const [isAdmin] = state.userAPI.isAdmin;
  const addCart = state.userAPI.addCart;
  const [loading, setLoading] = useState(false);

  if (loading)
    return (
      <div className="product___card">
        <Spinner />
      </div>
    );
  return (
    <div className="product__card">
      {isAdmin && (
        <input
          type="checkbox"
          checked={product.checked}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <Link to={`/detail/${product._id}`}>
        <img src={product.images.url} alt="" />
        <div className="product__box">
          <h2 title={product.title}>{product.title}</h2>
          <span>${product.price}</span>
          <p>{product.description}</p>
        </div>
      </Link>

      <div className="row__btn">
        {isAdmin ? (
          <>
            <Link
              id="btn__buy"
              to="#"
              onClick={() =>
                deleteProduct(product._id, product.images.public_id)
              }
            >
              Delete
            </Link>
            <Link id="btn__view" to={`/edit_product/${product._id}`}>
              Edit
            </Link>
          </>
        ) : (
          <>
            <Link id="btn__buy" to="#" onClick={() => addCart(product)}>
              Buy
            </Link>
            <Link id="btn__view" to={`/detail/${product._id}`}>
              View
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductItem;
