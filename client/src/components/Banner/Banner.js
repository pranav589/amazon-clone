import React from "react";
import banner from "../../assets/Banner.jpg";
import "../../pages/ProductsPage/ProductsPage.css";

const Banner = () => {
  return (
    <div className="banner">
      <img className="banner__image" src={banner} alt="banner" />
    </div>
  );
};

export default Banner;
