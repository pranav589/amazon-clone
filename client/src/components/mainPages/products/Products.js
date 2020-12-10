import React, { useEffect } from 'react';

import Banner from './Banner';
import ProductList from './ProductList'
import '../../../styles/Products.css'

const Products = ({ products, loadTopProducts, error, loading }) => {
  

  return (
    <div className='home'>
      <Banner />
      <ProductList/>
     </div>
  );
};


export default Products
