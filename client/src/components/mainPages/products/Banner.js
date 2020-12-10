import React from 'react';

import banner from '../../../assets/Banner.jpg';

import '../../../styles/Products.css'
const Banner = () => {
  return (
    <div className='banner'>
      <img className='banner__image' src={banner} alt='banner' />
    </div>
  );
};

export default Banner;