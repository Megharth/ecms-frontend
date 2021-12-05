import { Logout, Search } from "@mui/icons-material";
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
import "../css/Home.css";
import ProductCard from "./ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
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
          <IconButton className="logout-btn" onClick={logout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className="catalogue">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
