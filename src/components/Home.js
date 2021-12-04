import React, { useState, useEffect } from "react";

import "../css/Home.css";
import ProductCard from "./ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}product`).then((response) => {
      response.json().then((data) => setProducts(data.products));
    });
  }, []);

  return (
    <div className="home">
      <div className="catalogue">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div>Loading products;</div>
        )}
      </div>
    </div>
  );
};

export default Home;
