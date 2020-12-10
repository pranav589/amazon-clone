import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import "../../../styles/detailProduct.css";
import ProductItem from "../utils/productItem/ProductItem";

function DetailProduct() {
  const params = useParams();
  const state = useContext(GlobalState);
  const addCart=state.userAPI.addCart
  const [products] = state.productsAPI.products;
  const [detailProduct, setDetailProduct] = useState([]);
  const [isAdmin] = state.userAPI.isAdmin;

  useEffect(() => {
    if (params) {
      products.forEach((product) => {
        if (product._id === params.id) setDetailProduct(product);
      });
    }
  }, [params, products]);

  //console.log(detailProduct)
  if (detailProduct.length === 0) return null;
  return (
    <>
      <div className="detail">
        <img src={detailProduct.images.url} alt={detailProduct.title} />
        <div className="box__detail">
          <div className="row">
            <h3>{detailProduct.title}</h3>
            <h6>#id: {detailProduct.product_id}</h6>
          </div>
          <span>${detailProduct.price}</span>
          <p>{detailProduct.description}</p>
          <p>{detailProduct.content}</p>
          <p>Sold : {detailProduct.sold}</p>
         {!isAdmin ?<Link to="/cart" className="cart" onClick={()=>addCart(detailProduct)}>
            Buy Now
          </Link> : ""}
        </div>
      </div>

      <div>
        <h2>Related products</h2>
        <div className="products">
          {products.map((product) => {
            return product.category === detailProduct.category ? (
              <ProductItem key={product._id} product={product}/>
            ) : null;
          })}
        </div>
      </div>
    </>
  );
}

export default DetailProduct;
