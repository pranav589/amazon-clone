import React from 'react';

import Banner from '../../components/Banner/Banner';
import ProductList from '../../components/ProductList/ProductList'
import './ProductsPage.css'

const ProductsPage = ({ products, loadTopProducts, error, loading }) => {
  

  return (
    <div className='home'>
      <Banner />
      <ProductList/>
     </div>
  );
};


export default ProductsPage
