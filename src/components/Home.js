import { Add, Logout, Search } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import {
  AppBar,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import ErrorSnackbar from "./ErrorSnackbar";

import "../css/Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}product`).then((response) => {
      response.json().then((data) => {
        setProducts(data.products);
        setFilteredProducts(data.products);
      });
    });
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);

  const searchProducts = () => {
    if (search.length > 0) {
      setFilteredProducts(
        products.filter((product) => product.name.includes(search))
      );
    } else {
      setFilteredProducts(products);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("userType");
    navigate("/");
  };

  const deleteProduct = async (id) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}product/${id}`,
      {
        method: "DELETE",
      }
    );

    const { success } = await response.json();

    if (success) {
      setProducts((oldProducts) => oldProducts.filter(({ _id }) => _id !== id));
      setFilteredProducts((oldProducts) =>
        oldProducts.filter(({ _id }) => _id !== id)
      );
    } else {
      setErrorMsg("Cannot delete product");
      setError(true);
    }
  };

  const updateProduct = (id, updatedProduct) => {
    const callback = (oldProducts) => {
      return oldProducts.map((product) => {
        if (product._id === id) return { ...product, ...updatedProduct };
        else return product;
      });
    };
    setProducts(callback);
    setFilteredProducts(callback);
  };

  return (
    <div className="home">
      <AppBar>
        <Toolbar>
          <Typography variant="body1">E-Commerce website</Typography>
          <Paper className="search-bar">
            <InputBase
              sx={{ ml: 1, flex: 1, width: "500px" }}
              fullWidth
              placeholder="Search products"
              onChange={handleSearch}
              value={search}
              onKeyPress={(e) => {
                if (e.code === "Enter") searchProducts();
              }}
            />
            {search.length > 0 ? (
              <IconButton
                onClick={() => {
                  setSearch("");
                  setFilteredProducts(products);
                }}
              >
                <Close />
              </IconButton>
            ) : (
              <IconButton onClick={searchProducts}>
                <Search />
              </IconButton>
            )}
          </Paper>

          <div className="right-action-btns">
            <IconButton className="action-btn">
              <Add />
            </IconButton>
            <IconButton className="action-btn" onClick={logout}>
              <Logout />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <div className="catalogue">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              deleteProduct={deleteProduct}
              updateProduct={updateProduct}
            />
          ))
        ) : (
          <div>Loading products</div>
        )}
      </div>
      <ErrorSnackbar
        open={error}
        handleClose={() => {
          setError(false);
          setErrorMsg("");
        }}
        message={errorMsg}
      />
    </div>
  );
};

export default Home;
